import { pgTable, text, serial, uuid, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  language: text("language").default("de").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const stores = pgTable("stores", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  type: text("type", { 
    enum: ["barbershop", "salon", "clinic", "restaurant", "retail", "service", "other"] 
  }).default("barbershop").notNull(),
  logoUrl: text("logo_url"),
  description: text("description"),
  address: text("address"),
  phone: text("phone"),
  language: text("language").default("de").notNull(),
  workingHours: json("working_hours").$type<{
    monday: { open: string; close: string; isOpen: boolean };
    tuesday: { open: string; close: string; isOpen: boolean };
    wednesday: { open: string; close: string; isOpen: boolean };
    thursday: { open: string; close: string; isOpen: boolean };
    friday: { open: string; close: string; isOpen: boolean };
    saturday: { open: string; close: string; isOpen: boolean };
    sunday: { open: string; close: string; isOpen: boolean };
  }>(),
  services: text("services").array(),
  theme: json("theme").$type<{
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const staff = pgTable("staff", {
  id: uuid("id").primaryKey().defaultRandom(),
  storeId: uuid("store_id").references(() => stores.id).notNull(),
  name: text("name").notNull(),
  title: text("title"),
  photoUrl: text("photo_url"),
  status: text("status", { enum: ["available", "unavailable"] }).default("available").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const queues = pgTable("queues", {
  id: uuid("id").primaryKey().defaultRandom(),
  storeId: uuid("store_id").references(() => stores.id).notNull(),
  staffId: uuid("staff_id").references(() => staff.id),
  customerName: text("customer_name"),
  contactInfo: text("contact_info"),
  position: integer("position").notNull(),
  status: text("status", { enum: ["waiting", "served", "canceled"] }).default("waiting").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertStoreSchema = createInsertSchema(stores).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertStaffSchema = createInsertSchema(staff).omit({
  id: true,
  createdAt: true,
});

export const insertQueueSchema = createInsertSchema(queues).omit({
  id: true,
  joinedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Store = typeof stores.$inferSelect;
export type InsertStore = z.infer<typeof insertStoreSchema>;

export type Staff = typeof staff.$inferSelect;
export type InsertStaff = z.infer<typeof insertStaffSchema>;

export type Queue = typeof queues.$inferSelect;
export type InsertQueue = z.infer<typeof insertQueueSchema>;
