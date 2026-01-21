// ===== SUPABASE =====
const SUPABASE_URL = "https://ydyuxumwqnuhomahaxet.supabase.co";
const SUPABASE_KEY = "sb_publishable_mTc8Aoplv-HTj-23xoMZ_w_gzoQkN3u";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ===== ELEMENTOS =====
const grid = document.getElementById("grid");
const detailBox = document.getElementById("detailBox");
const soldCountEl = document.getElementById("soldCount");

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

// ===== CARREGAR COMPRAS =====
async function carregarCompras() {
  const { data, error } = await supabase
    .from("compras")
    .select("*");

  if (error) {
    console.error(error);
    alert("Erro ao carregar compras");
    return;
  }

  grid.innerHTML = "";
  soldCountEl.innerText = data.length;

  for (let i = 1; i <= 120; i++) {
    const ticket = document.createElement("div");
    ticket.className = "ticket";
    ticket.innerText = i;

    const compra = data.find(c => c.bilhete === i);

    // 🔒 REGRA FINAL (IGUAL AO INDEX.HTML)
    if (compra) {
      ticket.classList.add("sold");
      ticket.onclick = () => abrirDetalhes(compra);
    } else {
      ticket.style.opacity = "0.4";
      ticket.style.cursor = "default";
    }

    grid.appendChild(ticket);
  }
}

// ===== DETALHES =====
function abrirDetalhes(compra) {
  currentRow = compra;

  detailBox.innerHTML = `
    <p><strong>Bilhete:</strong> ${compra.bilhete}</p>
    <p><strong>Nome:</strong> ${compra.nome}</p>
    <p><strong>Telefone:</strong> ${compra.telefone}</p>
    <p><strong>Email:</strong> ${compra.email}</p>
    <p><strong>Status:</strong> ${compra.status}</p>
    <button class="btn" onclick="abrirModal()">Abrir</button>
  `;
}

// ===== MODAL =====
function abrirModal() {
  modal.style.display = "block";

  mId.innerText = currentRow.bilhete;
  mNome.value = currentRow.nome;
  mTel.value = currentRow.telefone;
  mEmail.value = currentRow.email;
  mNasc.value = currentRow.data_nascimento || "";
  mCidade.value = currentRow.cidade;
  mPais.value = currentRow.pais;
  mFeedback.value = currentRow.feedback || "";
}

mClose.onclick = () => {
  modal.style.display = "none";
  currentRow = null;
};

// ===== REALTIME 🔥 =====
supabase
  .channel("compras-realtime")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "compras" },
    () => {
      console.log("🔄 Atualização em tempo real");
      carregarCompras();
    }
  )
  .subscribe();

// ===== INIT =====
carregarCompras();
