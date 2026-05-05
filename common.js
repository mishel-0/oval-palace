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
                observer.unobserve(entry.target);
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
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('video').forEach(v => videoObserver.observe(v));
}

// ==================== PRELOADER MANAGEMENT ====================
function dismissPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('loaded');
        document.body.classList.remove('loading');
        // Small delay to ensure smooth transition before re-enabling scroll
        setTimeout(() => {
            document.body.style.overflow = '';
        }, 800);
    }
}

function initPreloaderInterception() {
    // Dismiss on load
    window.addEventListener('load', dismissPreloader);

    // Safety timeout: 3 seconds
    setTimeout(dismissPreloader, 3000);

    // Intercept internal links to show preloader on navigation
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('http') && !link.hasAttribute('target')) {
            link.addEventListener('click', (e) => {
                const preloader = document.getElementById('preloader');
                if (preloader) {
                    preloader.classList.remove('loaded');
                    document.body.classList.add('loading');
                }
            });
        }
    });
}

// Global Initialization
function initCommon() {
    initPageNavbar();
    initScrollReveal();
    initVideoObserver();
    initPreloaderInterception();
}
