const SUPABASE_URL = "https://ydyuxumwqnuhomahaxet.supabase.co";
const SUPABASE_KEY = "sb_publishable_mTc8Aoplv-HTj-23xoMZ_w_gzoQkN3u";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

document.addEventListener("DOMContentLoaded", () => {

  const TOTAL = 120;
  const grid = document.getElementById("ticketGrid");
  const soldCountEl = document.getElementById("soldCount");
  const availCountEl = document.getElementById("availCount");
  const formArea = document.getElementById("formArea");
  const receiptBox = document.getElementById("receiptBox");

  let selectedTicket = null;

  async function renderGrid() {
    const { data } = await supabaseClient.from("compras").select("bilhete");
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
    const nome = val("nome");
    const telefone = val("tel");
    const email = val("email");
    const nasc = val("nasc");
    const cidade = val("cidade");
    const pais = val("pais");

    if (!nome || !telefone || !email) {
      return alert("Preenche todos os campos obrigatórios.");
    }

    await supabaseClient.from("compras").insert({
      bilhete: selectedTicket,
      nome,
      telefone,
      email,
      data_nascimento: nasc,
      cidade,
      pais
    });

    // Recibo
    document.getElementById("rBilhete").textContent = selectedTicket;
    document.getElementById("rNome").textContent = nome;
    document.getElementById("rTel").textContent = telefone;
    document.getElementById("rEmail").textContent = email;

    formArea.style.display = "none";
    receiptBox.style.display = "block";

    // WhatsApp
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
