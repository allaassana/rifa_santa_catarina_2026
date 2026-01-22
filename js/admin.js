const db = window.db;

const grid = document.getElementById("grid");
const soldCountEl = document.getElementById("soldCount");
const detailBox = document.getElementById("detailBox");
const winnersList = document.getElementById("winnersList");
const drawBtn = document.getElementById("drawWinner");

const TOTAL = 120;

async function carregarCompras() {
  const { data } = await db.from("compras").select("*");
  soldCountEl.textContent = data.length;
  grid.innerHTML = "";

  for (let i = 1; i <= TOTAL; i++) {
    const div = document.createElement("div");
    div.className = "ticket";
    div.textContent = i;

    const compra = data.find(c => c.bilhete === i);

    if (compra) {
      div.classList.add("sold");
      div.onclick = () => mostrarDetalhes(compra);
    }

    grid.appendChild(div);
  }
}

function mostrarDetalhes(c) {
  detailBox.innerHTML = `
    <p><strong>Bilhete:</strong> ${c.bilhete}</p>
    <p><strong>Nome:</strong> ${c.nome}</p>
    <p><strong>Telefone:</strong> ${c.telefone}</p>
    <p><strong>Email:</strong> ${c.email}</p>
    <button onclick="eliminarBilhete(${c.bilhete})">🗑 Eliminar</button>
  `;
}

async function eliminarBilhete(b) {
  if (!confirm("Eliminar este bilhete?")) return;
  await db.from("compras").delete().eq("bilhete", b);
  carregarCompras();
}

drawBtn.onclick = async () => {
  const { data: compras } = await db.from("compras").select("*");
  if (!compras.length) return alert("Nenhuma compra.");

  const vencedor = compras[Math.floor(Math.random() * compras.length)];

  await db.from("vencedores").insert({
    bilhete: vencedor.bilhete,
    nome: vencedor.nome,
    telefone: vencedor.telefone,
    email: vencedor.email
  });

  alert(`🎉 Vencedor: ${vencedor.nome} (Bilhete ${vencedor.bilhete})`);
  carregarVencedores();
};

async function carregarVencedores() {
  const { data } = await db.from("vencedores").select("*");
  winnersList.innerHTML = "";
  data.forEach(v => {
    const li = document.createElement("li");
    li.textContent = `🎉 ${v.nome} — Bilhete ${v.bilhete}`;
    winnersList.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  carregarCompras();
  carregarVencedores();
});
