import { EventEmitter } from 'node:events';

// Bounded in-memory queue decoupling raw line reading from downstream parsing.
export class LineQueue extends EventEmitter {
  constructor(maxSize = 5000) {
    super();
    this.maxSize = maxSize;
    this.buffer = [];
  }

  // Enqueues a raw line and signals backpressure when the buffer is full.
  push(item) {
    this.buffer.push(item);
    this.emit('data');
    return this.buffer.length < this.maxSize;
  }

  // Removes and returns the next queued item, or null when empty.
  shift() {
    return this.buffer.length ? this.buffer.shift() : null;
  }

  // Reports the number of items currently waiting in the queue.
  size() {
    return this.buffer.length;
  }
}
