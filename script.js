// ===== DOM ELEMENTS =====
const langButtons = document.querySelectorAll('.lang-btn');
const modal = document.getElementById('pdf-modal');
const closeBtn = document.querySelector('.close-btn');
const pdfViewer = document.getElementById('pdf-viewer');
const previewButtons = document.querySelectorAll('.preview-btn');
const amazonButtons = document.querySelectorAll('.btn-cart');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// Banner slider elements
const bannerSlides = document.querySelectorAll('.banner-slide');
const bannerControls = document.querySelectorAll('.banner-control');
const bannerIndicators = document.querySelectorAll('.indicator');

// Filter elements
const filterTabs = document.querySelectorAll('.filter-tab');
const bookCards = document.querySelectorAll('.popular-books .book-card');

// Newsletter form
const newsletterForm = document.querySelector('.newsletter-form');
const newsletterInput = document.querySelector('.newsletter-input');

// ===== GLOBAL VARIABLES =====
let currentLanguage = localStorage.getItem('preferred-language') || 'en';
let currentSlide = 0;
let slideInterval;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguage();
    initializeBannerSlider();
    initializeModal();
    initializeFilters();
    initializeNewsletter();
    initializeMobileMenu();
    initializeAnimations();
    initializeAmazonLinks();
    initializeSmoothScroll();
});

// ===== LANGUAGE SYSTEM =====
function initializeLanguage() {
    // Set active language button
    langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLanguage);
    });
    
    // Apply language to all elements
    switchLanguage(currentLanguage);
    
    // Add event listeners to language buttons
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.lang !== currentLanguage) {
                switchLanguage(btn.dataset.lang);
                updateActiveLanguageButton(btn.dataset.lang);
                
                // Save preference
                localStorage.setItem('preferred-language', btn.dataset.lang);
                currentLanguage = btn.dataset.lang;
            }
        });
    });
}

function switchLanguage(lang) {
    // Get all elements with language data attributes
    const elements = document.querySelectorAll('[data-en][data-ua]');
    
    elements.forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            // Smooth transition effect
            element.style.opacity = '0.7';
            
            setTimeout(() => {
                element.textContent = text;
                element.style.opacity = '1';
            }, 150);
        }
    });
    
    // Update placeholder text for inputs
    const inputElements = document.querySelectorAll('[data-en-placeholder][data-ua-placeholder]');
    inputElements.forEach(element => {
        const placeholder = element.getAttribute(`data-${lang}-placeholder`);
        if (placeholder) {
            element.placeholder = placeholder;
        }
    });
    
    // Update Amazon links
    updateAmazonLinks(lang);
    
    // Update document language
    document.documentElement.lang = lang === 'ua' ? 'uk' : 'en';
}

function updateActiveLanguageButton(lang) {
    langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

function updateAmazonLinks(lang) {
    amazonButtons.forEach(btn => {
        const link = btn.getAttribute(`data-amazon-${lang}`);
        if (link) {
            btn.onclick = () => window.open(link, '_blank');
        }
    });
}

// ===== BANNER SLIDER =====
function initializeBannerSlider() {
    if (bannerSlides.length === 0) return;
    
    // Start auto-slide
    startSlideShow();
    
    // Add control listeners
    bannerControls.forEach((control, index) => {
        control.addEventListener('click', () => {
            if (control.classList.contains('next')) {
                nextSlide();
            } else {
                prevSlide();
            }
        });
    });
    
    // Add indicator listeners
    bannerIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Pause on hover
    const bannerSlider = document.querySelector('.banner-slider');
    if (bannerSlider) {
        bannerSlider.addEventListener('mouseenter', pauseSlideShow);
        bannerSlider.addEventListener('mouseleave', startSlideShow);
    }
}

function startSlideShow() {
    slideInterval = setInterval(nextSlide, 5000);
}

function pauseSlideShow() {
    clearInterval(slideInterval);
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % bannerSlides.length;
    updateSlide();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + bannerSlides.length) % bannerSlides.length;
    updateSlide();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlide();
    pauseSlideShow();
    startSlideShow();
}

function updateSlide() {
    // Update slides
    bannerSlides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    // Update indicators
    bannerIndicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// ===== MOBILE MENU =====
function initializeMobileMenu() {
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
}

// ===== FILTERING SYSTEM =====
function initializeFilters() {
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.dataset.filter;
            
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Filter books
            filterBooks(filter);
        });
    });
}

function filterBooks(category) {
    bookCards.forEach(card => {
        const cardCategory = card.dataset.category;
        const shouldShow = category === 'all' || cardCategory === category;
        
        if (shouldShow) {
            card.style.display = 'block';
            card.style.animation = 'slideInUp 0.5s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

// ===== PDF MODAL SYSTEM =====
function initializeModal() {
    // Add click listeners to preview buttons
    previewButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const bookNumber = btn.dataset.book;
            openPDFModal(bookNumber);
        });
    });
    
    // Close modal listeners
    if (closeBtn) {
        closeBtn.addEventListener('click', closePDFModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closePDFModal();
            }
        });
    }
    
    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closePDFModal();
        }
    });
}

function openPDFModal(bookNumber) {
    if (!modal || !pdfViewer) return;
    
    const pdfPath = `assets/book-${bookNumber}-preview-${currentLanguage}.pdf`;
    
    // Add loading state
    modal.classList.add('loading');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Set PDF source
    pdfViewer.src = pdfPath;
    
    // Remove loading state after a brief delay
    setTimeout(() => {
        modal.classList.remove('loading');
    }, 500);
    
    // Add entrance animation
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.animation = 'scaleIn 0.3s ease forwards';
    }
}

function closePDFModal() {
    if (!modal) return;
    
    const modalContent = modal.querySelector('.modal-content');
    
    // Add exit animation
    if (modalContent) {
        modalContent.style.animation = 'scaleOut 0.2s ease forwards';
    }
    
    setTimeout(() => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (pdfViewer) {
            pdfViewer.src = '';
        }
        if (modalContent) {
            modalContent.style.animation = '';
        }
    }, 200);
}

// ===== NEWSLETTER =====
function initializeNewsletter() {
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = newsletterInput.value.trim();
            if (validateEmail(email)) {
                handleNewsletterSubscription(email);
            } else {
                showNotification(
                    currentLanguage === 'en' ? 'Please enter a valid email address.' : 'Будь ласка, введіть правильну електронну адресу.',
                    'error'
                );
            }
        });
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function handleNewsletterSubscription(email) {
    // Show loading state
    const submitBtn = newsletterForm.querySelector('.newsletter-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = currentLanguage === 'en' ? 'Subscribing...' : 'Підписуємося...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification(
            currentLanguage === 'en' ? 'Thank you for subscribing!' : 'Дякуємо за підписку!',
            'success'
        );
        
        newsletterInput.value = '';
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Track subscription for analytics
        trackNewsletterSubscription(email);
    }, 1500);
}

function trackNewsletterSubscription(email) {
    console.log(`Newsletter subscription: ${email}, Language: ${currentLanguage}`);
    // You can integrate with your analytics service here
}

// ===== AMAZON LINKS =====
function initializeAmazonLinks() {
    amazonButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Add click animation
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
            
            // Track click for analytics
            trackAmazonClick(btn);
            
            // Open Amazon link based on current language
            const bookCard = btn.closest('.book-card');
            const bookNumber = getBookNumber(bookCard);
            
            // Simulate Amazon link opening
            const amazonLink = `https://amazon.com/book-${bookNumber}-${currentLanguage}`;
            window.open(amazonLink, '_blank');
        });
    });
}

function getBookNumber(bookCard) {
    // Extract book number from the book card
    const bookImage = bookCard.querySelector('img');
    if (bookImage && bookImage.src) {
        const match = bookImage.src.match(/book-(\d+)/);
        return match ? match[1] : '1';
    }
    return '1';
}

function trackAmazonClick(button) {
    const bookCard = button.closest('.book-card');
    const bookNumber = getBookNumber(bookCard);
    
    console.log(`Amazon link clicked: Book ${bookNumber}, Language: ${currentLanguage}`);
    // You can integrate with Google Analytics, Facebook Pixel, etc. here
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.book-card, .article-card, .section-title, .about-content');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Stagger animation for book cards
    staggerBookCards();
}

function staggerBookCards() {
    const bookCards = document.querySelectorAll('.book-card');
    
    bookCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// ===== SMOOTH SCROLL =====
function initializeSmoothScroll() {
    // Add smooth scrolling to navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        opacity: '0',
        transform: 'translateY(-20px)',
        transition: 'all 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Set background color based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8',
        warning: '#ffc107'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== ERROR HANDLING =====
function handlePDFError(bookNumber) {
    const errorMessage = currentLanguage === 'en' 
        ? 'Sorry, the preview is not available at the moment.' 
        : 'Вибачте, попередній перегляд наразі недоступний.';
    
    if (pdfViewer) {
        pdfViewer.style.display = 'none';
    }
    
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
        modalBody.innerHTML = `
            <div style="padding: 3rem; text-align: center; color: #6c757d;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ffc107; margin-bottom: 1rem;"></i>
                <p style="font-size: 1.1rem; margin-bottom: 2rem;">${errorMessage}</p>
                <button onclick="closePDFModal()" style="padding: 0.8rem 2rem; background: #e74c3c; color: white; border: none; border-radius: 25px; cursor: pointer; font-weight: 600;">
                    ${currentLanguage === 'en' ? 'Close' : 'Закрити'}
                </button>
            </div>
        `;
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initializeAccessibility() {
    // Add ARIA labels
    langButtons.forEach(btn => {
        const lang = btn.dataset.lang === 'en' ? 'English' : 'Ukrainian';
        btn.setAttribute('aria-label', `Switch to ${lang}`);
    });
    
    // Add focus indicators
    const focusableElements = document.querySelectorAll('button, a, input, [tabindex]');
    focusableElements.forEach(el => {
        el.addEventListener('focus', function() {
            this.style.outline = '2px solid #e74c3c';
            this.style.outlineOffset = '2px';
        });
        
        el.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    // Keyboard navigation for slider
    document.addEventListener('keydown', (e) => {
        if (e.target.closest('.banner-slider')) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        }
    });
}

// ===== MOBILE OPTIMIZATIONS =====
function initializeMobileOptimizations() {
    // Touch-friendly interactions
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Improve touch targets
        const touchTargets = document.querySelectorAll('.lang-btn, .preview-btn, .btn-cart, .filter-tab');
        touchTargets.forEach(target => {
            target.style.minHeight = '44px';
            target.style.minWidth = '44px';
        });
        
        // Add touch feedback
        touchTargets.forEach(target => {
            target.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            target.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }
    
    // Prevent zoom on input focus
    const inputs = document.querySelectorAll('input[type="email"], input[type="text"]');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            const viewport = document.querySelector('meta[name=viewport]');
            if (viewport) {
                viewport.setAttribute('content', 
                    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
                );
            }
        });
        
        input.addEventListener('blur', () => {
            const viewport = document.querySelector('meta[name=viewport]');
            if (viewport) {
                viewport.setAttribute('content', 
                    'width=device-width, initial-scale=1.0'
                );
            }
        });
    });
}

// ===== ADDITIONAL CSS ANIMATIONS (ADDED VIA JS) =====
const additionalStyles = `
    @keyframes scaleOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    @media (max-width: 768px) {
        .nav-menu.active {
            display: block;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: white;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            padding: 1rem 0;
            animation: slideDown 0.3s ease forwards;
        }
        
        .nav-menu.active .nav-list {
            flex-direction: column;
            gap: 0;
        }
        
        .nav-menu.active .nav-list li {
            margin: 0;
        }
        
        .nav-menu.active .nav-list a {
            display: block;
            padding: 1rem 2rem;
            border-bottom: 1px solid #f8f9fa;
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// ===== INITIALIZATION (ADDITIONAL) =====
document.addEventListener('DOMContentLoaded', function() {
    initializeAccessibility();
    initializeMobileOptimizations();
    initializeLazyLoading();
});

// ===== GLOBAL ERROR HANDLER =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could implement user-friendly error reporting here
});

// ===== EXPORT FOR TESTING (IF NEEDED) =====
window.NadiaWebsite = {
    switchLanguage,
    openPDFModal,
    closePDFModal,
    nextSlide,
    prevSlide,
    filterBooks,
    currentLanguage: () => currentLanguage
};