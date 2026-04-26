import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
      const trimmedEmail = email.trim().toLowerCase();
      const response = await api.get(`/orders/track?email=${encodeURIComponent(trimmedEmail)}`);
      setOrders(response.data);
    } catch (err) {
      setError('Unable to find orders. Please check your email address and try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    Pending:   { bg: 'rgba(201,169,64,0.12)', color: '#C9A96E', border: '#C9A96E', icon: '⏳', step: 1 },
    Confirmed: { bg: 'rgba(201,169,64,0.12)', color: '#C9A96E', border: '#C9A96E', icon: '✓',  step: 2 },
    Processing:{ bg: 'rgba(201,169,64,0.12)', color: '#C9A96E', border: '#C9A96E', icon: '⚡', step: 2 },
    Shipped:   { bg: 'rgba(90,126,201,0.12)', color: '#7EA8E9', border: '#5A7EC9', icon: '🚚', step: 3 },
    Delivered: { bg: 'rgba(90,158,111,0.12)', color: '#7ABE8F', border: '#5A9E6F', icon: '📦', step: 4 },
  };

  const steps = ['Ordered', 'Confirmed', 'Shipped', 'Delivered'];

  const getStepIndex = (status) => {
    const config = statusConfig[status];
    return config ? config.step : 1;
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-surface/30 border-b border-border">
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(184,146,46,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(184,146,46,0.1),transparent_50%)]" />
        </div>
        <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-accent/40" />
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-muted">Customer Care</p>
              <div className="h-px w-8 bg-accent/40" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-text mb-4">
              Track Your <span className="italic text-accent">Order</span>
            </h1>
            <p className="font-sans text-sm text-muted max-w-md mx-auto">
              Enter the email address used during checkout to view all your orders and their current status.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
        {/* Search Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto mb-16"
        >
          <div className="relative">
            <div className="flex items-center border border-border bg-surface/30 backdrop-blur-sm focus-within:border-accent transition-all duration-300 overflow-hidden">
              <div className="pl-5 pr-3 text-muted">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-2 py-5 bg-transparent focus:outline-none text-text placeholder:text-muted/30 text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-5 bg-accent text-bg text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-accent-hover transition-colors duration-300 disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Searching
                  </span>
                ) : 'Track'}
              </button>
            </div>
          </div>
        </motion.form>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-lg mx-auto mb-10 p-5 border border-red-500/20 bg-red-500/5 text-center"
            >
              <p className="font-sans text-sm text-red-400">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence>
          {searched && orders.length === 0 && !loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto mb-6 border border-border rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="font-display text-2xl text-text mb-3 italic">No Orders Found</p>
              <p className="font-sans text-sm text-muted mb-8">
                We couldn't find any orders linked to this email address.
              </p>
              <Link to="/shop" className="btn-secondary">
                Start Shopping
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Orders List */}
        <AnimatePresence>
          {orders.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-8">
                <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-muted">
                  {orders.length} order{orders.length !== 1 ? 's' : ''} found
                </p>
                <div className="h-px flex-1 bg-border ml-6" />
              </div>

              {orders.map((order, index) => {
                const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items);
                const status = statusConfig[order.status] || statusConfig.Pending;
                const currentStep = getStepIndex(order.status);

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group border border-border bg-surface/20 backdrop-blur-sm hover:border-accent/30 transition-all duration-500 overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <span className="font-display text-xl text-text">Order #{order.id}</span>
                            <span
                              className="inline-flex items-center gap-1.5 px-3 py-1 text-[9px] uppercase tracking-[0.2em]"
                              style={{ backgroundColor: status.bg, color: status.color, border: `1px solid ${status.border}` }}
                            >
                              <span>{status.icon}</span>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-muted text-[11px] uppercase tracking-widest">
                            {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                        <div className="mt-4 md:mt-0 md:text-right">
                          <p className="text-muted text-[10px] uppercase tracking-[0.2em] mb-1">Total</p>
                          <span className="font-mono text-2xl text-accent">${order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Status Progress Bar */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between relative">
                          {/* Progress line background */}
                          <div className="absolute top-3 left-0 right-0 h-px bg-border" />
                          {/* Progress line filled */}
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                            className="absolute top-3 left-0 h-px bg-accent"
                          />
                          {steps.map((step, i) => (
                            <div key={step} className="relative z-10 flex flex-col items-center">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold transition-all duration-500 ${
                                  i < currentStep
                                    ? 'bg-accent text-bg'
                                    : 'bg-surface border border-border text-muted'
                                }`}
                              >
                                {i < currentStep ? '✓' : i + 1}
                              </div>
                              <span className={`mt-2 text-[8px] md:text-[9px] tracking-[0.15em] uppercase ${
                                i < currentStep ? 'text-accent' : 'text-muted/50'
                              }`}>
                                {step}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="border-t border-border/50 pt-5 mt-2">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-4">{items.length} item{items.length !== 1 ? 's' : ''}</p>
                        <div className="space-y-3">
                          {items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center">
                              <p className="text-sm text-text/80">
                                {item.name}
                                {item.size && <span className="text-muted ml-1.5 text-xs">({item.size})</span>}
                                <span className="text-muted ml-2">× {item.quantity}</span>
                              </p>
                              <p className="font-mono text-sm text-accent">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Order Footer */}
                    <div className="px-6 md:px-8 py-4 bg-surface/30 border-t border-border/30 flex justify-between items-center">
                      <p className="text-[10px] text-muted tracking-wide">
                        {order.customer_name && `Shipping to ${order.customer_name}`}
                      </p>
                      <Link
                        to={`/order/${order.id}`}
                        className="group/link flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-accent hover:text-accent-hover transition-colors"
                      >
                        Details
                        <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TrackOrderPage;
