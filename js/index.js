document.addEventListener("DOMContentLoaded", () => {

  const grid = document.getElementById("numeros");
  if (!grid) return;

  const TOTAL = 120;

  for (let i = 1; i <= TOTAL; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = "numero";

    btn.addEventListener("click", () => {
      selecionarBilhete(i);
    });

    grid.appendChild(btn);
  }
});

function selecionarBilhete(numero) {
  const form = document.getElementById("formCompra");
  if (!form) return;

  document.getElementById("bilheteSelecionado").textContent =
    `Bilhete Nº ${numero}`;

  form.style.display = "block";
}
