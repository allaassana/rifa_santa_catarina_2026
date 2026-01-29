document.addEventListener("DOMContentLoaded", () => {

  const btnConfirmar = document.getElementById("confirmarCompra");
  const btnCancelar = document.getElementById("cancelarCompra");

  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", confirmarCompra);
  }

  if (btnCancelar) {
    btnCancelar.addEventListener("click", cancelarCompra);
  }

});

function confirmarCompra() {
  // lógica que já tinhas
}

function cancelarCompra() {
  // lógica que já tinhas
}
