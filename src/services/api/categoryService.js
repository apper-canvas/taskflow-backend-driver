import categoriesData from "@/services/mockData/categories.json";

class CategoryService {
  constructor() {
    this.categories = [...categoriesData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...this.categories];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const category = this.categories.find(c => c.Id === id);
    if (!category) {
      throw new Error("Category not found");
    }
    return { ...category };
  }

  async create(categoryData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newCategory = {
      Id: Math.max(...this.categories.map(c => c.Id), 0) + 1,
      ...categoryData
    };
    
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const categoryIndex = this.categories.findIndex(c => c.Id === id);
    if (categoryIndex === -1) {
      throw new Error("Category not found");
    }

    this.categories[categoryIndex] = {
      ...this.categories[categoryIndex],
      ...updateData
    };

    return { ...this.categories[categoryIndex] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const categoryIndex = this.categories.findIndex(c => c.Id === id);
    if (categoryIndex === -1) {
      throw new Error("Category not found");
    }

    this.categories.splice(categoryIndex, 1);
    return true;
  }
}

export default new CategoryService();