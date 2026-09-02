declare interface Fetcher{fetch(input:RequestInfo|URL,init?:RequestInit):Promise<Response>}
declare interface D1PreparedStatement{bind(...values:unknown[]):D1PreparedStatement;first<T=unknown>():Promise<T|null>;run():Promise<unknown>;all<T=unknown>():Promise<{results:T[]}>}
declare interface D1Database{prepare(query:string):D1PreparedStatement;batch<T=unknown>(statements:D1PreparedStatement[]):Promise<T[]>}
declare module "cloudflare:workers"{export const env:{DB:D1Database;BUCKET:unknown;ASSETS:Fetcher;[key:string]:unknown}}
