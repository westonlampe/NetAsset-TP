import React from 'react';
import { Asset } from '../../types/asset';
import { formatCurrency } from '../../utils/formatters';

interface DisposalReportProps {
  assets: Asset[];
}

export function DisposalReport({ assets }: DisposalReportProps) {
  const disposedAssets = assets.filter(asset => asset.status === 'disposed');
  const currentYear = new Date().getFullYear();

  const calculateGainLoss = (asset: Asset) => {
    const proceedsFromSale = 0; // This would come from a disposal transaction record
    return proceedsFromSale - asset.netBookValue;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Asset Disposal Report</h3>
        <p className="text-sm text-gray-600">
          Summary of disposed assets for {currentYear}
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Disposal Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Original Cost
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Accumulated Depreciation
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Book Value
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gain/(Loss)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {disposedAssets.map((asset, index) => (
                <tr key={asset.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                    <div className="text-sm text-gray-500">{asset.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {asset.lastDepreciationDate?.toLocaleDateString() || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(asset.cost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(asset.accumulatedDepreciation)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(asset.netBookValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <span className={calculateGainLoss(asset) >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(calculateGainLoss(asset))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-md font-medium text-gray-900 mb-4">Disposal Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Total Original Cost</div>
              <div className="text-lg font-semibold text-gray-900">
                {formatCurrency(disposedAssets.reduce((sum, asset) => sum + asset.cost, 0))}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Total Net Book Value</div>
              <div className="text-lg font-semibold text-gray-900">
                {formatCurrency(disposedAssets.reduce((sum, asset) => sum + asset.netBookValue, 0))}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Total Gain/(Loss)</div>
              <div className="text-lg font-semibold text-gray-900">
                {formatCurrency(disposedAssets.reduce((sum, asset) => sum + calculateGainLoss(asset), 0))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}