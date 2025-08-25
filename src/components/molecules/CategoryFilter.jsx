import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  taskCounts = {} 
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-display font-semibold text-gray-900 mb-4">Categories</h3>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectCategory(null)}
        className={cn(
          "w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 text-left",
          !selectedCategory 
            ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-800 border border-primary-200" 
            : "hover:bg-gray-50 text-gray-700"
        )}
      >
        <div className="flex items-center">
          <ApperIcon name="List" size={16} className="mr-3" />
          <span className="font-medium">All Tasks</span>
        </div>
        <Badge variant="default" size="sm">
          {Object.values(taskCounts).reduce((sum, count) => sum + count, 0)}
        </Badge>
      </motion.button>
      
      <div className="space-y-1">
        {categories.map((category) => (
          <motion.button
            key={category.Id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCategory(category.Id)}
            className={cn(
              "w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 text-left",
              selectedCategory === category.Id
                ? "text-white shadow-md"
                : "hover:bg-gray-50 text-gray-700"
            )}
            style={selectedCategory === category.Id ? {
              background: `linear-gradient(135deg, ${category.color}E6 0%, ${category.color}CC 100%)`
            } : {}}
          >
            <div className="flex items-center">
              <ApperIcon name={category.icon} size={16} className="mr-3" />
              <span className="font-medium">{category.name}</span>
            </div>
            <Badge 
              variant="default" 
              size="sm"
              className={selectedCategory === category.Id ? "bg-white/20 text-white border-white/30" : ""}
            >
              {taskCounts[category.Id] || 0}
            </Badge>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;