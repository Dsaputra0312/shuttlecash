import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Member {
  id: string;
  name: string;
  isMember: boolean;
  grade: string;
}

export interface UsageRecord {
  players: Member[];
  date: string;
  quantity: number;
  hasNonMember: boolean;
  totalCost: number;
}

export interface IncomeRecord {
  date: string;
  description: string;
  amount: number;
}

export interface ExpenseRecord {
  date: string;
  description: string;
  amount: number;
}

interface DataStore {
  shuttlecockPrice: number;
  courtPriceNonMember: number;
  membershipFeeMonthly: number;
  members: Member[];
  usageRecords: UsageRecord[];
  incomeRecords: IncomeRecord[];
  expenseRecords: ExpenseRecord[];
  
  setShuttlecockPrice: (price: number) => void;
  setCourtPriceNonMember: (price: number) => void;
  setMembershipFeeMonthly: (price: number) => void;
  addMember: (member: Member) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  addUsageRecord: (record: UsageRecord) => void;
  deleteUsageRecord: (index: number) => void;
  addIncomeRecord: (record: IncomeRecord) => void;
  deleteIncomeRecord: (index: number) => void;
  addExpenseRecord: (record: ExpenseRecord) => void;
  deleteExpenseRecord: (index: number) => void;
}

export const useDataStore = create<DataStore>()(
  persist(
    (set) => ({
      shuttlecockPrice: 10000,
      courtPriceNonMember: 50000,
      membershipFeeMonthly: 100000,
      members: [],
      usageRecords: [],
      incomeRecords: [],
      expenseRecords: [],

      setShuttlecockPrice: (price) => set({ shuttlecockPrice: price }),
      setCourtPriceNonMember: (price) => set({ courtPriceNonMember: price }),
      setMembershipFeeMonthly: (price) => set({ membershipFeeMonthly: price }),
      
      addMember: (member) =>
        set((state) => ({ members: [...state.members, member] })),
      
      updateMember: (id, updatedMember) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.id === id ? { ...m, ...updatedMember } : m
          ),
        })),
      
      deleteMember: (id) =>
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
        })),
      
      addUsageRecord: (record) => 
        set((state) => ({ usageRecords: [...state.usageRecords, record] })),
      
      deleteUsageRecord: (index) =>
        set((state) => ({
          usageRecords: state.usageRecords.filter((_, i) => i !== index),
        })),
      
      addIncomeRecord: (record) =>
        set((state) => ({ incomeRecords: [...state.incomeRecords, record] })),
      
      deleteIncomeRecord: (index) =>
        set((state) => ({
          incomeRecords: state.incomeRecords.filter((_, i) => i !== index),
        })),
      
      addExpenseRecord: (record) =>
        set((state) => ({ expenseRecords: [...state.expenseRecords, record] })),
      
      deleteExpenseRecord: (index) =>
        set((state) => ({
          expenseRecords: state.expenseRecords.filter((_, i) => i !== index),
        })),
    }),
    {
      name: 'badminton-club-storage',
    }
  )
);
