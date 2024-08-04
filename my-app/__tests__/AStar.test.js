const AStar = require('../src/Utils/A_Star/AStar');
const Graph = require('../src/Utils/A_Star/Graph');
const Edge = require('../src/Utils/A_Star/Edge');

describe('A* Algorithm', () => {
    let graph, start, goal;

    beforeEach(() => {
        graph = new Graph();
        start = { id: 'A', latitude: 40.7128, longitude: -74.0060 };
        goal = { id: 'B', latitude: 34.0522, longitude: -118.2437 };
        const locC = { id: 'C', latitude: 39.0997, longitude: -94.5786 };
        const locD = { id: 'D', latitude: 41.8781, longitude: -87.6298 };
        const locE = { id: 'E', latitude: 36.1627, longitude: -86.7816 };

        graph.addLocation(start);
        graph.addLocation(goal);
        graph.addLocation(locC);
        graph.addLocation(locD);
        graph.addLocation(locE);

        graph.addEdge(start, locC, 1);
        graph.addEdge(start, locD, 4);
        graph.addEdge(locC, locE, 1);
        graph.addEdge(locD, locE, 2);
        graph.addEdge(locE, goal, 1);
    });

    test('finds the shortest path', () => {
        const path = AStar.aStar(graph, start, goal);
        expect(path).toEqual([start, { id: 'C', latitude: 39.0997, longitude: -94.5786 }, { id: 'E', latitude: 36.1627, longitude: -86.7816 }, goal]);
    });

    test('returns an empty array if no path is found', () => {
        const locZ = { id: 'Z', latitude: 48.8566, longitude: 2.3522 }; // Example coordinates for Paris
        graph.addLocation(locZ);
        const path = AStar.aStar(graph, start, locZ);
        expect(path).toEqual([]);
    });

    test('handles invalid input', () => {
        expect(() => AStar.aStar(null, start, goal)).toThrow("Invalid input: graph, start, and goal are required.");
        expect(() => AStar.aStar(graph, null, goal)).toThrow("Invalid input: graph, start, and goal are required.");
        expect(() => AStar.aStar(graph, start, null)).toThrow("Invalid input: graph, start, and goal are required.");
    });
});
