import { createClient } from "@lumina/db-shim";

/**
 * Returns a Lumina database client suitable for use in Client Components.
 */
export function createDatabaseClient() {
  const connectionString = process.env.NEXT_PUBLIC_DATABASE_URL || "";
  return createClient(connectionString, "");
}
