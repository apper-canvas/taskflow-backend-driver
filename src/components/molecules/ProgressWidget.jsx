import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const ProgressWidget = ({ 
  totalTasks, 
  completedTasks, 
  todayTasks, 
  todayCompleted 
}) => {
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const todayCompletionRate = todayTasks > 0 ? (todayCompleted / todayTasks) * 100 : 0;
  
  const circumference = 2 * Math.PI * 20;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-gray-900">Overall Progress</h3>
            <div className="w-12 h-12 relative">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 44 44">
                <circle
                  cx="22"
                  cy="22"
                  r="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-gray-200"
                />
                <circle
                  cx="22"
                  cy="22"
                  r="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="text-primary-500 progress-ring"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-primary-600">
                  {Math.round(completionRate)}%
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-display font-bold text-gray-900">
              {completedTasks}/{totalTasks}
            </p>
            <p className="text-sm text-gray-600">Tasks completed</p>
          </div>
        </div>
      </motion.div>

      {/* Today's Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent-50/50 to-transparent"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-gray-900">Today</h3>
            <div className="w-10 h-10 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center">
              <ApperIcon name="Calendar" size={16} className="text-accent-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-display font-bold text-gray-900">
              {todayCompleted}/{todayTasks}
            </p>
            <p className="text-sm text-gray-600">
              {todayCompletionRate > 0 ? `${Math.round(todayCompletionRate)}% complete` : "No tasks today"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Productivity Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-gray-900">Productivity</h3>
            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={16} className="text-green-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-display font-bold text-gray-900">
              {completionRate >= 80 ? "Excellent" : 
               completionRate >= 60 ? "Good" :
               completionRate >= 40 ? "Fair" : "Getting Started"}
            </p>
            <p className="text-sm text-gray-600">
              {completionRate >= 80 ? "🔥 On fire!" : 
               completionRate >= 60 ? "👍 Keep it up!" :
               completionRate >= 40 ? "📈 Making progress" : "🌱 Building momentum"}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressWidget;