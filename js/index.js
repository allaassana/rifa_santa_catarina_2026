import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* 🔐 SUPABASE – UMA ÚNICA VEZ */
const supabaseUrl = "https://SEU_PROJETO.supabase.co";
const supabaseKey = "SUA_PUBLIC_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

const TOTAL = 120;

const grid = document.getElementById("bilhetes");
const vendidosEl = document.getElementById("vendidos");
const disponiveisEl = document.getElementById("disponiveis");

async function carregarBilhetes() {
  const { data } = await supabase
    .from("compras")
    .select("bilhete");

  const vendidos = data ? data.map(b => b.bilhete) : [];

  grid.innerHTML = "";

  for (let i = 1; i <= TOTAL; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;

    if (vendidos.includes(i)) {
      btn.classList.add("vendido");
      btn.disabled = true;
    } else {
      btn.onclick = () => iniciarCompra(i);
    }

    grid.appendChild(btn);
  }

  vendidosEl.textContent = vendidos.length;
  disponiveisEl.textContent = TOTAL - vendidos.length;
}

function iniciarCompra(numero) {
  alert(
    `Bilhete Nº ${numero}\n\n` +
    `Preenche o formulário e envia o comprovativo.\n` +
    `Este número ficará reservado após submissão.`
  );
  // aqui entra o formulário (próximo passo)
}

carregarBilhetes();
