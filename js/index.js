const TOTAL = 120;
const grid = document.getElementById("ticketGrid");
const soldCount = document.getElementById("soldCount");
const availCount = document.getElementById("availCount");
const formArea = document.getElementById("formArea");

let selectedTicket = null;

async function carregarBilhetes() {
  const { data = [] } = await db.from("compras").select("bilhete");
  const vendidos = data.map(v => v.bilhete);

  grid.innerHTML = "";

  for (let i = 1; i <= TOTAL; i++) {
    const div = document.createElement("div");
    div.className = "ticket";
    div.textContent = i;

    if (vendidos.includes(i)) {
      div.classList.add("sold");
    } else {
      div.onclick = () => abrirFormulario(i);
    }
    grid.appendChild(div);
  }

  soldCount.textContent = vendidos.length;
  availCount.textContent = TOTAL - vendidos.length;
}

function abrirFormulario(n) {
  selectedTicket = n;
  document.getElementById("ticketNumber").textContent = n;
  formArea.classList.remove("hidden");
}

document.getElementById("cancelar").onclick = () => {
  formArea.classList.add("hidden");
};

document.getElementById("confirmar").onclick = async () => {
  const nome = nomeInput.value.trim();
  const telefone = telefoneInput.value.trim();
  const email = emailInput.value.trim();
  const nascimento = nascimentoInput.value || null;
  const cidade = cidadeInput.value || null;
  const pais = paisInput.value || null;
  const file = comprovativoInput.files[0];

  if (!nome || !telefone || !email || !file) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  const fileName = `${Date.now()}_${file.name}`;
  const upload = await db.storage.from("comprovativos").upload(fileName, file);

  if (upload.error) {
    alert("Erro no upload do comprovativo.");
    return;
  }

  const { data: url } = db.storage.from("comprovativos").getPublicUrl(fileName);

  const { error } = await db.from("compras").insert({
    bilhete: selectedTicket,
    nome,
    telefone,
    email,
    nascimento,
    cidade,
    pais,
    comprovativo: url.publicUrl
  });

  if (error) {
    alert("Erro ao gravar compra.");
    return;
  }

  document.getElementById("mBilhete").textContent = selectedTicket;
  document.getElementById("mNome").textContent = nome;
  document.getElementById("modal").classList.remove("hidden");

  formArea.classList.add("hidden");
  carregarBilhetes();
};

function fecharModal() {
  document.getElementById("modal").classList.add("hidden");
}

const nomeInput = document.getElementById("nome");
const telefoneInput = document.getElementById("telefone");
const emailInput = document.getElementById("email");
const nascimentoInput = document.getElementById("nascimento");
const cidadeInput = document.getElementById("cidade");
const paisInput = document.getElementById("pais");
const comprovativoInput = document.getElementById("comprovativo");

carregarBilhetes();
