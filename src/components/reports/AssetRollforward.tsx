import React from 'react';
import { Asset } from '../../types/asset';
import { formatCurrency } from '../../utils/formatters';

interface AssetRollforwardProps {
  assets: Asset[];
  reportingPeriod: {
    start: Date;
    end: Date;
  };
}

export function AssetRollforward({ assets, reportingPeriod }: AssetRollforwardProps) {
  const categories = [...new Set(assets.map(asset => asset.category))];
  
  const rollforwardData = categories.map(category => {
    const categoryAssets = assets.filter(asset => asset.category === category);
    
    const beginningBalance = categoryAssets.reduce((sum, asset) => {
      const inServiceDate = new Date(asset.inServiceDate);
      if (inServiceDate < reportingPeriod.start) {
        return sum + asset.cost;
      }
      return sum;
    }, 0);
    
    const additions = categoryAssets.reduce((sum, asset) => {
      const inServiceDate = new Date(asset.inServiceDate);
      if (inServiceDate >= reportingPeriod.start && inServiceDate <= reportingPeriod.end) {
        return sum + asset.cost;
      }
      return sum;
    }, 0);
    
    const disposals = categoryAssets.reduce((sum, asset) => {
      if (asset.disposalInfo) {
        const disposalDate = new Date(asset.disposalInfo.date);
        if (disposalDate >= reportingPeriod.start && disposalDate <= reportingPeriod.end) {
          return sum + asset.cost;
        }
      }
      return sum;
    }, 0);
    
    const depreciation = categoryAssets.reduce((sum, asset) => {
      // Calculate depreciation for the period
      const inServiceDate = new Date(asset.inServiceDate);
      const disposalDate = asset.disposalInfo ? new Date(asset.disposalInfo.date) : null;
      
      // Only include depreciation for assets that were active during the period
      if (inServiceDate <= reportingPeriod.end && (!disposalDate || disposalDate >= reportingPeriod.start)) {
        // Calculate the portion of annual depreciation that falls within the period
        const annualDepreciation = asset.depreciationSchedules
          .find(s => s.type === 'GAAP')?.depreciation || 0;
        
        const periodStart = new Date(Math.max(inServiceDate.getTime(), reportingPeriod.start.getTime()));
        const periodEnd = disposalDate 
          ? new Date(Math.min(disposalDate.getTime(), reportingPeriod.end.getTime()))
          : reportingPeriod.end;
        
        const daysInPeriod = (periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24);
        const daysInYear = 365;
        
        return sum + (annualDepreciation * (daysInPeriod / daysInYear));
      }
      return sum;
    }, 0);
    
    const endingBalance = beginningBalance + additions - disposals - depreciation;
    
    return {
      category,
      beginningBalance,
      additions,
      disposals,
      depreciation,
      endingBalance,
      assetCount: categoryAssets.length
    };
  });

  // Filter out categories with no activity
  const activeRollforwardData = rollforwardData.filter(data => 
    data.beginningBalance !== 0 || 
    data.additions !== 0 || 
    data.disposals !== 0 || 
    data.depreciation !== 0
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Asset Rollforward Report</h3>
        <p className="text-sm text-gray-600">
          Fixed asset activity for the period {reportingPeriod.start.toLocaleDateString()} to {reportingPeriod.end.toLocaleDateString()}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Beginning Balance
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Additions
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Disposals
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Depreciation
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ending Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activeRollforwardData.map((data, index) => (
              <tr key={data.category} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {data.category}
                  <span className="ml-2 text-xs text-gray-500">
                    ({data.assetCount} assets)
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatCurrency(data.beginningBalance)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600">
                  {formatCurrency(data.additions)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                  {formatCurrency(data.disposals)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-orange-600">
                  {formatCurrency(data.depreciation)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                  {formatCurrency(data.endingBalance)}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                Total
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                {formatCurrency(activeRollforwardData.reduce((sum, data) => sum + data.beginningBalance, 0))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600">
                {formatCurrency(activeRollforwardData.reduce((sum, data) => sum + data.additions, 0))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                {formatCurrency(activeRollforwardData.reduce((sum, data) => sum + data.disposals, 0))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-orange-600">
                {formatCurrency(activeRollforwardData.reduce((sum, data) => sum + data.depreciation, 0))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                {formatCurrency(activeRollforwardData.reduce((sum, data) => sum + data.endingBalance, 0))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          <li>Beginning balance represents asset cost as of {reportingPeriod.start.toLocaleDateString()}</li>
          <li>Additions include assets placed in service during the period</li>
          <li>Disposals are recorded at original cost</li>
          <li>Depreciation is calculated pro-rata based on the number of days in service during the period</li>
          <li>Only categories with activity during the period are shown</li>
        </ul>
      </div>
    </div>
  );
}