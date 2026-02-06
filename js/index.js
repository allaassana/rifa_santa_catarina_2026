// ===============================
// CONFIG
// ===============================
const TOTAL_BILHETES = 120;

// Inputs
const nomeInput = document.getElementById("nome");
const telefoneInput = document.getElementById("telefone");
const emailInput = document.getElementById("email");
const nascimentoInput = document.getElementById("nascimento");
const cidadeInput = document.getElementById("cidade");
const paisInput = document.getElementById("pais");
const comprovativoInput = document.getElementById("comprovativo");

const grid = document.getElementById("ticketGrid");
const formArea = document.getElementById("formArea");
const ticketNumberSpan = document.getElementById("ticketNumber");
const soldCount = document.getElementById("soldCount");
const availCount = document.getElementById("availCount");

let bilheteSelecionado = null;

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  await carregarBilhetes();
});

// ===============================
// CARREGAR BILHETES
// ===============================
async function carregarBilhetes() {
  grid.innerHTML = "";

  const { data, error } = await db
    .from("compras")
    .select("bilhete");

  if (error) {
    alert("Erro ao carregar bilhetes");
    return;
  }

  const vendidos = data.map(d => d.bilhete);

  soldCount.textContent = vendidos.length;
  availCount.textContent = TOTAL_BILHETES - vendidos.length;

  for (let i = 1; i <= TOTAL_BILHETES; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = "ticket";

    if (vendidos.includes(i)) {
      btn.classList.add("sold");
      btn.disabled = true;
    } else {
      btn.onclick = () => selecionarBilhete(i);
    }

    grid.appendChild(btn);
  }
}

// ===============================
// SELECIONAR BILHETE
// ===============================
function selecionarBilhete(numero) {
  bilheteSelecionado = numero;
  ticketNumberSpan.textContent = numero;
  formArea.classList.remove("hidden");
}

// ===============================
// CANCELAR
// ===============================
document.getElementById("cancelar").onclick = () => {
  formArea.classList.add("hidden");
  bilheteSelecionado = null;
};

// ===============================
// CONFIRMAR COMPRA
// ===============================
document.getElementById("confirmar").onclick = async () => {
  if (!bilheteSelecionado) {
    alert("Selecione um bilhete");
    return;
  }

  if (!nomeInput.value || !telefoneInput.value || !emailInput.value) {
    alert("Preencha os campos obrigatórios");
    return;
  }

  let comprovativoURL = null;

  // UPLOAD
  if (comprovativoInput.files.length > 0) {
    const file = comprovativoInput.files[0];
    const fileName = `${Date.now()}_${file.name}`;

    const { error: uploadError } = await db.storage
      .from("comprovativos")
      .upload(fileName, file);

    if (uploadError) {
      alert("Erro no upload do comprovativo");
      return;
    }

    comprovativoURL = fileName;
  }

  // INSERT COMPRA
  const { error } = await db.from("compras").insert([{
    bilhete: bilheteSelecionado,
    nome: nomeInput.value,
    telefone: telefoneInput.value,
    email: emailInput.value,
    data_nascimento: nascimentoInput.value || null,
    cidade: cidadeInput.value || null,
    pais: paisInput.value || null,
    comprovativo: comprovativoURL,
    status: "pendente"
  }]);

  if (error) {
    alert("Erro ao gravar compra");
    return;
  }

  // RESET
  formArea.classList.add("hidden");
  nomeInput.value = "";
  telefoneInput.value = "";
  emailInput.value = "";
  nascimentoInput.value = "";
  cidadeInput.value = "";
  paisInput.value = "";
  comprovativoInput.value = "";

  await carregarBilhetes();
  alert("Compra realizada com sucesso!");
};
