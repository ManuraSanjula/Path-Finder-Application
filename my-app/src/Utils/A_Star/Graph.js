const Edge = require('./Edge');

class Graph {
    constructor() {
        this.nodes = [];
        this.adjList = new Map();
    }

    addLocation(loc) {
        this.nodes.push(loc);
        this.adjList.set(loc, []);
    }

    addEdge(start, end, distance) {
        this.adjList.get(start).push(new Edge(start, end, distance));
    }

    getNeighbors(node) {
        return this.adjList.get(node) || [];
    }
}

module.exports = Graph;
