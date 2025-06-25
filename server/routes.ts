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

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({ email, password: hashedPassword });
      
      req.session.userId = user.id;
      res.json({ user: { id: user.id, email: user.email } });
    } catch (error) {
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
      res.status(400).json({ message: "Invalid queue data" });
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

  const httpServer = createServer(app);
  
  // WebSocket setup on a different port to avoid conflicts with Vite
  const wss = new WebSocketServer({ port: 5001 });
  
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
