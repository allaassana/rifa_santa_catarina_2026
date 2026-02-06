const TOTAL = 120;
const grid = document.getElementById("ticketGrid");
const form = document.getElementById("formArea");

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

/* =======================
   CARREGAR BILHETES
======================= */
async function carregarBilhetes() {
  const { data } = await db
    .from("compras")
    .select("bilhete");

  const vendidos = data.map(d => d.bilhete);

  grid.innerHTML = "";

  for (let i = 1; i <= TOTAL; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = vendidos.includes(i) ? "sold" : "free";

    if (!vendidos.includes(i)) {
      btn.onclick = () => selecionarBilhete(i);
    }

    grid.appendChild(btn);
  }

  document.getElementById("soldCount").textContent = vendidos.length;
  document.getElementById("availCount").textContent = TOTAL - vendidos.length;
}

carregarBilhetes();

/* =======================
   SELECIONAR
======================= */
function selecionarBilhete(n) {
  bilheteSelecionado = n;
  document.getElementById("ticketNumber").textContent = n;
  form.classList.remove("hidden");
}

/* =======================
   CANCELAR
======================= */
cancelarBtn.onclick = () => {
  form.classList.add("hidden");
  bilheteSelecionado = null;
};

/* =======================
   CONFIRMAR COMPRA
======================= */
confirmarBtn.onclick = async () => {
  if (!bilheteSelecionado) return;

  if (!nomeInput.value || !telefoneInput.value || !emailInput.value) {
    alert("Preenche os campos obrigatórios");
    return;
  }

  let comprovativoUrl = null;

  /* ===== UPLOAD ===== */
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

    const { data } = db.storage
      .from("comprovativos")
      .getPublicUrl(fileName);

    comprovativoUrl = data.publicUrl;
  }

  /* ===== GRAVAR COMPRA ===== */
  const { error } = await db.from("compras").insert([{
    bilhete: bilheteSelecionado,
    nome: nomeInput.value,
    telefone: telefoneInput.value,
    email: emailInput.value,
    data_nascimento: nascimentoInput.value || null,
    cidade: cidadeInput.value || null,
    pais: paisInput.value || null,
    comprovativo_url: comprovativoUrl,
    status: "pendente"
  }]);

  if (error) {
    console.error(error);
    alert("Erro ao gravar compra");
    return;
  }

  alert("Compra registada com sucesso!");

  form.classList.add("hidden");
  bilheteSelecionado = null;

  carregarBilhetes();
};
