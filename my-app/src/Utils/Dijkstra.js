// Importing necessary modules
const Location = require('./Location');
const PriorityQueue = require('./PriorityQueue');

class Dijkstra {
  // Main Dijkstra's algorithm method to find shortest paths from source
  static dijkstra(graph, source) {
    // Initialize maps to store distances from the source and previous nodes
    const distances = new Map();
    const previous = new Map();
    // Create a priority queue to manage nodes to be explored
    const queue = new PriorityQueue((a, b) => distances.get(a) - distances.get(b));

    // Set initial distances: 0 for source node, infinity for others
    for (const loc of graph.nodes) {
      if (loc.equals(source)) {
        distances.set(loc, 0);
      } else {
        distances.set(loc, Infinity);
      }
      queue.enqueue(loc);
    }

    // Loop until there are no more nodes to process
    while (!queue.isEmpty()) {
      const current = queue.dequeue(); // Get the node with the smallest distance
      for (const edge of graph.adjList.get(current)) { // Iterate over neighbors
        const neighbor = edge.end;
        const newDist = distances.get(current) + edge.distance; // Calculate new distance
        if (newDist < distances.get(neighbor)) { // Update if new distance is shorter
          distances.set(neighbor, newDist);
          previous.set(neighbor, current);
          queue.enqueue(neighbor); // Re-add neighbor to queue for further exploration
        }
      }
    }

    // Return the map of previous nodes to reconstruct paths
    return previous;
  }

  // Method to reconstruct the shortest path from the 'previous' map
  static getShortestPath(previous, target) {
    const path = [];
    for (let at = target; at !== undefined; at = previous.get(at)) { // Traverse back from target
      path.push(at);
    }
    path.reverse(); // Reverse to get the path from source to target
    return path;
  }
}

// Exporting the Dijkstra class for use in other modules
module.exports = Dijkstra;
