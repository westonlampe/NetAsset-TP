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
