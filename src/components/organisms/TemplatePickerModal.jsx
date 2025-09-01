import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import templateService from "@/services/api/templateService";
import { cn } from "@/utils/cn";

const TemplatePickerModal = ({ 
  isOpen, 
  onClose, 
  onSelectTemplate,
  categories = []
}) => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    categoryId: "",
    taskData: {
      title: "",
      description: "",
      priority: "medium",
      isRecurring: false,
      recurrence: null
    },
    dueDateType: "relative",
    relativeDueDate: "today"
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
      setSearchQuery("");
      setSelectedCategory("all");
      setIsCreating(false);
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchQuery, selectedCategory]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await templateService.getAll();
      setTemplates(data);
    } catch (err) {
      setError("Failed to load templates. Please try again.");
      console.error("Error loading templates:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = [...templates];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.taskData.title.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(template => 
        template.categoryId === parseInt(selectedCategory)
      );
    }

    setFilteredTemplates(filtered);
  };

  const handleSelectTemplate = async (template) => {
    try {
      setLoading(true);
      const taskData = await templateService.createTaskFromTemplate(template.Id);
      await templateService.incrementUsage(template.Id);
      onSelectTemplate(taskData);
      toast.success(`Task created from "${template.name}" template! 🎯`);
      onClose();
    } catch (err) {
      toast.error("Failed to create task from template. Please try again.");
      console.error("Error creating task from template:", err);
    } finally {
      setLoading(false);
    }
  };

  const validateNewTemplate = () => {
    const newErrors = {};

    if (!newTemplate.name.trim()) {
      newErrors.name = "Template name is required";
    }

    if (!newTemplate.taskData.title.trim()) {
      newErrors.title = "Task title is required";
    }

    if (!newTemplate.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateTemplate = async () => {
    if (!validateNewTemplate()) return;

    try {
      setLoading(true);
      await templateService.create(newTemplate);
      toast.success("Template created successfully! 📋");
      setIsCreating(false);
      setNewTemplate({
        name: "",
        description: "",
        categoryId: "",
        taskData: {
          title: "",
          description: "",
          priority: "medium",
          isRecurring: false,
          recurrence: null
        },
        dueDateType: "relative",
        relativeDueDate: "today"
      });
      loadTemplates();
    } catch (err) {
      toast.error("Failed to create template. Please try again.");
      console.error("Error creating template:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId, templateName) => {
    if (!confirm(`Are you sure you want to delete the template "${templateName}"?`)) {
      return;
    }

    try {
      await templateService.delete(templateId);
      toast.success("Template deleted successfully");
      loadTemplates();
    } catch (err) {
      toast.error("Failed to delete template. Please try again.");
      console.error("Error deleting template:", err);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.Id === categoryId);
    return category ? category.name : "Unknown";
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.Id === categoryId);
    return category ? category.color : "#gray";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-gradient-to-r from-accent-500 to-accent-600 text-white",
      medium: "bg-gradient-to-r from-orange-500 to-orange-600 text-white", 
      low: "bg-gradient-to-r from-green-500 to-green-600 text-white"
    };
    return colors[priority] || colors.medium;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <ApperIcon name="FileTemplate" size={16} />
                </div>
                <div>
                  <h2 className="text-lg font-display font-semibold">
                    {isCreating ? "Create Template" : "Task Templates"}
                  </h2>
                  <p className="text-primary-100 text-sm">
                    {isCreating ? "Save a reusable task template" : "Quick start with pre-configured tasks"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!isCreating && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCreating(true)}
                    className="text-white hover:bg-white/10"
                  >
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    New Template
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/10 h-8 w-8 p-0"
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            )}

            {error && (
              <Error 
                message={error} 
                onRetry={loadTemplates}
              />
            )}

            {!loading && !error && !isCreating && (
              <>
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 bg-white"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category.Id} value={category.Id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Templates Grid */}
                {filteredTemplates.length === 0 ? (
                  <div className="text-center py-12">
                    <ApperIcon name="FileTemplate" size={48} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {templates.length === 0 ? "No templates yet" : "No templates found"}
                    </h3>
                    <p className="text-gray-600">
                      {templates.length === 0 
                        ? "Create your first template to get started"
                        : "Try adjusting your search or filters"
                      }
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTemplates.map((template) => (
                      <motion.div
                        key={template.Id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-display font-semibold text-gray-900 mb-1">
                              {template.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {template.description}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTemplate(template.Id, template.name)}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-accent-600"
                            >
                              <ApperIcon name="Trash2" size={14} />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mb-3">
                          <Badge 
                            style={{ backgroundColor: getCategoryColor(template.categoryId) }}
                            className="text-white text-xs"
                          >
                            {getCategoryName(template.categoryId)}
                          </Badge>
                          <Badge className={cn("text-xs", getPriorityColor(template.taskData.priority))}>
                            {template.taskData.priority}
                          </Badge>
                          {template.taskData.isRecurring && (
                            <Badge variant="secondary" className="text-xs">
                              <ApperIcon name="Repeat" size={12} className="mr-1" />
                              Recurring
                            </Badge>
                          )}
                        </div>

                        <div className="text-sm text-gray-700 mb-3">
                          <strong>Task:</strong> {template.taskData.title}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            {template.usageCount ? `Used ${template.usageCount} times` : "Never used"}
                          </div>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleSelectTemplate(template)}
                            disabled={loading}
                          >
                            <ApperIcon name="Plus" size={14} className="mr-1" />
                            Use Template
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Create Template Form */}
            {!loading && !error && isCreating && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Template Name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    error={errors.name}
                    required
                    placeholder="e.g., Daily Workout"
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Category <span className="text-accent-500 ml-1">*</span>
                    </label>
                    <select
                      value={newTemplate.categoryId}
                      onChange={(e) => setNewTemplate(prev => ({ 
                        ...prev, 
                        categoryId: parseInt(e.target.value),
                        taskData: { ...prev.taskData, categoryId: parseInt(e.target.value) }
                      }))}
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 bg-white"
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category.Id} value={category.Id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="text-sm text-accent-600">{errors.categoryId}</p>
                    )}
                  </div>
                </div>

                <Input
                  label="Template Description"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this template"
                />

                <Input
                  label="Task Title"
                  value={newTemplate.taskData.title}
                  onChange={(e) => setNewTemplate(prev => ({ 
                    ...prev, 
                    taskData: { ...prev.taskData, title: e.target.value }
                  }))}
                  error={errors.title}
                  required
                  placeholder="e.g., Morning workout routine"
                />

                <Input
                  label="Task Description"
                  value={newTemplate.taskData.description}
                  onChange={(e) => setNewTemplate(prev => ({ 
                    ...prev, 
                    taskData: { ...prev.taskData, description: e.target.value }
                  }))}
                  placeholder="Detailed task description"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                      value={newTemplate.taskData.priority}
                      onChange={(e) => setNewTemplate(prev => ({ 
                        ...prev, 
                        taskData: { ...prev.taskData, priority: e.target.value }
                      }))}
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 bg-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Default Due Date</label>
                    <select
                      value={newTemplate.relativeDueDate}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, relativeDueDate: e.target.value }))}
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 bg-white"
                    >
                      <option value="today">Today</option>
                      <option value="tomorrow">Tomorrow</option>
                      <option value="next_week">Next Week</option>
                      <option value="next_month">Next Month</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button 
                    variant="secondary" 
                    onClick={() => setIsCreating(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleCreateTemplate}
                    disabled={loading}
                  >
                    <ApperIcon name="Save" size={16} className="mr-2" />
                    Create Template
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TemplatePickerModal;