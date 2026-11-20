/* Gravity Forms listener by MD Niamul - mdniamul.com
   Fires gravity_form_submit once per real Gravity Forms submission:
   - AJAX forms with a message confirmation (gform_confirmation_loaded)
   - AJAX forms that redirect to another page or URL
   - non-AJAX forms that reload the page with the confirmation message
   Validation errors, spam (honeypot) and failed submits send nothing. */
(function () {
  if (window.__mdnGravityBasic) return; // tag fired twice: keep one copy
  window.__mdnGravityBasic = true;
  window.dataLayer = window.dataLayer || [];

  var KEY = 'mdn_gf_pending';
  var sent = {};

  function store(obj) { try { if (obj) sessionStorage.setItem(KEY, JSON.stringify(obj)); else sessionStorage.removeItem(KEY); } catch (e) {} }
  function load() { try { return JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }

  function formName(id) {
    var t = document.querySelector('#gform_wrapper_' + id + ' .gform_title');
    return t ? t.textContent.replace(/\s+/g, ' ').trim() : '';
  }

  function push(id, name, type) {
    id = String(id || '');
    if (!id || sent[id]) return;
    sent[id] = true;
    store(null);
    window.dataLayer.push({
      event: 'gravity_form_submit',
      form_id: id,
      form_name: name || '',
      confirmation_type: type,
      page_path: window.location.pathname
    });
  }

  // 1) Remember which form was sent (button click, Enter key, submit)
  function remember(form) {
    if (!form || !/^gform_\d+$/.test(form.id || '')) return;
    var id = form.id.replace('gform_', '');
    sent[id] = false;
    store({ id: id, name: formName(id), path: window.location.pathname, at: new Date().getTime(), status: 'sent' });
  }
  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('[id^="gform_submit_button_"], .gform_button') : null;
    if (b && b.form) remember(b.form);
  }, true);
  document.addEventListener('submit', function (e) { remember(e.target); }, true);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target && e.target.form && e.target.tagName !== 'TEXTAREA') remember(e.target.form);
  }, true);

  // 2) AJAX: validation error (form comes back) or redirect (watch the AJAX frame)
  function watchFrames() {
    var frames = document.querySelectorAll('iframe[id^="gform_ajax_frame_"]');
    for (var i = 0; i < frames.length; i++) {
      if (frames[i].__mdn) continue;
      frames[i].__mdn = true;
      frames[i].addEventListener('load', function () {
        var p = load();
        if (!p) return;
        try {
          var html = this.contentDocument && this.contentDocument.documentElement ? this.contentDocument.documentElement.innerHTML : '';
          if (html.indexOf('GF_AJAX_POSTBACK') === -1) return;
          if (html.indexOf('gformRedirect(){') !== -1) { p.status = 'redirecting'; store(p); }
          else if (html.indexOf('gform_confirmation_wrapper') === -1) store(null); // form back = errors
        } catch (e) {}
      });
    }
  }

  // 3) AJAX message confirmation
  function hookjQuery() {
    var $ = window.jQuery;
    if (!$ || hookjQuery.done) return !!hookjQuery.done;
    hookjQuery.done = true;
    $(document).on('gform_confirmation_loaded', function (e, id) {
      var p = load();
      push(id, p && String(p.id) === String(id) ? p.name : formName(id), 'message');
    });
    return true;
  }

  // 4) After a page load: non-AJAX confirmation, or the redirect target page
  function onLoad() {
    var p = load();
    if (!p) return;
    var age = new Date().getTime() - (p.at || 0);
    if (age > 10 * 60 * 1000) { store(null); return; }
    var msg = document.getElementById('gform_confirmation_message_' + p.id);
    if (msg) { push(p.id, p.name, 'page_reload'); return; }
    if (document.querySelector('#gform_wrapper_' + p.id + '.gform_validation_error')) { store(null); return; }
    if (p.status === 'redirecting' || (p.path !== window.location.pathname && age < 2 * 60 * 1000)) {
      push(p.id, p.name, 'redirect');
    }
  }

  var tries = 0;
  (function wait() {
    watchFrames();
    var ok = hookjQuery();
    if (tries === 0) {
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onLoad); else onLoad();
    }
    if (++tries < 40 && (!ok || !document.querySelector('iframe[id^="gform_ajax_frame_"]'))) setTimeout(wait, 250);
  })();
})();
