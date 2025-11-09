import { useCallback } from "react";
import {
  useDataStore,
  IncomeRecord,
  ExpenseRecord,
} from "../store/useDataStore";
import { useApi } from "./useApi";

export function useFinance() {
  const {
    incomeRecords,
    expenseRecords,
    fetchIncomeRecords,
    fetchExpenseRecords,
    addIncomeRecord: storeAddIncomeRecord,
    addExpenseRecord: storeAddExpenseRecord,
    deleteIncomeRecord: storeDeleteIncomeRecord,
    deleteExpenseRecord: storeDeleteExpenseRecord,
  } = useDataStore();

  const fetchIncomeRecordsApi = useApi(async () => {
    await fetchIncomeRecords();
    return incomeRecords;
  }, incomeRecords);

  const fetchExpenseRecordsApi = useApi(async () => {
    await fetchExpenseRecords();
    return expenseRecords;
  }, expenseRecords);

  const addIncomeRecordApi = useApi(
    async (incomeData: Omit<IncomeRecord, "id" | "created_at">) => {
      await storeAddIncomeRecord(incomeData);
      return { success: true };
    }
  );

  const addExpenseRecordApi = useApi(
    async (expenseData: Omit<ExpenseRecord, "id" | "created_at">) => {
      await storeAddExpenseRecord(expenseData);
      return { success: true };
    }
  );

  const deleteIncomeRecordApi = useApi(async (id: string) => {
    await storeDeleteIncomeRecord(id);
    return { success: true };
  });

  const deleteExpenseRecordApi = useApi(async (id: string) => {
    await storeDeleteExpenseRecord(id);
    return { success: true };
  });

  const fetchIncomeRecordsCallback = useCallback(() => {
    fetchIncomeRecordsApi.execute();
  }, []);

  const fetchExpenseRecordsCallback = useCallback(() => {
    fetchExpenseRecordsApi.execute();
  }, []);

  const addIncomeRecordCallback = useCallback(
    (incomeData: Omit<IncomeRecord, "id" | "created_at">) => {
      addIncomeRecordApi.execute(incomeData);
    },
    []
  );

  const addExpenseRecordCallback = useCallback(
    (expenseData: Omit<ExpenseRecord, "id" | "created_at">) => {
      addExpenseRecordApi.execute(expenseData);
    },
    []
  );

  const deleteIncomeRecordCallback = useCallback((id: string) => {
    deleteIncomeRecordApi.execute(id);
  }, []);

  const deleteExpenseRecordCallback = useCallback((id: string) => {
    deleteExpenseRecordApi.execute(id);
  }, []);

  return {
    incomeRecords,
    expenseRecords,
    fetchIncomeRecords: fetchIncomeRecordsCallback,
    fetchExpenseRecords: fetchExpenseRecordsCallback,
    addIncomeRecord: addIncomeRecordCallback,
    addExpenseRecord: addExpenseRecordCallback,
    deleteIncomeRecord: deleteIncomeRecordCallback,
    deleteExpenseRecord: deleteExpenseRecordCallback,
    loading:
      fetchIncomeRecordsApi.loading ||
      fetchExpenseRecordsApi.loading ||
      addIncomeRecordApi.loading ||
      addExpenseRecordApi.loading ||
      deleteIncomeRecordApi.loading ||
      deleteExpenseRecordApi.loading,
    error:
      fetchIncomeRecordsApi.error ||
      fetchExpenseRecordsApi.error ||
      addIncomeRecordApi.error ||
      addExpenseRecordApi.error ||
      deleteIncomeRecordApi.error ||
      deleteExpenseRecordApi.error,
  };
}
