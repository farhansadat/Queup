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

    // Health check
    if (httpMethod === 'GET' && apiPath === '/health') {
      return createResponse(200, { status: "ok", timestamp: new Date().toISOString() });
    }

    // Admin login
    if (httpMethod === 'POST' && apiPath === '/admin/login') {
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
    }

    // User login
    if (httpMethod === 'POST' && apiPath === '/auth/login') {
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
    }

    // User registration
    if (httpMethod === 'POST' && apiPath === '/auth/register') {
      try {
        const registerSchema = z.object({
          email: z.string().email(),
          password: z.string().min(6),
          firstName: z.string().min(1),
          lastName: z.string().min(1),
          storeType: z.string().optional().default('barbershop'),
          storeName: z.string().optional(),
          storeDescription: z.string().optional(),
          storeAddress: z.string().optional(),
          storePhoneNumber: z.string().optional(),
          storeLogoUrl: z.string().optional(),
          storeLanguage: z.string().optional().default('en'),
          weeklySchedule: z.any().optional(),
          workingHours: z.any().optional()
        });

        const parseResult = registerSchema.safeParse(requestBody);
        
        if (!parseResult.success) {
          return createResponse(400, { 
            message: "Validation failed", 
            errors: parseResult.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`)
          });
        }
        
        const userData = parseResult.data;
        
        // Check if user already exists
        const existingUser = await storage.getUserByEmail(userData.email);
        if (existingUser) {
          return createResponse(400, { message: "User already exists with this email" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        // Create user
        const user = await storage.createUser({
          email: userData.email,
          passwordHash: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName
        });

        // Create store if store data provided
        if (userData.storeName && userData.storeName.trim()) {
          const storeSlug = `${userData.storeName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
          
          try {
            await storage.createStore({
              userId: user.id,
              name: userData.storeName,
              slug: storeSlug,
              description: userData.storeDescription || '',
              address: userData.storeAddress || '',
              phoneNumber: userData.storePhoneNumber || '',
              logoUrl: userData.storeLogoUrl || '',
              storeType: userData.storeType,
              language: userData.storeLanguage,
              weeklySchedule: userData.weeklySchedule || userData.workingHours || {}
            });
          } catch (storeError) {
            console.error('Store creation error:', storeError);
          }
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
        return createResponse(400, { 
          message: "Registration failed", 
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Admin stores
    if (httpMethod === 'GET' && apiPath === '/admin/stores') {
      if (!isAdminAuth()) {
        return createResponse(401, { message: "Admin authentication required" });
      }
      try {
        const stores = await storage.getAllStoresWithStats();
        return createResponse(200, stores);
      } catch (error) {
        return createResponse(500, { message: "Failed to fetch stores" });
      }
    }

    // User stores
    if (httpMethod === 'GET' && apiPath === '/stores') {
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
    }

    // Store stats endpoint - /stores/:id/stats
    if (httpMethod === 'GET' && /^\/stores\/[^\/]+\/stats$/.test(apiPath)) {
      try {
        const storeId = apiPath.split('/')[2];
        const stats = await storage.getQueueStats(storeId);
        return createResponse(200, stats);
      } catch (error) {
        return createResponse(500, { message: "Failed to fetch stats" });
      }
    }

    // Served customers endpoint - /stores/:id/served
    if (httpMethod === 'GET' && /^\/stores\/[^\/]+\/served$/.test(apiPath)) {
      try {
        const storeId = apiPath.split('/')[2];
        const served = await storage.getServedCustomers(storeId);
        return createResponse(200, served);
      } catch (error) {
        return createResponse(500, { message: "Failed to fetch served customers" });
      }
    }

    // Store queue endpoint - /stores/:id/queue
    if (httpMethod === 'GET' && /^\/stores\/[^\/]+\/queue$/.test(apiPath)) {
      try {
        const storeId = apiPath.split('/')[2];
        const queue = await storage.getQueueByStoreId(storeId);
        return createResponse(200, queue);
      } catch (error) {
        return createResponse(500, { message: "Failed to fetch queue" });
      }
    }

    // Add to queue - POST /stores/:id/queue
    if (httpMethod === 'POST' && /^\/stores\/[^\/]+\/queue$/.test(apiPath)) {
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
    }

    // Store staff endpoint - /stores/:id/staff
    if (httpMethod === 'GET' && /^\/stores\/[^\/]+\/staff$/.test(apiPath)) {
      try {
        const storeId = apiPath.split('/')[2];
        const staff = await storage.getStaffByStoreId(storeId);
        return createResponse(200, staff);
      } catch (error) {
        return createResponse(500, { message: "Failed to fetch staff" });
      }
    }

    // Create staff member - POST /stores/:id/staff
    if (httpMethod === 'POST' && /^\/stores\/[^\/]+\/staff$/.test(apiPath)) {
      try {
        const storeId = apiPath.split('/')[2];
        const staffData = insertStaffSchema.parse({ ...requestBody, storeId });
        const staff = await storage.createStaff(staffData);
        return createResponse(200, staff);
      } catch (error) {
        return createResponse(400, { message: "Invalid staff data" });
      }
    }

    // Get store by slug (catch-all for store pages)
    if (httpMethod === 'GET' && apiPath.startsWith('/stores/') && apiPath.split('/').length === 3) {
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
    }

    // Default 404 response
    return createResponse(404, { message: "Endpoint not found", path: apiPath, method: httpMethod });

  } catch (error) {
    console.error('Handler error:', error);
    return createResponse(500, { 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};