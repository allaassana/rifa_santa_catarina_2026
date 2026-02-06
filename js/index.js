// ===== CONFIG =====
const TOTAL_BILHETES = 120;

const grid = document.getElementById("ticketGrid");
const form = document.getElementById("formArea");
const ticketNumberSpan = document.getElementById("ticketNumber");

const soldCount = document.getElementById("soldCount");
const availCount = document.getElementById("availCount");

// Inputs
const nomeInput = document.getElementById("nome");
const telefoneInput = document.getElementById("telefone");
const emailInput = document.getElementById("email");
const nascimentoInput = document.getElementById("nascimento");
const cidadeInput = document.getElementById("cidade");
const paisInput = document.getElementById("pais");
const comprovativoInput = document.getElementById("comprovativo");

const confirmarBtn = document.getElementById("confirmar");
const cancelarBtn = document.getElementById("cancelar");

let bilheteSelecionado = null;

// ===== GRID =====
function criarGrid(bilhetesVendidos) {
  grid.innerHTML = "";

  for (let i = 1; i <= TOTAL_BILHETES; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;

    if (bilhetesVendidos.includes(i)) {
      btn.classList.add("sold");
      btn.disabled = true;
    } else {
      btn.classList.add("available");
      btn.onclick = () => selecionarBilhete(i);
    }

    grid.appendChild(btn);
  }

  soldCount.textContent = bilhetesVendidos.length;
  availCount.textContent = TOTAL_BILHETES - bilhetesVendidos.length;
}

// ===== LOAD BILHETES =====
async function carregarBilhetes() {
  const { data, error } = await db
    .from("compras")
    .select("bilhete");

  if (error) {
    console.error(error);
    return;
  }

  const vendidos = data.map(r => r.bilhete);
  criarGrid(vendidos);
}

// ===== SELECIONAR =====
function selecionarBilhete(numero) {
  bilheteSelecionado = numero;
  ticketNumberSpan.textContent = numero;
  form.classList.remove("hidden");
}

// ===== CANCELAR =====
cancelarBtn.onclick = () => {
  form.classList.add("hidden");
  bilheteSelecionado = null;
};

// ===== CONFIRMAR =====
confirmarBtn.onclick = async () => {
  if (!bilheteSelecionado) {
    alert("Selecione um bilhete.");
    return;
  }

  if (!nomeInput.value || !telefoneInput.value || !emailInput.value) {
    alert("Preencha os campos obrigatórios.");
    return;
  }

  let comprovativoUrl = null;

  // ===== UPLOAD =====
  if (comprovativoInput.files.length > 0) {
    const file = comprovativoInput.files[0];
    const fileName = `${Date.now()}_${file.name}`;

    const { error: uploadError } = await db.storage
      .from("comprovativos")
      .upload(fileName, file);

    if (uploadError) {
      console.error(uploadError);
      alert("Erro no upload do comprovativo.");
      return;
    }

    const { data: publicUrl } = db.storage
      .from("comprovativos")
      .getPublicUrl(fileName);

    comprovativoUrl = publicUrl.publicUrl;
  }

  // ===== INSERT COMPRA =====
  const { error } = await db.from("compras").insert({
    bilhete: bilheteSelecionado,
    nome: nomeInput.value,
    telefone: telefoneInput.value,
    email: emailInput.value,
    data_nascimento: nascimentoInput.value || null,
    cidade: cidadeInput.value || null,
    pais: paisInput.value || null,
    comprovativo_url: comprovativoUrl,
    status: "pendente"
  });

  if (error) {
    console.error(error);
    alert("Erro ao gravar compra.");
    return;
  }

  // ===== SUCESSO =====
  alert("Compra registada com sucesso!");

  // ===== RESET UI (LAYOUT FIX) =====
  nomeInput.value = "";
  telefoneInput.value = "";
  emailInput.value = "";
  nascimentoInput.value = "";
  cidadeInput.value = "";
  paisInput.value = "";
  comprovativoInput.value = "";

  form.classList.add("hidden");
  bilheteSelecionado = null;

  // Recarregar grid (sincroniza com admin)
  carregarBilhetes();
};

// ===== INIT =====
carregarBilhetes();
