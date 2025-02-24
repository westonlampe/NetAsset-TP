import React from 'react';
import { Asset } from '../types/asset';
import { formatCurrency } from '../utils/formatters';
import { Calculator, Calendar, MapPin, Building, Tag, FileText, TrendingDown, Pencil } from 'lucide-react';

interface AssetDetailProps {
  asset: Asset;
  onClose: () => void;
  onEdit: () => void;
}

export function AssetDetail({ asset, onClose, onEdit }: AssetDetailProps) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{asset.name}</h2>
            <p className="text-gray-500">Asset ID: {asset.id}</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={onEdit}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Asset
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                <Tag className="h-5 w-5 mr-2" />
                Basic Information
              </h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Category:</dt>
                  <dd className="text-gray-900">{asset.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Serial Number:</dt>
                  <dd className="text-gray-900">{asset.serialNumber || 'N/A'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Status:</dt>
                  <dd>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      asset.status === 'active' ? 'bg-green-100 text-green-800' :
                      asset.status === 'disposed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                <MapPin className="h-5 w-5 mr-2" />
                Location Details
              </h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Location:</dt>
                  <dd className="text-gray-900">{asset.location}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Department:</dt>
                  <dd className="text-gray-900">{asset.department}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                <Calendar className="h-5 w-5 mr-2" />
                Important Dates
              </h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Acquisition Date:</dt>
                  <dd className="text-gray-900">{asset.acquisitionDate.toLocaleDateString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">In Service Date:</dt>
                  <dd className="text-gray-900">{asset.inServiceDate.toLocaleDateString()}</dd>
                </div>
                {asset.lastDepreciationDate && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Last Depreciation:</dt>
                    <dd className="text-gray-900">{asset.lastDepreciationDate.toLocaleDateString()}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                <Calculator className="h-5 w-5 mr-2" />
                Financial Information
              </h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Original Cost:</dt>
                  <dd className="text-gray-900">{formatCurrency(asset.cost)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Accumulated Depreciation:</dt>
                  <dd className="text-gray-900">{formatCurrency(asset.accumulatedDepreciation)}</dd>
                </div>
                <div className="flex justify-between font-semibold">
                  <dt className="text-gray-500">Net Book Value:</dt>
                  <dd className="text-gray-900">{formatCurrency(asset.netBookValue)}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                <TrendingDown className="h-5 w-5 mr-2" />
                Depreciation Schedules
              </h3>
              {asset.depreciationSchedules.map((schedule) => (
                <div key={schedule.id} className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-900">
                      {schedule.type} Depreciation
                    </span>
                    {schedule.taxCode && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {schedule.taxCode}
                      </span>
                    )}
                  </div>
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-gray-500">Method</dt>
                      <dd className="text-gray-900 mt-1">
                        {schedule.method.split('-').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Life</dt>
                      <dd className="text-gray-900 mt-1">{schedule.life} years</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Salvage Value</dt>
                      <dd className="text-gray-900 mt-1">{formatCurrency(schedule.salvageValue)}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Convention</dt>
                      <dd className="text-gray-900 mt-1">
                        {schedule.convention.split('-').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
            <Building className="h-5 w-5 mr-2" />
            Description
          </h3>
          <p className="text-gray-700">{asset.description}</p>
        </div>

        {asset.basisAdjustments && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
              <Calculator className="h-5 w-5 mr-2" />
              Basis Adjustments
            </h3>
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Section 179</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatCurrency(asset.basisAdjustments.section179)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Section 168(k)</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatCurrency(asset.basisAdjustments.section168k)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Special Depreciation</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatCurrency(asset.basisAdjustments.specialDepreciation)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Other Adjustments</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatCurrency(asset.basisAdjustments.otherAdjustments)}</dd>
              </div>
            </dl>
            {asset.basisAdjustments.notes && (
              <div className="mt-4">
                <dt className="text-sm font-medium text-gray-500">Notes</dt>
                <dd className="mt-1 text-sm text-gray-900">{asset.basisAdjustments.notes}</dd>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}