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
  const { data: compras, error } = await db.from("compras").select("*");

  if (error) {
    console.error("Erro ao carregar compras:", error);
    return;
  }

  grid.innerHTML = "";
  soldCountEl.textContent = compras.length;

  for (let i = 1; i <= TOTAL; i++) {
    const div = document.createElement("div");
    div.className = "ticket";
    div.textContent = i;

    const compra = compras.find(c => c.bilhete === i);

    if (compra) {
      div.classList.add("sold");
      div.onclick = () => {
        detailBox.innerHTML = `
          <p><strong>Bilhete:</strong> ${compra.bilhete}</p>
          <p><strong>Nome:</strong> ${compra.nome}</p>
          <p><strong>Telefone:</strong> ${compra.telefone || "-"}</p>
          <p><strong>Email:</strong> ${compra.email || "-"}</p>
          <p><strong>Cidade:</strong> ${compra.cidade || "-"}</p>
          <p><strong>País:</strong> ${compra.pais || "-"}</p>
        `;
      };
    } else {
      div.style.opacity = "0.4";
      div.style.cursor = "not-allowed";
    }

    grid.appendChild(div);
  }
}

// ================================
// CARREGAR VENCEDOR
// ================================
async function carregarVencedor() {
  const { data, error } = await db
    .from("vencedores")
    .select("*")
    .order("data_sorteio", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Erro ao carregar vencedor:", error);
    return;
  }

  winnersList.innerHTML = "";

  if (data && data.length > 0) {
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
  // Já existe vencedor?
  const { data: existentes } = await db.from("vencedores").select("id");

  if (existentes && existentes.length > 0) return;

  // Buscar compras
  const { data: compras, error } = await db.from("compras").select("*");

  if (error || !compras || compras.length === 0) return;

  const vencedor = compras[Math.floor(Math.random() * compras.length)];

  await db.from("vencedores").insert({
    bilhete: vencedor.bilhete,
    nome: vencedor.nome,
    telefone: vencedor.telefone,
    email: vencedor.email
  });

  alert(`🎉 Vencedor sorteado automaticamente:\n${vencedor.nome}\nBilhete ${vencedor.bilhete}`);
}

// ================================
// INIT
// ================================
document.addEventListener("DOMContentLoaded", async () => {
  await carregarCompras();
  await sortearAutomaticamente();
  await carregarVencedor();
});
