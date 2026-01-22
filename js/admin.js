const db = window.db;

document.addEventListener("DOMContentLoaded", () => {

  const grid = document.getElementById("grid");
  const soldCountEl = document.getElementById("soldCount");
  const detailBox = document.getElementById("detailBox");
  const winnersList = document.getElementById("winnersList");
  const drawBtn = document.getElementById("drawWinner");

  const TOTAL = 120;

  // ================================
  // CARREGAR COMPRAS
  // ================================
  async function carregarCompras() {
    const { data, error } = await db.from("compras").select("*");

    if (error) {
      console.error("Erro ao carregar compras:", error);
      return;
    }

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
            <p><strong>Bilhete:</strong> ${compra.bilhete}</p>
            <p><strong>Nome:</strong> ${compra.nome}</p>
            <p><strong>Telefone:</strong> ${compra.telefone}</p>
            <p><strong>Email:</strong> ${compra.email}</p>
            <p><strong>Status:</strong> confirmado</p>

            <button onclick="eliminarCompra('${compra.id}')">
              ❌ Eliminar Bilhete
            </button>
          `;
        };
      } else {
        div.style.opacity = "0.3";
      }

      grid.appendChild(div);
    }
  }

  // ================================
  // ELIMINAR COMPRA (DESISTÊNCIA)
  // ================================
  window.eliminarCompra = async function (id) {
    if (!confirm("Eliminar este bilhete?")) return;

    const { error } = await db.from("compras").delete().eq("id", id);

    if (error) {
      alert("Erro ao eliminar.");
      return;
    }

    alert("Bilhete eliminado com sucesso.");
    detailBox.innerHTML = "Nenhum bilhete selecionado";
    carregarCompras();
  };

  // ================================
  // CARREGAR VENCEDORES
  // ================================
  async function carregarVencedores() {
    const { data, error } = await db.from("vencedores").select("*");

    if (error) {
      console.error(error);
      return;
    }

    winnersList.innerHTML = "";

    data.forEach(v => {
      const li = document.createElement("li");
      li.textContent = `🎉 Bilhete ${v.bilhete} — ${v.nome}`;
      winnersList.appendChild(li);
    });
  }

  // ================================
  // SORTEAR VENCEDOR (MANUAL)
  // ================================
  async function sortearVencedor() {
    const { data: compras } = await db.from("compras").select("*");

    if (!compras || compras.length === 0) {
      alert("Nenhuma compra encontrada.");
      return;
    }

    const vencedor = compras[Math.floor(Math.random() * compras.length)];

    const { error } = await db.from("vencedores").insert({
      bilhete: vencedor.bilhete,
      nome: vencedor.nome
    });

    if (error) {
      console.error(error);
      alert("Erro ao registar vencedor.");
      return;
    }

    alert(`🎉 Vencedor:\n${vencedor.nome}\nBilhete ${vencedor.bilhete}`);
    carregarVencedores();
  }

  drawBtn.onclick = sortearVencedor;

  // INIT
  carregarCompras();
  carregarVencedores();
});
