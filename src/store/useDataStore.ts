import { create } from "zustand";
import { persist } from "zustand/middleware";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3002/api";

export interface Member {
  id: string;
  name: string;
  is_member: boolean;
  grade: string;
  created_at: string;
  updated_at: string;
}

export interface UsageRecord {
  id: string;
  players: Member[];
  date: string;
  quantity: number;
  has_non_member: boolean;
  total_cost: number;
  match_number?: number;
  created_at: string;
}

export interface IncomeRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  created_at: string;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  created_at: string;
}

export interface Settings {
  id: string;
  shuttlecock_price: number;
  court_price_non_member: number;
  membership_fee_monthly: number;
  updated_at: string;
}

export interface User {
  id: string;
  username: string;
}

interface DataStore {
  // Auth state
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;

  // Data state
  shuttlecockPrice: number;
  courtPriceNonMember: number;
  membershipFeeMonthly: number;
  members: Member[];
  usageRecords: UsageRecord[];
  incomeRecords: IncomeRecord[];
  expenseRecords: ExpenseRecord[];

  // Loading states
  isLoading: boolean;
  error: string | null;
  loadingStates: {
    members: boolean;
    usageRecords: boolean;
    incomeRecords: boolean;
    expenseRecords: boolean;
    settings: boolean;
  };

  // Auth actions
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;

  // Data actions
  fetchMembers: () => Promise<void>;
  fetchUsageRecords: () => Promise<void>;
  fetchIncomeRecords: () => Promise<void>;
  fetchExpenseRecords: () => Promise<void>;
  fetchSettings: () => Promise<void>;

  // CRUD actions
  addMember: (
    member: Omit<Member, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  updateMember: (
    id: string,
    member: Partial<Omit<Member, "id" | "created_at" | "updated_at">>
  ) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;

  addUsageRecord: (
    record: Omit<UsageRecord, "id" | "created_at">
  ) => Promise<void>;
  deleteUsageRecord: (id: string) => Promise<void>;

  addIncomeRecord: (
    record: Omit<IncomeRecord, "id" | "created_at">
  ) => Promise<void>;
  deleteIncomeRecord: (id: string) => Promise<void>;

  addExpenseRecord: (
    record: Omit<ExpenseRecord, "id" | "created_at">
  ) => Promise<void>;
  deleteExpenseRecord: (id: string) => Promise<void>;

  updateSettings: (
    settings: Partial<Omit<Settings, "id" | "updated_at">>
  ) => Promise<void>;
}

// API helper functions
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Network error" }));
    throw new Error(error.message || error.error || `HTTP ${response.status}`);
  }

  const result = await response.json();
  return result.data || result; // Handle both wrapped and direct responses
};

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      token: null,

      shuttlecockPrice: 10000,
      courtPriceNonMember: 50000,
      membershipFeeMonthly: 100000,
      members: [],
      usageRecords: [],
      incomeRecords: [],
      expenseRecords: [],

      isLoading: false,
      error: null,
      loadingStates: {
        members: false,
        usageRecords: false,
        incomeRecords: false,
        expenseRecords: false,
        settings: false,
      },

      // Auth actions
      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Login failed");
          }

          const data = await response.json();
          localStorage.setItem("auth_token", data.data.token);

          set({
            isAuthenticated: true,
            user: data.data.user,
            token: data.data.token,
            isLoading: false,
          });

          // Note: Initial data fetching is now handled by individual pages/components
          // Dashboard uses single /api/dashboard endpoint
          // Other pages fetch their data as needed
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem("auth_token");
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          members: [],
          usageRecords: [],
          incomeRecords: [],
          expenseRecords: [],
        });
      },

      checkAuth: async () => {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        try {
          const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            set({
              isAuthenticated: true,
              user: data.data.user,
              token,
            });

            // Note: Data fetching is now handled by individual pages/components
            // Dashboard uses single /api/dashboard endpoint
            // Other pages fetch their data as needed
          } else {
            localStorage.removeItem("auth_token");
          }
        } catch (error) {
          localStorage.removeItem("auth_token");
        }
      },

      // Data fetching actions
      fetchMembers: async () => {
        set((state) => ({
          loadingStates: { ...state.loadingStates, members: true },
        }));
        try {
          const members = await apiRequest("/members");
          set({ members });
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set((state) => ({
            loadingStates: { ...state.loadingStates, members: false },
          }));
        }
      },

      fetchUsageRecords: async () => {
        set((state) => ({
          loadingStates: { ...state.loadingStates, usageRecords: true },
        }));
        try {
          const usageRecords = await apiRequest("/usage");
          set({ usageRecords });
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set((state) => ({
            loadingStates: { ...state.loadingStates, usageRecords: false },
          }));
        }
      },

      fetchIncomeRecords: async () => {
        set((state) => ({
          loadingStates: { ...state.loadingStates, incomeRecords: true },
        }));
        try {
          const incomeRecords = await apiRequest("/finance/income");
          set({ incomeRecords });
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set((state) => ({
            loadingStates: { ...state.loadingStates, incomeRecords: false },
          }));
        }
      },

      fetchExpenseRecords: async () => {
        set((state) => ({
          loadingStates: { ...state.loadingStates, expenseRecords: true },
        }));
        try {
          const expenseRecords = await apiRequest("/finance/expenses");
          set({ expenseRecords });
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set((state) => ({
            loadingStates: { ...state.loadingStates, expenseRecords: false },
          }));
        }
      },

      fetchSettings: async () => {
        set((state) => ({
          loadingStates: { ...state.loadingStates, settings: true },
        }));
        try {
          const settings = await apiRequest("/settings");
          set({
            shuttlecockPrice: settings.shuttlecock_price,
            courtPriceNonMember: settings.court_price_non_member,
            membershipFeeMonthly: settings.membership_fee_monthly,
          });
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set((state) => ({
            loadingStates: { ...state.loadingStates, settings: false },
          }));
        }
      },

      // CRUD actions
      addMember: async (member) => {
        try {
          const newMember = await apiRequest("/members", {
            method: "POST",
            body: JSON.stringify(member),
          });
          set((state) => ({ members: [...state.members, newMember] }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      updateMember: async (id, updates) => {
        try {
          const updatedMember = await apiRequest(`/members/${id}`, {
            method: "PUT",
            body: JSON.stringify(updates),
          });
          set((state) => ({
            members: state.members.map((m) =>
              m.id === id ? updatedMember : m
            ),
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      deleteMember: async (id) => {
        try {
          await apiRequest(`/members/${id}`, { method: "DELETE" });
          set((state) => ({
            members: state.members.filter((m) => m.id !== id),
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      addUsageRecord: async (record) => {
        try {
          const newRecord = await apiRequest("/usage", {
            method: "POST",
            body: JSON.stringify(record),
          });
          set((state) => ({
            usageRecords: [...state.usageRecords, newRecord],
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      deleteUsageRecord: async (id) => {
        try {
          await apiRequest(`/usage/${id}`, { method: "DELETE" });
          set((state) => ({
            usageRecords: state.usageRecords.filter((r) => r.id !== id),
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      addIncomeRecord: async (record) => {
        try {
          const newRecord = await apiRequest("/finance/income", {
            method: "POST",
            body: JSON.stringify(record),
          });
          set((state) => ({
            incomeRecords: [...state.incomeRecords, newRecord],
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      deleteIncomeRecord: async (id) => {
        try {
          await apiRequest(`/finance/income/${id}`, { method: "DELETE" });
          set((state) => ({
            incomeRecords: state.incomeRecords.filter((r) => r.id !== id),
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      addExpenseRecord: async (record) => {
        try {
          const newRecord = await apiRequest("/finance/expenses", {
            method: "POST",
            body: JSON.stringify(record),
          });
          set((state) => ({
            expenseRecords: [...state.expenseRecords, newRecord],
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      deleteExpenseRecord: async (id) => {
        try {
          await apiRequest(`/finance/expenses/${id}`, { method: "DELETE" });
          set((state) => ({
            expenseRecords: state.expenseRecords.filter((r) => r.id !== id),
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      updateSettings: async (updates) => {
        try {
          const updatedSettings = await apiRequest("/settings", {
            method: "PUT",
            body: JSON.stringify(updates),
          });
          set({
            shuttlecockPrice: updatedSettings.shuttlecock_price,
            courtPriceNonMember: updatedSettings.court_price_non_member,
            membershipFeeMonthly: updatedSettings.membership_fee_monthly,
          });
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },
    }),
    {
      name: "shuttlecash-auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
);
