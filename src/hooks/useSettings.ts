import { useCallback } from "react";
import { useDataStore } from "../store/useDataStore";
import { useApi } from "./useApi";

export function useSettings() {
  const {
    shuttlecockPrice,
    courtPriceNonMember,
    membershipFeeMonthly,
    fetchSettings,
    updateSettings: storeUpdateSettings,
  } = useDataStore();

  const fetchSettingsApi = useApi(
    async () => {
      await fetchSettings();
      return {
        shuttlecockPrice,
        courtPriceNonMember,
        membershipFeeMonthly,
      };
    },
    {
      shuttlecockPrice,
      courtPriceNonMember,
      membershipFeeMonthly,
    }
  );

  const updateSettingsApi = useApi(
    async (
      settings: Partial<{
        shuttlecock_price: number;
        court_price_non_member: number;
        membership_fee_monthly: number;
      }>
    ) => {
      await storeUpdateSettings(settings);
      return { success: true };
    }
  );

  const fetchSettingsCallback = useCallback(() => {
    fetchSettingsApi.execute();
  }, []);

  const updateSettingsCallback = useCallback(
    (
      settings: Partial<{
        shuttlecock_price: number;
        court_price_non_member: number;
        membership_fee_monthly: number;
      }>
    ) => {
      updateSettingsApi.execute(settings);
    },
    []
  );

  return {
    shuttlecockPrice,
    courtPriceNonMember,
    membershipFeeMonthly,
    fetchSettings: fetchSettingsCallback,
    updateSettings: updateSettingsCallback,
    loading: fetchSettingsApi.loading || updateSettingsApi.loading,
    error: fetchSettingsApi.error || updateSettingsApi.error,
  };
}
