import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (err) {
        setError('Order not found');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border border-accent/30 rounded-full animate-ping" />
            <div className="absolute inset-2 border border-accent rounded-full animate-pulse" />
            <div className="absolute inset-4 bg-accent rounded-full" />
          </div>
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-muted animate-pulse">Loading order details</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 border border-border rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-display text-3xl mb-3">Order Not Found</h1>
          <p className="text-muted mb-8 text-sm">We couldn't find an order with ID #{id}</p>
          <Link to="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;

  // Status stepper
  const allStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const currentIndex = allStatuses.indexOf(order.status);

  // Estimated delivery
  const orderDate = new Date(order.created_at);
  const estimatedDelivery = new Date(orderDate);
  estimatedDelivery.setDate(orderDate.getDate() + 7);

  const statusColors = {
    Pending:    { accent: '#C9A96E' },
    Confirmed:  { accent: '#C9A96E' },
    Processing: { accent: '#C9A96E' },
    Shipped:    { accent: '#7EA8E9' },
    Delivered:  { accent: '#7ABE8F' },
  };

  const activeColor = statusColors[order.status]?.accent || '#C9A96E';

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="bg-surface/30 border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link to="/track-order" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted hover:text-accent transition-colors mb-8">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Back to Track Orders
            </Link>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-muted mb-3">Order Details</p>
                <h1 className="font-display text-3xl md:text-4xl text-text">
                  Order <span className="text-accent font-mono">#{order.id}</span>
                </h1>
              </div>
              <div className="md:text-right">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-1">Placed on</p>
                <p className="font-sans text-sm text-text">
                  {orderDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        {/* Status Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="border border-border bg-surface/20 p-8 md:p-10 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-text">Order Status</h2>
            <span
              className="text-[10px] uppercase tracking-[0.2em] font-medium px-4 py-1.5"
              style={{
                color: activeColor,
                backgroundColor: `${activeColor}15`,
                border: `1px solid ${activeColor}40`,
              }}
            >
              {order.status}
            </span>
          </div>

          {/* Visual stepper */}
          <div className="relative mt-10 mb-4">
            <div className="flex items-center justify-between relative">
              {/* Track background */}
              <div className="absolute top-4 left-4 right-4 h-[2px] bg-border" />
              {/* Track filled */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentIndex >= 0 ? (currentIndex / (allStatuses.length - 1)) * 100 : 0}%` }}
                transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                className="absolute top-4 left-4 h-[2px]"
                style={{ backgroundColor: activeColor, maxWidth: 'calc(100% - 32px)' }}
              />

              {allStatuses.map((status, i) => (
                <div key={status} className="relative z-10 flex flex-col items-center" style={{ width: '20%' }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 200 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all duration-500 ${
                      i <= currentIndex
                        ? 'text-bg shadow-lg'
                        : 'bg-bg border-2 border-border text-muted'
                    }`}
                    style={i <= currentIndex ? { backgroundColor: activeColor, boxShadow: `0 0 20px ${activeColor}30` } : {}}
                  >
                    {i <= currentIndex ? '✓' : i + 1}
                  </motion.div>
                  <span className={`mt-3 text-[8px] md:text-[9px] tracking-[0.1em] uppercase text-center ${
                    i <= currentIndex ? 'text-text' : 'text-muted/40'
                  }`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {order.status !== 'Delivered' && (
            <p className="text-[11px] text-muted mt-6 text-center">
              Estimated delivery: <span className="text-text">{estimatedDelivery.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </p>
          )}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="border border-border bg-surface/20 p-8"
          >
            <h3 className="font-display text-lg text-text mb-6">
              Items <span className="text-muted font-sans text-xs ml-2">({items.length})</span>
            </h3>
            <div className="space-y-5">
              {items.map((item, index) => (
                <div key={index} className="flex gap-4 pb-5 border-b border-border/30 last:border-0 last:pb-0">
                  <div className="w-16 h-20 bg-surface border border-border flex-shrink-0 overflow-hidden">
                     {item.image_url ? (
                      <img
                        src={item.image_url.startsWith('http') ? item.image_url : `https://ecommerce-ahmv.onrender.com${item.image_url}`}
                        alt={item.name}
                        width="64"
                        height="80"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[8px] text-muted uppercase tracking-wider">Noir</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-base text-text truncate">{item.name}</h4>
                    {item.size && <p className="text-[10px] tracking-[0.15em] uppercase text-muted mt-1">Size: {item.size}</p>}
                    <p className="text-xs text-muted mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-mono text-sm text-accent self-center">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
              <span className="font-display text-lg text-text">Total</span>
              <span className="font-mono text-xl text-accent">${order.total.toFixed(2)}</span>
            </div>
          </motion.div>

          {/* Delivery Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="border border-border bg-surface/20 p-8">
              <h3 className="font-display text-lg text-text mb-6">Delivery Address</h3>
              <div className="space-y-2 text-sm text-muted">
                <p className="text-text font-medium">{order.customer_name}</p>
                <p>{order.address_line1}</p>
                {order.address_line2 && <p>{order.address_line2}</p>}
                <p>{order.city}, {order.state} {order.pincode}</p>
                <div className="pt-4 mt-4 border-t border-border/30 space-y-1.5">
                  <p className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {order.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {order.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-border bg-surface/20 p-8">
              <h3 className="font-display text-lg text-text mb-4">Need Help?</h3>
              <p className="text-sm text-muted mb-5 leading-relaxed">
                If you have any questions about your order, feel free to reach out to our support team.
              </p>
              <a
                href="mailto:hello@noirandco.com"
                className="btn-secondary w-full justify-center text-center"
              >
                Contact Support
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link to="/shop" className="group flex items-center gap-3 justify-center text-[11px] uppercase tracking-[0.3em] text-muted hover:text-accent transition-colors">
            <div className="w-8 h-px bg-muted group-hover:bg-accent transition-colors" />
            Continue Shopping
            <div className="w-8 h-px bg-muted group-hover:bg-accent transition-colors" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;