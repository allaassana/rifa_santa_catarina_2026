const grid = document.getElementById("grid");
const detalhes = document.getElementById("detalhes");

async function carregarCompras() {
  const { data, error } = await db
    .from("compras")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  const vendidos = data.map(c => c.bilhete);

  grid.innerHTML = "";

  for (let i = 1; i <= 120; i++) {
    const btn = document.createElement("div");
    btn.classList.add("ticket");

    if (vendidos.includes(i)) {
      btn.classList.add("sold");
    } else {
      btn.classList.add("available");
    }

    btn.textContent = i;

    btn.onclick = () => {
      const compra = data.find(c => c.bilhete === i);
      if (!compra) {
        detalhes.innerHTML = "<p>Bilhete disponível</p>";
        return;
      }

      detalhes.innerHTML = `
        <p><strong>Bilhete:</strong> ${compra.bilhete}</p>
        <p><strong>Nome:</strong> ${compra.nome}</p>
        <p><strong>Telefone:</strong> ${compra.telefone}</p>
        <p><strong>Email:</strong> ${compra.email}</p>
        <p><strong>Cidade:</strong> ${compra.cidade}</p>
        <p><strong>País:</strong> ${compra.pais}</p>
        ${
          compra.comprovativo_url
            ? `<p><a href="${compra.comprovativo_url}" target="_blank">📎 Ver comprovativo</a></p>`
            : ""
        }
      `;
    };

    grid.appendChild(btn);
  }
}

carregarCompras();
