const ProcessQueue = require('../../utils/queue');

describe('ProcessQueue', () => {
  let queue;

  beforeEach(() => {
    queue = new ProcessQueue(2);
  });

  afterEach(() => {
    queue = new ProcessQueue(2);
  });

  it('should create a task', () => {
    queue.createChildProcess = jest.fn();
    queue.activeProcesses = 10
    queue.createTask({ name: 'task1' });
    expect(queue.tasks).toHaveLength(1);
  });

  it('should create a child process', () => {
    const mockCreateChildProcess = jest.fn();
    queue.createChildProcess = mockCreateChildProcess;

    queue.createTask({ name: 'task1' });
    expect(mockCreateChildProcess).toHaveBeenCalledTimes(1);
  });

  it('should process tasks', () => {
    const mockCreateChildProcess = jest.fn();
    queue.createChildProcess = mockCreateChildProcess;

    queue.createTask({ name: 'task1' });
    queue.createTask({ name: 'task2' });
    queue.createTask({ name: 'task3' });
    queue.processTasks();

    expect(mockCreateChildProcess).toHaveBeenCalledTimes(3);
  });

  it('should emit queue_full event', () => {
    queue.createTask({ name: 'task1' });
    queue.createTask({ name: 'task2' });
    queue.createTask({ name: 'task3' });

    queue.on('queue_full', () => {
      expect(queue.tasks).toHaveLength(3);
    });

    queue.processTasks();
  });

  it('should emit done event', () => {
    queue.createTask({ name: 'task1' });
    queue.createTask({ name: 'task2' });

    queue.on('done', () => {
      expect(queue.activeProcesses).toBe(0);
    });

    queue.processTasks();
  });
});
