const tbody = document.getElementById("comprasBody");

async function carregarCompras() {
  const { data, error } = await db
    .from("compras")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    alert("Erro ao carregar compras");
    return;
  }

  tbody.innerHTML = "";

  data.forEach(c => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${c.bilhete}</td>
      <td>${c.nome}</td>
      <td>${c.telefone}</td>
      <td>${c.email}</td>
      <td>${c.cidade || ""}</td>
      <td>${c.status}</td>
    `;

    tbody.appendChild(tr);
  });
}

carregarCompras();
