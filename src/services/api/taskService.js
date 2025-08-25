import tasksData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.tasks];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const task = this.tasks.find(t => t.Id === id);
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  }

  async create(taskData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newTask = {
      Id: Math.max(...this.tasks.map(t => t.Id), 0) + 1,
      ...taskData,
      createdAt: taskData.createdAt || new Date().toISOString(),
      completedAt: null
    };
    
    this.tasks.unshift(newTask);
    return { ...newTask };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const taskIndex = this.tasks.findIndex(t => t.Id === id);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updateData
    };

    return { ...this.tasks[taskIndex] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const taskIndex = this.tasks.findIndex(t => t.Id === id);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    this.tasks.splice(taskIndex, 1);
    return true;
  }

  async getByCategory(categoryId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.tasks.filter(task => task.categoryId === categoryId);
  }

  async getByPriority(priority) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.tasks.filter(task => task.priority === priority);
  }

  async getCompleted() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.tasks.filter(task => task.completed);
  }

  async getPending() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.tasks.filter(task => !task.completed);
  }
}

export default new TaskService();