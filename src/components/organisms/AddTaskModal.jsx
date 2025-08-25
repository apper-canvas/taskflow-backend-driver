import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";

const AddTaskModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  categories, 
  editTask = null 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    priority: "medium",
    dueDate: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editTask) {
      setFormData({
        title: editTask.title || "",
        description: editTask.description || "",
        categoryId: editTask.categoryId || "",
        priority: editTask.priority || "medium",
        dueDate: editTask.dueDate ? editTask.dueDate.split('T')[0] : ""
      });
    } else {
      setFormData({
        title: "",
        description: "",
        categoryId: categories.length > 0 ? categories[0].Id : "",
        priority: "medium",
        dueDate: ""
      });
    }
    setErrors({});
  }, [editTask, categories, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const taskData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate || null
    };

    onSave(taskData);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-gray-900">
                {editTask ? "Edit Task" : "Add New Task"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={18} />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Task Title"
                required
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter task title..."
                error={errors.title}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Add task description (optional)..."
                  rows={3}
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-primary-500 focus:ring-primary-200 bg-white resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Category <span className="text-accent-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.Id}
                      type="button"
                      onClick={() => handleChange("categoryId", category.Id)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                        formData.categoryId === category.Id
                          ? "border-primary-300 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center">
                        <ApperIcon name={category.icon} size={16} className="mr-2" style={{ color: category.color }} />
                        <span className="text-sm font-medium text-gray-900">{category.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.categoryId && (
                  <p className="text-sm text-accent-600">{errors.categoryId}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <div className="flex space-x-2">
                  {[
                    { value: "low", label: "Low", variant: "success" },
                    { value: "medium", label: "Medium", variant: "warning" },
                    { value: "high", label: "High", variant: "error" }
                  ].map((priority) => (
                    <button
                      key={priority.value}
                      type="button"
                      onClick={() => handleChange("priority", priority.value)}
                      className={`flex-1 p-2 rounded-lg border transition-all duration-200 ${
                        formData.priority === priority.value
                          ? "border-primary-300 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Badge 
                        variant={priority.variant} 
                        size="sm"
                        className="w-full justify-center"
                      >
                        {priority.label}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
              />

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  <ApperIcon name={editTask ? "Save" : "Plus"} size={16} className="mr-2" />
                  {editTask ? "Update Task" : "Add Task"}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddTaskModal;