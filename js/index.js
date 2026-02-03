const db = window.db;
const TOTAL = 120;

const grid = document.getElementById("ticketGrid");
const soldCount = document.getElementById("soldCount");
const availCount = document.getElementById("availCount");
const formArea = document.getElementById("formArea");
const modal = document.getElementById("modal");

let selectedTicket = null;

/* GARANTIA ABSOLUTA */
modal.classList.add("hidden");

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
  const nome = nomeInput();
  const tel = value("tel");
  const email = value("email");
  const nasc = value("nasc");
  const cidade = value("cidade");
  const pais = value("pais");
  const file = document.getElementById("comprovativo").files[0];

  if (!nome || !tel || !email || !file) {
    alert("Preencha os campos obrigatórios.");
    return;
  }

  const fileName = `${Date.now()}_${file.name}`;
  const upload = await db.storage.from("comprovativos").upload(fileName, file);
  if (upload.error) return alert("Erro no upload.");

  const url = db.storage.from("comprovativos").getPublicUrl(fileName).data.publicUrl;

  const { error } = await db.from("compras").insert({
    bilhete: selectedTicket,
    nome,
    telefone: tel,
    email,
    data_nascimento: nasc,
    cidade,
    pais,
    comprovativo_url: url
  });

  if (error) return alert("Erro ao gravar compra.");

  document.getElementById("mBilhete").textContent = selectedTicket;
  document.getElementById("mNome").textContent = nome;

  modal.classList.remove("hidden");
  formArea.classList.add("hidden");

  carregarBilhetes();
};

function fecharModal() {
  modal.classList.add("hidden");
  selectedTicket = null;
}

function value(id) {
  return document.getElementById(id).value || null;
}
function nomeInput() {
  return document.getElementById("nome").value.trim();
}

carregarBilhetes();
