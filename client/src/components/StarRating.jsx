import React from 'react';

const StarRating = ({ rating = 0, interactive = false, onRatingChange, size = 'text-base' }) => {
  const renderStar = (starNumber) => {
    const filled = starNumber <= Math.round(rating);
    const starSymbol = filled ? '★' : '☆';
    const starColor = filled ? 'text-[#b8922e]' : 'text-[#2a2a2a]';
    
    if (interactive) {
      return (
        <button
          key={starNumber}
          onClick={() => onRatingChange && onRatingChange(starNumber)}
          className={`${size} ${starColor} hover:text-[#b8922e] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#b8922e] focus:ring-opacity-50`}
          aria-label={`Rate ${starNumber} stars`}
          style={{ 
            fontSize: interactive ? '2rem' : undefined,
            touchAction: 'manipulation',
            minWidth: '2rem',
            minHeight: '2rem',
            padding: '0.25rem'
          }}
        >
          {starSymbol}
        </button>
      );
    }
    
    return (
      <span 
        key={starNumber} 
        className={`${size} ${starColor}`}
        style={{ fontSize: size === 'text-xs' ? '14px' : undefined }}
      >
        {starSymbol}
      </span>
    );
  };

  return (
    <div className={`flex gap-1 ${interactive ? 'flex-row' : ''}`}>
      {[1, 2, 3, 4, 5].map(renderStar)}
    </div>
  );
};

export default StarRating;
