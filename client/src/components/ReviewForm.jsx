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
      setErrors({});
      setAttemptedSubmit(false);

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

      // Refresh reviews list
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
    <div className="bg-[#0a0a0a] w-full py-20 px-8 max-w-5xl mx-auto border-t border-[#1e1e1e] pt-16 mt-16">
      {/* Section Heading */}
      <div className="mb-8">
        <h2 className="font-serif text-[#e8e0d4] text-[2rem] font-light mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          Share Your Experience
        </h2>
        <div className="h-px bg-[#b8922e] w-10"></div>
      </div>

      {showSuccess ? (
        <div className="text-center py-16 opacity-0 animate-fade-in" style={{ animation: 'fadeIn 0.5s forwards' }}>
          <p className="font-serif italic text-[#b8922e] text-[1.5rem]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            ✦ Thank you. Your review has been published.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Input */}
          <div>
            <input
              type="text"
              name="reviewer_name"
              value={formData.reviewer_name}
              onChange={handleInputChange}
              className="w-full bg-transparent border-none border-b border-[#333] text-[#e8e0d4] font-sans text-sm py-3 focus:border-[#b8922e] focus:outline-none transition-colors placeholder-[#333]"
              placeholder="Your Name"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
            {attemptedSubmit && errors.reviewer_name && (
              <p className="text-[#c0392b] font-sans text-xs mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                {errors.reviewer_name}
              </p>
            )}
          </div>

          {/* Interactive Star Picker */}
          <div>
            <StarRating
              rating={formData.rating}
              interactive={true}
              onRatingChange={handleRatingChange}
              size="text-2xl"
            />
            <div className="text-[#555] font-sans text-xs mt-2 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              {formData.rating > 0 ? `${formData.rating} out of 5` : 'Select a rating'}
            </div>
            {attemptedSubmit && errors.rating && (
              <p className="text-[#c0392b] font-sans text-xs mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                {errors.rating}
              </p>
            )}
          </div>

          {/* Comment Textarea */}
          <div>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              rows={4}
              className="w-full bg-transparent border-none border-b border-[#333] text-[#e8e0d4] font-sans text-sm py-3 focus:border-[#b8922e] focus:outline-none transition-colors placeholder-[#333] resize-none"
              placeholder="Tell us about your experience..."
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
            {attemptedSubmit && errors.comment && (
              <p className="text-[#c0392b] font-sans text-xs mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                {errors.comment}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#b8922e] text-[#0a0a0a] py-4 font-sans text-xs tracking-[0.3em] transition-colors duration-300 hover:bg-[#d4aa50] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Inter, sans-serif', borderRadius: '0' }}
          >
            {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ReviewForm;
