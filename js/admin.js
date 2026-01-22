// ===============================
// SUPABASE
// ===============================
const db = window.db;

const grid = document.getElementById("grid");
const soldCountEl = document.getElementById("soldCount");
const detailBox = document.getElementById("detailBox");
const winnersList = document.getElementById("winnersList");
const drawBtn = document.getElementById("drawWinner");

const TOTAL = 120;

// ===============================
// COMPRAS
// ===============================
async function carregarCompras() {
  const { data = [] } = await db.from("compras").select("*");

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
          <p><strong>Telefone:</strong> ${compra.telefone}</p>
          <p><strong>Email:</strong> ${compra.email}</p>
          <button onclick="remover(${compra.bilhete})">❌ Eliminar</button>
        `;
      };
    }

    grid.appendChild(div);
  }
}

// ===============================
// ELIMINAR BILHETE
// ===============================
async function remover(bilhete) {
  if (!confirm("Eliminar este bilhete?")) return;

  await db.from("compras").delete().eq("bilhete", bilhete);
  detailBox.textContent = "Bilhete eliminado";
  carregarCompras();
}

// ===============================
// VENCEDORES
// ===============================
async function carregarVencedores() {
  const { data = [] } = await db
    .from("vencedores")
    .select("*")
    .order("data_sorteio", { ascending: false });

  winnersList.innerHTML = "";
  data.forEach(v => {
    const li = document.createElement("li");
    li.textContent = `🎉 Bilhete ${v.bilhete} — ${v.nome}`;
    winnersList.appendChild(li);
  });
}

// ===============================
// SORTEIO (BOTÃO)
// ===============================
drawBtn.onclick = async () => {
  const { data: compras } = await db.from("compras").select("*");

  if (!compras || compras.length === 0) {
    alert("Nenhuma compra registada");
    return;
  }

  const vencedor = compras[Math.floor(Math.random() * compras.length)];

  await db.from("vencedores").insert({
    bilhete: vencedor.bilhete,
    nome: vencedor.nome,
    telefone: vencedor.telefone,
    email: vencedor.email
  });

  alert(`🎉 Vencedor: ${vencedor.nome}`);
  carregarVencedores();
};

// ===============================
document.addEventListener("DOMContentLoaded", () => {
  carregarCompras();
  carregarVencedores();
});
