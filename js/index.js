// ===============================
// SUPABASE (UMA ÚNICA VEZ)
// ===============================
const SUPABASE_URL = "https://ydyuxumwqnuhomahaxet.supabase.co";
const SUPABASE_KEY = "sb_publishable_mTc8Aoplv-HTj-23xoMZ_w_gzoQkN3u";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ===============================
document.addEventListener("DOMContentLoaded", () => {

  const TOTAL = 120;

  const grid = document.getElementById("ticketGrid");
  const soldCountEl = document.getElementById("soldCount");
  const availCountEl = document.getElementById("availCount");
  const formArea = document.getElementById("formArea");
  const receiptBox = document.getElementById("receiptBox");

  let selectedTicket = null;

  // ===============================
  // RENDER GRID
  // ===============================
  async function renderGrid() {
    const { data, error } = await supabaseClient
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

  // ===============================
  function openForm(n) {
    selectedTicket = n;
    document.getElementById("ticketNumber").textContent = n;
    formArea.style.display = "block";
    receiptBox.style.display = "none";
  }

  // ===============================
  document.getElementById("cancelBtn").onclick = () => {
    formArea.style.display = "none";
    selectedTicket = null;
  };

  // ===============================
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

    const { error } = await supabaseClient
      .from("compras")
      .insert({
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

    // WHATSAPP
    window.open(
      `https://wa.me/238${telefone}?text=Confirmo%20a%20compra%20do%20bilhete%20${selectedTicket}%20na%20Rifa%20Santa%20Catarina`,
      "_blank"
    );

    renderGrid();
  };

  function val(id) {
    return document.getElementById(id).value.trim();
  }

  renderGrid();
});
