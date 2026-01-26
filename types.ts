
export enum UserRole {
  ADMIN = 'ADMIN',
  PATIENT = 'PATIENT',
  LAB_STAFF = 'LAB_STAFF'
}

export enum AppointmentStatus {
  NONE = 'NONE',
  BOOKED = 'BOOKED',
  PAID = 'PAID',
  SAMPLED = 'SAMPLED',
  PROCESSING = 'PROCESSING',
  READY = 'READY'
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  testType: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  amount: number;
}

export interface TestReport {
  id: string;
  appointmentId: string;
  results: Record<string, string>;
  generatedAt: string;
  insights?: string;
}

export interface Transaction {
  id: string;
  appointmentId: string;
  amount: number;
  timestamp: string;
  method: 'UPI' | 'CARD';
}
