import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { bridgeService } from '../services/api/bridgeService';
import { BridgeAsset, ConditionCategory, PriorityLevel, RiskLevel } from '../types/bridge';
import { RiskBadge } from '../components/common/RiskBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { ConditionBadge } from '../components/common/ConditionBadge';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { Search, ArrowUpDown, X, ExternalLink } from 'lucide-react';

export const BridgePortfolioPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [bridges, setBridges] = useState<BridgeAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedAction, setSelectedAction] = useState<string>('All');
  const [sortField, setSortField] = useState<keyof BridgeAsset>('priorityScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Quick Inspection Drawer
  const [inspectedBridge, setInspectedBridge] = useState<BridgeAsset | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bridgeService.getAllBridges();
      setBridges(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load bridge inventory records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync url param if search changes externally
  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null && q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const handleSort = (field: keyof BridgeAsset) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredBridges = useMemo(() => {
    return bridges.filter(b => {
      const matchesSearch = 
        searchQuery === '' ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.featureIntersected.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.county.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRisk = selectedRisk === 'All' || b.riskCategory === selectedRisk;
      const matchesCondition = selectedCondition === 'All' || b.conditionCategory === selectedCondition;
      const matchesPriority = selectedPriority === 'All' || b.priorityLevel === selectedPriority;
      const matchesAction = selectedAction === 'All' || b.recommendedAction === selectedAction;

      return matchesSearch && matchesRisk && matchesCondition && matchesPriority && matchesAction;
    }).sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string') {
        return sortDirection === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }, [bridges, searchQuery, selectedRisk, selectedCondition, selectedPriority, selectedAction, sortField, sortDirection]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedRisk('All');
    setSelectedCondition('All');
    setSelectedPriority('All');
    setSelectedAction('All');
    setSearchParams({});
  };

  if (loading) return <LoadingState message="Loading bridge registry inventory..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              ASSET REGISTRY
            </span>
            <span className="text-xs font-mono text-slate-500">
              Showing {filteredBridges.length} of {bridges.length} structures
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Bridge Asset Portfolio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Comprehensive inventory with NBI structural ratings, modeled risk probabilities, consequence burdens, and deferral status
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetFilters}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, name, route, or river..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Risk:</span>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-md px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Risk Levels</option>
              <option value="Critical">Critical Risk</option>
              <option value="High">High Risk</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>

          {/* Condition Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Condition:</span>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-md px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Conditions</option>
              <option value="Good">Good (7-9)</option>
              <option value="Fair">Fair (5-6)</option>
              <option value="Poor">Poor (4)</option>
              <option value="Critical">Critical (0-3)</option>
            </select>
          </div>

          {/* Priority Level */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-md px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent Intervention</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium</option>
              <option value="Routine">Routine Cycle</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      {filteredBridges.length === 0 ? (
        <EmptyState onReset={resetFilters} />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center gap-1">
                      Bridge ID / Name
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('yearBuilt')}
                  >
                    <div className="flex items-center gap-1">
                      Age / Built
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4">Condition</th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('adt')}
                  >
                    <div className="flex items-center gap-1">
                      Traffic (ADT)
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('modeledRiskScore')}
                  >
                    <div className="flex items-center gap-1">
                      Modeled Risk
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('consequenceScore')}
                  >
                    <div className="flex items-center gap-1">
                      Consequence
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('priorityScore')}
                  >
                    <div className="flex items-center gap-1">
                      Priority Score
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-right cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('estimatedInterventionCostCr')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Cost (Est.)
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4">Deferral Sensitivity</th>
                  <th className="py-3 px-4 text-center">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredBridges.map((bridge) => (
                  <tr 
                    key={bridge.id} 
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                    onClick={() => setInspectedBridge(bridge)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-semibold text-sky-400">{bridge.id}</div>
                      <div className="text-slate-200 font-medium truncate max-w-xs">{bridge.name}</div>
                      <div className="text-slate-400 text-[10px]">{bridge.route} • {bridge.county}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-slate-200">{bridge.ageYears} yrs</div>
                      <div className="text-slate-400 text-[10px]">Built {bridge.yearBuilt}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <ConditionBadge category={bridge.conditionCategory} rating={bridge.condition.overallCondition} />
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-slate-200">{bridge.adt.toLocaleString()} ADT</div>
                      <div className="text-slate-400 text-[10px]">{bridge.adttPercent}% Trucks</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge level={bridge.riskCategory} score={bridge.modeledRiskScore} />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-200">
                      {bridge.consequenceScore.toFixed(1)}/100
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge level={bridge.priorityLevel} score={bridge.priorityScore} />
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-100">
                      ₹{bridge.estimatedInterventionCostCr.toFixed(1)} Cr
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                        bridge.deferralSensitivity === 'High deferral sensitivity'
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-800'
                          : bridge.deferralSensitivity === 'Prioritize before deferral'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {bridge.deferralSensitivity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/bridges/${bridge.id}`);
                        }}
                        className="p-1.5 rounded bg-slate-800 hover:bg-sky-600 hover:text-white text-slate-300 border border-slate-700 transition-colors"
                        title="View Complete Engineering Dossier"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Inspection Drawer / Modal */}
      {inspectedBridge && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-900 border-l border-slate-800 p-6 shadow-2xl z-40 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400">QUICK ASSET PREVIEW</span>
                <h3 className="text-base font-bold font-mono text-sky-400">{inspectedBridge.id}</h3>
              </div>
              <button 
                onClick={() => setInspectedBridge(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-semibold text-slate-100 text-sm">{inspectedBridge.name}</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">{inspectedBridge.route} • {inspectedBridge.featureIntersected}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 rounded bg-slate-950/80 border border-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px]">Condition</span>
                  <div className="mt-1">
                    <ConditionBadge category={inspectedBridge.conditionCategory} rating={inspectedBridge.condition.overallCondition} />
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Priority</span>
                  <div className="mt-1">
                    <PriorityBadge level={inspectedBridge.priorityLevel} score={inspectedBridge.priorityScore} />
                  </div>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">NBI Component Breakdown (0-9):</span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-400">Deck</div>
                    <div className="text-sm font-bold text-slate-200">{inspectedBridge.condition.deck}/9</div>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-400">Super</div>
                    <div className="text-sm font-bold text-slate-200">{inspectedBridge.condition.superstructure}/9</div>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-400">Sub</div>
                    <div className="text-sm font-bold text-slate-200">{inspectedBridge.condition.substructure}/9</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Traffic Exposure:</span>
                  <span className="font-mono text-slate-200">{inspectedBridge.adt.toLocaleString()} ADT ({inspectedBridge.adttPercent}% Trucks)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bypass Detour Length:</span>
                  <span className="font-mono text-slate-200">{inspectedBridge.detourLengthKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Intervention Cost Est:</span>
                  <span className="font-mono font-bold text-sky-400">₹{inspectedBridge.estimatedInterventionCostCr} Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">2-Year Deferral Cost Multiplier:</span>
                  <span className="font-mono font-bold text-rose-400">{inspectedBridge.costOfDelayMultiplier2Year}x</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Recommended Action</span>
                <p className="font-medium text-slate-200">{inspectedBridge.recommendedAction}</p>
                <p className="text-[11px] text-slate-400 mt-1">{inspectedBridge.deferralNarrative}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => navigate(`/bridges/${inspectedBridge.id}`)}
              className="w-full py-2.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2"
            >
              Open Full Engineering Detail Dossier
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
