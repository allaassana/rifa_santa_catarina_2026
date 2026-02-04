async function carregarAdmin() {
  const { data, error } = await supabase.from("bilhetes").select("*");

  if (error) {
    console.error(error);
    return;
  }

  const grelha = document.getElementById("grelha-admin");
  grelha.innerHTML = "";

  for (let i = 1; i <= 120; i++) {
    const vendido = data.find(b => b.numero === i);
    const btn = document.createElement("button");

    btn.textContent = i;
    btn.className = vendido ? "vendido" : "livre";

    if (vendido) {
      btn.onclick = () => mostrarDetalhes(vendido);
    }

    grelha.appendChild(btn);
  }
}

function mostrarDetalhes(b) {
  document.getElementById("detalhes-bilhete").innerHTML = `
    <h3>Bilhete ${b.numero}</h3>
    <p><b>Nome:</b> ${b.nome}</p>
    <p><b>Telefone:</b> ${b.telefone}</p>
    <p><b>Email:</b> ${b.email}</p>
    <p><b>Cidade:</b> ${b.cidade}</p>
  `;
}

document.addEventListener("DOMContentLoaded", carregarAdmin);
