import React from 'react';

const StarRating = ({ rating = 0, interactive = false, onRatingChange, size = 'w-5 h-5' }) => {
  const renderStar = (starNumber) => {
    const filled = starNumber <= rating;
    const starColor = filled ? 'text-accent' : 'text-border';
    
    if (interactive) {
      return (
        <button
          key={starNumber}
          onClick={() => onRatingChange && onRatingChange(starNumber)}
          className={`${size} ${starColor} hover:text-accent transition-colors cursor-pointer`}
          aria-label={`Rate ${starNumber} stars`}
        >
          <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        </button>
      );
    }
    
    return (
      <div key={starNumber} className={`${size} ${starColor}`}>
        <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      </div>
    );
  };

  return (
    <div className={`flex gap-1 ${interactive ? 'flex-row' : ''}`}>
      {[1, 2, 3, 4, 5].map(renderStar)}
    </div>
  );
};

export default StarRating;
