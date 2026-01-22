const db = window.db;
const grid = document.getElementById("grid");
const soldCountEl = document.getElementById("soldCount");
const detailBox = document.getElementById("detailBox");
const winnersList = document.getElementById("winnersList");
const drawBtn = document.getElementById("drawWinner");

const TOTAL = 120;

async function carregarCompras() {
  const { data = [] } = await db.from("compras").select("*");
  soldCountEl.textContent = data.length;
  grid.innerHTML = "";

  for (let i = 1; i <= TOTAL; i++) {
    const div = document.createElement("div");
    div.className = "ticket";
    div.textContent = i;

    const c = data.find(x => x.bilhete === i);
    if (c) {
      div.classList.add("sold");
      div.onclick = () => {
        detailBox.innerHTML = `
          <p>Bilhete: ${c.bilhete}</p>
          <p>Nome: ${c.nome}</p>
          <p>Telefone: ${c.telefone}</p>
          <p>Email: ${c.email}</p>
          <a href="${c.comprovativo_url}" target="_blank">📄 Ver Comprovativo</a><br><br>
          <button onclick="remover(${c.bilhete})">❌ Eliminar</button>
        `;
      };
    }
    grid.appendChild(div);
  }
}

async function remover(b) {
  if (!confirm("Eliminar bilhete?")) return;
  await db.from("compras").delete().eq("bilhete", b);
  detailBox.innerHTML = "";
  carregarCompras();
}

async function limparTudo() {
  if (!confirm("⚠️ Apagar TODAS as compras?")) return;
  await db.from("compras").delete().neq("bilhete", 0);
  carregarCompras();
}

drawBtn.onclick = async () => {
  const { data } = await db.from("compras").select("*");
  if (!data.length) return alert("Sem compras");

  const v = data[Math.floor(Math.random() * data.length)];
  await db.from("vencedores").insert(v);
  alert(`Vencedor: ${v.nome}`);
  carregarVencedores();
};

async function carregarVencedores() {
  const { data = [] } = await db.from("vencedores").select("*");
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
