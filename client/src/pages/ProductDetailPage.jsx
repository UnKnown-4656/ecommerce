import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      return;
    }
    addToCart(product, quantity, selectedSize || null);
    navigate('/cart');
  };

  const sizes = product?.sizes ? JSON.parse(product.sizes) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-muted">Product not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-3-4 bg-surface border border-border">
          <img
            src={product.image_url?.startsWith('http') ? product.image_url : `https://ecommerce-ahmv.onrender.com${product.image_url}`}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x533?text=No+Image';
            }}
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-medium uppercase tracking-wider text-xl">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-muted uppercase tracking-wider text-sm mb-2">{product.category}</p>
          <h1 className="font-display text-3xl md:text-4xl mb-4">{product.name}</h1>
          <p className="font-mono text-2xl text-accent mb-6">${product.price.toFixed(2)}</p>
          
          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-orange-500 text-sm mb-4">Only {product.stock} left in stock</p>
          )}

          <p className="text-muted mb-8">{product.description}</p>

          {sizes.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Size</label>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded transition-colors ${
                      selectedSize === size
                        ? 'bg-accent text-white border-accent'
                        : 'border-border hover:border-accent'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-border rounded hover:bg-border"
              >
                -
              </button>
              <span className="text-lg w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 border border-border rounded hover:bg-border"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`btn bg-accent text-white w-full md:w-auto ${
              product.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent-hover'
            }`}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;