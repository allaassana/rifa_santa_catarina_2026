import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* 🔐 SUPABASE – UMA ÚNICA VEZ */
const supabaseUrl = "https://SEU_PROJETO.supabase.co";
const supabaseKey = "SUA_PUBLIC_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

const TOTAL = 120;
const grid = document.getElementById("bilhetes");
const vendidosEl = document.getElementById("vendidos");

async function carregarAdmin() {
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
    }
    grid.appendChild(btn);
  }

  vendidosEl.textContent = vendidos.length;
}

document.getElementById("limparCompras").onclick = async () => {
  if (!confirm("Apagar todas as compras?")) return;
  await supabase.from("compras").delete().neq("id", 0);
  carregarAdmin();
};

document.getElementById("sortearVencedor").onclick = async () => {
  alert("Lógica de sorteio entra aqui");
};

carregarAdmin();
