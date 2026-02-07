const TOTAL_BILHETES = 120;

const grid = document.getElementById("ticketGrid");
const formArea = document.getElementById("formArea");
const ticketNumberSpan = document.getElementById("ticketNumber");

let bilheteSelecionado = null;

/* CARREGAR BILHETES */
async function carregarBilhetes() {
  const { data } = await db.from("compras").select("bilhete");
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
  document.getElementById("availCount").textContent = TOTAL_BILHETES - vendidos.length;
}

function selecionarBilhete(num) {
  bilheteSelecionado = num;
  ticketNumberSpan.textContent = num;
  formArea.classList.remove("hidden");
}

/* CONFIRMAR */
document.getElementById("confirmar").onclick = async () => {
  const nome = nome.value.trim();
  const telefone = telefone.value.trim();
  const email = email.value.trim();

  if (!nome || !telefone || !email) return alert("Preencha os campos obrigatórios.");

  await db.from("compras").insert({
    bilhete: bilheteSelecionado,
    nome,
    telefone,
    email,
    status: "pendente"
  });

  document.getElementById("mBilhete").textContent = bilheteSelecionado;
  document.getElementById("mNome").textContent = nome;
  document.getElementById("modal").classList.remove("hidden");

  const msg = encodeURIComponent(
    `Olá, aqui está o bilhete número ${bilheteSelecionado}.\nCompra confirmada!`
  );

  window.open(`https://wa.me/${telefone}?text=${msg}`, "_blank");

  formArea.classList.add("hidden");
  carregarBilhetes();
};

document.getElementById("cancelar").onclick = () => {
  formArea.classList.add("hidden");
};

function fecharModal() {
  document.getElementById("modal").classList.add("hidden");
}

document.getElementById("baixarPDF").onclick = () => {
  const texto = `RECIBO\nBilhete: ${bilheteSelecionado}`;
  const blob = new Blob([texto], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `recibo_bilhete_${bilheteSelecionado}.txt`;
  a.click();
};

carregarBilhetes();
