const TOTAL = 120;
const grid = document.getElementById("ticketGrid");
const soldCount = document.getElementById("soldCount");
const availCount = document.getElementById("availCount");
const formArea = document.getElementById("formArea");
const modal = document.getElementById("modal");

let selectedTicket = null;

// 🔹 carregar bilhetes
async function carregar() {
  const { data = [] } = await db.from("compras").select("bilhete");
  const vendidos = data.map(v => v.bilhete);

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
  formArea.classList.remove("hidden");
}

document.getElementById("cancelar").onclick = () => {
  formArea.classList.add("hidden");
};

document.getElementById("confirmar").onclick = async () => {
  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const email = document.getElementById("email").value.trim();
  const cidade = document.getElementById("cidade").value.trim();
  const pais = document.getElementById("pais").value.trim();
  const file = document.getElementById("comprovativo").files[0];

  if (!nome || !telefone || !email || !file) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  const fileName = Date.now() + "_" + file.name;
  await db.storage.from("comprovativos").upload(fileName, file);
  const { data } = db.storage.from("comprovativos").getPublicUrl(fileName);

  await db.from("compras").insert({
    bilhete: selectedTicket,
    nome,
    telefone,
    email,
    cidade,
    pais,
    comprovativo_url: data.publicUrl
  });

  document.getElementById("mBilhete").textContent = selectedTicket;
  document.getElementById("mNome").textContent = nome;

  modal.classList.remove("hidden");
  formArea.classList.add("hidden");
  carregar();
};

document.getElementById("fecharModal").onclick = () => {
  modal.classList.add("hidden");
};

carregar();
