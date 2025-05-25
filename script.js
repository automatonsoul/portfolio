// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    // Get all main page sections and navigation links
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav-link');
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

    // Function to smoothly scroll to a given section ID
    // Made global for the inline onclick attribute in HTML, or can be refactored.
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
            e.preventDefault(); // Prevent default button behavior
            const targetId = e.currentTarget.dataset.target;
            if (targetId) {
                scrollToSection(targetId);
            } else {
                console.error("Navigation link is missing data-target attribute.", e.currentTarget);
            }
        });
    });

    // Intersection Observer for dynamically underlining active navigation links
    // Sticky header height, adjust if it changes.
    const stickyHeaderHeight = 80; // Assuming nav is 80px tall
    const observerOptions = {
        root: null, // The viewport is the root
        rootMargin: `-${stickyHeaderHeight}px 0px 0px 0px`, // Adjust for sticky header
        threshold: 0.5 // Section is "active" when 50% of IT (below header) is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            const navLink = document.querySelector(`.nav-link[data-target="${entry.target.id}"]`);
            if (entry.isIntersecting) {
                // When a section is intersecting, remove active class from all
                navLinks.forEach(link => link.classList.remove('active-underline'));
                // Add active class to the corresponding nav link
                if (navLink) {
                    navLink.classList.add('active-underline');
                }
            }
            // No 'else' needed here because we only want to highlight the *current* active section.
            // The active class is removed from all links before being added to the intersecting one.
        });
    }, observerOptions);

    // Observe each main section for changes in visibility
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Logic for showing/hiding the Back to Top button based on scroll position
    if (backToTopBtn) {
        window.onscroll = function() {
            // Show button if scrolled more than 200px
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

        // Click listener for the Back to Top button
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Initial active navigation link setting:
    // The IntersectionObserver should handle this correctly on load if a section is in view.
    // Small delay to allow observer to fire first, then check if any link is active.
    // If not (e.g. page loaded at very top before observer threshold met for home), activate home.
    setTimeout(() => {
        const isActiveLinkPresent = document.querySelector('.nav-link.active-underline');
        if (!isActiveLinkPresent && navLinks.length > 0) {
            const homeLink = document.querySelector('.nav-link[data-target="home-section"]');
            if (homeLink) {
                 // Check if home section is actually visible before forcing active state
                const homeSection = document.getElementById('home-section');
                if (homeSection) {
                    const rect = homeSection.getBoundingClientRect();
                    // A simple check if the top of the home section is near the top of the viewport
                    // (considering the sticky header)
                    if (rect.top >= 0 && rect.top < window.innerHeight - stickyHeaderHeight) {
                         navLinks.forEach(link => link.classList.remove('active-underline')); // Clear any other
                         homeLink.classList.add('active-underline');
                    }
                }
            }
        }
    }, 100); // 100ms delay

    // "Crazy" animation for the main title
    if (mainTitle) {
        let colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#F1C40F", "#8E44AD"];
        let colorIndex = 0;
        let scaleUp = true;

        mainTitle.style.transition = "color 0.5s ease-in-out, transform 0.3s ease-in-out"; // Smooth transitions

        setInterval(() => {
            // Change color
            mainTitle.style.color = colors[colorIndex];
            colorIndex = (colorIndex + 1) % colors.length;

            // Pulse effect
            if (scaleUp) {
                mainTitle.style.transform = "scale(1.05)";
            } else {
                mainTitle.style.transform = "scale(1)";
            }
            scaleUp = !scaleUp;

        }, 1000); // Change every 1 second

        // Make it wiggle on mouseover
        mainTitle.addEventListener('mouseover', () => {
            mainTitle.style.transform = 'rotate(-5deg) scale(1.1)';
        });
        mainTitle.addEventListener('mouseout', () => {
            mainTitle.style.transform = 'rotate(0deg) scale(1)';
        });
    }
});
