import { useCallback } from "react";
import { useDataStore, UsageRecord } from "../store/useDataStore";
import { useApi } from "./useApi";

export function useUsage() {
  const {
    usageRecords,
    fetchUsageRecords,
    addUsageRecord: storeAddUsageRecord,
    deleteUsageRecord: storeDeleteUsageRecord,
  } = useDataStore();

  const fetchUsageRecordsApi = useApi(async () => {
    await fetchUsageRecords();
    return usageRecords;
  }, usageRecords);

  const addUsageRecordApi = useApi(
    async (usageData: Omit<UsageRecord, "id" | "created_at">) => {
      await storeAddUsageRecord(usageData);
      return { success: true };
    }
  );

  const deleteUsageRecordApi = useApi(async (id: string) => {
    await storeDeleteUsageRecord(id);
    return { success: true };
  });

  const fetchUsageRecordsCallback = useCallback(() => {
    fetchUsageRecordsApi.execute();
  }, []);

  const addUsageRecordCallback = useCallback(
    (usageData: Omit<UsageRecord, "id" | "created_at">) => {
      addUsageRecordApi.execute(usageData);
    },
    []
  );

  const deleteUsageRecordCallback = useCallback((id: string) => {
    deleteUsageRecordApi.execute(id);
  }, []);

  return {
    usageRecords,
    fetchUsageRecords: fetchUsageRecordsCallback,
    addUsageRecord: addUsageRecordCallback,
    deleteUsageRecord: deleteUsageRecordCallback,
    loading:
      fetchUsageRecordsApi.loading ||
      addUsageRecordApi.loading ||
      deleteUsageRecordApi.loading,
    error:
      fetchUsageRecordsApi.error ||
      addUsageRecordApi.error ||
      deleteUsageRecordApi.error,
  };
}
