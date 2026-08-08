import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const workTools = sqliteTable("work_tools", {
  id: text("id").primaryKey(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  descriptionAr: text("description_ar").notNull(),
  descriptionEn: text("description_en").notNull(),
  url: text("url").notNull(),
  icon: text("icon").notNull().default("link"),
  color: text("color").notNull().default("rose"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const replyTemplates = sqliteTable("reply_templates", {
  id: text("id").primaryKey(),
  department: text("department").notNull().default("chat"),
  contentType: text("content_type").notNull().default("macro"),
  category: text("category").notNull(),
  title: text("title").notNull(),
  bodyAr: text("body_ar").notNull(),
  bodyHe: text("body_he").notNull(),
  bodyEn: text("body_en").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const employeeRequests = sqliteTable("employee_requests", {
  id: text("id").primaryKey(),
  userKey: text("user_key").notNull(),
  employeeName: text("employee_name").notNull(),
  employeeId: text("employee_id").notNull(),
  department: text("department").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  details: text("details").notNull(),
  fromDate: text("from_date"),
  toDate: text("to_date"),
  status: text("status").notNull().default("pending"),
  priority: text("priority").notNull().default("normal"),
  managerNote: text("manager_note"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const pulseEntries = sqliteTable("pulse_entries", {
  id: text("id").primaryKey(),
  userKey: text("user_key").notNull(),
  entryDate: text("entry_date").notNull(),
  mood: integer("mood").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const couriers = sqliteTable("couriers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  area: text("area").notNull(),
  shift: text("shift").notNull(),
  notes: text("notes"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const portalSettings = sqliteTable("portal_settings", {
  key: text("key").primaryKey(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  groupName: text("group_name").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const coverageAreas = sqliteTable("coverage_areas", {
  code: integer("code").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
  status: text("status").notNull().default("active"),
  updatedAt: text("updated_at").notNull(),
});
