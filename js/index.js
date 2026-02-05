const TOTAL_BILHETES = 120;

const grid = document.getElementById("ticketGrid");
const formArea = document.getElementById("formArea");
const ticketNumberSpan = document.getElementById("ticketNumber");

const soldCount = document.getElementById("soldCount");
const availCount = document.getElementById("availCount");

let bilheteSelecionado = null;

// ===============================
// CARREGAR BILHETES
// ===============================
async function carregarBilhetes() {
  const { data, error } = await db
    .from("compras")
    .select("bilhete");

  if (error) {
    alert("Erro ao carregar bilhetes");
    console.error(error);
    return;
  }

  const vendidos = data.map(b => b.bilhete);

  soldCount.textContent = vendidos.length;
  availCount.textContent = TOTAL_BILHETES - vendidos.length;

  grid.innerHTML = "";

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
function selecionarBilhete(num) {
  bilheteSelecionado = num;
  ticketNumberSpan.textContent = num;
  formArea.classList.remove("hidden");
  window.scrollTo({ top: formArea.offsetTop, behavior: "smooth" });
}

// ===============================
// CONFIRMAR COMPRA
// ===============================
document.getElementById("confirmar").onclick = async () => {
  const nome = nomeInput.value.trim();
  const telefone = telefoneInput.value.trim();
  const email = emailInput.value.trim();
  const nascimento = nascimentoInput.value;
  const cidade = cidadeInput.value.trim();
  const pais = paisInput.value.trim();
  const file = comprovativoInput.files[0];

  if (!nome || !telefone || !email || !file) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  try {
    // 1️⃣ Upload comprovativo
    const fileName = `${bilheteSelecionado}_${Date.now()}_${file.name}`;

    const { error: uploadError } = await db.storage
      .from("comprovativos")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // 2️⃣ Gravar compra
    const { error: insertError } = await db.from("compras").insert([{
      bilhete: bilheteSelecionado,
      nome,
      telefone,
      email,
      data_nascimento: nascimento || null,
      cidade,
      pais,
      comprovativo: fileName,
      status: "pendente"
    }]);

    if (insertError) throw insertError;

    // 3️⃣ Sucesso
    mostrarModal(nome, bilheteSelecionado);
    formArea.classList.add("hidden");
    carregarBilhetes();

  } catch (err) {
    console.error(err);
    alert("Erro ao gravar compra.");
  }
};

// ===============================
// CANCELAR
// ===============================
document.getElementById("cancelar").onclick = () => {
  formArea.classList.add("hidden");
};

// ===============================
// MODAL
// ===============================
function mostrarModal(nome, bilhete) {
  document.getElementById("mNome").textContent = nome;
  document.getElementById("mBilhete").textContent = bilhete;
  document.getElementById("modal").classList.remove("hidden");
}

function fecharModal() {
  document.getElementById("modal").classList.add("hidden");
}

// ===============================
carregarBilhetes();
