// ================================
// SUPABASE (VEM DO admin.html)
// ================================
const supabase = window.supabaseClient;

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
  const { data, error } = await supabase
    .from("compras")
    .select("*");

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
      div.style.cursor = "not-allowed";
    }

    grid.appendChild(div);
  }
}

// ================================
// CARREGAR VENCEDORES
// ================================
async function carregarVencedores() {
  const { data, error } = await supabase
    .from("vencedores")
    .select("*")
    .order("data_sorteio", { ascending: false });

  if (error) {
    console.error("Erro ao carregar vencedores:", error);
    return;
  }

  winnersList.innerHTML = "";

  data.forEach(v => {
    const li = document.createElement("li");
    li.textContent = `🎟️ ${v.bilhete} — ${v.nome}`;
    winnersList.appendChild(li);
  });
}

// ================================
// SORTEIO
// ================================
drawBtn.onclick = async () => {
  const { data: compras, error } = await supabase
    .from("compras")
    .select("*")
    .eq("status", "confirmado");

  if (error || !compras || compras.length === 0) {
    alert("Nenhuma compra confirmada.");
    return;
  }

  const vencedor = compras[Math.floor(Math.random() * compras.length)];

  await supabase.from("vencedores").insert({
    bilhete: vencedor.bilhete,
    nome: vencedor.nome,
    telefone: vencedor.telefone,
    email: vencedor.email
  });

  alert(`🎉 Vencedor: ${vencedor.nome} (Bilhete ${vencedor.bilhete})`);

  carregarVencedores();
};

// ================================
// INIT
// ================================
document.addEventListener("DOMContentLoaded", () => {
  carregarCompras();
  carregarVencedores();
});
