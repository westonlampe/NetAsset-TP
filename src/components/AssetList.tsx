import React from 'react';
import { Table } from './Table';
import { formatCurrency } from '../utils/formatters';
import { Asset } from '../types/asset';
import { FileSpreadsheet, Trash2, Pencil } from 'lucide-react';

interface AssetListProps {
  assets: Asset[];
  onAssetSelect: (asset: Asset) => void;
  onViewReport: (asset: Asset) => void;
  onDispose: (asset: Asset) => void;
  onEdit: (asset: Asset) => void;
}

export function AssetList({ assets, onAssetSelect, onViewReport, onDispose, onEdit }: AssetListProps) {
  const columns = [
    {
      header: 'Asset ID',
      accessor: 'id',
      width: '8%'
    },
    {
      header: 'Name',
      accessor: 'name',
      width: '18%'
    },
    {
      header: 'Category',
      accessor: 'category',
      width: '15%'
    },
    {
      header: 'Acquisition Date',
      accessor: 'acquisitionDate',
      cell: (value: Date) => value.toLocaleDateString(),
      width: '12%'
    },
    {
      header: 'Cost',
      accessor: 'cost',
      cell: (value: number) => formatCurrency(value),
      width: '12%'
    },
    {
      header: 'Net Book Value',
      accessor: 'netBookValue',
      cell: (value: number) => formatCurrency(value),
      width: '12%'
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'active' ? 'bg-green-100 text-green-800' :
          value === 'disposed' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
      width: '8%'
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (value: string, row: Asset) => (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row);
            }}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewReport(row);
            }}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1" />
            Report
          </button>
          {row.status === 'active' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDispose(row);
              }}
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Dispose
            </button>
          )}
        </div>
      ),
      width: '15%'
    }
  ];

  return (
    <div className="overflow-x-auto">
      <Table
        columns={columns}
        data={assets}
        onRowClick={onAssetSelect}
      />
    </div>
  );
}