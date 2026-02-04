const supabaseClient = window.supabase.createClient(
  "https://ydyxumwqunuhomahaxet.supabase.co",
  "SUA_ANON_PUBLIC_KEY_AQUI"
);

const grid = document.getElementById("bilhetesAdmin");
const info = document.getElementById("infoComprador");

async function carregarAdmin() {
  grid.innerHTML = "";

  const { data, error } = await supabaseClient
    .from("compras")
    .select("*");

  if (error) {
    alert("Erro admin");
    return;
  }

  for (let i = 1; i <= 120; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = "bilhete";

    const compra = data.find(c => c.bilhete === i);

    if (compra) {
      btn.classList.add("vendido");
      btn.onclick = () => mostrarInfo(compra);
    }

    grid.appendChild(btn);
  }
}

function mostrarInfo(c) {
  info.innerHTML = `
    <h3>Bilhete Nº ${c.bilhete}</h3>
    <p><strong>Nome:</strong> ${c.nome}</p>
    <p><strong>Telefone:</strong> ${c.telefone}</p>
    <p><strong>Email:</strong> ${c.email}</p>
    <p><strong>Cidade:</strong> ${c.cidade}</p>
    <p><strong>País:</strong> ${c.pais}</p>
  `;
}

carregarAdmin();
