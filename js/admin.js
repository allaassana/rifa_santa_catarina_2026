const tabela = document.getElementById("tabelaCompras");

// ===============================
// CARREGAR COMPRAS
// ===============================
async function carregarCompras() {
  const { data, error } = await db
    .from("compras")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    alert("Erro ao carregar admin");
    console.error(error);
    return;
  }

  tabela.innerHTML = "";

  data.forEach(c => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${c.bilhete}</td>
      <td>${c.nome}</td>
      <td>${c.telefone}</td>
      <td>${c.email}</td>
      <td>${c.cidade || ""}</td>
      <td>${c.pais || ""}</td>
      <td>${c.status}</td>
    `;

    tabela.appendChild(tr);
  });
}

carregarCompras();
