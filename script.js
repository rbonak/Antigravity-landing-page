document.addEventListener('DOMContentLoaded', () => {
    
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

    // 2. Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    
    if (cursor) {
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
    }

    // 3. Magnetic Hover Effect for Buttons
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

    // 4. Hero Parallax Effect
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        if (window.scrollY < window.innerHeight) {
            const scrollPos = window.scrollY;
            hero.style.backgroundPosition = `center ${scrollPos * 0.4}px`;
        }
    }, { passive: true });
});