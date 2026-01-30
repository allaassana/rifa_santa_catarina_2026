import { supabase } from "./supabase.js";

const TOTAL = 120;
let bilheteAtual = null;

document.addEventListener("DOMContentLoaded", carregarBilhetes);

async function carregarBilhetes() {
  const grid = document.getElementById("bilhetes");
  grid.innerHTML = "";

  const { data } = await supabase
    .from("compras")
    .select("bilhete");

  const ocupados = data.map(d => d.bilhete);

  for (let i = 1; i <= TOTAL; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = "numero";

    if (ocupados.includes(i)) {
      btn.classList.add("vendido");
      btn.disabled = true;
    } else {
      btn.onclick = () => abrirFormulario(i);
    }

    grid.appendChild(btn);
  }

  document.getElementById("vendidos").textContent = ocupados.length;
  document.getElementById("disponiveis").textContent = TOTAL - ocupados.length;
}

function abrirFormulario(n) {
  bilheteAtual = n;
  document.getElementById("bilheteSelecionado").textContent =
    `Bilhete Nº ${n}`;
  document.getElementById("formulario").classList.remove("hidden");
}

document.getElementById("cancelar").onclick = () => {
  document.getElementById("formulario").classList.add("hidden");
};

document.getElementById("confirmar").onclick = async () => {
  const nome = nome.value;
  const telefone = telefone.value;
  const email = email.value;
  const file = comprovativo.files[0];

  if (!nome || !telefone || !email || !file) {
    alert("Preenche todos os campos obrigatórios");
    return;
  }

  // Upload comprovativo
  const filePath = `comprovativos/${Date.now()}-${file.name}`;
  await supabase.storage
    .from("comprovativos")
    .upload(filePath, file);

  const { data: url } = supabase
    .storage
    .from("comprovativos")
    .getPublicUrl(filePath);

  // Inserir compra
  await supabase.from("compras").insert({
    bilhete: bilheteAtual,
    nome,
    telefone,
    email,
    data_nascimento: data_nascimento.value,
    cidade: cidade.value,
    pais: pais.value,
    comprovativo_url: url.publicUrl,
    status: "pendente"
  });

  alert("Compra registada! Receberás confirmação via WhatsApp.");
  location.reload();
};
