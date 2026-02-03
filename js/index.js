const { jsPDF } = window.jspdf;
const db = window.db;
const TOTAL = 120;

const grid = document.getElementById("ticketGrid");
const soldCount = document.getElementById("soldCount");
const availCount = document.getElementById("availCount");
const formArea = document.getElementById("formArea");

let selectedTicket = null;
let lastBuyer = {};

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
};

document.getElementById("confirmBtn").onclick = async () => {
  const nome = nomeEl.value.trim();
  const tel = telEl.value.trim();
  const email = emailEl.value.trim();
  const file = comprovativo.files[0];

  if (!nome || !tel || !email || !file) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  const fileName = `${Date.now()}_${file.name}`;
  const upload = await db.storage.from("comprovativos").upload(fileName, file);
  if (upload.error) return alert("Erro no upload.");

  const { data: url } = db.storage.from("comprovativos").getPublicUrl(fileName);

  await db.from("compras").insert({
    bilhete: selectedTicket,
    nome,
    telefone: tel,
    email,
    comprovativo_url: url.publicUrl
  });

  lastBuyer = { nome, bilhete: selectedTicket };

  document.getElementById("mBilhete").textContent = selectedTicket;
  document.getElementById("mNome").textContent = nome;

  document.getElementById("modal").classList.remove("hidden");
  formArea.classList.add("hidden");

  carregarBilhetes();
};

document.getElementById("pdfBtn").onclick = () => {
  const pdf = new jsPDF();
  pdf.text("RECIBO - RIFA SANTA CATARINA 2025", 20, 20);
  pdf.text(`Nome: ${lastBuyer.nome}`, 20, 40);
  pdf.text(`Bilhete Nº: ${lastBuyer.bilhete}`, 20, 55);
  pdf.text("Pagamento via transferência bancária", 20, 75);
  pdf.save(`recibo_bilhete_${lastBuyer.bilhete}.pdf`);
};

function fecharModal() {
  document.getElementById("modal").classList.add("hidden");
}

carregarBilhetes();
