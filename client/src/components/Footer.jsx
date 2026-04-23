import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-bg border-t border-border">
      <div className="max-w-container mx-auto px-6 md:px-12 py-20 md:py-32">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          <div className="lg:col-span-2">
            <Link to="/" className="font-display text-2xl tracking-[0.2em] text-text hover:text-accent transition-colors duration-300">
              NOIR & CO.
            </Link>
            <p className="font-sans text-sm text-muted leading-relaxed mt-6 max-w-sm">
              Elevating everyday style with timeless pieces crafted for those who dress with intent.
            </p>
            <div className="flex items-center gap-4 mt-8">
              {['instagram', 'twitter', 'pinterest'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 border border-border flex items-center justify-center text-muted hover:border-accent hover:text-accent transition-all duration-300"
                >
                  <span className="text-xs uppercase tracking-wider">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-muted mb-6">
              Navigation
            </p>
            <nav className="flex flex-col gap-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/shop', label: 'Shop' },
                { to: '/track-order', label: 'Track Order' },
                { to: '/cart', label: 'Cart' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="font-sans text-sm text-muted hover:text-accent transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-muted mb-6">
              Contact
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:hello@noirandco.com"
                className="font-sans text-sm text-muted hover:text-accent transition-colors duration-300"
              >
                hello@noirandco.com
              </a>
              <p className="font-sans text-sm text-muted">
                +1 (555) 123-4567
              </p>
            </div>
            <div className="mt-8">
              <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-muted mb-4">
                Newsletter
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="input-luxury flex-1 text-sm"
                />
                <button className="px-4 bg-accent text-bg hover:bg-accent-hover transition-colors duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-muted">
              &copy; {new Date().getFullYear()} NOIR & CO. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="font-sans text-[10px] tracking-[0.15em] uppercase text-muted hover:text-accent transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="font-sans text-[10px] tracking-[0.15em] uppercase text-muted hover:text-accent transition-colors duration-300">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;