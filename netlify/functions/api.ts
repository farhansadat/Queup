import { Handler, HandlerEvent, HandlerContext, HandlerResponse } from '@netlify/functions';
import express from 'express';
import serverless from 'serverless-http';
import { registerRoutes } from '../../server/routes';

const app = express();

// Register all routes
registerRoutes(app);

// Create serverless handler
const serverlessHandler = serverless(app);

// Export the properly typed Netlify function
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {
  try {
    const result = await serverlessHandler(event, context) as any;
    return {
      statusCode: result.statusCode || 200,
      headers: result.headers || {},
      body: result.body || ''
    };
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};