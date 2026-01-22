const db = window.db;

const grid = document.getElementById("grid");
const soldCountEl = document.getElementById("soldCount");
const detailBox = document.getElementById("detailBox");
const winnersList = document.getElementById("winnersList");
const drawBtn = document.getElementById("drawWinner");

const TOTAL = 120;

async function carregarCompras() {
  const { data = [] } = await db.from("compras").select("*");

  grid.innerHTML = "";
  soldCountEl.textContent = data.length;

  for (let i = 1; i <= TOTAL; i++) {
    const div = document.createElement("div");
    div.className = "ticket";
    div.textContent = i;

    const compra = data.find(c => c.bilhete === i);

    if (compra) {
      div.classList.add("sold");
      div.onclick = () => {
        detailBox.innerHTML = `
          <p><b>Bilhete:</b> ${compra.bilhete}</p>
          <p><b>Nome:</b> ${compra.nome}</p>
          <p><b>Telefone:</b> ${compra.telefone}</p>
          <p><b>Email:</b> ${compra.email}</p>
          <p><a href="${compra.comprovativo_url}" target="_blank">📎 Ver comprovativo</a></p>
          <button onclick="remover(${compra.bilhete})">❌ Eliminar</button>
        `;
      };
    }

    grid.appendChild(div);
  }
}

async function remover(bilhete) {
  if (!confirm("Eliminar este bilhete?")) return;
  await db.from("compras").delete().eq("bilhete", bilhete);
  detailBox.textContent = "Bilhete eliminado";
  carregarCompras();
}

async function carregarVencedores() {
  const { data = [] } = await db.from("vencedores").select("*");
  winnersList.innerHTML = "";
  data.forEach(v => {
    const li = document.createElement("li");
    li.textContent = `🎉 Bilhete ${v.bilhete} — ${v.nome}`;
    winnersList.appendChild(li);
  });
}

drawBtn.onclick = async () => {
  const { data } = await db.from("compras").select("*");
  if (!data.length) return alert("Sem compras");

  const v = data[Math.floor(Math.random() * data.length)];
  await db.from("vencedores").insert(v);

  alert(`🎉 Vencedor: ${v.nome}`);
  carregarVencedores();
};

document.addEventListener("DOMContentLoaded", () => {
  carregarCompras();
  carregarVencedores();
});
