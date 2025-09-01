import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import CategoryFilter from "@/components/molecules/CategoryFilter";
import FilterBar from "@/components/organisms/FilterBar";
import TaskList from "@/components/organisms/TaskList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import taskService from "@/services/api/taskService";
import categoryService from "@/services/api/categoryService";

const TaskArchivePage = () => {
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState("recent");

  // Load archived tasks
  const loadArchivedTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getArchived(),
        categoryService.getAll()
      ]);
      setArchivedTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load archived tasks. Please try again.");
      console.error("Error loading archived tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArchivedTasks();
  }, []);

  // Restore task (mark as incomplete)
  const handleRestoreTask = async (taskId) => {
    try {
      const task = archivedTasks.find(t => t.Id === taskId);
      if (!task) return;

      await taskService.update(taskId, {
        completed: false,
        completedAt: null
      });

      setArchivedTasks(prev => prev.filter(t => t.Id !== taskId));
      toast.success("Task restored successfully! 🔄");
    } catch (err) {
      toast.error("Failed to restore task. Please try again.");
      console.error("Error restoring task:", err);
    }
  };

  // Delete task permanently
  const handleDeleteTask = async (taskId) => {
    if (!confirm("Are you sure you want to permanently delete this task?")) {
      return;
    }

    try {
      await taskService.delete(taskId);
      setArchivedTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success("Task permanently deleted");
    } catch (err) {
      toast.error("Failed to delete task. Please try again.");
      console.error("Error deleting task:", err);
    }
  };

  // Calculate task counts per category for archived tasks
  const taskCounts = categories.reduce((counts, category) => {
    counts[category.Id] = archivedTasks.filter(task => task.categoryId === category.Id).length;
    return counts;
  }, {});

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadArchivedTasks} />;

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
            <div className="flex items-center space-x-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/'}
                className="text-gray-500 hover:text-gray-700"
              >
                <ApperIcon name="ArrowLeft" size={16} className="mr-1" />
                Back to Tasks
              </Button>
            </div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Task Archive
            </h1>
            <p className="text-gray-600">
              View and restore your completed tasks
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-display font-bold text-primary-600">
              {archivedTasks.length}
            </div>
            <div className="text-sm text-gray-500">
              Archived Tasks
            </div>
          </div>
        </motion.div>

        {archivedTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-16"
          >
            <Empty
              title="No archived tasks"
              description="Complete some tasks to see them here"
              actionLabel="Go to Tasks"
              onAction={() => window.location.href = '/'}
            />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
                  placeholder="Search archived tasks..."
                />
                <FilterBar
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  showCompleted={true}
                  onToggleCompleted={() => {}}
                  totalTasks={archivedTasks.length}
                  completedTasks={archivedTasks.length}
                  hideCompletedToggle={true}
                />
              </motion.div>

              {/* Archived Task List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <TaskList
                  tasks={archivedTasks}
                  categories={categories}
                  onToggleComplete={handleRestoreTask}
                  onEditTask={() => {}}
                  onDeleteTask={handleDeleteTask}
                  onAddTask={() => window.location.href = '/'}
                  searchTerm={searchTerm}
                  selectedCategory={selectedCategory}
                  sortBy={sortBy}
                  isArchiveView={true}
                />
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskArchivePage;