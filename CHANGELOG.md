# Changelog

## v1.0.0 (2026-11-18)

- First release of the free Gravity Forms GTM listener (tested against Gravity Forms 2.10 markup, Orbital theme, AJAX iframe submission).
- Fires `gravity_form_submit` once per accepted entry, with `confirmation_type` message, redirect or page_reload.
- AJAX forms: Gravity Forms' own `gform_confirmation_loaded` event, and the AJAX redirect response.
- Non-AJAX forms: the confirmation message after the reload, or the redirect page.
- Validation errors clear the pending submit, so nothing fires.
- One push per submit, also on a double click or when the GTM tag fires twice.
- Sends the form ID and title only, never the answers.
