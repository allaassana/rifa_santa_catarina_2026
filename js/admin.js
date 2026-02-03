const db = window.db;
const grid = document.getElementById("grid");
const TOTAL = 120;

async function carregarAdmin() {
  const { data = [] } = await db.from("compras").select("bilhete,nome");

  grid.innerHTML = "";

  for (let i = 1; i <= TOTAL; i++) {
    const div = document.createElement("div");
    div.className = "ticket";
    div.textContent = i;

    if (data.find(d => d.bilhete === i)) {
      div.classList.add("sold");
    }

    grid.appendChild(div);
  }
}

carregarAdmin();
