document.addEventListener("DOMContentLoaded", async () => {

  const supabase = window.supabase.createClient(
    "https://ydyxumwquhnohomahaxet.supabase.co",
    "PUBLIC_ANON_KEY_AQUI"
  );

  const bilhetesDiv = document.getElementById("bilhetes");
  const bilheteSelecionado = document.getElementById("bilheteSelecionado");
  let numeroEscolhido = null;

  // Criar bilhetes
  for (let i = 1; i <= 120; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.onclick = () => {
      numeroEscolhido = i;
      bilheteSelecionado.textContent = i;
    };
    bilhetesDiv.appendChild(btn);
  }

  // Submeter compra
  document.getElementById("formCompra").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!numeroEscolhido) {
      alert("Escolha um bilhete");
      return;
    }

    const file = document.getElementById("comprovativo").files[0];

    const { error: uploadError } = await supabase.storage
      .from("comprovativos")
      .upload(`${Date.now()}_${file.name}`, file);

    if (uploadError) {
      alert("Erro no upload do comprovativo");
      return;
    }

    alert("Compra registada com sucesso!");
    location.reload();
  });

});
