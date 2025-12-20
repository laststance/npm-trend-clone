import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

/**
 * Browser MSW worker.
 * Uses Service Worker to intercept requests in the browser.
 *
 * @description
 * This worker is dynamically imported by MSWProvider to avoid
 * bundling browser-only code in the server bundle.
 */
export const worker = setupWorker(...handlers);
