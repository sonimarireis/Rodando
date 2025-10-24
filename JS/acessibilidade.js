// Acessibilidade A+ A-
let tamanho = 100; // tamanho inicial em %
const MIN = 50;
const MAX = 200;

function aplicarTamanho() {
  document.documentElement.style.fontSize = tamanho + "%";
}

document.addEventListener('DOMContentLoaded', () => {
  aplicarTamanho();

  const btnAumentar = document.getElementById('aumentar');
  const btnDiminuir = document.getElementById('diminuir');

  if (btnAumentar) {
    btnAumentar.addEventListener('click', () => {
      if (tamanho < MAX) {
        tamanho += 10;
        aplicarTamanho();
      }
    });
  }

  if (btnDiminuir) {
    btnDiminuir.addEventListener('click', () => {
      if (tamanho > MIN) {
        tamanho -= 10;
        aplicarTamanho();
      }
    });
  }
});
