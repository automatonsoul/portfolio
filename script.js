// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    // Get all main page sections and navigation links
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav-link'); // Original navLinks for scroll/active state
    const backToTopBtn = document.getElementById('backToTopBtn');
    const mainTitle = document.querySelector('nav h1'); // Get the main title element

    // Ensure elements exist before adding listeners
    if (!backToTopBtn) {
        console.error("Back to Top button not found.");
    }
    if (sections.length === 0) {
        console.error("No page sections found.");
    }
    if (navLinks.length === 0) {
        console.error("No navigation links found.");
    }
    if (!mainTitle) {
        console.error("Main title element (nav h1) not found.");
    }

    // --- NEW: Pleasant Load Animations ---
    const elementsToAnimateOnLoad = [
        ...document.querySelectorAll('nav .flex-wrap > .nav-link'), // Spread NodeList into the array
        document.querySelector('#home-section img'),
        document.querySelector('#home-section h2'),
        document.querySelector('#home-section p.text-2xl'), // Tagline
        document.querySelector('#home-section p.text-lg.text-gray-600'), // Description paragraph
        ...document.querySelectorAll('#home-section .flex-col.sm\\:flex-row button, #home-section .flex-col.sm\\:flex-row a.btn-secondary') // Buttons
    ];

    elementsToAnimateOnLoad.forEach((el, index) => {
        if (el) { // Check if the element was found
            el.classList.add('load-hidden'); // Start hidden
            // Set a custom delay for each element
            el.style.setProperty('--animation-load-delay', `${index * 120}ms`); // Stagger by 120ms
            // Add the class to trigger the animation
            el.classList.add('apply-fade-in-up-on-load');
        }
    });
    // --- END: Pleasant Load Animations ---


    // Function to smoothly scroll to a given section ID
    window.scrollToSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.error(`Section with ID "${sectionId}" not found.`);
        }
    }

    // Add click event listeners to navigation buttons to trigger smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.currentTarget.dataset.target;
            if (targetId) {
                scrollToSection(targetId);
            } else {
                console.error("Navigation link is missing data-target attribute.", e.currentTarget);
            }
        });
    });

    const stickyHeaderHeight = 80;
    const observerOptions = {
        root: null,
        rootMargin: `-${stickyHeaderHeight}px 0px 0px 0px`,
        threshold: 0.5
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            const navLinkForSection = document.querySelector(`.nav-link[data-target="${entry.target.id}"]`);
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active-underline'));
                if (navLinkForSection) {
                    navLinkForSection.classList.add('active-underline');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    if (backToTopBtn) {
        window.onscroll = function() {
            if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
                if (!backToTopBtn.classList.contains('show')) {
                    backToTopBtn.classList.add('show');
                }
            } else {
                if (backToTopBtn.classList.contains('show')) {
                    backToTopBtn.classList.remove('show');
                }
            }
        };
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    setTimeout(() => {
        const isActiveLinkPresent = document.querySelector('.nav-link.active-underline');
        if (!isActiveLinkPresent && navLinks.length > 0) {
            const homeLink = document.querySelector('.nav-link[data-target="home-section"]');
            if (homeLink) {
                const homeSection = document.getElementById('home-section');
                if (homeSection) {
                    const rect = homeSection.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top < window.innerHeight - stickyHeaderHeight) {
                        navLinks.forEach(link => link.classList.remove('active-underline'));
                        homeLink.classList.add('active-underline');
                    }
                }
            }
        }
    }, 100);

    if (mainTitle) {
        let colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#F1C40F", "#8E44AD"];
        let colorIndex = 0;
        let scaleUp = true;
        mainTitle.style.transition = "color 0.5s ease-in-out, transform 0.3s ease-in-out";
        setInterval(() => {
            mainTitle.style.color = colors[colorIndex];
            colorIndex = (colorIndex + 1) % colors.length;
            if (scaleUp) {
                mainTitle.style.transform = "scale(1.05)";
            } else {
                mainTitle.style.transform = "scale(1)";
            }
            scaleUp = !scaleUp;
        }, 1000);
        mainTitle.addEventListener('mouseover', () => {
            mainTitle.style.transform = 'rotate(-5deg) scale(1.1)';
        });
        mainTitle.addEventListener('mouseout', () => {
            mainTitle.style.transform = 'rotate(0deg) scale(1)';
        });
    }
});
