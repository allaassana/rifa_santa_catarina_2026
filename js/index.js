const SUPABASE_URL = "https://ydyuxumwquhomahaxet.supabase.co";
const SUPABASE_KEY = "COLOCA_AQUI_A_TUA_PUBLISHABLE_KEY";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const TOTAL = 120;
let bilheteAtual = null;

document.addEventListener("DOMContentLoaded", carregarBilhetes);

async function carregarBilhetes() {
  try {
    const grid = document.getElementById("bilhetes");
    grid.innerHTML = "";

    const { data, error } = await supabase
      .from("compras")
      .select("bilhete");

    if (error) throw error;

    const ocupados = data.map(b => b.bilhete);

    for (let i = 1; i <= TOTAL; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = "numero";

      if (ocupados.includes(i)) {
        btn.classList.add("vendido");
        btn.disabled = true;
      } else {
        btn.onclick = () => selecionarBilhete(i);
      }

      grid.appendChild(btn);
    }

    document.getElementById("vendidos").textContent = ocupados.length;
    document.getElementById("disponiveis").textContent = TOTAL - ocupados.length;

  } catch (e) {
    alert("Erro ao carregar bilhetes");
    console.error(e);
  }
}

function selecionarBilhete(n) {
  bilheteAtual = n;
  document.getElementById("bilheteSelecionado").textContent =
    `Bilhete Nº ${n}`;
  document.getElementById("formulario").classList.remove("hidden");
}

function cancelar() {
  document.getElementById("formulario").classList.add("hidden");
}

async function confirmarCompra() {
  try {
    const nome = nomeInput();
    const telefone = telefoneInput();
    const email = emailInput();

    if (!nome || !telefone || !email) {
      alert("Preenche os campos obrigatórios");
      return;
    }

    const { error } = await supabase.from("compras").insert([{
      bilhete: bilheteAtual,
      nome,
      telefone,
      email,
      data_nascimento: value("data_nascimento"),
      cidade: value("cidade"),
      pais: value("pais")
    }]);

    if (error) throw error;

    alert("Compra registada com sucesso!");
    location.reload();

  } catch (e) {
    alert("Erro ao registar compra");
    console.error(e);
  }
}

function value(id) {
  return document.getElementById(id).value;
}
function nomeInput() { return value("nome"); }
function telefoneInput() { return value("telefone"); }
function emailInput() { return value("email"); }
