// Variáveis globais

// Função para inicializar o mapa
function initMap() {
    // Coordenadas de Porto Alegre
    const portoAlegre = [-30.0346, -51.2177];

    // Criando o mapa dentro da div #map
    map = L.map('map').setView(portoAlegre, 13);

    // Adiciona os tiles do OpenStreetMap (mapa base)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Captura o submit do formulário de pesquisa
    const form = document.getElementById("search-form");
    form.addEventListener("submit", function(e) {
        e.preventDefault(); // evita recarregar a página
        const query = document.getElementById("search-input").value.trim();
        if (query) searchPlaces(query);
        else alert("Digite algo para pesquisar!");
    });
}

// Função para buscar locais acessíveis usando Overpass API
function searchPlaces(userQuery) {
    // Remove marcadores antigos
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Query da Overpass API para restaurantes acessíveis em Porto Alegre
    // Aqui, você pode adicionar filtros extras, por exemplo por nome
    const overpassQuery = `
        [out:json][timeout:25];
        area["name"="Porto Alegre"]->.searchArea;
        node["amenity"="restaurant"]["wheelchair"="yes"](area.searchArea);
        out body;
    `;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(overpassQuery);

    // Faz a requisição à API
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.elements || data.elements.length === 0) {
                alert("Nenhum restaurante acessível encontrado.");
                return;
            }

            // Cria marcadores para cada local encontrado
            data.elements.forEach(place => {
                // Cria o marcador no mapa
                const marker = L.marker([place.lat, place.lon])
                    .addTo(map)
                    .bindPopup(`<strong>${place.tags.name || "Sem nome"}</strong>`); // Pop-up ao clicar
                markers.push(marker);
            });

            // Ajusta o mapa para mostrar todos os marcadores
            const group = new L.featureGroup(markers);
            map.fitBounds(group.getBounds());
        })
        .catch(err => {
            console.error("Erro ao buscar locais:", err);
            alert("Erro ao buscar os locais. Tente novamente.");
        });
}

// Inicializa o mapa quando a página carregar
window.onload = initMap;
