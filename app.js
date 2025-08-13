// Solidarity Website Presentation JavaScript
class PresentationApp {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 12;
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateSlideCounter();
        this.updateNavigationButtons();
        this.setupKeyboardNavigation();
        this.animateProgressBars();
    }
    
    setupEventListeners() {
        // Navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const printBtn = document.getElementById('printBtn');
        
        prevBtn?.addEventListener('click', () => this.previousSlide());
        nextBtn?.addEventListener('click', () => this.nextSlide());
        printBtn?.addEventListener('click', () => this.printPresentation());
        
        // Slide indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Touch/swipe support for mobile
        this.setupTouchNavigation();
        
        // Auto-animate when slides become visible
        this.setupIntersectionObserver();
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ': // Spacebar
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides - 1);
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.exitFullscreen();
                    break;
            }
        });
    }
    
    setupTouchNavigation() {
        let startX = 0;
        let endX = 0;
        
        const slidesContainer = document.querySelector('.slides-container');
        
        slidesContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        slidesContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe();
        }, { passive: true });
        
        const handleSwipe = () => {
            const threshold = 50; // Minimum swipe distance
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // Swiped left - next slide
                    this.nextSlide();
                } else {
                    // Swiped right - previous slide
                    this.previousSlide();
                }
            }
        };
        
        this.handleSwipe = handleSwipe;
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.classList.contains('active')) {
                    // Trigger animations when slide becomes visible
                    this.animateSlideContent(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.slides.forEach(slide => observer.observe(slide));
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < this.totalSlides) {
            // Remove active class from current slide
            this.slides[this.currentSlide]?.classList.remove('active');
            this.indicators[this.currentSlide]?.classList.remove('active');
            
            // Update current slide index
            this.currentSlide = slideIndex;
            
            // Add active class to new slide
            this.slides[this.currentSlide]?.classList.add('active');
            this.indicators[this.currentSlide]?.classList.add('active');
            
            // Update UI
            this.updateSlideCounter();
            this.updateNavigationButtons();
            
            // Animate content when slide changes
            setTimeout(() => {
                this.animateSlideContent(this.slides[this.currentSlide]);
            }, 100);
        }
    }
    
    updateSlideCounter() {
        const currentSlideElement = document.getElementById('currentSlide');
        const totalSlidesElement = document.getElementById('totalSlides');
        
        if (currentSlideElement) {
            currentSlideElement.textContent = this.currentSlide + 1;
        }
        if (totalSlidesElement) {
            totalSlidesElement.textContent = this.totalSlides;
        }
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentSlide === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
        }
    }
    
    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        // Animate progress bars on code statistics slide
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const percent = progressBar.dataset.percent;
                    
                    setTimeout(() => {
                        progressBar.style.width = `${percent}%`;
                        progressBar.classList.add('animated');
                    }, 500);
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(bar => observer.observe(bar));
    }
    
    animateSlideContent(slide) {
        // Animate cards and items with staggered entrance
        const animatableElements = slide.querySelectorAll(
            '.summary-card, .feature-item, .security-item, .program-item, ' +
            '.achievement-item, .tech-item, .css-feature, .js-feature, .value-item'
        );
        
        animatableElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100 + (index * 100)); // Staggered animation
        });
        
        // Special animations for specific slides
        this.handleSpecialSlideAnimations(slide);
    }
    
    handleSpecialSlideAnimations(slide) {
        const slideIndex = parseInt(slide.dataset.slide);
        
        switch(slideIndex) {
            case 0: // Title slide
                this.animateTitleSlide(slide);
                break;
            case 2: // Code statistics slide
                this.animateCodeStats(slide);
                break;
            case 10: // Achievements slide
                this.animateAchievements(slide);
                break;
        }
    }
    
    animateTitleSlide(slide) {
        const title = slide.querySelector('h1');
        const subtitle = slide.querySelector('h2');
        const metric = slide.querySelector('.highlight-metric');
        
        if (title) {
            title.style.opacity = '0';
            title.style.transform = 'translateY(-50px)';
            setTimeout(() => {
                title.style.transition = 'all 1s ease';
                title.style.opacity = '1';
                title.style.transform = 'translateY(0)';
            }, 200);
        }
        
        if (subtitle) {
            subtitle.style.opacity = '0';
            subtitle.style.transform = 'translateY(-30px)';
            setTimeout(() => {
                subtitle.style.transition = 'all 1s ease';
                subtitle.style.opacity = '1';
                subtitle.style.transform = 'translateY(0)';
            }, 600);
        }
        
        if (metric) {
            metric.style.opacity = '0';
            metric.style.transform = 'scale(0.8)';
            setTimeout(() => {
                metric.style.transition = 'all 1s ease';
                metric.style.opacity = '1';
                metric.style.transform = 'scale(1)';
            }, 1000);
        }
    }
    
    animateCodeStats(slide) {
        const totalMetric = slide.querySelector('.total-metric');
        
        if (totalMetric) {
            const number = totalMetric.querySelector('.total-number');
            if (number) {
                this.animateNumber(number, 0, 94408, 2000);
            }
        }
        
        // Animate individual stats
        const statItems = slide.querySelectorAll('.stat-item');
        statItems.forEach((item, index) => {
            const lineCount = item.querySelector('.line-count');
            const progressBar = item.querySelector('.progress-fill');
            
            setTimeout(() => {
                if (lineCount) {
                    const targetNumber = this.extractNumber(lineCount.textContent);
                    this.animateNumber(lineCount, 0, targetNumber, 1500, ' lines');
                }
                
                if (progressBar) {
                    const percent = progressBar.dataset.percent;
                    progressBar.style.width = `${percent}%`;
                }
            }, 500 + (index * 300));
        });
    }
    
    animateAchievements(slide) {
        const achievements = slide.querySelectorAll('.achievement-item');
        
        achievements.forEach((achievement, index) => {
            achievement.style.opacity = '0';
            achievement.style.transform = 'translateX(-50px)';
            
            setTimeout(() => {
                achievement.style.transition = 'all 0.5s ease';
                achievement.style.opacity = '1';
                achievement.style.transform = 'translateX(0)';
                
                // Add a subtle bounce effect
                setTimeout(() => {
                    achievement.style.transform = 'translateX(5px)';
                    setTimeout(() => {
                        achievement.style.transform = 'translateX(0)';
                    }, 100);
                }, 300);
            }, index * 150);
        });
    }
    
    animateNumber(element, start, end, duration, suffix = '') {
        const startTime = performance.now();
        const range = end - start;
        
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (range * easeOut));
            
            element.textContent = current.toLocaleString() + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = end.toLocaleString() + suffix;
            }
        };
        
        requestAnimationFrame(updateNumber);
    }
    
    extractNumber(text) {
        const matches = text.match(/[\d,]+/);
        return matches ? parseInt(matches[0].replace(/,/g, '')) : 0;
    }
    
    printPresentation() {
        // Save current state
        const originalTitle = document.title;
        
        // Update title for print
        document.title = 'SOLIDARITY Website - Technical Excellence Presentation';
        
        // Show all slides for printing
        this.slides.forEach(slide => {
            slide.style.opacity = '1';
            slide.style.visibility = 'visible';
            slide.style.position = 'static';
            slide.style.transform = 'none';
        });
        
        // Trigger print
        setTimeout(() => {
            window.print();
            
            // Restore original state after printing
            setTimeout(() => {
                document.title = originalTitle;
                this.slides.forEach((slide, index) => {
                    if (index !== this.currentSlide) {
                        slide.style.opacity = '0';
                        slide.style.visibility = 'hidden';
                        slide.style.position = 'absolute';
                    }
                });
            }, 1000);
        }, 100);
    }
    
    exitFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
    
    // Public method to enter fullscreen
    enterFullscreen() {
        const container = document.querySelector('.presentation-container');
        if (container && container.requestFullscreen) {
            container.requestFullscreen();
        }
    }
    
    // Method to get current slide info
    getCurrentSlideInfo() {
        return {
            current: this.currentSlide + 1,
            total: this.totalSlides,
            title: this.slides[this.currentSlide]?.querySelector('h1')?.textContent || 'Unknown'
        };
    }
    
    // Method to jump to specific slide by title or index
    jumpToSlide(identifier) {
        let targetIndex = -1;
        
        if (typeof identifier === 'number') {
            targetIndex = identifier - 1; // Convert to 0-based index
        } else if (typeof identifier === 'string') {
            // Find slide by title
            this.slides.forEach((slide, index) => {
                const title = slide.querySelector('h1')?.textContent.toLowerCase();
                if (title && title.includes(identifier.toLowerCase())) {
                    targetIndex = index;
                }
            });
        }
        
        if (targetIndex >= 0 && targetIndex < this.totalSlides) {
            this.goToSlide(targetIndex);
            return true;
        }
        return false;
    }
}

// Enhanced hover effects for interactive elements
class EnhancedInteractions {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupCardHoverEffects();
        this.setupButtonHoverEffects();
        this.setupTooltips();
    }
    
    setupCardHoverEffects() {
        const cards = document.querySelectorAll(
            '.summary-card, .feature-item, .security-item, .program-item, ' +
            '.css-feature, .js-feature, .value-item'
        );
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
                card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
            });
        });
    }
    
    setupButtonHoverEffects() {
        const buttons = document.querySelectorAll('.nav-btn, .print-btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (!button.disabled) {
                    button.style.transform = 'translateY(-2px)';
                    button.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = '';
            });
        });
    }
    
    setupTooltips() {
        const indicators = document.querySelectorAll('.indicator');
        
        indicators.forEach((indicator, index) => {
            indicator.title = `Go to slide ${index + 1}`;
            
            indicator.addEventListener('mouseenter', () => {
                if (!indicator.classList.contains('active')) {
                    indicator.style.transform = 'scale(1.3)';
                    indicator.style.backgroundColor = 'var(--color-primary-hover)';
                }
            });
            
            indicator.addEventListener('mouseleave', () => {
                if (!indicator.classList.contains('active')) {
                    indicator.style.transform = 'scale(1)';
                    indicator.style.backgroundColor = '';
                }
            });
        });
    }
}

// Performance monitoring and analytics
class PresentationAnalytics {
    constructor() {
        this.startTime = Date.now();
        this.slideViews = {};
        this.interactions = {
            keyboardNavigation: 0,
            mouseNavigation: 0,
            touchNavigation: 0
        };
        
        this.init();
    }
    
    init() {
        this.trackSlideViews();
        this.trackInteractions();
    }
    
    trackSlideViews() {
        // Track time spent on each slide
        setInterval(() => {
            const currentSlide = document.querySelector('.slide.active');
            if (currentSlide) {
                const slideIndex = parseInt(currentSlide.dataset.slide);
                this.slideViews[slideIndex] = (this.slideViews[slideIndex] || 0) + 1;
            }
        }, 1000);
    }
    
    trackInteractions() {
        // Track navigation method usage
        document.addEventListener('keydown', () => {
            this.interactions.keyboardNavigation++;
        });
        
        document.addEventListener('click', () => {
            this.interactions.mouseNavigation++;
        });
        
        document.addEventListener('touchend', () => {
            this.interactions.touchNavigation++;
        });
    }
    
    getAnalytics() {
        const sessionDuration = Math.floor((Date.now() - this.startTime) / 1000);
        
        return {
            sessionDuration: `${sessionDuration} seconds`,
            slideViews: this.slideViews,
            interactions: this.interactions,
            mostViewedSlide: Object.keys(this.slideViews).reduce((a, b) => 
                this.slideViews[a] > this.slideViews[b] ? a : b, 0
            )
        };
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main presentation functionality
    const presentation = new PresentationApp();
    
    // Initialize enhanced interactions
    const interactions = new EnhancedInteractions();
    
    // Initialize analytics (optional)
    const analytics = new PresentationAnalytics();
    
    // Make presentation object globally available for debugging
    window.presentationApp = presentation;
    window.presentationAnalytics = analytics;
    
    // Add global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // F11 for fullscreen
        if (e.key === 'F11') {
            e.preventDefault();
            presentation.enterFullscreen();
        }
        
        // Ctrl+P for print
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            presentation.printPresentation();
        }
    });
    
    // Add visual feedback for loading
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // Console information for developers
    console.log('🎯 Solidarity Website Presentation Loaded Successfully!');
    console.log('📊 Use window.presentationApp for programmatic control');
    console.log('📈 Use window.presentationAnalytics.getAnalytics() for usage stats');
    console.log('⌨️  Keyboard shortcuts: Arrow keys, Space, Home, End, F11, Ctrl+P');
});

// Service worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Only register if service worker file exists
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered: ', registration))
        //     .catch(registrationError => console.log('SW registration failed: ', registrationError));
    });
}