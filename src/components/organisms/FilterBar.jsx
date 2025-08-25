import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const FilterBar = ({ 
  sortBy, 
  onSortChange, 
  showCompleted, 
  onToggleCompleted,
  totalTasks,
  completedTasks 
}) => {
  const sortOptions = [
    { value: "recent", label: "Most Recent", icon: "Clock" },
    { value: "priority", label: "Priority", icon: "AlertCircle" },
    { value: "dueDate", label: "Due Date", icon: "Calendar" },
    { value: "completed", label: "Status", icon: "CheckSquare" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100"
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Filter" size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
        </div>
        
        <div className="flex items-center space-x-1">
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              variant={sortBy === option.value ? "primary" : "ghost"}
              size="sm"
              onClick={() => onSortChange(option.value)}
              className={`${
                sortBy === option.value
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              <ApperIcon name={option.icon} size={14} className="mr-1" />
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          {completedTasks} of {totalTasks} completed
        </div>
        
        <Button
          variant={showCompleted ? "primary" : "ghost"}
          size="sm"
          onClick={onToggleCompleted}
        >
          <ApperIcon 
            name={showCompleted ? "EyeOff" : "Eye"} 
            size={14} 
            className="mr-1" 
          />
          {showCompleted ? "Hide" : "Show"} Completed
        </Button>
      </div>
    </motion.div>
  );
};

export default FilterBar;