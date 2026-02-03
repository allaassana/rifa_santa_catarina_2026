// ===============================
// SUPABASE CONFIG (UMA VEZ)
// ===============================
const SUPABASE_URL = "https://yduxumwquhomahaxet.supabase.co";
const SUPABASE_KEY = "sb_publishable_mTc8Aoplv-HTj-23xoMZ_w_gzoQkN3u";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ===============================
// CONFIGURAÇÃO DA RIFA
// ===============================
const TOTAL_BILHETES = 120;
let bilheteAtual = null;

// ===============================
// CARREGAR BILHETES
// ===============================
document.addEventListener("DOMContentLoaded", carregarBilhetes);

async function carregarBilhetes() {
  try {
    const { data, error } = await supabase
      .from("compras")
      .select("bilhete");

    if (error) throw error;

    const vendidos = data.map(i => i.bilhete);
    const container = document.getElementById("bilhetes");
    container.innerHTML = "";

    for (let i = 1; i <= TOTAL_BILHETES; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = vendidos.includes(i) ? "vendido" : "disponivel";

      if (!vendidos.includes(i)) {
        btn.onclick = () => selecionarBilhete(i);
      }

      container.appendChild(btn);
    }

    document.getElementById("vendidos").textContent = vendidos.length;
    document.getElementById("disponiveis").textContent =
      TOTAL_BILHETES - vendidos.length;

  } catch (err) {
    alert("Erro ao carregar bilhetes");
    console.error(err);
  }
}

// ===============================
// FORMULÁRIO
// ===============================
function selecionarBilhete(numero) {
  bilheteAtual = numero;
  document.getElementById("formulario").classList.remove("hidden");
  document.getElementById("bilheteSelecionado").textContent =
    "Bilhete Nº " + numero;
}

function cancelar() {
  bilheteAtual = null;
  document.getElementById("formulario").classList.add("hidden");
}

// ===============================
// CONFIRMAR COMPRA
// ===============================
async function confirmarCompra() {
  if (!bilheteAtual) return;

  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const email = document.getElementById("email").value;

  if (!nome || !telefone || !email) {
    alert("Preencha os campos obrigatórios");
    return;
  }

  const { error } = await supabase.from("compras").insert([{
    bilhete: bilheteAtual,
    nome,
    telefone,
    email,
    data_nascimento: document.getElementById("data_nascimento").value,
    cidade: document.getElementById("cidade").value,
    pais: document.getElementById("pais").value
  }]);

  if (error) {
    alert("Erro ao registrar compra");
    console.error(error);
    return;
  }

  alert("Compra registada com sucesso!\nValor: 20 € / 2.200 CVE");
  cancelar();
  carregarBilhetes();
}
