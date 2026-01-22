const db = window.db;

document.addEventListener("DOMContentLoaded", () => {

  const TOTAL = 120;

  const grid = document.getElementById("ticketGrid");
  const soldCountEl = document.getElementById("soldCount");
  const availCountEl = document.getElementById("availCount");
  const formArea = document.getElementById("formArea");
  const ticketNumberEl = document.getElementById("ticketNumber");
  const confirmBtn = document.getElementById("confirmBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const compInput = document.getElementById("comp");

  let selectedTicket = null;

  // =========================
  // GRID
  // =========================
  async function renderGrid() {
    const { data } = await db.from("compras").select("bilhete");
    const vendidos = data.map(d => d.bilhete);

    grid.innerHTML = "";

    for (let i = 1; i <= TOTAL; i++) {
      const d = document.createElement("div");
      d.className = "ticket";
      d.innerText = i;

      if (vendidos.includes(i)) {
        d.classList.add("sold");
      } else {
        d.onclick = () => openForm(i);
      }
      grid.appendChild(d);
    }

    soldCountEl.innerText = vendidos.length;
    availCountEl.innerText = TOTAL - vendidos.length;
  }

  function openForm(n) {
    selectedTicket = n;
    ticketNumberEl.innerText = n;
    formArea.style.display = "block";
  }

  function resetForm() {
    selectedTicket = null;
    formArea.style.display = "none";
    ["nome","tel","email","nasc","cidade","pais"].forEach(id => {
      document.getElementById(id).value = "";
    });
    compInput.value = "";
  }

  // =========================
  // CONFIRMAR COMPRA
  // =========================
  confirmBtn.onclick = async () => {
    if (!selectedTicket) return;

    const nome = val("nome");
    const telefone = val("tel");
    const email = val("email");
    const nasc = val("nasc");
    const cidade = val("cidade");
    const pais = val("pais");
    const file = compInput.files[0];

    if (!nome || !telefone || !email || !file) {
      return alert("Preenche todos os campos.");
    }

    const fileName = `bilhete_${selectedTicket}_${Date.now()}`;

    await db.storage.from("comprovativos").upload(fileName, file);

    const { data: url } = db.storage
      .from("comprovativos")
      .getPublicUrl(fileName);

    await db.from("compras").insert({
      bilhete: selectedTicket,
      nome,
      telefone,
      email,
      data_nascimento: nasc,
      cidade,
      pais,
      comprovativo_url: url.publicUrl,
      status: "confirmado"
    });

    mostrarRecibo({ bilhete: selectedTicket, nome, telefone, email });
    resetForm();
    renderGrid();
  };

  cancelBtn.onclick = resetForm;

  // =========================
  // RECIBO + WHATSAPP
  // =========================
  function mostrarRecibo(d) {
    document.getElementById("rBilhete").innerText = d.bilhete;
    document.getElementById("rNome").innerText = d.nome;
    document.getElementById("rTel").innerText = d.telefone;
    document.getElementById("rEmail").innerText = d.email;

    const msg = `Olá ${d.nome} 👋%0A%0A✅ Compra confirmada!%0A🎟 Bilhete: ${d.bilhete}%0A💶 Valor: 20€%0A%0ABoa sorte 🍀`;

    document.getElementById("whatsappBtn").onclick = () => {
      window.open(`https://wa.me/${d.telefone}?text=${msg}`, "_blank");
    };

    document.getElementById("receiptModal").style.display = "flex";
  }

  window.fecharModal = () => {
    document.getElementById("receiptModal").style.display = "none";
  };

  function val(id) {
    return document.getElementById(id).value.trim();
  }

  renderGrid();
});
