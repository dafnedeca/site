/* Cookie Consent — LGPD/Consent Mode v2
   Bloqueia GA4 por padrão; libera apenas com consentimento explícito.
   Decisão salva em localStorage por 365 dias. */
(function () {
  var KEY = 'dafne_cookie_consent';
  var EXPIRY_KEY = 'dafne_cookie_consent_expiry';
  var DAYS = 365;

  function getConsent() {
    var expiry = localStorage.getItem(EXPIRY_KEY);
    if (expiry && Date.now() > parseInt(expiry, 10)) {
      localStorage.removeItem(KEY);
      localStorage.removeItem(EXPIRY_KEY);
      return null;
    }
    return localStorage.getItem(KEY);
  }

  function saveConsent(value) {
    localStorage.setItem(KEY, value);
    localStorage.setItem(EXPIRY_KEY, Date.now() + DAYS * 86400000);
  }

  function grantAnalytics() {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', { analytics_storage: 'granted' });
    }
  }

  function denyAnalytics() {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', { analytics_storage: 'denied' });
    }
  }

  function hideBanner() {
    var el = document.getElementById('cookie-consent-banner');
    if (el) el.remove();
  }

  function showBanner() {
    if (document.getElementById('cookie-consent-banner')) return;
    var banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.innerHTML =
      '<div class="ccb-inner">' +
        '<div class="ccb-text">' +
          '<strong>Cookies analíticos</strong>' +
          'Este site usa o Google Analytics para entender como os visitantes interagem com o conteúdo.' +
          ' Nenhum dado identificável é coletado sem sua autorização.' +
          ' <a href="privacidade.html">Política de Privacidade</a>' +
        '</div>' +
        '<div class="ccb-actions">' +
          '<button class="ccb-btn ccb-reject" id="ccb-reject">Recusar</button>' +
          '<button class="ccb-btn ccb-accept" id="ccb-accept">Aceitar</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    document.getElementById('ccb-accept').addEventListener('click', function () {
      saveConsent('granted');
      grantAnalytics();
      hideBanner();
    });
    document.getElementById('ccb-reject').addEventListener('click', function () {
      saveConsent('denied');
      denyAnalytics();
      hideBanner();
    });
  }

  var consent = getConsent();
  if (consent === 'granted') {
    grantAnalytics();
  } else if (!consent) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
})();
