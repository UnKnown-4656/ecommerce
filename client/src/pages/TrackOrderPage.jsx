import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const TrackOrderPage = () => {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      // Trim input to remove any accidental whitespace
      const trimmedEmail = email.trim();
      
      const response = await api.get(`/orders/track?email=${encodeURIComponent(trimmedEmail)}`);
      setOrders(response.data);
    } catch (err) {
      setError('Unable to find orders. Please check your email address.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    Pending: { bg: '#C9A94020', color: '#C9A96E', border: '#C9A96E' },
    Shipped: { bg: '#5A7EC920', color: '#7EA8E9', border: '#5A7EC9' },
    Delivered: { bg: '#5A9E6F20', color: '#7ABE8F', border: '#5A9E6F' }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-muted mb-4">Customer Care</p>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-text">Track Your Order</h1>
      </motion.div>
      
      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        onSubmit={handleSubmit} 
        className="max-w-md mx-auto mb-20"
      >
        <div className="space-y-8">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-muted mb-4">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              required
              className="w-full px-0 py-4 border-0 border-b border-border bg-transparent focus:outline-none focus:border-accent transition-colors duration-300 text-text placeholder:text-muted/30"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Searching...' : 'Track Orders'}
          </button>
        </div>
      </motion.form>

      {error && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-accent mb-8 font-sans text-sm"
        >
          {error}
        </motion.p>
      )}

      {searched && orders.length === 0 && !loading && !error && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-muted italic font-display text-xl"
        >
          No orders found for this email address.
        </motion.p>
      )}

       {orders.length > 0 && (
         <div className="space-y-8">
           {orders.map((order, index) => {
             const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items);
            const status = statusColors[order.status] || statusColors.Pending;
            return (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group border border-border bg-surface/30 backdrop-blur-sm p-8 hover:border-accent/30 transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-accent text-lg tracking-wider">Order #{order.id}</span>
                      <span 
                        className="inline-flex px-3 py-1 text-[9px] uppercase tracking-[0.2em]"
                        style={{ backgroundColor: status.bg, color: status.color, border: `1px solid ${status.border}` }}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-muted text-[11px] uppercase tracking-widest">
                      Placed on {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <p className="text-muted text-[10px] uppercase tracking-[0.2em] mb-1">Total Amount</p>
                    <span className="font-mono text-2xl text-accent">${order.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="border-t border-b border-border/50 py-6 my-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-4">{items.length} item(s)</p>
                  <div className="space-y-3">
                    {items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <p className="text-sm text-text/80">{item.name} <span className="text-muted ml-2">× {item.quantity}</span></p>
                        <p className="font-mono text-sm text-accent">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Link 
                    to={`/order/${order.id}`} 
                    className="group/link flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-accent hover:text-accent-hover transition-colors"
                  >
                    View Full Details
                    <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrackOrderPage;
