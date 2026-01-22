const db = window.db;
const TOTAL = 120;

const grid = document.getElementById("ticketGrid");
const soldCount = document.getElementById("soldCount");
const availCount = document.getElementById("availCount");
const formArea = document.getElementById("formArea");

let selectedTicket = null;

// =======================
// GRID
// =======================
async function renderGrid() {
  const { data = [] } = await db.from("compras").select("bilhete");
  const vendidos = data.map(x => x.bilhete);

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

document.getElementById("cancelBtn").onclick = () => {
  formArea.style.display = "none";
};

// =======================
// CONFIRMAR COMPRA
// =======================
document.getElementById("confirmBtn").onclick = async () => {
  const nome = val("nome");
  const tel = val("tel");
  const email = val("email");
  const file = document.getElementById("comp").files[0];

  if (!nome || !tel || !email || !file) {
    alert("Preencha todos os campos");
    return;
  }

  // 1️⃣ Upload comprovativo
  const fileName = `bilhete_${selectedTicket}_${Date.now()}`;
  const { error: uploadError } = await db.storage
    .from("comprovativos")
    .upload(fileName, file);

  if (uploadError) {
    alert("Erro no upload");
    return;
  }

  const comprovativo_url = fileName;

  // 2️⃣ Inserção protegida
  const { error } = await db.from("compras").insert({
    bilhete: selectedTicket,
    nome,
    telefone: tel,
    email,
    comprovativo_url
  });

  if (error) {
    alert("❌ Este bilhete já foi vendido.");
    return;
  }

  // 3️⃣ WhatsApp
  window.open(
    `https://wa.me/238${tel}?text=Olá, aqui está o bilhete número ${selectedTicket}. Compra confirmada!`,
    "_blank"
  );

  formArea.style.display = "none";
  renderGrid();
};

function val(id) {
  return document.getElementById(id).value.trim();
}

renderGrid();
