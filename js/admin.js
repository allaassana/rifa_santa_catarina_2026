const SUPABASE_URL = "https://SEU_PROJETO.supabase.co";
const SUPABASE_KEY = "SUA_ANON_KEY";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", carregar);

async function carregar() {
  const { data } = await supabase.from("compras").select("*");
  document.getElementById("vendidos").textContent = data.length;

  const lista = document.getElementById("listaCompras");
  lista.innerHTML = data.map(c =>
    `<p>Bilhete ${c.bilhete} – ${c.nome} (${c.status})</p>`
  ).join("");
}

document.getElementById("limparCompras").onclick = async () => {
  if (!confirm("Apagar todas as compras?")) return;
  await supabase.from("compras").delete().neq("bilhete", 0);
  carregar();
};

document.getElementById("sortearVencedor").onclick = async () => {
  const { data } = await supabase.from("compras").select("*");
  if (!data.length) return alert("Sem compras");

  const vencedor = data[Math.floor(Math.random() * data.length)];

  await supabase.from("vencedores").insert({
    bilhete: vencedor.bilhete,
    nome: vencedor.nome,
    telefone: vencedor.telefone,
    email: vencedor.email,
    data_sorteio: new Date()
  });

  alert(`🎉 Vencedor: Bilhete ${vencedor.bilhete}`);
};
