const TOTAL_BILHETES = 120;

const grid = document.getElementById("ticketGrid");
const formArea = document.getElementById("formArea");
const ticketNumberSpan = document.getElementById("ticketNumber");
const modal = document.getElementById("modal");

let bilheteSelecionado = null;

modal.classList.add("hidden");

/* ===============================
   CARREGAR BILHETES
================================ */
async function carregarBilhetes() {
  const { data, error } = await db.from("compras").select("bilhete");
  if (error) return console.error(error);

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
   SELECIONAR
================================ */
function selecionarBilhete(num) {
  bilheteSelecionado = num;
  ticketNumberSpan.textContent = num;
  formArea.classList.remove("hidden");
}

/* ===============================
   GERAR RECIBO
================================ */
function gerarRecibo(nome, bilhete) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const data = new Date().toLocaleDateString("pt-PT");
  const hora = new Date().toLocaleTimeString("pt-PT");

  doc.setFontSize(14);
  doc.text("RECIBO DE CONTRIBUIÇÃO", 20, 20);

  doc.setFontSize(11);
  doc.text("Paróquia de Santa Catarina de Santiago", 20, 32);
  doc.text("Rifa Solidária 2025", 20, 38);

  doc.line(20, 42, 190, 42);

  doc.text(`Nome: ${nome}`, 20, 54);
  doc.text(`Bilhete Nº: ${bilhete}`, 20, 62);
  doc.text(`Data: ${data}`, 20, 70);
  doc.text(`Hora: ${hora}`, 20, 78);

  doc.line(20, 86, 190, 86);

  doc.setFontSize(10);
  doc.text(
    "Este recibo confirma a contribuição voluntária no âmbito da Rifa Solidária da Paróquia de Santa Catarina de Santiago.",
    20,
    96,
    { maxWidth: 170 }
  );

  doc.text("Obrigado pelo seu apoio.", 20, 112);
  doc.text("— Comissão Organizadora —", 20, 124);

  doc.save(`recibo_bilhete_${bilhete}.pdf`);
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

  const { data: existente } = await db
    .from("compras")
    .select("bilhete")
    .eq("bilhete", bilheteSelecionado)
    .maybeSingle();

  if (existente) {
    alert("Este bilhete já foi vendido.");
    carregarBilhetes();
    return;
  }

  let comprovativo_url = null;

  if (file) {
    const fileName = `${Date.now()}_${file.name}`;
    const { error } = await db.storage
      .from("comprovativos")
      .upload(fileName, file);

    if (error) {
      alert("Erro no upload do comprovativo.");
      return;
    }

    comprovativo_url =
      db.storage.from("comprovativos").getPublicUrl(fileName).data.publicUrl;
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
  await carregarBilhetes();

  document.getElementById("modalBilhete").textContent = bilheteSelecionado;
  document.getElementById("modalNome").textContent = nome;

  const msg = `Olá! O seu bilhete nº ${bilheteSelecionado} foi registado com sucesso.`;
  document.getElementById("whatsappBtn").href =
    `https://wa.me/238${telefone}?text=${encodeURIComponent(msg)}`;

  document.getElementById("reciboBtn").onclick = () => {
    gerarRecibo(nome, bilheteSelecionado);
  };

  modal.classList.remove("hidden");
  bilheteSelecionado = null;
};

/* ===============================
   FECHAR / CANCELAR
================================ */
document.getElementById("fecharModal").onclick = () => {
  modal.classList.add("hidden");
};

document.getElementById("cancelar").onclick = () => {
  formArea.classList.add("hidden");
  bilheteSelecionado = null;
};

/* INIT */
carregarBilhetes();
