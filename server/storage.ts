// @ts-nocheck
import { users, stores, staff, queues, type User, type InsertUser, type Store, type InsertStore, type Staff, type InsertStaff, type Queue, type InsertQueue } from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and, desc, asc, gte, lt, sql } from "drizzle-orm";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

const sql = neon(connectionString);
const db = drizzle(sql);

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  
  // Store operations
  createStore(store: InsertStore & { userId: string }): Promise<Store>;
  getStoreBySlug(slug: string): Promise<Store | undefined>;
  getStoresByUserId(userId: string): Promise<Store[]>;
  updateStore(storeId: string, updates: Partial<InsertStore>): Promise<Store>;
  
  // Staff operations
  createStaff(staff: InsertStaff): Promise<Staff>;
  getStaffByStoreId(storeId: string): Promise<Staff[]>;
  updateStaff(staffId: string, updates: Partial<InsertStaff>): Promise<Staff>;
  deleteStaff(staffId: string): Promise<void>;
  
  // Queue operations
  createQueueEntry(entry: InsertQueue): Promise<Queue>;
  getQueueByStoreId(storeId: string): Promise<Queue[]>;
  updateQueueEntry(entryId: string, updates: Partial<InsertQueue>): Promise<Queue>;
  deleteQueueEntry(entryId: string): Promise<void>;
  reorderQueue(storeId: string, newOrder: { id: string; position: number }[]): Promise<void>;
  getQueueStats(storeId: string, date?: Date): Promise<{
    totalCustomers: number;
    avgWaitTime: number;
    completed: number;
    waiting: number;
  }>;
  getServedCustomers(storeId: string): Promise<Queue[]>;
  
  // Admin operations
  getAllStoresWithStats(): Promise<any[]>;
  deleteStore(storeId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async createStore(store: InsertStore & { userId: string }): Promise<Store> {
    const [newStore] = await db.insert(stores).values(store as any).returning();
    return newStore;
  }

  async getStoreBySlug(slug: string): Promise<Store | undefined> {
    const [store] = await db.select().from(stores).where(eq(stores.slug, slug));
    return store;
  }

  async getStoresByUserId(userId: string): Promise<Store[]> {
    return await db.select().from(stores).where(eq(stores.userId, userId));
  }

  async updateStore(storeId: string, updates: Partial<InsertStore>): Promise<Store> {
    const [updatedStore] = await db.update(stores).set(updates as any).where(eq(stores.id, storeId)).returning();
    return updatedStore;
  }

  async createStaff(staffMember: InsertStaff): Promise<Staff> {
    const [newStaff] = await db.insert(staff).values(staffMember).returning();
    return newStaff;
  }

  async getStaffByStoreId(storeId: string): Promise<Staff[]> {
    return await db.select().from(staff).where(eq(staff.storeId, storeId));
  }

  async updateStaff(staffId: string, updates: Partial<InsertStaff>): Promise<Staff> {
    const [updatedStaff] = await db.update(staff).set(updates).where(eq(staff.id, staffId)).returning();
    return updatedStaff;
  }

  async deleteStaff(staffId: string): Promise<void> {
    await db.delete(staff).where(eq(staff.id, staffId));
  }

  async createQueueEntry(entry: InsertQueue): Promise<Queue> {
    // Get the next position
    const existingEntries = await db.select().from(queues).where(
      and(eq(queues.storeId, entry.storeId), eq(queues.status, "waiting"))
    );
    const nextPosition = existingEntries.length + 1;
    
    const [newEntry] = await db.insert(queues).values({
      ...entry,
      position: nextPosition
    }).returning();
    return newEntry;
  }

  async getQueueByStoreId(storeId: string): Promise<Queue[]> {
    return await db.select().from(queues)
      .where(and(eq(queues.storeId, storeId), eq(queues.status, "waiting")))
      .orderBy(asc(queues.position));
  }

  async updateQueueEntry(entryId: string, updates: Partial<InsertQueue>): Promise<Queue> {
    const [updatedEntry] = await db.update(queues).set(updates).where(eq(queues.id, entryId)).returning();
    return updatedEntry;
  }

  async deleteQueueEntry(entryId: string): Promise<void> {
    await db.delete(queues).where(eq(queues.id, entryId));
  }

  async reorderQueue(storeId: string, newOrder: { id: string; position: number }[]): Promise<void> {
    for (const item of newOrder) {
      await db.update(queues).set({ position: item.position }).where(eq(queues.id, item.id));
    }
  }

  async getQueueStats(storeId: string, date?: Date): Promise<{
    totalCustomers: number;
    avgWaitTime: number;
    completed: number;
    waiting: number;
  }> {
    // Get all queue entries for the store
    const allEntries = await db.select().from(queues).where(eq(queues.storeId, storeId));
    
    // Filter by date if provided
    const entries = date 
      ? allEntries.filter(entry => 
          entry.joinedAt.toDateString() === date.toDateString()
        )
      : allEntries;

    const totalCustomers = entries.length;
    const completed = entries.filter(entry => entry.status === "served").length;
    const waiting = entries.filter(entry => entry.status === "waiting").length;
    
    // Calculate average wait time for completed customers
    const completedEntries = entries.filter(entry => entry.status === "served");
    const avgWaitTime = completedEntries.length > 0 
      ? completedEntries.reduce((sum, entry) => {
          // Estimate 20 minutes per customer for completed ones
          return sum + 20;
        }, 0) / completedEntries.length
      : 0;

    return {
      totalCustomers,
      avgWaitTime: Math.round(avgWaitTime),
      completed,
      waiting
    };
  }

  async getServedCustomers(storeId: string): Promise<Queue[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const servedToday = await db
      .select()
      .from(queues)
      .where(
        and(
          eq(queues.storeId, storeId),
          eq(queues.status, "served"),
          gte(queues.joinedAt, today),
          lt(queues.joinedAt, tomorrow)
        )
      )
      .orderBy(desc(queues.joinedAt));

    return servedToday;
  }

  async getAllStoresWithStats(): Promise<any[]> {
    try {
      // Raw SQL query to avoid Drizzle ORM issues
      const storesResult = await db.execute(sql`
        SELECT 
          s.*,
          u.email as user_email,
          u."firstName" as user_first_name,
          u."lastName" as user_last_name,
          COALESCE(staff_count.count, 0) as staff_count,
          COALESCE(queue_count.count, 0) as queue_count
        FROM stores s
        LEFT JOIN users u ON s."userId" = u.id
        LEFT JOIN (
          SELECT "storeId", COUNT(*) as count 
          FROM staff 
          GROUP BY "storeId"
        ) staff_count ON s.id = staff_count."storeId"
        LEFT JOIN (
          SELECT "storeId", COUNT(*) as count 
          FROM queues 
          WHERE status = 'waiting'
          GROUP BY "storeId"
        ) queue_count ON s.id = queue_count."storeId"
        ORDER BY s."createdAt" DESC
      `);

      return storesResult.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        address: row.address,
        phoneNumber: row.phoneNumber,
        logoUrl: row.logoUrl,
        storeType: row.storeType,
        language: row.language,
        weeklySchedule: row.weeklySchedule,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        userId: row.userId,
        staffCount: parseInt(row.staff_count) || 0,
        queueCount: parseInt(row.queue_count) || 0,
        user: row.user_email ? {
          id: row.userId,
          email: row.user_email,
          firstName: row.user_first_name,
          lastName: row.user_last_name
        } : null
      }));
    } catch (error) {
      console.error("Error in getAllStoresWithStats:", error);
      return [];
    }
  }

  async deleteStore(storeId: string): Promise<void> {
    try {
      // Delete all queue entries for this store
      await db.delete(queues).where(eq(queues.storeId, storeId));
      
      // Delete all staff for this store
      await db.delete(staff).where(eq(staff.storeId, storeId));
      
      // Delete the store
      await db.delete(stores).where(eq(stores.id, storeId));
    } catch (error) {
      console.error("Error deleting store:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
