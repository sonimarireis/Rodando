let map;
let markers = [];

function initMap() {
    const portoAlegre = { lat: -30.0346, lng: -51.2177 };

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: portoAlegre,
    });

    new google.maps.Marker({
        position: portoAlegre,
        map: map,
        title: "Porto Alegre - RS",
    });

    const form = document.getElementById("search-form");
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        const query = document.getElementById("search-input").value;
        searchPlaces(query);
    });
}

function searchPlaces(query) {
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    const service = new google.maps.places.PlacesService(map);

    const request = {
        location: map.getCenter(),
        radius: 5000,
        keyword: query,
    };

    service.nearbySearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(place => {
                const marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location,
                    title: place.name,
                });

                const infowindow = new google.maps.InfoWindow({
                    content: `<strong>${place.name}</strong><br>${place.vicinity || ""}`,
                });

                marker.addListener("click", () => {
                    infowindow.open(map, marker);
                });

                markers.push(marker);
            });

            const bounds = new google.maps.LatLngBounds();
            markers.forEach(marker => bounds.extend(marker.getPosition()));
            map.fitBounds(bounds);
        } else {
            alert("Nenhum local encontrado ou erro na pesquisa.");
        }
    });
}
