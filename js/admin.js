const db = window.db;
const TOTAL = 120;
const grid = document.getElementById("adminGrid");

async function carregar() {
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

carregar();
