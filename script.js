/**
 * Breeze Lux Cleaners - Main Application
 * Handles all functionality including navbar, counters, slider, testimonials, gallery, and forms
 */

'use strict';

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('copyYear').textContent = new Date().getFullYear();
  initNavbar();
  initCounters();
  initSlider();
  initTestimonials();
  initGallery();
  initForms();
  initScrollReveal();
  initBackToTop();
  initServiceCards();
  console.log('🚀 Breeze Lux Cleaners initialized');
});

// ========================================
// NAVBAR MODULE
// ========================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-links a');
  if (!navbar) return;
  
  window.addEventListener('scroll', function() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveNavItem();
  }, { passive: true });
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }
  
  navItems.forEach(function(link) {
    link.addEventListener('click', function() {
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        if (hamburger) {
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
      }
    });
  });
  
  document.addEventListener('click', function(e) {
    if (navLinks && navLinks.classList.contains('open')) {
      const isClickInside = navLinks.contains(e.target) || hamburger?.contains(e.target);
      if (!isClickInside) {
        navLinks.classList.remove('open');
        if (hamburger) {
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
      }
    }
  });
  
  updateActiveNavItem();
}

function updateActiveNavItem() {
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  const sections = [];
  navLinks.forEach(function(link) {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const section = document.querySelector(href);
      if (section) sections.push({ id: href, element: section, link: link });
    }
  });
  if (sections.length === 0) return;
  const scrollPosition = window.scrollY + 150;
  let currentSection = sections[0];
  sections.forEach(function(section) {
    const rect = section.element.getBoundingClientRect();
    const sectionTop = rect.top + window.pageYOffset;
    const sectionBottom = sectionTop + rect.height;
    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      currentSection = section;
    }
  });
  sections.forEach(function(section) {
    section.link.classList.toggle('active', section === currentSection);
  });
}

// ========================================
// COUNTER MODULE
// ========================================
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (counters.length === 0) return;
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });
  counters.forEach(function(counter) { observer.observe(counter); });
}

function animateCounter(element) {
  const target = parseInt(element.dataset.count, 10);
  if (isNaN(target) || target <= 0) return;
  let current = 0;
  const duration = 2000, steps = 60;
  const increment = target / steps;
  const stepTime = duration / steps;
  element.classList.add('count-up');
  const timer = setInterval(function() {
    current += increment;
    if (current >= target) { element.textContent = target; clearInterval(timer); }
    else element.textContent = Math.floor(current);
  }, stepTime);
}

// ========================================
// SLIDER MODULE
// ========================================
function initSlider() {
  const slider = document.getElementById('baSlider');
  const beforeWrap = document.getElementById('baBeforeWrap');
  const handle = document.getElementById('baHandle');
  const range = document.getElementById('baRange');
  if (!slider || !beforeWrap || !handle || !range) return;
  let isDragging = false;
  
  function setPosition(percent) {
    const clampedPercent = Math.max(0, Math.min(100, percent));
    beforeWrap.style.width = clampedPercent + '%';
    handle.style.left = clampedPercent + '%';
    range.value = clampedPercent;
    const fullWidth = slider.getBoundingClientRect().width;
    if (fullWidth > 0) beforeWrap.style.setProperty('--ba-img-width', fullWidth + 'px');
  }
  
  function updatePosition(clientX) {
    const rect = slider.getBoundingClientRect();
    const percent = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, percent)));
  }
  
  setPosition(50);
  range.addEventListener('input', function() { setPosition(parseFloat(this.value)); });
  slider.addEventListener('pointerdown', function(e) {
    isDragging = true;
    slider.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  });
  window.addEventListener('pointermove', function(e) { if (isDragging) updatePosition(e.clientX); });
  window.addEventListener('pointerup', function() { isDragging = false; });
  
  range.addEventListener('keydown', function(e) {
    const step = e.shiftKey ? 10 : 5;
    let value = parseFloat(range.value);
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      value = Math.min(100, value + step);
      setPosition(value);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      value = Math.max(0, value - step);
      setPosition(value);
    }
  });
  
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() { setPosition(parseFloat(range.value)); }, 200);
  });
}

// ========================================
// TESTIMONIALS MODULE
// ========================================
function initTestimonials() {
  const testimonials = [
    { quote: 'Breeze Lux Cleaners completely transformed our living room couch. The sofa vacuum cleaning removed stains I thought were permanent! Fast, professional, and highly recommended.', author: 'Sarah M.', location: 'Nairobi' },
    { quote: 'Amazing service! Our office has never looked better. Punctual, thorough, and eco-friendly. Will definitely book again.', author: 'James K.', location: 'Kiambu' },
    { quote: 'The post-construction cleaning was a lifesaver. They cleared all dust and debris, our new space is spotless.', author: 'Grace W.', location: 'Westlands' }
  ];
  
  const carousel = document.getElementById('testimonialCarousel');
  if (!carousel) return;
  const quoteEl = document.getElementById('testimonialQuote');
  const authorEl = document.getElementById('testimonialAuthor');
  const locEl = document.getElementById('testimonialLocation');
  const dotsContainer = document.getElementById('dotsContainer');
  const skeleton = document.getElementById('testimonialSkeleton');
  const content = document.getElementById('testimonialContent');
  if (!quoteEl || !authorEl || !locEl || !dotsContainer) return;
  
  let currentIndex = 0, timer = null, isPaused = false;
  
  testimonials.forEach(function(_, index) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Show testimonial ' + (index + 1));
    dot.dataset.index = index;
    dot.classList.toggle('active', index === 0);
    dot.addEventListener('click', function() { goToTestimonial(index); resetTimer(); });
    dotsContainer.appendChild(dot);
  });
  
  setTimeout(function() {
    if (skeleton) skeleton.style.display = 'none';
    if (content) content.style.display = 'block';
    goToTestimonial(0);
  }, 500);
  
  function goToTestimonial(index) {
    const testimonial = testimonials[index];
    if (!testimonial) return;
    if (quoteEl) {
      quoteEl.style.opacity = '0';
      setTimeout(function() {
        quoteEl.textContent = testimonial.quote;
        quoteEl.style.opacity = '1';
      }, 200);
    }
    if (authorEl) authorEl.textContent = '— ' + testimonial.author;
    if (locEl) locEl.textContent = testimonial.location;
    document.querySelectorAll('.dots button').forEach(function(dot, i) {
      dot.classList.toggle('active', i === index);
    });
    currentIndex = index;
  }
  
  function nextTestimonial() {
    const nextIndex = (currentIndex + 1) % testimonials.length;
    goToTestimonial(nextIndex);
  }
  
  function startTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(function() { if (!isPaused) nextTestimonial(); }, 6000);
  }
  
  function resetTimer() {
    if (timer) { clearInterval(timer); startTimer(); }
  }
  
  startTimer();
  carousel.addEventListener('mouseenter', function() { isPaused = true; });
  carousel.addEventListener('mouseleave', function() { isPaused = false; });
  carousel.addEventListener('focusin', function() { isPaused = true; });
  carousel.addEventListener('focusout', function() { isPaused = false; });
}

// ========================================
// GALLERY MODULE
// ========================================
function initGallery() {
  const galleryImages = [
    { src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%232a2a2d"/%3E%3Ctext x="200" y="145" text-anchor="middle" fill="%236b7280" font-family="Poppins,sans-serif" font-size="20"%3EGallery 1%3C/text%3E%3Ctext x="200" y="170" text-anchor="middle" fill="%239CA3AF" font-family="Poppins,sans-serif" font-size="14"%3EHome Cleaning%3C/text%3E%3C/svg%3E', alt: 'Professional home cleaning service in Nairobi' },
    { src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%232a2a2d"/%3E%3Ctext x="200" y="145" text-anchor="middle" fill="%236b7280" font-family="Poppins,sans-serif" font-size="20"%3EGallery 2%3C/text%3E%3Ctext x="200" y="170" text-anchor="middle" fill="%239CA3AF" font-family="Poppins,sans-serif" font-size="14"%3EOffice Cleaning%3C/text%3E%3C/svg%3E', alt: 'Office cleaning and sanitization' },
    { src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%232a2a2d"/%3E%3Ctext x="200" y="145" text-anchor="middle" fill="%236b7280" font-family="Poppins,sans-serif" font-size="20"%3EGallery 3%3C/text%3E%3Ctext x="200" y="170" text-anchor="middle" fill="%239CA3AF" font-family="Poppins,sans-serif" font-size="14"%3ESofa Cleaning%3C/text%3E%3C/svg%3E', alt: 'Sofa deep cleaning before and after' },
    { src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%232a2a2d"/%3E%3Ctext x="200" y="145" text-anchor="middle" fill="%236b7280" font-family="Poppins,sans-serif" font-size="20"%3EGallery 4%3C/text%3E%3Ctext x="200" y="170" text-anchor="middle" fill="%239CA3AF" font-family="Poppins,sans-serif" font-size="14"%3EMattress Cleaning%3C/text%3E%3C/svg%3E', alt: 'Mattress cleaning service' },
    { src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%232a2a2d"/%3E%3Ctext x="200" y="145" text-anchor="middle" fill="%236b7280" font-family="Poppins,sans-serif" font-size="20"%3EGallery 5%3C/text%3E%3Ctext x="200" y="170" text-anchor="middle" fill="%239CA3AF" font-family="Poppins,sans-serif" font-size="14"%3ELaundry%3C/text%3E%3C/svg%3E', alt: 'Laundry and garment care' },
    { src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%232a2a2d"/%3E%3Ctext x="200" y="145" text-anchor="middle" fill="%236b7280" font-family="Poppins,sans-serif" font-size="20"%3EGallery 6%3C/text%3E%3Ctext x="200" y="170" text-anchor="middle" fill="%239CA3AF" font-family="Poppins,sans-serif" font-size="14"%3EPost-Construction%3C/text%3E%3C/svg%3E', alt: 'Post-construction cleaning' }
  ];
  
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  
  grid.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-img';
    grid.appendChild(skeleton);
  }
  
  setTimeout(function() {
    grid.innerHTML = '';
    galleryImages.forEach(function(image, index) {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', 'View ' + image.alt);
      const img = document.createElement('img');
      img.src = image.src;
      img.alt = image.alt;
      img.loading = 'lazy';
      img.width = 400;
      img.height = 200;
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.5s ease';
      img.onload = function() { this.style.opacity = '1'; };
      button.appendChild(img);
      button.addEventListener('click', function() { openLightbox(image, index); });
      grid.appendChild(button);
      button.style.opacity = '0';
      button.style.transform = 'translateY(20px)';
      button.style.transition = 'opacity 0.5s ease ' + (index * 0.1) + 's, transform 0.5s ease ' + (index * 0.1) + 's';
      requestAnimationFrame(function() {
        button.style.opacity = '1';
        button.style.transform = 'translateY(0)';
      });
    });
  }, 800);
  
  function openLightbox(image, index) {
    const overlay = document.createElement('div');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image gallery lightbox');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;z-index:9999;cursor:pointer;padding:20px;animation:fadeIn 0.3s ease;';
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = 'position:absolute;top:20px;right:20px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:white;width:44px;height:44px;border-radius:50%;font-size:1.5rem;cursor:pointer;transition:all 0.3s ease;display:flex;align-items:center;justify-content:center;';
    closeBtn.addEventListener('mouseenter', function() {
      this.style.background = 'rgba(255,255,255,0.2)';
      this.style.transform = 'scale(1.1)';
    });
    closeBtn.addEventListener('mouseleave', function() {
      this.style.background = 'rgba(255,255,255,0.1)';
      this.style.transform = 'scale(1)';
    });
    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      closeLightbox(overlay);
    });
    
    const container = document.createElement('div');
    container.style.cssText = 'position:relative;max-width:90vw;max-height:90vh;';
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt;
    img.style.cssText = 'max-width:90vw;max-height:85vh;border-radius:12px;object-fit:contain;box-shadow:0 20px 60px rgba(0,0,0,0.8);animation:scaleIn 0.4s ease;';
    const caption = document.createElement('p');
    caption.textContent = image.alt;
    caption.style.cssText = 'position:absolute;bottom:-40px;left:50%;transform:translateX(-50%);color:#9CA3AF;font-size:0.9rem;white-space:nowrap;';
    container.appendChild(img);
    container.appendChild(caption);
    overlay.appendChild(closeBtn);
    overlay.appendChild(container);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) closeLightbox(overlay); });
    
    function onKeyDown(e) { if (e.key === 'Escape') closeLightbox(overlay); }
    document.addEventListener('keydown', onKeyDown);
    overlay._onKeyDown = onKeyDown;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  
  function closeLightbox(overlay) {
    document.removeEventListener('keydown', overlay._onKeyDown);
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease';
    setTimeout(function() { overlay.remove(); document.body.style.overflow = ''; }, 300);
  }
}

// ========================================
// FORMS MODULE
// ========================================
function initForms() {
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!validateBookingForm(bookingForm)) return;
      
      const submitBtn = this.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
      submitBtn.disabled = true;
      
      const formData = new FormData(bookingForm);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        date: formData.get('date'),
        message: formData.get('message') || 'No additional details'
      };
      
      const phoneNumber = '254758966762';
      const message = '*Breeze Lux Cleaners - Booking Request*\n\n' +
        '👤 *Name:* ' + data.name + '\n' +
        '📧 *Email:* ' + data.email + '\n' +
        '📱 *Phone:* ' + data.phone + '\n' +
        '🛠️ *Service:* ' + data.service + '\n' +
        '📅 *Preferred Date:* ' + data.date + '\n' +
        '💬 *Message:* ' + data.message + '\n\n' +
        'Thank you for choosing Breeze Lux Cleaners! 🌟';
      
      const encodedMessage = encodeURIComponent(message);
      window.open('https://wa.me/' + phoneNumber + '?text=' + encodedMessage, '_blank', 'noopener,noreferrer');
      
      showFormMessage(document.getElementById('bookingMessage'), 
        '✅ Thank you! We\'ve received your booking request and will confirm via WhatsApp within 30 minutes.', 
        'success'
      );
      bookingForm.reset();
      removeErrorStates(bookingForm);
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    });
  }
  
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = this.querySelector('#newsletterEmail');
      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showFormMessage(document.getElementById('newsletterMessage'), '❌ Please enter a valid email address', 'error');
        emailInput.focus();
        return;
      }
      const submitBtn = this.querySelector('.btn-primary');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Subscribing...';
      submitBtn.disabled = true;
      setTimeout(function() {
        showFormMessage(document.getElementById('newsletterMessage'), '🎉 You\'re in! Check your inbox for your 10% off code.', 'success');
        newsletterForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1000);
    });
  }
}

function validateBookingForm(form) {
  let isValid = true;
  removeErrorStates(form);
  
  const name = form.querySelector('#cf-name');
  const nameError = document.getElementById('cf-name-error');
  if (!name.value.trim() || name.value.trim().length < 2) {
    showFieldError(name, nameError, 'Please enter your full name (minimum 2 characters)');
    isValid = false;
  }
  
  const email = form.querySelector('#cf-email');
  const emailError = document.getElementById('cf-email-error');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
    showFieldError(email, emailError, 'Please enter a valid email address');
    isValid = false;
  }
  
  const phone = form.querySelector('#cf-phone');
  const phoneError = document.getElementById('cf-phone-error');
  if (!phone.value.trim() || phone.value.trim().length < 8) {
    showFieldError(phone, phoneError, 'Please enter a valid phone number (minimum 8 digits)');
    isValid = false;
  }
  
  const service = form.querySelector('#cf-service');
  const serviceError = document.getElementById('cf-service-error');
  if (!service.value) {
    showFieldError(service, serviceError, 'Please select a service');
    isValid = false;
  }
  
  const date = form.querySelector('#cf-date');
  const dateError = document.getElementById('cf-date-error');
  if (!date.value) {
    showFieldError(date, dateError, 'Please select a preferred date');
    isValid = false;
  } else {
    const selectedDate = new Date(date.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      showFieldError(date, dateError, 'Please select a future date');
      isValid = false;
    }
  }
  
  if (!isValid) {
    const firstError = form.querySelector('.error');
    if (firstError) {
      firstError.focus({ preventScroll: true });
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  return isValid;
}

function showFieldError(field, errorEl, message) {
  field.classList.add('error');
  if (errorEl) { errorEl.textContent = message; errorEl.classList.add('show'); }
}

function removeErrorStates(form) {
  form.querySelectorAll('.error').forEach(function(el) { el.classList.remove('error'); });
  form.querySelectorAll('.form-error').forEach(function(el) {
    el.textContent = '';
    el.classList.remove('show');
  });
}

function showFormMessage(element, message, type) {
  if (!element) return;
  element.textContent = message;
  element.className = 'form-message';
  element.classList.add(type);
  element.classList.add('slide-down');
  clearTimeout(element._timeout);
  element._timeout = setTimeout(function() {
    element.classList.remove('slide-down');
    setTimeout(function() { element.textContent = ''; element.className = 'form-message'; }, 300);
  }, 8000);
}

// ========================================
// SCROLL REVEAL
// ========================================
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');
  if (revealElements.length === 0) return;
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revealElements.forEach(function(el) { observer.observe(el); });
}

// ========================================
// BACK TO TOP
// ========================================
function initBackToTop() {
  const backTop = document.getElementById('backTop');
  if (!backTop) return;
  let isVisible = false;
  window.addEventListener('scroll', function() {
    const shouldShow = window.scrollY > 500;
    if (shouldShow && !isVisible) { backTop.classList.add('show'); isVisible = true; }
    else if (!shouldShow && isVisible) { backTop.classList.remove('show'); isVisible = false; }
  }, { passive: true });
  backTop.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

// ========================================
// SERVICE CARDS
// ========================================
function initServiceCards() {
  const services = [
    { icon: 'fa-tshirt', name: 'Laundry', desc: 'Premium washing, sanitizing, drying & folding.' },
    { icon: 'fa-home', name: 'Home Cleaning', desc: 'Everyday dusting, mopping, sweeping & wipe-downs.' },
    { icon: 'fa-couch', name: 'Sofa Cleaning', desc: 'Deep embedded dirt, dust, mites & allergens.' },
    { icon: 'fa-bed', name: 'Mattress Cleaning', desc: 'Intense suction extraction for clean, safe sleep.' },
    { icon: 'fa-calendar-check', name: 'Event Cleaning', desc: 'Restore clarity after corporate functions & parties.' },
    { icon: 'fa-hard-hat', name: 'Post Construction', desc: 'Clear debris, paint residue, and deep dust safely.' },
    { icon: 'fa-wind', name: 'Window Cleaning', desc: 'Streak-free shine for your home or office.' },
    { icon: 'fa-tools', name: 'Deep Cleaning', desc: 'Complete overhaul for a fresh start.' }
  ];
  
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;
  
  grid.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    skeleton.style.cssText = 'height:200px;background:linear-gradient(90deg,#2a2a2d 25%,#3a3a3e 50%,#2a2a2d 75%);background-size:200% 100%;animation:skeletonLoading 1.5s ease-in-out infinite;border-radius:var(--radius-lg);';
    grid.appendChild(skeleton);
  }
  
  setTimeout(function() {
    grid.innerHTML = '';
    services.forEach(function(service) {
      const card = document.createElement('div');
      card.className = 'service-card';
      card.innerHTML = 
        '<i class="fas ' + service.icon + '" aria-hidden="true"></i>' +
        '<h4>' + service.name + '</h4>' +
        '<p>' + service.desc + '</p>' +
        '<button type="button" class="btn-sm" data-service="' + service.name + '">Book This</button>';
      grid.appendChild(card);
    });
    
    document.querySelectorAll('.service-card .btn-sm').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const service = this.dataset.service;
        const select = document.getElementById('cf-service');
        if (service && select) {
          Array.from(select.options).forEach(function(opt) {
            if (opt.value === service) select.value = service;
          });
        }
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          const navHeight = document.querySelector('.navbar')?.offsetHeight || 80;
          const targetPosition = contactSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
          setTimeout(function() {
            const nameField = document.getElementById('cf-name');
            if (nameField) nameField.focus({ preventScroll: true });
          }, 800);
        }
      });
    });
  }, 800);
}
