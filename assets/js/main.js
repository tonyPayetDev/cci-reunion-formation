/**
 * CCI Réunion Formation - Main JavaScript
 * Modern interactions and functionality
 */

(function() {
  'use strict';

  // DOM Ready
  document.addEventListener('DOMContentLoaded', function() {
    initHeader();
    initMobileMenu();
    initBackToTop();
    initScrollAnimations();
    initCounterAnimation();
    initSmoothScroll();
    initMediaCards();
  });

  /**
   * Header scroll effect
   */
  function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  /**
   * Mobile menu toggle
   */
  function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuToggle || !nav) return;

    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
      document.body.classList.toggle('menu-open');

      // Animate hamburger
      const spans = menuToggle.querySelectorAll('span');
      spans.forEach(span => span.classList.toggle('active'));
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        nav.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        nav.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  }

  /**
   * Back to top button
   */
  function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    const showThreshold = 300;

    window.addEventListener('scroll', function() {
      if (window.pageYOffset > showThreshold) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /**
   * Scroll animations using Intersection Observer
   */
  function initScrollAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements with animation class
    const animatedElements = document.querySelectorAll(
      '.domaine-card, .stat-card, .media-card, .contact-card'
    );

    animatedElements.forEach(function(el) {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }

  /**
   * Counter animation for stats
   */
  function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observerOptions = {
      threshold: 0.5
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-count'));
          animateCounter(counter, target);
          observer.unobserve(counter);
        }
      });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
  }

  function animateCounter(element, target) {
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const update = function() {
      current += step;
      if (current < target) {
        element.textContent = Math.floor(current).toLocaleString('fr-FR');
        requestAnimationFrame(update);
      } else {
        element.textContent = target.toLocaleString('fr-FR');
      }
    };

    update();
  }

  /**
   * Smooth scroll for anchor links
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        e.preventDefault();

        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  /**
   * Media cards interaction
   */
  function initMediaCards() {
    const mediaCards = document.querySelectorAll('.media-card');

    mediaCards.forEach(card => {
      card.addEventListener('click', function() {
        // In a real implementation, this would open a video modal
        // For now, we'll just log it
        const title = this.querySelector('.media-title')?.textContent || '';
        console.log('Media clicked:', title);

        // Show a coming soon notification
        showNotification('Vidéo bientôt disponible', 'info');
      });
    });
  }

  /**
   * Show notification
   */
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: ${type === 'info' ? '#004165' : '#c41e3a'};
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);

    // Remove after delay
    setTimeout(() => {
      notification.style.transform = 'translateX(-50%) translateY(100px)';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  /**
   * Lazy loading for images
   */
  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
      });
    }
  }

  // Initialize lazy loading
  initLazyLoading();

  // Re-initialize lazy loading on dynamic content
  window.initLazyLoading = initLazyLoading;

})();
