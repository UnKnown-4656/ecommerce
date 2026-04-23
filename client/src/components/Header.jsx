import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { cartCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-md bg-[rgba(10,10,10,0.85)] border-b border-[#1a1a1a] py-3' : 'bg-[rgba(10,10,10,0.85)] backdrop-blur-md border-b border-[#1a1a1a] py-6'}`}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-serif tracking-[0.15em] text-[1.1rem]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            NOIR & CO.
          </Link>

          <nav className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-[11px] tracking-[0.18em] uppercase text-[#666] hover:text-[#e8e0d4] transition-colors duration-300">Home</Link>
            <Link to="/shop" className="text-[11px] tracking-[0.18em] uppercase text-[#666] hover:text-[#e8e0d4] transition-colors duration-300">Shop</Link>
            <Link to="/track-order" className="text-[11px] tracking-[0.18em] uppercase text-[#666] hover:text-[#e8e0d4] transition-colors duration-300">Track Order</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-[11px] tracking-[0.18em] uppercase text-[#666] hover:text-[#e8e0d4] transition-colors duration-300">Admin</Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded hover:bg-[#1a1a1a] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded hover:bg-[#1a1a1a] transition-colors relative"
              aria-label="Open cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#b8922e] text-black text-xs rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2 rounded hover:bg-[#1a1a1a] transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#0a0a0a] z-50 flex flex-col items-center justify-center space-y-8">
          <button
            className="absolute top-4 right-4 p-2"
            onClick={() => setMenuOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <Link to="/" className="font-serif text-2xl" onClick={() => setMenuOpen(false)} style={{ fontFamily: 'Cormorant Garamond, serif' }}>Home</Link>
          <Link to="/shop" className="font-serif text-2xl" onClick={() => setMenuOpen(false)} style={{ fontFamily: 'Cormorant Garamond, serif' }}>Shop</Link>
          <Link to="/track-order" className="font-serif text-2xl" onClick={() => setMenuOpen(false)} style={{ fontFamily: 'Cormorant Garamond, serif' }}>Track Order</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="font-serif text-2xl" onClick={() => setMenuOpen(false)} style={{ fontFamily: 'Cormorant Garamond, serif' }}>Admin</Link>
          )}
        </div>
      )}
    </motion.header>
  );
};

export default Header;
