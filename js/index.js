// ===============================
// SUPABASE (ÚNICO CLIENTE)
// ===============================
const db = supabase.createClient(
  "https://ydyuxumwqnuhomahaxet.supabase.co",
  "sb_publishable_mTc8Aoplv-HTj-23xoMZ_w_gzoQkN3u"
);

document.addEventListener("DOMContentLoaded", () => {
  const TOTAL = 120;

  const grid = document.getElementById("ticketGrid");
  const soldCountEl = document.getElementById("soldCount");
  const availCountEl = document.getElementById("availCount");
  const formArea = document.getElementById("formArea");
  const receiptBox = document.getElementById("receiptBox");

  let selectedTicket = null;

  // ===============================
  // GRELHA
  // ===============================
  async function renderGrid() {
    const { data = [] } = await db.from("compras").select("bilhete");
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
    receiptBox.style.display = "none";
  }

  // ===============================
  // CONFIRMAR COMPRA
  // ===============================
  document.getElementById("confirmBtn").onclick = async () => {
    if (!selectedTicket) return alert("Selecione um bilhete");

    const nome = val("nome");
    const telefone = val("tel");
    const email = val("email");
    const nasc = val("nasc");
    const cidade = val("cidade");
    const pais = val("pais");

    if (!nome || !telefone || !email) {
      return alert("Preencha todos os campos obrigatórios");
    }

    const { error } = await db.from("compras").insert({
      bilhete: selectedTicket,
      nome,
      telefone,
      email,
      data_nascimento: nasc,
      cidade,
      pais
    });

    if (error) {
      alert("Erro ao registar compra");
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
    window.open(
      `https://wa.me/238${telefone}?text=✅ Compra confirmada! Bilhete nº ${selectedTicket} — Rifa Santa Catarina`,
      "_blank"
    );

    renderGrid();
  };

  document.getElementById("cancelBtn").onclick = () => {
    formArea.style.display = "none";
  };

  function val(id) {
    return document.getElementById(id).value.trim();
  }

  renderGrid();
});
