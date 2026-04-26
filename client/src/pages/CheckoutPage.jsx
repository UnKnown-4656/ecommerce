import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        ...formData,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size
        })),
        total: cartTotal
      };

      const response = await api.post('/orders', orderData);
      clearCart();
      navigate('/order-success', { state: { orderId: response.data.id, total: cartTotal } });
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
        <div className="max-w-md mx-auto px-6 py-32 text-center">
          <div className="w-20 h-20 mx-auto mb-6 border border-border rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="font-display text-3xl text-text mb-3">Your Cart is Empty</h1>
          <p className="text-muted text-sm mb-8">Add some items to your cart before checking out.</p>
          <button
            onClick={() => navigate('/shop')}
            className="btn-primary"
          >
            Browse Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '3rem',
            fontWeight: 300,
            color: '#e8e0d4',
            letterSpacing: '0.05em'
          }}>Checkout</h1>
          <div style={{
            width: '60px', height: '1px',
            background: '#b8922e',
            margin: '1rem auto'
          }} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} style={{ background: '#111', border: '1px solid #1e1e1e', padding: '2rem', borderRadius: '8px' }}>
              <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.5rem',
                fontWeight: 300,
                color: '#e8e0d4',
                marginBottom: '1.5rem'
              }}>Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#e8e0d4',
                    display: 'block',
                    marginBottom: '0.5rem'
                  }}>Full Name *</label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#0a0a0a',
                      border: '1px solid #2a2a2a',
                      borderRadius: '4px',
                      color: '#e8e0d4',
                      fontSize: '14px',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#e8e0d4',
                    display: 'block',
                    marginBottom: '0.5rem'
                  }}>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#0a0a0a',
                      border: '1px solid #2a2a2a',
                      borderRadius: '4px',
                      color: '#e8e0d4',
                      fontSize: '14px',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  />
                </div>
                <div className="md:col-span-2">
                  <label style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#e8e0d4',
                    display: 'block',
                    marginBottom: '0.5rem'
                  }}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#0a0a0a',
                      border: '1px solid #2a2a2a',
                      borderRadius: '4px',
                      color: '#e8e0d4',
                      fontSize: '14px',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  />
                </div>
              </div>

              <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.5rem',
                fontWeight: 300,
                color: '#e8e0d4',
                marginTop: '2rem',
                marginBottom: '1.5rem'
              }}>Shipping Address</h2>
              
              <div className="space-y-4">
                <div>
                  <label style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#e8e0d4',
                    display: 'block',
                    marginBottom: '0.5rem'
                  }}>Address Line 1 *</label>
                  <input
                    type="text"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#0a0a0a',
                      border: '1px solid #2a2a2a',
                      borderRadius: '4px',
                      color: '#e8e0d4',
                      fontSize: '14px',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#e8e0d4',
                    display: 'block',
                    marginBottom: '0.5rem'
                  }}>Address Line 2</label>
                  <input
                    type="text"
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#0a0a0a',
                      border: '1px solid #2a2a2a',
                      borderRadius: '4px',
                      color: '#e8e0d4',
                      fontSize: '14px',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#e8e0d4',
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: '#0a0a0a',
                        border: '1px solid #2a2a2a',
                        borderRadius: '4px',
                        color: '#e8e0d4',
                        fontSize: '14px',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#e8e0d4',
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: '#0a0a0a',
                        border: '1px solid #2a2a2a',
                        borderRadius: '4px',
                        color: '#e8e0d4',
                        fontSize: '14px',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#e8e0d4',
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: '#0a0a0a',
                        border: '1px solid #2a2a2a',
                        borderRadius: '4px',
                        color: '#e8e0d4',
                        fontSize: '14px',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: '#b8922e',
                  color: '#0a0a0a',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'none',
                  transition: 'background 0.3s'
                }}
                onMouseEnter={e => e.target.style.background = '#d4aa50'}
                onMouseLeave={e => e.target.style.background = '#b8922e'}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div style={{ 
              background: '#111', 
              border: '1px solid #1e1e1e', 
              padding: '2rem', 
              borderRadius: '8px',
              position: 'sticky',
              top: '2rem'
            }}>
              <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.5rem',
                fontWeight: 300,
                color: '#e8e0d4',
                marginBottom: '1.5rem'
              }}>Order Summary</h2>
              
              <div style={{ marginBottom: '2rem' }}>
                {cart.map((item, index) => {
                  const imageUrl = item.image_url?.startsWith('http') 
                    ? item.image_url 
                    : `https://ecommerce-ahmv.onrender.com${item.image_url}`;
                  
                  return (
                    <div key={`${item.id}-${item.size}-${index}`} style={{
                      display: 'flex',
                      gap: '1rem',
                      marginBottom: index < cart.length - 1 ? '1.5rem' : '0',
                      paddingBottom: index < cart.length - 1 ? '1.5rem' : '0',
                      borderBottom: index < cart.length - 1 ? '1px solid #1e1e1e' : 'none'
                    }}>
                      {/* Product Image */}
                      <div style={{
                        width: '80px', height: '100px',
                        background: '#0f0f0f',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}>
                        <img
                          src={imageUrl}
                          alt={item.name}
                          style={{
                            width: '100%', height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={e => {
                            e.target.src = 'https://placehold.co/80x100/0f0f0f/1e1e1e?text=NOIR';
                          }}
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div style={{ flex: 1 }}>
                        <div>
                          <h4 style={{
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: '1rem',
                            fontWeight: 400,
                            color: '#e8e0d4',
                            marginBottom: '0.25rem'
                          }}>{item.name}</h4>
                          <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'center',
                            marginBottom: '0.5rem'
                          }}>
                            <span style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '12px',
                              color: '#666',
                              textTransform: 'uppercase'
                            }}>Qty: {item.quantity}</span>
                            {item.size && (
                              <span style={{
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '11px',
                                color: '#666',
                                background: '#1a1a1a',
                                padding: '2px 6px',
                                borderRadius: '3px'
                              }}>Size: {item.size}</span>
                            )}
                          </div>
                          <p style={{
                            fontFamily: 'Courier New, monospace',
                            fontSize: '16px',
                            color: '#b8922e',
                            fontWeight: 'bold'
                          }}>${item.price.toFixed(2)}</p>
                        </div>
                        
                        {/* Item Total */}
                        <p style={{
                          fontFamily: 'Courier New, monospace',
                          fontSize: '14px',
                          color: '#e8e0d4',
                          textAlign: 'right',
                          marginTop: '0.5rem'
                        }}>${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div style={{
                borderTop: '1px solid #1e1e1e',
                paddingTop: '1.5rem',
                marginTop: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.25rem',
                    fontWeight: 300,
                    color: '#e8e0d4'
                  }}>Total</span>
                  <span style={{
                    fontFamily: 'Courier New, monospace',
                    fontSize: '1.5rem',
                    color: '#b8922e',
                    fontWeight: 'bold'
                  }}>${cartTotal.toFixed(2)}</span>
                </div>
                
                <div style={{
                  padding: '0.75rem',
                  background: 'rgba(184,146,46,0.1)',
                  border: '1px solid rgba(184,146,46,0.2)',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontSize: '11px',
                  color: '#666',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Cash on Delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;