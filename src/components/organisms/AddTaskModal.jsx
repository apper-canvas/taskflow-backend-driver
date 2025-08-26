import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RecurringTaskModal from "@/components/organisms/RecurringTaskModal";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
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
    dueDate: "",
    isRecurring: false,
    recurrence: null
  });

  const [errors, setErrors] = useState({});

const [showRecurringModal, setShowRecurringModal] = useState(false);

  useEffect(() => {
    if (editTask) {
      setFormData({
        title: editTask.title || "",
        description: editTask.description || "",
        categoryId: editTask.categoryId || "",
        priority: editTask.priority || "medium",
        dueDate: editTask.dueDate ? editTask.dueDate.split('T')[0] : "",
        isRecurring: editTask.isRecurring || false,
        recurrence: editTask.recurrence || null
      });
    } else {
      setFormData({
        title: "",
        description: "",
        categoryId: categories.length > 0 ? categories[0].Id : "",
        priority: "medium",
        dueDate: "",
        isRecurring: false,
        recurrence: null
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
      dueDate: formData.dueDate || null,
      isRecurring: formData.isRecurring,
      recurrence: formData.isRecurring ? formData.recurrence : null
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

  const handleRecurringSave = (recurrenceConfig) => {
    setFormData(prev => ({
      ...prev,
      recurrence: recurrenceConfig
    }));
    setShowRecurringModal(false);
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
{/* Recurring Task Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Repeat" size={16} className="text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Make Recurring</h3>
                          <p className="text-sm text-gray-600">Set up automatic task repetition</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isRecurring}
                          onChange={(e) => handleChange("isRecurring", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary-500 peer-checked:to-primary-600"></div>
                      </label>
                    </div>

                    {formData.isRecurring && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl border border-primary-200">
                          <div>
                            <h4 className="font-medium text-primary-800">Recurrence Configuration</h4>
                            {formData.recurrence ? (
                              <p className="text-sm text-primary-700 mt-1">
                                Every {formData.recurrence.frequency > 1 ? formData.recurrence.frequency + " " : ""}
                                {formData.recurrence.interval}
                                {formData.recurrence.frequency !== 1 ? "s" : ""}
                                {formData.recurrence.interval === "weekly" && formData.recurrence.daysOfWeek?.length > 0 && 
                                  ` on selected days`}
                              </p>
                            ) : (
                              <p className="text-sm text-primary-600 mt-1">Click to configure recurring settings</p>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            onClick={() => setShowRecurringModal(true)}
                          >
                            <ApperIcon name="Settings" size={14} className="mr-2" />
                            Configure Recurring
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>
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
</motion.div>
      </div>

      {/* Recurring Task Modal */}
      <RecurringTaskModal
        isOpen={showRecurringModal}
        onClose={() => setShowRecurringModal(false)}
        onSave={handleRecurringSave}
        initialConfig={formData.recurrence}
      />
    </AnimatePresence>
  );
};

export default AddTaskModal;