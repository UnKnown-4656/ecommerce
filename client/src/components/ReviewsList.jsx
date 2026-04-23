import { useEffect, useState } from 'react';
import StarRating from './StarRating';
import { calculateAverageRating } from '../utils/reviews';

const ReviewsList = ({ productId, refreshTrigger }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        console.log('Reviews API response:', data);
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

  const averageRating = calculateAverageRating(reviews);
  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0
  }));

  if (loading) {
    return (
      <div className="py-20 px-8 max-w-5xl mx-auto">
        <div className="space-y-8">
          <div className="animate-pulse">
            <div className="h-16 bg-[#1a1a1a] w-40 mb-8"></div>
            <div className="h-px bg-[#1a1a1a] w-40 mb-16"></div>
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border-b border-[#1a1a1a] py-8">
              <div className="flex justify-between mb-4">
                <div className="w-32 h-4 bg-[#1a1a1a] animate-pulse"></div>
                <div className="w-24 h-3 bg-[#1a1a1a] animate-pulse"></div>
              </div>
              <div className="w-full h-16 bg-[#1a1a1a] animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] w-full py-20 px-8 max-w-5xl mx-auto border-t border-[#1e1e1e]">
      {/* Section Heading */}
      <div className="mb-16">
        <h2 className="font-serif text-[#e8e0d4] text-[2.5rem] font-light mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          Customer Reviews
        </h2>
        <div className="h-px bg-[#b8922e] w-10"></div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-serif italic text-[#333] text-[1.5rem]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Be the first to share your thoughts.
          </p>
        </div>
      ) : (
        <>
          {/* Review Summary Bar */}
          <div className="mb-16">
            <div className="flex items-end gap-8 mb-6">
              <div className="font-serif text-[#b8922e] text-[5rem] font-light leading-none" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {averageRating.toFixed(1)}
              </div>
              <div>
                <div className="text-[#555] text-sm mb-2">out of 5</div>
                <div className="text-[#444] text-xs tracking-[0.2em] uppercase">
                  {reviews.length} REVIEWS
                </div>
              </div>
            </div>
            
            <StarRating rating={averageRating} size="text-lg" className="mb-8" />
            
            {/* Star Breakdown */}
            <div className="space-y-2">
              {ratingCounts.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-4">
                  <span className="text-[#555] text-xs w-12">
                    {star} ★
                  </span>
                  <div className="relative w-[200px] h-px bg-[#1e1e1e]">
                    <div 
                      className="absolute top-0 left-0 h-full bg-[#b8922e]"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-[#555] text-xs w-8">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-0">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-[#1a1a1a] py-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-sans font-medium text-sm text-[#e8e0d4] uppercase tracking-[0.15em]">
                    {review.reviewer_name}
                  </h3>
                  <span className="font-sans text-xs text-[#333]">
                    {formatDate(review.created_at)}
                  </span>
                </div>
                
                <div className="mb-4">
                  <StarRating rating={review.rating} size="text-xs" />
                </div>
                
                <p className="font-sans text-sm text-[#666] leading-[1.9]">
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
