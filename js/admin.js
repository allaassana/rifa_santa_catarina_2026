const db = window.db;
const TOTAL = 120;

const grid = document.getElementById("grid");
const soldCount = document.getElementById("soldCount");
const detailBox = document.getElementById("detailBox");

async function carregarCompras() {
  const { data = [] } = await db.from("compras").select("*");

  grid.innerHTML = "";
  soldCount.textContent = data.length;

  for (let i = 1; i <= TOTAL; i++) {
    const div = document.createElement("div");
    div.className = "ticket";
    div.textContent = i;

    const compra = data.find(c => c.bilhete === i);

    if (compra) {
      div.classList.add("sold");
      div.onclick = () => {
        detailBox.innerHTML = `
          <p><strong>Bilhete:</strong> ${compra.bilhete}</p>
          <p><strong>Nome:</strong> ${compra.nome}</p>
          <p><strong>Telefone:</strong> ${compra.telefone}</p>
          <p><strong>Email:</strong> ${compra.email}</p>
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

carregarCompras();
