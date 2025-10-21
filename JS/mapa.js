// Coordenadas de Porto Alegre
const portoAlegre = [-30.0346, -51.2177];

// Inicializa o mapa
const map = L.map('map', {
  center: portoAlegre,
  zoom: 13,
  minZoom: 12,
  maxZoom: 16,
  maxBounds: [
    [-30.2, -51.4], // sudoeste
    [-29.9, -51.0]  // nordeste
  ]
});

// Adiciona mapa base do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Marcador inicial
let marker = L.marker(portoAlegre).addTo(map).bindPopup('Porto Alegre 📍').openPopup();

// Seleciona formulário e input
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');

form.addEventListener('submit', function(e) {
  e.preventDefault(); // Evita recarregar a página
  const query = input.value.trim().toLowerCase();
  if (!query) return;

  // Remove marcador anterior
  if (marker) map.removeLayer(marker);

  // Monta query Overpass
  const overpassQuery = `
    [out:json][timeout:25];
    area["name"="Porto Alegre"]["boundary"="administrative"];
    node(area)["amenity"~"${query}"]["wheelchair"="yes"];
    out center;
  `;

  fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: overpassQuery
  })
    .then(res => res.json())
    .then(data => {
      if (!data.elements || data.elements.length === 0) {
        alert('Nenhum estabelecimento encontrado com essas características em Porto Alegre.');
        return;
      }

      data.elements.forEach(el => {
        const lat = el.lat;
        const lon = el.lon;
        const name = el.tags.name || query;

        L.marker([lat, lon])
          .addTo(map)
          .bindPopup(name);
      });

      // Centraliza mapa no primeiro resultado
      const first = data.elements[0];
      map.setView([first.lat, first.lon], 15);
    })
    .catch(err => {
      console.error(err);
      alert('Erro ao buscar estabelecimentos.');
    });
});
