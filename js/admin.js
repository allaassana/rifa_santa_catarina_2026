const grid = document.getElementById("grid");
const detalhes = document.getElementById("detalhes");
const vencedoresList = document.getElementById("vencedores");
const btnSortear = document.getElementById("sortear");

/* -----------------------------
   CARREGAR COMPRAS
-------------------------------- */
async function carregarCompras() {
  const { data, error } = await db
    .from("compras")
    .select("*")
    .order("bilhete");

  if (error) {
    console.error(error);
    return;
  }

  const vendidos = data.map(c => c.bilhete);
  grid.innerHTML = "";

  for (let i = 1; i <= 120; i++) {
    const btn = document.createElement("div");
    btn.classList.add("ticket");

    const compra = data.find(c => c.bilhete === i);

    if (compra) {
      btn.classList.add("sold");
    } else {
      btn.classList.add("available");
    }

    btn.textContent = i;

    btn.onclick = () => {
      if (!compra) {
        detalhes.innerHTML = "<p>Bilhete disponível</p>";
        return;
      }

      detalhes.innerHTML = `
        <p><strong>Bilhete:</strong> ${compra.bilhete}</p>
        <p><strong>Nome:</strong> ${compra.nome}</p>
        <p><strong>Telefone:</strong> ${compra.telefone}</p>
        <p><strong>Email:</strong> ${compra.email}</p>
        <p><strong>Cidade:</strong> ${compra.cidade}</p>
        <p><strong>País:</strong> ${compra.pais}</p>
        ${
          compra.comprovativo_url
            ? `<p><a href="${compra.comprovativo_url}" target="_blank">📎 Ver comprovativo</a></p>`
            : ""
        }
      `;
    };

    grid.appendChild(btn);
  }

  carregarVencedores();
}

/* -----------------------------
   SORTEAR VENCEDOR
-------------------------------- */
btnSortear.onclick = async () => {
  const { data, error } = await db
    .from("compras")
    .select("*");

  if (error || !data.length) {
    alert("Nenhuma compra encontrada.");
    return;
  }

  const vencedor = data[Math.floor(Math.random() * data.length)];

  await db.from("vencedores").insert({
    bilhete: vencedor.bilhete,
    nome: vencedor.nome,
    telefone: vencedor.telefone,
    email: vencedor.email
  });

  alert(`🎉 Vencedor: ${vencedor.nome} (Bilhete ${vencedor.bilhete})`);
  carregarVencedores();
};

/* -----------------------------
   HISTÓRICO DE VENCEDORES
-------------------------------- */
async function carregarVencedores() {
  const { data, error } = await db
    .from("vencedores")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  vencedoresList.innerHTML = "";

  data.forEach(v => {
    const li = document.createElement("li");
    li.innerHTML = `
      🎉 <strong>${v.nome}</strong> —
      Bilhete ${v.bilhete}
      <small>(${new Date(v.created_at).toLocaleString()})</small>
    `;
    vencedoresList.appendChild(li);
  });
}

/* INIT */
carregarCompras();
