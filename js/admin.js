// ===== CONFIGURAÇÃO SUPABASE =====
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

// modal
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
    .select("*")
    .order("bilhete", { ascending: true });

  if (error) {
    alert("Erro ao carregar compras");
    console.error(error);
    return;
  }

  grid.innerHTML = "";
  soldCountEl.innerText = data.length;

  for (let i = 1; i <= 120; i++) {
    const div = document.createElement("div");
    div.className = "ticket";
    div.innerText = i;

    const compra = data.find(c => c.bilhete === i);

    if (compra) {
      div.classList.add("sold");
      if (compra.status === "confirmado") {
        div.classList.add("confirmed");
      }

      div.onclick = () => abrirDetalhes(compra);
    }

    grid.appendChild(div);
  }
}

// ===== ABRIR DETALHES =====
function abrirDetalhes(compra) {
  currentRow = compra;

  detailBox.innerHTML = `
    <p><strong>Bilhete:</strong> ${compra.bilhete}</p>
    <p><strong>Nome:</strong> ${compra.nome}</p>
    <p><strong>Telefone:</strong> ${compra.telefone}</p>
    <p><strong>Email:</strong> ${compra.email}</p>
    <p><strong>Status:</strong> ${compra.status}</p>
    <button class="btn" onclick="abrirModal()">Abrir / Val
