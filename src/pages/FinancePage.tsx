import { IncomeExpense } from "../components/IncomeExpense";

export function FinancePage() {
  // Note: Data fetching is now handled by individual components
  // IncomeExpense component will fetch its own data when needed
  return <IncomeExpense />;
}
