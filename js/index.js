const SUPABASE_URL = "https://ydyuxumwquhomahaxet.supabase.co";
const SUPABASE_KEY = "COLOCA_AQUI_A_PUBLISHABLE_KEY";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const TOTAL = 120;
let bilheteAtual = null;

document.addEventListener("DOMContentLoaded", carregarBilhetes);

async function carregarBilhetes() {
  const grid = document.getElementById("bilhetes");
  grid.innerHTML = "";

  const { data, error } = await client
    .from("compras")
    .select("bilhete");

  if (error) {
    alert("Erro ao carregar bilhetes");
    console.error(error);
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
  document.getElementById("bilheteSelecionado").textContent = `Bilhete Nº ${n}`;
  document.getElementById("formulario").classList.remove("hidden");
}

function cancelar() {
  document.getElementById("formulario").classList.add("hidden");
}

async function confirmarCompra() {
  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const email = document.getElementById("email").value;

  if (!nome || !telefone || !email) {
    alert("Preenche os campos obrigatórios");
    return;
  }

  const { error } = await client.from("compras").insert([{
    bilhete: bilheteAtual,
    nome,
    telefone,
    email,
    data_nascimento: document.getElementById("data_nascimento").value,
    cidade: document.getElementById("cidade").value,
    pais: document.getElementById("pais").value,
    status: "confirmado"
  }]);

  if (error) {
    alert("Erro ao registar compra");
    console.error(error);
    return;
  }

  alert("Compra registada com sucesso!");
  location.reload();
}
