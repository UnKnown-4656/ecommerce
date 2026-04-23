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
  
  // Define order statuses for stepper
  const orderStatuses = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const currentStatusIndex = orderStatuses.indexOf(order.status);
  
  // Calculate estimated delivery date (order date + 7 days)
  const orderDate = new Date(order.created_at);
  const estimatedDeliveryDate = new Date(orderDate);
  estimatedDeliveryDate.setDate(orderDate.getDate() + 7);
  
  // Status colors for consistency
  const statusConfig = {
    Confirmed: { bg: '#C9A94020', color: '#C9A96E', border: '#C9A96E' },
    Processing: { bg: '#C9A94020', color: '#C9A96E', border: '#C9A96E' },
    Shipped: { bg: '#5A7EC920', color: '#7EA8E9', border: '#5A7EC9' },
    Delivered: { bg: '#5A9E6F20', color: '#7ABE8F', border: '#5A9E6F' }
  };
  
  const statusColors = statusConfig[order.status] || statusConfig.Confirmed;

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
                <div className="w-16 h-20 bg-surface border border-border flex-shrink-0 overflow-hidden">
                  {item.image_url ? (
                    <img 
                      src={item.image_url.startsWith('http') ? item.image_url : `https://ecommerce-ahmv.onrender.com${item.image_url}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><span class="text-xs text-muted">No Image</span></div>';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs text-muted">No Image</span>
                    </div>
                  )}
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