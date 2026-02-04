const grid = document.getElementById("grid");
const detalhes = document.getElementById("detalhes");
const vencedores = document.getElementById("vencedores");
const TOTAL = 120;

async function carregarAdmin() {
  const { data = [] } = await db.from("compras").select("*");
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
  detalhes.innerHTML = `
    <p><b>Bilhete:</b> ${c.bilhete}</p>
    <p><b>Nome:</b> ${c.nome}</p>
    <p><b>Telefone:</b> ${c.telefone}</p>
    <p><b>Email:</b> ${c.email}</p>
    <a href="${c.comprovativo}" target="_blank">📎 Comprovativo</a>
  `;
}

document.getElementById("sortear").onclick = async () => {
  const { data } = await db.from("compras").select("*");
  const v = data[Math.floor(Math.random() * data.length)];
  await db.from("vencedores").insert(v);
  carregarVencedores();
};

async function carregarVencedores() {
  const { data = [] } = await db.from("vencedores").select("*");
  vencedores.innerHTML = "";
  data.forEach(v => {
    const li = document.createElement("li");
    li.textContent = `Bilhete ${v.bilhete} — ${v.nome}`;
    vencedores.appendChild(li);
  });
}

carregarAdmin();
carregarVencedores();
