import { useEffect, useState } from 'react';
import api from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/admin/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const statusColors = {
    Pending: 'bg-yellow-500',
    Shipped: 'bg-blue-500',
    Delivered: 'bg-green-500'
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-3xl mb-8">Orders</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : orders.length === 0 ? (
          <p className="text-muted">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2">ID</th>
                  <th className="text-left py-3 px-2">Customer</th>
                  <th className="text-left py-3 px-2">Items</th>
                  <th className="text-left py-3 px-2">Total</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const items = JSON.parse(order.items);
                  return (
                    <tr key={order.id} className="border-b border-border">
                      <td className="py-3 px-2">#{order.id}</td>
                      <td className="py-3 px-2">
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-muted text-xs">{order.email}</p>
                        <p className="text-muted text-xs">{order.phone}</p>
                        <p className="text-muted text-xs">{order.address_line1}, {order.city}, {order.state} {order.pincode}</p>
                      </td>
                      <td className="py-3 px-2">
                        {items.map((item, i) => (
                          <p key={i} className="text-xs">{item.name} x {item.quantity}</p>
                        ))}
                      </td>
                      <td className="py-3 px-2 font-mono">${order.total.toFixed(2)}</td>
                      <td className="py-3 px-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`px-2 py-1 text-white text-xs rounded ${statusColors[order.status]} ${order.status === 'Pending' ? 'pulse-pending' : ''}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="py-3 px-2 text-muted">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default AdminOrdersPage;