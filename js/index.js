// 🔌 SUPABASE CLIENT (CRIADO UMA ÚNICA VEZ)
const SUPABASE_URL = "https://ydyuxumwqnuhomahaxet.supabase.co";
const SUPABASE_KEY = "sb_publishable_mTc8Aoplv-HTj-23xoMZ_w_gzoQkN3u";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

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

  async function renderGrid() {
    const { data, error } = await supabaseClient
      .from("compras")
      .select("bilhete");

    const vendidos = data ? data.map(d => d.bilhete) : [];

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
    ["nome","tel","email","nasc","cidade","pais","feedback"].forEach(id => {
      document.getElementById(id).value = "";
    });
    compInput.value = "";
  }

  confirmBtn.onclick = async () => {
    if (!selectedTicket) return alert("Seleciona um bilhete.");

    const nome = val("nome");
    const telefone = val("tel");
    const email = val("email");
    const nasc = val("nasc");
    const cidade = val("cidade");
    const pais = val("pais");
    const file = compInput.files[0];

    if (!nome || !telefone || !email || !nasc || !cidade || !pais || !file) {
      return alert("Preenche todos os campos.");
    }

    try {
      const fileName = `bilhete_${selectedTicket}_${Date.now()}`;

      await supabaseClient
        .storage
        .from("comprovativos")
        .upload(fileName, file);

      const { data: url } = supabaseClient
        .storage
        .from("comprovativos")
        .getPublicUrl(fileName);

      await supabaseClient.from("compras").insert({
        bilhete: selectedTicket,
        nome,
        telefone,
        email,
        data_nascimento: nasc,
        cidade,
        pais,
        comprovativo_url: url.publicUrl,
        status: "pendente"
      });

      alert("✅ Compra registada!");
      resetForm();
      renderGrid();

    } catch (err) {
      console.error(err);
      alert("Erro ao processar a compra.");
    }
  };

  cancelBtn.onclick = resetForm;

  function val(id) {
    return document.getElementById(id).value.trim();
  }

  renderGrid();
});
