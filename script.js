document.addEventListener('DOMContentLoaded', () => {
    
    // Check user preferences for touch and reduced motion
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Intersection Observer for Scroll Animations
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Custom Cursor Logic (Only on mouse/desktop devices without reduced motion)
    const cursor = document.querySelector('.custom-cursor');
    
    if (cursor && !isTouchDevice && !prefersReducedMotion) {
        // Move cursor
        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
            
            // Show cursor on first move
            if (cursor.classList.contains('hidden')) {
                cursor.classList.remove('hidden');
            }
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.classList.add('hidden');
        });
        document.addEventListener('mouseenter', () => {
            cursor.classList.remove('hidden');
        });

        // Hover effects on clickable elements
        const interactables = document.querySelectorAll('a, button, .interactable');
        
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });
    } else if (cursor) {
        // Hide artificial cursor on mobile/touch screens or reduced motion
        cursor.style.display = 'none';
    }

    // 3. Magnetic Hover Effect for Buttons (Disabled if reduced motion is requested)
    if (!prefersReducedMotion && !isTouchDevice) {
        const magneticElements = document.querySelectorAll('.magnetic');
        
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                // Calculate distance from center of element
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Move element slightly towards cursor (magnetic pull)
                el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            el.addEventListener('mouseleave', () => {
                // Reset position with a spring-like ease
                el.style.transform = 'translate(0px, 0px)';
                el.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                
                // Remove transition after it's done so it doesn't interfere with the magnetic pull next time
                setTimeout(() => {
                    el.style.transition = 'transform 0.1s linear';
                }, 500);
            });
            
            // Initial setup for fast tracking when moving
            el.style.transition = 'transform 0.1s linear';
        });
    }

    // 4. Hero Parallax Effect (Optimized with requestAnimationFrame)
    const hero = document.querySelector('.hero');
    if (hero && !prefersReducedMotion) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking && window.scrollY < window.innerHeight) {
                window.requestAnimationFrame(() => {
                    hero.style.backgroundPosition = `center ${window.scrollY * 0.4}px`;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // 5. Mobile Menu Drawer Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-menu-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-nav-item, .mobile-cta');

    if (mobileBtn && mobileDrawer) {
        mobileBtn.addEventListener('click', () => {
            const isOpen = mobileDrawer.classList.toggle('open');
            mobileBtn.setAttribute('aria-expanded', isOpen);
            mobileDrawer.setAttribute('aria-hidden', !isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close drawer when any nav link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.remove('open');
                mobileBtn.setAttribute('aria-expanded', 'false');
                mobileDrawer.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            });
        });
    }
});