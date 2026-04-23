import { useState } from 'react';
import StarRating from './StarRating';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    reviewer_name: '',
    rating: 0,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRatingChange = (newRating) => {
    setFormData(prev => ({ ...prev, rating: newRating }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.reviewer_name || !formData.rating || !formData.comment) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      // Reset form
      setFormData({
        reviewer_name: '',
        rating: 0,
        comment: ''
      });

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Refresh reviews list
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      // You could add error handling here
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.reviewer_name && formData.rating > 0 && formData.comment;

  return (
    <div className="border-t border-border pt-6 mt-8">
      <h3 className="font-display text-xl mb-4">Write a Review</h3>
      
      {showSuccess && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded mb-4">
          Review submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Your Name</label>
          <input
            type="text"
            name="reviewer_name"
            value={formData.reviewer_name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-surface border border-border rounded focus:border-accent focus:outline-none"
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Rating</label>
          <StarRating
            rating={formData.rating}
            interactive={true}
            onRatingChange={handleRatingChange}
            size="w-8 h-8"
          />
          {formData.rating === 0 && (
            <p className="text-sm text-muted mt-1">Click to select a rating</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Your Review</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 bg-surface border border-border rounded focus:border-accent focus:outline-none resize-none"
            placeholder="Share your experience with this product..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`btn bg-accent text-white px-6 py-3 ${
            !isFormValid || isSubmitting 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-accent-hover'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
