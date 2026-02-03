const db = window.db;
const grid = document.getElementById("adminGrid");
const winners = document.getElementById("winners");

async function carregar() {
  const { data = [] } = await db.from("compras").select("*");
  grid.innerHTML = "";

  data.forEach(c => {
    const div = document.createElement("div");
    div.className = "ticket sold";
    div.innerHTML = `<b>${c.bilhete}</b><br>${c.nome}`;
    grid.appendChild(div);
  });
}

async function exportCSV() {
  const { data } = await db.from("compras").select("*");
  let csv = "Bilhete,Nome,Telefone,Email\n";
  data.forEach(d => {
    csv += `${d.bilhete},${d.nome},${d.telefone},${d.email}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "rifa.csv";
  a.click();
}

async function sortear() {
  const { data } = await db.from("compras").select("*");
  if (!data.length) return;
  const v = data[Math.floor(Math.random() * data.length)];
  winners.innerHTML += `<li>🎉 ${v.nome} - Bilhete ${v.bilhete}</li>`;
}

carregar();
