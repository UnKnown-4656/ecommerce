import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/admin/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await api.delete(`/admin/products/${productId}`);
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-3xl">Products</h1>
          <Link
            to="/admin/products/add"
            className="btn bg-accent hover:bg-accent-hover text-white"
          >
            Add Product
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : products.length === 0 ? (
          <p className="text-muted">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2">ID</th>
                  <th className="text-left py-3 px-2">Image</th>
                  <th className="text-left py-3 px-2">Name</th>
                  <th className="text-left py-3 px-2">Category</th>
                  <th className="text-left py-3 px-2">Price</th>
                  <th className="text-left py-3 px-2">Stock</th>
                  <th className="text-left py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-border">
                    <td className="py-3 px-2">#{product.id}</td>
                    <td className="py-3 px-2">
                      <img
                        src={`http://localhost:5000${product.image_url}`}
                        alt={product.name}
                        className="w-12 h-16 object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/48x64?text=No';
                        }}
                      />
                    </td>
                    <td className="py-3 px-2 font-medium">{product.name}</td>
                    <td className="py-3 px-2 text-muted">{product.category}</td>
                    <td className="py-3 px-2 font-mono">${product.price.toFixed(2)}</td>
                    <td className="py-3 px-2">{product.stock}</td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="text-accent hover:text-accent-hover"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default AdminProductsPage;