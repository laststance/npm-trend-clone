import { http, HttpResponse } from "msw";

/**
 * MSW request handlers.
 * Shared between browser and server workers.
 *
 * @description
 * Add your API mocks here. These handlers will intercept matching
 * requests in both browser (Service Worker) and server (Node.js) environments.
 *
 * @example
 * // Adding a new handler
 * http.get('/api/users/:id', ({ params }) => {
 *   return HttpResponse.json({ id: params.id, name: 'Test User' });
 * });
 */
export const handlers = [
  // Example: Health check endpoint
  http.get("/api/health", () => {
    return HttpResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: "test",
    });
  }),

  // Add more handlers as needed for your application
  // Example handlers for npm-trend-clone APIs:
  //
  // http.get('/api/downloads', ({ request }) => {
  //   const url = new URL(request.url);
  //   const packages = url.searchParams.get('packages');
  //   // Return mock download data
  //   return HttpResponse.json({ /* mock data */ });
  // }),
  //
  // http.get('/api/packages/search', ({ request }) => {
  //   const url = new URL(request.url);
  //   const query = url.searchParams.get('q');
  //   // Return mock search results
  //   return HttpResponse.json({ /* mock data */ });
  // }),
];
