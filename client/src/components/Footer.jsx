import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">NOIR & CO.</h3>
            <p className="text-muted text-sm">
              Elevating everyday style with timeless pieces crafted for those who dress with intent.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/shop" className="text-muted hover:text-accent text-sm">Shop All</Link>
              <Link to="/track-order" className="text-muted hover:text-accent text-sm">Track Order</Link>
              <Link to="/cart" className="text-muted hover:text-accent text-sm">Cart</Link>
              <Link to="/admin/login" className="text-muted hover:text-accent text-sm">Admin</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-muted text-sm">hello@noirandco.com</p>
            <p className="text-muted text-sm">+1 (555) 123-4567</p>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-muted text-sm">
          <p>&copy; {new Date().getFullYear()} NOIR & CO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;