/* Cookie Consent — LGPD / Consent Mode v2
   3 opções:
   - 'necessary': GA4 cookieless (dados anônimos de modelagem, sem cookies identificáveis)
   - 'denied':    bloqueia rastreamento completamente
   - 'granted':   GA4 completo com cookies
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
          '<strong>Cookies e privacidade</strong>' +
          'Usamos o Google Analytics para entender como as pessoas navegam pelo site.' +
          ' Você decide o quanto compartilha.' +
          ' <a href="privacidade.html">Política de Privacidade</a>' +
        '</div>' +
        '<div class="ccb-actions">' +
          '<button class="ccb-btn ccb-necessary" id="ccb-necessary">Somente necessários</button>' +
          '<button class="ccb-btn ccb-reject" id="ccb-reject">Recusar</button>' +
          '<button class="ccb-btn ccb-accept" id="ccb-accept">Aceitar todos</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    /* Somente necessários: GA4 roda em modo cookieless (sem identificação individual,
       só dados agregados de modelagem). Nenhum cookie de rastreamento é criado. */
    document.getElementById('ccb-necessary').addEventListener('click', function () {
      saveConsent('necessary');
      hideBanner();
      /* analytics_storage permanece 'denied' — Consent Mode v2 ainda envia
         dados anônimos para modelagem sem criar cookies. */
    });

    /* Recusar: bloqueia qualquer coleta, inclusive modelagem anônima. */
    document.getElementById('ccb-reject').addEventListener('click', function () {
      saveConsent('denied');
      if (typeof gtag === 'function') {
        gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied' });
      }
      hideBanner();
    });

    /* Aceitar todos: rastreamento completo com cookies. */
    document.getElementById('ccb-accept').addEventListener('click', function () {
      saveConsent('granted');
      grantAnalytics();
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
  /* 'necessary' e 'denied': analytics_storage permanece 'denied' (padrão do Consent Mode v2).
     'denied' adicionalmente re-afirma o bloqueio a cada carregamento de página. */
  if (consent === 'denied' && typeof gtag === 'function') {
    gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied' });
  }
})();
