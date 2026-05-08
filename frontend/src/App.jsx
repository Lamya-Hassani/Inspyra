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
import IntroAnimation from './components/IntroAnimation';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import PlantManagement from './pages/admin/PlantManagement';
import UserManagement from './pages/admin/UserManagement';
import OrderManagement from './pages/admin/OrderManagement';

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
  const [showIntro, setShowIntro] = useState(true);

  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
          <Router>
            <Toaster position="bottom-right" toastOptions={{
              style: {
                background: 'rgba(39, 77, 0, 0.95)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '2rem',
                color: '#ffffff',
                fontWeight: '900',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                padding: '16px 24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              },
              success: {
                iconTheme: {
                  primary: '#92B061',
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
                <Route path="/admin/orders" element={<AdminLayout><OrderManagement /></AdminLayout>} />
                <Route path="/admin/users" element={<AdminLayout><UserManagement /></AdminLayout>} />
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
