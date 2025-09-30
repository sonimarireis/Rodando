// acessibilidade.js
let tamanho = 16; // tamanho inicial em px
const MIN = 10;
const MAX = 48;

function aplicarTamanho() {
  document.body.style.fontSize = tamanho + "px";
}

document.addEventListener('DOMContentLoaded', () => {
  // aplica tamanho inicial
  aplicarTamanho();

  // pega os botões pelo ID
  const btnAumentar = document.getElementById('aumentar');
  const btnDiminuir = document.getElementById('diminuir');

  if (btnAumentar) {
    btnAumentar.addEventListener('click', () => {
      if (tamanho < MAX) {
        tamanho += 2;
        aplicarTamanho();
      }
    });
  }

  if (btnDiminuir) {
    btnDiminuir.addEventListener('click', () => {
      if (tamanho > MIN) {
        tamanho -= 2;
        aplicarTamanho();
      }
    });
  }
});

//API MAPA Google

// acessibilidade.js

function initMap() {
  const portoAlegre = { lat: -30.0428357, lng: -51.2188929 }; // centro do mapa
  const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 14,
      center: portoAlegre
  });

  const service = new google.maps.places.PlacesService(map);

  // Busca por estabelecimentos acessíveis
  service.nearbySearch({
      location: portoAlegre,
      radius: 2000, // raio em metros
      type: ['restaurant', 'hotel', 'store'], // tipos de lugares
      keyword: 'wheelchair accessible' // palavra-chave para acessibilidade
  }, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
          results.forEach(place => {
              new google.maps.Marker({
                  position: place.geometry.location,
                  map: map,
                  title: place.name
              });
          });
      }
  });
}

//ativar botão pesquisa

let map;       // variável global para o mapa
let service;   // variável global para PlacesService
let markers = []; // guarda marcadores para limpar antes de nova pesquisa

function initMap() {
    const portoAlegre = { lat: -30.0428357, lng: -51.2188929 };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: portoAlegre
    });
    service = new google.maps.places.PlacesService(map);

    // pesquisa inicial: todos estabelecimentos com acessibilidade
    searchPlaces('wheelchair accessible');
}

// Função de pesquisa personalizada
function searchPlaces(keyword) {
    // remove marcadores antigos
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    const portoAlegre = { lat: -30.0428357, lng: -51.2188929 };

    service.nearbySearch({
        location: portoAlegre,
        radius: 2000,
        type: ['restaurant', 'hotel', 'store'],
        keyword: keyword
    }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(place => {
                const marker = new google.maps.Marker({
                    position: place.geometry.location,
                    map: map,
                    title: place.name
                });
                markers.push(marker);
            });
        } else {
            alert('Nenhum resultado encontrado.');
        }
    });
}

// Evento do formulário de pesquisa
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // impede recarregar a página
        const keyword = input.value + ' wheelchair accessible'; // adiciona filtro de acessibilidade
        searchPlaces(keyword);
    });
});

