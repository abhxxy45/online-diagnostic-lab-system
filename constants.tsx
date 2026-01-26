
import React from 'react';
import { UserRole, AppointmentStatus, PaymentStatus } from './types';

export const TEST_TYPES = [
  { id: 'cbc', name: 'Complete Blood Count (CBC)', price: 500 },
  { id: 'lft', name: 'Liver Function Test (LFT)', price: 1200 },
  { id: 'kft', name: 'Kidney Function Test (KFT)', price: 1500 },
  { id: 'lipid', name: 'Lipid Profile', price: 900 },
  { id: 'thyroid', name: 'Thyroid Panel (T3, T4, TSH)', price: 800 },
  { id: 'vitamin', name: 'Vitamin D3 & B12', price: 2000 },
];

export const APP_THEME = {
  primary: 'blue-600',
  secondary: 'slate-600',
  success: 'emerald-500',
  warning: 'amber-500',
  danger: 'rose-500',
};
