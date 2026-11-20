# Gravity Forms GTM Event Listener

**Free Google Tag Manager listener for Gravity Forms tracking.** It fires one `gravity_form_submit` event after Gravity Forms accepts an entry, for AJAX forms, normal forms and forms that redirect to a thank-you page, so you can track Gravity Forms submissions in GA4, Google Ads, Meta Pixel and any other tag.

![Gravity Forms GTM Event Listener](docs/banner.png)

**Full guide, install video and copy button:** https://mdniamul.com/gtm-event-listeners/gravity-forms-gtm-listener/

---

## What it does

GTM's built-in Form Submission trigger fires on the click, also when a required field is empty or the CAPTCHA fails. This listener waits for Gravity Forms' own result and pushes:

```js
{
  event: 'gravity_form_submit',
  form_id: '3',
  form_name: '',
  confirmation_type: 'message', // or 'redirect' / 'page_reload'
  page_path: '/contact/'
}
```

Built-in safety:

- Fires only after the entry is accepted: AJAX message (`gform_confirmation_loaded`), AJAX or normal redirect, or a reload with the confirmation message
- A form that comes back with errors sends nothing
- One push per submit, also on a double click or when the tag fires twice
- Works with the Orbital and Gravity themes and Gravity Forms 2.9+ submission handling
- Never sends what people typed

## Install in 6 steps

1. Keep your Gravity Forms as they are (AJAX on or off).
2. **GTM → Tags → New → Custom HTML.** Paste [`gravity-forms-gtm-listener.html`](gravity-forms-gtm-listener.html). Trigger: **All Pages** (it must also load on your thank-you page).
3. **Triggers → New → Custom Event**, event name `gravity_form_submit`. Add `form_id equals 3` to track one form.
4. **Variables → New → Data Layer Variable**: `form_id`, `form_name`, `confirmation_type`.
5. Fire your **GA4 event** (for example `generate_lead`), **Google Ads conversion** or **Meta Pixel** `Lead` event on that trigger.
6. **Preview**, submit once with a required field empty (no event), then a real test entry, check Tag Assistant, then **Publish**.

## Files

| File | What it is |
|---|---|
| `gravity-forms-gtm-listener.html` | Ready to paste into a GTM Custom HTML tag |
| `gravity-forms-gtm-listener.js` | Same code without the `<script>` tags |
| `examples/sample-datalayer-output.json` | What the push looks like |

## Videos

- Install the free code: https://mdniamul.com/gtm-event-listeners/gravity-forms-gtm-listener/#install-video
- What the advanced version collects: https://mdniamul.com/gtm-event-listeners/gravity-forms-gtm-listener/#advanced

## Step-by-step guide

- [How to set up WordPress form tracking in GA4 using GTM](https://mdniamul.com/blog/how-to-set-up-wp-form-tracking-in-ga4-using-gtm/)

## Need more data? Advanced version

The free code tells you a Gravity Form was accepted. The **advanced version** also reads the form at submit, by Gravity Forms' own field types, and sends the lead's SHA-256 hashed email, name, phone and address (also on redirect thank-you pages), company, field labels (never the answers), the Consent field answer, UTM values, 17 ad click IDs, first-party cookies (`_ga`, `_fbp`, `_fbc`, `_gcl_au` and more), visitor location and a unique `event_id`. It skips the honeypot spam trap, CAPTCHA and hidden fields. Ready for Google Ads Enhanced Conversions, Meta CAPI, TikTok Events API and server-side GTM.

It comes with a setup video, a PDF guide and a GTM import file in your client portal. The code starts from $89, and setup packages are available:

- Prices: https://mdniamul.com/gtm-event-listeners/gravity-forms-gtm-listener/#pricing
- WhatsApp: https://api.whatsapp.com/send?phone=8801776485758
- Book a call: https://calendly.com/mdniamul
- All listeners: https://mdniamul.com/gtm-event-listeners/

Want it done for you? See my [Google Ads tracking specialist](https://mdniamul.com/google-ads-tracking-specialist/) and [server-side tracking service](https://mdniamul.com/server-side-tracking-service/) pages.

## Troubleshooting

- **No event:** GTM does not load on the form page or the thank-you page, or a caching or optimization plugin delays GTM until after the submit.
- **Check Gravity Forms:** run `jQuery(document).on('gform_confirmation_loaded',(e,id)=>console.log('confirmed',id))` in the console, then submit an AJAX form.
- **Two events:** GTM's Form Submission trigger or an older Gravity Forms script is still live. Keep one.

## About

Built by **[MD Niamul](https://mdniamul.com)**, GoHighLevel & AI Agent Automation, Marketing Attribution and Server-Side Tracking Specialist. Founder of Digital Soldier Agency and official Stape partner.

[Website](https://mdniamul.com) · [Free GTM listeners](https://mdniamul.com/gtm-event-listeners/) · [Book a call](https://calendly.com/mdniamul) · [LinkedIn](https://linkedin.com/in/mdniamul)

## License

MIT. Free to use on your own and your clients' sites. See [LICENSE](LICENSE).
