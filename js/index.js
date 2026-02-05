/* =========================
   SUPABASE
========================= */
const db = window.db;

/* =========================
   VARIÁVEIS
========================= */
const TOTAL_BILHETES = 120;
let bilheteSelecionado = null;

/* =========================
   ELEMENTOS
========================= */
const grid = document.getElementById("ticketGrid");
const formArea = document.getElementById("formArea");
const ticketNumber = document.getElementById("ticketNumber");
const soldCount = document.getElementById("soldCount");
const availCount = document.getElementById("availCount");

/* =========================
   GERAR BILHETES
========================= */
function gerarBilhetes() {
  grid.innerHTML = "";
  for (let i = 1; i <= TOTAL_BILHETES; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.dataset.numero = i;
    btn.onclick = () => selecionarBilhete(i);
    grid.appendChild(btn);
  }
}

/* =========================
   SELECIONAR BILHETE
========================= */
function selecionarBilhete(numero) {
  const btn = document.querySelector(`[data-numero='${numero}']`);
  if (btn.classList.contains("ocupado")) {
    alert("Este número já está ocupado");
    return;
  }

  bilheteSelecionado = numero;
  ticketNumber.textContent = numero;
  formArea.classList.remove("hidden");
}

/* =========================
   CANCELAR
========================= */
document.getElementById("cancelar").onclick = () => {
  formArea.classList.add("hidden");
  bilheteSelecionado = null;
};

/* =========================
   CONFIRMAR COMPRA
========================= */
document.getElementById("confirmar").onclick = async () => {
  if (!bilheteSelecionado) return;

  const nome = nomeInput.value.trim();
  const telefone = telefoneInput.value.trim();
  const email = emailInput.value.trim();
  const nascimento = document.getElementById("nascimento").value;
  const cidade = cidadeInput.value.trim();
  const pais = paisInput.value.trim();
  const file = comprovativoInput.files[0];

  if (!nome || !telefone || !email || !nascimento || !file) {
    alert("Preencha todos os campos obrigatórios");
    return;
  }

  /* UPLOAD */
  const fileName = `${bilheteSelecionado}_${Date.now()}_${file.name}`;
  const { error: uploadError } = await db.storage
    .from("comprovativos")
    .upload(fileName, file);

  if (uploadError) {
    alert("Erro no upload do comprovativo");
    return;
  }

  /* INSERT COMPRA */
  const { error } = await db.from("compras").insert([{
    bilhete: bilheteSelecionado,
    nome,
    telefone,
    email,
    data_nascimento: nascimento,
    cidade,
    pais,
    comprovativo: fileName,
    status: "pendente"
  }]);

  if (error) {
    alert("Erro ao gravar compra");
    return;
  }

  bloquearBilhete(bilheteSelecionado);
  atualizarContadores();

  mostrarModal(nome, bilheteSelecionado);

  formArea.classList.add("hidden");
};

/* =========================
   BLOQUEAR
========================= */
function bloquearBilhete(numero) {
  const btn = document.querySelector(`[data-numero='${numero}']`);
  if (btn) {
    btn.classList.add("ocupado");
    btn.disabled = true;
  }
}

/* =========================
   SINCRONIZAR COM ADMIN
========================= */
async function sincronizar() {
  const { data } = await db.from("compras").select("bilhete");
  data.forEach(r => bloquearBilhete(r.bilhete));
  atualizarContadores();
}

/* =========================
   CONTADORES
========================= */
function atualizarContadores() {
  const ocupados = document.querySelectorAll(".ocupado").length;
  soldCount.textContent = ocupados;
  availCount.textContent = TOTAL_BILHETES - ocupados;
}

/* =========================
   MODAL
========================= */
function mostrarModal(nome, bilhete) {
  document.getElementById("mNome").textContent = nome;
  document.getElementById("mBilhete").textContent = bilhete;
  document.getElementById("modal").classList.remove("hidden");
}

function fecharModal() {
  document.getElementById("modal").classList.add("hidden");
}

/* =========================
   INPUTS
========================= */
const nomeInput = document.getElementById("nome");
const telefoneInput = document.getElementById("telefone");
const emailInput = document.getElementById("email");
const cidadeInput = document.getElementById("cidade");
const paisInput = document.getElementById("pais");
const comprovativoInput = document.getElementById("comprovativo");

/* =========================
   START
========================= */
document.addEventListener("DOMContentLoaded", () => {
  gerarBilhetes();
  sincronizar();
});
