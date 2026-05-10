import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import AdminLayout from './components/admin/AdminLayout';
import ClientLayout from './components/layout/ClientLayout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import PlantManagement from './pages/admin/PlantManagement';
import CategoryManagement from './pages/admin/categories/CategoryManagementPage';
import UserManagement from './pages/admin/UserManagement';
import OrderManagement from './pages/admin/OrderManagement';
import PreferenceManagement from './pages/admin/PreferenceManagement';
import AdminProfile from './pages/admin/AdminProfile';

// Client Pages
import LandingPage from './pages/LandingPage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import PaymentPage from './pages/PaymentPage';
import SupportPage from './pages/SupportPage';
import PlantFinder from './pages/PlantFinder';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <Toaster position="bottom-right" toastOptions={{
              style: {
                background: '#ffffff',
                border: '1px solid #f3f4f6',
                borderRadius: '8px',
                color: '#111827',
                fontWeight: '600',
                fontSize: '14px',
                padding: '12px 20px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#274d00',
                  secondary: '#fff',
                },
              },
            }} />
            <Routes>
              {/* CLIENT PUBLIC ROUTES */}
              <Route
                path="/"
                element={
                  <ClientLayout mainClassName="pt-0"> {/* Changed from default pt-24 */}
                    <LandingPage />
                  </ClientLayout>
                }
              />
              <Route path="/shop" element={<ClientLayout><ShopPage /></ClientLayout>} />
              <Route path="/product/:id" element={<ClientLayout><ProductDetailPage /></ClientLayout>} />
              <Route path="/wishlist" element={<ClientLayout><WishlistPage /></ClientLayout>} />
              <Route path="/support" element={<ClientLayout><SupportPage /></ClientLayout>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* CLIENT PROTECTED ROUTES */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ClientLayout><ProfilePage /></ClientLayout>} />
                <Route path="/plant-finder" element={<ClientLayout><PlantFinder /></ClientLayout>} />
                <Route path="/checkout" element={<ClientLayout><PaymentPage /></ClientLayout>} />
              </Route>

              {/* SECURE ADMIN ROUTES */}
              <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']} />}>
                <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
                <Route path="/admin/plants" element={<AdminLayout><PlantManagement /></AdminLayout>} />
                <Route path="/admin/categories" element={<AdminLayout><CategoryManagement /></AdminLayout>} />
                <Route path="/admin/orders" element={<AdminLayout><OrderManagement /></AdminLayout>} />
                <Route path="/admin/users" element={<AdminLayout><UserManagement /></AdminLayout>} />
                <Route path="/admin/preferences" element={<AdminLayout><PreferenceManagement /></AdminLayout>} />
                <Route path="/admin/profile" element={<AdminLayout><AdminProfile /></AdminLayout>} />
              </Route>

              {/* FALLBACK */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
