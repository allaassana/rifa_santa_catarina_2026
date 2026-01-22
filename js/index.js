const db = window.db;
const TOTAL = 120;

const grid = document.getElementById("ticketGrid");
const soldCount = document.getElementById("soldCount");
const availCount = document.getElementById("availCount");
const formArea = document.getElementById("formArea");

let selectedTicket = null;

async function carregarBilhetes() {
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
  const nome = nomeVal();
  const tel = telVal();
  const email = emailVal();
  const nasc = document.getElementById("nasc").value;
  const file = document.getElementById("comprovativo").files[0];

  if (!nome || !tel || !email || !file) {
    alert("Preencha todos os campos e anexe o comprovativo.");
    return;
  }

  // UPLOAD
  const fileName = `${Date.now()}_${file.name}`;
  const { error: upErr } = await db.storage
    .from("comprovativos")
    .upload(fileName, file);

  if (upErr) {
    alert("Erro no upload do comprovativo");
    return;
  }

  const { data: urlData } = db.storage
    .from("comprovativos")
    .getPublicUrl(fileName);

  // INSERT FINAL
  const { error } = await db.from("compras").insert({
    bilhete: selectedTicket,
    nome,
    telefone: tel,
    email,
    data_nascimento: nasc,
    comprovativo_url: urlData.publicUrl
  });

  if (error) {
    alert("Este bilhete já foi vendido. Escolha outro.");
    return;
  }

  document.getElementById("mBilhete").textContent = selectedTicket;
  document.getElementById("mNome").textContent = nome;

  document.getElementById("whatsBtn").onclick = () => {
    window.open(
      `https://wa.me/238${tel}?text=Olá, aqui está o bilhete número ${selectedTicket}. Compra confirmada!`,
      "_blank"
    );
  };

  document.getElementById("modal").style.display = "block";
  formArea.style.display = "none";

  carregarBilhetes();
};

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

function nomeVal(){ return document.getElementById("nome").value.trim(); }
function telVal(){ return document.getElementById("tel").value.trim(); }
function emailVal(){ return document.getElementById("email").value.trim(); }

carregarBilhetes();
