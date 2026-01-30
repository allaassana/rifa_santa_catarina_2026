const SUPABASE_URL = "https://SEU_PROJETO.supabase.co";
const SUPABASE_KEY = "SUA_ANON_KEY";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const TOTAL = 120;
let bilheteAtual = null;

document.addEventListener("DOMContentLoaded", async () => {
  await carregarBilhetes();
});

async function carregarBilhetes() {
  const { data } = await supabase.from("compras").select("bilhete");

  const vendidos = data.map(d => d.bilhete);
  const grid = document.getElementById("bilhetes");
  grid.innerHTML = "";

  let vendidosCount = vendidos.length;

  for (let i = 1; i <= TOTAL; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;

    if (vendidos.includes(i)) {
      btn.classList.add("vendido");
    } else {
      btn.onclick = () => abrirFormulario(i);
    }

    grid.appendChild(btn);
  }

  document.getElementById("vendidos").textContent = vendidosCount;
  document.getElementById("disponiveis").textContent = TOTAL - vendidosCount;
}

function abrirFormulario(num) {
  bilheteAtual = num;
  document.getElementById("formCompra").classList.remove("hidden");
  document.getElementById("bilheteSelecionado").textContent = `Bilhete Nº ${num}`;
}

function fecharFormulario() {
  document.getElementById("formCompra").classList.add("hidden");
}

document.getElementById("confirmar").onclick = async () => {
  const file = document.getElementById("comprovativo").files[0];
  let comprovativo_url = null;

  if (file) {
    const path = `comprovativos/${Date.now()}_${file.name}`;
    await supabase.storage.from("comprovativos").upload(path, file);
    comprovativo_url = path;
  }

  await supabase.from("compras").insert({
    bilhete: bilheteAtual,
    nome: nome.value,
    telefone: telefone.value,
    email: email.value,
    data_nascimento: data_nascimento.value,
    cidade: cidade.value,
    pais: pais.value,
    comprovativo_url,
    status: "pendente"
  });

  alert("Compra registada. Envie o comprovativo.");
  fecharFormulario();
  carregarBilhetes();
};
