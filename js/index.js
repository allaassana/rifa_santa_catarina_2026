// =======================
// SUPABASE (UMA ÚNICA VEZ)
// =======================
const supabaseClient = window.supabase.createClient(
  "https://ydyxumwqunuhomahaxet.supabase.co",
  "SUA_ANON_PUBLIC_KEY_AQUI"
);

// =======================
// ELEMENTOS
// =======================
const bilhetesDiv = document.getElementById("bilhetes");
const vendidosSpan = document.getElementById("vendidos");
const disponiveisSpan = document.getElementById("disponiveis");
const form = document.getElementById("formulario");
const modal = document.getElementById("modal");

let bilheteSelecionado = null;

// =======================
// CARREGAR BILHETES
// =======================
async function carregarBilhetes() {
  bilhetesDiv.innerHTML = "";

  const { data, error } = await supabaseClient
    .from("compras")
    .select("bilhete");

  if (error) {
    alert("Erro ao carregar bilhetes");
    return;
  }

  const vendidos = data.map(b => b.bilhete);

  let vendidosCount = vendidos.length;
  let total = 120;

  vendidosSpan.textContent = vendidosCount;
  disponiveisSpan.textContent = total - vendidosCount;

  for (let i = 1; i <= total; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = "bilhete";

    if (vendidos.includes(i)) {
      btn.classList.add("vendido");
      btn.disabled = true;
    } else {
      btn.onclick = () => selecionarBilhete(i);
    }

    bilhetesDiv.appendChild(btn);
  }
}

// =======================
// SELECIONAR BILHETE
// =======================
function selecionarBilhete(num) {
  bilheteSelecionado = num;
  document.getElementById("bilheteSelecionado").textContent =
    "Bilhete Nº " + num;
  form.classList.remove("hidden");
}

// =======================
// CONFIRMAR COMPRA
// =======================
async function confirmarCompra() {
  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const email = document.getElementById("email").value.trim();
  const dataNasc = document.getElementById("data_nascimento").value;
  const cidade = document.getElementById("cidade").value.trim();
  const pais = document.getElementById("pais").value.trim();
  const ficheiro = document.getElementById("comprovativo").files[0];

  if (!nome || !telefone || !email || !bilheteSelecionado || !ficheiro) {
    alert("Preenche todos os campos obrigatórios");
    return;
  }

  // ========= UPLOAD COMPROVATIVO =========
  const nomeFicheiro = `${Date.now()}_${ficheiro.name}`;

  const { error: uploadError } = await supabaseClient.storage
    .from("comprovativos")
    .upload(nomeFicheiro, ficheiro, { upsert: false });

  if (uploadError) {
    alert("Erro no upload do comprovativo");
    return;
  }

  // ========= GUARDAR COMPRA =========
  const { error } = await supabaseClient.from("compras").insert([{
    bilhete: bilheteSelecionado,
    nome,
    telefone,
    email,
    data_nascimento: dataNasc,
    cidade,
    pais,
    comprovativo: nomeFicheiro
  }]);

  if (error) {
    alert("Erro ao guardar compra");
    return;
  }

  mostrarModal(bilheteSelecionado, nome);
  form.classList.add("hidden");
  await carregarBilhetes();
}

// =======================
// MODAL (SÓ APÓS COMPRA)
// =======================
function mostrarModal(bilhete, nome) {
  modal.classList.remove("hidden");
  modal.innerHTML = `
    <div class="modal-box">
      <h3>✅ Compra Confirmada</h3>
      <p><strong>Bilhete:</strong> ${bilhete}</p>
      <p><strong>Nome:</strong> ${nome}</p>
      <button onclick="fecharModal()">Fechar</button>
    </div>
  `;
}

function fecharModal() {
  modal.classList.add("hidden");
  modal.innerHTML = "";
}

// =======================
function cancelar() {
  form.classList.add("hidden");
  bilheteSelecionado = null;
}

// =======================
carregarBilhetes();
