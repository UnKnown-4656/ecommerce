# Client Questions & Fixes - NOIR & CO. Website Optimization

## Performance Issues (Lighthouse Score: 89)

### Q1: "Why is the site loading slowly on mobile?"
**Issue:** FCP: 2.7s, LCP: 3.6s (Target: < 1.8s)
**Fix Implemented:**
- Added proper image optimization with `ImageComponent`
- Preload critical hero images with `fetchpriority="high"`
- Optimized font loading with `display=swap` and `media="print"` trick
- Added content-visibility and contain properties to prevent layout shifts

### Q2: "The page jumps around while loading - it's annoying!"
**Issue:** CLS: 0.903 (Should be < 0.1)
**Fix Implemented:**
- Added explicit width/height to all images
- Used `contain: layout style` on product cards
- Added skeleton loaders with proper aspect ratios
- Set `content-visibility: auto` for off-screen content

### Q3: "Images take too long to appear"
**Issue:** Render-blocking resources (910ms savings possible)
**Fix Implemented:**
- Lazy loading for all below-fold images
- Responsive image loading with proper sizes
- WebP/AVIF format support preparation
- ImageComponent with error handling and fallbacks

### Q4: "The site feels sluggish when scrolling"
**Issue:** 3 long main-thread tasks detected
**Fix Implemented:**
- Code splitting with React.lazy() for all pages
- Manual chunking in Vite config
- Removed unnecessary console.log in production
- Optimized event handlers with passive listeners

---

## SEO Issues (Lighthouse Score: 62)

### Q5: "Why isn't my site showing in Google search results?"
**Issue:** Missing meta tags and structured data
**Fix Implemented:**
- Added Open Graph meta tags (og:title, og:description, og:image)
- Added Twitter Card meta tags
- Added structured data (JSON-LD) for Organization
- Set proper meta description and robots tag

### Q6: "Search results don't show product prices or ratings"
**Issue:** No structured data for products
**Fix Needed:** Add Product schema markup (future enhancement)

---

## Accessibility Issues (Score: 96 with warnings)

### Q7: "Screen readers can't identify some buttons"
**Issue:** Buttons without accessible names
**Fix Implemented:**
- Added `aria-label` to all icon buttons (cart, menu, logout)
- Added proper `alt` text to all images
- Associated form labels with inputs

### Q8: "Text is hard to read - not enough contrast"
**Issue:** Background and foreground colors don't have sufficient contrast ratio
**Fix Implemented:**
- Maintained high contrast gold (#b8922e) on dark backgrounds
- Added `prefers-contrast: high` media query support
- Ensured all text meets WCAG AA standards

### Q9: "Can't navigate with keyboard properly"
**Issue:** Missing focus indicators
**Fix Implemented:**
- Added `*:focus-visible` outline styles
- Proper tab order maintained
- Focus ring on interactive elements

---

## Mobile Responsiveness

### Q10: "Hard to use on my phone - buttons are too small"
**Fix Implemented:**
- Minimum touch targets: 44x44px (Apple/Material Design guidelines)
- Increased padding on mobile buttons
- Improved star rating touch targets
- Better spacing for mobile forms

### Q11: "The review form is difficult to fill on mobile"
**Fix Implemented:**
- Responsive padding: `px-4 sm:px-8`
- Larger input fields on mobile
- Better error message positioning
- Touch-friendly star rating (min 2rem size)

---

## Review System Fixes

### Q12: "Review form doesn't work - nothing happens when I submit"
**Issue:** Inconsistent API calls (some used fetch, some used api service)
**Fix Implemented:**
- Standardized all review API calls to use `api` service
- Added proper error handling
- Added success feedback with timeout
- Form validation with user feedback

### Q13: "Reviews look broken on mobile"
**Fix Implemented:**
- Stacked review layout on mobile (`flex-col sm:flex-row`)
- Responsive text sizes (`text-2xl sm:text-[2rem]`)
- Better spacing for mobile (`py-8 sm:py-10`)
- Average rating display optimized for small screens

---

## Build & Caching Optimizations

### Q14: "Why does the site seem slow after updates?"
**Fix Implemented:**
- File hashing for cache busting (`[name].[hash].js`)
- Aggressive caching headers for assets (1 year)
- CSS code splitting enabled
- Terser minification with console stripping

---

## Remaining Optimizations (Future)

1. **Add Product structured data** for rich snippets in search
2. **Implement Service Worker** for offline support
3. **Add WebP/AVIF image format** support
4. **Use Intersection Observer** more extensively for lazy loading
5. **Implement HTTP/2 Server Push** for critical resources
6. **Add resource hints** (dns-prefetch, preconnect) for third-party domains

---

## Testing Checklist

After these fixes, test with:
- [ ] Lighthouse (Mobile & Desktop)
- [ ] PageSpeed Insights
- [ ] WAVE Accessibility Evaluator
- [ ] Screen reader testing (NVDA/Narrator)
- [ ] Mobile device testing (various sizes)
- [ ] Different network speeds (Slow 3G, Fast 3G, 4G)
