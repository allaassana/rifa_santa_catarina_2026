// ================================
// SUPABASE (SEM DUPLICAR VARIÁVEL)
// ================================
const SUPABASE_URL = "https://ydyuxumwquhomahaxet.supabase.co";
const SUPABASE_KEY = "sb_publishable_mTc8Aoplv-HTj-23xoMZ_w_gzoQkN3u";

// ⚠️ NÃO usar "const supabase"
const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ================================
const TOTAL_BILHETES = 120;
let bilheteAtual = null;

// ================================
async function carregarBilhetes() {
  const grid = document.getElementById("bilhetes");
  grid.innerHTML = "";

  const { data, error } = await db
    .from("compras")
    .select("bilhete");

  if (error) {
    console.error(error);
    alert("Erro ao carregar bilhetes");
    return;
  }

  const vendidos = data.map(b => b.bilhete);

  document.getElementById("vendidos").innerText = vendidos.length;
  document.getElementById("disponiveis").innerText =
    TOTAL_BILHETES - vendidos.length;

  for (let i = 1; i <= TOTAL_BILHETES; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    btn.className = "bilhete";

    if (vendidos.includes(i)) {
      btn.classList.add("vendido");
      btn.disabled = true;
    } else {
      btn.onclick = () => selecionarBilhete(i);
    }

    grid.appendChild(btn);
  }
}

// ================================
function selecionarBilhete(numero) {
  bilheteAtual = numero;
  document.getElementById("bilheteSelecionado").innerText =
    `Bilhete Nº ${numero}`;
  document.getElementById("formulario").classList.remove("hidden");
}

function cancelar() {
  document.getElementById("formulario").classList.add("hidden");
  bilheteAtual = null;
}

// ================================
async function confirmarCompra() {
  if (!bilheteAtual) return;

  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const email = document.getElementById("email").value;
  const data_nascimento = document.getElementById("data_nascimento").value;
  const cidade = document.getElementById("cidade").value;
  const pais = document.getElementById("pais").value;

  if (!nome || !telefone || !email) {
    alert("Preencha os campos obrigatórios");
    return;
  }

  const { error } = await db.from("compras").insert([{
    bilhete: bilheteAtual,
    nome,
    telefone,
    email,
    data_nascimento,
    cidade,
    pais,
    valor: "20 € / 2.200 CVE"
  }]);

  if (error) {
    console.error(error);
    alert("Erro ao registar compra");
    return;
  }

  alert("Compra registada com sucesso!");
  cancelar();
  carregarBilhetes();
}

// ================================
document.addEventListener("DOMContentLoaded", carregarBilhetes);
