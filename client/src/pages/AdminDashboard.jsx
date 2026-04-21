import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, color: 'bg-blue-500' },
    { label: 'Total Orders', value: stats.totalOrders, color: 'bg-purple-500' },
    { label: 'Pending Orders', value: stats.pendingOrders, color: 'bg-yellow-500' },
    { label: 'Revenue', value: `$${stats.revenue.toFixed(2)}`, color: 'bg-green-500' }
  ];

  const menuItems = [
    { label: 'Products', href: '/admin/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10m-8 4l8 4m-8-4l-8-4m8 4v10m-8-4l8-4m-8 4l-8-4' },
    { label: 'Orders', href: '/admin/orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' }
  ];

  return (
    <ProtectedRoute adminOnly>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-3xl mb-8">Admin Dashboard</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((card) => (
                <div key={card.label} className="bg-surface border border-border p-6">
                  <p className="text-muted text-sm mb-1">{card.label}</p>
                  <p className="font-display text-3xl">{card.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="bg-surface border border-border p-6 flex items-center justify-between hover:border-accent transition-colors"
                >
                  <span className="font-display text-xl">{item.label}</span>
                  <svg className="w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;