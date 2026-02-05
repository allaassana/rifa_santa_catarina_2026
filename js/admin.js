document.addEventListener("DOMContentLoaded", carregarCompras);

async function carregarCompras() {
  const tabela = document.getElementById("listaCompras");
  if (!tabela) return;

  const { data, error } = await db
    .from("compras")
    .select("*")
    .order("bilhete", { ascending: true });

  if (error) {
    alert("Erro ao carregar admin");
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
      <td>${c.status}</td>
    `;
    tabela.appendChild(tr);
  });
}
