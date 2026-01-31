document.addEventListener("DOMContentLoaded", carregarAdmin);

async function carregarAdmin() {
  const { data, error } = await supabaseClient
    .from("compras")
    .select("bilhete");

  if (error) {
    alert("Erro ao carregar admin");
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

  await supabaseClient.from("compras").delete().neq("id", 0);
  location.reload();
}

function sortear() {
  alert("Sorteio será feito aqui (próximo passo)");
}
