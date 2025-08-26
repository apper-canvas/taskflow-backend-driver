import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const RecurringTaskModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialConfig = null 
}) => {
  const [config, setConfig] = useState({
    interval: "daily", // daily, weekly, monthly
    frequency: 1, // every X days/weeks/months
    daysOfWeek: [], // for weekly: [1,2,3,4,5] (Monday-Friday)
    monthlyType: "date", // date or lastDay
    monthlyDate: 1, // specific date for monthly
    endType: "never", // never, after, on
    endAfter: 10, // number of occurrences
    endOn: "", // end date
    startDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});

  // Days of week for selection
  const daysOfWeek = [
    { id: 1, name: "Mon", full: "Monday" },
    { id: 2, name: "Tue", full: "Tuesday" },
    { id: 3, name: "Wed", full: "Wednesday" },
    { id: 4, name: "Thu", full: "Thursday" },
    { id: 5, name: "Fri", full: "Friday" },
    { id: 6, name: "Sat", full: "Saturday" },
    { id: 0, name: "Sun", full: "Sunday" }
  ];

  useEffect(() => {
    if (isOpen && initialConfig) {
      setConfig({ ...config, ...initialConfig });
    } else if (isOpen && !initialConfig) {
      setConfig({
        interval: "daily",
        frequency: 1,
        daysOfWeek: [],
        monthlyType: "date",
        monthlyDate: 1,
        endType: "never",
        endAfter: 10,
        endOn: "",
        startDate: new Date().toISOString().split('T')[0]
      });
    }
    setErrors({});
  }, [isOpen, initialConfig]);

  const validateForm = () => {
    const newErrors = {};

    if (!config.frequency || config.frequency < 1) {
      newErrors.frequency = "Frequency must be at least 1";
    }

    if (config.interval === "weekly" && config.daysOfWeek.length === 0) {
      newErrors.daysOfWeek = "Select at least one day of the week";
    }

    if (config.interval === "monthly") {
      if (config.monthlyType === "date" && (config.monthlyDate < 1 || config.monthlyDate > 31)) {
        newErrors.monthlyDate = "Date must be between 1 and 31";
      }
    }

    if (config.endType === "after" && (!config.endAfter || config.endAfter < 1)) {
      newErrors.endAfter = "Must be at least 1 occurrence";
    }

    if (config.endType === "on" && !config.endOn) {
      newErrors.endOn = "End date is required";
    }

    if (!config.startDate) {
      newErrors.startDate = "Start date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(config);
      onClose();
    }
  };

  const updateConfig = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const toggleDayOfWeek = (dayId) => {
    const currentDays = config.daysOfWeek;
    const newDays = currentDays.includes(dayId) 
      ? currentDays.filter(id => id !== dayId)
      : [...currentDays, dayId].sort();
    updateConfig("daysOfWeek", newDays);
  };

  const getRecurrencePreview = () => {
    const { interval, frequency, daysOfWeek, monthlyType, monthlyDate, endType, endAfter, endOn } = config;
    
    let preview = `Every ${frequency > 1 ? frequency + " " : ""}`;
    
    if (interval === "daily") {
      preview += frequency === 1 ? "day" : "days";
    } else if (interval === "weekly") {
      preview += frequency === 1 ? "week" : "weeks";
      if (daysOfWeek.length > 0) {
        const dayNames = daysOfWeek.map(id => daysOfWeek.find(d => d.id === id)?.name || 
          daysOfWeek.find(d => d.id === id)?.name).join(", ");
        preview += ` on ${dayNames}`;
      }
    } else if (interval === "monthly") {
      preview += frequency === 1 ? "month" : "months";
      if (monthlyType === "date") {
        preview += ` on the ${monthlyDate}${getOrdinalSuffix(monthlyDate)}`;
      } else {
        preview += " on the last day";
      }
    }

    if (endType === "after") {
      preview += `, ending after ${endAfter} occurrence${endAfter !== 1 ? 's' : ''}`;
    } else if (endType === "on") {
      preview += `, ending on ${endOn}`;
    }

    return preview;
  };

  const getOrdinalSuffix = (num) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const value = num % 100;
    return suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Repeat" size={16} />
                </div>
                <div>
                  <h2 className="text-lg font-display font-semibold">Configure Recurring Task</h2>
                  <p className="text-primary-100 text-sm">Set up automatic task repetition</p>
                </div>
              </div>
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

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            {/* Preview */}
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4 border border-primary-200">
              <div className="flex items-start space-x-3">
                <ApperIcon name="Eye" size={16} className="text-primary-600 mt-1" />
                <div>
                  <h3 className="font-medium text-primary-800 mb-1">Preview</h3>
                  <p className="text-primary-700 text-sm">{getRecurrencePreview()}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Start Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={config.startDate}
                  onChange={(e) => updateConfig("startDate", e.target.value)}
                  error={errors.startDate}
                  required
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Repeat Every <span className="text-accent-500 ml-1">*</span>
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      min="1"
                      value={config.frequency}
                      onChange={(e) => updateConfig("frequency", parseInt(e.target.value) || 1)}
                      error={errors.frequency}
                      className="w-20"
                    />
                    <select
                      value={config.interval}
                      onChange={(e) => updateConfig("interval", e.target.value)}
                      className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                    >
                      <option value="daily">Day(s)</option>
                      <option value="weekly">Week(s)</option>
                      <option value="monthly">Month(s)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Weekly Options */}
              {config.interval === "weekly" && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Days of Week <span className="text-accent-500 ml-1">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map(day => (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => toggleDayOfWeek(day.id)}
                        className={cn(
                          "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                          config.daysOfWeek.includes(day.id)
                            ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                      >
                        {day.name}
                      </button>
                    ))}
                  </div>
                  {errors.daysOfWeek && (
                    <p className="text-sm text-accent-600">{errors.daysOfWeek}</p>
                  )}
                </div>
              )}

              {/* Monthly Options */}
              {config.interval === "monthly" && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Monthly Recurrence</label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        value="date"
                        checked={config.monthlyType === "date"}
                        onChange={(e) => updateConfig("monthlyType", e.target.value)}
                        className="text-primary-600"
                      />
                      <span className="text-sm text-gray-700">On day</span>
                      <Input
                        type="number"
                        min="1"
                        max="31"
                        value={config.monthlyDate}
                        onChange={(e) => updateConfig("monthlyDate", parseInt(e.target.value) || 1)}
                        error={errors.monthlyDate}
                        className="w-16"
                        disabled={config.monthlyType !== "date"}
                      />
                      <span className="text-sm text-gray-700">of each month</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        value="lastDay"
                        checked={config.monthlyType === "lastDay"}
                        onChange={(e) => updateConfig("monthlyType", e.target.value)}
                        className="text-primary-600"
                      />
                      <span className="text-sm text-gray-700">On the last day of each month</span>
                    </label>
                  </div>
                </div>
              )}

              {/* End Options */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Ends</label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value="never"
                      checked={config.endType === "never"}
                      onChange={(e) => updateConfig("endType", e.target.value)}
                      className="text-primary-600"
                    />
                    <span className="text-sm text-gray-700">Never</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value="after"
                      checked={config.endType === "after"}
                      onChange={(e) => updateConfig("endType", e.target.value)}
                      className="text-primary-600"
                    />
                    <span className="text-sm text-gray-700">After</span>
                    <Input
                      type="number"
                      min="1"
                      value={config.endAfter}
                      onChange={(e) => updateConfig("endAfter", parseInt(e.target.value) || 1)}
                      error={errors.endAfter}
                      className="w-20"
                      disabled={config.endType !== "after"}
                    />
                    <span className="text-sm text-gray-700">occurrences</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value="on"
                      checked={config.endType === "on"}
                      onChange={(e) => updateConfig("endType", e.target.value)}
                      className="text-primary-600"
                    />
                    <span className="text-sm text-gray-700">On</span>
                    <Input
                      type="date"
                      value={config.endOn}
                      onChange={(e) => updateConfig("endOn", e.target.value)}
                      error={errors.endOn}
                      className="w-40"
                      disabled={config.endType !== "on"}
                    />
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  <ApperIcon name="Check" size={16} className="mr-2" />
                  Save Configuration
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RecurringTaskModal;