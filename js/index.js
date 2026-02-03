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
      div.onclick = () => selecionarBilhete(i);
    }

    grid.appendChild(div);
  }

  soldCount.textContent = vendidos.length;
  availCount.textContent = TOTAL - vendidos.length;
}

function selecionarBilhete(n) {
  selectedTicket = n;
  document.getElementById("ticketNumber").textContent = n;
  formArea.classList.remove("hidden");
}

document.getElementById("cancelBtn").onclick = () => {
  formArea.classList.add("hidden");
  selectedTicket = null;
};

document.getElementById("confirmBtn").onclick = async () => {
  if (!selectedTicket) {
    alert("Selecione um bilhete primeiro.");
    return;
  }

  const nome = nome.value.trim();
  const tel = tel.value.trim();
  const email = email.value.trim();
  const file = comprovativo.files[0];

  if (!nome || !tel || !email || !file) {
    alert("Preencha todos os campos.");
    return;
  }

  const fileName = `${Date.now()}_${file.name}`;
  const { error: uploadError } = await db.storage
    .from("comprovativos")
    .upload(fileName, file);

  if (uploadError) return alert("Erro no upload.");

  const { data: url } = db.storage
    .from("comprovativos")
    .getPublicUrl(fileName);

  await db.from("compras").insert({
    bilhete: selectedTicket,
    nome,
    telefone: tel,
    email,
    comprovativo_url: url.publicUrl
  });

  document.getElementById("mBilhete").textContent = selectedTicket;
  document.getElementById("mNome").textContent = nome;

  document.getElementById("modal").classList.remove("hidden");
  formArea.classList.add("hidden");

  carregarBilhetes();
};

function fecharModal() {
  document.getElementById("modal").classList.add("hidden");
  selectedTicket = null;
}

carregarBilhetes();
