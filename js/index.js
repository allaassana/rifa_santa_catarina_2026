// 🔌 SUPABASE CLIENT
const SUPABASE_URL = "https://ydyuxumwqnuhomahaxet.supabase.co";
const SUPABASE_KEY = "sb_publishable_mTc8Aoplv-HTj-23xoMZ_w_gzoQkN3u";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

document.addEventListener("DOMContentLoaded", async () => {

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

  // 🔄 Carregar bilhetes vendidos
  async function renderGrid() {
    let vendidos = [];

    const { data, error } = await supabase
      .from("compras")
      .select("bilhete");

    if (!error && data) {
      vendidos = data.map(d => d.bilhete);
    }

    grid.innerHTML = "";

    for (let i = 1; i <= TOTAL; i++) {
      const d = document.createElement("div");
      d.className = "ticket";
      d.innerText = i;

      if (vendidos.includes(i)) {
        d.classList.add("sold");
      } else {
        d.addEventListener("click", () => openForm(i));
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
    window.scrollTo({ top: formArea.offsetTop, behavior: "smooth" });
  }

  function resetForm() {
    selectedTicket = null;
    formArea.style.display = "none";
    ["nome", "tel", "email", "nasc", "cidade", "pais", "feedback"].forEach(id => {
      document.getElementById(id).value = "";
    });
    compInput.value = "";
  }

  confirmBtn.addEventListener("click", async () => {
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
    const file = compInput.files[0];

    if (!nome || !telefone || !email || !nasc || !cidade || !pais || !file) {
      alert("Preenche todos os campos e envia o comprovativo.");
      return;
    }

    try {
      // 📤 Upload comprovativo
      const ext = file.name.split(".").pop();
      const fileName = `bilhete_${selectedTicket}_${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase
        .storage
        .from("comprovativos")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase
        .storage
        .from("comprovativos")
        .getPublicUrl(fileName);

      // 🧾 Inserir compra
      const { error: insertError } = await supabase
        .from("compras")
        .insert({
          bilhete: selectedTicket,
          nome,
          telefone,
          email,
          data_nascimento: nasc,
          cidade,
          pais,
          comprovativo_url: urlData.publicUrl,
          status: "pendente"
        });

      if (insertError?.code === "23505") {
        alert("❌ Este bilhete já foi comprado.");
        return;
      }

      if (insertError) throw insertError;

      alert("✅ Compra registada com sucesso!");
      resetForm();
      renderGrid();

    } catch (err) {
      console.error(err);
      alert("Erro ao processar a compra.");
    }
  });

  cancelBtn.addEventListener("click", resetForm);

  function val(id) {
    return document.getElementById(id).value.trim();
  }

  renderGrid();
});
