(() => {
  const form = document.getElementById('enquiry-form');
  if (!form) return;
  const status = document.getElementById('form-status');
  const button = form.querySelector('button[type="submit"]');
  const endpoint = 'https://api.web3forms.com/submit';
  const say = (text, kind) => {
    status.textContent = text;
    status.className = 'form-status full' + (kind ? ' ' + kind : '');
  };
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    if (data.botcheck) return;
    if (String(data.access_key).includes('__')) {
      say('The form is not switched on yet. Please call 0466 715 661 or email hello@midcoastweb.com.au.', 'err');
      return;
    }
    button.disabled = true;
    say('Sending...');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error('send failed');
      form.reset();
      say('Thanks, your enquiry has been sent. We will be in touch by phone or email.', 'ok');
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', { page_path: location.pathname, transport_type: 'beacon' });
      }
    } catch {
      say('Sorry, that did not send. Please call 0466 715 661 or email hello@midcoastweb.com.au.', 'err');
    } finally {
      button.disabled = false;
    }
  });
})();
