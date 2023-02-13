import { Item } from '@/interfaces/database';
import ItemsService from '@/services/items.service';
import { fork } from 'child_process';

export default class ProcessQueue {
  public MAX_PROCESSES = 10;
  private activeProcesses = 0;
  private tasks: any[] = [];
  private itemService = new ItemsService();
  constructor(max_process = 10) {
    this.MAX_PROCESSES = max_process;
  }
  /**
   * If there are less than the maximum number of processes running, create a new child process and run
   * the first task in the queue.
   * @param {any} task - any - this is the task that you want to run.
   */
  public createTask(task: any) {
    this.tasks.push(task);
    if (this.activeProcesses < this.MAX_PROCESSES) {
      this.createChildProcess(this.tasks.shift());
    }
  }
  /**
   * If there are less than the maximum number of processes running and there are tasks in the queue,
   * then create a child process and remove the first task from the queue
   */
  private processTasks() {
    if (this.activeProcesses < this.MAX_PROCESSES && this.tasks.length) {
      this.createChildProcess(this.tasks.shift());
    }
  }
  /* Creating a child process and sending a task to it. */
  private createChildProcess(task: any) {
    this.activeProcesses++;
    const thread = fork('./src/jobs/items.job');
    thread.send(task);
    thread.on('message', async (msg: Item) => {
      this.processTasks();
      await this.itemService.createItem(msg);
    });
    thread.on('exit', () => {
      this.processTasks();
      this.activeProcesses--;
    });
    thread.on('error', error => {
      console.log(error);
      this.activeProcesses--;
    });
  }
}
