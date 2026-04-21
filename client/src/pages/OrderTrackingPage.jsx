import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto"></div>
        <p className="mt-4">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="font-display text-2xl mb-4">Order Not Found</h1>
        <p className="text-muted mb-6">We couldn't find an order with ID #{id}</p>
        <Link to="/" className="btn bg-accent hover:bg-accent-hover text-white inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const items = JSON.parse(order.items);
  const statusColors = {
    Pending: 'bg-yellow-500',
    Shipped: 'bg-blue-500',
    Delivered: 'bg-green-500'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl mb-2">Order Tracking</h1>
      <p className="text-muted mb-8">Order ID: #{order.id}</p>

      <div className="bg-surface border border-border rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="font-display text-xl mb-2">Order Status</h2>
            <span className={`px-3 py-1 rounded-full text-white text-sm ${statusColors[order.status]}`}>
              {order.status}
            </span>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-muted">Ordered on {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="font-display text-lg mb-4">Items</h3>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-16 h-20 bg-surface border border-border flex-shrink-0 flex items-center justify-center">
                  <span className="text-xs text-muted">Image</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  {item.size && <p className="text-sm text-muted">Size: {item.size}</p>}
                  <p className="text-sm">Qty: {item.quantity}</p>
                </div>
                <div className="font-mono text-accent">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-6 mt-6">
          <h3 className="font-display text-lg mb-4">Delivery Address</h3>
          <div className="text-muted">
            <p>{order.customer_name}</p>
            <p>{order.address_line1}{order.address_line2 ? `, ${order.address_line2}` : ''}</p>
            <p>{order.city}, {order.state} {order.pincode}</p>
            <p>{order.phone}</p>
            <p>{order.email}</p>
          </div>
        </div>

        <div className="border-t border-border pt-6 mt-6">
          <h3 className="font-display text-lg mb-2">Order Total</h3>
          <p className="font-mono text-2xl text-accent">${order.total.toFixed(2)}</p>
        </div>
      </div>

      <div className="text-center">
        <Link to="/" className="btn border border-border hover:border-accent inline-block">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderTrackingPage;