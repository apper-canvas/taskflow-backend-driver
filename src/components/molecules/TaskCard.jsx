import { forwardRef } from "react";
import { motion } from "framer-motion";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const TaskCard = forwardRef(({ 
  task, 
  category, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  isCompleting = false,
  isArchiveView = false
}, ref) => {
  const priorityColors = {
    high: "priority-high border-accent-200",
    medium: "priority-medium border-yellow-200", 
    low: "priority-low border-green-200"
  };

  const priorityBadgeVariants = {
    high: "error",
    medium: "warning",
    low: "success"
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "MMM d");
  };

  const getDueDateColor = (dateString) => {
    if (!dateString) return "text-gray-500";
    const date = new Date(dateString);
    
    if (isPast(date) && !isToday(date)) return "text-accent-600";
    if (isToday(date)) return "text-primary-600";
    return "text-gray-600";
  };

return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      className={cn(
        "task-card bg-white rounded-xl p-6 shadow-sm border-l-4 group",
        priorityColors[task.priority] || "border-gray-200",
        task.completed && "opacity-75",
        isCompleting && "task-complete"
      )}
    >
      <div className="flex items-start space-x-4">
        <Checkbox
          checked={task.completed}
          onChange={() => onToggleComplete(task.Id)}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className={cn(
              "font-display font-semibold text-gray-900 leading-tight",
              task.completed && "line-through text-gray-500"
            )}>
              {task.title}
            </h3>
            
<div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
              {task.isRecurring && (
                <div className="flex items-center mr-2">
                  <ApperIcon 
                    name="Calendar" 
                    size={12} 
                    className="text-primary-500" 
                    title="Recurring Task" 
                  />
                </div>
              )}
              {isArchiveView ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleComplete(task.Id)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-primary-600"
                    title="Restore task"
                  >
                    <ApperIcon name="RotateCcw" size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(task.Id)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-accent-600"
                  >
                    <ApperIcon name="Trash2" size={14} />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(task)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-primary-600"
                  >
                    <ApperIcon name="Edit" size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(task.Id)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-accent-600"
                  >
                    <ApperIcon name="Trash2" size={14} />
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {task.description && (
            <p className={cn(
              "text-sm text-gray-600 mb-3 leading-relaxed",
              task.completed && "line-through text-gray-400"
            )}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center flex-wrap gap-3">
            {category && (
              <Badge 
                variant="primary" 
                size="sm"
                className="category-pill"
                style={{ 
                  backgroundColor: `${category.color}15`, 
                  color: category.color,
                  borderColor: `${category.color}30`
                }}
              >
                <ApperIcon name={category.icon} size={12} className="mr-1" />
                {category.name}
              </Badge>
            )}
            
            <Badge 
              variant={priorityBadgeVariants[task.priority]} 
              size="sm"
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            
            {task.dueDate && (
              <div className={cn(
                "flex items-center text-sm font-medium",
                getDueDateColor(task.dueDate)
              )}>
                <ApperIcon name="Calendar" size={12} className="mr-1" />
                {formatDueDate(task.dueDate)}
              </div>
            )}
          </div>
        </div>
      </div>
</motion.div>
  );
});

TaskCard.displayName = "TaskCard";

export default TaskCard;