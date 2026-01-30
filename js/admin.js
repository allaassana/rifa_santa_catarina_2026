document.addEventListener("DOMContentLoaded", () => {

  const limparBtn = document.getElementById("limparCompras");
  const sortearBtn = document.getElementById("sortearVencedor");

  if (limparBtn) {
    limparBtn.addEventListener("click", () => {
      if (confirm("Tem a certeza que quer apagar todas as compras?")) {
        alert("Compras limpas (simulação)");
      }
    });
  }

  if (sortearBtn) {
    sortearBtn.addEventListener("click", () => {
      const vencedor = Math.floor(Math.random() * 120) + 1;
      alert(`🎉 Bilhete vencedor: Nº ${vencedor}`);
    });
  }
});
