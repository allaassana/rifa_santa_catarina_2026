// ================================
// SUPABASE CONFIG (FINAL)
// ================================
const SUPABASE_URL = "https://ydyuxumwquhomahaxet.supabase.co";
const SUPABASE_KEY = "sb_publishable_mTc8Aoplv-HTj-23xoMZ_w_gzoQkN3u";

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ================================
// VARIÁVEIS
// ================================
const TOTAL_BILHETES = 120;
let bilheteAtual = null;

// ================================
// CARREGAR BILHETES
// ================================
document.addEventListener("DOMContentLoaded", carregarBilhetes);

async function carregarBilhetes() {
  try {
    const { data, error } = await db
      .from("compras")
      .select("bilhete");

    if (error) throw error;

    const vendidos = data.map(b => b.bilhete);

    const grid = document.getElementById("bilhetes");
    grid.innerHTML = "";

    for (let i = 1; i <= TOTAL_BILHETES; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;

      if (vendidos.includes(i)) {
        btn.disabled = true;
        btn.classList.add("vendido");
      } else {
        btn.onclick = () => selecionarBilhete(i);
      }

      grid.appendChild(btn);
    }

    document.getElementById("vendidos").textContent = vendidos.length;
    document.getElementById("disponiveis").textContent =
      TOTAL_BILHETES - vendidos.length;

  } catch (err) {
    console.error(err);
    alert("Erro ao carregar bilhetes");
  }
}

// ================================
// SELECIONAR
// ================================
function selecionarBilhete(numero) {
  bilheteAtual = numero;
  document.getElementById("bilheteSelecionado").textContent =
    "Bilhete Nº " + numero;

  document.getElementById("formulario").classList.remove("hidden");
}

// ================================
// CONFIRMAR COMPRA
// ================================
async function confirmarCompra() {
  try {
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;

    if (!nome || !telefone || !email) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    const { error } = await db.from("compras").insert({
      bilhete: bilheteAtual,
      nome,
      telefone,
      email,
      data_nascimento: document.getElementById("data_nascimento").value,
      cidade: document.getElementById("cidade").value,
      pais: document.getElementById("pais").value
    });

    if (error) throw error;

    alert("Compra registada com sucesso!");
    location.reload();

  } catch (err) {
    console.error(err);
    alert("Erro ao registar compra");
  }
}

// ================================
// CANCELAR
// ================================
function cancelar() {
  document.getElementById("formulario").classList.add("hidden");
  bilheteAtual = null;
}
