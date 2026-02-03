const grid = document.getElementById("grid");
const TOTAL = 120;

async function carregarAdmin() {
  const { data = [] } = await db.from("compras").select("*");

  grid.innerHTML = "";

  for (let i = 1; i <= TOTAL; i++) {
    const d = document.createElement("div");
    d.className = "ticket";
    d.textContent = i;

    const compra = data.find(c => c.bilhete === i);
    if (compra) d.classList.add("sold");

    grid.appendChild(d);
  }
}

document.getElementById("exportar").onclick = async () => {
  const { data } = await db.from("compras").select("*");
  let csv = "Bilhete,Nome,Telefone,Email\n";
  data.forEach(d => {
    csv += `${d.bilhete},${d.nome},${d.telefone},${d.email}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "compras.csv";
  a.click();
};

document.getElementById("sortear").onclick = async () => {
  const { data } = await db.from("compras").select("*");
  const v = data[Math.floor(Math.random() * data.length)];
  alert(`🎉 Vencedor: ${v.nome} (Bilhete ${v.bilhete})`);
};

carregarAdmin();
