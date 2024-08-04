const Edge = require('./Edge');
const Location = require('./Location'); // Included based on Code 2, even if not used explicitly

class Graph {
    constructor() {
        this.nodes = [];
        this.adjList = new Map();
    }

    addLocation(loc) {
        if (!this.adjList.has(loc)) {  // Ensure locations are not added multiple times
            this.nodes.push(loc);
            this.adjList.set(loc, []);
        }
    }

    addEdge(start, end, distance) {
        if (this.adjList.has(start) && this.adjList.has(end)) {
            this.adjList.get(start).push(new Edge(start, end, distance));
        } else {
            throw new Error('Both start and end locations must be added to the graph before adding an edge.');
        }
    }

    getNeighbors(node) {
        return this.adjList.get(node) || [];
    }
}

module.exports = Graph;
