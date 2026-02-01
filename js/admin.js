const SUPABASE_URL = "https://ydyuxumwquhomahaxet.supabase.co";
const SUPABASE_KEY = "COLOCA_AQUI_A_PUBLISHABLE_KEY";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", carregarAdmin);

async function carregarAdmin() {
  const { data, error } = await client.from("compras").select("*");

  if (error) {
    alert("Erro ao carregar admin");
    console.error(error);
    return;
  }

  document.getElementById("vendidos").textContent = data.length;

  const grid = document.getElementById("bilhetes");
  grid.innerHTML = "";

  data.forEach(c => {
    const b = document.createElement("div");
    b.textContent = c.bilhete;
    b.className = "numero vendido";
    grid.appendChild(b);
  });
}

async function limparCompras() {
  if (!confirm("Tens a certeza?")) return;
  await client.from("compras").delete().neq("id", 0);
  location.reload();
}

function sortear() {
  alert("Sorteio manual pelo admin");
}
