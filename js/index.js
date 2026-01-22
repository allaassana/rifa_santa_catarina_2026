const db = window.db;

document.addEventListener("DOMContentLoaded", () => {
  const TOTAL = 120;

  const grid = document.getElementById("ticketGrid");
  const soldCount = document.getElementById("soldCount");
  const availCount = document.getElementById("availCount");
  const formArea = document.getElementById("formArea");
  const receiptModal = document.getElementById("receiptModal");
  const confirmBtn = document.getElementById("confirmBtn");

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

  async function openForm(n) {
    await renderGrid(); // sincroniza sempre
    selectedTicket = n;
    document.getElementById("ticketNumber").textContent = n;
    formArea.style.display = "block";
  }

  confirmBtn.onclick = async () => {
    confirmBtn.disabled = true;

    const nome = val("nome");
    const tel = val("tel");
    const email = val("email");
    const file = document.getElementById("comp").files[0];

    if (!nome || !tel || !email || !file) {
      alert("Preencha todos os campos");
      confirmBtn.disabled = false;
      return;
    }

    const fileName = `comprovativos/${selectedTicket}_${Date.now()}`;
    await db.storage.from("comprovativos").upload(fileName, file);
    const { data: pub } = db.storage.from("comprovativos").getPublicUrl(fileName);

    const { error } = await db.from("compras").insert({
      bilhete: selectedTicket,
      nome,
      telefone: tel,
      email,
      comprovativo_url: pub.publicUrl
    });

    if (error) {
      if (error.code === "23505") {
        alert("❌ Este bilhete já foi vendido. Lista atualizada.");
        await renderGrid();
        formArea.style.display = "none";
      } else {
        alert("Erro ao registar compra.");
      }
      confirmBtn.disabled = false;
      return;
    }

    document.getElementById("rBilhete").textContent = selectedTicket;
    document.getElementById("rNome").textContent = nome;
    document.getElementById("rTel").textContent = tel;
    document.getElementById("rEmail").textContent = email;

    receiptModal.style.display = "block";
    formArea.style.display = "none";

    document.getElementById("whatsappBtn").onclick = () => {
      window.open(
        `https://wa.me/238${tel}?text=Olá, aqui está o bilhete número ${selectedTicket}. Compra confirmada!`,
        "_blank"
      );
    };

    confirmBtn.disabled = false;
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
