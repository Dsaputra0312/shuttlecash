import { useState, useCallback } from "react";
import { useDataStore } from "../store/useDataStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3002/api";

export interface Settlement {
  memberId: string;
  name: string;
  isMember: boolean;
  shuttlecockCount: number;
  shuttlecockCost: number;
  courtFee: number;
  totalBill: number;
  paidAmount: number;
  status: 'paid' | 'unpaid';
  overpayment: number;
}

export function useSettlements() {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useDataStore();

  const apiRequest = useCallback(async (endpoint: string, options: RequestInit = {}) => {
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
      const errorData = await response.json().catch(() => ({ error: "Network error" }));
      throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }, [token]);

  const fetchSettlements = useCallback(async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest(`/finance/settlements?date=${date}`);
      setSettlements(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch settlements");
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  const paySettlement = useCallback(async (data: { date: string, memberId: string, amount: number, totalBill: number, playerName: string }) => {
    setLoading(true);
    try {
      await apiRequest('/finance/pay', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      // Refresh
      await fetchSettlements(data.date);
      return true;
    } catch (err: any) {
      setError(err.message || "Payment failed");
      return false;
    } finally {
      setLoading(false);
    }
  }, [apiRequest, fetchSettlements]);

  return {
    settlements,
    loading,
    error,
    fetchSettlements,
    paySettlement
  };
}
