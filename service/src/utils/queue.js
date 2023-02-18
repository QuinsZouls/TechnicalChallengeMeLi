const ItemService = require('../services/items.service');
const { Worker } = require('worker_threads');
const EventEmitter = require('events');

class ProcessQueue extends EventEmitter {
  MAX_PROCESSES = 10;
  activeProcesses = 0;
  tasks = [];
  itemService = new ItemService();
  errors = 0;
  #workers = [];
  constructor(max_process = 10) {
    super();
    this.MAX_PROCESSES = max_process;
    this.on('task_completed', () => {
      this.processTasks();
    });
    /* Creating a new worker for each process that we want to run. */
    for (let i = 0; i < max_process; i++) {
      this.#workers.push(this.#setupWorker());
    }
  }
  /**
   * If there are less than the maximum number of processes running, create a new child process and run
   * the first task in the queue.
   * @param {any} task - any - this is the task that you want to run.
   */
  createTask(task) {
    this.tasks.push(task);
    if (this.activeProcesses < this.MAX_PROCESSES) {
      this.createChildProcess(this.tasks.shift());
    }
    if (this.activeProcesses === this.MAX_PROCESSES) {
      this.emit('queue_full');
    }
  }
  /**
   * If there are less than the maximum number of processes running and there are tasks in the queue,
   * then create a child process and remove the first task from the queue
   */
  processTasks() {
    while (this.activeProcesses < this.MAX_PROCESSES && this.tasks.length) {
      this.createChildProcess(this.tasks.shift());
    }
    if (this.activeProcesses === 0) {
      // Finish queue
      this.emit('done');
    }
  }
  /* Creating a child process and sending a task to it. */
  createChildProcess(task) {
    this.activeProcesses++;
    const worker = this.#getFirstFreeWorker();
    worker.active = true;
    worker.instance.postMessage(task);
  }
  /**
   * It creates a new worker instance, and returns an object with the worker instance and a boolean
   * value indicating whether the worker is active or not
   * @returns A worker object with an instance of a web worker and a boolean value for active.
   */
  #setupWorker() {
    const worker = {
      active: false,
      instance: new Worker('./src/workers/items.worker.js', {
        workerData: this.itemService,
      }),
    };
    worker.instance.on('message', async response => {
      if (!response.status) {
        this.errors++;
      } else {
        this.itemService.createItem(response.data);
      }
      this.activeProcesses--;
      worker.active = false;
      this.emit('task_completed');
    });
    return worker;
  }
  /**
   * "Return the first worker that is not active, or create a new worker if all workers are active."
   *
   * The first thing we do is loop through all of the workers in the `workers` array. If we find a
   * worker that is not active, we return it. If we don't find a worker that is not active, we create a
   * new worker and return it
   * @returns A worker that is not active.
   */
  #getFirstFreeWorker() {
    for (const worker of this.#workers) {
      if (!worker.active) {
        return worker;
      }
    }
    // Create worker if its necessary
    const newWorker = this.#setupWorker();
    this.#workers.push(newWorker);
    return newWorker;
  }
}

module.exports = ProcessQueue;
