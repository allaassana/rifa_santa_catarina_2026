// ================================
// SUPABASE CLIENT (UMA ÚNICA VEZ)
// ================================
const supabase = window.supabase.createClient(
  "https://ydyuxumwqnuhomahaxet.supabase.co",
  "sb_publishable_mTc8Aoplv-HTj-23xoMZ_w_gzoQkN3u"
);

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
    console.error("Erro compras:", error);
    return;
  }

  grid.innerHTML = "";
  soldCountEl.innerText = data.length;

  for (let i = 1; i <= TOTAL; i++) {
    const div = document.createElement("div");
    div.className = "ticket";
    div.innerText = i;

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
// CARREGAR VENCEDORES
// ================================
async function carregarVencedores() {
  const { data, error } = await supabase
    .from("vencedores")
    .select("*")
    .order("data_sorteio", { ascending: false });

  if (error) {
    console.error("Erro vencedores:", error);
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
// SORTEAR VENCEDOR
// ================================
drawBtn.onclick = async () => {
  const { data: compras } = await supabase
    .from("compras")
    .select("*")
    .eq("status", "confirmado");

  if (!compras || compras.length === 0) {
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
carregarCompras();
carregarVencedores();
