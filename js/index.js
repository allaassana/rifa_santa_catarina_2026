const db = window.db;
const TOTAL = 120;

const grid = document.getElementById("ticketGrid");
const soldCount = document.getElementById("soldCount");
const availCount = document.getElementById("availCount");
const formArea = document.getElementById("formArea");

let vendidos = [];
let selectedTicket = null;

// =====================
// CARREGAR ESTADO
// =====================
async function carregar() {
  const { data = [] } = await db.from("compras").select("bilhete");
  vendidos = data.map(d => d.bilhete);

  soldCount.textContent = vendidos.length;
  availCount.textContent = TOTAL - vendidos.length;

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
}

function abrirFormulario(n) {
  if (vendidos.includes(n)) {
    alert("❌ Este bilhete já foi vendido.");
    return;
  }

  selectedTicket = n;
  document.getElementById("ticketNumber").textContent = n;
  formArea.style.display = "block";
}

// =====================
// CANCELAR
// =====================
document.getElementById("cancelBtn").onclick = () => {
  formArea.style.display = "none";
};

// =====================
// CONFIRMAR
// =====================
document.getElementById("confirmBtn").onclick = async () => {
  const nome = val("nome");
  const tel = val("tel");
  const email = val("email");
  const nasc = val("nasc");
  const file = document.getElementById("comp").files[0];

  if (!nome || !tel || !email || !nasc || !file) {
    alert("Preencha todos os campos");
    return;
  }

  // Upload comprovativo
  const path = `bilhete_${selectedTicket}_${Date.now()}`;
  const { error: upErr } = await db.storage
    .from("comprovativos")
    .upload(path, file);

  if (upErr) {
    alert("Erro no upload do comprovativo");
    return;
  }

  // Inserção segura
  const { error } = await db.from("compras").insert({
    bilhete: selectedTicket,
    nome,
    telefone: tel,
    email,
    data_nascimento: nasc,
    comprovativo_url: path
  });

  if (error) {
    alert("❌ Este bilhete já foi vendido.");
    return;
  }

  window.open(
    `https://wa.me/238${tel}?text=Olá, aqui está o bilhete número ${selectedTicket}. Compra confirmada!`,
    "_blank"
  );

  formArea.style.display = "none";
  carregar();
};

function val(id) {
  return document.getElementById(id).value.trim();
}

carregar();
