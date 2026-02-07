const TOTAL_BILHETES = 120;

const grid = document.getElementById("ticketGrid");
const formArea = document.getElementById("formArea");
const ticketNumberSpan = document.getElementById("ticketNumber");

let bilheteSelecionado = null;

/* ===============================
   CARREGAR BILHETES
================================ */
async function carregarBilhetes() {
  const { data, error } = await db
    .from("compras")
    .select("bilhete");

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

  /* ===== UPLOAD COMPROVATIVO ===== */
  if (file) {
    const fileName = `${Date.now()}_${file.name}`;

    const { error: uploadError } = await db.storage
      .from("comprovativos")
      .upload(fileName, file);

    if (uploadError) {
      console.error(uploadError);
      alert("Erro ao enviar comprovativo.");
      return;
    }

    const { data } = db.storage
      .from("comprovativos")
      .getPublicUrl(fileName);

    comprovativo_url = data.publicUrl;
  }

  /* ===== GRAVAR COMPRA ===== */
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
    console.error(error);
    alert("Erro ao gravar compra.");
    return;
  }

  /* ===== SUCESSO ===== */
  formArea.classList.add("hidden");
  carregarBilhetes();

  // 👉 MODAL + WHATSAPP
  mostrarModal(bilheteSelecionado, nome, telefone);

  // reset
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
