import React, { useState } from 'react';
import { Asset, DepreciationSchedule, BasisAdjustment } from '../types/asset';
import { formatCurrency } from '../utils/formatters';
import { Calculator, Calendar, DollarSign, FileText, Building2, Tag, Info } from 'lucide-react';

interface AssetFormProps {
  onSubmit: (asset: Omit<Asset, 'id' | 'accumulatedDepreciation' | 'netBookValue'>) => void;
  onCancel: () => void;
  initialData?: Asset;
}

export function AssetForm({ onSubmit, onCancel, initialData }: AssetFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    acquisitionDate: initialData?.acquisitionDate.toISOString().split('T')[0] || '',
    cost: initialData?.cost || 0,
    location: initialData?.location || '',
    department: initialData?.department || '',
    serialNumber: initialData?.serialNumber || '',
    status: initialData?.status || 'active',
    category: initialData?.category || '',
    inServiceDate: initialData?.inServiceDate.toISOString().split('T')[0] || '',
    depreciationSchedules: initialData?.depreciationSchedules || [
      {
        id: 'new-gaap',
        method: 'straight-line',
        life: 5,
        salvageValue: 0,
        convention: 'half-year',
        type: 'GAAP'
      } as DepreciationSchedule,
      {
        id: 'new-tax',
        method: 'declining-balance',
        life: 5,
        salvageValue: 0,
        convention: 'half-year',
        type: 'Tax',
        taxCode: 'MACRS-5'
      } as DepreciationSchedule
    ],
    basisAdjustments: initialData?.basisAdjustments || {
      section179: 0,
      section168k: 0,
      specialDepreciation: 0,
      otherAdjustments: 0,
      notes: ''
    } as BasisAdjustment
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      acquisitionDate: new Date(formData.acquisitionDate),
      inServiceDate: new Date(formData.inServiceDate)
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleChange = (index: number, field: keyof DepreciationSchedule, value: any) => {
    setFormData(prev => ({
      ...prev,
      depreciationSchedules: prev.depreciationSchedules.map((schedule, i) =>
        i === index ? { ...schedule, [field]: value } : schedule
      )
    }));
  };

  const handleBasisAdjustmentChange = (field: keyof BasisAdjustment, value: any) => {
    setFormData(prev => ({
      ...prev,
      basisAdjustments: {
        ...prev.basisAdjustments,
        [field]: value
      }
    }));
  };

  const calculateAdjustedBasis = () => {
    const { cost, basisAdjustments } = formData;
    return cost - 
      basisAdjustments.section179 - 
      basisAdjustments.section168k - 
      basisAdjustments.specialDepreciation - 
      basisAdjustments.otherAdjustments;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {initialData ? 'Edit Asset' : 'Add New Asset'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Serial Number</label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Acquisition Date</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="acquisitionDate"
                    value={formData.acquisitionDate}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">In Service Date</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="inServiceDate"
                    value={formData.inServiceDate}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Cost</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  {initialData?.status === 'disposed' && (
                    <option value="disposed">Disposed</option>
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              Basis Adjustments
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Section 179 Expense</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={formData.basisAdjustments.section179}
                      onChange={(e) => handleBasisAdjustmentChange('section179', Number(e.target.value))}
                      min="0"
                      max={formData.cost}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Section 168(k) Bonus</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={formData.basisAdjustments.section168k}
                      onChange={(e) => handleBasisAdjustmentChange('section168k', Number(e.target.value))}
                      min="0"
                      max={formData.cost - formData.basisAdjustments.section179}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Special Depreciation</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={formData.basisAdjustments.specialDepreciation}
                      onChange={(e) => handleBasisAdjustmentChange('specialDepreciation', Number(e.target.value))}
                      min="0"
                      max={formData.cost - formData.basisAdjustments.section179 - formData.basisAdjustments.section168k}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Other Adjustments</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={formData.basisAdjustments.otherAdjustments}
                      onChange={(e) => handleBasisAdjustmentChange('otherAdjustments', Number(e.target.value))}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Adjustment Notes</label>
                <textarea
                  value={formData.basisAdjustments.notes || ''}
                  onChange={(e) => handleBasisAdjustmentChange('notes', e.target.value)}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter any notes about the basis adjustments..."
                />
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  <h4 className="text-sm font-medium text-blue-900">Basis Summary</h4>
                </div>
                <dl className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-blue-600">Original Cost</dt>
                    <dd className="text-lg font-medium text-blue-900">{formatCurrency(formData.cost)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-blue-600">Adjusted Basis</dt>
                    <dd className="text-lg font-medium text-blue-900">{formatCurrency(calculateAdjustedBasis())}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Depreciation Schedules</h3>
            {formData.depreciationSchedules.map((schedule, index) => (
              <div key={schedule.id} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  {schedule.type} Depreciation
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Method</label>
                    <select
                      value={schedule.method}
                      onChange={(e) => handleScheduleChange(index, 'method', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="straight-line">Straight Line</option>
                      <option value="declining-balance">Declining Balance</option>
                      <option value="sum-of-years-digits">Sum of Years Digits</option>
                      <option value="units-of-production">Units of Production</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Life (years)</label>
                    <input
                      type="number"
                      value={schedule.life}
                      onChange={(e) => handleScheduleChange(index, 'life', parseInt(e.target.value))}
                      min="1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Salvage Value</label>
                    <input
                      type="number"
                      value={schedule.salvageValue}
                      onChange={(e) => handleScheduleChange(index, 'salvageValue', parseFloat(e.target.value))}
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Convention</label>
                    <select
                      value={schedule.convention}
                      onChange={(e) => handleScheduleChange(index, 'convention', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="half-year">Half Year</option>
                      <option value="mid-quarter">Mid Quarter</option>
                      <option value="mid-month">Mid Month</option>
                      <option value="full-month">Full Month</option>
                    </select>
                  </div>

                  {schedule.type === 'Tax' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tax Code</label>
                      <input
                        type="text"
                        value={schedule.taxCode || ''}
                        onChange={(e) => handleScheduleChange(index, 'taxCode', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
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
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {initialData ? 'Update Asset' : 'Add Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}