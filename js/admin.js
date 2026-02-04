document.addEventListener("DOMContentLoaded", async () => {

  const supabase = window.supabase.createClient(
    "https://ydyxumwquhnohomahaxet.supabase.co",
    "SB_PUBLISHABLE_KEY_AQUI"
  );

  const grid = document.getElementById("bilhetes");
  const detalhes = document.getElementById("detalhes");

  const { data: bilhetes } = await supabase
    .from("bilhetes")
    .select("numero, vendido, compradores(*)");

  bilhetes.forEach(b => {
    const btn = document.createElement("button");
    btn.textContent = b.numero;
    btn.className = b.vendido ? "vendido" : "livre";

    if (b.vendido) {
      btn.onclick = () => {
        const c = b.compradores;
        detalhes.innerHTML = `
          <p><strong>Nome:</strong> ${c.nome}</p>
          <p><strong>Email:</strong> ${c.email}</p>
          <p><strong>Telefone:</strong> ${c.telefone}</p>
        `;
      };
    }

    grid.appendChild(btn);
  });

});
