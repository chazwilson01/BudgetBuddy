// Preconnect to required origins
export const preconnectToOrigins = () => {
    const origins = [
        'https://api.plaid.com',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
    ];

    origins.forEach(origin => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = origin;
        document.head.appendChild(link);
    });
};

// Lazy load images
export const lazyLoadImages = () => {
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
};

// Defer non-critical CSS
export const deferNonCriticalCSS = () => {
    const styles = document.querySelectorAll('link[rel="stylesheet"]');
    styles.forEach(style => {
        if (!style.media) {
            style.media = 'print';
            style.onload = () => {
                style.media = 'all';
            };
        }
    });
};

// Initialize performance optimizations
export const initPerformanceOptimizations = () => {
    preconnectToOrigins();
    lazyLoadImages();
    deferNonCriticalCSS();
}; 