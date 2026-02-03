const db = window.db;
const grid = document.getElementById("ticketGrid");
const TOTAL = 120;

async function carregarAdmin() {
  const { data = [] } = await db.from("compras").select("*");

  grid.innerHTML = "";

  for (let i = 1; i <= TOTAL; i++) {
    const div = document.createElement("div");
    div.className = "ticket";
    div.textContent = i;

    const compra = data.find(c => c.bilhete === i);
    if (compra) {
      div.classList.add("sold");
      div.title = compra.nome;
    }

    grid.appendChild(div);
  }
}

carregarAdmin();
