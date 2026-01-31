const SUPABASE_URL = "https://ydyuxumwquhomahaxet.supabase.co";
const SUPABASE_KEY = "COLOCA_AQUI_A_PUBLISHABLE_KEY";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const TOTAL = 120;
let bilheteAtual = null;

document.addEventListener("DOMContentLoaded", carregarBilhetes);

async function carregarBilhetes() {
  const grid = document.getElementById("bilhetes");
  grid.innerHTML = "";

  const { data, error } = await supabase
    .from("compras")
    .select("bilhete");

  if (error) {
    alert("Erro ao carregar bilhetes");
    return;
  }

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
  const nome = nomeInput.value;
  const telefone = telefoneInput.value;
  const email = emailInput.value;

  if (!nome || !telefone || !email) {
    alert("Preenche os campos obrigatórios");
    return;
  }

  const { error } = await supabase.from("compras").insert([{
    bilhete: bilheteAtual,
    nome,
    telefone,
    email,
    data_nascimento: data_nascimento.value,
    cidade: cidade.value,
    pais: pais.value,
    status: "confirmado"
  }]);

  if (error) {
    alert("Erro ao registar compra");
    return;
  }

  alert("Compra registada com sucesso!");
  location.reload();
}
