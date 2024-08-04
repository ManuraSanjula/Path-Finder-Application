const PriorityQueue = require('./PriorityQueue');
const DistanceCalculator = require('./DistanceCalculator');

class AStar {
    static aStar(graph, start, goal) {
        if(!graph || !start || !goal) {
            throw new Error('Invalid input: graph,start, and goal are required');
        }

        const openSet = new PriorityQueue();
        openSet.enqueue(start, 0);

        const cameFrom = new Map();

        const gScore = new Map();
        gScore.set(start, 0);

        const fScore = new Map();
        fScore.set(start, DistanceCalculator.calculateDistance(start, goal));

        while (!openSet.isEmpty()) {
            const current = openSet.dequeue();

            if (current.equals(goal)) {
                return this.reconstructPath(cameFrom, current);
            }

            graph.getNeighbors(current).forEach(neighbor => {
                const tentativeGScore = gScore.get(current) + neighbor.distance;
                if (tentativeGScore < (gScore.get(neighbor.end) || Infinity)) {
                    cameFrom.set(neighbor.end, current);
                    gScore.set(neighbor.end, tentativeGScore);
                    fScore.set(neighbor.end, tentativeGScore + DistanceCalculator.calculateDistance(neighbor.end, goal));
                    if (!openSet.contains(neighbor.end)) {
                        openSet.enqueue(neighbor.end, fScore.get(neighbor.end));
                    }
                }
            });
        }

        return []; //Return empty if no path is found
    }

    static reconstructPath(cameFrom, current) {
        const path = [current];
        while (cameFrom.has(current)) {
            current = cameFrom.get(current);
            path.unshift(current);
        }
        return path;
    }
}

module.exports = AStar;

