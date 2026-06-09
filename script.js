document.addEventListener('DOMContentLoaded', () => {
    // === DOM ELEMENTS ===
    const body = document.body;
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scroll-progress');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    const mobileToggleBtn = document.getElementById('mobile-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-message');
    const backToTopBtn = document.getElementById('back-to-top');

    // === THEME MANAGER ===
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    
    // Set initial theme
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        themeIcon.className = 'fa-solid fa-sun';
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        themeIcon.className = 'fa-solid fa-moon';
    }

    // Toggle theme
    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            themeIcon.className = 'fa-solid fa-sun';
            localStorage.setItem('portfolio-theme', 'light');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            themeIcon.className = 'fa-solid fa-moon';
            localStorage.setItem('portfolio-theme', 'dark');
        }
    });

    // === SCROLL EVENTS (Header Scroll, Scroll Progress & Back to Top) ===
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolledPercentage = (scrollTop / docHeight) * 100;

        // Header styles on scroll
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll progress bar
        scrollProgress.style.width = `${scrolledPercentage}%`;

        // Back to top button visibility
        if (scrollTop > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top action
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // === MOBILE MENU TOGGLER ===
    mobileToggleBtn.addEventListener('click', () => {
        navbar.classList.toggle('active');
        const isOpened = navbar.classList.contains('active');
        mobileToggleBtn.querySelector('i').className = isOpened ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            mobileToggleBtn.querySelector('i').className = 'fa-solid fa-bars';
        });
    });

    // === INTERSECTION OBSERVER FOR FADE-IN REVEAL ===
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, revealOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => revealObserver.observe(el));

    // === PROJECT FILTER SYSTEM ===
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to current button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // === CONTACT FORM HANDLE ===
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            const submitBtn = document.getElementById('submit-btn');

            // Basic Client Side Validation
            if (!nameInput.value.trim() || !emailInput.value.trim() || !subjectInput.value.trim() || !messageInput.value.trim()) {
                showFeedback('Please fill out all fields.', 'error');
                return;
            }

            // Simulate sending process
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-circle-notch fa-spin"></i>';

            setTimeout(() => {
                // Reset state
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <i class="fa-regular fa-paper-plane"></i>';
                
                // Show success status
                showFeedback(`Thank you, ${nameInput.value.trim()}! Your message has been sent successfully.`, 'success');
                
                // Reset form inputs
                contactForm.reset();
            }, 1500);
        });

        function showFeedback(message, status) {
            formFeedback.textContent = message;
            formFeedback.className = `form-feedback-msg ${status}`;
            formFeedback.style.display = 'block';

            // Auto hide error message after 5 seconds, keep success visible longer
            if (status === 'error') {
                setTimeout(() => {
                    formFeedback.style.display = 'none';
                }, 5000);
            }
        }
    }
});
