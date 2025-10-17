// Advanced Counter App JavaScript
class AdvancedCounter {
    constructor() {
        this.count = 0;
        this.isAnimating = false;
        this.savedCounts = [];
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        // Get DOM elements
        this.counterValue = document.getElementById('counterValue');
        this.increaseBtn = document.getElementById('increaseButton');
        this.decreaseBtn = document.getElementById('decreaseButton');
        this.counterCard = document.querySelector('.counter-card');
        this.customInput = document.getElementById('customInput');
        this.addCustomBtn = document.getElementById('addCustomButton');
        this.saveBtn = document.getElementById('saveButton');
        this.resetBtn = document.getElementById('resetButton');
        this.deleteBtn = document.getElementById('deleteButton');
        this.themeToggle = document.getElementById('themeToggle');
        this.savedIndicator = document.getElementById('savedIndicator');
        this.toast = document.getElementById('toast');
        
        // Check if critical elements exist
        if (!this.counterValue || !this.increaseBtn || !this.decreaseBtn) {
            console.error('Critical DOM elements not found:', {
                counterValue: this.counterValue,
                increaseBtn: this.increaseBtn,
                decreaseBtn: this.decreaseBtn
            });
            
            // Try to find elements again after a short delay
            setTimeout(() => {
                this.counterValue = document.getElementById('counterValue');
                this.increaseBtn = document.getElementById('increaseButton');
                this.decreaseBtn = document.getElementById('decreaseButton');
                
                if (this.counterValue && this.increaseBtn && this.decreaseBtn) {
                    console.log('Elements found on retry, rebinding events...');
                    this.bindEvents();
                    this.updateDisplay();
                }
            }, 100);
            
            return;
        }
        
        // Get toast message element if toast exists
        if (this.toast) {
            this.toastMessage = this.toast.querySelector('.toast-message');
        }
        
        // Bind event listeners
        this.bindEvents();
        
        // Initialize from localStorage
        this.loadFromStorage();
        
        // Initialize display
        this.updateDisplay();
        
        // Add entrance animation
        this.addEntranceAnimation();
        
        // Initialize theme
        this.initializeTheme();
        
        // Set up periodic button check to ensure they remain clickable
        this.startButtonMonitoring();
        
        console.log('Advanced Counter initialized successfully!');
    }

    bindEvents() {
        // MOBILE-FOCUSED BUTTON LOGIC - Specifically designed for small screens
        console.log('Setting up mobile-optimized button events...');
        
        // Method 1: Multiple event binding for maximum compatibility on mobile
        this.bindButtonEvents();
        
        // Method 2: Global event delegation for mobile
        this.setupGlobalEventHandlers();
        
        // Method 3: Mobile-specific touch handlers
        this.setupMobileTouchHandlers();
        
        // Custom input (optional)
        if (this.addCustomBtn) {
            this.addCustomBtn.addEventListener('click', () => this.addCustomNumber());
        }
        
        if (this.customInput) {
            this.customInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addCustomNumber();
            });
        }
        
        // Action buttons (optional)
        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', () => this.saveCounter());
        }
        
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.resetCounter());
        }
        
        if (this.deleteBtn) {
            this.deleteBtn.addEventListener('click', () => this.deleteAllData());
        }
        
        // Theme toggle (optional)
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (this.customInput && e.target === this.customInput) return; // Don't interfere with input
            
            if (e.code === 'ArrowUp' || e.code === 'Plus' || e.code === 'Equal') {
                e.preventDefault();
                this.increase();
            } else if (e.code === 'ArrowDown' || e.code === 'Minus') {
                e.preventDefault();
                this.decrease();
            } else if (e.code === 'KeyR' && e.ctrlKey) {
                e.preventDefault();
                this.resetCounter();
            } else if (e.code === 'KeyS' && e.ctrlKey) {
                e.preventDefault();
                this.saveCounter();
            }
        });
        
        // Touch support
        if (this.increaseBtn) {
            this.increaseBtn.addEventListener('touchstart', this.handleTouchStart.bind(this));
        }
        
        if (this.decreaseBtn) {
            this.decreaseBtn.addEventListener('touchstart', this.handleTouchStart.bind(this));
        }
        
        // Event delegation as backup for button clicks (ensures buttons work on all screen sizes)
        // Method 2: Document-level event delegation
        document.addEventListener('click', (e) => {
            const target = e.target;
            const increaseButton = target.closest('#increaseButton') || (target.id === 'increaseButton');
            const decreaseButton = target.closest('#decreaseButton') || (target.id === 'decreaseButton');
            
            if (increaseButton) {
                console.log('Increase button clicked via delegation');
                e.preventDefault();
                e.stopPropagation();
                this.increase();
                return false;
            } 
            
            if (decreaseButton) {
                console.log('Decrease button clicked via delegation');
                e.preventDefault();
                e.stopPropagation();
                this.decrease();
                return false;
            }
        }, true); // Use capture phase
        
        // Method 3: Additional event delegation for touch devices
        document.addEventListener('touchend', (e) => {
            const target = e.target;
            const increaseButton = target.closest('#increaseButton') || (target.id === 'increaseButton');
            const decreaseButton = target.closest('#decreaseButton') || (target.id === 'decreaseButton');
            
            if (increaseButton) {
                console.log('Increase button touched via delegation');
                e.preventDefault();
                e.stopPropagation();
                this.increase();
                return false;
            } 
            
            if (decreaseButton) {
                console.log('Decrease button touched via delegation');
                e.preventDefault();
                e.stopPropagation();
                this.decrease();
                return false;
            }
        }, true);
        
        console.log('All event listeners bound successfully');
        
        // Method 4: Force button styles to ensure they're clickable on all devices
        this.ensureButtonsAreClickable();
    }
    
    ensureButtonsAreClickable() {
        const buttons = [this.increaseBtn, this.decreaseBtn];
        buttons.forEach(button => {
            if (button) {
                // Apply comprehensive mobile-friendly styles
                this.applyMobileButtonStyles(button);
                
                // Additional mobile-specific fixes
                button.style.setProperty('isolation', 'isolate', 'important');
                button.style.setProperty('transform', 'translateZ(0)', 'important');
                button.style.setProperty('backface-visibility', 'hidden', 'important');
            }
        });
        
        console.log('Mobile-optimized button styles enforced for all screen sizes');
    }
    
    startButtonMonitoring() {
        // More frequent monitoring for mobile devices (every 500ms)
        setInterval(() => {
            this.ensureButtonsAreClickable();
            // Re-bind events if buttons seem unresponsive
            this.bindButtonEvents();
        }, 500);
        
        // Check on various mobile events
        const mobileEvents = ['resize', 'orientationchange', 'scroll', 'touchstart', 'focus', 'blur'];
        mobileEvents.forEach(eventType => {
            window.addEventListener(eventType, () => {
                setTimeout(() => {
                    this.ensureButtonsAreClickable();
                }, 50);
            });
        });
        
        // Special handling for viewport changes on mobile
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', () => {
                setTimeout(() => {
                    this.ensureButtonsAreClickable();
                    this.bindButtonEvents();
                }, 100);
            });
        }
        
        console.log('Enhanced mobile button monitoring started');
    }
    
    bindButtonEvents() {
        // Enhanced button binding specifically for small screens
        console.log('Binding button events for mobile compatibility...');
        
        if (this.increaseBtn) {
            // Clear all existing event listeners by cloning
            const newIncreaseBtn = this.increaseBtn.cloneNode(true);
            this.increaseBtn.parentNode.replaceChild(newIncreaseBtn, this.increaseBtn);
            this.increaseBtn = newIncreaseBtn;
            
            // Multiple event types for maximum mobile compatibility
            const increaseHandler = (e) => {
                console.log('Mobile increase handler triggered:', e.type);
                e.preventDefault();
                e.stopImmediatePropagation();
                this.increase();
            };
            
            this.increaseBtn.addEventListener('click', increaseHandler, { passive: false });
            this.increaseBtn.addEventListener('touchend', increaseHandler, { passive: false });
            this.increaseBtn.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
            this.increaseBtn.addEventListener('mousedown', increaseHandler, { passive: false });
            
            // Force mobile-friendly styles
            this.applyMobileButtonStyles(this.increaseBtn);
        }
        
        if (this.decreaseBtn) {
            // Clear all existing event listeners by cloning
            const newDecreaseBtn = this.decreaseBtn.cloneNode(true);
            this.decreaseBtn.parentNode.replaceChild(newDecreaseBtn, this.decreaseBtn);
            this.decreaseBtn = newDecreaseBtn;
            
            // Multiple event types for maximum mobile compatibility
            const decreaseHandler = (e) => {
                console.log('Mobile decrease handler triggered:', e.type);
                e.preventDefault();
                e.stopImmediatePropagation();
                this.decrease();
            };
            
            this.decreaseBtn.addEventListener('click', decreaseHandler, { passive: false });
            this.decreaseBtn.addEventListener('touchend', decreaseHandler, { passive: false });
            this.decreaseBtn.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
            this.decreaseBtn.addEventListener('mousedown', decreaseHandler, { passive: false });
            
            // Force mobile-friendly styles
            this.applyMobileButtonStyles(this.decreaseBtn);
        }
    }
    
    setupGlobalEventHandlers() {
        // Aggressive global event capture for mobile devices
        console.log('Setting up global mobile event handlers...');
        
        const handleButtonClick = (e) => {
            const target = e.target;
            
            // Check for increase button (including nested elements)
            if (target.id === 'increaseButton' || 
                target.closest('#increaseButton') ||
                target.parentElement?.id === 'increaseButton' ||
                target.classList.contains('increase-btn') ||
                target.closest('.increase-btn')) {
                console.log('Global increase handler triggered');
                e.preventDefault();
                e.stopImmediatePropagation();
                this.increase();
                return false;
            }
            
            // Check for decrease button (including nested elements)
            if (target.id === 'decreaseButton' || 
                target.closest('#decreaseButton') ||
                target.parentElement?.id === 'decreaseButton' ||
                target.classList.contains('decrease-btn') ||
                target.closest('.decrease-btn')) {
                console.log('Global decrease handler triggered');
                e.preventDefault();
                e.stopImmediatePropagation();
                this.decrease();
                return false;
            }
        };
        
        // Add multiple global event types
        document.addEventListener('click', handleButtonClick, { capture: true, passive: false });
        document.addEventListener('touchend', handleButtonClick, { capture: true, passive: false });
        document.addEventListener('mouseup', handleButtonClick, { capture: true, passive: false });
        
        // Additional body-level handlers for stubborn mobile browsers
        document.body.addEventListener('click', handleButtonClick, { capture: true, passive: false });
        document.body.addEventListener('touchend', handleButtonClick, { capture: true, passive: false });
    }
    
    setupMobileTouchHandlers() {
        // Specific mobile touch optimization
        console.log('Setting up mobile touch handlers...');
        
        // Disable touch delays and zoom on button areas
        const buttonContainer = document.querySelector('.counter-wrapper');
        if (buttonContainer) {
            buttonContainer.style.touchAction = 'manipulation';
            buttonContainer.style.webkitTouchCallout = 'none';
            buttonContainer.style.webkitUserSelect = 'none';
            buttonContainer.style.userSelect = 'none';
        }
        
        // Force immediate button feedback on touch
        [this.increaseBtn, this.decreaseBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    btn.style.transform = 'scale(0.95)';
                }, { passive: false });
                
                btn.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    btn.style.transform = 'scale(1)';
                    
                    // Trigger appropriate action
                    if (btn.id === 'increaseButton') {
                        setTimeout(() => this.increase(), 10);
                    } else if (btn.id === 'decreaseButton') {
                        setTimeout(() => this.decrease(), 10);
                    }
                }, { passive: false });
                
                btn.addEventListener('touchcancel', () => {
                    btn.style.transform = 'scale(1)';
                });
            }
        });
    }
    
    applyMobileButtonStyles(button) {
        if (!button) return;
        
        const mobileStyles = {
            'pointer-events': 'auto',
            'cursor': 'pointer',
            'z-index': '99999',
            'position': 'relative',
            'display': 'flex',
            'align-items': 'center',
            'justify-content': 'center',
            'user-select': 'none',
            '-webkit-user-select': 'none',
            '-moz-user-select': 'none',
            '-ms-user-select': 'none',
            'touch-action': 'manipulation',
            '-webkit-touch-callout': 'none',
            '-webkit-tap-highlight-color': 'transparent',
            'outline': 'none',
            'min-width': '48px',
            'min-height': '48px',
            'border-radius': '50%',
            'overflow': 'visible'
        };
        
        Object.entries(mobileStyles).forEach(([property, value]) => {
            button.style.setProperty(property, value, 'important');
        });
        
        // Ensure child elements don't interfere
        const children = button.querySelectorAll('*');
        children.forEach(child => {
            child.style.setProperty('pointer-events', 'none', 'important');
            child.style.setProperty('user-select', 'none', 'important');
            child.style.setProperty('-webkit-user-select', 'none', 'important');
        });
        
        console.log(`Mobile styles applied to button: ${button.id}`);
    }

    increase() {
        console.log('Increase method called, current count:', this.count);
        
        if (this.isAnimating) {
            console.log('Animation in progress, skipping');
            return;
        }
        
        this.count++;
        console.log('New count:', this.count);
        this.updateDisplay();
        
        // Optional animations (won't break if methods don't exist)
        try {
            this.animateButton(this.increaseBtn);
            this.animateCounter('increase');
            this.playClickSound();
            this.addParticleEffect(this.increaseBtn, 'increase');
        } catch (error) {
            console.log('Animation error (non-critical):', error);
        }
    }

    decrease() {
        console.log('Decrease method called, current count:', this.count);
        
        if (this.isAnimating) {
            console.log('Animation in progress, skipping');
            return;
        }
        
        // Prevent going below 0
        if (this.count <= 0) {
            console.log('Count already at 0, cannot decrease');
            try {
                this.showToast('⚠️ Count cannot go below 0!', 'warning');
                this.shakeCounter();
            } catch (error) {
                console.log('Toast/shake error (non-critical):', error);
            }
            return;
        }
        
        this.count--;
        console.log('New count:', this.count);
        this.updateDisplay();
        
        // Optional animations
        try {
            this.animateButton(this.decreaseBtn);
            this.animateCounter('decrease');
            this.playClickSound();
            this.addParticleEffect(this.decreaseBtn, 'decrease');
        } catch (error) {
            console.log('Animation error (non-critical):', error);
        }
    }

    addCustomNumber() {
        const inputValue = parseInt(this.customInput.value);
        
        if (isNaN(inputValue) || inputValue < 0) {
            this.showToast('⚠️ Please enter a valid positive number!', 'warning');
            this.customInput.focus();
            return;
        }
        
        if (inputValue === 0) {
            this.showToast('⚠️ Please enter a number greater than 0!', 'warning');
            return;
        }
        
        this.count += inputValue;
        this.updateDisplay();
        this.customInput.value = '';
        this.animateCounter('custom');
        this.showToast(`✅ Added ${inputValue} to counter!`, 'success');
        this.addParticleEffect(this.addCustomBtn, 'custom');
    }

    saveCounter() {
        const timestamp = new Date().toLocaleString();
        const saveData = {
            count: this.count,
            timestamp: timestamp,
            id: Date.now()
        };
        
        this.savedCounts.push(saveData);
        this.saveToStorage();
        this.updateSavedIndicator();
        this.showToast(`💾 Counter saved! (${this.count})`, 'success');
        this.animateButton(this.saveBtn);
    }

    resetCounter() {
        if (this.count === 0) {
            this.showToast('ℹ️ Counter is already at 0!', 'info');
            return;
        }
        
        const oldCount = this.count;
        this.count = 0;
        this.updateDisplay();
        this.shakeCounter();
        this.showToast(`🔄 Counter reset from ${oldCount} to 0!`, 'success');
        this.animateButton(this.resetBtn);
    }

    deleteAllData() {
        if (this.savedCounts.length === 0 && this.count === 0) {
            this.showToast('ℹ️ No data to delete!', 'info');
            return;
        }
        
        // Confirm deletion
        if (confirm('Are you sure you want to delete all saved data? This cannot be undone.')) {
            this.savedCounts = [];
            this.count = 0;
            this.updateDisplay();
            this.clearStorage();
            this.updateSavedIndicator();
            this.shakeCounter();
            this.showToast('🗑️ All data deleted!', 'success');
            this.animateButton(this.deleteBtn);
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        const themeIcon = this.themeToggle.querySelector('.theme-icon');
        themeIcon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
        
        localStorage.setItem('counterTheme', this.currentTheme);
        this.showToast(`🎨 Switched to ${this.currentTheme} mode!`, 'info');
        this.animateButton(this.themeToggle);
    }

    updateDisplay() {
        console.log('Updating display with count:', this.count);
        
        if (!this.counterValue) {
            console.error('Counter value element not found!');
            return;
        }
        
        try {
            const formattedCount = this.formatNumber(this.count);
            this.counterValue.textContent = formattedCount;
            console.log('Display updated to:', formattedCount);
            this.updateCounterColor();
        } catch (error) {
            console.error('Error updating display:', error);
            // Fallback to simple display
            this.counterValue.textContent = this.count.toString();
        }
    }

    formatNumber(num) {
        if (Math.abs(num) >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (Math.abs(num) >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    updateCounterColor() {
        this.counterValue.classList.remove('positive', 'negative', 'zero');
        
        if (this.count > 0) {
            this.counterValue.classList.add('positive');
        } else if (this.count < 0) {
            this.counterValue.classList.add('negative');
        } else {
            this.counterValue.classList.add('zero');
        }
    }

    animateButton(button) {
        button.classList.add('pulse');
        setTimeout(() => button.classList.remove('pulse'), 300);
    }

    animateCounter(direction) {
        this.isAnimating = true;
        this.counterValue.classList.add('animate');
        
        const rotations = {
            'increase': 'rotateY(180deg)',
            'decrease': 'rotateY(-180deg)',
            'custom': 'rotateX(360deg)'
        };
        
        this.counterValue.style.transform = `scale(1.2) ${rotations[direction] || 'rotateY(180deg)'}`;
        
        setTimeout(() => {
            this.counterValue.style.transform = 'scale(1) rotateY(0deg)';
            this.counterValue.classList.remove('animate');
            this.isAnimating = false;
        }, 300);
    }

    shakeCounter() {
        this.counterCard.classList.add('shake');
        setTimeout(() => this.counterCard.classList.remove('shake'), 500);
    }

    addParticleEffect(button, type) {
        const rect = button.getBoundingClientRect();
        const colors = {
            'increase': ['#4facfe', '#00f2fe'],
            'decrease': ['#fa709a', '#fee140'],
            'custom': ['#a8edea', '#fed6e3']
        };
        
        const particleColors = colors[type] || colors['increase'];
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: ${particleColors[Math.floor(Math.random() * particleColors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
            `;
            
            document.body.appendChild(particle);
            
            const angle = (Math.PI * 2 * i) / 8;
            const velocity = 60 + Math.random() * 40;
            const duration = 600 + Math.random() * 400;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { 
                    transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0)`,
                    opacity: 0 
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }).onfinish = () => particle.remove();
        }
    }

    playClickSound() {
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const audioContext = new (AudioContext || webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        }
    }

    showToast(message, type = 'info') {
        this.toastMessage.textContent = message;
        this.toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }

    updateSavedIndicator() {
        if (this.savedCounts.length > 0) {
            const lastSave = this.savedCounts[this.savedCounts.length - 1];
            this.savedIndicator.querySelector('.saved-text').textContent = 
                `Last saved: ${lastSave.timestamp} (${lastSave.count})`;
        } else {
            this.savedIndicator.querySelector('.saved-text').textContent = 'Last saved: Never';
        }
    }

    saveToStorage() {
        const data = {
            currentCount: this.count,
            savedCounts: this.savedCounts,
            theme: this.currentTheme
        };
        localStorage.setItem('advancedCounterData', JSON.stringify(data));
    }

    loadFromStorage() {
        const saved = localStorage.getItem('advancedCounterData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.count = data.currentCount || 0;
                this.savedCounts = data.savedCounts || [];
                this.currentTheme = data.theme || 'light';
            } catch (e) {
                console.warn('Failed to load saved data:', e);
            }
        }
        this.updateSavedIndicator();
    }

    clearStorage() {
        localStorage.removeItem('advancedCounterData');
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('counterTheme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
        }
        
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const themeIcon = this.themeToggle.querySelector('.theme-icon');
        themeIcon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
    }

    handleTouchStart(e) {
        e.preventDefault();
    }

    addEntranceAnimation() {
        this.counterCard.style.opacity = '0';
        this.counterCard.style.transform = 'translateY(50px) scale(0.9)';
        
        setTimeout(() => {
            this.counterCard.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            this.counterCard.style.opacity = '1';
            this.counterCard.style.transform = 'translateY(0) scale(1)';
        }, 100);
    }
}

// Add dynamic CSS for color changes
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .counter-number.positive { color: #4facfe !important; }
    .counter-number.negative { color: #fa709a !important; }
    .counter-number.zero { color: var(--text-primary) !important; }
    .counter-number { transition: all 0.3s ease-in-out; }
    
    .toast.success { border-left: 4px solid #4facfe; }
    .toast.warning { border-left: 4px solid #f6ad55; }
    .toast.error { border-left: 4px solid #fc8181; }
    .toast.info { border-left: 4px solid #63b3ed; }
`;
document.head.appendChild(dynamicStyles);

// Initialize the counter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const counter = new AdvancedCounter();
    
    console.log(`
    🎯 Advanced Counter App Loaded!
    
    Features:
    ✨ Save/Load functionality
    🔢 Custom number input
    🗑️ Delete all data
    🔄 Reset counter
    🚫 Prevents negative counts
    🌙 Dark/Light theme toggle
    
    Keyboard Shortcuts:
    ↑ / + / = : Increase
    ↓ / - : Decrease
    Ctrl + S : Save
    Ctrl + R : Reset
    
    Made with ❤️
    `);
});