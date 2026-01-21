const supabase = window.supabaseClient;

const grid = document.getElementById("grid");
const detailBox = document.getElementById("detailBox");
const soldCountEl = document.getElementById("soldCount");
const historyBox = document.getElementById("history");
const drawBtn = document.getElementById("drawBtn");

const modal = document.getElementById("modal");
const mId = document.getElementById("mId");
const mNome = document.getElementById("mNome");
const mTel = document.getElementById("mTel");
const mEmail = document.getElementById("mEmail");
const mNasc = document.getElementById("mNasc");
const mCidade = document.getElementById("mCidade");
const mPais = document.getElementById("mPais");
const mFeedback = document.getElementById("mFeedback");
const mCompArea = document.getElementById("mCompArea");

const mSave = document.getElementById("mSave");
const mDelete = document.getElementById("mDelete");
const mClose = document.getElementById("mClose");

let currentRow = null;
const TOTAL = 120;

/* ===============================
   CARREGAR COMPRAS
================================ */
async function carregarCompras() {
  const { data } = await supabase.from("compras").select("*");

  grid.innerHTML = "";
  soldCountEl.innerText = data.length;

  for (let i = 1; i <= TOTAL; i++) {
    const div = document.createElement("div");
    div.className = "ticket";
    div.innerText = i;

    const compra = data.find(c => c.bilhete === i);

    if (compra) {
      div.classList.add("sold");
      div.onclick = () => abrirDetalhes(compra);
    } else {
      div.style.opacity = "0.4";
      div.style.cursor = "not-allowed";
    }

    grid.appendChild(div);
  }
}

/* ===============================
   DETALHES
================================ */
function abrirDetalhes(compra) {
  currentRow = compra;

  detailBox.innerHTML = `
    <p><strong>Bilhete:</strong> ${compra.bilhete}</p>
    <p><strong>Nome:</strong> ${compra.nome}</p>
    <p><strong>Status:</strong> ${compra.status}</p>
    <button class="btn" id="openModal">Abrir</button>
  `;

  document.getElementById("openModal").onclick = abrirModal;
}

/* ===============================
   MODAL
================================ */
function abrirModal() {
  modal.style.display = "flex";

  mId.innerText = currentRow.bilhete;
  mNome.value = currentRow.nome;
  mTel.value = currentRow.telefone;
  mEmail.value = currentRow.email;
  mNasc.value = currentRow.data_nascimento || "";
  mCidade.value = currentRow.cidade;
  mPais.value = currentRow.pais;
  mFeedback.value = currentRow.feedback || "";
}

mClose.onclick = () => modal.style.display = "none";

/* ===============================
   CONFIRMAR
================================ */
mSave.onclick = async () => {
  await supabase
    .from("compras")
    .update({ status: "confirmado" })
    .eq("id", currentRow.id);

  modal.style.display = "none";
  carregarCompras();
};

/* ===============================
   SORTEIO
================================ */
drawBtn.onclick = async () => {
  const { data } = await supabase
    .from("compras")
    .select("*")
    .eq("status", "confirmado");

  if (!data || data.length === 0) {
    alert("Nenhuma compra confirmada.");
    return;
  }

  const winner = data[Math.floor(Math.random() * data.length)];

  await supabase.from("vencedores").insert({
    bilhete: winner.bilhete,
    nome: winner.nome,
    telefone: winner.telefone,
    email: winner.email
  });

  alert(`🎉 Vencedor: Bilhete ${winner.bilhete} — ${winner.nome}`);
  carregarHistorico();
};

/* ===============================
   HISTÓRICO
================================ */
async function carregarHistorico() {
  const { data } = await supabase
    .from("vencedores")
    .select("*")
    .order("data_sorteio", { ascending: false });

  historyBox.innerHTML = data.map(v =>
    `<p>🏆 ${v.bilhete} — ${v.nome}</p>`
  ).join("");
}

/* ===============================
   REALTIME
================================ */
supabase
  .channel("compras-realtime")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "compras" },
    carregarCompras
  )
  .subscribe();

/* INIT */
carregarCompras();
carregarHistorico();
