import React from 'react';
import { Asset } from '../../types/asset';
import { formatCurrency } from '../../utils/formatters';

interface DepreciationWaterfallProps {
  assets: Asset[];
}

export function DepreciationWaterfall({ assets }: DepreciationWaterfallProps) {
  const currentYear = new Date().getFullYear();
  const waterfallData = assets.reduce((acc, asset) => {
    const yearData = acc[currentYear] || { additions: 0, depreciation: 0, disposals: 0 };
    
    if (asset.acquisitionDate.getFullYear() === currentYear) {
      yearData.additions += asset.cost;
    }
    
    if (asset.status === 'disposed') {
      yearData.disposals += asset.netBookValue;
    }
    
    yearData.depreciation += asset.depreciationSchedules
      .find(s => s.type === 'GAAP')?.depreciation || 0;
    
    acc[currentYear] = yearData;
    return acc;
  }, {} as Record<number, { additions: number; depreciation: number; disposals: number }>);

  const totalAssetValue = assets.reduce((sum, asset) => sum + asset.netBookValue, 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Depreciation Waterfall Analysis</h3>
        <p className="text-sm text-gray-600">
          Visualizes the changes in asset value due to additions, depreciation, and disposals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-md font-medium text-gray-900 mb-4">Current Year Activity</h4>
          <div className="space-y-4">
            {Object.entries(waterfallData).map(([year, data]) => (
              <div key={year} className="space-y-3">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Beginning Balance</span>
                  <span className="font-medium">{formatCurrency(totalAssetValue + data.depreciation + data.disposals - data.additions)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-green-600">
                  <span>+ Additions</span>
                  <span className="font-medium">{formatCurrency(data.additions)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-red-600">
                  <span>- Depreciation</span>
                  <span className="font-medium">{formatCurrency(data.depreciation)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-orange-600">
                  <span>- Disposals</span>
                  <span className="font-medium">{formatCurrency(data.disposals)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-semibold text-gray-900 pt-2 border-t">
                  <span>Ending Balance</span>
                  <span>{formatCurrency(totalAssetValue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-md font-medium text-gray-900 mb-4">Asset Composition</h4>
          <div className="space-y-4">
            {Object.entries(
              assets.reduce((acc, asset) => {
                acc[asset.category] = (acc[asset.category] || 0) + asset.netBookValue;
                return acc;
              }, {} as Record<string, number>)
            ).map(([category, value]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{category}</span>
                  <span className="font-medium">{formatCurrency(value)}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(value / totalAssetValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}