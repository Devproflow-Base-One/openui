import { createClient } from "@lumina/db-shim";

/**
 * Returns a Lumina database client suitable for use in Server Components,
 * Server Actions, and Route Handlers.
 */
export async function createDatabaseClient() {
  const connectionString = process.env.DATABASE_URL || "";
  return createClient(connectionString, "");
}
