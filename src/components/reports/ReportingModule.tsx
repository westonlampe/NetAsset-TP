import React, { useState } from 'react';
import { Asset } from '../../types/asset';
import { DepreciationWaterfall } from './DepreciationWaterfall';
import { Form4562 } from './Form4562';
import { AssetRollforward } from './AssetRollforward';
import { DisposalReport } from './DisposalReport';
import { FileSpreadsheet, TrendingDown, FileText, BarChart3, FileBarChart2, Filter, Calendar } from 'lucide-react';

interface ReportingModuleProps {
  assets: Asset[];
  onClose: () => void;
}

type ReportType = 'waterfall' | 'form4562' | 'rollforward' | 'disposal';

interface Filters {
  category: string;
  department: string;
  status: string;
  reportingPeriod: {
    start: string;
    end: string;
  };
  costRange: {
    min: number;
    max: number;
  };
}

export function ReportingModule({ assets, onClose }: ReportingModuleProps) {
  const [selectedReport, setSelectedReport] = useState<ReportType>('waterfall');
  const [showFilters, setShowFilters] = useState(false);
  const currentYear = new Date().getFullYear();
  const [filters, setFilters] = useState<Filters>({
    category: '',
    department: '',
    status: '',
    reportingPeriod: {
      start: `${currentYear}-01-01`,
      end: `${currentYear}-12-31`
    },
    costRange: {
      min: 0,
      max: Infinity
    }
  });

  const categories = [...new Set(assets.map(asset => asset.category))];
  const departments = [...new Set(assets.map(asset => asset.department))];
  const statuses = [...new Set(assets.map(asset => asset.status))];

  const reports = [
    {
      id: 'waterfall',
      name: 'Depreciation Waterfall',
      icon: TrendingDown,
      description: 'Visualize depreciation trends and patterns over time'
    },
    {
      id: 'form4562',
      name: 'Form 4562',
      icon: FileText,
      description: 'Depreciation and Amortization (Including Information on Listed Property)'
    },
    {
      id: 'rollforward',
      name: 'Asset Rollforward',
      icon: BarChart3,
      description: 'Track changes in asset values over the reporting period'
    },
    {
      id: 'disposal',
      name: 'Disposal Report',
      icon: FileBarChart2,
      description: 'Summary of disposed assets and their financial impact'
    }
  ];

  const commonPeriods = [
    { label: 'Current Year', start: `${currentYear}-01-01`, end: `${currentYear}-12-31` },
    { label: 'Previous Year', start: `${currentYear - 1}-01-01`, end: `${currentYear - 1}-12-31` },
    { label: 'YTD', start: `${currentYear}-01-01`, end: new Date().toISOString().split('T')[0] },
    { label: 'Q1', start: `${currentYear}-01-01`, end: `${currentYear}-03-31` },
    { label: 'Q2', start: `${currentYear}-04-01`, end: `${currentYear}-06-30` },
    { label: 'Q3', start: `${currentYear}-07-01`, end: `${currentYear}-09-30` },
    { label: 'Q4', start: `${currentYear}-10-01`, end: `${currentYear}-12-31` }
  ];

  const filteredAssets = assets.filter(asset => {
    const matchesCategory = !filters.category || asset.category === filters.category;
    const matchesDepartment = !filters.department || asset.department === filters.department;
    const matchesStatus = !filters.status || asset.status === filters.status;
    const matchesCostRange = asset.cost >= filters.costRange.min &&
                           (filters.costRange.max === Infinity || asset.cost <= filters.costRange.max);

    // Check if the asset was active during the reporting period
    const reportingStart = new Date(filters.reportingPeriod.start);
    const reportingEnd = new Date(filters.reportingPeriod.end);
    const inServiceDate = new Date(asset.inServiceDate);
    const disposalDate = asset.disposalInfo ? new Date(asset.disposalInfo.date) : null;

    const wasActive = inServiceDate <= reportingEnd && 
                     (!disposalDate || disposalDate >= reportingStart);

    return matchesCategory && matchesDepartment && matchesStatus && matchesCostRange && wasActive;
  });

  const renderReport = () => {
    const reportProps = {
      assets: filteredAssets,
      reportingPeriod: {
        start: new Date(filters.reportingPeriod.start),
        end: new Date(filters.reportingPeriod.end)
      }
    };

    switch (selectedReport) {
      case 'waterfall':
        return <DepreciationWaterfall {...reportProps} />;
      case 'form4562':
        return <Form4562 {...reportProps} />;
      case 'rollforward':
        return <AssetRollforward {...reportProps} />;
      case 'disposal':
        return <DisposalReport {...reportProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-7xl shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Fixed Asset Reports</h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {Object.values(filters).some(value => 
                value && (typeof value === 'string' ? value !== '' : 
                Object.values(value).some(v => v !== '' && v !== 0 && v !== Infinity))
              ) && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Active
                </span>
              )}
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

        {showFilters && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Report Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Reporting Period</label>
                <div className="mt-1 grid grid-cols-2 gap-4">
                  <div className="flex-1">
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={filters.reportingPeriod.start}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          reportingPeriod: { ...prev.reportingPeriod, start: e.target.value }
                        }))}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={filters.reportingPeriod.end}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          reportingPeriod: { ...prev.reportingPeriod, end: e.target.value }
                        }))}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {commonPeriods.map(period => (
                    <button
                      key={period.label}
                      type="button"
                      onClick={() => setFilters(prev => ({
                        ...prev,
                        reportingPeriod: {
                          start: period.start,
                          end: period.end
                        }
                      }))}
                      className={`inline-flex items-center px-2.5 py-1.5 border text-xs font-medium rounded shadow-sm
                        ${filters.reportingPeriod.start === period.start && filters.reportingPeriod.end === period.end
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">All Departments</option>
                  {departments.map(department => (
                    <option key={department} value={department}>{department}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">All Statuses</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Cost Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.costRange.min || ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      costRange: { ...prev.costRange, min: Number(e.target.value) || 0 }
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.costRange.max === Infinity ? '' : filters.costRange.max}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      costRange: { ...prev.costRange, max: Number(e.target.value) || Infinity }
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setFilters({
                    category: '',
                    department: '',
                    status: '',
                    reportingPeriod: {
                      start: `${currentYear}-01-01`,
                      end: `${currentYear}-12-31`
                    },
                    costRange: { min: 0, max: Infinity }
                  })}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {reports.map((report) => {
            const Icon = report.icon;
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id as ReportType)}
                className={`p-4 rounded-lg text-left transition-colors ${
                  selectedReport === report.id
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-5 w-5 ${
                    selectedReport === report.id ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <h3 className={`font-semibold ${
                    selectedReport === report.id ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {report.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">{report.description}</p>
              </button>
            );
          })}
        </div>

        <div className="bg-gray-50 rounded-lg">
          {renderReport()}
        </div>
      </div>
    </div>
  );
}