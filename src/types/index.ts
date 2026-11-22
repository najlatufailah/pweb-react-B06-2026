export type WorkMode = 'Remote' | 'Hybrid' | 'Onsite';

export type ApplicationStatus =
  | 'WISHLIST'
  | 'APPLIED'
  | 'SCREENING'
  | 'INTERVIEW'
  | 'OFFER'
  | 'REJECTED'
  | 'GHOSTED';

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string; // ISO
  message: string;
}

export interface Application {
  id: string;
  company: string;
  role: string;
  workMode: WorkMode;
  status: ApplicationStatus;
  requiredSkills: string[];
  cvVersion?: string;
  appliedDate?: string;
  interviewDateTime?: string; // YYYY-MM-DDTHH:mm
  salaryOffer?: number;
  lastUpdatedAt: string; // ISO
  checklist: ChecklistItem[];
  activityLogs: ActivityLog[];
}

// Format 1 lowongan dari Remotive & magang-fallback.json
export interface JobListing {
  id: number;
  title: string;
  company_name: string;
  category: string;
  candidate_required_location: string;
  salary: string;
  tags: string[];
}