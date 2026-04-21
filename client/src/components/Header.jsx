import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { cartCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-display text-xl font-semibold tracking-wide">
            NOIR & CO.
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-muted hover:text-accent transition-colors">Home</Link>
            <Link to="/shop" className="text-muted hover:text-accent transition-colors">Shop</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-muted hover:text-accent transition-colors">Admin</Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded hover:bg-border transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded hover:bg-border transition-colors relative"
              aria-label="Open cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2 rounded hover:bg-border transition-colors"
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
        <div className="md:hidden bg-surface border-t border-border">
          <nav className="flex flex-col p-4 space-y-4">
            <Link to="/" className="text-muted hover:text-accent" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/shop" className="text-muted hover:text-accent" onClick={() => setMenuOpen(false)}>Shop</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-muted hover:text-accent" onClick={() => setMenuOpen(false)}>Admin</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;