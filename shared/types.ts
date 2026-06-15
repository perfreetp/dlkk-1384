export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  category: string;
  department: 'marketing' | 'customer-service' | 'all';
  positions: string[];
  owner: string;
  ownerEmail: string;
  notes: string;
  accessCount: number;
  isFavorite: boolean;
  requiresPermission: boolean;
  hasPermission: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface PermissionRequest {
  id: string;
  toolId: string;
  toolName: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected';
  applicant: string;
  approver?: string;
  approveNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChangeLog {
  id: string;
  type: 'add' | 'update' | 'delete' | 'fix';
  title: string;
  description: string;
  toolId?: string;
  toolName?: string;
  version: string;
  createdAt: string;
}

export interface Guide {
  id: string;
  toolId: string;
  toolName: string;
  title: string;
  content: string;
  category: string;
  order: number;
}

export interface Feedback {
  id: string;
  type: 'broken-link' | 'recommend' | 'other';
  toolId?: string;
  toolName?: string;
  title: string;
  description: string;
  submitter: string;
  status: 'pending' | 'processing' | 'resolved';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: 'marketing' | 'customer-service';
  position: string;
  role: 'member' | 'admin';
  subscriptions: {
    changelog: boolean;
    toolUpdates: boolean;
    permissionStatus: boolean;
    weekly: boolean;
  };
}

export interface OnboardingTask {
  id: string;
  toolId: string;
  toolName: string;
  description: string;
  category: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
