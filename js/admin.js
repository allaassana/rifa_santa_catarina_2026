document.addEventListener("DOMContentLoaded", async () => {

  const supabase = window.supabase.createClient(
    "https://SEU_PROJECT_ID.supabase.co",
    "SUA_PUBLIC_ANON_KEY"
  );

  const grelha = document.getElementById("grelhaAdmin");
  const detalhes = document.getElementById("detalhes");

  const { data } = await supabase.from("bilhetes").select("*");

  data.forEach(b => {
    const btn = document.createElement("button");
    btn.textContent = b.numero;
    btn.onclick = () => detalhes.textContent = JSON.stringify(b, null, 2);
    grelha.appendChild(btn);
  });

});
