// ================================
// CONFIGURAÇÃO SUPABASE (CORRETA)
// ================================
const SUPABASE_URL = "https://ydyuxumwquhomahaxet.supabase.co";
const SUPABASE_KEY = "sb_publishable_mTc8Aoplv-HTj-23xoMZ_w_gzoQkN3u";

// usar o client do CDN (SEM duplicar)
const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ================================
// ESTADO
// ================================
const TOTAL_BILHETES = 120;
let bilheteAtual = null;

// ================================
// CARREGAR BILHETES
// ================================
async function carregarBilhetes() {
  const grid = document.getElementById("bilhetes");
  grid.innerHTML = "";

  const { data, error } = await supabase
    .from("compras")
    .select("bilhete");

  if (error) {
    alert("Erro ao carregar bilhetes");
    console.error(error);
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
// SELECIONAR BILHETE
// ================================
function selecionarBilhete(numero) {
  bilheteAtual = numero;
  document.getElementById("bilheteSelecionado").innerText =
    `Bilhete Nº ${numero}`;
  document.getElementById("formulario").classList.remove("hidden");
}

// ================================
// CANCELAR
// ================================
function cancelar() {
  document.getElementById("formulario").classList.add("hidden");
  bilheteAtual = null;
}

// ================================
// CONFIRMAR COMPRA
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

  const { error } = await supabase.from("compras").insert([{
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
    alert("Erro ao registar compra");
    console.error(error);
    return;
  }

  alert("Compra registada com sucesso!");
  cancelar();
  carregarBilhetes();
}

// ================================
// INIT
// ================================
document.addEventListener("DOMContentLoaded", carregarBilhetes);
