const TOTAL = 120;
let bilheteAtual = null;

document.addEventListener("DOMContentLoaded", carregarBilhetes);

async function carregarBilhetes() {
  const grid = document.getElementById("bilhetes");
  grid.innerHTML = "";

  const { data, error } = await supabaseClient
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
  const nome = nomeInput();
  const telefone = telefoneInput();
  const email = emailInput();

  if (!nome || !telefone || !email) {
    alert("Preenche os campos obrigatórios");
    return;
  }

  const { error } = await supabaseClient.from("compras").insert({
    bilhete: bilheteAtual,
    nome,
    telefone,
    email,
    data_nascimento: value("data_nascimento"),
    cidade: value("cidade"),
    pais: value("pais"),
    status: "confirmado"
  });

  if (error) {
    alert("Erro ao registar compra");
    return;
  }

  alert("Compra registada com sucesso!");
  location.reload();
}

const value = id => document.getElementById(id).value;
const nomeInput = () => value("nome");
const telefoneInput = () => value("telefone");
const emailInput = () => value("email");
