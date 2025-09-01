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

    // If it's a recurring task, generate additional instances
    if (taskData.isRecurring && taskData.recurrence) {
      const recurringTasks = this.generateRecurringTasks(newTask);
      this.tasks.push(...recurringTasks);
    }
    
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

    // If recurrence settings changed, regenerate recurring tasks
    if (updateData.isRecurring !== undefined || updateData.recurrence) {
      // Remove old recurring instances if they exist
      this.tasks = this.tasks.filter(task => !task.parentTaskId || task.parentTaskId !== id);
      
      // Generate new recurring instances if still recurring
      if (this.tasks[taskIndex].isRecurring && this.tasks[taskIndex].recurrence) {
        const recurringTasks = this.generateRecurringTasks(this.tasks[taskIndex]);
        this.tasks.push(...recurringTasks);
      }
    }

    return { ...this.tasks[taskIndex] };
  }

  generateRecurringTasks(parentTask) {
    const { recurrence } = parentTask;
    if (!recurrence) return [];

    const tasks = [];
    const startDate = new Date(recurrence.startDate || parentTask.dueDate || new Date());
    const maxInstances = recurrence.endType === "after" ? recurrence.endAfter : 50; // Limit to 50 if no end specified
    
    let currentDate = new Date(startDate);
    let instanceCount = 0;
    const endDate = recurrence.endType === "on" ? new Date(recurrence.endOn) : null;

    while (instanceCount < maxInstances) {
      // Calculate next occurrence
      if (recurrence.interval === "daily") {
        currentDate.setDate(currentDate.getDate() + recurrence.frequency);
      } else if (recurrence.interval === "weekly") {
        if (recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
          // Find next occurrence based on selected days of week
          let daysToAdd = 1;
          let nextDay = (currentDate.getDay() + 1) % 7;
          while (!recurrence.daysOfWeek.includes(nextDay)) {
            daysToAdd++;
            nextDay = (nextDay + 1) % 7;
            if (daysToAdd > 7) break; // Safety check
          }
          currentDate.setDate(currentDate.getDate() + daysToAdd);
        } else {
          currentDate.setDate(currentDate.getDate() + (7 * recurrence.frequency));
        }
      } else if (recurrence.interval === "monthly") {
        if (recurrence.monthlyType === "lastDay") {
          // Last day of next month
          currentDate.setMonth(currentDate.getMonth() + recurrence.frequency + 1, 0);
        } else {
          // Specific date
          const nextMonth = new Date(currentDate);
          nextMonth.setMonth(nextMonth.getMonth() + recurrence.frequency);
          nextMonth.setDate(recurrence.monthlyDate);
          currentDate = nextMonth;
        }
      }

      // Check end conditions
      if (endDate && currentDate > endDate) break;
      if (recurrence.endType === "after" && instanceCount >= recurrence.endAfter - 1) break;

      // Create recurring task instance
      const recurringTask = {
        ...parentTask,
        Id: Math.max(...this.tasks.map(t => t.Id), 0) + tasks.length + 2,
        dueDate: currentDate.toISOString(),
        createdAt: new Date().toISOString(),
        parentTaskId: parentTask.Id,
        recurringInstance: true,
        completed: false,
        completedAt: null
      };

      tasks.push(recurringTask);
      instanceCount++;

      // Safety check to prevent infinite loops
      if (instanceCount > 100) break;
    }

    return tasks;
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
// Template operations
  async getTemplates() {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Import templates from separate service would go here
    return [];
  }

  async createTemplate(templateData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    // Template creation logic would go here
    return templateData;
  }

  async createTaskFromTemplate(templateId) {
    await new Promise(resolve => setTimeout(resolve, 400));
    // Template to task conversion would go here
    return null;
  }
}

export default new TaskService();