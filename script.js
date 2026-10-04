/* Portfolio cards */
const portfolioGrid = document.getElementById('portfolio-grid');

function safeURL(value) {
  try {
    const url = new URL(value, location.href);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

if (portfolioGrid) {
  (window.PORTFOLIO_PROJECTS || []).slice(0, 6).forEach((project, index) => {
    const projectURL = project.url ? safeURL(project.url) : null;
    const card = createElement('a', 'work-card reveal');
    card.href = projectURL || `portfolio.html?slot=${index + 1}`;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.setAttribute('aria-label', `${project.title} (opens in a new tab)`);

    const cover = createElement('div', 'work-cover');
    if (project.color) cover.style.setProperty('--cover', project.color);
    cover.append(createElement('strong', '', String(index + 1).padStart(2, '0')));

    const imageURL = project.image ? safeURL(project.image) : null;
    // Relative images also work when the project is opened directly from disk.
    const isLocalImage = project.image && !/^[a-z][a-z\d+.-]*:/i.test(project.image)
      && !project.image.startsWith('//');
    if (imageURL || isLocalImage) {
      const image = createElement('img', '');
      image.src = imageURL || project.image;
      image.alt = project.title;
      image.loading = 'lazy';
      image.addEventListener('error', () => image.remove());
      cover.append(image);
    }

    cover.append(createElement('span', 'work-status', projectURL ? 'VIEW PROJECT' : 'COMING SOON'));
    const info = createElement('div', 'work-info');
    const words = createElement('div', '');
    words.append(
      createElement('h3', '', project.title),
      createElement('p', '', project.category)
    );
    const icon = createElement('span', 'external', '⤢');
    icon.setAttribute('aria-hidden', 'true');
    info.append(words, icon);
    card.append(cover, info);
    portfolioGrid.append(card);
  });
}

/* Footer */
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

/* Optional motion: keep content visible when motion or API support is unavailable. */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion) {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    document.documentElement.classList.add('js-motion');
  }

  /* Desktop pointer tilt; touch devices keep the standard layout. */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.tilt').forEach((element) => {
      element.addEventListener('pointermove', (event) => {
        const bounds = element.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        element.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 12}deg) rotateZ(3deg)`;
      });
      element.addEventListener('pointerleave', () => {
        element.style.transform = '';
      });
    });
  }
}
