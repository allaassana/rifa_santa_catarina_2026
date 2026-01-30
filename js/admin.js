document.addEventListener("DOMContentLoaded", carregarAdmin);

async function carregarAdmin() {
  const { data } = await supabase.from("compras").select("*");

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
  await supabase.from("compras").delete().neq("id", 0);
  location.reload();
}

async function sortear() {
  const { data } = await supabase.from("compras").select("*");

  if (data.length === 0) {
    alert("Nenhuma compra registada.");
    return;
  }

  const vencedor = data[Math.floor(Math.random() * data.length)];

  alert(
    `🎉 Vencedor sorteado!\n\n` +
    `Nome: ${vencedor.nome}\n` +
    `Bilhete Nº: ${vencedor.bilhete}`
  );
}
