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
  const nome = document.getElementById("nome").value.trim();
  const tel = document.getElementById("tel").value.trim();
  const email = document.getElementById("email").value.trim();
  const nasc = document.getElementById("nasc").value || null;
  const cidade = document.getElementById("cidade").value || null;
  const pais = document.getElementById("pais").value || null;
  const file = document.getElementById("comprovativo").files[0];

  if (!nome || !tel || !email || !file) {
    alert("Preencha os campos obrigatórios e anexe o comprovativo.");
    return;
  }

  // UPLOAD
  const fileName = `${Date.now()}_${file.name}`;
  const { error: uploadError } = await db
    .storage
    .from("comprovativos")
    .upload(fileName, file);

  if (uploadError) {
    console.error(uploadError);
    alert("Erro no upload do comprovativo.");
    return;
  }

  const { data: urlData } = db
    .storage
    .from("comprovativos")
    .getPublicUrl(fileName);

  // INSERT FINAL
  const { error } = await db.from("compras").insert({
    bilhete: selectedTicket,
    nome,
    telefone: tel,
    email,
    data_nascimento: nasc,
    cidade,
    pais,
    status: "pendente",
    comprovativo_url: urlData.publicUrl
  });

  if (error) {
    console.error(error);
    alert("Erro ao registar compra.");
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

carregarBilhetes();
