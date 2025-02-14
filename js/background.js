// background.js
document.addEventListener('DOMContentLoaded', function() {
    // Array of your background images
    const backgroundImages = [
        // Add all your image paths here
        '../assets/images/background.png',
        '../assets/images/background2.png',
        '../assets/images/background3.png',
        '../assets/images/background1 (1).jpeg',
        '../assets/images/background1 (2).jpeg',
        '../assets/images/background1 (3).jpeg',
        '../assets/images/background1 (4).jpeg',
        '../assets/images/background1 (5).jpeg',
        '../assets/images/background1 (6).jpeg',
        '../assets/images/background1 (7).jpeg',
        '../assets/images/background2 (1).png',
        '../assets/images/background2 (2).png',
        '../assets/images/background2 (3).png',
        '../assets/images/background2 (4).png',
        '../assets/images/background2 (5).png',
        '../assets/images/background2 (6).png',
        '../assets/images/background2 (7).png',
        '../assets/images/background2 (8).png',
        
        // Add more image paths as needed
    ];

    // Function to get random image
    function getRandomImage() {
        const randomIndex = Math.floor(Math.random() * backgroundImages.length);
        return backgroundImages[randomIndex];
    }

    // Set random background image
    const randomImage = getRandomImage();
    document.documentElement.style.setProperty('--random-background', `url('${randomImage}')`);
});