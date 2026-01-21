// ================================
// CLIENTE SUPABASE (GLOBAL)
// ================================
const db = window.db;

// ================================
// ELEMENTOS
// ================================
const grid = document.getElementById("grid");
const soldCountEl = document.getElementById("soldCount");
const detailBox = document.getElementById("detailBox");
const winnersList = document.getElementById("winnersList");

const TOTAL = 120;

// ================================
// CARREGAR COMPRAS
// ================================
async function carregarCompras() {
  const { data, error } = await db.from("compras").select("*");

  if (error) {
    console.error("Erro ao carregar compras:", error);
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
      div.onclick = () => {
        detailBox.innerHTML = `
          <p><strong>Bilhete:</strong> ${compra.bilhete}</p>
          <p><strong>Nome:</strong> ${compra.nome}</p>
          <p><strong>Status:</strong> ${compra.status}</p>
        `;
      };
    } else {
      div.style.opacity = "0.4";
    }

    grid.appendChild(div);
  }
}

// ================================
// CARREGAR VENCEDOR
// ================================
async function carregarVencedor() {
  const { data, error } = await db.from("vencedores").select("*");

  if (error) {
    console.error("Erro ao carregar vencedor:", error);
    return;
  }

  winnersList.innerHTML = "";

  if (data.length > 0) {
    const v = data[0];
    const li = document.createElement("li");
    li.textContent = `🎉 Bilhete ${v.bilhete} — ${v.nome}`;
    winnersList.appendChild(li);
  }
}

// ================================
// SORTEIO AUTOMÁTICO
// ================================
async function sortearAutomaticamente() {
  // Verifica se já existe vencedor
  const { data: existentes } = await db.from("vencedores").select("*");

  if (existentes && existentes.length > 0) return;

  // Busca compras confirmadas
  const { data: compras, error } = await db
    .from("compras")
    .select("*")
    .eq("status", "confirmado");

  if (error || !compras || compras.length === 0) {
    console.warn("Nenhuma compra confirmada para sorteio.");
    return;
  }

  // Sorteia
  const vencedor = compras[Math.floor(Math.random() * compras.length)];

  await db.from("vencedores").insert({
    bilhete: vencedor.bilhete,
    nome: vencedor.nome,
    telefone: vencedor.telefone,
    email: vencedor.email
  });

  alert(`🎉 Vencedor automático: ${vencedor.nome} (Bilhete ${vencedor.bilhete})`);
}

// ================================
// INIT
// ================================
document.addEventListener("DOMContentLoaded", async () => {
  await carregarCompras();
  await sortearAutomaticamente();
  await carregarVencedor();
});
