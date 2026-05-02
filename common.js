/* ============================================
   OVAL PALACE RESORT — COMMON UTILITIES
   Shared functions for all sub-pages
   ============================================ */

function initPageNavbar() {
    const hamburger = document.getElementById('navHamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileOverlay');
    
    if (!hamburger || !mobileMenu || !overlay) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    overlay.addEventListener('click', closeMobileMenu);
}

function closeMobileMenu() {
    const hamburger = document.getElementById('navHamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileOverlay');

    if (hamburger) hamburger.classList.remove('active');
    if (mobileMenu) mobileMenu.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Global Video Observer for performance
function initVideoObserver() {
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // For lazy-loading videos
                const dataSrc = video.getAttribute('data-src');
                if (dataSrc && !video.src) {
                    video.src = dataSrc;
                    video.load();
                }
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('video').forEach(v => videoObserver.observe(v));
}
