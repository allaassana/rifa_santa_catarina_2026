// ================================
// ELEMENTOS
// ================================
const grid = document.getElementById("grid");
const detailBox = document.getElementById("detailBox");
const soldCountEl = document.getElementById("soldCount");
const historyBox = document.getElementById("history");

const modal = document.getElementById("modal");
const mId = document.getElementById("mId");
const mNome = document.getElementById("mNome");
const mTel = document.getElementById("mTel");
const mEmail = document.getElementById("mEmail");

const mSave = document.getElementById("mSave");
const mDelete = document.getElementById("mDelete");
const mClose = document.getElementById("mClose");

let currentRow = null;
const TOTAL = 120;

// ================================
// CARREGAR COMPRAS
// ================================
async function carregarCompras() {
  const { data, error } = await window.supabase
    .from("compras")
    .select("*");

  if (error) return console.error(error);

  grid.innerHTML = "";
  soldCountEl.innerText = data.length;

  const vendidos = data.map(c => c.bilhete);

  for (let i = 1; i <= TOTAL; i++) {
    const div = document.createElement("div");
    div.className = "ticket";
    div.innerText = i;

    const compra = data.find(c => c.bilhete === i);

    if (vendidos.includes(i)) {
      div.classList.add("sold");
      div.onclick = () => abrirDetalhes(compra);
    } else {
      div.style.opacity = "0.4";
    }

    grid.appendChild(div);
  }
}

// ================================
// DETALHES
// ================================
function abrirDetalhes(compra) {
  currentRow = compra;

  detailBox.innerHTML = `
    <p><strong>Bilhete:</strong> ${compra.bilhete}</p>
    <p><strong>Nome:</strong> ${compra.nome}</p>
    <p><strong>Status:</strong> ${compra.status}</p>
    <button class="btn" id="openModal">Abrir</button>
  `;

  document.getElementById("openModal").onclick = () => {
    modal.style.display = "flex";
    mId.innerText = compra.bilhete;
    mNome.value = compra.nome;
    mTel.value = compra.telefone;
    mEmail.value = compra.email;
  };
}

// ================================
// MODAL
// ================================
mClose.onclick = () => {
  modal.style.display = "none";
  currentRow = null;
};

// ================================
// CONFIRMAR
// ================================
mSave.onclick = async () => {
  if (!currentRow) return;

  await window.supabase
    .from("compras")
    .update({ status: "confirmado" })
    .eq("id", currentRow.id);

  modal.style.display = "none";
};

// ================================
// ELIMINAR
// ================================
mDelete.onclick = async () => {
  if (!currentRow) return;
  if (!confirm("Eliminar compra?")) return;

  await window.supabase
    .from("compras")
    .delete()
    .eq("id", currentRow.id);

  modal.style.display = "none";
};

// ================================
// 🎉 SORTEIO
// ================================
document.getElementById("drawBtn").onclick = async () => {
  const { data } = await window.supabase
    .from("compras")
    .select("*")
    .eq("status", "confirmado");

  if (!data || data.length === 0) {
    alert("Nenhuma compra confirmada.");
    return;
  }

  const vencedor = data[Math.floor(Math.random() * data.length)];

  await window.supabase.from("vencedores").insert({
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
  const { data } = await window.supabase
    .from("vencedores")
    .select("*")
    .order("data_sorteio", { ascending: false });

  historyBox.innerHTML = data.map(v =>
    `<p>🏆 ${v.bilhete} — ${v.nome}</p>`
  ).join("");
}

// ================================
// REALTIME
// ================================
window.supabase
  .channel("compras-realtime")
  .on("postgres_changes",
    { event: "*", schema: "public", table: "compras" },
    carregarCompras
  )
  .subscribe();

// ================================
// INIT
// ================================
carregarCompras();
carregarVencedores();
