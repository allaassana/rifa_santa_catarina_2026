// ========================
// SUPABASE CONFIG
// ========================
const SUPABASE_URL = "https://ydyxumwqunuhomahaxet.supabase.co";
const SUPABASE_ANON_KEY = "COLOCA_AQUI_A_TUA_ANON_KEY";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ========================
// ESTADO
// ========================
let bilheteSelecionado = null;

// ========================
// ELEMENTOS
// ========================
const modal = document.getElementById("modal");
const fecharModalBtn = document.getElementById("fecharModal");
const confirmarBtn = document.getElementById("confirmarCompra");

// ========================
// GARANTIA: MODAL FECHADO AO CARREGAR
// ========================
document.addEventListener("DOMContentLoaded", () => {
  modal.classList.add("hidden");
});

// ========================
// SELECIONAR BILHETE
// ========================
document.querySelectorAll(".numero").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("vendido")) return;

    bilheteSelecionado = btn.dataset.numero;
    document.getElementById("bilheteNumero").innerText = bilheteSelecionado;
  });
});

// ========================
// CONFIRMAR COMPRA
// ========================
confirmarBtn.addEventListener("click", async () => {
  if (!bilheteSelecionado) {
    alert("Seleciona um bilhete.");
    return;
  }

  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const email = document.getElementById("email").value.trim();
  const nascimento = document.getElementById("nascimento").value;
  const localidade = document.getElementById("localidade").value.trim();
  const fileInput = document.getElementById("comprovativo");
  const file = fileInput.files[0];

  if (!nome || !telefone || !email || !nascimento || !localidade) {
    alert("Preenche todos os campos.");
    return;
  }

  if (!file) {
    alert("Seleciona o comprovativo de pagamento.");
    return;
  }

  // ========================
  // UPLOAD COMPROVATIVO (CORRIGIDO)
  // ========================
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}.${ext}`;
  const filePath = `bilhete_${bilheteSelecionado}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("comprovativos")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    console.error(uploadError);
    alert("Erro no upload do comprovativo.");
    return;
  }

  const { data: publicUrlData } = supabase.storage
    .from("comprovativos")
    .getPublicUrl(filePath);

  const comprovativo_url = publicUrlData.publicUrl;

  // ========================
  // GRAVAR COMPRA
  // ========================
  const { error: insertError } = await supabase.from("compras").insert([
    {
      bilhete: bilheteSelecionado,
      nome,
      telefone,
      email,
      nascimento,
      localidade,
      comprovativo_url,
    },
  ]);

  if (insertError) {
    console.error(insertError);
    alert("Erro ao gravar a compra.");
    return;
  }

  // ========================
  // SUCESSO
  // ========================
  modal.classList.remove("hidden");
});

// ========================
// FECHAR MODAL
// ========================
fecharModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  location.reload();
});
