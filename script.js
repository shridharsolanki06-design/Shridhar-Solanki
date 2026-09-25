/* ===================================================================
   SHRIDHAR SOLANKI — 3D ARTIST PORTFOLIO
   Interactive Script: Lightbox, Parallax, Nav Scroll, & Animations
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ──────────── Navbar Scroll Effect & Active Highlight ────────────
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleNavScroll() {
    const scrollY = window.scrollY;

    // Toggle blur header style
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Dynamic active link highlighting based on section in viewport
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 180;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Run immediately on page load

  // ──────────── Smooth Scroll for Nav Links ────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 80;
        const targetPosition = targetEl.offsetTop - navHeight + 10;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ──────────── Scroll Reveal Animations ────────────
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ──────────── Hero Image Parallax / Floating Effect ────────────
  const heroImg = document.getElementById('heroImg');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < 800) {
        heroImg.style.transform = `translateY(${scrollY * 0.08}px)`;
      }
    }, { passive: true });
  }

  // ──────────── Stats Counter Animation ────────────
  const statNumbers = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const rawText = el.textContent.trim();
        const suffix = rawText.replace(/[\d]/g, '');
        const targetValue = parseInt(rawText, 10);

        if (isNaN(targetValue)) return;

        let current = 0;
        const step = Math.max(1, Math.floor(targetValue / 30));
        const intervalTime = 35;

        const timer = setInterval(() => {
          current += step;
          if (current >= targetValue) {
            current = targetValue;
            clearInterval(timer);
          }
          el.textContent = current + suffix;
        }, intervalTime);

        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  // ──────────── Mobile Menu Toggle ────────────
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');

  if (navToggle && navLinksContainer) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinksContainer.style.display === 'flex';
      navLinksContainer.style.display = isOpen ? 'none' : 'flex';
      if (!isOpen) {
        navLinksContainer.style.position = 'absolute';
        navLinksContainer.style.top = '80px';
        navLinksContainer.style.left = '0';
        navLinksContainer.style.width = '100%';
        navLinksContainer.style.backgroundColor = '#0c0d12';
        navLinksContainer.style.flexDirection = 'column';
        navLinksContainer.style.padding = '20px';
        navLinksContainer.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
      }
    });
  }

  // ──────────── Portfolio Category Filtering ────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedFilter = btn.getAttribute('data-filter');

      // Update active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter visible cards with subtle fade animation
      portfolioCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (selectedFilter === 'all' || categories.includes(selectedFilter)) {
          card.classList.remove('hidden');
          card.classList.add('animating');
          setTimeout(() => card.classList.remove('animating'), 350);
        } else {
          card.classList.add('hidden');
          card.classList.remove('animating');
        }
      });
    });
  });
});

// ──────────── Lightbox Modal Implementation ────────────
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxSubtitle = document.getElementById('lightboxSubtitle');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxOverlay = document.getElementById('lightboxOverlay');

function openLightbox(imageSrc, title, subtitle) {
  if (!lightbox) return;
  lightboxImg.src = imageSrc;
  lightboxImg.alt = title;
  lightboxTitle.textContent = title;
  lightboxSubtitle.textContent = subtitle || '';
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

if (lightboxOverlay) {
  lightboxOverlay.addEventListener('click', closeLightbox);
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});
