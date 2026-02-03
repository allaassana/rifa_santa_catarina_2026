const db = window.db;
const TOTAL = 120;

const grid = document.getElementById("ticketGrid");
const soldCount = document.getElementById("soldCount");
const availCount = document.getElementById("availCount");
const formArea = document.getElementById("formArea");

let selectedTicket = null;

async function carregarBilhetes() {
  const { data = [] } = await db.from("compras").select("bilhete");
  const vendidos = data.map(d => d.bilhete);

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

document.getElementById("cancelBtn").onclick = () => {
  formArea.classList.add("hidden");
  selectedTicket = null;
};

document.getElementById("confirmBtn").onclick = async () => {
  if (selectedTicket === null) {
    alert("Selecione um bilhete.");
    return;
  }

  const nome = nomeInput.value.trim();
  const tel = telInput.value.trim();
  const email = emailInput.value.trim();
  const file = comprovativo.files[0];

  if (!nome || !tel || !email || !file) {
    alert("Campos obrigatórios.");
    return;
  }

  const fileName = `${Date.now()}_${file.name}`;
  const { error: uploadError } = await db.storage
    .from("comprovativos")
    .upload(fileName, file);

  if (uploadError) {
    alert("Erro no upload.");
    return;
  }

  const { data: urlData } = db.storage
    .from("comprovativos")
    .getPublicUrl(fileName);

  const { error } = await db.from("compras").insert({
    bilhete: selectedTicket,
    nome,
    telefone: tel,
    email,
    comprovativo_url: urlData.publicUrl
  });

  if (error) {
    alert("Erro ao guardar.");
    return;
  }

  // MODAL SÓ AQUI
  mBilhete.textContent = selectedTicket;
  mNome.textContent = nome;
  modal.classList.remove("hidden");

  selectedTicket = null;
  formArea.classList.add("hidden");
  carregarBilhetes();
};

function fecharModal() {
  modal.classList.add("hidden");
}

carregarBilhetes();
