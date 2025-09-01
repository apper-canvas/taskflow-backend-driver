import templatesData from "@/services/mockData/templates.json";

class TemplateService {
  constructor() {
    this.templates = [...templatesData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.templates];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const template = this.templates.find(t => t.Id === id);
    if (!template) {
      throw new Error("Template not found");
    }
    return { ...template };
  }

  async create(templateData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newTemplate = {
      Id: Math.max(...this.templates.map(t => t.Id), 0) + 1,
      ...templateData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.templates.unshift(newTemplate);
    return { ...newTemplate };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const templateIndex = this.templates.findIndex(t => t.Id === id);
    if (templateIndex === -1) {
      throw new Error("Template not found");
    }

    this.templates[templateIndex] = {
      ...this.templates[templateIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return { ...this.templates[templateIndex] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const templateIndex = this.templates.findIndex(t => t.Id === id);
    if (templateIndex === -1) {
      throw new Error("Template not found");
    }

    this.templates.splice(templateIndex, 1);
    return true;
  }

  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const lowercaseQuery = query.toLowerCase();
    return this.templates.filter(template => 
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.taskData.title.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getByCategory(categoryId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.templates.filter(template => template.categoryId === categoryId);
  }

  async createTaskFromTemplate(templateId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const template = await this.getById(templateId);
    if (!template) {
      throw new Error("Template not found");
    }

    // Create task data from template
    const taskData = {
      ...template.taskData,
      createdAt: new Date().toISOString(),
      completedAt: null,
      completed: false
    };

    // If template has due date as relative (e.g., "today", "tomorrow"), calculate actual date
    if (template.dueDateType === "relative" && template.relativeDueDate) {
      const today = new Date();
      switch (template.relativeDueDate) {
        case "today":
          taskData.dueDate = today.toISOString().split('T')[0];
          break;
        case "tomorrow":
          today.setDate(today.getDate() + 1);
          taskData.dueDate = today.toISOString().split('T')[0];
          break;
        case "next_week":
          today.setDate(today.getDate() + 7);
          taskData.dueDate = today.toISOString().split('T')[0];
          break;
        case "next_month":
          today.setMonth(today.getMonth() + 1);
          taskData.dueDate = today.toISOString().split('T')[0];
          break;
      }
    }

    return taskData;
  }

  async getPopular(limit = 5) {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Sort by usage count (mock implementation)
    return [...this.templates]
      .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
      .slice(0, limit);
  }

  async incrementUsage(templateId) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const templateIndex = this.templates.findIndex(t => t.Id === templateId);
    if (templateIndex !== -1) {
      this.templates[templateIndex].usageCount = (this.templates[templateIndex].usageCount || 0) + 1;
      this.templates[templateIndex].lastUsed = new Date().toISOString();
    }
  }
}

// Create and export a single instance
const templateService = new TemplateService();
export default templateService;