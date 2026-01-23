const db = window.db;
const TOTAL = 120;

const grid = document.getElementById("ticketGrid");
const soldCount = document.getElementById("soldCount");
const availCount = document.getElementById("availCount");
const formArea = document.getElementById("formArea");

let selectedTicket = null;

// =====================
// CARREGAR BILHETES
// =====================
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

// =====================
// CONFIRMAR COMPRA
// =====================
document.getElementById("confirmBtn").onclick = async () => {
  const nome = document.getElementById("nome").value.trim();
  const tel = document.getElementById("tel").value.trim();
  const email = document.getElementById("email").value.trim();
  const nasc = document.getElementById("nasc").value;
  const cidade = document.getElementById("cidade").value.trim();
  const pais = document.getElementById("pais").value.trim();
  const file = document.getElementById("comprovativo").files[0];

  if (!nome || !tel || !email || !file) {
    alert("Preencha todos os campos obrigatórios e anexe o comprovativo.");
    return;
  }

  // =====================
  // UPLOAD DO COMPROVATIVO
  // =====================
  const fileName = `${selectedTicket}_${Date.now()}_${file.name}`;

  const { error: upErr } = await db.storage
    .from("comprovativos")
    .upload(fileName, file);

  if (upErr) {
    alert("Erro no upload do comprovativo.");
    return;
  }

  const { data: urlData } = db.storage
    .from("comprovativos")
    .getPublicUrl(fileName);

  // =====================
  // INSERIR COMPRA
  // =====================
  const { error } = await db.from("compras").insert({
    bilhete: selectedTicket,
    nome,
    telefone: tel,
    email,
    data_nascimento: nasc || null,
    cidade: cidade || null,
    pais: pais || null,
    comprovativo_url: urlData.publicUrl,
    status: "pendente"
  });

  if (error) {
    alert("Este bilhete já foi vendido. Escolha outro.");
    return;
  }

  // =====================
  // MODAL
  // =====================
  document.getElementById("mBilhete").textContent = selectedTicket;
  document.getElementById("mNome").textContent = nome;

  document.getElementById("whatsBtn").onclick = () => {
    window.open(
      `https://wa.me/238${tel}?text=Olá ${nome}, a sua compra do bilhete nº ${selectedTicket} foi registada com sucesso.`,
      "_blank"
    );
  };

  document.getElementById("reciboBtn").onclick = () => {
    gerarRecibo({
      bilhete: selectedTicket,
      nome,
      telefone: tel,
      email,
      nascimento: nasc,
      cidade,
      pais
    });
  };

  document.getElementById("modal").style.display = "block";
  formArea.style.display = "none";

  carregarBilhetes();
};

// =====================
// RECIBO (DOWNLOAD)
// =====================
function gerarRecibo(d) {
  const conteudo = `
RIFA SANTA CATARINA 2025
Centro Pastoral Santa Ana & São Joaquim
-------------------------------------

RECIBO DE COMPRA

Bilhete Nº: ${d.bilhete}
Nome: ${d.nome}
Telefone: ${d.telefone}
Email: ${d.email}
Data de Nascimento: ${d.nascimento || "-"}
Cidade: ${d.cidade || "-"}
País: ${d.pais || "-"}

Data da Compra: ${new Date().toLocaleDateString("pt-PT")}

Pagamento sujeito à validação do comprovativo.

Obrigado pela sua participação!
`;

  const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `recibo_bilhete_${d.bilhete}.txt`;
  a.click();

  URL.revokeObjectURL(url);
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

carregarBilhetes();
