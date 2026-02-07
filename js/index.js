const TOTAL_BILHETES = 120;

const grid = document.getElementById("ticketGrid");
const formArea = document.getElementById("formArea");
const ticketNumberSpan = document.getElementById("ticketNumber");

let bilheteSelecionado = null;

/* ===============================
   CARREGAR BILHETES
================================ */
async function carregarBilhetes() {
  const { data, error } = await db.from("compras").select("bilhete");

  if (error) {
    console.error(error);
    return;
  }

  const vendidos = data.map(d => d.bilhete);

  grid.innerHTML = "";

  for (let i = 1; i <= TOTAL_BILHETES; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;

    if (vendidos.includes(i)) {
      btn.className = "sold";
    } else {
      btn.className = "available";
      btn.onclick = () => selecionarBilhete(i);
    }

    grid.appendChild(btn);
  }

  document.getElementById("soldCount").textContent = vendidos.length;
  document.getElementById("availCount").textContent =
    TOTAL_BILHETES - vendidos.length;
}

/* ===============================
   SELECIONAR BILHETE
================================ */
function selecionarBilhete(num) {
  bilheteSelecionado = num;
  ticketNumberSpan.textContent = num;
  formArea.classList.remove("hidden");
}

/* ===============================
   MODAL
================================ */
function mostrarModal(bilhete, nome, telefone) {
  document.getElementById("modalBilhete").textContent = bilhete;
  document.getElementById("modalNome").textContent = nome;

  const mensagem = `Olá, aqui está o bilhete número ${bilhete}.\nCompra confirmada!`;
  const telLimpo = telefone.replace(/\D/g, "");

  document.getElementById("whatsappBtn").href =
    `https://wa.me/238${telLimpo}?text=${encodeURIComponent(mensagem)}`;

  document.getElementById("modal").classList.remove("hidden");
}

document.getElementById("fecharModal").onclick = () => {
  document.getElementById("modal").classList.add("hidden");
};

/* ===============================
   CONFIRMAR COMPRA
================================ */
document.getElementById("confirmar").onclick = async () => {
  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const email = document.getElementById("email").value.trim();
  const nascimento = document.getElementById("nascimento").value || null;
  const cidade = document.getElementById("cidade").value.trim();
  const pais = document.getElementById("pais").value.trim();
  const file = document.getElementById("comprovativo").files[0];

  if (!nome || !telefone || !email || !bilheteSelecionado) {
    alert("Preencha os campos obrigatórios.");
    return;
  }

  let comprovativo_url = null;

  if (file) {
    const fileName = `${Date.now()}_${file.name}`;

    const { error } = await db.storage
      .from("comprovativos")
      .upload(fileName, file);

    if (error) {
      alert("Erro ao enviar comprovativo.");
      return;
    }

    comprovativo_url = db.storage
      .from("comprovativos")
      .getPublicUrl(fileName).data.publicUrl;
  }

  const { error } = await db.from("compras").insert({
    bilhete: bilheteSelecionado,
    nome,
    telefone,
    email,
    data_nascimento: nascimento,
    cidade,
    pais,
    comprovativo_url,
    status: "pendente"
  });

  if (error) {
    alert("Erro ao gravar compra.");
    return;
  }

  formArea.classList.add("hidden");
  carregarBilhetes();
  mostrarModal(bilheteSelecionado, nome, telefone);

  bilheteSelecionado = null;
};

/* ===============================
   CANCELAR
================================ */
document.getElementById("cancelar").onclick = () => {
  formArea.classList.add("hidden");
  bilheteSelecionado = null;
};

/* INIT */
carregarBilhetes();
