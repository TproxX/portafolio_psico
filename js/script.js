(() => {
  const mobileToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const topicMenuToggle = document.querySelector('.nav-topics-toggle');
  const topicsMenu = document.querySelector('#topics-menu');
  const topicButtons = [...document.querySelectorAll('.topic-trigger')];

  const closeMobileMenu = () => {
    if (!mobileToggle || !navLinks) return;
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('aria-label', 'Abrir menú');
    navLinks.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  mobileToggle?.addEventListener('click', () => {
    const isOpen = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', String(!isOpen));
    mobileToggle.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
    navLinks.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });

  topicMenuToggle?.addEventListener('click', () => {
    const isOpen = topicMenuToggle.getAttribute('aria-expanded') === 'true';
    topicMenuToggle.setAttribute('aria-expanded', String(!isOpen));
    topicsMenu.hidden = isOpen;
  });

  document.addEventListener('click', (event) => {
    if (topicMenuToggle && topicsMenu && !event.target.closest('.nav-topics')) {
      topicMenuToggle.setAttribute('aria-expanded', 'false');
      topicsMenu.hidden = true;
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      topicMenuToggle?.setAttribute('aria-expanded', 'false');
      if (topicsMenu) topicsMenu.hidden = true;
      closeMobileMenu();
    }
  });

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
      topicMenuToggle?.setAttribute('aria-expanded', 'false');
      if (topicsMenu) topicsMenu.hidden = true;
    });
  });

  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 761px)').matches) closeMobileMenu();
  });

  const setPanelState = (button, shouldOpen) => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;

    button.setAttribute('aria-expanded', String(shouldOpen));
    if (shouldOpen) {
      panel.hidden = false;
      requestAnimationFrame(() => panel.classList.add('is-open'));
      return;
    }

    panel.classList.remove('is-open');
    window.setTimeout(() => {
      if (button.getAttribute('aria-expanded') === 'false') panel.hidden = true;
    }, 360);
  };

  topicButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      setPanelState(button, !isOpen);
    });
  });

  // Keep missing portraits graceful until the authorized photos are supplied.
  document.querySelectorAll('[data-photo]').forEach((image) => {
    const parent = image.closest('.profile-photo');
    const markLoaded = () => parent?.classList.add('has-image');
    image.addEventListener('load', markLoaded);
    image.addEventListener('error', () => {
      image.removeAttribute('src');
      image.alt = '';
    }, { once: true });
    if (image.complete && image.naturalWidth > 0) markLoaded();
  });

  document.querySelectorAll('[data-prenatal-photo]').forEach((image) => {
    const parent = image.closest('.prenatal-photo-frame');
    const markLoaded = () => parent?.classList.add('has-image');
    image.addEventListener('load', markLoaded);
    image.addEventListener('error', () => {
      image.hidden = true;
    }, { once: true });
    if (image.complete && image.naturalWidth > 0) markLoaded();
  });

  // Highlight the section and question currently in view.
  const navTargets = [...document.querySelectorAll('.nav-links > a[href^="#"], .topics-menu a[href^="#"]')];
  const markCurrent = (id) => {
    navTargets.forEach((link) => {
      if (link.getAttribute('href') === `#${id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) markCurrent(visible.target.id);
    }, { rootMargin: '-22% 0px -62% 0px', threshold: [0, 0.2, 0.5] });

    document.querySelectorAll('#introduccion, #objetivos, #tema-1, #tema-2, #tema-3, #tema-4, #tema-5, #tema-6, #tema-7, #tema-8, #tema-9, #referencias').forEach((section) => observer.observe(section));
  }
})();
