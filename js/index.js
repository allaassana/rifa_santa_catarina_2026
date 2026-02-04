document.addEventListener("DOMContentLoaded", async () => {

  const supabase = window.supabase.createClient(
    "https://ydyxumwquhnohomahaxet.supabase.co",
    "SB_PUBLISHABLE_KEY_AQUI"
  );

  const bilhetesDiv = document.getElementById("bilhetes");
  const form = document.getElementById("formulario");
  const numSpan = document.getElementById("numSelecionado");
  let numeroAtual = null;

  const { data: bilhetes } = await supabase
    .from("bilhetes")
    .select("*")
    .order("numero");

  bilhetes.forEach(b => {
    const btn = document.createElement("button");
    btn.textContent = b.numero;
    btn.className = b.vendido ? "vendido" : "livre";

    if (!b.vendido) {
      btn.onclick = () => {
        numeroAtual = b.numero;
        numSpan.textContent = b.numero;
        form.classList.remove("hidden");
      };
    }

    bilhetesDiv.appendChild(btn);
  });

  document.getElementById("cancelar").onclick = () => {
    form.classList.add("hidden");
    numeroAtual = null;
  };

  document.getElementById("confirmar").onclick = async () => {
    if (!numeroAtual) return;

    const file = document.getElementById("comprovativo").files[0];
    const fileName = `${Date.now()}_${file.name}`;

    const { data: upload, error: uploadError } =
      await supabase.storage.from("comprovativos").upload(fileName, file);

    if (uploadError) {
      alert("Erro no upload do comprovativo");
      return;
    }

    const { data: comprador } = await supabase
      .from("compradores")
      .insert({
        nome: nome.value,
        telefone: telefone.value,
        email: email.value,
        data_nascimento: data_nascimento.value,
        cidade: cidade.value,
        pais: pais.value,
        comprovativo_url: upload.path
      })
      .select()
      .single();

    await supabase
      .from("bilhetes")
      .update({ vendido: true, comprador_id: comprador.id })
      .eq("numero", numeroAtual);

    alert("Compra registada com sucesso!");
    location.reload();
  };

});
