const Location = require('./Location');
const PriorityQueue = require('./PriorityQueue');

class Dijkstra {
  static dijkstra(graph, source) {
    const distances = new Map();
    const previous = new Map();
    const queue = new PriorityQueue((a, b) => distances.get(a) - distances.get(b));

    for (const loc of graph.nodes) {
      if (loc.equals(source)) {
        distances.set(loc, 0);
      } else {
        distances.set(loc, Infinity);
      }
      queue.enqueue(loc);
    }

    while (!queue.isEmpty()) {
      const current = queue.dequeue();
      for (const edge of graph.adjList.get(current)) {
        const neighbor = edge.end;
        const newDist = distances.get(current) + edge.distance;
        if (newDist < distances.get(neighbor)) {
          distances.set(neighbor, newDist);
          previous.set(neighbor, current);
          queue.enqueue(neighbor);
        }
      }
    }

    return previous;
  }

  static getShortestPath(previous, target) {
    const path = [];
    for (let at = target; at !== undefined; at = previous.get(at)) {
      path.push(at);
    }
    path.reverse();
    return path;
  }
}

module.exports = Dijkstra;
