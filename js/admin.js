const supabase = window.supabaseClient;

const grid = document.getElementById("grid");
const detailBox = document.getElementById("detailBox");
const soldCountEl = document.getElementById("soldCount");

const modal = document.getElementById("modal");
const mId = document.getElementById("mId");
const mNome = document.getElementById("mNome");
const mTel = document.getElementById("mTel");
const mEmail = document.getElementById("mEmail");
const mStatus = document.getElementById("mStatus");
const mClose = document.getElementById("mClose");

let cache = "";

async function carregarCompras() {
  const { data, error } = await supabase
    .from("compras")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  const hash = JSON.stringify(data);
  if (hash === cache) return;
  cache = hash;

  grid.innerHTML = "";
  soldCountEl.textContent = data.length;

  const vendidos = data.map(c => c.bilhete);

  for (let i = 1; i <= 120; i++) {
    const div = document.createElement("div");
    div.className = "ticket";
    div.textContent = i;

    const compra = data.find(c => c.bilhete === i);

    if (vendidos.includes(i)) {
      div.classList.add("sold");
      div.onclick = () => abrirModal(compra);
    } else {
      div.style.opacity = "0.4";
      div.style.cursor = "default";
    }

    grid.appendChild(div);
  }
}

function abrirModal(compra) {
  modal.style.display = "flex";
  mId.textContent = compra.bilhete;
  mNome.value = compra.nome;
  mTel.value = compra.telefone;
  mEmail.value = compra.email;
  mStatus.value = compra.status;
}

mClose.onclick = () => {
  modal.style.display = "none";
};

// 🔁 sincronização automática (index ↔ admin)
carregarCompras();
setInterval(carregarCompras, 5000);
