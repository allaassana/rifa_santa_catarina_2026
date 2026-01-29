document.addEventListener("DOMContentLoaded", () => {

  const limparBtn = document.getElementById("limparCompras");
  if (limparBtn) {
    limparBtn.addEventListener("click", () => {
      if (confirm("Tem a certeza que quer apagar todas as compras?")) {
        limparCompras();
      }
    });
  }

  const sortearBtn = document.getElementById("sortearVencedor");
  if (sortearBtn) {
    sortearBtn.addEventListener("click", sortear);
  }
});

function limparCompras() {
  alert("Compras limpas (simulação)");
}

function sortear() {
  alert("Vencedor sorteado 🎉");
}
