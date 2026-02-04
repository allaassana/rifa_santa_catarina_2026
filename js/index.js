const supabaseUrl = "https://ydyuxmwqunhomahaxet.supabase.co";
const supabaseKey = "COLOCA_AQUI_A_ANON_KEY";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const grelha = document.getElementById("grelha");
const form = document.getElementById("formCompra");
const titulo = document.getElementById("bilheteTitulo");
const contador = document.getElementById("contador");

let bilheteSelecionado = null;

// ---------- GRELHA ----------
async function carregarBilhetes() {
  grelha.innerHTML = "";

  const { data } = await supabase
    .from("bilhetes")
    .select("*")
    .order("numero");

  let vendidos = data.filter(b => b.vendido).length;
  contador.textContent = `Vendidos: ${vendidos} | Disponíveis: ${120 - vendidos}`;

  data.forEach(b => {
    const btn = document.createElement("button");
    btn.textContent = b.numero;
    btn.className = b.vendido ? "ocupado" : "livre";
    btn.disabled = b.vendido;
    btn.onclick = () => abrirFormulario(b.numero);
    grelha.appendChild(btn);
  });
}

// ---------- FORM ----------
function abrirFormulario(numero) {
  bilheteSelecionado = numero;
  titulo.textContent = `Bilhete Nº ${numero}`;
  form.classList.remove("hidden");
}

function fecharFormulario() {
  form.reset();
  form.classList.add("hidden");
}

// ---------- SUBMIT ----------
form.addEventListener("submit", async e => {
  e.preventDefault();

  const file = document.getElementById("comprovativo").files[0];
  const filePath = `bilhete_${bilheteSelecionado}_${Date.now()}`;

  const { error: uploadError } = await supabase
    .storage
    .from("comprovativos")
    .upload(filePath, file);

  if (uploadError) {
    alert("Erro no upload do comprovativo");
    return;
  }

  const { error } = await supabase.from("bilhetes").update({
    vendido: true,
    nome: nome.value,
    telefone: telefone.value,
    email: email.value,
    data_nascimento: dataNascimento.value,
    localidade: localidade.value,
    comprovativo: filePath
  }).eq("numero", bilheteSelecionado);

  if (error) {
    alert("Erro ao gravar compra");
    return;
  }

  alert("Compra registada com sucesso!");
  fecharFormulario();
  carregarBilhetes();
});

carregarBilhetes();
