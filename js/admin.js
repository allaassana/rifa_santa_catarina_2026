const grid = document.getElementById("grid");
const detalhes = document.getElementById("detalhes");
const vencedoresList = document.getElementById("vencedores");
const sortearBtn = document.getElementById("sortear");

let comprasCache = [];

/* ===============================
   CARREGAR COMPRAS
================================ */
async function carregarCompras() {
  const { data, error } = await db.from("compras").select("*");
  if (error) return console.error(error);

  comprasCache = data;
  const vendidos = data.map(c => c.bilhete);

  document.getElementById("soldCount").textContent = vendidos.length;
  document.getElementById("availableCount").textContent = 120 - vendidos.length;

  grid.innerHTML = "";

  for (let i = 1; i <= 120; i++) {
    const btn = document.createElement("div");
    btn.textContent = i;
    btn.className = vendidos.includes(i)
      ? "ticket sold"
      : "ticket available";

    btn.onclick = () => mostrarDetalhes(i);
    grid.appendChild(btn);
  }
}

/* ===============================
   DETALHES + ELIMINAR
================================ */
function mostrarDetalhes(numero) {
  const compra = comprasCache.find(c => c.bilhete === numero);

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
    <button onclick="eliminarCompra(${compra.bilhete})">
      🗑️ Eliminar comprador
    </button>
  `;
}

/* ===============================
   ELIMINAR COMPRA
================================ */
async function eliminarCompra(bilhete) {
  if (!confirm("Tens a certeza que queres eliminar este comprador?")) return;

  const { error } = await db
    .from("compras")
    .delete()
    .eq("bilhete", bilhete);

  if (error) {
    alert("Erro ao eliminar comprador.");
    console.error(error);
    return;
  }

  detalhes.innerHTML = "<p>Compra eliminada.</p>";
  carregarCompras();
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

  alert(`🎉 Vencedor: Bilhete ${vencedor.bilhete} — ${vencedor.nome}`);
  carregarVencedores();
};

/* ===============================
   VENCEDORES
================================ */
async function carregarVencedores() {
  const { data } = await db
    .from("vencedores")
    .select("*")
    .order("data_sorteio", { ascending: false });

  vencedoresList.innerHTML = "";
  data.forEach(v => {
    const li = document.createElement("li");
    li.textContent = `🎟 ${v.bilhete} — ${v.nome}`;
    vencedoresList.appendChild(li);
  });
}

/* INIT */
carregarCompras();
carregarVencedores();
