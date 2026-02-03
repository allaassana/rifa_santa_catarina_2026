const db = window.db;
const grid = document.getElementById("grid");

async function carregar() {
  const { data } = await db.from("compras").select("*");
  grid.innerHTML = "";
  data.forEach(c => {
    const d = document.createElement("div");
    d.textContent = `#${c.bilhete} - ${c.nome}`;
    d.className = "ticket sold";
    grid.appendChild(d);
  });
}

async function sortear() {
  const { data } = await db.from("compras").select("*");
  if (!data.length) return alert("Sem compras");
  const v = data[Math.floor(Math.random() * data.length)];
  alert(`🎉 Vencedor: ${v.nome} (Bilhete ${v.bilhete})`);
}

async function exportCSV() {
  const { data } = await db.from("compras").select("*");
  let csv = "bilhete,nome,telefone,email\n";
  data.forEach(r => {
    csv += `${r.bilhete},${r.nome},${r.telefone},${r.email}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "compras.csv";
  a.click();
}

carregar();
