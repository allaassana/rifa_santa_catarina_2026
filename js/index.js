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
  try {
    const nome = document.getElementById("nome")?.value.trim() || "";
    const tel = document.getElementById("tel")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const nasc = document.getElementById("nasc")?.value || null;
    const cidade = document.getElementById("cidade")?.value.trim() || null;
    const pais = document.getElementById("pais")?.value.trim() || null;
    const fileInput = document.getElementById("comprovativo");
    const file = fileInput?.files?.[0];

    if (!nome || !tel || !email || !file) {
      alert("Preencha nome, telefone, email e anexe o comprovativo.");
      return;
    }

    // UPLOAD COMPROVATIVO
    const fileName = `${Date.now()}_${file.name}`;

    const { error: uploadError } = await db.storage
      .from("comprovativos")
      .upload(fileName, file);

    if (uploadError) {
      alert("Erro ao enviar comprovativo.");
      return;
    }

    const { data: urlData } = db.storage
      .from("comprovativos")
      .getPublicUrl(fileName);

    // INSERIR COMPRA
    const { error } = await db.from("compras").insert({
      bilhete: selectedTicket,
      nome,
      telefone: tel,
      email,
      data_nascimento: nasc,
      cidade,
      pais,
      comprovativo_url: urlData.publicUrl
    });

    if (error) {
      alert("Este bilhete já foi vendido.");
      return;
    }

    alert(`✅ Compra registada com sucesso!\nBilhete nº ${selectedTicket}`);

    formArea.style.display = "none";
    carregarBilhetes();

  } catch (err) {
    console.error(err);
    alert("Erro inesperado. Tente novamente.");
  }
};

carregarBilhetes();
