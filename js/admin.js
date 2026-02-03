const db = window.db;
const lista = document.getElementById("lista");

async function carregar() {
  const { data = [] } = await db.from("compras").select("*");
  lista.innerHTML = data.map(d =>
    `#${d.bilhete} - ${d.nome}`
  ).join("<br>");
}

async function exportCSV() {
  const { data } = await db.from("compras").select("*");
  const csv = data.map(d => `${d.bilhete},${d.nome},${d.email}`).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "rifa.csv";
  a.click();
}

async function sortear() {
  const { data } = await db.from("compras").select("*");
  const v = data[Math.floor(Math.random() * data.length)];
  alert(`🎉 Vencedor: ${v.nome} (Bilhete ${v.bilhete})`);
}

carregar();
