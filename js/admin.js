const supabaseUrl = "https://ydyxumwqunhomahaxet.supabase.co";
const supabaseKey = "SUA_PUBLIC_ANON_KEY_AQUI";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", carregar);

async function carregar() {
  const { data } = await supabase.from("compras").select("*").order("bilhete");

  const tbody = document.getElementById("lista");
  tbody.innerHTML = "";

  data.forEach(c => {
    tbody.innerHTML += `
      <tr>
        <td>${c.bilhete}</td>
        <td>${c.nome}</td>
        <td>${c.telefone}</td>
        <td>${c.email}</td>
        <td>${c.localidade}</td>
      </tr>
    `;
  });
}
