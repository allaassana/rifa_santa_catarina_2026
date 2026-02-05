const TOTAL = 120;

const grid = document.getElementById("ticketGrid");
const form = document.getElementById("formArea");

const soldCount = document.getElementById("soldCount");
const availCount = document.getElementById("availCount");

const ticketNumberSpan = document.getElementById("ticketNumber");

let selectedTicket = null;

/* ==========================
   CARREGAR BILHETES
========================== */
async function carregarBilhetes() {
  const { data, error } = await db
    .from("compras")
    .select("bilhete");

  if (error) {
    alert("Erro ao carregar bilhetes");
    return;
  }

  const vendidos = data.map(d => d.bilhete);

  soldCount.textContent = vendidos.length;
  availCount.textContent = TOTAL - vendidos.length;

  grid.innerHTML = "";

  for (let i = 1; i <= TOTAL; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;

    if (vendidos.includes(i)) {
      btn.disabled = true;
      btn.classList.add("sold");
    } else {
      btn.onclick = () => selecionarBilhete(i);
    }

    grid.appendChild(btn);
  }
}

carregarBilhetes();

/* ==========================
   SELECIONAR BILHETE
========================== */
function selecionarBilhete(num) {
  selectedTicket = num;
  ticketNumberSpan.textContent = num;
  form.classList.remove("hidden");
}

/* ==========================
   CANCELAR
========================== */
document.getElementById("cancelar").onclick = () => {
  form.classList.add("hidden");
  selectedTicket = null;
};

/* ==========================
   CONFIRMAR COMPRA
========================== */
document.getElementById("confirmar").onclick = async () => {
  if (!selectedTicket) return;

  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const email = document.getElementById("email").value.trim();
  const nascimento = document.getElementById("nascimento").value || null;
  const cidade = document.getElementById("cidade").value.trim();
  const pais = document.getElementById("pais").value.trim();
  const file = document.getElementById("comprovativo").files[0];

  if (!nome || !telefone || !email || !file) {
    alert("Preencha os campos obrigatórios");
    return;
  }

  /* ========= UPLOAD ========= */
  const fileName = `${Date.now()}_${file.name}`;

  const { error: uploadError } = await db.storage
    .from("comprovativos")
    .upload(fileName, file);

  if (uploadError) {
    alert("Erro no upload do comprovativo");
    return;
  }

  /* ========= INSERT ========= */
  const { error: insertError } = await db
    .from("compras")
    .insert({
      bilhete: selectedTicket,
      nome,
      telefone,
      email,
      data_nascimento: nascimento,
      cidade,
      pais,
      comprovativo: fileName,
      status: "pendente"
    });

  if (insertError) {
    alert("Erro ao gravar compra");
    return;
  }

  alert("Compra registada com sucesso!");

  form.classList.add("hidden");
  selectedTicket = null;

  carregarBilhetes(); // 🔥 sincroniza automático
};
