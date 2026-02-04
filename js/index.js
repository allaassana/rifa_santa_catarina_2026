const supabaseUrl = "https://ydyxumwqunhomahaxet.supabase.co";
const supabaseKey = "SUA_PUBLIC_ANON_KEY_AQUI";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

let bilheteAtual = null;

document.addEventListener("DOMContentLoaded", () => {
  criarBilhetes();
  carregarEstado();
});

function criarBilhetes() {
  const div = document.getElementById("bilhetes");
  for (let i = 1; i <= 120; i++) {
    const b = document.createElement("button");
    b.textContent = i;
    b.onclick = () => selecionarBilhete(i);
    b.id = `b-${i}`;
    div.appendChild(b);
  }
}

function selecionarBilhete(n) {
  bilheteAtual = n;
  document.getElementById("bilheteSelecionado").innerText = n;
}

async function carregarEstado() {
  const { data } = await supabase.from("compras").select("bilhete");

  data.forEach(r => {
    const btn = document.getElementById(`b-${r.bilhete}`);
    if (btn) {
      btn.disabled = true;
      btn.style.background = "green";
    }
  });

  document.getElementById("vendidos").innerText = data.length;
  document.getElementById("disponiveis").innerText = 120 - data.length;
}

async function confirmarCompra() {
  if (!bilheteAtual) return alert("Selecione um bilhete");

  const nome = nome.value;
  const telefone = telefone.value;
  const email = email.value;
  const data_nascimento = data_nascimento.value;
  const localidade = localidade.value;
  const file = comprovativo.files[0];

  if (!file) return alert("Envie o comprovativo");

  const path = `${Date.now()}-${file.name}`;
  const upload = await supabase.storage
    .from("comprovativos")
    .upload(path, file);

  if (upload.error) {
    alert("Erro no upload");
    return;
  }

  const { error } = await supabase.from("compras").insert({
    bilhete: bilheteAtual,
    nome,
    telefone,
    email,
    data_nascimento,
    localidade,
    comprovativo: path
  });

  if (error) {
    alert("Erro ao gravar compra");
    return;
  }

  alert("Compra realizada com sucesso!");
  location.reload();
}
