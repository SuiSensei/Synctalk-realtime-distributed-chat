import { createClient } from "@supabase/supabase-js";
import { config } from "./config";

/**
 * Supabase client initialized with the service-role key.
 * This grants full access to all tables bypassing RLS.
 * Used server-side only — never expose to clients.
 */
export const supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey);
