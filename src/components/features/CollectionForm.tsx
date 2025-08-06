'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { CreateCollection, CollectionRule, RuleOperator } from '@/lib/validation/schemas';

interface CollectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCollection) => Promise<void>;
  initialData?: Partial<CreateCollection>;
  title?: string;
}

const RULE_FIELDS = [
  { value: 'category', label: 'Category' },
  { value: 'color', label: 'Color' },
  { value: 'brand', label: 'Brand' },
  { value: 'material', label: 'Material' },
  { value: 'status', label: 'Status' },
  { value: 'tags', label: 'Tags' }
];

const RULE_OPERATORS: { value: RuleOperator; label: string }[] = [
  { value: 'EQUALS', label: 'Equals' },
  { value: 'CONTAINS', label: 'Contains' },
  { value: 'STARTS_WITH', label: 'Starts with' },
  { value: 'ENDS_WITH', label: 'Ends with' },
  { value: 'IN', label: 'In (comma-separated)' },
  { value: 'NOT_EQUALS', label: 'Not equals' },
  { value: 'NOT_CONTAINS', label: 'Does not contain' }
];

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#6B7280', // Gray
  '#F97316', // Orange
];

export default function CollectionForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  title = 'Create Collection' 
}: CollectionFormProps) {
  const [formData, setFormData] = useState<CreateCollection>({
    name: '',
    description: '',
    color: PRESET_COLORS[0],
    image: '',
    isSmartCollection: false,
    rules: [],
    garmentIds: []
  });
  const [rules, setRules] = useState<CollectionRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        color: initialData.color || PRESET_COLORS[0],
        image: initialData.image || '',
        isSmartCollection: initialData.isSmartCollection || false,
        rules: initialData.rules || [],
        garmentIds: initialData.garmentIds || []
      });
      setRules(initialData.rules || []);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        rules: formData.isSmartCollection ? rules : undefined
      };
      await onSubmit(submitData);
      onClose();
      // Reset form
      setFormData({
        name: '',
        description: '',
        color: PRESET_COLORS[0],
        image: '',
        isSmartCollection: false,
        rules: [],
        garmentIds: []
      });
      setRules([]);
    } catch (error) {
      console.error('Error submitting collection:', error);
      setError(error instanceof Error ? error.message : 'Failed to save collection');
    } finally {
      setLoading(false);
    }
  };

  const addRule = () => {
    setRules([...rules, {
      field: 'category',
      operator: 'EQUALS',
      value: ''
    }]);
  };

  const updateRule = (index: number, field: keyof CollectionRule, value: string) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Collection Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-theme-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter collection name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-theme-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Describe your collection"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color === color 
                      ? 'border-gray-900 dark:border-white scale-110' 
                      : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.isSmartCollection}
                onChange={(e) => setFormData({ ...formData, isSmartCollection: e.target.checked })}
                className="w-4 h-4 text-theme-primary border-gray-300 rounded focus:ring-theme-primary"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Smart Collection (automatically adds garments based on rules)
              </span>
            </label>
          </div>

          {formData.isSmartCollection && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Rules</h3>
                <button
                  type="button"
                  onClick={addRule}
                  className="flex items-center gap-2 px-3 py-2 bg-theme-primary text-white rounded-lg hover:bg-theme-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Rule
                </button>
              </div>

              {rules.map((rule, index) => (
                <div key={index} className="flex gap-3 items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <select
                      value={rule.field}
                      onChange={(e) => updateRule(index, 'field', e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      {RULE_FIELDS.map((field) => (
                        <option key={field.value} value={field.value}>
                          {field.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={rule.operator}
                      onChange={(e) => updateRule(index, 'operator', e.target.value as RuleOperator)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      {RULE_OPERATORS.map((operator) => (
                        <option key={operator.value} value={operator.value}>
                          {operator.label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={rule.value}
                      onChange={(e) => updateRule(index, 'value', e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Value"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRule(index)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {rules.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                  No rules added yet. Add rules to automatically populate this smart collection.
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="flex-1 px-4 py-3 bg-theme-primary text-white rounded-lg hover:bg-theme-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : 'Save Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}