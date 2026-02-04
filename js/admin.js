const supabaseUrl = "https://ydyuxmwqunhomahaxet.supabase.co";
const supabaseKey = "COLOCA_AQUI_A_ANON_KEY";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const grelha = document.getElementById("grelhaAdmin");
const detalhes = document.getElementById("detalhes");

async function carregarAdmin() {
  grelha.innerHTML = "";

  const { data } = await supabase
    .from("bilhetes")
    .select("*")
    .order("numero");

  data.forEach(b => {
    const btn = document.createElement("button");
    btn.textContent = b.numero;
    btn.className = b.vendido ? "ocupado" : "livre";
    btn.onclick = () => mostrarDetalhes(b);
    grelha.appendChild(btn);
  });
}

function mostrarDetalhes(b) {
  detalhes.textContent = JSON.stringify(b, null, 2);
}

carregarAdmin();
