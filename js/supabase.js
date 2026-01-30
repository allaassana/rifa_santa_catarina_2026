<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const SUPABASE_URL = "https://SEU_PROJECT_ID.supabase.co";
  const SUPABASE_ANON_KEY = "SUA_ANON_PUBLIC_KEY";

  const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );
</script>
