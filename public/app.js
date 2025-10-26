// X Long Post - PWA JavaScript

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.error('Service Worker registration failed:', err));
    });
}

// DOM Elements
const postText = document.getElementById('postText');
const charCount = document.getElementById('charCount');
const previewBtn = document.getElementById('previewBtn');
const postBtn = document.getElementById('postBtn');
const previewSection = document.getElementById('previewSection');
const previewContent = document.getElementById('previewContent');
const closePreview = document.getElementById('closePreview');
const statusMessage = document.getElementById('statusMessage');
const loadingOverlay = document.getElementById('loadingOverlay');

// State
let currentPreview = null;

// Character count update
postText.addEventListener('input', () => {
    const count = postText.value.length;
    charCount.textContent = count.toLocaleString();

    // Enable/disable buttons
    const hasText = count > 0;
    previewBtn.disabled = !hasText;
    postBtn.disabled = !hasText;
});

// Preview thread
previewBtn.addEventListener('click', async () => {
    const text = postText.value.trim();
    if (!text) return;

    try {
        showLoading(false);
        const response = await fetch('/api/preview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to preview');
        }

        hideLoading();
        displayPreview(data.tweets);
        showStatus(`Preview ready: ${data.count} tweet${data.count > 1 ? 's' : ''}`, 'success');

    } catch (error) {
        hideLoading();
        showStatus(error.message, 'error');
    }
});

// Post thread
postBtn.addEventListener('click', async () => {
    const text = postText.value.trim();
    if (!text) return;

    // Confirm before posting
    const confirm = window.confirm('Are you sure you want to post this thread to Twitter?');
    if (!confirm) return;

    try {
        showLoading(true);
        const response = await fetch('/api/post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to post');
        }

        hideLoading();
        showStatus(`Successfully posted ${data.count} tweet${data.count > 1 ? 's' : ''}!`, 'success');

        // Clear textarea
        postText.value = '';
        charCount.textContent = '0';

        // Show success with link
        setTimeout(() => {
            const viewOnTwitter = window.confirm('Thread posted! Would you like to view it on Twitter?');
            if (viewOnTwitter) {
                window.open(data.url, '_blank');
            }
        }, 500);

        // Hide preview
        previewSection.classList.add('hidden');

    } catch (error) {
        hideLoading();
        showStatus(error.message, 'error');
    }
});

// Close preview
closePreview.addEventListener('click', () => {
    previewSection.classList.add('hidden');
});

// Display preview
function displayPreview(tweets) {
    previewContent.innerHTML = '';

    tweets.forEach((tweet, index) => {
        const tweetDiv = document.createElement('div');
        tweetDiv.className = 'tweet-preview';

        const numberBadge = document.createElement('div');
        numberBadge.className = 'tweet-number';
        numberBadge.textContent = `${index + 1}/${tweets.length}`;

        const textDiv = document.createElement('div');
        textDiv.className = 'tweet-text';
        textDiv.textContent = tweet;

        const charCountDiv = document.createElement('div');
        charCountDiv.className = 'tweet-char-count';
        charCountDiv.textContent = `${tweet.length} characters`;

        tweetDiv.appendChild(numberBadge);
        tweetDiv.appendChild(textDiv);
        tweetDiv.appendChild(charCountDiv);

        previewContent.appendChild(tweetDiv);
    });

    previewSection.classList.remove('hidden');

    // Scroll to preview
    setTimeout(() => {
        previewSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Show status message
function showStatus(message, type = 'success') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;

    // Auto-hide after 5 seconds
    setTimeout(() => {
        statusMessage.classList.add('hidden');
    }, 5000);
}

// Show/hide loading
function showLoading(isPosting = false) {
    const message = isPosting ? 'Posting your thread...' : 'Loading preview...';
    loadingOverlay.querySelector('p').textContent = message;
    loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    loadingOverlay.classList.add('hidden');
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + Enter to post
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!postBtn.disabled) {
            postBtn.click();
        }
    }

    // Cmd/Ctrl + P to preview
    if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        if (!previewBtn.disabled) {
            previewBtn.click();
        }
    }
});

// Prevent accidental page leave
window.addEventListener('beforeunload', (e) => {
    if (postText.value.trim().length > 0) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// iOS specific: Prevent pull-to-refresh when textarea is focused
let startY = 0;
postText.addEventListener('touchstart', (e) => {
    startY = e.touches[0].pageY;
}, { passive: true });

postText.addEventListener('touchmove', (e) => {
    const currentY = e.touches[0].pageY;
    if (postText.scrollTop === 0 && currentY > startY) {
        e.preventDefault();
    }
}, { passive: false });

// Auto-save to localStorage
const STORAGE_KEY = 'x-long-post-draft';

// Load saved draft
const savedDraft = localStorage.getItem(STORAGE_KEY);
if (savedDraft) {
    postText.value = savedDraft;
    postText.dispatchEvent(new Event('input'));
}

// Save draft on input
let saveTimeout;
postText.addEventListener('input', () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, postText.value);
    }, 1000);
});

// Clear draft on successful post
window.addEventListener('postSuccess', () => {
    localStorage.removeItem(STORAGE_KEY);
});

console.log('X Long Post PWA loaded successfully!');
