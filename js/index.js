const db = window.db;
const TOTAL = 120;

const grid = document.getElementById("ticketGrid");
const soldCount = document.getElementById("soldCount");
const availCount = document.getElementById("availCount");
const formArea = document.getElementById("formArea");
const modal = document.getElementById("receiptModal");

let selectedTicket = null;

async function renderGrid() {
  const { data = [] } = await db.from("compras").select("bilhete");
  const vendidos = data.map(d => d.bilhete);

  grid.innerHTML = "";

  for (let i = 1; i <= TOTAL; i++) {
    const d = document.createElement("div");
    d.className = "ticket";
    d.textContent = i;

    if (vendidos.includes(i)) {
      d.classList.add("sold");
    } else {
      d.onclick = () => openForm(i);
    }

    grid.appendChild(d);
  }

  soldCount.textContent = vendidos.length;
  availCount.textContent = TOTAL - vendidos.length;
}

function openForm(n) {
  selectedTicket = n;
  document.getElementById("ticketNumber").textContent = n;
  formArea.style.display = "block";
}

document.getElementById("confirmBtn").onclick = async () => {
  const nome = nomeEl.value.trim();
  const tel = telEl.value.trim();
  const email = emailEl.value.trim();
  const file = comp.files[0];

  if (!nome || !tel || !email || !file) {
    return alert("Preencha tudo");
  }

  // Upload comprovativo
  const path = `bilhete_${selectedTicket}_${Date.now()}`;
  await db.storage.from("comprovativos").upload(path, file);
  const { data: pub } = db.storage.from("comprovativos").getPublicUrl(path);

  const { error } = await db.from("compras").insert({
    bilhete: selectedTicket,
    nome,
    telefone: tel,
    email,
    comprovativo_url: pub.publicUrl
  });

  if (error) {
    alert("❌ Este bilhete já foi vendido");
    return;
  }

  // Recibo
  rBilhete.textContent = selectedTicket;
  rNome.textContent = nome;

  modal.style.display = "block";
  formArea.style.display = "none";

  whatsappBtn.onclick = () => {
    window.open(
      `https://wa.me/238${tel}?text=Olá, aqui está o bilhete número ${selectedTicket}. Compra confirmada!`,
      "_blank"
    );
  };

  pdfBtn.onclick = () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    pdf.text(`Bilhete: ${selectedTicket}`, 20, 20);
    pdf.text(`Nome: ${nome}`, 20, 30);
    pdf.text(`Rifa Santa Catarina 2025`, 20, 50);
    pdf.save(`bilhete_${selectedTicket}.pdf`);
  };

  renderGrid();
};

function fecharModal() {
  modal.style.display = "none";
}

cancelBtn.onclick = () => formArea.style.display = "none";

renderGrid();
