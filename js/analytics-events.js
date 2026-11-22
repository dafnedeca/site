// GA4 custom event tracking — dafnepsicologa.com.br
document.addEventListener('DOMContentLoaded', function () {
  if (typeof gtag === 'undefined') return;

  // --- WhatsApp clicks ---
  document.querySelectorAll('a[href*="wa.me"]').forEach(function (el) {
    var loc = 'other';
    if (el.classList.contains('nav-cta') || el.classList.contains('nav-mobile-cta')) {
      loc = 'nav';
    } else if (el.classList.contains('contact-card') || el.closest('.contact-card')) {
      loc = 'contact_card';
    } else if (el.closest('.cta-section') || el.closest('.cta-inner')) {
      loc = 'cta_section';
    } else if (el.closest('footer')) {
      loc = 'footer';
    } else if (el.closest('.hero-content') || el.closest('.hero-text')) {
      loc = 'hero';
    } else if (el.classList.contains('btn-primary')) {
      loc = 'section_cta';
    }
    el.addEventListener('click', function () {
      gtag('event', 'whatsapp_click', {
        button_location: loc,
        page_title: document.title
      });
    });
  });

  // --- Instagram clicks ---
  document.querySelectorAll('a[href*="instagram.com"]').forEach(function (el) {
    var loc = el.closest('footer') ? 'footer'
            : el.closest('.cta-section') ? 'cta_section'
            : 'other';
    el.addEventListener('click', function () {
      gtag('event', 'social_click', { platform: 'instagram', location: loc });
    });
  });

  // --- LinkedIn clicks ---
  document.querySelectorAll('a[href*="linkedin.com"]').forEach(function (el) {
    var loc = el.closest('footer') ? 'footer'
            : el.closest('.cta-section') ? 'cta_section'
            : 'other';
    el.addEventListener('click', function () {
      gtag('event', 'social_click', { platform: 'linkedin', location: loc });
    });
  });

  // --- Internal CTA clicks (btn links to other pages) ---
  var pageMap = {
    'sobre.html': 'sobre',
    'especialidades.html': 'especialidades',
    'metodologia.html': 'metodologia',
    'contato.html': 'contato'
  };
  document.querySelectorAll('a.btn').forEach(function (el) {
    var href = el.getAttribute('href') || '';
    var dest = null;
    Object.keys(pageMap).forEach(function (key) {
      if (href.indexOf(key) !== -1) dest = pageMap[key];
    });
    if (dest) {
      el.addEventListener('click', function () {
        gtag('event', 'internal_cta_click', {
          destination: dest,
          button_text: el.textContent.trim().substring(0, 60)
        });
      });
    }
  });
});
