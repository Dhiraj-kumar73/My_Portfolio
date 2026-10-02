// --- Force Page to Open from Start (Top) ---
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
document.documentElement.scrollTop = 0;
document.body.scrollTop = 0;

// Prevent background scrolling while preloader is active
if (document.querySelector('#preloader')) {
    document.body.style.overflow = 'hidden';
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname + window.location.search);
    }
}

window.addEventListener('pageshow', () => {
    if (document.querySelector('#preloader')) {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }
});

// --- Basic Selectors ---
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const header = document.querySelector('header');
const navLinks = document.querySelectorAll('.navbar a');
const themeToggle = document.querySelector('#theme-toggle');
const body = document.body;

// --- Dark/Light Mode ---
// This function handles switching between themes
const setTheme = (isLight) => {
    if (isLight) {
        body.classList.add('light-mode');
        themeToggle?.classList.replace('fa-moon', 'fa-sun');
    } else {
        body.classList.remove('light-mode');
        themeToggle?.classList.replace('fa-sun', 'fa-moon');
    }
};

// Check if user has a preference saved
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'light') setTheme(true);

if (themeToggle) {
    themeToggle.onclick = () => {
        const isLight = body.classList.toggle('light-mode');
        setTheme(isLight);
        localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
    };
}

// --- Mobile Menu ---
// Open and close the menu on mobile devices
if (menuIcon && navbar) {
    menuIcon.onclick = () => {
        navbar.classList.toggle('active');
        menuIcon.classList.toggle('active');
    };
}

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.onclick = () => {
        navbar?.classList.remove('active');
        menuIcon?.classList.remove('active');
    };
});

// --- Typewriter Effect ---
const typingText = document.querySelector('.typing-text');
if (typingText) {
    const roles = ["Frontend Developer", "React.js Specialist", "BCA Student (9.0+ SGPA)", "UI/UX Designer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function handleTyping() {
        const currentRole = roles[roleIndex];
        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            speed = 2000; // Wait at the end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 500;
        }

        setTimeout(handleTyping, speed);
    }
    handleTyping();
}

// --- Scroll Animations ---
// Using IntersectionObserver to animate elements when they appear on screen
const observerOptions = { threshold: 0.1 };
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            
            // Stagger animation for items inside a container
            const items = entry.target.querySelectorAll('.service-box, .project-box, .skill-item, .info-box, .timeline-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = "1";
                    item.style.transform = "translateY(0)";
                }, index * 100);
            });
            // Stop observing once revealed to prevent jittering loops
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// --- 3D Card Tilt ---
const cards = document.querySelectorAll('.service-box, .skill-box');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
});

// --- Particle Background ---
// Creates a simple floating dot background on the canvas
const canvas = document.getElementById('particles-canvas');
const ctx = canvas?.getContext('2d');

if (canvas && ctx) {
    let particles = [];
    let w, h;

    function initParticles() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        particles = [];
        // Create 80 particles with random positions and speeds
        for (let i = 0; i < 80; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                size: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = getComputedStyle(body).getPropertyValue('--main-color');
        ctx.globalAlpha = 0.2;

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', initParticles);
    initParticles();
    animateParticles();
}

// --- Scroll Effects ---
window.addEventListener('scroll', () => {
    // Scroll Progress Bar Update
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
        scrollProgress.style.width = `${progress}%`;
    }

    // Header background change on scroll
    if (header) {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Active link highlighting based on current section
    let currentSection = "";
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 150) {
            currentSection = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(currentSection)) {
            link.classList.add("active");
        }
    });

    // Back to top button visibility
    const backToTop = document.querySelector('#back-to-top');
    if (backToTop) {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }
});

// --- Live Time in Patna (IST) ---
function updateTime() {
    const timeText = document.getElementById('time-text');
    const timeIcon = document.getElementById('time-icon');
    
    if (timeText && timeIcon) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        });
        timeText.textContent = `${timeString} (Patna, India)`;

        // Update sun/moon icon based on time
        const hour = now.getHours();
        if (hour >= 6 && hour < 18) {
            timeIcon.innerHTML = '<i class="fas fa-sun" style="color: #fbbf24;"></i>';
        } else {
            timeIcon.innerHTML = '<i class="fas fa-moon" style="color: #818cf8;"></i>';
        }
    }
}
setInterval(updateTime, 1000);
updateTime();

// --- Contact Form ---
const contactForm = document.querySelector('.contact-form-card form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalBtnText = btn.innerHTML;
        
        btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                btn.innerHTML = 'Sent! <i class="fas fa-check"></i>';
                btn.classList.add('btn-success');
                contactForm.reset();
                setTimeout(() => {
                    btn.innerHTML = originalBtnText;
                    btn.classList.remove('btn-success');
                    btn.disabled = false;
                }, 3000);
            } else {
                throw new Error('Error');
            }
        } catch (error) {
            btn.innerHTML = 'Failed! <i class="fas fa-times"></i>';
            btn.classList.add('btn-error');
            setTimeout(() => {
                btn.innerHTML = originalBtnText;
                btn.classList.remove('btn-error');
                btn.disabled = false;
            }, 3000);
        }
    });
}

// --- Project & Certificate Modals ---
document.addEventListener('DOMContentLoaded', () => {
    // Project Modal
    const projectModal = document.querySelector('#project-modal');
    if (projectModal) {
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation(); // prevent click from bubbling to window (which closes allProjectsModal)
                const box = e.target.closest('.project-box');
                if (!box) return;
                projectModal.querySelector('#modal-title').textContent = box.dataset.title;
                projectModal.querySelector('#modal-description').textContent = box.dataset.description;
                projectModal.querySelector('#modal-image').src = box.dataset.img;
                projectModal.querySelector('#modal-live').href = box.dataset.live || '#';
                projectModal.querySelector('#modal-github').href = box.dataset.github || '#';

                const tags = projectModal.querySelector('#modal-tags');
                tags.innerHTML = '';
                box.dataset.tech.split(',').forEach(t => {
                    tags.innerHTML += `<span>${t.trim()}</span>`;
                });

                // Close the allProjectsModal if it is open (so project detail modal is on top)
                const allProjectsModal = document.querySelector('#all-projects-modal');
                if (allProjectsModal && allProjectsModal.classList.contains('active')) {
                    allProjectsModal.classList.remove('active');
                }

                projectModal.classList.add('active');
                body.style.overflow = 'hidden';
            };
        });

        projectModal.querySelector('.close-modal').onclick = () => {
            projectModal.classList.remove('active');
            body.style.overflow = 'auto';
        };
    }

    // Certificate Lightbox
    const certModal = document.querySelector('#cert-modal');
    if (certModal) {
        document.querySelectorAll('.cert-card').forEach(card => {
            card.onclick = () => {
                certModal.querySelector('#modal-cert-img').src = card.querySelector('img').src;
                certModal.querySelector('#modal-cert-title').textContent = card.querySelector('h3').textContent;
                certModal.querySelector('#modal-cert-desc').textContent = card.querySelector('p').textContent;
                certModal.classList.add('active');
                body.style.overflow = 'hidden';
            };
        });

        certModal.querySelector('.close-modal').onclick = () => {
            certModal.classList.remove('active');
            body.style.overflow = 'auto';
        };
    }

    // Resume Modal
    const resumeModal = document.querySelector('#resume-modal');
    const resumeBtn = document.querySelector('#resume-btn');
    if (resumeModal && resumeBtn) {
        resumeBtn.onclick = (e) => {
            e.preventDefault();
            resumeModal.classList.add('active');
            body.style.overflow = 'hidden';
        };

        resumeModal.querySelector('.close-modal').onclick = () => {
            resumeModal.classList.remove('active');
            body.style.overflow = 'auto';
        };
    }

    // Close modals when clicking outside
    // Memories/Gallery Modal
    const galleryModal = document.querySelector('#gallery-modal');
    if (galleryModal) {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.onclick = () => {
                const img = item.querySelector('img');
                const tag = item.querySelector('.gallery-tag') || item.querySelector('.gallery-card-badge');
                const title = item.querySelector('h4');
                const desc = item.querySelector('p');

                if (img) galleryModal.querySelector('#modal-gallery-img').src = img.src;
                const modalTag = galleryModal.querySelector('#modal-gallery-tag');
                const modalTitle = galleryModal.querySelector('#modal-gallery-title');
                const modalDesc = galleryModal.querySelector('#modal-gallery-desc');

                if (modalTag && tag) modalTag.textContent = tag.textContent.trim();
                if (modalTitle && title) modalTitle.textContent = title.textContent.trim();
                if (modalDesc && desc) modalDesc.textContent = desc.textContent.trim();

                galleryModal.classList.add('active');
                body.style.overflow = 'hidden';
            };
        });

        galleryModal.querySelector('.close-modal').onclick = () => {
            galleryModal.classList.remove('active');
            body.style.overflow = 'auto';
        };
    }

    // Memories Modal (Direct Recruiter Access - Zero Friction)
    const memoriesModal = document.querySelector('#memories-modal');
    const memoriesBtns = document.querySelectorAll('a[href="#memories"]');
    
    if (memoriesModal) {
        memoriesBtns.forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                memoriesModal.classList.add('active');
                body.style.overflow = 'hidden';
            };
        });

        const memCloseBtn = memoriesModal.querySelector('.close-modal');
        if (memCloseBtn) {
            memCloseBtn.onclick = () => {
                memoriesModal.classList.remove('active');
                body.style.overflow = 'auto';
            };
        }

        // Memories Filters Handler
        const memFilterBtns = memoriesModal.querySelectorAll('.memories-filters .filter-btn');
        const galleryItems = memoriesModal.querySelectorAll('.gallery-container .gallery-item');
        
        memFilterBtns.forEach(btn => {
            btn.onclick = () => {
                memFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterValue = btn.dataset.filter;
                
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.dataset.category === filterValue) {
                        item.style.display = '';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    } else {
                        item.style.display = 'none';
                    }
                });
            };
        });
    }

    // Certificates Modal
    const certificatesModal = document.querySelector('#certificates-modal');
    const viewAllCertsBtn = document.querySelector('#view-all-certs-btn');
    if (certificatesModal && viewAllCertsBtn) {
        viewAllCertsBtn.onclick = () => {
            certificatesModal.classList.add('active');
            body.style.overflow = 'hidden';
        };

        certificatesModal.querySelector('.close-modal').onclick = () => {
            certificatesModal.classList.remove('active');
            body.style.overflow = 'auto';
        };
    }

    // All Services Modal
    const allServicesModal = document.querySelector('#all-services-modal');
    const viewAllServicesBtn = document.querySelector('#view-all-services-btn');

    if (allServicesModal && viewAllServicesBtn) {
        viewAllServicesBtn.onclick = () => {
            allServicesModal.classList.add('active');
            body.style.overflow = 'hidden';
        };

        const closeServicesModalBtn = allServicesModal.querySelector('.close-modal');
        if (closeServicesModalBtn) {
            closeServicesModalBtn.onclick = () => {
                allServicesModal.classList.remove('active');
                body.style.overflow = 'auto';
            };
        }

        allServicesModal.querySelectorAll('.modal-service-cta').forEach(btn => {
            btn.onclick = () => {
                allServicesModal.classList.remove('active');
                body.style.overflow = 'auto';
            };
        });
    }

    // All Projects Modal
    const allProjectsModal = document.querySelector('#all-projects-modal');
    const viewAllProjectsBtn = document.querySelector('#view-all-projects-btn');
    // Click listener bindings are moved to the consolidated handler below

    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === projectModal) {
            projectModal.classList.remove('active');
            body.style.overflow = 'auto';
        }
        if (event.target === certModal) {
            certModal.classList.remove('active');
            body.style.overflow = 'auto';
        }
        if (event.target === resumeModal) {
            resumeModal.classList.remove('active');
            body.style.overflow = 'auto';
        }
        if (event.target === galleryModal) {
            galleryModal.classList.remove('active');
            body.style.overflow = 'auto';
        }
        if (event.target === memoriesModal) {
            memoriesModal.classList.remove('active');
            body.style.overflow = 'auto';
        }
        if (event.target === certificatesModal) {
            certificatesModal.classList.remove('active');
            body.style.overflow = 'auto';
        }
        if (event.target === allProjectsModal) {
            allProjectsModal.classList.remove('active');
            body.style.overflow = 'auto';
        }
        if (event.target === allServicesModal) {
            allServicesModal.classList.remove('active');
            body.style.overflow = 'auto';
        }
    });

    // Certificates Filter Handler
    const filterBtns = document.querySelectorAll('.cert-filters .filter-btn');
    const certCards = document.querySelectorAll('.premium-cert-card');
    
    filterBtns.forEach(btn => {
        btn.onclick = () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to current button
            btn.classList.add('active');
            
            const filterValue = btn.dataset.filter;
            
            certCards.forEach(card => {
                if (filterValue === 'all' || card.dataset.category === filterValue) {
                    card.classList.remove('hide');
                    // Restart animation
                    card.style.animation = 'none';
                    card.offsetHeight; /* trigger reflow */
                    card.style.animation = null;
                } else {
                    card.classList.add('hide');
                }
            });
        };
    });

    // All Projects Modal Filter, Search and Animation Handler
    if (allProjectsModal) {
        const searchInput = allProjectsModal.querySelector('#project-modal-search');
        const projFilterBtns = allProjectsModal.querySelectorAll('.project-filters .filter-btn');
        const projectBoxes = allProjectsModal.querySelectorAll('.project-container .project-box');
        const projectContainer = allProjectsModal.querySelector('.project-container');

        if (viewAllProjectsBtn) {
            viewAllProjectsBtn.onclick = () => {
                allProjectsModal.classList.add('active');
                body.style.overflow = 'hidden';
                // Small delay to allow modal display fade-in before staggered animation starts
                setTimeout(animateProjectBoxes, 100);
            };
        }

        const closeModalBtn = allProjectsModal.querySelector('.close-modal');
        if (closeModalBtn) {
            closeModalBtn.onclick = () => {
                allProjectsModal.classList.remove('active');
                body.style.overflow = 'auto';
                // Reset card animations on close
                projectBoxes.forEach(box => box.classList.remove('animate-show'));
            };
        }

        // Create empty state element inside modal container
        const noProjects = document.createElement('div');
        noProjects.className = 'no-projects-found hide';
        noProjects.style.display = 'none';
        noProjects.innerHTML = `
            <i class="fas fa-search-minus"></i>
            <h3>No Projects Found</h3>
            <p>Try adjusting your search keyword or selected category filter.</p>
        `;
        projectContainer.appendChild(noProjects);

        function animateProjectBoxes() {
            const visibleBoxes = Array.from(projectBoxes).filter(box => !box.classList.contains('hide'));
            visibleBoxes.forEach((box, index) => {
                box.classList.remove('animate-show');
                box.style.transitionDelay = '0s';
                box.offsetHeight; // trigger reflow
                box.style.transitionDelay = `${index * 0.05}s`;
                box.classList.add('animate-show');
            });
        }

        function filterProjects() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const activeFilterBtn = allProjectsModal.querySelector('.project-filters .filter-btn.active');
            const activeCategory = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';
            let visibleCount = 0;

            projectBoxes.forEach(box => {
                const title = box.dataset.title.toLowerCase();
                const description = box.dataset.description.toLowerCase();
                const tech = box.dataset.tech.toLowerCase();
                const category = box.dataset.category || 'all';

                const matchesSearch = title.includes(searchTerm) || 
                                      description.includes(searchTerm) || 
                                      tech.includes(searchTerm);
                
                const matchesFilter = activeCategory === 'all' || category === activeCategory;

                if (matchesSearch && matchesFilter) {
                    box.classList.remove('hide');
                    box.style.display = 'flex';
                    visibleCount++;
                } else {
                    box.classList.add('hide');
                    box.style.display = 'none';
                    box.classList.remove('animate-show');
                }
            });

            if (visibleCount === 0) {
                noProjects.style.display = 'block';
                noProjects.classList.remove('hide');
            } else {
                noProjects.style.display = 'none';
                noProjects.classList.add('hide');
            }

            // Update Dynamic Results Badge
            const countBadge = document.getElementById('archive-count-badge');
            if (countBadge) {
                countBadge.textContent = `Showing ${visibleCount} of ${projectBoxes.length} Projects`;
            }

            animateProjectBoxes();
        }

        if (searchInput) {
            searchInput.addEventListener('input', filterProjects);
        }

        projFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                projFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterProjects();
            });
        });

        // Set initial counter value
        const countBadge = document.getElementById('archive-count-badge');
        if (countBadge) {
            countBadge.textContent = `Showing ${projectBoxes.length} of ${projectBoxes.length} Projects`;
        }
    }
});

// --- Service Card Flip ---
document.querySelectorAll('.service-flip-card').forEach(card => {
    const inner = card.querySelector('.service-card-inner');
    
    // Hover effects for desktop (mouse pointer)
    card.addEventListener('mouseenter', () => {
        inner.classList.add('flipped');
    });
    card.addEventListener('mouseleave', () => {
        inner.classList.remove('flipped');
    });
    
    // Click toggle fallback for touch devices (mobiles/tablets)
    card.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn')) return;
        
        // Only toggle on tap/click if it is a touchscreen device
        if (window.matchMedia("(pointer: coarse)").matches) {
            inner.classList.toggle('flipped');
        }
    });
});

// --- Animated Counter for Quick Stats Bar ---
function initStatsCounters() {
    const statsSection = document.querySelector('.quick-stats-section');
    if (!statsSection) return;

    let started = false;
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !started) {
                started = true;
                const counters = document.querySelectorAll('.stat-info .counter');
                counters.forEach(counter => {
                    const target = parseFloat(counter.getAttribute('data-target'));
                    const isDecimal = target % 1 !== 0;
                    const duration = 1200;
                    const steps = 40;
                    const stepTime = duration / steps;
                    let current = 0;
                    const increment = target / steps;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = isDecimal ? target.toFixed(2) : Math.round(target);
                            clearInterval(timer);
                        } else {
                            counter.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);
                        }
                    }, stepTime);
                });
                statsObserver.unobserve(statsSection);
            }
        });
    }, { threshold: 0.2 });

    statsObserver.observe(statsSection);
}

document.addEventListener('DOMContentLoaded', () => {
    initStatsCounters();

    // Service Card Flip
    document.querySelectorAll('.service-flip-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn') || e.target.closest('.btn')) return;
            const inner = card.querySelector('.service-card-inner');
            if (inner) {
                inner.classList.toggle('flipped');
            }
        });
    });
});


