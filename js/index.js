document.addEventListener("DOMContentLoaded", () => {

  const db = window.supabaseClient;
  const TOTAL = 120;

  const grid = document.getElementById("ticketGrid");
  const soldCountEl = document.getElementById("soldCount");
  const availCountEl = document.getElementById("availCount");
  const formArea = document.getElementById("formArea");
  const receiptBox = document.getElementById("receiptBox");

  let selectedTicket = null;

  // ================================
  // GRID
  // ================================
  async function renderGrid() {
    const { data, error } = await db
      .from("compras")
      .select("bilhete");

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

  // ================================
  // FORM
  // ================================
  function openForm(n) {
    selectedTicket = n;
    document.getElementById("ticketNumber").textContent = n;
    formArea.style.display = "block";
    receiptBox.style.display = "none";
  }

  function resetForm() {
    selectedTicket = null;
    formArea.style.display = "none";
    receiptBox.style.display = "none";

    ["nome","tel","email","nasc","cidade","pais","feedback"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
  }

  // ================================
  // CONFIRMAR COMPRA
  // ================================
  document.getElementById("confirmBtn").onclick = async () => {

    if (!selectedTicket) {
      alert("Seleciona um bilhete.");
      return;
    }

    const nome = val("nome");
    const telefone = val("tel");
    const email = val("email");
    const nasc = val("nasc");
    const cidade = val("cidade");
    const pais = val("pais");

    if (!nome || !telefone || !email || !nasc || !cidade || !pais) {
      alert("Preenche todos os campos obrigatórios.");
      return;
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
      alert("Erro ao registar a compra.");
      return;
    }

    // RECIBO
    document.getElementById("rBilhete").textContent = selectedTicket;
    document.getElementById("rNome").textContent = nome;
    document.getElementById("rTel").textContent = telefone;
    document.getElementById("rEmail").textContent = email;

    formArea.style.display = "none";
    receiptBox.style.display = "block";

    // WHATSAPP
    const msg = encodeURIComponent(
      `✅ Compra confirmada!\nBilhete Nº ${selectedTicket}\nRifa Santa Catarina 2025`
    );

    window.open(`https://wa.me/238${telefone}?text=${msg}`, "_blank");

    renderGrid();
  };

  document.getElementById("cancelBtn").onclick = resetForm;

  function val(id) {
    return document.getElementById(id).value.trim();
  }

  renderGrid();
});
