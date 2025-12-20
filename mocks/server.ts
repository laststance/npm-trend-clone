import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/**
 * Server MSW worker.
 * Intercepts requests in Node.js environment (for RSC, API Routes).
 *
 * @description
 * This server is initialized in layout.tsx for server-side request mocking.
 * It runs in the Node.js runtime only (not Edge).
 */
export const server = setupServer(...handlers);
