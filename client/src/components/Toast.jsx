import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Toast = () => {
  const { toast } = useCart();

  const icons = {
    success: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const colors = {
    success: { bg: 'rgba(90,158,111,0.15)', border: 'rgba(90,158,111,0.3)', text: '#7ABE8F' },
    error:   { bg: 'rgba(201,90,90,0.15)',  border: 'rgba(201,90,90,0.3)',  text: '#E87A7A' },
    info:    { bg: 'rgba(184,146,46,0.15)', border: 'rgba(184,146,46,0.3)', text: '#b8922e' },
  };

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 30, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 10, x: 30 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="fixed bottom-6 right-6 z-[60]"
        >
          <div
            className="flex items-center gap-3 px-6 py-4 backdrop-blur-md shadow-2xl"
            style={{
              backgroundColor: colors[toast.type]?.bg || colors.info.bg,
              borderLeft: `3px solid ${colors[toast.type]?.text || colors.info.text}`,
              border: `1px solid ${colors[toast.type]?.border || colors.info.border}`,
            }}
          >
            <span style={{ color: colors[toast.type]?.text || colors.info.text }}>
              {icons[toast.type] || icons.info}
            </span>
            <p className="text-sm text-text font-sans">{toast.message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;