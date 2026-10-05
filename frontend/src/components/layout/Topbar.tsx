import React from 'react';
import { Search, Bell, Activity, Database, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  onSearch?: (query: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (onSearch) {
        onSearch(searchTerm);
      }
      navigate(`/bridges?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between z-20 shrink-0 sticky top-0">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative w-72 md:w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by Bridge ID, Route, Feature..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-950/80 border border-slate-800 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
        />
      </form>

      {/* Right Controls & Environment Indicators */}
      <div className="flex items-center gap-4">
        {/* Verification Status Badge */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs">
          <Database className="w-3.5 h-3.5" />
          <span className="font-mono text-[11px] font-semibold">SIMULATION DATASET</span>
        </div>

        {/* Engine Status */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 border-l border-slate-800 pl-4">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[11px]">OPTIMIZER ONLINE</span>
        </div>

        {/* Notification Alert */}
        <button 
          aria-label="System notifications"
          className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 relative transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1 right-1" />
        </button>

        {/* User / Persona Indicator */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-medium text-slate-200 leading-tight">Infrastructure Authority</p>
            <p className="text-[10px] text-slate-400 font-mono">Lead Maintenance Planner</p>
          </div>
        </div>
      </div>
    </header>
  );
};
