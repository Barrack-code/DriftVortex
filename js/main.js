// Version checking
const CURRENT_VERSION = '1.0.0';
const VERSION_CHECK_URL = 'https://api.github.com/repos/Barrack-code/Unity-3D/releases/latest';

// EmailJS Configuration
const EMAILJS_CONFIG = {
    serviceId: 'service_9ksvzo6',
    templateId: 'template_97xs7li',
    publicKey: '6uqU4ivTVsTCYd3lJ'
};

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey);

// Form submission handler
async function submitReview(event) {
    event.preventDefault();
    
    const submitButton = document.querySelector('#review-form button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="loading-spinner"></span> Sending...';
    submitButton.disabled = true;
    
    const formData = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        rating: document.querySelector('input[name="rating"]:checked').value,
        message: document.getElementById('review').value,
        to_email: 'Barrackmulumba@gmail.com'
    };

    try {
        console.log('Sending review to:', formData.to_email);
        console.log('Review data:', formData);
        
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            formData
        );
        
        console.log('Email sent successfully:', response);
        showModal('Success!', 'Thank you for your review! We appreciate your feedback.');
        document.getElementById('review-form').reset();
    } catch (error) {
        console.error('Failed to send email:', error);
        showModal('Error', 'Sorry, there was a problem sending your review. Please try again.');
    } finally {
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    }
}

// Modal handling
function showModal(title, message) {
    const modal = document.getElementById('feedback-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.style.display = 'block';
    
    // Close modal handlers
    const closeBtn = document.getElementById('close-modal');
    const submitAnother = document.getElementById('submit-another');
    
    closeBtn.onclick = () => modal.style.display = 'none';
    submitAnother.onclick = () => {
        modal.style.display = 'none';
        document.getElementById('review-form').reset();
    };
    
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Star rating handler
document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star-rating input');
    stars.forEach(star => {
        star.addEventListener('change', function() {
            document.querySelectorAll('.star-rating label').forEach(label => {
                label.classList.remove('active');
            });
            this.parentElement.querySelector(`label[for="${this.id}"]`).classList.add('active');
        });
    });
});

// Modal handling
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, setting up...');
    setupModalListeners();
    checkForUpdates();
});
