// Version checking
const CURRENT_VERSION = '1.0.0';
const VERSION_CHECK_URL = 'https://api.github.com/repos/Barrack-code/Unity-3D/releases/latest';

// EmailJS Configuration
const EMAILJS_CONFIG = {
    serviceId: 'service_9ksvzo6',    // Confirmed service ID
    templateId: 'template_97xs7li',  // Confirmed template ID
    publicKey: '6uqU4ivTVsTCYd3lJ'  // Confirmed public key
};

// Modal handling
function showModal(title, message) {
    const modal = document.getElementById('feedback-modal');
    if (!modal) {
        console.error('Modal element not found!');
        alert(message); // Fallback to alert if modal not found
        return;
    }
    
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    
    if (modalTitle) modalTitle.textContent = title;
    if (modalMessage) modalMessage.textContent = message;
    
    modal.style.display = 'block';
    console.log('Modal displayed:', { title, message });
}

function hideModal() {
    const modal = document.getElementById('feedback-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function setupModalListeners() {
    const modal = document.getElementById('feedback-modal');
    const closeBtn = document.getElementById('close-modal');
    const submitAnotherBtn = document.getElementById('submit-another');
    const form = document.getElementById('review-form');

    if (!modal || !closeBtn || !submitAnotherBtn || !form) {
        console.error('Required elements not found:', {
            modal: !!modal,
            closeBtn: !!closeBtn,
            submitAnotherBtn: !!submitAnotherBtn,
            form: !!form
        });
        return;
    }

    closeBtn.onclick = hideModal;
    submitAnotherBtn.onclick = () => {
        hideModal();
        form.reset();
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            hideModal();
        }
    };

    // Add form submit handler
    form.onsubmit = submitReview;
    console.log('Modal listeners and form handler set up');
}

async function submitReview(event) {
    event.preventDefault();
    console.log('Review submission started');
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Show loading state
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<span class="loading-spinner"></span>Sending...';
    submitButton.disabled = true;

    try {
        const formData = new FormData(form);
        const templateParams = {
            from_name: formData.get('name'),
            from_email: formData.get('email'),
            rating: formData.get('rating'),
            review: formData.get('review'),
            game_version: CURRENT_VERSION,
            submit_date: new Date().toLocaleString()
        };

        console.log('Sending review with params:', templateParams);

        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams,
            EMAILJS_CONFIG.publicKey
        );

        console.log('EmailJS Response:', response);

        if (response.status === 200) {
            showModal(
                'Review Submitted!',
                'Thank you for your review! Your feedback helps us improve the game.'
            );
            form.reset();
        } else {
            throw new Error('Failed to send email');
        }
    } catch (error) {
        console.error('Error sending review:', error);
        showModal(
            'Error',
            'Sorry, there was an error submitting your review. Please try again later.'
        );
    } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

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

// Initialize EmailJS
(function() {
    try {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('EmailJS initialized with public key:', EMAILJS_CONFIG.publicKey);
    } catch (error) {
        console.error('Failed to initialize EmailJS:', error);
    }
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, setting up...');
    setupModalListeners();
    checkForUpdates();
});
