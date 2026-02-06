const TOTAL = 120;
let bilheteSelecionado = null;

// ELEMENTOS
const grid = document.getElementById("ticketGrid");
const formArea = document.getElementById("formArea");
const ticketNumber = document.getElementById("ticketNumber");

const nomeInput = document.getElementById("nome");
const telefoneInput = document.getElementById("telefone");
const emailInput = document.getElementById("email");
const nascimentoInput = document.getElementById("nascimento");
const cidadeInput = document.getElementById("cidade");
const paisInput = document.getElementById("pais");
const comprovativoInput = document.getElementById("comprovativo");

const confirmarBtn = document.getElementById("confirmar");
const cancelarBtn = document.getElementById("cancelar");


// ========================
// CARREGAR BILHETES
// ========================
async function carregarBilhetes() {
  const { data, error } = await db
    .from("compras")
    .select("bilhete");

  const vendidos = data ? data.map(d => d.bilhete) : [];

  grid.innerHTML = "";

  for (let i = 1; i <= TOTAL; i++) {
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

  document.getElementById("soldCount").textContent = vendidos.length;
  document.getElementById("availCount").textContent = TOTAL - vendidos.length;
}


// ========================
// SELECIONAR BILHETE
// ========================
function selecionarBilhete(num) {
  bilheteSelecionado = num;
  ticketNumber.textContent = num;
  formArea.classList.remove("hidden");
}


// ========================
// CONFIRMAR COMPRA
// ========================
confirmarBtn.onclick = async () => {

  if (!bilheteSelecionado) {
    alert("Selecione um bilhete");
    return;
  }

  if (!nomeInput.value || !telefoneInput.value || !emailInput.value) {
    alert("Preencha os campos obrigatórios");
    return;
  }

  let comprovativoPath = null;

  // ========= UPLOAD =========
  if (comprovativoInput.files.length > 0) {
    const file = comprovativoInput.files[0];
    const ext = file.name.split(".").pop();
    const fileName = `bilhete_${bilheteSelecionado}_${Date.now()}.${ext}`;

    const { error: uploadError } = await db
      .storage
      .from("comprovativos")
      .upload(fileName, file);

    if (uploadError) {
      alert("Erro no upload do comprovativo");
      return;
    }

    comprovativoPath = fileName;
  }

  // ========= GRAVAR COMPRA =========
  const { error } = await db
    .from("compras")
    .insert([{
      bilhete: bilheteSelecionado,
      nome: nomeInput.value,
      telefone: telefoneInput.value,
      email: emailInput.value,
      data_nascimento: nascimentoInput.value || null,
      cidade: cidadeInput.value || null,
      pais: paisInput.value || null,
      comprovativo: comprovativoPath,
      status: "pendente"
    }]);

  if (error) {
    console.error(error);
    alert("Erro ao gravar compra");
    return;
  }

  alert("Compra registada com sucesso!");
  location.reload();
};


// ========================
// CANCELAR
// ========================
cancelarBtn.onclick = () => {
  formArea.classList.add("hidden");
  bilheteSelecionado = null;
};


// INIT
carregarBilhetes();
