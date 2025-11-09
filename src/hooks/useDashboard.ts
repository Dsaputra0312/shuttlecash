import { useState, useEffect, useCallback } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3002/api";

// API helper function
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
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

export interface DashboardStatistics {
  members: {
    total: number;
    active: number;
    nonMembers: number;
  };
  usage: {
    today: number;
    week: number;
    todaySessions: number;
  };
  finance: {
    weekIncome: number;
    weekExpenses: number;
    balance: number;
    weekIncomeCount: number;
    weekExpensesCount: number;
  };
}

export interface RecentActivity {
  type: string;
  date: string;
  description: string;
  amount: number;
  createdAt: string;
}

export interface TopPlayer {
  name: string;
  totalUsage: number;
}

export interface DashboardData {
  statistics: DashboardStatistics;
  recentActivities: RecentActivity[];
  topPlayers: TopPlayer[];
  settings: any;
}

export function useDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setLoading(false);
      setError("Authentication required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest("/dashboard");
      setDashboardData(response.data);
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboardData,
    loading,
    error,
    refetch,
  };
}
