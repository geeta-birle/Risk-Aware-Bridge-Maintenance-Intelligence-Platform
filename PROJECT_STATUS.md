# Project Status: Risk-Aware Infrastructure Maintenance Decision Engine

**Platform:** Bridge Maintenance Intelligence Platform  
**System Role:** Explainable decision-support platform for prioritizing bridge maintenance under limited budgets  
**Current Phase:** Phase 14.1 COMPLETED – Frontend Small Polish Pass (Typography, Light/Dark Toggle, Sidebar, Usability)  
**Last Updated:** 2026-10-05  

---

## 1. Executive Summary & Progress Tracker
The UI-First milestone and subsequent **Small Polish Pass** have been successfully executed and verified. The frontend retains 100% of its existing layout, page structure, routing, components, and mock data contracts while benefiting from soft typography, seamless theme persistence, and ergonomic improvements.

| Phase | Description | Status | Implementation Notes |
|---|---|---|---|
| **Phase 0** | Workspace & Environment Audit | **COMPLETED** | Verified clean directory, Node v24, npm 11, Python 3.9. |
| **Phase 1** | Project & UI Specifications | **COMPLETED** | Created `PROJECT_SPECIFICATION.md` and `UI_SPECIFICATION.md` in `docs/`. |
| **Phase 2** | Frontend Bootstrapping & Tokens | **COMPLETED** | Initialized Vite + React + TS, configured Tailwind with engineering dark theme palette. |
| **Phase 3** | Typed Mock Contracts & Services | **COMPLETED** | Data models in `src/types/` (`bridge.ts`, `optimization.ts`, `deferral.ts`, etc.) and isolated services in `src/services/api/`. |
| **Phase 4** | Application Shell | **COMPLETED** | Responsive collapsible `Sidebar`, sticky `Topbar` with search, simulation badge, and role avatar. |
| **Phase 5** | Screen 1: Overview Dashboard | **COMPLETED** | Top 5 KPI cards, risk distribution chart, capital allocation progress, urgent deferral alerts, top priority table. |
| **Phase 6** | Screen 2: Bridge Portfolio | **COMPLETED** | Multi-attribute search, filters (Risk, Condition, Priority, Action), sortable columns, quick-inspect drawer. |
| **Phase 7** | Screen 3: Bridge Detail Dossier | **COMPLETED** | Sections A–E: Physical profile, NBI component health (0–9), dual-axis historical trend, risk attribution (SHAP-style), network detour, cost-of-delay. |
| **Phase 8** | Screen 4: Priority Ranking | **COMPLETED** | 1 to N ranked matrix with interactive attribution inspector showing exact formula weight contributions. |
| **Phase 9** | Screen 5: Budget Optimization | **COMPLETED** | Real-time 0-1 Knapsack solver, dynamic budget slider (₹15–₹120 Cr), preset scenarios, funded vs deferred itemized tables. |
| **Phase 10**| Screen 6: Deferral Intelligence | **COMPLETED** | Multi-horizon trajectory chart (Current, +1 Yr, +2 Yrs), sensitivity classifications, delay cost escalation. |
| **Phase 11**| Screen 7: Network Impact | **COMPLETED** | Interactive GIS/spatial SVG map with coordinate normalization, route connectivity, emergency trauma centers, detour burdens. |
| **Phase 12**| Screen 8: Analytics & Baselines | **COMPLETED** | Head-to-head empirical comparison (Risk-Aware Optimization vs Worst-Condition-First vs Traffic Heuristic), validation metrics. |
| **Phase 13**| Screen 9: Methodology | **COMPLETED** | 8-step visual end-to-end pipeline, LaTeX-style mathematical formulations, data source boundaries (NBI core vs optional GIS/CV). |
| **Phase 14**| Screen 10: Settings | **COMPLETED** | Decision weight calibration sliders ($w_1, w_2, w_3, w_4$), sum-to-1.0 normalization validator, currency and horizon toggles. |
| **Phase 14.1**| Frontend Small Polish Pass | **COMPLETED** | Softer typography (Manrope/Inter), Light/Dark theme toggle with localStorage persistence, active sidebar indicator, drawer Escape listener, table sort arrows. |
| **Phase 15**| NBI Data Ingestion Pipeline | **NEXT UP** | Inspecting authentic FHWA NBI records, schema extraction, and missing value profiling. |
| **Phase 16+**| ML Deterioration & Risk Engine | **SCHEDULED** | Baseline models, longitudinal Markov/GBDT deterioration models, FastAPI backend integration. |

---

## 2. Key Architectural Decisions & Polish Pass Enhancements
1. **Softer Typography**:
   - Introduced `Manrope` as the primary sans font, with `Inter` fallback and `JetBrains Mono` for engineering metrics.
   - Preserves exact font sizes, line heights, bounding boxes, and component alignments.
2. **Light / Dark Mode Persistence**:
   - Implemented `ThemeContext` storing selected preference (`light` or `dark`) in `localStorage` under `bridge_intel_theme`.
   - Utilizes CSS custom property tokens in `index.css` mapped dynamically to Tailwind's slate palette, providing natural contrast in light mode and preserving the dark baseline.
   - Sun/Moon icon toggle added cleanly to Topbar.
3. **Ergonomic Usability Fixes**:
   - Added `Escape` key and backdrop-click handlers to close the Bridge Portfolio quick-preview drawer.
   - Added clearer sorting indicators (`ArrowUp` when ascending, `ArrowDown` when descending, subtle `ArrowUpDown` when idle).
   - Added instant search clear button (`X`) when a query is entered in Topbar.
   - Added accessible labels (`aria-label`, `title`) across all icon buttons and interactive controls.
   - Verified "Reset to Default" button on Settings page with confirmation feedback.

---

## 3. Persistent Project Memory: Next Exact Task
- **Phase 15**: Begin backend data ingestion planning for authentic FHWA National Bridge Inventory (NBI) data.
- The UI structure is now **FROZEN** and ready for backend connectivity.
