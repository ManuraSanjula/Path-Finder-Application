document.addEventListener("DOMContentLoaded", () => {
    const map = L.map('map').setView([6.9270786, 79.861243], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const graph = new Graph();
    const locA = new Location(6.9270786, 79.861243); // Example coordinates
    const locB = new Location(6.9068559,  79.8720539); // Example coordinates

    graph.addLocation(locA);
    graph.addLocation(locB);

    const distance = DistanceCalculator.calculateDistance(locA, locB);
    graph.addEdge(locA, locB, distance);

    const path = AStar.aStar(graph, locA, locB);

    path.forEach(loc => {
        L.marker([loc.latitude, loc.longitude]).addTo(map);
    });

    const latlngs = path.map(loc => [loc.latitude, loc.longitude]);
    const polyline = L.polyline(latlngs, { color: 'blue' }).addTo(map);

    map.fitBounds(polyline.getBounds());

    for (let i = 0; i < path.length - 1; i++) {
        const direction = BearingCalculator.getDirection(path[i], path[i + 1]);
        console.log(`Go ${direction}`);
    }
});
