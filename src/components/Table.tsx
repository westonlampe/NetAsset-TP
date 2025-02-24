import React from 'react';

interface Column {
  header: string;
  accessor: string;
  cell?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

interface TableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
}

export function Table({ columns, data, onRowClick }: TableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-200 table-fixed">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((column) => (
            <th
              key={column.header}
              className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              style={{ width: column.width }}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            onClick={() => onRowClick?.(row)}
            className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
          >
            {columns.map((column) => (
              <td
                key={column.header}
                className="px-3 py-4 whitespace-nowrap text-sm text-gray-900"
              >
                {column.cell
                  ? column.cell(row[column.accessor], row)
                  : row[column.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}