import React, { useMemo } from 'react';
import { Asset } from '../types/asset';
import { formatCurrency } from '../utils/formatters';
import { calculateDepreciation, applyDepreciationConvention } from '../utils/depreciation';
import { FileSpreadsheet, Calculator, Calendar, BookOpen, FileBarChart2 } from 'lucide-react';

interface DepreciationReportProps {
  asset: Asset;
  onClose: () => void;
}

export function DepreciationReport({ asset, onClose }: DepreciationReportProps) {
  const calculateScheduleDepreciation = (schedule: Asset['depreciationSchedules'][0], year: number) => {
    const baseDepreciation = calculateDepreciation(
      asset.cost,
      schedule.salvageValue,
      schedule.life,
      schedule.method,
      year
    );

    return applyDepreciationConvention(
      baseDepreciation,
      schedule.convention,
      year === 1
    );
  };

  const depreciationData = useMemo(() => {
    const years = Math.max(...asset.depreciationSchedules.map(s => s.life));
    const data = [];

    for (let i = 0; i < years; i++) {
      const year = i + 1;
      const yearStart = new Date(asset.inServiceDate);
      yearStart.setFullYear(yearStart.getFullYear() + i);

      const yearData = {
        year: yearStart.getFullYear(),
        schedules: asset.depreciationSchedules.map(schedule => {
          const depreciation = calculateScheduleDepreciation(schedule, year);
          const previousYearNBV = i === 0 
            ? asset.cost 
            : data[i - 1].schedules.find(s => s.type === schedule.type)?.endingNBV || 0;
          const endingNBV = Math.max(previousYearNBV - depreciation, schedule.salvageValue);

          return {
            type: schedule.type,
            method: schedule.method,
            depreciation,
            beginningNBV: previousYearNBV,
            endingNBV,
            taxCode: schedule.taxCode
          };
        })
      };
      data.push(yearData);
    }

    return data;
  }, [asset]);

  const totals = useMemo(() => {
    return asset.depreciationSchedules.map(schedule => {
      const totalDepreciation = depreciationData.reduce((sum, year) => {
        const scheduleData = year.schedules.find(s => s.type === schedule.type);
        return sum + (scheduleData?.depreciation || 0);
      }, 0);

      return {
        type: schedule.type,
        totalDepreciation,
        remainingValue: asset.cost - totalDepreciation
      };
    });
  }, [depreciationData, asset.cost]);

  const renderDepreciationTable = (type: 'GAAP' | 'Tax') => {
    const schedule = asset.depreciationSchedules.find(s => s.type === type);
    if (!schedule) return null;

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className={`px-6 py-4 ${type === 'GAAP' ? 'bg-blue-50' : 'bg-green-50'}`}>
          <div className="flex items-center gap-2">
            {type === 'GAAP' ? (
              <BookOpen className="h-5 w-5 text-blue-600" />
            ) : (
              <FileBarChart2 className="h-5 w-5 text-green-600" />
            )}
            <h3 className="text-lg font-semibold text-gray-900">
              {type} Depreciation Schedule
              {type === 'Tax' && schedule.taxCode && (
                <span className="ml-2 text-sm font-normal text-gray-600">
                  ({schedule.taxCode})
                </span>
              )}
            </h3>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Method: {schedule.method.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')} • 
            Life: {schedule.life} years • 
            Convention: {schedule.convention.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </div>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Beginning NBV
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Depreciation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ending NBV
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {depreciationData.map((yearData, index) => {
              const scheduleData = yearData.schedules.find(s => s.type === type);
              if (!scheduleData) return null;

              return (
                <tr key={yearData.year} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {yearData.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(scheduleData.beginningNBV)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(scheduleData.depreciation)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(scheduleData.endingNBV)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-7xl shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Depreciation Report</h2>
            </div>
            <p className="text-gray-600 mt-1">{asset.name} ({asset.id})</p>
          </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Asset Summary</h3>
            </div>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Original Cost</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(asset.cost)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Current NBV</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(asset.netBookValue)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900">{asset.category}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
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

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Depreciation Summary</h3>
            </div>
            <dl className="space-y-4">
              {totals.map(total => (
                <div key={total.type} className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Total {total.type} Depreciation
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                      {formatCurrency(total.totalDepreciation)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Remaining {total.type} Value
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                      {formatCurrency(total.remainingValue)}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="space-y-6">
          {renderDepreciationTable('GAAP')}
          {renderDepreciationTable('Tax')}
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
            <li>Depreciation calculations start from the in-service date: {asset.inServiceDate.toLocaleDateString()}</li>
            <li>Book value calculations consider salvage value and depreciation conventions</li>
            <li>Tax depreciation may be subject to specific IRS regulations and limitations</li>
            {asset.depreciationSchedules.find(s => s.type === 'Tax')?.taxCode && (
              <li>Tax depreciation follows {asset.depreciationSchedules.find(s => s.type === 'Tax')?.taxCode} guidelines</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}