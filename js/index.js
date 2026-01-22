const db = window.db;

document.addEventListener("DOMContentLoaded", () => {
  const TOTAL = 120;

  const grid = document.getElementById("ticketGrid");
  const soldCount = document.getElementById("soldCount");
  const availCount = document.getElementById("availCount");
  const formArea = document.getElementById("formArea");
  const receiptModal = document.getElementById("receiptModal");

  let selectedTicket = null;

  async function renderGrid() {
    const { data = [] } = await db.from("compras").select("bilhete");
    const vendidos = data.map(d => d.bilhete);

    grid.innerHTML = "";

    for (let i = 1; i <= TOTAL; i++) {
      const div = document.createElement("div");
      div.className = "ticket";
      div.textContent = i;

      if (vendidos.includes(i)) {
        div.classList.add("sold");
      } else {
        div.onclick = () => openForm(i);
      }

      grid.appendChild(div);
    }

    soldCount.textContent = vendidos.length;
    availCount.textContent = TOTAL - vendidos.length;
  }

  function openForm(n) {
    selectedTicket = n;
    document.getElementById("ticketNumber").textContent = n;
    formArea.style.display = "block";
  }

  document.getElementById("confirmBtn").onclick = async () => {
    if (!selectedTicket) return;

    const nome = val("nome");
    const tel = val("tel");
    const email = val("email");

    if (!nome || !tel || !email) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    const { error } = await db.from("compras").insert({
      bilhete: selectedTicket,
      nome,
      telefone: tel,
      email
    });

    if (error) {
      if (error.code === "23505") {
        alert("❌ Este bilhete já foi vendido.");
        formArea.style.display = "none";
        renderGrid();
        return;
      }

      alert("Erro ao registar compra");
      return;
    }

    document.getElementById("rBilhete").textContent = selectedTicket;
    document.getElementById("rNome").textContent = nome;
    document.getElementById("rTel").textContent = tel;
    document.getElementById("rEmail").textContent = email;

    receiptModal.style.display = "block";
    formArea.style.display = "none";

    document.getElementById("whatsappBtn").onclick = () => {
      const msg = `Olá, aqui está o bilhete número ${selectedTicket}. Compra confirmada!`;
      window.open(
        `https://wa.me/238${tel}?text=${encodeURIComponent(msg)}`,
        "_blank"
      );
    };

    renderGrid();
  };

  document.getElementById("cancelBtn").onclick = () => {
    formArea.style.display = "none";
  };

  window.fecharModal = () => {
    receiptModal.style.display = "none";
  };

  function val(id) {
    return document.getElementById(id).value.trim();
  }

  renderGrid();
});
