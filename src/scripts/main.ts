/**
 * kidult.art — Main Entry Point
 * Navigation, Header, Mobile Menu, Scroll Animations, Form Validation
 */

// Import styles
import '../styles/base.css';
import '../styles/components.css';
import '../styles/sections.css';
import '../styles/responsive.css';

// ═══════════════════════════════════════════════════════════════════════════
// HEADER & NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════

const header = document.getElementById('header');
const burger = document.querySelector('.burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

// Sticky header on scroll
function handleHeaderScroll() {
  if (window.scrollY > 50) {
    header?.classList.add('scrolled');
  } else {
    header?.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleHeaderScroll, { passive: true });

// Mobile menu toggle
function toggleMobileMenu() {
  const burgerActive = burger?.classList.contains('active');
  
  mobileMenu?.classList.toggle('active');
  burger?.classList.toggle('active');
  
  if (burger) {
    burger.setAttribute('aria-expanded', String(!burgerActive));
  }
}

burger?.addEventListener('click', toggleMobileMenu);

// Close mobile menu on link click
mobileNavLinks.forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu?.classList.remove('active');
    burger?.classList.remove('active');
    if (burger) {
      burger.setAttribute('aria-expanded', 'false');
    }
  });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (
    mobileMenu?.classList.contains('active') &&
    !mobileMenu.contains(e.target as Node) &&
    !burger?.contains(e.target as Node)
  ) {
    mobileMenu.classList.remove('active');
    burger?.classList.remove('active');
    if (burger) {
      burger.setAttribute('aria-expanded', 'false');
    }
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// SMOOTH SCROLL & ACTIVE NAV LINK
// ═══════════════════════════════════════════════════════════════════════════

const sections = document.querySelectorAll('section[id]');

function handleScrollHighlight() {
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionHeight = (section as HTMLElement).offsetHeight;
    const sectionTop = (section as HTMLElement).offsetTop - 100;
    const sectionId = section.getAttribute('id');

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document.querySelectorAll('.nav-link').forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', handleScrollHighlight, { passive: true });

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e: Event) => {
    const href = (e.target as HTMLAnchorElement).getAttribute('href');
    if (href && href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// COUNTER ANIMATION
// ═══════════════════════════════════════════════════════════════════════════

const statNumbers = document.querySelectorAll('.card-stat-number[data-count]');
const counterObserverOptions = {
  threshold: 0.5,
  rootMargin: '0px',
};

function animateCounter(element: Element) {
  const target = parseInt(element.getAttribute('data-count') || '0', 10);
  const duration = 1500;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      element.textContent = `${target}+`;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toString();
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.target.getAttribute('data-counted') !== 'true') {
      animateCounter(entry.target);
      entry.target.setAttribute('data-counted', 'true');
    }
  });
}, counterObserverOptions);

statNumbers.forEach((stat) => counterObserver.observe(stat));

// ═══════════════════════════════════════════════════════════════════════════
// CONTACT FORM VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

const contactForm = document.getElementById('contact-form') as HTMLFormElement;
const nameInput = document.getElementById('name') as HTMLInputElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const projectInput = document.getElementById('project') as HTMLTextAreaElement;
const formSuccess = document.getElementById('form-success');

const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const projectError = document.getElementById('project-error');

function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showError(input: HTMLElement, errorElement: HTMLElement | null, message: string) {
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
  input.classList.add('error');
}

function clearError(input: HTMLElement, errorElement: HTMLElement | null) {
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
  input.classList.remove('error');
}

// Real-time validation
nameInput?.addEventListener('blur', () => {
  if (nameInput && nameInput.value.trim() === '') {
    showError(nameInput, nameError, 'Введите имя');
  } else {
    clearError(nameInput, nameError);
  }
});

emailInput?.addEventListener('blur', () => {
  if (emailInput && emailInput.value.trim() === '') {
    showError(emailInput, emailError, 'Введите email');
  } else if (emailInput && !validateEmail(emailInput.value)) {
    showError(emailInput, emailError, 'Некорректный email');
  } else {
    clearError(emailInput, emailError);
  }
});

projectInput?.addEventListener('blur', () => {
  if (projectInput && projectInput.value.trim() === '') {
    showError(projectInput, projectError, 'Опишите проект');
  } else if (projectInput && projectInput.value.trim().length < 10) {
    showError(projectInput, projectError, 'Минимум 10 символов');
  } else {
    clearError(projectInput, projectError);
  }
});

// Form submission
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  let isValid = true;

  // Validate name
  if (!nameInput || nameInput.value.trim() === '') {
    showError(nameInput, nameError, 'Введите имя');
    isValid = false;
  } else {
    clearError(nameInput, nameError);
  }

  // Validate email
  if (!emailInput || emailInput.value.trim() === '') {
    showError(emailInput, emailError, 'Введите email');
    isValid = false;
  } else if (!validateEmail(emailInput.value)) {
    showError(emailInput, emailError, 'Некорректный email');
    isValid = false;
  } else {
    clearError(emailInput, emailError);
  }

  // Validate project
  if (!projectInput || projectInput.value.trim() === '') {
    showError(projectInput, projectError, 'Опишите проект');
    isValid = false;
  } else if (projectInput.value.trim().length < 10) {
    showError(projectInput, projectError, 'Минимум 10 символов');
    isValid = false;
  } else {
    clearError(projectInput, projectError);
  }

  if (isValid) {
    // Show success message (placeholder - would normally submit to backend)
    if (formSuccess) {
      formSuccess.style.display = 'block';
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    contactForm.reset();
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      if (formSuccess) {
        formSuccess.style.display = 'none';
      }
    }, 5000);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL ANIMATIONS (Intersection Observer)
// ═══════════════════════════════════════════════════════════════════════════

const animateOnScrollElements = document.querySelectorAll(
  '.section-header, .service-card, .case-card, .tech-group, .contact-form-wrapper, .about-content, .about-stats'
);

const scrollAnimationObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        scrollAnimationObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  }
);

animateOnScrollElements.forEach((el) => {
  el.classList.add('animate-on-scroll');
  scrollAnimationObserver.observe(el);
});

// Add animation styles dynamically
const animationStyles = document.createElement('style');
animationStyles.textContent = `
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  
  .animate-on-scroll.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
  
  .service-card:nth-child(1) { transition-delay: 0s; }
  .service-card:nth-child(2) { transition-delay: 0.1s; }
  .service-card:nth-child(3) { transition-delay: 0.2s; }
  .service-card:nth-child(4) { transition-delay: 0.3s; }
  .service-card:nth-child(5) { transition-delay: 0.4s; }
  .service-card:nth-child(6) { transition-delay: 0.5s; }
  .service-card:nth-child(7) { transition-delay: 0.6s; }
  .service-card:nth-child(8) { transition-delay: 0.7s; }
  .service-card:nth-child(9) { transition-delay: 0.8s; }
  
  .case-card:nth-child(1) { transition-delay: 0.1s; }
  .case-card:nth-child(2) { transition-delay: 0.2s; }
  .case-card:nth-child(3) { transition-delay: 0.3s; }
  .case-card:nth-child(4) { transition-delay: 0.4s; }
  .case-card:nth-child(5) { transition-delay: 0.5s; }
`;
document.head.appendChild(animationStyles);

// ═══════════════════════════════════════════════════════════════════════════
// DEMO SECTION PLACEHOLDER INTERACTION
// ═══════════════════════════════════════════════════════════════════════════

const demoRotateBtn = document.getElementById('demo-rotate');
const demoZoomBtn = document.getElementById('demo-zoom');
const demoAnimateBtn = document.getElementById('demo-animate');
const demoWireframeBtn = document.getElementById('demo-wireframe');
const demoCanvas = document.getElementById('demo-canvas');

// Placeholder interaction - just visual feedback for now
demoRotateBtn?.addEventListener('click', () => {
  demoCanvas?.style.setProperty('transform', 'rotate(360deg)');
  demoCanvas?.style.setProperty('transition', 'transform 1s ease');
  setTimeout(() => {
    demoCanvas?.style.removeProperty('transform');
  }, 1000);
});

demoZoomBtn?.addEventListener('click', () => {
  demoCanvas?.style.setProperty('transform', 'scale(1.1)');
  demoCanvas?.style.setProperty('transition', 'transform 0.3s ease');
  setTimeout(() => {
    demoCanvas?.style.removeProperty('transform');
  }, 300);
});

demoAnimateBtn?.addEventListener('click', () => {
  demoCanvas?.style.setProperty('opacity', '0.7');
  setTimeout(() => {
    demoCanvas?.style.setProperty('opacity', '1');
  }, 300);
});

demoWireframeBtn?.addEventListener('click', () => {
  demoCanvas?.style.setProperty('filter', 'hue-rotate(90deg)');
  setTimeout(() => {
    demoCanvas?.style.removeProperty('filter');
  }, 500);
});

// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

console.log('kidult.art — Welcome!');
console.log('Landing page initialized successfully.');

// Initial checks
handleHeaderScroll();
handleScrollHighlight();
