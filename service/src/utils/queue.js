const ItemService = require('../services/items.service');
const { Worker } = require('worker_threads');
const EventEmitter = require('events');

class ProcessQueue extends EventEmitter {
  MAX_PROCESSES = 10;
  activeProcesses = 0;
  tasks = [];
  itemService = new ItemService();
  constructor(max_process = 10) {
    super();
    this.MAX_PROCESSES = max_process;
    this.on('task_completed', () => {
      this.processTasks();
    });
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
  }
  /**
   * If there are less than the maximum number of processes running and there are tasks in the queue,
   * then create a child process and remove the first task from the queue
   */
  processTasks() {
    while (this.activeProcesses < this.MAX_PROCESSES && this.tasks.length) {
      this.createChildProcess(this.tasks.shift());
    }
  }
  /* Creating a child process and sending a task to it. */
  createChildProcess(task) {
    this.activeProcesses++;
    const worker = new Worker('./src/jobs/items.worker.js', {
      workerData: task,
    });
    worker.on('message', async msg => {
      await this.itemService.createItem(msg);
    });
    worker.on('exit', e => {
      this.activeProcesses--;
      this.emit('task_completed');
    });
  }
}

module.exports = ProcessQueue;
