import React, { useState } from 'react';
import { Asset, DisposalInfo } from '../types/asset';
import { formatCurrency } from '../utils/formatters';
import { AlertTriangle, DollarSign, Calendar, FileText } from 'lucide-react';

interface DisposalFormProps {
  asset: Asset;
  onSubmit: (assetId: string, disposalInfo: DisposalInfo) => void;
  onCancel: () => void;
}

export function DisposalForm({ asset, onSubmit, onCancel }: DisposalFormProps) {
  const [formData, setFormData] = useState<DisposalInfo>({
    date: new Date(),
    proceeds: 0,
    reason: '',
    method: 'sale',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(asset.id, formData);
  };

  const calculateGainLoss = () => {
    return formData.proceeds - asset.netBookValue;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dispose Asset</h2>
            <p className="text-gray-600 mt-1">{asset.name} ({asset.id})</p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Important Information
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Current net book value: {formatCurrency(asset.netBookValue)}</p>
                <p>Accumulated depreciation: {formatCurrency(asset.accumulatedDepreciation)}</p>
                <p>Original cost: {formatCurrency(asset.cost)}</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Disposal Date
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={formData.date.toISOString().split('T')[0]}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: new Date(e.target.value) }))}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Disposal Method
              </label>
              <select
                value={formData.method}
                onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value as DisposalInfo['method'] }))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                required
              >
                <option value="sale">Sale</option>
                <option value="scrapped">Scrapped</option>
                <option value="donated">Donated</option>
                <option value="traded-in">Traded In</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Proceeds from Disposal
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={formData.proceeds}
                  onChange={(e) => setFormData(prev => ({ ...prev, proceeds: Number(e.target.value) }))}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Estimated gain/loss: {' '}
                <span className={calculateGainLoss() >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(calculateGainLoss())}
                </span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reason for Disposal
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g., Obsolete technology, Damaged beyond repair"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Additional Notes
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                placeholder="Any additional details about the disposal..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Dispose Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}