import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { optimizationService } from '../services/api/optimizationService';
import { OptimizationPortfolioResult, BudgetScenario } from '../types/optimization';
import { KpiCard } from '../components/common/KpiCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { KnapsackAllocationChart } from '../components/charts/KnapsackAllocationChart';
import { 
  Wallet, 
  CheckCircle2, 
  XCircle, 
  Sliders, 
  TrendingDown, 
  ShieldCheck, 
  Layers
} from 'lucide-react';

export const BudgetOptimizationPage: React.FC = () => {
  const navigate = useNavigate();
  const [budgetCr, setBudgetCr] = useState<number>(55.0);
  const [result, setResult] = useState<OptimizationPortfolioResult | null>(null);
  const [scenarios, setScenarios] = useState<BudgetScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [solving, setSolving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [scenList, initOpt] = await Promise.all([
        optimizationService.getScenarios(),
        optimizationService.getInitialOptimization()
      ]);
      setScenarios(scenList);
      setResult(initOpt);
    } catch (err: any) {
      setError(err?.message || "Failed to initialize optimization solver");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  const handleBudgetChange = async (newBudget: number) => {
    setBudgetCr(newBudget);
    setSolving(true);
    try {
      const opt = await optimizationService.runOptimization(newBudget);
      setResult(opt);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSolving(false);
    }
  };

  if (loading) return <LoadingState message="Initializing 0-1 Knapsack Multi-Objective Optimizer..." />;
  if (error || !result) return <ErrorState message={error || "Solver error"} onRetry={initData} />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
              CONSTRAINED RESOURCE ALLOCATION
            </span>
            <span className="text-xs font-mono text-slate-500">SOLVER: 0-1 KNAPSACK MULTI-OBJECTIVE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Maintenance Budget Optimization
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Maximize aggregate portfolio risk reduction and consequence avoidance subject to available capital budget ceiling
          </p>
        </div>
      </div>

      {/* Interactive Scenario Controls Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              Appropriation Budget Ceiling
            </h3>
            <p className="text-xs text-slate-400">
              Slide or choose a predefined fiscal scenario to dynamically trigger Pareto-optimal knapsack allocation
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {scenarios.map((scen) => (
              <button
                key={scen.id}
                onClick={() => handleBudgetChange(scen.budgetCr)}
                className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                  budgetCr === scen.budgetCr
                    ? 'bg-sky-600 text-white border-sky-500 shadow-sm'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {scen.name}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Slider */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Available Budget Range (₹15 Cr — ₹120 Cr):</span>
            <span className="font-mono text-lg font-bold text-sky-400">
              ₹{budgetCr.toFixed(1)} Crores
            </span>
          </div>
          <input
            type="range"
            min="15"
            max="120"
            step="2.5"
            value={budgetCr}
            onChange={(e) => handleBudgetChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-500 border border-slate-800"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>₹15 Cr (Austerity)</span>
            <span>₹55 Cr (Baseline Target)</span>
            <span>₹90 Cr (Expanded)</span>
            <span>₹120 Cr (Full Backlog Liquidation)</span>
          </div>
        </div>
      </div>

      {/* Solver Outcome KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Allocated Capital"
          value={`₹${result.totalAllocatedCr.toFixed(1)} Cr`}
          subtitle={`Under ₹${result.budgetLimitCr.toFixed(1)} Cr limit`}
          icon={Wallet}
          accentColor="brand"
        />
        <KpiCard
          title="Contingency Reserve"
          value={`₹${result.remainingBudgetCr.toFixed(1)} Cr`}
          subtitle="Unallocated buffer"
          icon={CheckCircle2}
          accentColor="slate"
        />
        <KpiCard
          title="Funded Bridges"
          value={`${result.bridgesSelectedCount} / ${result.totalCandidateBridges}`}
          subtitle={`${result.totalCandidateBridges - result.bridgesSelectedCount} bridges deferred`}
          icon={Layers}
          accentColor="emerald"
        />
        <KpiCard
          title="Risk Reduction"
          value={`${result.totalRiskReduction.toFixed(0)} pts`}
          subtitle={`${result.portfolioRiskReductionPercentage}% of portfolio vulnerability`}
          icon={TrendingDown}
          accentColor="emerald"
        />
        <KpiCard
          title="Avoided Consequence"
          value={`${result.totalConsequenceAvoided.toFixed(0)} pts`}
          subtitle="Public/detour burden avoided"
          icon={ShieldCheck}
          accentColor="brand"
        />
      </div>

      {/* Allocation Visual and Decision Plan Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Knapsack Visual breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Capital Plan Utilization</h3>
            <p className="text-xs text-slate-400 mt-0.5">Budget efficiency and allocation partition</p>
            <KnapsackAllocationChart 
              allocatedCr={result.totalAllocatedCr} 
              remainingCr={result.remainingBudgetCr} 
            />
          </div>

          <div className="p-3 bg-slate-950/80 rounded border border-slate-800 text-xs space-y-2 mt-4 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Budget Limit:</span>
              <span className="text-slate-200">₹{result.budgetLimitCr.toFixed(1)} Cr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Funded Interventions:</span>
              <span className="text-sky-400 font-bold">₹{result.totalAllocatedCr.toFixed(1)} Cr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Reserve Balance:</span>
              <span className="text-slate-400">₹{result.remainingBudgetCr.toFixed(1)} Cr</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-800">
              <span className="text-slate-400">Algorithm Status:</span>
              <span className="text-emerald-400 font-bold">Optimal Solution Found</span>
            </div>
          </div>
        </div>

        {/* Selected vs Deferred Bridges Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Optimized Action Plan</h3>
              <p className="text-xs text-slate-400 mt-0.5">Candidates selected based on Benefit-to-Cost Ratio (BCR)</p>
            </div>
            {solving && (
              <span className="text-xs font-mono text-sky-400 animate-pulse">Solving...</span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Bridge ID / Corridor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4 text-right">Cost</th>
                  <th className="py-3 px-4 text-center">Risk Delta</th>
                  <th className="py-3 px-4 text-center">BCR Ratio</th>
                  <th className="py-3 px-4 text-center">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {result.items.map((item) => {
                  const b = item.bridge;
                  return (
                    <tr 
                      key={b.id}
                      className={item.selected ? 'bg-sky-950/20 hover:bg-sky-950/30' : 'bg-slate-950/40 opacity-75 hover:opacity-100'}
                    >
                      <td className="py-3 px-4">
                        {item.selected ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            FUNDED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700 text-[11px]">
                            <XCircle className="w-3.5 h-3.5" />
                            DEFERRED
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono font-semibold text-slate-200">{b.id}</div>
                        <div className="text-slate-400 text-[11px] truncate max-w-xs">{b.name}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-medium">
                        {b.recommendedAction}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-200">
                        ₹{b.estimatedInterventionCostCr.toFixed(1)} Cr
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-emerald-400 font-bold">
                        -{b.expectedRiskReductionScore}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-sky-400 font-semibold">
                        {item.benefitCostRatio}x
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => navigate(`/bridges/${b.id}`)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-[11px]"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
