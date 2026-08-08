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
