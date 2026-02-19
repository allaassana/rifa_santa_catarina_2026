const grid = document.getElementById("grid");
const detalhes = document.getElementById("detalhes");
const vencedoresList = document.getElementById("vencedores");
const sortearBtn = document.getElementById("sortear");

/* ===============================
   CARREGAR COMPRAS + CONTADORES
================================ */
async function carregarCompras() {
  const { data, error } = await db.from("compras").select("*");
  if (error) return console.error(error);

  const vendidos = data.map(c => c.bilhete);

  /* CONTADORES */
  const soldEl = document.getElementById("soldCount");
  const availEl = document.getElementById("availableCount");

  if (soldEl) soldEl.textContent = vendidos.length;
  if (availEl) availEl.textContent = 120 - vendidos.length;

  /* GRID */
  grid.innerHTML = "";

  for (let i = 1; i <= 120; i++) {
    const btn = document.createElement("div");
    btn.className = vendidos.includes(i) ? "sold ticket" : "available ticket";
    btn.textContent = i;

    btn.onclick = () => {
      const compra = data.find(c => c.bilhete === i);

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
}

/* ===============================
   SORTEAR VENCEDOR
================================ */
sortearBtn.onclick = async () => {
  const { data: compras } = await db.from("compras").select("*");
  const { data: vencedores } = await db.from("vencedores").select("bilhete");

  const jaSorteados = vencedores.map(v => v.bilhete);
  const elegiveis = compras.filter(c => !jaSorteados.includes(c.bilhete));

  if (elegiveis.length === 0) {
    alert("Todos os bilhetes já foram sorteados!");
    return;
  }

  const vencedor = elegiveis[Math.floor(Math.random() * elegiveis.length)];

  await db.from("vencedores").insert({
    bilhete: vencedor.bilhete,
    nome: vencedor.nome,
    telefone: vencedor.telefone,
    email: vencedor.email,
    data_sorteio: new Date()
  });

  alert(`🎉 Vencedor sorteado!\nBilhete Nº ${vencedor.bilhete} — ${vencedor.nome}`);
  carregarVencedores();
};

/* ===============================
   HISTÓRICO DE VENCEDORES
================================ */
async function carregarVencedores() {
  const { data, error } = await db
    .from("vencedores")
    .select("*")
    .order("data_sorteio", { ascending: false });

  if (error) return console.error(error);

  vencedoresList.innerHTML = "";

  data.forEach(v => {
    const li = document.createElement("li");
    li.textContent = `🎟 ${v.bilhete} — ${v.nome} (${new Date(v.data_sorteio).toLocaleString()})`;
    vencedoresList.appendChild(li);
  });
}

/* INIT */
carregarCompras();
carregarVencedores();
