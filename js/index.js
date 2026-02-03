const db = window.db;
const TOTAL = 120;

const grid = document.getElementById("ticketGrid");
const soldCount = document.getElementById("soldCount");
const availCount = document.getElementById("availCount");
const formArea = document.getElementById("formArea");

let selectedTicket = null;

async function carregarBilhetes() {
  const { data = [] } = await db.from("compras").select("bilhete");
  const vendidos = data.map(b => b.bilhete);

  grid.innerHTML = "";

  for (let i = 1; i <= TOTAL; i++) {
    const d = document.createElement("div");
    d.className = "ticket";
    d.textContent = i;

    if (vendidos.includes(i)) {
      d.classList.add("sold");
    } else {
      d.onclick = () => abrirFormulario(i);
    }
    grid.appendChild(d);
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
};

document.getElementById("confirmBtn").onclick = async () => {
  const nome = nomeInput.value.trim();
  const tel = telInput.value.trim();
  const email = emailInput.value.trim();
  const file = comprovativo.files[0];

  if (!nome || !tel || !email || !file) {
    alert("Preencha os campos obrigatórios.");
    return;
  }

  const fileName = `${Date.now()}_${file.name}`;
  await db.storage.from("comprovativos").upload(fileName, file);
  const { data: url } = db.storage.from("comprovativos").getPublicUrl(fileName);

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
}

carregarBilhetes();
