import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

export const SUPABASE_URL = "https://TEU_PROJECT_ID.supabase.co";
export const SUPABASE_ANON_KEY = "TEU_ANON_KEY";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
