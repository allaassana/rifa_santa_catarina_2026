// ================================
// ELEMENTOS
// ================================
const grid = document.getElementById("grid");
const detailBox = document.getElementById("detailBox");
const soldCountEl = document.getElementById("soldCount");
const winnersList = document.getElementById("winnersList");

const TOTAL = 120;
let comprasCache = [];

// ================================
// CARREGAR COMPRAS
// ================================
async function carregarCompras() {
  const { data, error } = await window.supabase
    .from("compras")
    .select("*");

  if (error) {
    console.error("Erro compras:", error);
    return;
  }

  comprasCache = data || [];
  soldCountEl.innerText = comprasCache.length;
  grid.innerHTML = "";

  for (let i = 1; i <= TOTAL; i++) {
    const div = document.createElement("div");
    div.className = "ticket";
    div.innerText = i;

    const compra = comprasCache.find(c => c.bilhete === i);

    if (compra) {
      div.classList.add("sold");
      div.onclick = () => mostrarDetalhes(compra);
    } else {
      div.style.opacity = "0.3";
    }

    grid.appendChild(div);
  }
}

// ================================
// DETALHES
// ================================
function mostrarDetalhes(compra) {
  detailBox.innerHTML = `
    <p><strong>Bilhete:</strong> ${compra.bilhete}</p>
    <p><strong>Nome:</strong> ${compra.nome}</p>
    <p><strong>Status:</strong> ${compra.status}</p>
  `;
}

// ================================
// SORTEAR VENCEDOR
// ================================
document.getElementById("drawWinner").onclick = async () => {
  const confirmadas = comprasCache.filter(
    c => c.status === "confirmado"
  );

  if (confirmadas.length === 0) {
    alert("Nenhuma compra confirmada.");
    return;
  }

  const vencedor =
    confirmadas[Math.floor(Math.random() * confirmadas.length)];

  const { error } = await window.supabase
    .from("vencedores")
    .insert({
      bilhete: vencedor.bilhete,
      nome: vencedor.nome,
      telefone: vencedor.telefone,
      email: vencedor.email
    });

  if (error) {
    console.error("Erro ao gravar vencedor:", error);
    alert("Erro ao gravar vencedor.");
    return;
  }

  alert(`🎉 Vencedor: Bilhete ${vencedor.bilhete} — ${vencedor.nome}`);
  carregarVencedores();
};

// ================================
// CARREGAR HISTÓRICO DE VENCEDORES
// ================================
async function carregarVencedores() {
  winnersList.innerHTML = "";

  const { data, error } = await window.supabase
    .from("vencedores")
    .select("*")
    .order("data_sorteio", { ascending: false });

  if (error) {
    console.error("Erro vencedores:", error);
    winnersList.innerHTML = "<li>Erro ao carregar vencedores</li>";
    return;
  }

  if (!data || data.length === 0) {
    winnersList.innerHTML = "<li>Nenhum vencedor ainda</li>";
    return;
  }

  data.forEach(v => {
    const li = document.createElement("li");
    li.innerText = `🏆 Bilhete ${v.bilhete} — ${v.nome}`;
    winnersList.appendChild(li);
  });
}

// ================================
// INIT
// ================================
carregarCompras();
carregarVencedores();
