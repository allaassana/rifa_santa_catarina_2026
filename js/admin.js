document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("limparCompras")
    .addEventListener("click", () => {
      if (confirm("Tem a certeza que quer apagar todas as compras?")) {
        alert("Compras limpas (simulação)");
      }
    });

  document.getElementById("sortearVencedor")
    .addEventListener("click", () => {
      alert("Vencedor sorteado 🎉");
    });
});
