import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/track-order', label: 'Track Order' },
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-bg/80 backdrop-blur-md border-b border-border/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-20 md:h-24">
            <Link
              to="/"
              className="font-display text-xl md:text-2xl tracking-[0.25em] text-text hover:text-accent transition-colors duration-300"
            >
              NOIR & CO.
            </Link>

            <nav className="hidden lg:flex items-center gap-12">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="nav-link text-[10px] tracking-[0.2em] uppercase text-muted hover:text-text transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-6 md:gap-8">
              {user && (
                <button
                  onClick={handleLogout}
                  className="hidden md:block text-[10px] tracking-[0.15em] uppercase text-muted hover:text-accent transition-colors duration-300"
                >
                  Logout
                </button>
              )}

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 group"
                aria-label="Open cart"
              >
                <svg
                  className="w-5 h-5 text-muted group-hover:text-accent transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-bg text-[10px] font-medium rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>

              <button
                className="lg:hidden p-2"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <div className="w-5 flex flex-col gap-1.5">
                  <span
                    className={`block h-px bg-text transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
                  />
                  <span
                    className={`block h-px bg-text transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}
                  />
                  <span
                    className={`block h-px bg-text transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-bg z-40 flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-3xl text-text hover:text-accent transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;