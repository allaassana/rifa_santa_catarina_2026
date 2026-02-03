const db = window.db;
const TOTAL = 120;
const grid = document.getElementById("ticketGrid");

async function carregar() {
  const { data = [] } = await db.from("compras").select("*");
  const vendidos = data.map(d => d.bilhete);

  grid.innerHTML = "";

  for (let i = 1; i <= TOTAL; i++) {
    const div = document.createElement("div");
    div.className = "ticket";
    div.textContent = i;

    if (vendidos.includes(i)) {
      div.classList.add("sold");
    }

    grid.appendChild(div);
  }
}

async function exportarCSV() {
  const { data } = await db.from("compras").select("*");
  const csv = data.map(d => `${d.bilhete},${d.nome},${d.telefone}`).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  window.open(URL.createObjectURL(blob));
}

async function sortear() {
  const { data } = await db.from("compras").select("*");
  if (!data.length) return alert("Sem compras.");
  const v = data[Math.floor(Math.random() * data.length)];
  alert(`Vencedor: ${v.nome} (Bilhete ${v.bilhete})`);
}

carregar();
