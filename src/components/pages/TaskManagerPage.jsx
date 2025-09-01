import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import CategoryFilter from "@/components/molecules/CategoryFilter";
import ProgressWidget from "@/components/molecules/ProgressWidget";
import FilterBar from "@/components/organisms/FilterBar";
import TaskList from "@/components/organisms/TaskList";
import AddTaskModal from "@/components/organisms/AddTaskModal";
import TemplatePickerModal from "@/components/organisms/TemplatePickerModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import taskService from "@/services/api/taskService";
import categoryService from "@/services/api/categoryService";

const TaskManagerPage = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState("recent");
  const [showCompleted, setShowCompleted] = useState(true);
const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  // Load initial data
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Task operations
const handleAddTask = async (taskData) => {
    try {
      const newTask = await taskService.create({
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
      });
      setTasks(prev => [newTask, ...prev]);
      toast.success("Task created successfully! 🎯");
    } catch (err) {
      toast.error("Failed to create task. Please try again.");
      console.error("Error creating task:", err);
    }
  };

const handleEditTask = async (taskData) => {
    try {
      const updatedTask = await taskService.update(editingTask.id, taskData);
      // Reload all tasks to get updated recurring instances
      await loadData();
      toast.success("Task updated successfully! ✏️");
      setEditingTask(null);
    } catch (err) {
      toast.error("Failed to update task. Please try again.");
      console.error("Error updating task:", err);
    }
  };
  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      if (!task) return;

      const updatedTask = await taskService.update(taskId, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null
      });

      setTasks(prev => prev.map(t => 
        t.Id === taskId ? updatedTask : t
      ));
    } catch (err) {
      toast.error("Failed to update task. Please try again.");
      console.error("Error toggling task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
    } catch (err) {
      toast.error("Failed to delete task. Please try again.");
      console.error("Error deleting task:", err);
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsAddModalOpen(true);
  };
const handleSelectTemplate = async (templateTaskData) => {
    try {
      const newTask = await taskService.create({
        ...templateTaskData,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
      });
      setTasks(prev => [newTask, ...prev]);
      setIsTemplateModalOpen(false);
    } catch (err) {
      toast.error("Failed to create task from template. Please try again.");
      console.error("Error creating task from template:", err);
    }
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      handleEditTask(taskData);
    } else {
      handleAddTask(taskData);
    }
  };

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const todayTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const today = new Date().toDateString();
    const taskDate = new Date(task.dueDate).toDateString();
    return today === taskDate;
  }).length;
  const todayCompleted = tasks.filter(task => {
    if (!task.dueDate || !task.completed) return false;
    const today = new Date().toDateString();
    const taskDate = new Date(task.dueDate).toDateString();
    return today === taskDate;
  }).length;

  // Calculate task counts per category
  const taskCounts = categories.reduce((counts, category) => {
    counts[category.Id] = tasks.filter(task => task.categoryId === category.Id).length;
    return counts;
  }, {});

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
<div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              TaskFlow
            </h1>
            <p className="text-gray-600">
              Organize and complete your daily tasks efficiently
            </p>
          </div>
<div className="flex space-x-3">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setIsTemplateModalOpen(true)}
              className="shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
            >
              <ApperIcon name="FileTemplate" size={16} className="mr-2" />
              Templates
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Task
            </Button>
          </div>
        </motion.div>

        {/* Progress Widget */}
        <ProgressWidget
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          todayTasks={todayTasks}
          todayCompleted={todayCompleted}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-8">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                taskCounts={taskCounts}
              />
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <SearchBar
                onSearch={setSearchTerm}
                placeholder="Search tasks..."
              />
              <FilterBar
                sortBy={sortBy}
                onSortChange={setSortBy}
                showCompleted={showCompleted}
                onToggleCompleted={setShowCompleted}
                totalTasks={totalTasks}
                completedTasks={completedTasks}
              />
            </motion.div>

            {/* Task List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <TaskList
                tasks={showCompleted ? tasks : tasks.filter(task => !task.completed)}
                categories={categories}
                onToggleComplete={handleToggleComplete}
                onEditTask={openEditModal}
                onDeleteTask={handleDeleteTask}
                onAddTask={() => setIsAddModalOpen(true)}
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                sortBy={sortBy}
              />
            </motion.div>
          </div>
        </div>

{/* Add/Edit Task Modal */}
        <AddTaskModal
          isOpen={isAddModalOpen}
          onClose={closeModal}
          onSave={handleSaveTask}
          categories={categories}
          editTask={editingTask}
        />

        {/* Template Picker Modal */}
        <TemplatePickerModal
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          onSelectTemplate={handleSelectTemplate}
          categories={categories}
        />
      </div>
    </div>
  );
};

export default TaskManagerPage;