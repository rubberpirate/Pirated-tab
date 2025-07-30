// background.js - Enhanced with WebP support
document.addEventListener('DOMContentLoaded', function() {
    // Array of your background images (WebP versions with fallbacks)
    const backgroundImages = [
        {
            webp: '../assets/images/webp/background.webp',
            fallback: '../assets/images/old/background.png'
        },
        {
            webp: '../assets/images/webp/background2.webp',
            fallback: '../assets/images/old/background2.png'
        },
        {
            webp: '../assets/images/webp/background3.webp',
            fallback: '../assets/images/old/background3.png'
        },
        {
            webp: '../assets/images/webp/background1 (1).webp',
            fallback: '../assets/images/old/background1 (1).jpeg'
        },
        {
            webp: '../assets/images/webp/background1 (2).webp',
            fallback: '../assets/images/old/background1 (2).jpeg'
        },
        {
            webp: '../assets/images/webp/background1 (3).webp',
            fallback: '../assets/images/old/background1 (3).jpeg'
        },
        {
            webp: '../assets/images/webp/background1 (5).webp',
            fallback: '../assets/images/old/background1 (5).jpeg'
        },
        {
            webp: '../assets/images/webp/background1 (6).webp',
            fallback: '../assets/images/old/background1 (6).jpeg'
        },
        {
            webp: '../assets/images/webp/background1 (7).webp',
            fallback: '../assets/images/old/background1 (7).jpeg'
        },
        {
            webp: '../assets/images/webp/background2 (1).webp',
            fallback: '../assets/images/old/background2 (1).png'
        },
        {
            webp: '../assets/images/webp/background2 (2).webp',
            fallback: '../assets/images/old/background2 (2).png'
        },
        {
            webp: '../assets/images/webp/background2 (3).webp',
            fallback: '../assets/images/old/background2 (3).png'
        },
        {
            webp: '../assets/images/webp/background2 (5).webp',
            fallback: '../assets/images/old/background2 (5).png'
        },
        {
            webp: '../assets/images/webp/background2 (6).webp',
            fallback: '../assets/images/old/background2 (6).png'
        },
        {
            webp: '../assets/images/webp/background2 (7).webp',
            fallback: '../assets/images/old/background2 (7).png'
        },
        {
            webp: '../assets/images/webp/background2 (8).webp',
            fallback: '../assets/images/old/background2 (8).png'
        }
    ];

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

    // Function to get random image with WebP support
    async function getRandomImage() {
        const randomIndex = Math.floor(Math.random() * backgroundImages.length);
        const imageSet = backgroundImages[randomIndex];
        
        // Check WebP support
        const hasWebPSupport = await supportsWebP();
        
        return hasWebPSupport ? imageSet.webp : imageSet.fallback;
    }

    // Function to preload image and set background
    function loadAndSetBackground(imageSrc) {
        const img = new Image();
        
        img.onload = () => {
            document.documentElement.style.setProperty('--random-background', `url('${imageSrc}')`);
            console.log(`✅ Background loaded: ${imageSrc}`);
        };
        
        img.onerror = () => {
            console.warn(`❌ Failed to load: ${imageSrc}`);
            // If WebP fails, try fallback
            if (imageSrc.includes('.webp')) {
                const fallbackSrc = imageSrc.replace('/webp/', '/old/').replace('.webp', getOriginalExtension(imageSrc));
                loadAndSetBackground(fallbackSrc);
            }
        };
        
        img.src = imageSrc;
    }

    // Helper function to get original extension
    function getOriginalExtension(webpPath) {
        const filename = webpPath.split('/').pop().replace('.webp', '');
        // Try to determine original extension based on filename patterns
        if (filename.includes('background1')) {
            return '.jpeg';
        }
        return '.png';
    }

    // Set random background image with WebP support
    getRandomImage().then(imageSrc => {
        loadAndSetBackground(imageSrc);
    });
});
