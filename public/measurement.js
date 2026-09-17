(() => {
  const id = 'G-L9W9MW0S9J';
  const key = 'mwc-analytics-consent';
  let enabled = false;
  const read = () => { try { return localStorage.getItem(key); } catch { return null; } };
  function enable() {
    if (enabled || !['www.midcoastweb.com.au', 'midcoastweb.com.au'].includes(location.hostname)) return;
    enabled = true;
    window['ga-disable-' + id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, {
      page_location: location.origin + location.pathname,
      page_referrer: document.referrer ? new URL(document.referrer).origin : '',
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(script);
  }
  function choose(value) {
    try { localStorage.setItem(key, value); } catch { /* Keep this page usable without storage. */ }
    document.querySelector('.measurement-choice')?.remove();
    if (value === 'yes') enable();
    else {
      window['ga-disable-' + id] = true;
      for (const name of ['_ga', '_ga_L9W9MW0S9J']) {
        for (const domain of ['', ';domain=' + location.hostname, ';domain=.midcoastweb.com.au']) {
          document.cookie = name + '=;max-age=0;path=/' + domain;
        }
      }
    }
  }
  function showChoice() {
    if (document.querySelector('.measurement-choice')) return;
    const panel = document.createElement('section');
    panel.className = 'measurement-choice';
    panel.setAttribute('aria-label', 'Website analytics preference');
    panel.innerHTML = '<p>May we use Google Analytics to understand visits and contact clicks? It is optional. <a href="/privacy/">Privacy details</a></p><div><button type="button" data-choice="yes">Allow analytics</button><button type="button" data-choice="no">No thanks</button></div>';
    panel.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-choice]');
      if (button) choose(button.dataset.choice);
    });
    document.body.append(panel);
  }
  document.addEventListener('click', (event) => {
    const target = event.target.closest('a, button');
    if (!target) return;
    if (target.matches('[data-analytics-preferences]')) {
      event.preventDefault();
      if (read() === 'yes') {
        choose('no');
        // Reload stops the already-loaded Google tag. No new consent is assumed.
        location.reload();
      } else showChoice();
      return;
    }
    if (!enabled) return;
    const href = target.getAttribute('href') || '';
    let name;
    if (href.startsWith('mailto:')) name = 'email_click';
    else if (href.startsWith('tel:')) name = 'phone_click';
    else if (target.matches('[data-enquiry-link]')) name = 'enquiry_form_open';
    if (name) window.gtag('event', name, { page_path: location.pathname, transport_type: 'beacon' });
  });
  if (read() === 'yes') enable();
  else if (!read()) showChoice();
})();
