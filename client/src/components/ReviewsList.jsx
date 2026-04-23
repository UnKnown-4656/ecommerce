import { useEffect, useState } from 'react';
import StarRating from './StarRating';

const ReviewsList = ({ productId, refreshTrigger }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId, refreshTrigger]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border-b border-border pb-4">
            <div className="flex items-center mb-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="w-5 h-5 bg-border rounded animate-pulse"></div>
                ))}
              </div>
              <div className="ml-2 w-24 h-4 bg-border rounded animate-pulse"></div>
            </div>
            <div className="w-full h-12 bg-border rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-border pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <StarRating rating={review.rating} size="w-5 h-5" />
              <span className="ml-3 text-sm text-muted">{review.reviewer_name}</span>
            </div>
            <span className="text-xs text-muted">
              {formatDate(review.created_at)}
            </span>
          </div>
          <p className="text-sm leading-relaxed">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
