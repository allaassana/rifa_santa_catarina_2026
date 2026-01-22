// ===============================
// SUPABASE
// ===============================
const db = window.db;

const grid = document.getElementById("grid");
const soldCountEl = document.getElementById("soldCount");
const detailBox = document.getElementById("detailBox");
const winnersList = document.getElementById("winnersList");

const TOTAL = 120;

// ===============================
async function carregarCompras() {
  const { data, error } = await db.from("compras").select("*");

  if (error) {
    console.error(error);
    return;
  }

  grid.innerHTML = "";
  soldCountEl.textContent = data.length;

  for (let i = 1; i <= TOTAL; i++) {
    const d = document.createElement("div");
    d.className = "ticket";
    d.textContent = i;

    const compra = data.find(c => c.bilhete === i);

    if (compra) {
      d.classList.add("sold");
      d.onclick = () => mostrarDetalhes(compra);
    } else {
      d.style.opacity = "0.4";
    }

    grid.appendChild(d);
  }
}

// ===============================
function mostrarDetalhes(c) {
  detailBox.innerHTML = `
    <p><strong>Bilhete:</strong> ${c.bilhete}</p>
    <p><strong>Nome:</strong> ${c.nome}</p>
    <p><strong>Telefone:</strong> ${c.telefone}</p>
    <p><strong>Email:</strong> ${c.email}</p>

    <button onclick="eliminarCompra(${c.bilhete})">
      ❌ Eliminar / Libertar Bilhete
    </button>
  `;
}

// ===============================
async function eliminarCompra(bilhete) {
  if (!confirm("Eliminar esta compra?")) return;

  await db.from("compras").delete().eq("bilhete", bilhete);

  detailBox.innerHTML = "Nenhum bilhete selecionado";
  carregarCompras();
}

// ===============================
async function sortearVencedor() {

  const { data: compras } = await db
    .from("compras")
    .select("*");

  if (!compras || compras.length === 0) {
    alert("Nenhuma compra registada.");
    return;
  }

  const vencedor = compras[Math.floor(Math.random() * compras.length)];

  const { error } = await db.from("vencedores").insert({
    bilhete: vencedor.bilhete,
    nome: vencedor.nome,
    telefone: vencedor.telefone,
    email: vencedor.email
  });

  if (error) {
    console.error(error);
    alert("Erro ao registar vencedor.");
    return;
  }

  alert(`🎉 Vencedor: ${vencedor.nome} (Bilhete ${vencedor.bilhete})`);
  carregarVencedores();
}

// ===============================
async function carregarVencedores() {
  const { data } = await db
    .from("vencedores")
    .select("*")
    .order("data_sorteio", { ascending: false });

  winnersList.innerHTML = "";

  data.forEach(v => {
    const li = document.createElement("li");
    li.textContent = `🎉 Bilhete ${v.bilhete} — ${v.nome}`;
    winnersList.appendChild(li);
  });
}

// ===============================
document.getElementById("drawWinner").onclick = sortearVencedor;

document.addEventListener("DOMContentLoaded", () => {
  carregarCompras();
  carregarVencedores();
});
