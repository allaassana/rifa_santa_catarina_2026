// ================================
// CLIENTE SUPABASE
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
          <p><strong>Telefone:</strong> ${compra.telefone || "-"}</p>
          <p><strong>Email:</strong> ${compra.email || "-"}</p>
        `;
      };
    } else {
      div.style.opacity = "0.4";
    }

    grid.appendChild(div);
  }
}

// ================================
// CARREGAR VENCEDORES
// ================================
async function carregarVencedores() {
  const { data, error } = await db
    .from("vencedores")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Erro ao carregar vencedores:", error);
    return;
  }

  winnersList.innerHTML = "";

  data.forEach(v => {
    const li = document.createElement("li");
    li.textContent = `🎉 Bilhete ${v.bilhete} — ${v.nome}`;
    winnersList.appendChild(li);
  });
}

// ================================
// SORTEAR VENCEDOR (BOTÃO)
// ================================
drawBtn.onclick = async () => {
  // Verifica se já existe vencedor
  const { data: jaExiste } = await db.from("vencedores").select("*");

  if (jaExiste && jaExiste.length > 0) {
    alert("⚠️ Já existe um vencedor registado.");
    return;
  }

  // Buscar todas as compras (todas confirmadas)
  const { data: compras, error } = await db.from("compras").select("*");

  if (error || !compras || compras.length === 0) {
    alert("Nenhuma compra disponível para sorteio.");
    return;
  }

  // Sorteio aleatório
  const vencedor = compras[Math.floor(Math.random() * compras.length)];

  const { error: insertError } = await db.from("vencedores").insert({
    bilhete: vencedor.bilhete,
    nome: vencedor.nome,
    telefone: vencedor.telefone,
    email: vencedor.email
  });

  if (insertError) {
    console.error(insertError);
    alert("Erro ao registar vencedor.");
    return;
  }

  alert(`🎉 Vencedor sorteado!\n${vencedor.nome} (Bilhete ${vencedor.bilhete})`);
  carregarVencedores();
};

// ================================
// INIT
// ================================
document.addEventListener("DOMContentLoaded", async () => {
  await carregarCompras();
  await carregarVencedores();
});
