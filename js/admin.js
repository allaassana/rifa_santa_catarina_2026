// ================================
// SUPABASE
// ================================
const db = window.db;

// ================================
// ELEMENTOS
// ================================
const grid = document.getElementById("grid");
const soldCountEl = document.getElementById("soldCount");
const detailBox = document.getElementById("detailBox");
const winnersList = document.getElementById("winnersList");
const drawBtn = document.getElementById("drawWinner");

const TOTAL = 120;

// ================================
// CARREGAR COMPRAS
// ================================
async function carregarCompras() {
  const { data, error } = await db.from("compras").select("*");

  if (error) {
    console.error(error);
    return;
  }

  grid.innerHTML = "";
  soldCountEl.textContent = data.length;

  for (let i = 1; i <= TOTAL; i++) {
    const div = document.createElement("div");
    div.className = "ticket";
    div.textContent = i;

    const compra = data.find(c => c.bilhete === i);

    if (compra) {
      div.classList.add("sold");
      div.onclick = () => mostrarDetalhes(compra);
    } else {
      div.style.opacity = "0.4";
    }

    grid.appendChild(div);
  }
}

// ================================
// DETALHES + ELIMINAR
// ================================
function mostrarDetalhes(c) {
  detailBox.innerHTML = `
    <p><strong>Bilhete:</strong> ${c.bilhete}</p>
    <p><strong>Nome:</strong> ${c.nome}</p>
    <p><strong>Telefone:</strong> ${c.telefone}</p>
    <p><strong>Email:</strong> ${c.email}</p>
    <button class="btn btn-danger" id="deleteBtn">❌ Eliminar compra</button>
  `;

  document.getElementById("deleteBtn").onclick = async () => {
    if (!confirm("Eliminar esta compra?")) return;

    await db.from("compras").delete().eq("id", c.id);
    detailBox.innerHTML = "Compra eliminada.";
    carregarCompras();
  };
}

// ================================
// VENCEDOR
// ================================
async function carregarVencedor() {
  const { data } = await db
    .from("vencedores")
    .select("*")
    .order("data_sorteio", { ascending: false })
    .limit(1);

  winnersList.innerHTML = "";

  if (data && data.length > 0) {
    const v = data[0];
    winnersList.innerHTML = `<li>🎉 ${v.nome} — Bilhete ${v.bilhete}</li>`;
  }
}

// ================================
// SORTEAR VENCEDOR (MANUAL)
// ================================
drawBtn.onclick = async () => {
  const { data: compras } = await db.from("compras").select("*");

  if (!compras || compras.length === 0) {
    alert("Nenhuma compra registrada.");
    return;
  }

  // Verifica se já existe vencedor
  const { data: existe } = await db.from("vencedores").select("id").limit(1);
  if (existe.length > 0) {
    alert("⚠️ O vencedor já foi sorteado.");
    return;
  }

  const vencedor = compras[Math.floor(Math.random() * compras.length)];

  const { error } = await db.from("vencedores").insert({
    bilhete: vencedor.bilhete,
    nome: vencedor.nome,
    telefone: vencedor.telefone,
    email: vencedor.email
  });

  if (error) {
    console.error(error);
    alert("Erro ao registar vencedor.");
    return;
  }

  alert(`🎉 Vencedor: ${vencedor.nome}`);
  carregarVencedor();
};

// ================================
// INIT
// ================================
document.addEventListener("DOMContentLoaded", () => {
  carregarCompras();
  carregarVencedor();
});
