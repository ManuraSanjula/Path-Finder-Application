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
  }
  
  module.exports = PriorityQueue;
  