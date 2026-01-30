const TOTAL = 120;
let bilheteAtual = null;

document.addEventListener("DOMContentLoaded", carregarBilhetes);

async function carregarBilhetes() {
  const grid = document.getElementById("bilhetes");
  grid.innerHTML = "";

  const { data, error } = await supabase
    .from("compras")
    .select("bilhete");

  const ocupados = data ? data.map(d => d.bilhete) : [];

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
  document.getElementById("bilheteSelecionado").innerText = `Bilhete Nº ${n}`;
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

  await supabase.from("compras").insert([{
    bilhete: bilheteAtual,
    nome,
    telefone,
    email,
    data_nascimento: value("data_nascimento"),
    cidade: value("cidade"),
    pais: value("pais"),
    status: "pendente"
  }]);

  alert("Compra registada. Guarda este comprovativo.");
  location.reload();
}

function value(id) {
  return document.getElementById(id).value;
}
function nomeInput(){return value("nome")}
function telefoneInput(){return value("telefone")}
function emailInput(){return value("email")}
