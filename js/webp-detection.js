// Enhanced WebP detection and support script
(function() {
    'use strict';

    // WebP detection function
    function supportsWebP() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    // Add WebP support class to HTML element
    supportsWebP().then((supported) => {
        if (supported) {
            document.documentElement.classList.add('webp');
            console.log('✅ WebP support detected - using optimized images');
        } else {
            document.documentElement.classList.add('no-webp');
            console.log('⚠️ WebP not supported - using fallback images');
        }
    });

    // Additional optimization: preload critical WebP images
    function preloadCriticalImages() {
        // You can add critical images here that should be preloaded
        const criticalImages = [
            'assets/images/webp/background.webp',
            'assets/images/webp/background2.webp',
            'assets/images/webp/background3.webp'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            
            // Only preload if WebP is supported
            supportsWebP().then(supported => {
                if (supported) {
                    document.head.appendChild(link);
                }
            });
        });
    }

    // Run preloading when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', preloadCriticalImages);
    } else {
        preloadCriticalImages();
    }
})();
