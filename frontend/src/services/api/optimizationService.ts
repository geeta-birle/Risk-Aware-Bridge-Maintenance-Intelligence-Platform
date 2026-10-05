import { OptimizationPortfolioResult, BudgetScenario } from '../../types/optimization';
import { solveOptimization, DEFAULT_BUDGET_SCENARIOS, INITIAL_OPTIMIZATION_RESULT } from '../../mock/optimization';

export const optimizationService = {
  async getScenarios(): Promise<BudgetScenario[]> {
    return [...DEFAULT_BUDGET_SCENARIOS];
  },

  async runOptimization(budgetCr: number): Promise<OptimizationPortfolioResult> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return solveOptimization(budgetCr);
  },

  async getInitialOptimization(): Promise<OptimizationPortfolioResult> {
    return { ...INITIAL_OPTIMIZATION_RESULT };
  }
};
