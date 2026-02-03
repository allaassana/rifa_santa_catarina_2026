const db = window.db;
const TOTAL = 120;

const grid = document.getElementById("ticketGrid");
const soldCount = document.getElementById("soldCount");
const availCount = document.getElementById("availCount");
const formArea = document.getElementById("formArea");

let selectedTicket = null;
let buyerName = "";
let buyerTel = "";

async function carregarBilhetes() {
  const { data, error } = await db.from("compras").select("bilhete");
  if (error) return alert("Erro ao carregar bilhetes");

  const vendidos = data.map(d => d.bilhete);
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
  formArea.style.display = "block";
}

document.getElementById("cancelBtn").onclick = () => {
  formArea.style.display = "none";
};

document.getElementById("confirmBtn").onclick = async () => {
  const nome = nomeEl.value.trim();
  const tel = telEl.value.trim();
  const email = emailEl.value.trim();
  const file = comprovativo.files[0];

  if (!nome || !tel || !email || !file) {
    return alert("Preencha todos os campos obrigatórios");
  }

  buyerName = nome;
  buyerTel = tel;

  const fileName = `${Date.now()}_${file.name}`;
  const up = await db.storage.from("comprovativos").upload(fileName, file);
  if (up.error) return alert("Erro no upload");

  const { data: url } = db.storage
    .from("comprovativos")
    .getPublicUrl(fileName);

  const { error } = await db.from("compras").insert({
    bilhete: selectedTicket,
    nome,
    telefone: tel,
    email,
    comprovativo_url: url.publicUrl,
    status: "pendente"
  });

  if (error) return alert("Erro ao registar");

  document.getElementById("mBilhete").textContent = selectedTicket;
  document.getElementById("mNome").textContent = nome;

  document.getElementById("modal").style.display = "block";
  formArea.style.display = "none";
  carregarBilhetes();
};

document.getElementById("whatsBtn").onclick = () => {
  window.open(
    `https://wa.me/238${buyerTel}?text=Bilhete ${selectedTicket} confirmado. Valor: 20€ / 2.200 CVE`
  );
};

document.getElementById("pdfBtn").onclick = () => {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  pdf.text(`Recibo - Rifa Santa Catarina`, 20, 20);
  pdf.text(`Nome: ${buyerName}`, 20, 40);
  pdf.text(`Bilhete: ${selectedTicket}`, 20, 50);
  pdf.text(`Valor: 20 € / 2.200 CVE`, 20, 60);
  pdf.save("recibo.pdf");
};

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

carregarBilhetes();
