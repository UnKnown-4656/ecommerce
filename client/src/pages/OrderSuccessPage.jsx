import { Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const OrderSuccessPage = () => {
  const location = useLocation();
  const { orderId, total } = location.state || {};
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // If no order data, redirect to home
  if (!orderId && orderId !== 0) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-bg relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/[0.03] rounded-full blur-3xl" />
      </div>

      {/* Animated confetti-like particles */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 1,
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 900),
                y: -20,
                rotate: 0,
              }}
              animate={{
                opacity: [1, 1, 0],
                y: (typeof window !== 'undefined' ? window.innerHeight : 900) + 100,
                rotate: Math.random() * 720 - 360,
                x: `+=${Math.random() * 200 - 100}`,
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 1.5,
                ease: "easeOut",
              }}
              className="absolute"
              style={{
                width: Math.random() * 8 + 4,
                height: Math.random() * 8 + 4,
                background: ['#b8922e', '#d4aa50', '#e8e0d4', '#7ABE8F'][Math.floor(Math.random() * 4)],
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-6 py-20 md:py-32 relative z-20">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="flex justify-center mb-10"
        >
          <div className="relative">
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="w-24 h-24 rounded-full border-2 border-accent/30 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center"
              >
                <motion.svg
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="w-8 h-8 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              </motion.div>
            </motion.div>
            {/* Glow ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.3, 0], scale: [0.8, 1.5, 1.8] }}
              transition={{ delay: 0.8, duration: 1.5 }}
              className="absolute inset-0 rounded-full border border-accent"
            />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-accent mb-4">Order Confirmed</p>
          <h1 className="font-display text-4xl md:text-5xl text-text mb-4">
            Thank <span className="italic text-accent">You</span>
          </h1>
          <p className="font-sans text-sm text-muted max-w-md mx-auto leading-relaxed">
            Your order has been placed successfully. We'll start processing it right away.
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="border border-border bg-surface/20 backdrop-blur-sm p-8 md:p-10 mb-8"
        >
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/50">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-2">Order Number</p>
              <p className="font-mono text-2xl text-accent">#{orderId}</p>
            </div>
            {total !== undefined && total !== null && (
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-2">Total Amount</p>
                <p className="font-mono text-2xl text-accent">${total.toFixed(2)}</p>
              </div>
            )}
          </div>

          {/* Status Timeline */}
          <div className="flex items-center justify-between mb-8">
            {['Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, i) => (
              <div key={step} className="flex-1 flex flex-col items-center relative">
                {i > 0 && (
                  <div className={`absolute top-3 right-1/2 w-full h-px ${i === 0 ? 'bg-accent' : 'bg-border'}`} style={{ left: '-50%' }} />
                )}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold relative z-10 ${
                  i === 0 ? 'bg-accent text-bg' : 'bg-surface border border-border text-muted'
                }`}>
                  {i === 0 ? '✓' : i + 1}
                </div>
                <span className={`mt-2 text-[8px] tracking-[0.1em] uppercase ${i === 0 ? 'text-accent' : 'text-muted/40'}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-accent/5 border border-accent/10 p-4 text-center">
            <p className="text-[11px] text-muted">
              📧 A confirmation email will be sent to your registered email address.
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="space-y-4"
        >
          <Link
            to={`/order/${orderId}`}
            className="btn-primary w-full justify-center block text-center py-5"
          >
            Track Your Order
          </Link>

          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/shop"
              className="btn-secondary justify-center text-center py-4"
            >
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-muted border border-border text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 hover:border-accent hover:text-accent text-center"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;