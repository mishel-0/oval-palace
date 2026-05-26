/**
 * Oval Palace — AI Monitoring Tracker
 * Enables real-time navigation tracking and site vitals report to monitor.html
 */

const monitorChannel = new BroadcastChannel('oval_palace_monitor');

// Send initial navigation event
function trackNavigation() {
    // Persistent Overall Views
    let totalViews = localStorage.getItem('oval_total_views') || 0;
    totalViews = parseInt(totalViews) + 1;
    localStorage.setItem('oval_total_views', totalViews);

    const deviceType = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 'Mobile Device' : 'Desktop Station';
    
    // Get simulated/real coordinates
    const coords = { lat: (10.97 + Math.random() * 0.1).toFixed(4), lng: (76.22 + Math.random() * 0.1).toFixed(4) }; // Mocked around Malappuram/Angadipuram area

    const pageData = {
        type: 'NAV_EVENT',
        page: document.title.replace('— Oval Palace Resort', '').trim(),
        path: window.location.pathname.split('/').pop() || 'index.html',
        timestamp: new Date().toLocaleTimeString(),
        device: deviceType,
        coords: coords,
        totalViews: totalViews,
        action: 'LANDED'
    };
    
    monitorChannel.postMessage(pageData);
}

// Track button clicks and interactions
function trackInteractions() {
    document.addEventListener('click', (e) => {
        const target = e.target.closest('a, button');
        if (target) {
            monitorChannel.postMessage({
                type: 'INTERACTION',
                element: (target.innerText || target.ariaLabel || 'Button/Link').trim().replace(/\s+/g, ' '),
                timestamp: new Date().toLocaleTimeString(),
                action: 'CLICKED'
            });
        }
    });
}

// Listen for pings from monitor to stay "alive"
monitorChannel.onmessage = (event) => {
    if (event.data.type === 'PING') {
        monitorChannel.postMessage({ type: 'PONG' });
    }
};

// Initialize tracking
window.addEventListener('load', () => {
    trackNavigation();
    trackInteractions();
});
