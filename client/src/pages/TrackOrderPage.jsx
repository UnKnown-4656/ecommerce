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
      const response = await api.get(`/orders/track?email=${encodeURIComponent(email)}`);
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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl md:text-4xl text-center mb-8">Track Your Order</h1>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-12">
        <label className="block text-sm uppercase tracking-widest text-muted mb-2">Enter your email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full px-4 py-3 border-0 border-b border-border bg-transparent focus:outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 btn btn-primary"
        >
          {loading ? 'Searching...' : 'Track Orders'}
        </button>
      </form>

      {error && (
        <p className="text-center text-red-500 mb-8">{error}</p>
      )}

      {searched && orders.length === 0 && !loading && !error && (
        <p className="text-center text-muted italic">No orders found for this email address.</p>
      )}

      {orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => {
            const items = JSON.parse(order.items);
            const status = statusColors[order.status] || statusColors.Pending;
            return (
              <div key={order.id} className="card p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <span className="font-mono text-accent text-lg">Order #{order.id}</span>
                    <span 
                      className="ml-4 inline-flex px-3 py-1 rounded-full text-xs uppercase tracking-wider"
                      style={{ backgroundColor: status.bg, color: status.color, border: `1px solid ${status.border}` }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <span className="text-muted text-sm">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                
                <div className="border-t border-b border-border py-4 my-4">
                  <p className="text-sm text-muted mb-2">{items.length} item(s)</p>
                  {items.map((item, i) => (
                    <p key={i} className="text-sm">{item.name} x {item.quantity}</p>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xl text-accent">${order.total.toFixed(2)}</span>
                  <Link to={`/order/${order.id}`} className="text-accent hover:text-accent-hover underline text-sm">
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrackOrderPage;
