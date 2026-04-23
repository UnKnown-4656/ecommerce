import { useState } from 'react';
import StarRating from './StarRating';
import api from '../services/api';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    reviewer_name: '',
    rating: 0,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const handleRatingChange = (newRating) => {
    setFormData(prev => ({ ...prev, rating: newRating }));
    if (attemptedSubmit) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (attemptedSubmit) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.reviewer_name.trim()) {
      newErrors.reviewer_name = 'Name is required';
    }
    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    if (!formData.comment.trim()) {
      newErrors.comment = 'Review is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post(`/products/${productId}/reviews`, formData);
      console.log('Review submitted:', response.data);

      setFormData({
        reviewer_name: '',
        rating: 0,
        comment: ''
      });
      setErrors({});
      setAttemptedSubmit(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16 border-t border-border mt-16">
      <div className="mb-8">
        <h2 className="font-display text-2xl text-text mb-4">
          Share Your Experience
        </h2>
        <div className="h-px w-10 bg-accent" />
      </div>

      {showSuccess ? (
        <div className="text-center py-12">
          <p className="font-display text-xl italic text-accent">
            Thank you. Your review has been published.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-xl">
          <div>
            <input
              type="text"
              name="reviewer_name"
              value={formData.reviewer_name}
              onChange={handleInputChange}
              placeholder="Your Name"
              className="w-full bg-transparent border-b border-border text-text font-sans text-sm py-3 focus:border-accent focus:outline-none transition-colors placeholder-muted"
            />
            {attemptedSubmit && errors.reviewer_name && (
              <p className="text-red-400 font-sans text-xs mt-2">
                {errors.reviewer_name}
              </p>
            )}
          </div>

          <div>
            <StarRating
              rating={formData.rating}
              interactive={true}
              onRatingChange={handleRatingChange}
              size="text-2xl"
            />
            <p className="text-muted font-sans text-xs mt-2 mb-4">
              {formData.rating > 0 ? `${formData.rating} out of 5` : 'Select a rating'}
            </p>
            {attemptedSubmit && errors.rating && (
              <p className="text-red-400 font-sans text-xs">
                {errors.rating}
              </p>
            )}
          </div>

          <div>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              rows={4}
              placeholder="Tell us about your experience..."
              className="w-full bg-transparent border-b border-border text-text font-sans text-sm py-3 focus:border-accent focus:outline-none transition-colors placeholder-muted resize-none"
            />
            {attemptedSubmit && errors.comment && (
              <p className="text-red-400 font-sans text-xs mt-2">
                {errors.comment}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ReviewForm;