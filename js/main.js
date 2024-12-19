// Version checking
const CURRENT_VERSION = '1.0.0';
const VERSION_CHECK_URL = 'https://api.github.com/repos/Barrack-code/Unity-3D/releases/latest';

async function checkForUpdates() {
    try {
        const response = await fetch(VERSION_CHECK_URL);
        const data = await response.json();
        const latestVersion = data.tag_name.replace('v', '');
        
        const updateMessage = document.getElementById('update-message');
        if (compareVersions(latestVersion, CURRENT_VERSION) > 0) {
            updateMessage.textContent = ' New version available! Click to download the latest version.';
            updateMessage.style.cursor = 'pointer';
            updateMessage.onclick = () => {
                window.location.href = '#download';
            };
        } else {
            updateMessage.textContent = ' You have the latest version!';
        }
    } catch (error) {
        console.error('Error checking for updates:', error);
    }
}

function compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < 3; i++) {
        if (parts1[i] > parts2[i]) return 1;
        if (parts1[i] < parts2[i]) return -1;
    }
    return 0;
}

// Review submission
async function submitReview(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const review = {
        name: formData.get('name'),
        email: formData.get('email'),
        rating: formData.get('rating'),
        review: formData.get('review'),
        submit_date: new Date().toLocaleString(),
        game_version: CURRENT_VERSION
    };

    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    try {
        await emailjs.send(
            'service_9ksvzo6', 
            'template_pny1z0v', 
            {
                from_name: review.name,
                from_email: review.email,
                rating: review.rating,
                review: review.review,
                game_version: review.game_version,
                submit_date: review.submit_date
            },
            '6uqU4ivTVsTCYd3lJ'
        );

        // Show success message
        alert('Thank you for your review! Your feedback helps us improve the game.');
        event.target.reset();
    } catch (error) {
        console.error('Error sending review:', error);
        alert('Sorry, there was an error submitting your review. Please try again later.');
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Initialize EmailJS
(function() {
    emailjs.init('6uqU4ivTVsTCYd3lJ');
})();

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkForUpdates();
});
