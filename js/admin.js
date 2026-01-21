const grid = document.getElementById("grid");
const detailBox = document.getElementById("detailBox");
const soldCountEl = document.getElementById("soldCount");

const modal = document.getElementById("modal");
const mId = document.getElementById("mId");
const mNome = document.getElementById("mNome");
const mTel = document.getElementById("mTel");
const mEmail = document.getElementById("mEmail");
const mNasc = document.getElementById("mNasc");
const mCidade = document.getElementById("mCidade");
const mPais = document.getElementById("mPais");
const mFeedback = document.getElementById("mFeedback");
const mCompArea = document.getElementById("mCompArea");

const mSave = document.getElementById("mSave");
const mDelete = document.getElementById("mDelete");
const mClose = document.getElementById("mClose");

let currentRow = null;

// ===== CARREGAR COMPRAS =====
async function carregarCompras() {
  const { data, error } = await supabase
    .from("compras")
    .select("*");

  if (error) {
    alert("Erro ao carregar compras");
    console.error(error);
    return;
  }

  grid.innerHTML = "";
  soldCountEl.innerText = data.length;

  const vendidos = data.map(c => c.bilhete);

  for (let i = 1; i <= 120; i++) {
    const div = document.createElement("div");
    div.className = "ticket";
    div.innerText = i;

    const compra = data.find(c => c.bilhete === i);

    if (vendidos.includes(i)) {
      div.classList.add("sold");
      div.onclick = () => abrirDetalhes(compra);
    } else {
      div.style.opacity = "0.4";
      div.style.cursor = "default";
    }

    grid.appendChild(div);
  }
}

// ===== DETALHES =====
function abrirDetalhes(compra) {
  currentRow = compra;

  detailBox.innerHTML = `
    <p><strong>Bilhete:</strong> ${compra.bilhete}</p>
    <p><strong>Nome:</strong> ${compra.nome}</p>
    <p><strong>Email:</strong> ${compra.email}</p>
    <button class="btn" onclick="abrirModal()">Validar</button>
  `;
}

// ===== MODAL =====
function abrirModal() {
  modal.style.display = "flex";

  mId.innerText = currentRow.bilhete;
  mNome.value = currentRow.nome;
  mTel.value = currentRow.telefone;
  mEmail.value = currentRow.email;
  mNasc.value = currentRow.data_nascimento || "";
  mCidade.value = currentRow.cidade;
  mPais.value = currentRow.pais;
  mFeedback.value = currentRow.feedback || "";

  mCompArea.innerHTML = currentRow.comprovativo_url
    ? `<a href="${currentRow.comprovativo_url}" target="_blank">Ver comprovativo</a>`
    : "<em>Sem comprovativo</em>";
}

mClose.onclick = () => modal.style.display = "none";

// ===== CONFIRMAR =====
mSave.onclick = async () => {
  await supabase
    .from("compras")
    .update({ status: "confirmado" })
    .eq("id", currentRow.id);

  modal.style.display = "none";
  carregarCompras();
};

// ===== ELIMINAR =====
mDelete.onclick = async () => {
  if (!confirm("Eliminar compra?")) return;

  await supabase
    .from("compras")
    .delete()
    .eq("id", currentRow.id);

  modal.style.display = "none";
  carregarCompras();
};

// INIT
carregarCompras();
