document.addEventListener("DOMContentLoaded", () => {

  const db = window.db;
  const TOTAL = 120;

  const grid = document.getElementById("ticketGrid");
  const soldCount = document.getElementById("soldCount");
  const availCount = document.getElementById("availCount");
  const formArea = document.getElementById("formArea");

  let selectedTicket = null;

  async function carregarBilhetes() {
    const { data = [] } = await db.from("compras").select("bilhete");
    const vendidos = data.map(x => x.bilhete);

    grid.innerHTML = "";

    for (let i = 1; i <= TOTAL; i++) {
      const d = document.createElement("div");
      d.className = "ticket";
      d.textContent = i;

      if (vendidos.includes(i)) {
        d.classList.add("sold");
      } else {
        d.onclick = () => abrirFormulario(i);
      }

      grid.appendChild(d);
    }

    soldCount.textContent = vendidos.length;
    availCount.textContent = TOTAL - vendidos.length;
  }

  function abrirFormulario(n) {
    selectedTicket = n;
    document.getElementById("ticketNumber").textContent = n;
    formArea.style.display = "block";
  }

  const cancelBtn = document.getElementById("cancelBtn");
  if (cancelBtn) {
    cancelBtn.onclick = () => formArea.style.display = "none";
  }

  const confirmBtn = document.getElementById("confirmBtn");
  if (confirmBtn) {
    confirmBtn.onclick = async () => {

      const nome = document.getElementById("nome").value.trim();
      const telefone = document.getElementById("telefone").value.trim();
      const email = document.getElementById("email").value.trim();
      const nasc = document.getElementById("nasc").value;
      const cidade = document.getElementById("cidade").value;
      const pais = document.getElementById("pais").value;
      const file = document.getElementById("comprovativo").files[0];

      if (!nome || !telefone || !email || !file) {
        alert("Preencha todos os campos obrigatórios.");
        return;
      }

      const fileName = `${Date.now()}_${file.name}`;
      const { error: upErr } = await db.storage
        .from("comprovativos")
        .upload(fileName, file);

      if (upErr) {
        alert("Erro no upload do comprovativo");
        return;
      }

      const { data: urlData } = db.storage
        .from("comprovativos")
        .getPublicUrl(fileName);

      const { error } = await db.from("compras").insert({
        bilhete: selectedTicket,
        nome,
        telefone,
        email,
        data_nascimento: nasc,
        cidade,
        pais,
        comprovativo_url: urlData.publicUrl
      });

      if (error) {
        alert("Bilhete já vendido.");
        return;
      }

      document.getElementById("mBilhete").textContent = selectedTicket;
      document.getElementById("mNome").textContent = nome;

      document.getElementById("modal").style.display = "block";
      formArea.style.display = "none";

      carregarBilhetes();
    };
  }

  carregarBilhetes();
});

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}
