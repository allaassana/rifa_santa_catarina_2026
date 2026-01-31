document.addEventListener("DOMContentLoaded", carregarAdmin);

async function carregarAdmin() {
  const { data } = await supabase.from("compras").select("*");

  document.getElementById("vendidos").textContent = data ? data.length : 0;

  const grid = document.getElementById("bilhetes");
  grid.innerHTML = "";

  if (!data) return;

  data.forEach(c => {
    const b = document.createElement("div");
    b.textContent = c.bilhete;
    b.className = "numero vendido";
    grid.appendChild(b);
  });
}

async function limparCompras() {
  if (!confirm("Tens a certeza?")) return;
  await supabase.from("compras").delete().neq("id", 0);
  location.reload();
}

function sortear() {
  alert("Sorteio pronto para próxima fase");
}
