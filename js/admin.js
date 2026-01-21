// ================================
// SUPABASE (JÁ CRIADO NO HTML)
// ================================
const supabase = window.supabase;

// ================================
// ELEMENTOS
// ================================
const grid = document.getElementById("grid");
const soldCountEl = document.getElementById("soldCount");
const detailBox = document.getElementById("detailBox");
const winnersList = document.getElementById("winnersList");
const drawBtn = document.getElementById("drawWinner");

const TOTAL = 120;
let currentRow = null;

// ================================
// CARREGAR COMPRAS
// ================================
async function carregarCompras() {
  const { data } = await supabase
    .from("compras")
    .select("*");

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
// DETALHES
// ================================
function mostrarDetalhes(compra) {
  currentRow = compra;
  detailBox.innerHTML = `
    <p><strong>Bilhete:</strong> ${compra.bilhete}</p>
    <p><strong>Nome:</strong> ${compra.nome}</p>
    <p><strong>Status:</strong> ${compra.status}</p>
  `;
}

// ================================
// 🎉 SORTEIO
// ================================
drawBtn.onclick = async () => {
  const { data } = await supabase
    .from("compras")
    .select("*")
    .eq("status", "confirmado");

  if (!data || data.length === 0) {
    alert("Nenhuma compra confirmada.");
    return;
  }

  const vencedor = data[Math.floor(Math.random() * data.length)];

  await supabase.from("vencedores").insert({
    bilhete: vencedor.bilhete,
    nome: vencedor.nome,
    telefone: vencedor.telefone,
    email: vencedor.email
  });

  alert(`🎉 Vencedor: Bilhete ${vencedor.bilhete}`);
  carregarVencedores();
};

// ================================
// HISTÓRICO
// ================================
async function carregarVencedores() {
  const { data } = await supabase
    .from("vencedores")
    .select("*")
    .order("data_sorteio", { ascending: false });

  winnersList.innerHTML = "";

  data.forEach(v => {
    const li = document.createElement("li");
    li.textContent = `🎟️ ${v.bilhete} — ${v.nome}`;
    winnersList.appendChild(li);
  });
}

// ================================
// REALTIME
// ================================
supabase
  .channel("compras-realtime")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "compras" },
    carregarCompras
  )
  .subscribe();

// ================================
// INIT
// ================================
carregarCompras();
carregarVencedores();
