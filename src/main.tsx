import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import Home from './pages/Home';
import './index.css';

const GrowthCalculator = lazy(() => import('./pages/GrowthCalculator'));
const CagrCalculator = lazy(() => import('./pages/CagrCalculator'));
const RentVsBuy = lazy(() => import('./pages/RentVsBuy'));
const RetirementCalculator = lazy(() => import('./pages/RetirementCalculator'));
const Funds = lazy(() => import('./pages/Funds'));
const Methodology = lazy(() => import('./pages/Methodology'));
const About = lazy(() => import('./pages/About'));

const page = (el: React.ReactNode) => (
  <Suspense fallback={<div className="py-20 text-center text-muted">Loading…</div>}>{el}</Suspense>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="growth" element={page(<GrowthCalculator />)} />
          <Route path="cagr" element={page(<CagrCalculator />)} />
          <Route path="rent-vs-buy" element={page(<RentVsBuy />)} />
          <Route path="retirement" element={page(<RetirementCalculator />)} />
          <Route path="funds" element={page(<Funds />)} />
          <Route path="methodology" element={page(<Methodology />)} />
          <Route path="about" element={page(<About />)} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
);
