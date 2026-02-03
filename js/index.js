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
  formArea.style.display = "block";
}

document.getElementById("cancelBtn").onclick = () => {
  formArea.style.display = "none";
};

document.getElementById("confirmBtn").onclick = async () => {
  const nome = nome.value.trim();
  const tel = document.getElementById("tel").value.trim();
  const email = document.getElementById("email").value.trim();
  const file = comprovativo.files[0];

  if (!nome || !tel || !email || !file) {
    alert("Preencha os campos obrigatórios.");
    return;
  }

  const fileName = `${Date.now()}_${file.name}`;
  await db.storage.from("comprovativos").upload(fileName, file);

  const { data: urlData } =
    db.storage.from("comprovativos").getPublicUrl(fileName);

  await db.from("compras").insert({
    bilhete: selectedTicket,
    nome,
    telefone: tel,
    email,
    comprovativo_url: urlData.publicUrl,
    status: "pendente"
  });

  document.getElementById("mBilhete").textContent = selectedTicket;
  document.getElementById("mNome").textContent = nome;

  document.getElementById("pdfBtn").onclick = () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    pdf.text("Recibo - Rifa Santa Catarina 2025", 10, 20);
    pdf.text(`Nome: ${nome}`, 10, 40);
    pdf.text(`Bilhete: ${selectedTicket}`, 10, 50);
    pdf.text("Valor: 20€ / 2.200 CVE", 10, 60);
    pdf.save(`recibo_bilhete_${selectedTicket}.pdf`);
  };

  document.getElementById("modal").style.display = "block";
  formArea.style.display = "none";
  carregarBilhetes();
};

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

carregarBilhetes();
