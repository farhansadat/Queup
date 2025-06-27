import { Handler, HandlerEvent, HandlerContext, HandlerResponse } from '@netlify/functions';
import { storage } from '../../server/storage';
import { insertUserSchema, insertStoreSchema, insertStaffSchema, insertQueueSchema } from '../../shared/schema';
import bcrypt from 'bcrypt';
import { z } from 'zod';

// Schema definitions
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const adminLoginSchema = z.object({
  password: z.string()
});

// Token management for serverless
const generateToken = (userId: string) => {
  return Buffer.from(`${userId}:${Date.now()}`).toString('base64');
};

const verifyToken = (token: string): string | null => {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [userId] = decoded.split(':');
    return userId;
  } catch {
    return null;
  }
};

// Helper function to parse request body
const parseBody = (body: string | null): any => {
  if (!body) return {};
  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
};

// Helper function to create response
const createResponse = (statusCode: number, body: any): HandlerResponse => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  },
  body: JSON.stringify(body)
});

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {
  try {
    const { httpMethod, path, body, headers } = event;
    const requestBody = parseBody(body);

    // Handle CORS preflight requests
    if (httpMethod === 'OPTIONS') {
      return createResponse(200, {});
    }

    // Extract API path
    const apiPath = path.replace(/^\/api/, '') || '/';

    // Authentication helpers
    const getToken = () => headers.authorization?.replace('Bearer ', '') || '';
    const getUserId = () => {
      const token = getToken();
      return token ? verifyToken(token) : null;
    };
    const isAdminAuth = () => {
      const adminPassword = process.env.ADMIN_PASSWORD || "Admin@Sadat!";
      const token = getToken();
      return token === adminPassword;
    };

    // Route handlers
    switch (true) {
      // Health check
      case httpMethod === 'GET' && apiPath === '/health':
        return createResponse(200, { status: "ok", timestamp: new Date().toISOString() });

      // Admin login
      case httpMethod === 'POST' && apiPath === '/admin/login':
        try {
          const { password } = adminLoginSchema.parse(requestBody);
          const adminPassword = process.env.ADMIN_PASSWORD || "Admin@Sadat!";
          
          if (password === adminPassword) {
            return createResponse(200, { token: adminPassword, message: "Admin authenticated" });
          } else {
            return createResponse(401, { message: "Invalid admin password" });
          }
        } catch (error) {
          return createResponse(400, { message: "Invalid request data" });
        }

      // User login
      case httpMethod === 'POST' && apiPath === '/auth/login':
        try {
          const { email, password } = loginSchema.parse(requestBody);
          
          const user = await storage.getUserByEmail(email);
          if (!user) {
            return createResponse(401, { message: "Invalid credentials" });
          }

          const isValid = await bcrypt.compare(password, user.passwordHash);
          if (!isValid) {
            return createResponse(401, { message: "Invalid credentials" });
          }

          const token = generateToken(user.id);
          
          return createResponse(200, {
            user: { 
              id: user.id, 
              email: user.email, 
              firstName: user.firstName, 
              lastName: user.lastName 
            }, 
            token 
          });
        } catch (error) {
          return createResponse(400, { message: "Login failed" });
        }

      // User registration
      case httpMethod === 'POST' && apiPath === '/auth/register':
        try {
          const registerSchema = z.object({
            email: z.string().email(),
            password: z.string().min(6),
            firstName: z.string().min(1),
            lastName: z.string().min(1),
            storeType: z.string().optional(),
            storeName: z.string().optional(),
            storeDescription: z.string().optional(),
            storeAddress: z.string().optional(),
            storePhoneNumber: z.string().optional(),
            storeLogoUrl: z.string().optional(),
            storeLanguage: z.string().optional(),
            weeklySchedule: z.any().optional()
          });

          const userData = registerSchema.parse(requestBody);
          
          const existingUser = await storage.getUserByEmail(userData.email);
          if (existingUser) {
            return createResponse(400, { message: "User already exists" });
          }

          const hashedPassword = await bcrypt.hash(userData.password, 10);
          
          const user = await storage.createUser({
            email: userData.email,
            passwordHash: hashedPassword,
            firstName: userData.firstName,
            lastName: userData.lastName
          });

          // Create store if store data provided
          if (userData.storeName) {
            const storeSlug = `${userData.storeName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
            
            await storage.createStore({
              userId: user.id,
              name: userData.storeName,
              slug: storeSlug,
              description: userData.storeDescription || '',
              address: userData.storeAddress || '',
              phoneNumber: userData.storePhoneNumber || '',
              logoUrl: userData.storeLogoUrl || '',
              storeType: userData.storeType || 'barbershop',
              language: userData.storeLanguage || 'en',
              weeklySchedule: userData.weeklySchedule || {}
            });
          }

          const token = generateToken(user.id);
          
          return createResponse(200, {
            user: { 
              id: user.id, 
              email: user.email, 
              firstName: user.firstName, 
              lastName: user.lastName 
            }, 
            token 
          });
        } catch (error) {
          console.error('Registration error:', error);
          return createResponse(400, { message: "Registration failed", error: error.message });
        }

      // Admin stores
      case httpMethod === 'GET' && apiPath === '/admin/stores':
        if (!isAdminAuth()) {
          return createResponse(401, { message: "Admin authentication required" });
        }
        try {
          const stores = await storage.getAllStoresWithStats();
          return createResponse(200, stores);
        } catch (error) {
          return createResponse(500, { message: "Failed to fetch stores" });
        }

      // User stores
      case httpMethod === 'GET' && apiPath === '/stores':
        const userId = getUserId();
        if (!userId) {
          return createResponse(401, { message: "Authentication required" });
        }
        try {
          const stores = await storage.getStoresByUserId(userId);
          return createResponse(200, stores);
        } catch (error) {
          return createResponse(500, { message: "Failed to fetch stores" });
        }

      // Get store by slug
      case httpMethod === 'GET' && apiPath.startsWith('/stores/') && !apiPath.includes('/queue') && !apiPath.includes('/staff'):
        try {
          const slug = apiPath.split('/')[2];
          const store = await storage.getStoreBySlug(slug);
          if (!store) {
            return createResponse(404, { message: "Store not found" });
          }
          return createResponse(200, store);
        } catch (error) {
          return createResponse(500, { message: "Failed to fetch store" });
        }

      // Get queue by store
      case httpMethod === 'GET' && apiPath.includes('/queue') && apiPath.split('/').length === 3:
        try {
          const storeId = apiPath.split('/')[2];
          const queue = await storage.getQueueByStoreId(storeId);
          return createResponse(200, queue);
        } catch (error) {
          return createResponse(500, { message: "Failed to fetch queue" });
        }

      // Add to queue
      case httpMethod === 'POST' && apiPath.includes('/queue') && apiPath.split('/').length === 3:
        try {
          const storeId = apiPath.split('/')[2];
          const queueData = insertQueueSchema.parse(requestBody);
          const existingQueue = await storage.getQueueByStoreId(storeId);
          const position = existingQueue.length + 1;
          
          const queueEntry = await storage.createQueueEntry({
            ...queueData,
            storeId,
            position,
            status: 'waiting'
          });
          return createResponse(200, queueEntry);
        } catch (error) {
          return createResponse(400, { message: "Invalid queue data" });
        }

      // Get staff by store
      case httpMethod === 'GET' && apiPath.includes('/staff') && apiPath.split('/').length === 3:
        try {
          const storeId = apiPath.split('/')[2];
          const staff = await storage.getStaffByStoreId(storeId);
          return createResponse(200, staff);
        } catch (error) {
          return createResponse(500, { message: "Failed to fetch staff" });
        }

      default:
        return createResponse(404, { message: "Not found" });
    }
  } catch (error) {
    console.error('Handler error:', error);
    return createResponse(500, { 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};