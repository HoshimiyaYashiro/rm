export type Role = 'employee' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  role: Role;
  teamId?: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface FormulaConfig {
  attendanceWeight: number; // e.g., 0.3
  managerWeight: number;    // e.g., 0.4
  customerWeight: number;   // e.g., 0.3
}

export interface Team {
  id: string;
  name: string;
  departmentId: string;
  managerId: string;
  formula: FormulaConfig;
  reviewLevels: number; // Number of approval levels required
}

export type RecordStatus = 
  | 'draft_registration' 
  | 'pending_registration' 
  | 'approved_registration' 
  | 'draft_summary' 
  | 'pending_summary' 
  | 'approved_summary';

export interface Goal {
  id: string;
  description: string;
  isCompleted: boolean;
  resultDescription: string;
}

export interface PerformanceRecord {
  id: string;
  userId: string;
  month: string; // YYYY-MM
  
  // Start of month
  registeredWorkingDays: number;
  goals: Goal[];
  
  // End of month
  actualWorkingDays: number;
  
  // Reviews
  managerScore: number; // 0-100
  customerTaskScore: number; // 0-100
  
  status: RecordStatus;
  currentReviewLevel: number;
  
  // Calculated
  finalScore?: number;
}
