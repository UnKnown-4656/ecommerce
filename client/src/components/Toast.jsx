import { useCart } from '../context/CartContext';

const Toast = () => {
  const { toast } = useCart();

  if (!toast) return null;

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-accent'
  }[toast.type] || 'bg-accent';

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <div className={`${bgColor} text-white px-6 py-3 rounded shadow-lg`}>
        <p className="text-sm">{toast.message}</p>
      </div>
    </div>
  );
};

export default Toast;