import { useEffect, useState } from 'react';
import StarRating from './StarRating';
import { calculateAverageRating } from '../utils/reviews';
import api from '../services/api';

const ReviewsList = ({ productId, refreshTrigger }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/products/${productId}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError(error.message);
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

  const averageRating = calculateAverageRating(reviews);
  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0
  }));

  if (loading) {
    return (
      <div className="py-16 space-y-8">
        <div className="h-px bg-border w-40" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="pb-8 border-b border-border">
            <div className="flex justify-between mb-4">
              <div className="w-32 h-4 bg-surface animate-pulse" />
              <div className="w-24 h-3 bg-surface animate-pulse" />
            </div>
            <div className="w-full h-12 bg-surface animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="font-sans text-sm text-accent mb-4">Unable to load reviews.</p>
        <button
          onClick={fetchReviews}
          className="font-sans text-xs tracking-[0.2em] uppercase text-muted hover:text-accent transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-0">
      {reviews.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-display text-2xl italic text-muted">
            Be the first to share your thoughts.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-12 sm:mb-16 pb-8 sm:pb-12 border-b border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-8 mb-6 sm:mb-8">
              <div className="font-display text-[4rem] sm:text-[5rem] leading-none text-accent font-light">
                {averageRating.toFixed(1)}
              </div>
              <div className="pb-2">
                <StarRating rating={averageRating} size="text-lg" />
                <div className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted mt-2">
                  {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {ratingCounts.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-4">
                  <span className="font-sans text-xs text-muted w-12">{star} ★</span>
                  <div className="relative flex-1 h-px bg-border">
                    <div
                      className="absolute top-0 left-0 h-full bg-accent"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="font-sans text-xs text-muted w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-0">
            {reviews.map((review) => (
              <div key={review.id} className="py-8 sm:py-10 border-b border-border last:border-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div>
                    <h3 className="font-sans text-sm font-medium tracking-[0.15em] uppercase text-text">
                      {review.reviewer_name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 sm:mt-2">
                      <StarRating rating={review.rating} size="text-xs" />
                      <span className="font-sans text-[10px] text-muted">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="font-sans text-muted leading-relaxed text-sm sm:text-base max-w-2xl">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewsList;