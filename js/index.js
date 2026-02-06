const TOTAL_BILHETES = 120;
const grid = document.getElementById("ticketGrid");
const formArea = document.getElementById("formArea");
const ticketNumberSpan = document.getElementById("ticketNumber");

let bilheteSelecionado = null;

async function carregarBilhetes() {
  const { data } = await db.from("compras").select("bilhete");
  const vendidos = data.map(d => d.bilhete);

  grid.innerHTML = "";

  for (let i = 1; i <= TOTAL_BILHETES; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = vendidos.includes(i) ? "sold" : "available";

    if (!vendidos.includes(i)) {
      btn.onclick = () => {
        bilheteSelecionado = i;
        ticketNumberSpan.textContent = i;
        formArea.classList.remove("hidden");
      };
    }

    grid.appendChild(btn);
  }

  soldCount.textContent = vendidos.length;
  availCount.textContent = TOTAL_BILHETES - vendidos.length;
}

confirmar.onclick = async () => {
  const file = comprovativo.files[0];
  let comprovativo_url = null;

  if (file) {
    const name = Date.now() + "_" + file.name;
    await db.storage.from("comprovativos").upload(name, file);
    comprovativo_url = db.storage.from("comprovativos").getPublicUrl(name).data.publicUrl;
  }

  await db.from("compras").insert({
    bilhete: bilheteSelecionado,
    nome: nome.value,
    telefone: telefone.value,
    email: email.value,
    data_nascimento: nascimento.value || null,
    cidade: cidade.value,
    pais: pais.value,
    comprovativo_url,
    status: "pendente"
  });

  alert("Compra registada com sucesso!");
  formArea.classList.add("hidden");
  carregarBilhetes();
};

cancelar.onclick = () => {
  formArea.classList.add("hidden");
};

carregarBilhetes();
