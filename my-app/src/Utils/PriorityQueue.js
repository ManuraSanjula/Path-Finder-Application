class PriorityQueue {
  constructor(compareFn) {
    this.compareFn = compareFn;
    this.data = [];
  }

  enqueue(item) {
    this.data.push(item);
    this.data.sort(this.compareFn);
  }

  dequeue() {
    return this.data.shift();
  }

  isEmpty() {
    return this.data.length === 0;
  }
  contains(node) {
    return this.data.some((item) => item.node.equals(node));
  }
}

module.exports = PriorityQueue;
