'use client';

import { useState } from 'react';
import { Sparkles, RefreshCw, Settings, Play, AlertCircle } from 'lucide-react';
import { CollectionRule, RuleOperator } from '@/lib/validation/schemas';

interface SmartCollectionManagerProps {
  collectionId: string;
  rules: CollectionRule[];
  onUpdateRules: (rules: CollectionRule[]) => Promise<void>;
  onRefreshCollection: () => Promise<void>;
  garmentCount: number;
}

const RULE_FIELDS = [
  { value: 'category', label: 'Category' },
  { value: 'color', label: 'Color' },
  { value: 'brand', label: 'Brand' },
  { value: 'material', label: 'Material' },
  { value: 'status', label: 'Status' },
  { value: 'tags', label: 'Tags' },
];

const RULE_OPERATORS: { value: RuleOperator; label: string; description: string }[] = [
  { value: 'EQUALS', label: 'Equals', description: 'Exact match' },
  { value: 'CONTAINS', label: 'Contains', description: 'Contains text' },
  { value: 'STARTS_WITH', label: 'Starts with', description: 'Begins with text' },
  { value: 'ENDS_WITH', label: 'Ends with', description: 'Ends with text' },
  { value: 'IN', label: 'In list', description: 'Comma-separated values' },
  { value: 'NOT_EQUALS', label: 'Not equals', description: 'Does not match' },
  { value: 'NOT_CONTAINS', label: 'Does not contain', description: 'Does not contain text' },
];

export default function SmartCollectionManager({
  collectionId,
  rules,
  onUpdateRules,
  onRefreshCollection,
  garmentCount,
}: SmartCollectionManagerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshCollection();
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error refreshing collection:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTestRules = async () => {
    try {
      const response = await fetch(
        '/api/garments?' +
          new URLSearchParams({
            ...rules.reduce(
              (acc, rule) => {
                if (rule.field === 'tags') {
                  acc.tags = rule.value;
                } else {
                  acc[rule.field] = rule.value;
                }
                return acc;
              },
              {} as Record<string, string>,
            ),
          }),
      );

      if (response.ok) {
        const garments = await response.json();
        alert(`Rules would match ${garments.length} garments`);
      }
    } catch (error) {
      console.error('Error testing rules:', error);
    }
  };

  const getRuleDescription = (rule: CollectionRule) => {
    const field = RULE_FIELDS.find((f) => f.value === rule.field)?.label || rule.field;
    const operator = RULE_OPERATORS.find((o) => o.value === rule.operator)?.label || rule.operator;
    return `${field} ${operator.toLowerCase()} "${rule.value}"`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Smart Collection Rules
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {rules.length} {rules.length === 1 ? 'rule' : 'rules'} • {garmentCount} items
                matched
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestRules}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Test rules"
            >
              <Play className="w-4 h-4" />
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh collection"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Rules Summary */}
        <div className="space-y-2">
          {rules.length === 0 ? (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm text-yellow-700 dark:text-yellow-300">
                No rules defined. This smart collection will be empty.
              </span>
            </div>
          ) : (
            rules.map((rule, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {getRuleDescription(rule)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Last Refresh Info */}
        {lastRefresh && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Last refreshed: {lastRefresh.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Expanded Rules Management */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Rule Management</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Available Fields
                </h5>
                <div className="space-y-2">
                  {RULE_FIELDS.map((field) => (
                    <div
                      key={field.value}
                      className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">{field.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Available Operators
                </h5>
                <div className="space-y-2">
                  {RULE_OPERATORS.map((operator) => (
                    <div key={operator.value} className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {operator.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {operator.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  How Smart Collections Work
                </h5>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Rules are applied with AND logic (all rules must match)</li>
                  <li>• Collections automatically update when new garments are added</li>
                  <li>• Use "Refresh" to manually update the collection</li>
                  <li>• Test rules before saving to see how many items would match</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
