/**
 * Utility Functions Module
 * Contains helper functions used throughout the application
 */
export function formatNotificationDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getMobilePlatform() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(ua)) return "Android";
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return "iOS";
    return "Other";
}

export function openAppWithFallback(uri, fallbackUrl) {
    // ...move your openAppWithFallback code here...
}


function formatNotificationDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
        return 'Just now';
    } else if (diffInHours < 24) {
        return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

function getMobilePlatform() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(ua)) return "Android";
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return "iOS";
    return "Other";
}

function openAppWithFallback(uri, fallbackUrl) {
    const now = Date.now();
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = uri;
    document.body.appendChild(iframe);

    setTimeout(() => {
        if (Date.now() - now < 1500) {
            alert("It looks like the app is not installed. Redirecting to website...");
            window.location.href = fallbackUrl;
        }
    }, 1200);
}

function navigateTo(view) {
    currentView = view;
    
    // Hide all views
    document.querySelectorAll('#appContent > div, #adminContent > div').forEach(div => {
        div.style.display = 'none';
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show the selected view
    const viewElement = document.getElementById(`${view}View`);
    if (viewElement) {
        viewElement.style.display = 'block';
    }
    
    // Load data if needed
    // ... (data loading logic)
}

export {
    formatNotificationDate,
    getMobilePlatform,
    openAppWithFallback,
    navigateTo
};