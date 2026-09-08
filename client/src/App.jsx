import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import MarketplacePage from './pages/MarketplacePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';

// Farmer pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import MyProducePage from './pages/farmer/MyProducePage';
import AddProducePage from './pages/farmer/AddProducePage';
import FarmerOrdersPage from './pages/farmer/FarmerOrdersPage';
import DemandForecastPage from './pages/farmer/DemandForecastPage';
import FarmerEarningsPage from './pages/farmer/FarmerEarningsPage';

// Buyer pages
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import BuyerOrdersPage from './pages/buyer/BuyerOrdersPage';

// Logistics pages
import LogisticsDashboard from './pages/logistics/LogisticsDashboard';
import DeliveryOrdersPage from './pages/logistics/DeliveryOrdersPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import SupplyDemandPage from './pages/admin/SupplyDemandPage';
import ImpactPage from './pages/admin/ImpactPage';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/marketplace/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Route>

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />

          {/* Farmer dashboard */}
          <Route path="/farmer" element={<DashboardLayout />}>
            <Route index element={<FarmerDashboard />} />
            <Route path="produce" element={<MyProducePage />} />
            <Route path="add-produce" element={<AddProducePage />} />
            <Route path="orders" element={<FarmerOrdersPage />} />
            <Route path="forecast" element={<DemandForecastPage />} />
            <Route path="earnings" element={<FarmerEarningsPage />} />
          </Route>

          {/* Buyer dashboard */}
          <Route path="/buyer" element={<DashboardLayout />}>
            <Route index element={<BuyerDashboard />} />
            <Route path="orders" element={<BuyerOrdersPage />} />
          </Route>

          {/* Logistics dashboard */}
          <Route path="/logistics" element={<DashboardLayout />}>
            <Route index element={<LogisticsDashboard />} />
            <Route path="routes" element={<LogisticsDashboard />} />
            <Route path="deliveries" element={<DeliveryOrdersPage />} />
          </Route>

          {/* Admin dashboard */}
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="analytics" element={<AdminDashboard />} />
            <Route path="supply-demand" element={<SupplyDemandPage />} />
            <Route path="impact" element={<ImpactPage />} />
            <Route path="orders" element={<BuyerOrdersPage />} />
            <Route path="users" element={<AdminDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
