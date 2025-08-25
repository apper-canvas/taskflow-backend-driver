import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48 animate-pulse"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-32 animate-pulse"></div>
        </div>
        <div className="h-10 bg-gradient-to-r from-primary-200 to-primary-300 rounded-lg w-32 animate-pulse"></div>
      </div>

      {/* Progress Widget Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 animate-pulse"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-primary-200 to-primary-300 rounded-full animate-pulse"></div>
            </div>
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 animate-pulse"></div>
          </motion.div>
        ))}
      </div>

      {/* Task List Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-start space-x-4">
              <div className="w-5 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mt-1"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 animate-pulse"></div>
                <div className="flex items-center space-x-4">
                  <div className="h-6 bg-gradient-to-r from-primary-200 to-primary-300 rounded-full w-20 animate-pulse"></div>
                  <div className="h-6 bg-gradient-to-r from-accent-200 to-accent-300 rounded-full w-16 animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 animate-pulse"></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Loading;