import { useState } from 'react';

const ImageComponent = ({ 
  src, 
  alt, 
  className = '', 
  loading = 'lazy',
  width,
  height,
  ...props 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = (e) => {
    setLoaded(true);
    if (props.onLoad) props.onLoad(e);
  };

  const handleError = (e) => {
    setError(true);
    if (props.onError) props.onError(e);
    else e.target.src = 'https://placehold.co/600x800/111/1e1e1e?text=NOIR';
  };

  // For external images, we might want to use a CDN or image optimization service
  const getImageUrl = (source) => {
    if (!source) return 'https://placehold.co/600x800/111/1e1e1e?text=NOIR';
    
    // If it's already an http link, return as is (assuming it's optimized)
    if (source.startsWith('http')) {
      return source;
    }
    
    // For local images, use the server URL
    return `https://ecommerce-ahmv.onrender.com${source}`;
  };

  const imageSrc = getImageUrl(src);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} ${!loaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      loading={loading}
      width={width}
      height={height}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
};

export default ImageComponent;