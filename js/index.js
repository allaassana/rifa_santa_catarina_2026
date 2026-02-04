document.addEventListener("DOMContentLoaded", () => {

  const supabase = window.supabase.createClient(
    "https://SEU_PROJECT_ID.supabase.co",
    "SUA_PUBLIC_ANON_KEY"
  );

  const grelha = document.getElementById("grelha");
  const form = document.getElementById("formCompra");
  const bilheteSpan = document.getElementById("bilheteSelecionado");

  let bilheteAtual = null;

  // GERAR GRELHA
  for (let i = 1; i <= 120; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.onclick = () => selecionarBilhete(i);
    grelha.appendChild(btn);
  }

  function selecionarBilhete(numero) {
    bilheteAtual = numero;
    bilheteSpan.textContent = numero;
    form.hidden = false;
  }

  document.getElementById("cancelar").onclick = () => {
    form.hidden = true;
    bilheteAtual = null;
  };

  form.onsubmit = async (e) => {
    e.preventDefault();

    const nome = nomeInput.value;
    const file = comprovativo.files[0];

    if (!file) {
      alert("Anexe o comprovativo");
      return;
    }

    const filePath = `bilhete_${bilheteAtual}_${Date.now()}.png`;

    const { error: uploadError } = await supabase
      .storage
      .from("comprovativos")
      .upload(filePath, file);

    if (uploadError) {
      alert("Erro no upload");
      return;
    }

    await supabase.from("bilhetes").insert({
      numero: bilheteAtual,
      nome
    });

    document.getElementById("modalBilhete").textContent = bilheteAtual;
    document.getElementById("modalNome").textContent = nome;
    document.getElementById("modal").hidden = false;
    form.hidden = true;
  };

});

function fecharModal() {
  document.getElementById("modal").hidden = true;
}
