/* ============================================
    OVAL PALACE RESORT — CENTRAL PERFORMANCE ENGINE
    Shared high-performance logic for all pages
    ============================================ */

// 1. ICON THROTTLING
let lucideThrottleTimer;
function refreshIcons() {
    if (typeof lucide === 'undefined') return;
    clearTimeout(lucideThrottleTimer);
    lucideThrottleTimer = setTimeout(() => {
        lucide.createIcons();
    }, 100);
}

// 2. NAVIGATION & NAVBAR
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('navHamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileOverlay');

    if (!navbar || !hamburger) return;

    // Mobile Toggle
    hamburger.onclick = () => {
        hamburger.classList.toggle('active');
        if (mobileMenu) mobileMenu.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
        document.body.style.overflow = (mobileMenu && mobileMenu.classList.contains('active')) ? 'hidden' : '';
    };

    if (overlay) {
        overlay.onclick = () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        };
    }

    // Scroll States (Throttled with rAF)
    let lastScrollY = 0;
    let ticking = false;
    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (lastScrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// 3. UNIVERSAL INTERSECTION OBSERVER (THE BRAIN)
function initUniversalObserver() {
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px 400px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;

            if (entry.isIntersecting) {
                // A. Reveal Animations
                if (el.classList.contains('reveal')) {
                    el.classList.add('visible');
                    observer.unobserve(el); // Kill task after finish
                }

                // B. Lazy Loading (Images & Videos)
                const lazyAsset = el.dataset.src ? el : el.querySelector('[data-src]');
                if (lazyAsset && !lazyAsset.src) {
                    if (lazyAsset.tagName === 'VIDEO') {
                        lazyAsset.src = lazyAsset.dataset.src;
                        lazyAsset.load();
                        lazyAsset.addEventListener('canplay', () => {
                            const loader = lazyAsset.parentElement.querySelector('.video-loader');
                            if (loader) loader.classList.add('hidden');
                            lazyAsset.classList.add('loaded');
                        }, { once: true });

                        lazyAsset.addEventListener('error', () => {
                            const loader = lazyAsset.parentElement.querySelector('.video-loader');
                            if (loader) loader.classList.add('hidden');
                            lazyAsset.classList.add('load-error');
                        }, { once: true });
                    } else {
                        lazyAsset.src = lazyAsset.dataset.src;
                        lazyAsset.onload = () => {
                            lazyAsset.classList.add('loaded');
                            // Sync with resort-overview.css expectations
                            if (el.classList.contains('ig-post')) {
                                el.classList.add('img-loaded');
                            }
                        };
                    }
                    if (el === lazyAsset) observer.unobserve(el);
                }

                // C. Autoplay Management
                if (el.tagName === 'VIDEO') {
                    el.play().catch(() => {});
                }
            } else {
                // Pause videos off-screen to save CPU/Battery
                if (el.tagName === 'VIDEO') {
                    el.pause();
                }
            }
        });
    }, observerOptions);

    // Observe everything important
    document.querySelectorAll('.reveal, [data-src], video.lazy, .ig-post').forEach(el => {
        observer.observe(el);
    });
}

// 4. PERFORMANCE HACKS
function initPerformanceHacks() {
    let scrollTimer;
    let isScrolling = false;

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            isScrolling = true;
            document.body.classList.add('is-scrolling');
        }
        
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            isScrolling = false;
            document.body.classList.remove('is-scrolling');
        }, 150);
    }, { passive: true });

    // Preloader masking
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('loaded');
            document.body.classList.remove('loading');
        });
        setTimeout(() => preloader.classList.add('loaded'), 3000); // Safety timeout
    }
}

// 6. VIDEO MODAL ENGINE
function openVideoModal(videoSrc, isPortrait = false) {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    const content = modal ? modal.querySelector('.modal-content') : null;
    if (!modal || !video) return;

    const source = video.querySelector('source');
    source.src = videoSrc;
    video.load();
    
    // Set aspect ratio class
    if (content) {
        if (isPortrait) {
            content.classList.add('portrait');
        } else {
            content.classList.remove('portrait');
        }
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Professional delay for transition sync
    setTimeout(() => {
        video.play().catch(e => console.log("Auto-play blocked:", e));
    }, 100);
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    if (!modal || !video) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Cleanup after transition
    setTimeout(() => {
        video.pause();
        video.currentTime = 0;
    }, 400);
}

// 7. BOOTSTRAP
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initUniversalObserver();
    initPerformanceHacks();
    refreshIcons();

    // Portal Logic: Move modal to body root to escape containment
    const videoModal = document.getElementById('videoModal');
    if (videoModal && videoModal.parentElement !== document.body) {
        document.body.appendChild(videoModal);
    }
});

// Helper for page-specific scripts to refresh observers if they inject dynamic content
window.refreshObservers = initUniversalObserver;
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;
