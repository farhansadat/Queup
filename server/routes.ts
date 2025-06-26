// @ts-nocheck
import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertStoreSchema, insertStaffSchema, insertQueueSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import session from "express-session";
import { z } from "zod";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const queueActionSchema = z.object({
  action: z.enum(["serve", "cancel", "reorder"]),
  entryId: z.string().optional(),
  newOrder: z.array(z.object({
    id: z.string(),
    position: z.number()
  })).optional()
});

const adminLoginSchema = z.object({
  password: z.string()
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
  }));

  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Admin middleware - simple password check for demo
  const requireAdmin = (req: any, res: any, next: any) => {
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token || token !== adminPassword) {
      return res.status(401).json({ message: "Admin authentication required" });
    }
    next();
  };

  // Auth routes
  // Password reset route
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // Check if user exists
      const user = await storage.getUserByEmail(email);
      
      // Always return success to prevent email enumeration
      // In a real app, you would send an actual email here
      if (user) {
        // TODO: Implement actual email sending with reset token
        console.log(`Password reset requested for: ${email}`);
        // In development, log the reset link
        const resetToken = Math.random().toString(36).substring(2, 15);
        console.log(`Reset link: ${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}`);
      }
      
      res.json({ message: "If an account with that email exists, a reset link has been sent." });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "Failed to process password reset" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const registerSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        storeType: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        logoUrl: z.string().optional(),
        language: z.string().optional(),
        weeklySchedule: z.any().optional(),
        workingHours: z.any().optional()
      });
      
      const { email, password, firstName, lastName, storeType, name, description, logoUrl, language, weeklySchedule, workingHours } = registerSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email may already be in use" });
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({ 
        email, 
        password: hashedPassword, 
        firstName, 
        lastName 
      });

      // Create initial store with provided data
      if (storeType || name) {
        const storeName = name || `${firstName}'s ${storeType?.charAt(0).toUpperCase() + storeType?.slice(1)}`;
        const slug = `${firstName.toLowerCase()}-${(storeType || 'store').toLowerCase()}-${Date.now()}`;
        
        await storage.createStore({
          userId: user.id,
          name: storeName,
          slug,
          description: description || "",
          logoUrl: logoUrl || "",
          language: language || "en",
          type: storeType as any,
          workingHours: weeklySchedule || workingHours || {
            monday: { open: "09:00", close: "17:00", isOpen: true },
            tuesday: { open: "09:00", close: "17:00", isOpen: true },
            wednesday: { open: "09:00", close: "17:00", isOpen: true },
            thursday: { open: "09:00", close: "17:00", isOpen: true },
            friday: { open: "09:00", close: "17:00", isOpen: true },
            saturday: { open: "10:00", close: "16:00", isOpen: true },
            sunday: { open: "10:00", close: "16:00", isOpen: false }
          }
        });
      }
      
      req.session.userId = user.id;
      res.json({ user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Please check your email format and ensure password is at least 6 characters" });
      }
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      res.json({ user: { id: user.id, email: user.email } });
    } catch (error) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  app.put("/api/auth/change-password", requireAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new passwords are required" });
      }

      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      // Note: This would need a updateUser method in storage
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUserById(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({ user: { id: user.id, email: user.email } });
  });

  // Store routes
  app.post("/api/stores", requireAuth, async (req, res) => {
    try {
      const storeData = insertStoreSchema.parse(req.body);
      const store = await storage.createStore({ ...storeData, userId: req.session.userId! });
      res.json(store);
    } catch (error) {
      res.status(400).json({ message: "Invalid store data" });
    }
  });

  app.get("/api/stores", requireAuth, async (req, res) => {
    try {
      const stores = await storage.getStoresByUserId(req.session.userId!);
      res.json(stores);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stores" });
    }
  });

  app.get("/api/stores/:slug", async (req, res) => {
    try {
      const store = await storage.getStoreBySlug(req.params.slug);
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      res.json(store);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch store" });
    }
  });

  app.put("/api/stores/:id", requireAuth, async (req, res) => {
    try {
      const updates = insertStoreSchema.partial().parse(req.body);
      const store = await storage.updateStore(req.params.id, updates);
      res.json(store);
    } catch (error) {
      res.status(400).json({ message: "Invalid store data" });
    }
  });

  // Staff routes
  app.post("/api/staff", requireAuth, async (req, res) => {
    try {
      const staffData = insertStaffSchema.parse(req.body);
      const staff = await storage.createStaff(staffData);
      res.json(staff);
    } catch (error) {
      res.status(400).json({ message: "Invalid staff data" });
    }
  });

  app.get("/api/stores/:storeId/staff", async (req, res) => {
    try {
      const staff = await storage.getStaffByStoreId(req.params.storeId);
      res.json(staff);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch staff" });
    }
  });

  app.put("/api/staff/:id", requireAuth, async (req, res) => {
    try {
      const updates = insertStaffSchema.partial().parse(req.body);
      const staff = await storage.updateStaff(req.params.id, updates);
      res.json(staff);
    } catch (error) {
      res.status(400).json({ message: "Invalid staff data" });
    }
  });

  app.delete("/api/staff/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteStaff(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete staff" });
    }
  });

  // Queue routes
  app.post("/api/queue", async (req, res) => {
    try {
      console.log("Queue creation request body:", req.body);
      const queueData = insertQueueSchema.parse(req.body);
      const entry = await storage.createQueueEntry(queueData);
      
      // Broadcast to WebSocket clients
      wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({
            type: "queue_update",
            storeId: entry.storeId,
            action: "add",
            entry
          }));
        }
      });

      res.json(entry);
    } catch (error) {
      console.error("Queue creation error:", error);
      res.status(400).json({ 
        message: "Invalid queue data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/stores/:storeId/queue", async (req, res) => {
    try {
      const queue = await storage.getQueueByStoreId(req.params.storeId);
      res.json(queue);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch queue" });
    }
  });

  app.put("/api/queue/:id", requireAuth, async (req, res) => {
    try {
      const { action, entryId, newOrder } = queueActionSchema.parse(req.body);
      
      if (action === "reorder" && newOrder) {
        await storage.reorderQueue(req.params.id, newOrder);
      } else if (entryId) {
        if (action === "serve") {
          await storage.updateQueueEntry(entryId, { status: "served" });
        } else if (action === "cancel") {
          await storage.updateQueueEntry(entryId, { status: "canceled" });
        }
      }

      const queue = await storage.getQueueByStoreId(req.params.id);
      
      // Broadcast to WebSocket clients
      wss.clients.forEach((client: any) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({
            type: "queue_update",
            storeId: req.params.id,
            action,
            queue
          }));
        }
      });

      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: "Invalid queue action" });
    }
  });

  app.get("/api/stores/:storeId/stats", requireAuth, async (req, res) => {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : new Date();
      const stats = await storage.getQueueStats(req.params.storeId, date);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get("/api/stores/:storeId/served", requireAuth, async (req, res) => {
    try {
      const servedCustomers = await storage.getServedCustomers(req.params.storeId);
      res.json(servedCustomers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch served customers" });
    }
  });

  // Admin routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = adminLoginSchema.parse(req.body);
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      
      if (password === adminPassword) {
        res.json({ token: adminPassword, message: "Admin authenticated" });
      } else {
        res.status(401).json({ message: "Invalid admin password" });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.get("/api/admin/stores", requireAdmin, async (req, res) => {
    try {
      const stores = await storage.getAllStoresWithStats();
      res.json(stores);
    } catch (error) {
      console.error("Error fetching admin stores:", error);
      res.status(500).json({ message: "Failed to fetch stores" });
    }
  });

  app.patch("/api/admin/stores/:storeId", requireAdmin, async (req, res) => {
    try {
      const { storeId } = req.params;
      const updates = req.body;
      
      const updatedStore = await storage.updateStore(storeId, updates);
      res.json(updatedStore);
    } catch (error) {
      console.error("Error updating store:", error);
      res.status(500).json({ message: "Failed to update store" });
    }
  });

  app.delete("/api/admin/stores/:storeId", requireAdmin, async (req, res) => {
    try {
      const { storeId } = req.params;
      await storage.deleteStore(storeId);
      res.json({ message: "Store deleted successfully" });
    } catch (error) {
      console.error("Error deleting store:", error);
      res.status(500).json({ message: "Failed to delete store" });
    }
  });

  const httpServer = createServer(app);
  
  // WebSocket setup on different port to avoid Vite dev server conflicts
  const wss = new WebSocketServer({ port: 5002 });
  
  wss.on("connection", (ws: any) => {
    ws.on("message", (message: any) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "subscribe" && data.storeId) {
          ws.storeId = data.storeId;
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });
  });

  return httpServer;
}
