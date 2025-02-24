import React, { useState } from 'react';
import { Asset } from '../../types/asset';
import { formatCurrency } from '../../utils/formatters';

interface Form4562Props {
  assets: Asset[];
}

export function Form4562({ assets }: Form4562Props) {
  const currentYear = new Date().getFullYear();
  
  const [basisReductions, setBasisReductions] = useState<Record<string, {
    section179: number;
    section168: number;
    specialDepreciation: number;
    otherBasisReduction: number;
  }>>({});

  const macrsAssets = assets.filter(asset => 
    asset.depreciationSchedules.some(s => 
      s.type === 'Tax' && 
      s.taxCode?.startsWith('MACRS') && 
      asset.acquisitionDate.getFullYear() === currentYear
    )
  );

  const section179Assets = assets.filter(asset =>
    asset.cost <= 1000000 && // 2023 Section 179 limit
    asset.acquisitionDate.getFullYear() === currentYear
  );

  const handleBasisReductionChange = (assetId: string, field: keyof typeof basisReductions[string], value: number) => {
    setBasisReductions(prev => ({
      ...prev,
      [assetId]: {
        ...prev[assetId] || {
          section179: 0,
          section168: 0,
          specialDepreciation: 0,
          otherBasisReduction: 0
        },
        [field]: value
      }
    }));
  };

  const calculateAdjustedBasis = (asset: Asset) => {
    const reductions = basisReductions[asset.id] || {
      section179: 0,
      section168: 0,
      specialDepreciation: 0,
      otherBasisReduction: 0
    };
    
    return asset.cost - 
      reductions.section179 - 
      reductions.section168 - 
      reductions.specialDepreciation - 
      reductions.otherBasisReduction;
  };

  const totalSection179 = section179Assets.reduce((sum, asset) => {
    const reduction = basisReductions[asset.id]?.section179 || 0;
    return sum + reduction;
  }, 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Form 4562 - Depreciation and Amortization</h3>
        <p className="text-sm text-gray-600">
          Tax year {currentYear} - Includes Section 179, Special Depreciation Allowance, and MACRS depreciation
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-md font-medium text-gray-900 mb-4">Part I - Section 179 Expense</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span>Maximum Section 179 limitation</span>
              <span className="font-medium">{formatCurrency(1000000)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Total cost of Section 179 property</span>
              <span className="font-medium">{formatCurrency(totalSection179)}</span>
            </div>
            <div className="border-t pt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Asset</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Cost</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Section 179</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Section 168(k)</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Special Depreciation</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Other Reductions</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Adjusted Basis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {section179Assets.map(asset => {
                    const reductions = basisReductions[asset.id] || {
                      section179: 0,
                      section168: 0,
                      specialDepreciation: 0,
                      otherBasisReduction: 0
                    };
                    return (
                      <tr key={asset.id}>
                        <td className="px-4 py-2 text-sm text-gray-900">{asset.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{formatCurrency(asset.cost)}</td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={reductions.section179}
                            onChange={(e) => handleBasisReductionChange(asset.id, 'section179', Number(e.target.value))}
                            className="w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                            min="0"
                            max={asset.cost}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={reductions.section168}
                            onChange={(e) => handleBasisReductionChange(asset.id, 'section168', Number(e.target.value))}
                            className="w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                            min="0"
                            max={asset.cost - reductions.section179}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={reductions.specialDepreciation}
                            onChange={(e) => handleBasisReductionChange(asset.id, 'specialDepreciation', Number(e.target.value))}
                            className="w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                            min="0"
                            max={asset.cost - reductions.section179 - reductions.section168}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={reductions.otherBasisReduction}
                            onChange={(e) => handleBasisReductionChange(asset.id, 'otherBasisReduction', Number(e.target.value))}
                            className="w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                            min="0"
                            max={asset.cost - reductions.section179 - reductions.section168 - reductions.specialDepreciation}
                          />
                        </td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">
                          {formatCurrency(calculateAdjustedBasis(asset))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-md font-medium text-gray-900 mb-4">Part II - Special Depreciation Summary</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Total Section 179</h5>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(totalSection179)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Total Section 168(k)</h5>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(
                    Object.values(basisReductions).reduce((sum, reductions) => sum + (reductions.section168 || 0), 0)
                  )}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Total Special Depreciation</h5>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(
                    Object.values(basisReductions).reduce((sum, reductions) => sum + (reductions.specialDepreciation || 0), 0)
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-md font-medium text-gray-900 mb-4">Part III - MACRS Depreciation</h4>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Classification</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Original Basis</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Adjusted Basis</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Method</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Convention</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Depreciation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {macrsAssets.map(asset => {
                const taxSchedule = asset.depreciationSchedules.find(s => s.type === 'Tax');
                return (
                  <tr key={asset.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">{taxSchedule?.taxCode}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{formatCurrency(asset.cost)}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{formatCurrency(calculateAdjustedBasis(asset))}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {taxSchedule?.method.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {taxSchedule?.convention.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {formatCurrency(asset.accumulatedDepreciation)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            <li>Section 179 expense cannot exceed $1,000,000 for tax year {currentYear}</li>
            <li>Section 168(k) bonus depreciation is 80% for qualified property placed in service during {currentYear}</li>
            <li>Special depreciation allowance must be claimed before regular depreciation</li>
            <li>Adjusted basis is calculated after all applicable basis reductions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}