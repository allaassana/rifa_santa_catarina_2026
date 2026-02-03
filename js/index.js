// ===============================
// SUPABASE (UMA ÚNICA VEZ)
// ===============================
const SUPABASE_URL = "https://yduxumwquhomahaxet.supabase.co";
const SUPABASE_KEY = "sb_publishable_mTc8Aoplv-HTj-23xoMZ_w_gzoQkN3u";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ===============================
const TOTAL = 120;
let bilheteSelecionado = null;

// ===============================
document.addEventListener("DOMContentLoaded", () => {
  gerarBilhetes();
});

// ===============================
async function gerarBilhetes() {
  const grid = document.getElementById("bilhetes");
  grid.innerHTML = "";

  const { data, error } = await supabase
    .from("compras")
    .select("bilhete");

  if (error) {
    console.error(error);
    alert("Erro ao carregar bilhetes");
    return;
  }

  const vendidos = data.map(b => b.bilhete);

  for (let i = 1; i <= TOTAL; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;

    if (vendidos.includes(i)) {
      btn.className = "vendido";
    } else {
      btn.className = "disponivel";
      btn.onclick = () => selecionarBilhete(i);
    }

    grid.appendChild(btn);
  }

  document.getElementById("vendidos").textContent = vendidos.length;
  document.getElementById("disponiveis").textContent =
    TOTAL - vendidos.length;
}

// ===============================
function selecionarBilhete(numero) {
  bilheteSelecionado = numero;
  document.getElementById("formulario").classList.remove("hidden");
  document.getElementById("bilheteSelecionado").textContent =
    "Bilhete Nº " + numero;
}

// ===============================
function cancelar() {
  bilheteSelecionado = null;
  document.getElementById("formulario").classList.add("hidden");
}

// ===============================
async function confirmarCompra() {
  if (!bilheteSelecionado) return;

  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const email = document.getElementById("email").value;

  if (!nome || !telefone || !email) {
    alert("Preencha os campos obrigatórios");
    return;
  }

  const { error } = await supabase.from("compras").insert([{
    bilhete: bilheteSelecionado,
    nome,
    telefone,
    email,
    cidade: document.getElementById("cidade").value,
    pais: document.getElementById("pais").value
  }]);

  if (error) {
    console.error(error);
    alert("Erro ao registrar compra");
    return;
  }

  alert("Compra registada com sucesso\nValor: 20 € / 2.200 CVE");
  cancelar();
  gerarBilhetes();
}
