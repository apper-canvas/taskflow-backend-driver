import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import TaskCard from "@/components/molecules/TaskCard";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const TaskList = ({ 
  tasks, 
  categories, 
  onToggleComplete, 
  onEditTask, 
  onDeleteTask,
  onAddTask,
  searchTerm,
  selectedCategory,
  sortBy
}) => {
const [completingTasks, setCompletingTasks] = useState(new Set());

  const handleToggleComplete = async (taskId) => {
    setCompletingTasks(prev => new Set([...prev, taskId]));
    
    // Add small delay for animation
    setTimeout(() => {
      onToggleComplete(taskId);
      setCompletingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
      
      const task = tasks.find(t => t.Id === taskId);
      if (task && !task.completed) {
        toast.success("🎉 Task completed! Great job!", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    }, 300);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDeleteTask(taskId);
      toast.success("Task deleted successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

// Filter and sort tasks
  let filteredTasks = tasks;

  // Filter by search term
  if (searchTerm) {
    filteredTasks = filteredTasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Filter by category
  if (selectedCategory) {
    filteredTasks = filteredTasks.filter(task => task.categoryId === selectedCategory);
  }

  // Sort tasks
  filteredTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case "dueDate":
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      case "completed":
        return a.completed - b.completed;
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Separate completed and incomplete tasks
  const incompleteTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  if (filteredTasks.length === 0) {
    if (searchTerm) {
      return (
        <Empty
          icon="Search"
          title="No tasks found"
          message={`No tasks match "${searchTerm}". Try adjusting your search or add a new task.`}
          actionLabel="Clear Search"
          onAction={() => window.location.reload()}
        />
      );
    }
    
    if (selectedCategory) {
      const category = categories.find(c => c.Id === selectedCategory);
      return (
        <Empty
          icon={category?.icon || "Folder"}
          title={`No tasks in ${category?.name || "this category"}`}
          message="Start adding tasks to this category to stay organized."
          actionLabel="Add Task"
          onAction={onAddTask}
        />
      );
    }

    return (
      <Empty
        icon="CheckSquare"
        title="No tasks yet"
        message="Get started by creating your first task to stay organized and productive."
        actionLabel="Add Your First Task"
        onAction={onAddTask}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Incomplete Tasks */}
      {incompleteTasks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-semibold text-gray-900">
              Active Tasks ({incompleteTasks.length})
            </h2>
            {completedTasks.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const element = document.getElementById("completed-tasks");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <ApperIcon name="ArrowDown" size={16} className="mr-1" />
                View Completed
              </Button>
            )}
          </div>
          
          <AnimatePresence mode="popLayout">
            {incompleteTasks.map((task) => {
              const category = categories.find(c => c.Id === task.categoryId);
              return (
<TaskCard
                  key={task.Id}
                  task={task}
                  category={category}
                  onToggleComplete={handleToggleComplete}
                  onEdit={onEditTask}
                  onDelete={handleDeleteTask}
                  isCompleting={completingTasks.has(task.Id)}
                />
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div id="completed-tasks" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between pt-6 border-t border-gray-200"
          >
            <h2 className="text-lg font-display font-semibold text-gray-900">
              Completed Tasks ({completedTasks.length})
            </h2>
          </motion.div>
          
          <AnimatePresence mode="popLayout">
            {completedTasks.map((task) => {
              const category = categories.find(c => c.Id === task.categoryId);
              return (
                <TaskCard
key={task.Id}
                  task={task}
                  category={category}
                  onToggleComplete={handleToggleComplete}
                  onEdit={onEditTask}
                  onDelete={handleDeleteTask}
                  isCompleting={completingTasks.has(task.Id)}
                />
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
);
};

export default TaskList;