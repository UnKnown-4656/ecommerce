import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import TrackOrderPage from './pages/TrackOrderPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminAddProductPage from './pages/AdminAddProductPage';
import AdminEditProductPage from './pages/AdminEditProductPage';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import CustomCursor from './components/CustomCursor';
import { useCart } from './context/CartContext';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

function App() {
  const location = useLocation();
  const { isCartOpen, setIsCartOpen } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-bg text-text font-sans selection:bg-accent/30 selection:text-accent">
      <CustomCursor />
      <Header onOpenCart={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Toast />
      
      <main className="pt-20">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/shop" element={<PageTransition><ShopPage /></PageTransition>} />
            <Route path="/product/:id" element={<PageTransition><ProductDetailPage /></PageTransition>} />
            <Route path="/cart" element={<PageTransition><CartPage /></PageTransition>} />
            <Route path="/checkout" element={<PageTransition><CheckoutPage /></PageTransition>} />
            <Route path="/order-success" element={<PageTransition><OrderSuccessPage /></PageTransition>} />
            <Route path="/order/:id" element={<PageTransition><OrderTrackingPage /></PageTransition>} />
            <Route path="/track-order" element={<PageTransition><TrackOrderPage /></PageTransition>} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<PageTransition><AdminLoginPage /></PageTransition>} />
            <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
            <Route path="/admin/orders" element={<PageTransition><AdminOrdersPage /></PageTransition>} />
            <Route path="/admin/products" element={<PageTransition><AdminProductsPage /></PageTransition>} />
            <Route path="/admin/products/add" element={<PageTransition><AdminAddProductPage /></PageTransition>} />
            <Route path="/admin/products/edit/:id" element={<PageTransition><AdminEditProductPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default App;