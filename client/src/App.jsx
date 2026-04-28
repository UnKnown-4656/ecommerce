import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import { useCart } from './context/CartContext';

// Lazy-load all page components for performance with error boundaries
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage'));
const TrackOrderPage = lazy(() => import('./pages/TrackOrderPage'));
// Admin pages - separate chunk for non-admin users
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminOrdersPage = lazy(() => import('./pages/AdminOrdersPage'));
const AdminProductsPage = lazy(() => import('./pages/AdminProductsPage'));
const AdminAddProductPage = lazy(() => import('./pages/AdminAddProductPage'));
const AdminEditProductPage = lazy(() => import('./pages/AdminEditProductPage'));

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-[calc(100vh-80px)]"
    >
      {children}
    </motion.div>
  );
};

const PageLoader = () => (
  <div className="fixed inset-0 z-[100] bg-bg flex items-center justify-center">
    <div className="w-8 h-8 border border-accent border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  const location = useLocation();
  const { isCartOpen, setIsCartOpen } = useCart();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            setScrollProgress((window.scrollY / totalHeight) * 100);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-bg text-text font-sans selection:bg-accent/30 selection:text-accent">
      {/* Scroll Progress Bar */}
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      />

      <Header onOpenCart={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Toast />

      <main className="pt-20">
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

export default App;