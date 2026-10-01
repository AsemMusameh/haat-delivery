const DEFAULT_PASSWORD = "123456789";
const SESSION_DAYS = 30;

const database = () => {
  const runtime = (globalThis as typeof globalThis & { __HAAT_WORKER_ENV__?: { DB?: D1Database } }).__HAAT_WORKER_ENV__;
  if (!runtime?.DB) throw new Error("ACCOUNT_DB_UNAVAILABLE");
  return runtime.DB;
};

const bytesToBase64 = (bytes: Uint8Array) => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
};

const base64ToBytes = (value: string) => {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const digest = async (value: string) => bytesToBase64(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))));

const passwordHash = async (password: string, salt: Uint8Array) => {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const stableSalt = Uint8Array.from(salt);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: stableSalt.buffer, iterations: 120_000 }, key, 256);
  return bytesToBase64(new Uint8Array(bits));
};

const safeEqual = (left: string, right: string) => {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
};

export async function ensureAccountStore() {
  const db = database();
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS portal_credentials (
      user_id TEXT PRIMARY KEY,password_hash TEXT NOT NULL,salt TEXT NOT NULL,updated_at TEXT NOT NULL)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS portal_sessions (
      token_hash TEXT PRIMARY KEY,user_id TEXT NOT NULL,expires_at TEXT NOT NULL,created_at TEXT NOT NULL)`),
    db.prepare("CREATE INDEX IF NOT EXISTS portal_sessions_user_idx ON portal_sessions (user_id, expires_at)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS portal_profiles (
      user_id TEXT PRIMARY KEY,phone TEXT,updated_at TEXT NOT NULL)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS portal_user_permissions (
      user_id TEXT NOT NULL,permission_key TEXT NOT NULL,allowed INTEGER NOT NULL,updated_at TEXT NOT NULL,
      PRIMARY KEY (user_id,permission_key))`),
    db.prepare("CREATE INDEX IF NOT EXISTS portal_user_permissions_user_idx ON portal_user_permissions (user_id)"),
  ]);
  await db.prepare("DELETE FROM portal_sessions WHERE expires_at < ?").bind(new Date().toISOString()).run();
}

export async function verifyPassword(userId: string, password: string) {
  await ensureAccountStore();
  const credential = await database().prepare("SELECT password_hash passwordHash,salt FROM portal_credentials WHERE user_id=?").bind(userId).first<{ passwordHash: string; salt: string }>();
  if (!credential) return password === DEFAULT_PASSWORD;
  return safeEqual(await passwordHash(password, base64ToBytes(credential.salt)), credential.passwordHash);
}

export async function createSession(userId: string) {
  await ensureAccountStore();
  const tokenBytes = crypto.getRandomValues(new Uint8Array(32));
  const token = `${crypto.randomUUID()}.${bytesToBase64(tokenBytes)}`;
  const tokenHash = await digest(token);
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + SESSION_DAYS * 86_400_000);
  await database().prepare("INSERT INTO portal_sessions (token_hash,user_id,expires_at,created_at) VALUES (?,?,?,?)").bind(tokenHash,userId,expiresAt.toISOString(),createdAt.toISOString()).run();
  return token;
}

export async function sessionUser(token?: string | null) {
  if (!token) return null;
  await ensureAccountStore();
  const row = await database().prepare("SELECT user_id userId FROM portal_sessions WHERE token_hash=? AND expires_at>=?").bind(await digest(token),new Date().toISOString()).first<{ userId: string }>();
  return row?.userId ?? null;
}

export async function changePassword(userId: string, password: string) {
  await ensureAccountStore();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await passwordHash(password, salt);
  const db = database();
  await db.batch([
    db.prepare(`INSERT INTO portal_credentials (user_id,password_hash,salt,updated_at) VALUES (?,?,?,?)
      ON CONFLICT(user_id) DO UPDATE SET password_hash=excluded.password_hash,salt=excluded.salt,updated_at=excluded.updated_at`).bind(userId,hash,bytesToBase64(salt),new Date().toISOString()),
    db.prepare("DELETE FROM portal_sessions WHERE user_id=?").bind(userId),
  ]);
}

export async function revokeSession(token?: string | null) {
  if (!token) return;
  await ensureAccountStore();
  await database().prepare("DELETE FROM portal_sessions WHERE token_hash=?").bind(await digest(token)).run();
}

export async function getPhone(userId: string) {
  await ensureAccountStore();
  const row = await database().prepare("SELECT phone FROM portal_profiles WHERE user_id=?").bind(userId).first<{ phone: string | null }>();
  return row?.phone ?? "";
}

export async function savePhone(userId: string, phone: string) {
  await ensureAccountStore();
  await database().prepare(`INSERT INTO portal_profiles (user_id,phone,updated_at) VALUES (?,?,?)
    ON CONFLICT(user_id) DO UPDATE SET phone=excluded.phone,updated_at=excluded.updated_at`).bind(userId,phone || null,new Date().toISOString()).run();
}

export async function getUserPermissions(userId: string) {
  await ensureAccountStore();
  const result = await database().prepare("SELECT permission_key permissionKey,allowed FROM portal_user_permissions WHERE user_id=?").bind(userId).all<{permissionKey:string;allowed:number}>();
  return Object.fromEntries((result.results || []).map((row) => [row.permissionKey,Boolean(row.allowed)]));
}

export async function saveUserPermission(userId:string,permissionKey:string,allowed:boolean) {
  await ensureAccountStore();
  await database().prepare(`INSERT INTO portal_user_permissions (user_id,permission_key,allowed,updated_at) VALUES (?,?,?,?)
    ON CONFLICT(user_id,permission_key) DO UPDATE SET allowed=excluded.allowed,updated_at=excluded.updated_at`)
    .bind(userId,permissionKey,allowed?1:0,new Date().toISOString()).run();
}
