const db = window.db;

document.addEventListener("DOMContentLoaded", () => {
  const TOTAL = 120;

  const grid = document.getElementById("ticketGrid");
  const soldCountEl = document.getElementById("soldCount");
  const availCountEl = document.getElementById("availCount");
  const formArea = document.getElementById("formArea");
  const receiptBox = document.getElementById("receiptBox");

  let selectedTicket = null;

  async function renderGrid() {
    const { data, error } = await db.from("compras").select("bilhete");

    if (error) {
      console.error(error);
      return;
    }

    const vendidos = data.map(d => d.bilhete);

    grid.innerHTML = "";

    for (let i = 1; i <= TOTAL; i++) {
      const d = document.createElement("div");
      d.className = "ticket";
      d.textContent = i;

      if (vendidos.includes(i)) {
        d.classList.add("sold");
      } else {
        d.onclick = () => openForm(i);
      }

      grid.appendChild(d);
    }

    soldCountEl.textContent = vendidos.length;
    availCountEl.textContent = TOTAL - vendidos.length;
  }

  function openForm(n) {
    selectedTicket = n;
    document.getElementById("ticketNumber").textContent = n;
    formArea.style.display = "block";
  }

  document.getElementById("confirmBtn").onclick = async () => {
    if (!selectedTicket) return alert("Seleciona um bilhete.");

    const nome = val("nome");
    const telefone = val("tel");
    const email = val("email");
    const nasc = val("nasc");
    const cidade = val("cidade");
    const pais = val("pais");

    if (!nome || !telefone || !email || !nasc || !cidade || !pais) {
      return alert("Preenche todos os campos obrigatórios.");
    }

    const { error } = await db.from("compras").insert({
      bilhete: selectedTicket,
      nome,
      telefone,
      email,
      data_nascimento: nasc,
      cidade,
      pais,
      status: "confirmado"
    });

    if (error) {
      console.error(error);
      alert("Erro ao registar compra.");
      return;
    }

    // RECIBO
    document.getElementById("rBilhete").textContent = selectedTicket;
    document.getElementById("rNome").textContent = nome;
    document.getElementById("rTel").textContent = telefone;
    document.getElementById("rEmail").textContent = email;

    formArea.style.display = "none";
    receiptBox.style.display = "block";

    // WhatsApp
    window.open(
      `https://wa.me/238${telefone}?text=Confirmação%20da%20compra%20do%20bilhete%20${selectedTicket}%20na%20Rifa%20Santa%20Catarina`,
      "_blank"
    );

    renderGrid();
  };

  function val(id) {
    return document.getElementById(id).value.trim();
  }

  renderGrid();
});
