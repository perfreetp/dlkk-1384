import { create } from 'zustand';
import type { Tool, Category, User, PermissionRequest, ChangeLog, Guide, OnboardingTask, Feedback } from '../../shared/types';

interface AppState {
  currentDepartment: 'marketing' | 'customer-service';
  currentUser: User | null;
  tools: Tool[];
  categories: Category[];
  popularTools: Tool[];
  favoriteTools: Tool[];
  permissionRequests: PermissionRequest[];
  changeLogs: ChangeLog[];
  guides: Guide[];
  feedbacks: Feedback[];
  onboardingTasks: OnboardingTask[];
  onboardingProgress: { progress: number; completed: number; total: number };
  searchQuery: string;
  selectedCategory: string | null;
  notifications: number;
  subscriptions: { changelog: boolean; toolUpdates: boolean; permissionStatus: boolean; weekly: boolean };
  setDepartment: (dept: 'marketing' | 'customer-service') => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: string | null) => void;
  toggleFavorite: (toolId: string) => Promise<void>;
  fetchTools: (params?: Record<string, string>) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchPopularTools: () => Promise<void>;
  fetchFavorites: () => Promise<void>;
  fetchPermissionRequests: () => Promise<void>;
  fetchChangeLogs: () => Promise<void>;
  fetchGuides: () => Promise<void>;
  fetchFeedbacks: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  fetchOnboarding: () => Promise<void>;
  fetchSubscriptions: () => Promise<void>;
  updateSubscriptions: (subs: Partial<AppState['subscriptions']>) => Promise<void>;
  completeOnboardingTask: (taskId: string) => Promise<void>;
  submitPermissionRequest: (data: { toolId: string; toolName: string; reason: string; urgency: string }) => Promise<void>;
  approvePermission: (id: string, action: 'approved' | 'rejected', approveNote?: string) => Promise<void>;
  submitFeedback: (data: { type: string; title: string; description: string; toolId?: string; toolName?: string }) => Promise<void>;
  addTool: (data: Partial<Tool>) => Promise<void>;
  updateTool: (id: string, data: Partial<Tool>) => Promise<void>;
  deleteTool: (id: string) => Promise<void>;
}

const API_BASE = 'http://localhost:3001/api';

const useStore = create<AppState>((set, get) => ({
  currentDepartment: 'marketing',
  currentUser: null,
  tools: [],
  categories: [],
  popularTools: [],
  favoriteTools: [],
  permissionRequests: [],
  changeLogs: [],
  guides: [],
  feedbacks: [],
  onboardingTasks: [],
  onboardingProgress: { progress: 0, completed: 0, total: 0 },
  searchQuery: '',
  selectedCategory: null,
  notifications: 3,
  subscriptions: { changelog: true, toolUpdates: true, permissionStatus: true, weekly: false },

  setDepartment: (dept) => set({ currentDepartment: dept }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),

  fetchTools: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/tools${query ? `?${query}` : ''}`);
    const data = await res.json();
    if (data.success) {
      set({ tools: data.data });
    }
  },

  fetchCategories: async () => {
    const res = await fetch(`${API_BASE}/tools/categories`);
    const data = await res.json();
    if (data.success) {
      set({ categories: data.data });
    }
  },

  fetchPopularTools: async () => {
    const res = await fetch(`${API_BASE}/tools/popular?limit=10`);
    const data = await res.json();
    if (data.success) {
      set({ popularTools: data.data });
    }
  },

  fetchFavorites: async () => {
    const res = await fetch(`${API_BASE}/tools/favorites`);
    const data = await res.json();
    if (data.success) {
      set({ favoriteTools: data.data });
    }
  },

  toggleFavorite: async (toolId) => {
    const res = await fetch(`${API_BASE}/tools/${toolId}/toggle-favorite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (data.success) {
      set(state => ({
        tools: state.tools.map(t =>
          t.id === toolId ? { ...t, isFavorite: !t.isFavorite } : t
        ),
        popularTools: state.popularTools.map(t =>
          t.id === toolId ? { ...t, isFavorite: !t.isFavorite } : t
        ),
        favoriteTools: state.favoriteTools.filter(t => t.id !== toolId),
      }));
      get().fetchFavorites();
    }
  },

  fetchPermissionRequests: async () => {
    const res = await fetch(`${API_BASE}/permissions`);
    const data = await res.json();
    if (data.success) {
      set({ permissionRequests: data.data });
    }
  },

  fetchChangeLogs: async () => {
    const res = await fetch(`${API_BASE}/changelog`);
    const data = await res.json();
    if (data.success) {
      set({ changeLogs: data.data });
    }
  },

  fetchGuides: async () => {
    const res = await fetch(`${API_BASE}/guides`);
    const data = await res.json();
    if (data.success) {
      set({ guides: data.data });
    }
  },

  fetchFeedbacks: async () => {
    const res = await fetch(`${API_BASE}/feedback`);
    const data = await res.json();
    if (data.success) {
      set({ feedbacks: data.data });
    }
  },

  fetchUserProfile: async () => {
    const res = await fetch(`${API_BASE}/user/profile`);
    const data = await res.json();
    if (data.success) {
      set({ currentUser: data.data });
    }
  },

  fetchOnboarding: async () => {
    const res = await fetch(`${API_BASE}/user/onboarding`);
    const data = await res.json();
    if (data.success) {
      set({
        onboardingTasks: data.data.tasks,
        onboardingProgress: {
          progress: data.data.progress,
          completed: data.data.completed,
          total: data.data.total,
        },
      });
    }
  },

  completeOnboardingTask: async (taskId) => {
    const res = await fetch(`${API_BASE}/user/onboarding/${taskId}/complete`, {
      method: 'POST',
    });
    const data = await res.json();
    if (data.success) {
      set(state => ({
        onboardingTasks: state.onboardingTasks.map(t =>
          t.id === taskId ? { ...t, isCompleted: true, completedAt: data.data.task.completedAt } : t
        ),
        onboardingProgress: {
          progress: data.data.progress,
          completed: data.data.completed,
          total: data.data.total,
        },
      }));
    }
  },

  submitPermissionRequest: async (data) => {
    const res = await fetch(`${API_BASE}/permissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, applicant: '张小明' }),
    });
    const result = await res.json();
    if (result.success) {
      get().fetchPermissionRequests();
    }
  },

  submitFeedback: async (data) => {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, submitter: '张小明' }),
    });
    await res.json();
  },

  fetchSubscriptions: async () => {
    const res = await fetch(`${API_BASE}/user/subscriptions`);
    const data = await res.json();
    if (data.success) {
      set({ subscriptions: { changelog: data.data.changelog, toolUpdates: data.data.toolUpdates, permissionStatus: data.data.permissionStatus, weekly: false } });
    }
  },

  updateSubscriptions: async (subs) => {
    const newSubs = { ...get().subscriptions, ...subs };
    set({ subscriptions: newSubs });
    const res = await fetch(`${API_BASE}/user/subscriptions`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSubs),
    });
    const data = await res.json();
    if (data.success) {
      set({ subscriptions: { changelog: data.data.changelog, toolUpdates: data.data.toolUpdates, permissionStatus: data.data.permissionStatus, weekly: false } });
    }
  },

  approvePermission: async (id, action, approveNote) => {
    const endpoint = action === 'approved' ? 'approve' : 'reject';
    const res = await fetch(`${API_BASE}/permissions/${id}/${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approver: '管理员', approveNote: approveNote || '' }),
    });
    const data = await res.json();
    if (data.success) {
      get().fetchPermissionRequests();
    }
  },

  addTool: async (data) => {
    const res = await fetch(`${API_BASE}/tools`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.success) {
      get().fetchTools({ pageSize: '50' });
      get().fetchCategories();
    }
  },

  updateTool: async (id, data) => {
    const res = await fetch(`${API_BASE}/tools/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.success) {
      get().fetchTools({ pageSize: '50' });
    }
  },

  deleteTool: async (id) => {
    const res = await fetch(`${API_BASE}/tools/${id}`, {
      method: 'DELETE',
    });
    const result = await res.json();
    if (result.success) {
      get().fetchTools({ pageSize: '50' });
      get().fetchCategories();
    }
  },
}));

export default useStore;
