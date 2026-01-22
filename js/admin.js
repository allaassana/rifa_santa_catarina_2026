const db = window.db;

const grid = document.getElementById("grid");
const soldCountEl = document.getElementById("soldCount");
const detailBox = document.getElementById("detailBox");
const winnersList = document.getElementById("winnersList");
const drawBtn = document.getElementById("drawWinner");

const TOTAL = 120;

async function carregarCompras() {
  const { data } = await db.from("compras").select("*");

  grid.innerHTML = "";
  soldCountEl.textContent = data.length;

  for (let i = 1; i <= TOTAL; i++) {
    const div = document.createElement("div");
    div.className = "ticket";
    div.textContent = i;

    const compra = data.find(c => c.bilhete === i);

    if (compra) {
      div.classList.add("sold");
      div.onclick = () => mostrarDetalhes(compra);
    } else {
      div.style.opacity = "0.4";
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

    <button onclick="eliminarBilhete(${c.bilhete})" class="btn btn-danger">
      ❌ Eliminar Bilhete
    </button>
  `;
}

async function eliminarBilhete(bilhete) {
  if (!confirm("Eliminar este bilhete?")) return;

  await db.from("compras").delete().eq("bilhete", bilhete);
  detailBox.innerHTML = "Bilhete eliminado.";
  carregarCompras();
}

drawBtn.onclick = async () => {
  const { data: compras } = await db.from("compras").select("*");

  if (!compras.length) return alert("Sem compras.");

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
  const { data } = await db.from("vencedores").select("*").order("created_at", { ascending: false });

  winnersList.innerHTML = "";
  data.forEach(v => {
    const li = document.createElement("li");
    li.textContent = `🎉 Bilhete ${v.bilhete} — ${v.nome}`;
    winnersList.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  carregarCompras();
  carregarVencedores();
});
