// js/supabase.js

const SUPABASE_URL = "https://SEU_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "SUA_ANON_PUBLIC_KEY";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
