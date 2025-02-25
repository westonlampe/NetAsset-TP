import React, { useState } from 'react';
import { PlusCircle, Building2, FileText } from 'lucide-react';
import { Asset, DisposalInfo } from './types/asset';
import { AssetList } from './components/AssetList';
import { AssetDetail } from './components/AssetDetail';
import { AssetForm } from './components/AssetForm';
import { DepreciationReport } from './components/DepreciationReport';
import { ReportingModule } from './components/reports/ReportingModule';
import { DisposalForm } from './components/DisposalForm';

const mockAssets: Asset[] = [
  {
    id: 'FA-001',
    name: 'Manufacturing Equipment A',
    description: 'High-capacity production line equipment',
    acquisitionDate: new Date('2023-01-15'),
    cost: 250000,
    location: 'Plant 1',
    department: 'Manufacturing',
    serialNumber: 'ME-2023-001',
    status: 'active',
    depreciationSchedules: [
      {
        id: 'DS-001',
        method: 'straight-line',
        life: 7,
        salvageValue: 25000,
        convention: 'half-year',
        type: 'GAAP'
      },
      {
        id: 'DS-002',
        method: 'declining-balance',
        life: 5,
        salvageValue: 0,
        convention: 'half-year',
        type: 'Tax',
        taxCode: 'MACRS-7'
      }
    ],
    category: 'Manufacturing Equipment',
    inServiceDate: new Date('2023-02-01'),
    accumulatedDepreciation: 32142.86,
    netBookValue: 217857.14
  },
  {
    id: 'FA-002',
    name: 'Office Building Complex',
    description: 'Corporate headquarters building including land and improvements',
    acquisitionDate: new Date('2023-03-10'),
    cost: 2500000,
    location: 'Downtown',
    department: 'Corporate',
    serialNumber: 'BLDG-2023-001',
    status: 'active',
    depreciationSchedules: [
      {
        id: 'DS-003',
        method: 'straight-line',
        life: 39,
        salvageValue: 500000,
        convention: 'mid-month',
        type: 'GAAP'
      },
      {
        id: 'DS-004',
        method: 'straight-line',
        life: 39,
        salvageValue: 0,
        convention: 'mid-month',
        type: 'Tax',
        taxCode: 'MACRS-39'
      }
    ],
    category: 'Buildings',
    inServiceDate: new Date('2023-04-01'),
    accumulatedDepreciation: 48076.92,
    netBookValue: 2451923.08
  },
  {
    id: 'FA-003',
    name: 'Delivery Fleet Vehicles',
    description: 'Fleet of 5 delivery vans for regional distribution',
    acquisitionDate: new Date('2023-06-15'),
    cost: 175000,
    location: 'Distribution Center',
    department: 'Logistics',
    serialNumber: 'FLEET-2023-001',
    status: 'active',
    depreciationSchedules: [
      {
        id: 'DS-005',
        method: 'declining-balance',
        life: 5,
        salvageValue: 35000,
        convention: 'half-year',
        type: 'GAAP'
      },
      {
        id: 'DS-006',
        method: 'declining-balance',
        life: 5,
        salvageValue: 0,
        convention: 'half-year',
        type: 'Tax',
        taxCode: 'MACRS-5'
      }
    ],
    category: 'Vehicles',
    inServiceDate: new Date('2023-07-01'),
    accumulatedDepreciation: 35000,
    netBookValue: 140000
  },
  {
    id: 'FA-004',
    name: 'IT Infrastructure Upgrade',
    description: 'Network servers and equipment for data center',
    acquisitionDate: new Date('2023-02-20'),
    cost: 120000,
    location: 'Data Center',
    department: 'IT',
    serialNumber: 'IT-2023-001',
    status: 'active',
    depreciationSchedules: [
      {
        id: 'DS-007',
        method: 'straight-line',
        life: 5,
        salvageValue: 10000,
        convention: 'half-year',
        type: 'GAAP'
      },
      {
        id: 'DS-008',
        method: 'declining-balance',
        life: 5,
        salvageValue: 0,
        convention: 'half-year',
        type: 'Tax',
        taxCode: 'MACRS-5'
      }
    ],
    category: 'IT Equipment',
    inServiceDate: new Date('2023-03-01'),
    accumulatedDepreciation: 22000,
    netBookValue: 98000
  },
  {
    id: 'FA-005',
    name: 'Laboratory Equipment',
    description: 'Specialized testing and research equipment',
    acquisitionDate: new Date('2023-04-05'),
    cost: 350000,
    location: 'R&D Lab',
    department: 'Research',
    serialNumber: 'LAB-2023-001',
    status: 'active',
    depreciationSchedules: [
      {
        id: 'DS-009',
        method: 'straight-line',
        life: 7,
        salvageValue: 50000,
        convention: 'half-year',
        type: 'GAAP'
      },
      {
        id: 'DS-010',
        method: 'declining-balance',
        life: 7,
        salvageValue: 0,
        convention: 'half-year',
        type: 'Tax',
        taxCode: 'MACRS-7'
      }
    ],
    category: 'Research Equipment',
    inServiceDate: new Date('2023-05-01'),
    accumulatedDepreciation: 42857.14,
    netBookValue: 307142.86
  },
  {
    id: 'FA-006',
    name: 'Warehouse Racking System',
    description: 'Industrial storage and organization system',
    acquisitionDate: new Date('2023-07-20'),
    cost: 85000,
    location: 'Warehouse A',
    department: 'Operations',
    serialNumber: 'RACK-2023-001',
    status: 'active',
    depreciationSchedules: [
      {
        id: 'DS-011',
        method: 'straight-line',
        life: 7,
        salvageValue: 8500,
        convention: 'half-year',
        type: 'GAAP'
      },
      {
        id: 'DS-012',
        method: 'declining-balance',
        life: 7,
        salvageValue: 0,
        convention: 'half-year',
        type: 'Tax',
        taxCode: 'MACRS-7'
      }
    ],
    category: 'Storage Equipment',
    inServiceDate: new Date('2023-08-01'),
    accumulatedDepreciation: 5500,
    netBookValue: 79500
  },
  {
    id: 'FA-007',
    name: 'Office Furniture Set',
    description: 'Modern office furniture for new wing',
    acquisitionDate: new Date('2023-05-10'),
    cost: 45000,
    location: 'HQ Floor 3',
    department: 'Facilities',
    serialNumber: 'FURN-2023-001',
    status: 'active',
    depreciationSchedules: [
      {
        id: 'DS-013',
        method: 'straight-line',
        life: 7,
        salvageValue: 4500,
        convention: 'half-year',
        type: 'GAAP'
      },
      {
        id: 'DS-014',
        method: 'declining-balance',
        life: 7,
        salvageValue: 0,
        convention: 'half-year',
        type: 'Tax',
        taxCode: 'MACRS-7'
      }
    ],
    category: 'Furniture and Fixtures',
    inServiceDate: new Date('2023-06-01'),
    accumulatedDepreciation: 3750,
    netBookValue: 41250
  },
  {
    id: 'FA-008',
    name: 'Solar Panel Installation',
    description: 'Renewable energy system for manufacturing facility',
    acquisitionDate: new Date('2023-03-25'),
    cost: 420000,
    location: 'Plant 1 Roof',
    department: 'Facilities',
    serialNumber: 'SOLAR-2023-001',
    status: 'active',
    depreciationSchedules: [
      {
        id: 'DS-015',
        method: 'straight-line',
        life: 20,
        salvageValue: 42000,
        convention: 'half-year',
        type: 'GAAP'
      },
      {
        id: 'DS-016',
        method: 'declining-balance',
        life: 5,
        salvageValue: 0,
        convention: 'half-year',
        type: 'Tax',
        taxCode: 'MACRS-5'
      }
    ],
    category: 'Energy Systems',
    inServiceDate: new Date('2023-05-01'),
    accumulatedDepreciation: 18900,
    netBookValue: 401100
  },
  {
    id: 'FA-009',
    name: 'Quality Control System',
    description: 'Automated quality assurance equipment',
    acquisitionDate: new Date('2023-08-05'),
    cost: 165000,
    location: 'Plant 1',
    department: 'Quality',
    serialNumber: 'QC-2023-001',
    status: 'active',
    depreciationSchedules: [
      {
        id: 'DS-017',
        method: 'straight-line',
        life: 5,
        salvageValue: 16500,
        convention: 'half-year',
        type: 'GAAP'
      },
      {
        id: 'DS-018',
        method: 'declining-balance',
        life: 5,
        salvageValue: 0,
        convention: 'half-year',
        type: 'Tax',
        taxCode: 'MACRS-5'
      }
    ],
    category: 'Quality Equipment',
    inServiceDate: new Date('2023-09-01'),
    accumulatedDepreciation: 11000,
    netBookValue: 154000
  },
  {
    id: 'FA-010',
    name: 'Robotic Assembly Line',
    description: 'Automated production line with robotic arms',
    acquisitionDate: new Date('2023-09-15'),
    cost: 750000,
    location: 'Plant 2',
    department: 'Manufacturing',
    serialNumber: 'ROB-2023-001',
    status: 'active',
    depreciationSchedules: [
      {
        id: 'DS-019',
        method: 'straight-line',
        life: 10,
        salvageValue: 75000,
        convention: 'half-year',
        type: 'GAAP'
      },
      {
        id: 'DS-020',
        method: 'declining-balance',
        life: 7,
        salvageValue: 0,
        convention: 'half-year',
        type: 'Tax',
        taxCode: 'MACRS-7'
      }
    ],
    category: 'Manufacturing Equipment',
    inServiceDate: new Date('2023-10-01'),
    accumulatedDepreciation: 18750,
    netBookValue: 731250
  }
];

function App() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showDepreciationReport, setShowDepreciationReport] = useState(false);
  const [showReportingModule, setShowReportingModule] = useState(false);
  const [showDisposalForm, setShowDisposalForm] = useState(false);
  const [disposingAsset, setDisposingAsset] = useState<Asset | null>(null);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const handleAddAsset = (newAsset: Omit<Asset, 'id' | 'accumulatedDepreciation' | 'netBookValue'>) => {
    const asset: Asset = {
      ...newAsset,
      id: `FA-${String(assets.length + 1).padStart(3, '0')}`,
      accumulatedDepreciation: 0,
      netBookValue: newAsset.cost
    };
    setAssets(prevAssets => [...prevAssets, asset]);
    setShowAssetForm(false);
  };

  const handleEditAsset = (updatedAsset: Asset) => {
    // Ensure dates are proper Date objects
    const processedAsset = {
      ...updatedAsset,
      acquisitionDate: new Date(updatedAsset.acquisitionDate),
      inServiceDate: new Date(updatedAsset.inServiceDate),
      lastDepreciationDate: updatedAsset.lastDepreciationDate ? new Date(updatedAsset.lastDepreciationDate) : undefined,
      // Recalculate netBookValue based on cost and accumulated depreciation
      netBookValue: updatedAsset.cost - updatedAsset.accumulatedDepreciation,
      // Ensure basisAdjustments are properly handled
      basisAdjustments: updatedAsset.basisAdjustments ? {
        ...updatedAsset.basisAdjustments,
        section179: Number(updatedAsset.basisAdjustments.section179),
        section168k: Number(updatedAsset.basisAdjustments.section168k),
        specialDepreciation: Number(updatedAsset.basisAdjustments.specialDepreciation),
        otherAdjustments: Number(updatedAsset.basisAdjustments.otherAdjustments)
      } : undefined
    };

    setAssets(prevAssets => 
      prevAssets.map(asset => 
        asset.id === processedAsset.id ? processedAsset : asset
      )
    );
    
    setEditingAsset(null);
    setShowAssetForm(false);
    setSelectedAsset(null);
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setShowAssetForm(true);
    setSelectedAsset(null);
  };

  const handleViewReport = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowDepreciationReport(true);
  };

  const handleDispose = (asset: Asset) => {
    setDisposingAsset(asset);
    setShowDisposalForm(true);
  };

  const handleDisposalSubmit = (assetId: string, disposalInfo: DisposalInfo) => {
    setAssets(prevAssets => 
      prevAssets.map(asset => 
        asset.id === assetId
          ? {
              ...asset,
              status: 'disposed',
              disposalInfo: {
                ...disposalInfo,
                date: new Date(disposalInfo.date)
              },
              lastDepreciationDate: new Date(disposalInfo.date)
            }
          : asset
      )
    );
    setShowDisposalForm(false);
    setDisposingAsset(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">
                Fixed Asset Management
              </h1>
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setShowReportingModule(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FileText className="h-5 w-5 mr-2" />
                Reports
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingAsset(null);
                  setShowAssetForm(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add Asset
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Asset List</h2>
            <AssetList
              assets={assets}
              onAssetSelect={setSelectedAsset}
              onViewReport={handleViewReport}
              onDispose={handleDispose}
              onEdit={handleEdit}
            />
          </div>
        </div>
      </main>

      {selectedAsset && !showAssetForm && !showDepreciationReport && !showReportingModule && !showDisposalForm && (
        <AssetDetail
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onEdit={() => handleEdit(selectedAsset)}
        />
      )}

      {showAssetForm && (
        <AssetForm
          onSubmit={editingAsset ? handleEditAsset : handleAddAsset}
          onCancel={() => {
            setShowAssetForm(false);
            setEditingAsset(null);
          }}
          initialData={editingAsset}
        />
      )}

      {showDepreciationReport && selectedAsset && (
        <DepreciationReport
          asset={selectedAsset}
          onClose={() => setShowDepreciationReport(false)}
        />
      )}

      {showReportingModule && (
        <ReportingModule
          assets={assets}
          onClose={() => setShowReportingModule(false)}
        />
      )}

      {showDisposalForm && disposingAsset && (
        <DisposalForm
          asset={disposingAsset}
          onSubmit={handleDisposalSubmit}
          onCancel={() => {
            setShowDisposalForm(false);
            setDisposingAsset(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
