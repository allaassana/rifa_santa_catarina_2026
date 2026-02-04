document.addEventListener("DOMContentLoaded", async () => {

  const supabase = window.supabase.createClient(
    "https://ydyxumwquhnohomahaxet.supabase.co",
    "PUBLIC_ANON_KEY_AQUI"
  );

  document.getElementById("sortear").onclick = () => {
    alert("Sorteio será implementado a seguir");
  };

});
