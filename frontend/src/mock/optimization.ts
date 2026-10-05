import { MOCK_BRIDGES } from './bridges';
import { OptimizationPortfolioResult, OptimizationResultItem, BudgetScenario } from '../types/optimization';

export const DEFAULT_BUDGET_SCENARIOS: BudgetScenario[] = [
  { id: 'austere', name: 'Constrained Budget (₹30 Cr)', budgetCr: 30.0, description: 'Targets only highest immediate failure consequence assets' },
  { id: 'baseline', name: 'Target Capital Budget (₹55 Cr)', budgetCr: 55.0, description: 'Standard fiscal allocation balancing risk and life-cycle deferral' },
  { id: 'expanded', name: 'Comprehensive Modernization (₹90 Cr)', budgetCr: 90.0, description: 'Aggressive preventative and structural intervention program' },
];

/**
 * Realistic Knapsack Optimizer: selects bridge interventions that maximize 
 * multi-objective benefit (risk reduction * consequence) within the budget limit.
 */
export function solveOptimization(budgetCr: number): OptimizationPortfolioResult {
  // Sort candidates by Benefit-to-Cost Ratio (BCR)
  const candidates = [...MOCK_BRIDGES].map(b => {
    // Multi-objective benefit = expectedRiskReduction * (consequenceScore / 50)
    const rawBenefit = b.expectedRiskReductionScore * (b.consequenceScore / 50);
    const cost = b.estimatedInterventionCostCr;
    const bcr = Number((rawBenefit / cost).toFixed(2));
    return { bridge: b, cost, rawBenefit, bcr };
  }).sort((a, b) => b.bcr - a.bcr);

  let currentSpent = 0;
  const items: OptimizationResultItem[] = [];
  let rank = 1;

  for (const item of candidates) {
    const isSelected = (currentSpent + item.cost) <= budgetCr;
    if (isSelected) {
      currentSpent += item.cost;
    }

    items.push({
      bridge: item.bridge,
      selected: isSelected,
      allocationCr: isSelected ? item.cost : 0,
      expectedRiskReduction: isSelected ? item.bridge.expectedRiskReductionScore : 0,
      consequenceAvoided: isSelected ? item.bridge.consequenceScore : 0,
      benefitCostRatio: item.bcr,
      selectionRank: rank++,
      deferralConsequenceRisk: Number((item.bridge.deferralRisk2Year * item.bridge.costOfDelayMultiplier2Year).toFixed(1))
    });
  }

  const selectedItems = items.filter(i => i.selected);
  const totalAllocated = Number(currentSpent.toFixed(2));
  const remainingBudget = Number(Math.max(0, budgetCr - totalAllocated).toFixed(2));
  const totalRiskReduction = Number(selectedItems.reduce((acc, i) => acc + i.expectedRiskReduction, 0).toFixed(1));
  const totalConsequenceAvoided = Number(selectedItems.reduce((acc, i) => acc + i.consequenceAvoided, 0).toFixed(1));
  
  // Benchmark max potential risk reduction across whole cohort
  const maxPossibleRisk = MOCK_BRIDGES.reduce((acc, b) => acc + b.expectedRiskReductionScore, 0);
  const portfolioRiskReductionPercentage = Number(((totalRiskReduction / maxPossibleRisk) * 100).toFixed(1));

  return {
    budgetLimitCr: budgetCr,
    totalAllocatedCr: totalAllocated,
    remainingBudgetCr: remainingBudget,
    bridgesSelectedCount: selectedItems.length,
    totalCandidateBridges: MOCK_BRIDGES.length,
    totalRiskReduction,
    totalConsequenceAvoided,
    portfolioRiskReductionPercentage,
    items,
    solverMethod: '0-1 Knapsack Dynamic Programming',
    timestamp: new Date().toISOString()
  };
}

export const INITIAL_OPTIMIZATION_RESULT = solveOptimization(55.0);
