document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("bilhetes");
  const vendidosEl = document.getElementById("vendidos");
  const disponiveisEl = document.getElementById("disponiveis");

  const TOTAL = 120;
  let vendidos = 0;

  grid.innerHTML = "";

  for (let i = 1; i <= TOTAL; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;

    btn.addEventListener("click", () => {
      alert(`Bilhete Nº ${i}\n\nApós o pagamento, envie o comprovativo.`);
    });

    grid.appendChild(btn);
  }

  vendidosEl.textContent = vendidos;
  disponiveisEl.textContent = TOTAL - vendidos;
});
