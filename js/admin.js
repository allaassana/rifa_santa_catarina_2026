document.addEventListener("DOMContentLoaded", carregarAdmin);

async function carregarAdmin() {
  const { data } = await supabase.from("compras").select("*");

  document.getElementById("vendidos").innerText = data.length;

  const grid = document.getElementById("bilhetes");
  grid.innerHTML = "";

  data.forEach(c => {
    const el = document.createElement("div");
    el.className = "numero vendido";
    el.innerText = c.bilhete;
    grid.appendChild(el);
  });
}

async function limparCompras() {
  if (!confirm("Tens a certeza?")) return;
  await supabase.from("compras").delete().neq("id", 0);
  location.reload();
}

function sortearVencedor() {
  alert("Sorteio será feito aqui (fase seguinte)");
}
