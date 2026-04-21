import { Link } from 'react-router-dom';

const OrderSuccessPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <div className="bg-surface border border-border p-8 max-w-md mx-auto">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-display text-3xl mb-4">Order Placed Successfully!</h1>
        <p className="text-muted mb-8">
          Thank you for your order. We'll process it shortly and update you on the status.
        </p>
        <div className="space-y-4">
          <Link
            to="/shop"
            className="btn bg-accent hover:bg-accent-hover text-white block"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="btn border border-border hover:border-accent block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;