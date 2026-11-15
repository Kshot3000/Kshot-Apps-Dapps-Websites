(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const X_PROFILE = 'https://x.com/kshot9000';
  const REF_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  const year = $('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const menu = $('menu-toggle');
  const navigation = $('navigation');
  if (menu && navigation) {
    menu.hidden = false;
    navigation.classList.add('collapsed');
    menu.addEventListener('click', () => {
      const expanded = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(expanded));
      navigation.classList.toggle('collapsed', !expanded);
    });
    navigation.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        navigation.classList.add('collapsed');
        menu.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        menu.setAttribute('aria-expanded', 'false');
        navigation.classList.add('collapsed');
        menu.focus();
      }
    });
  }

  function fillQr(el, value, label) {
    if (!el || typeof qrcode !== 'function') return;
    const qr = qrcode(0, 'M');
    qr.addData(value);
    qr.make();
    el.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
    const svg = el.querySelector('svg');
    if (svg) {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', label);
    }
  }

  const addresses = {
    ADA: 'addr1q8hnl6vl5a6k3rw3n5g3jtte696zcl76kfatzv7gpswa9r0dj7fma6klq55y4ffm7tf0em09udnyhuk4ah92pl5x9jpqjae44v',
    BTC: '3GnR7TWBXAB3pPztBWpNF4LMNEX5yX8vZK',
    SOL: 'FEqXqiJt2eQ9tRhukHgYxQMiN7xkTrR8PHrR4sh7u1zG'
  };

  fillQr($('qr-ada'), addresses.ADA, 'QR code for the ADA payment address');
  fillQr($('qr-btc'), addresses.BTC, 'QR code for the BTC payment address');
  fillQr($('qr-sol'), addresses.SOL, 'QR code for the SOL payment address');

  async function copyText(text, statusEl, okMessage) {
    if (!text) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      if (statusEl) statusEl.textContent = okMessage;
    } catch {
      if (statusEl) statusEl.textContent = 'Automatic copy is unavailable. Select the text and use your device’s Copy command.';
    }
  }

  document.querySelectorAll('[data-copy-address]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-copy-address');
      const source = $(id);
      const value = (source?.textContent || '').trim();
      const status = $('pay-status');
      const label = button.getAttribute('data-asset') || 'address';
      copyText(value, status, label + ' address copied.');
      if (value) {
        const original = button.dataset.originalLabel || button.textContent;
        button.dataset.originalLabel = original;
        button.textContent = 'Copied';
        setTimeout(() => { button.textContent = original; }, 1600);
      }
    });
  });

  function escapeAttr(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;');
  }

  let config = null;
  let jobsById = Object.create(null);
  let packagesById = Object.create(null);

  function orderableJobs(data) {
    return (data.jobs || []).filter((job) => job.orderable !== false);
  }

  function orderablePackages(data) {
    const items = data.packages && Array.isArray(data.packages.items) ? data.packages.items : [];
    return items.filter((item) => item.orderable !== false);
  }

  function optionHtml(value, label, selectedValue) {
    const selected = selectedValue === value ? ' selected' : '';
    return '<option value="' + escapeAttr(value) + '"' + selected + '>' + escapeAttr(label) + '</option>';
  }

  function applyConfig(data) {
    config = data;
    jobsById = Object.create(null);
    packagesById = Object.create(null);
    const jobs = orderableJobs(data);
    const packages = orderablePackages(data);
    jobs.forEach((job) => { jobsById[job.id] = job; });
    packages.forEach((item) => { packagesById[item.id] = item; });

    const select = $('job-type');
    if (select) {
      const current = select.value;
      const parts = ['<option value="">Pick a job type or package</option>'];
      if (jobs.length) {
        parts.push('<optgroup label="Single jobs">');
        jobs.forEach((job) => {
          parts.push(optionHtml(job.id, job.name + ' — ' + job.priceLabel, current));
        });
        parts.push('</optgroup>');
      }
      if (packages.length) {
        parts.push('<optgroup label="Starter packages">');
        packages.forEach((item) => {
          parts.push(optionHtml(item.id, item.name + ' — ' + item.priceLabel, current));
        });
        parts.push('</optgroup>');
      }
      select.innerHTML = parts.join('');
    }

    const tryChoice = $('try-it-choice');
    const tryIt = packagesById.try_it;
    if (tryChoice && tryIt && Array.isArray(tryIt.pick_one_of)) {
      const currentChoice = tryChoice.value;
      const parts = ['<option value="">Pick one Try-It job</option>'];
      tryIt.pick_one_of.forEach((id) => {
        const job = jobsById[id];
        if (job) parts.push(optionHtml(job.id, job.name + ' — ' + job.priceLabel, currentChoice));
      });
      tryChoice.innerHTML = parts.join('');
    }

    toggleTryIt();
  }

  function toggleTryIt() {
    const wrap = $('try-it-fields');
    const choice = $('try-it-choice');
    const selected = $('job-type')?.value === 'try_it';
    if (wrap) wrap.hidden = !selected;
    if (choice) {
      choice.required = selected;
      if (!selected) choice.value = '';
    }
  }

  $('job-type')?.addEventListener('change', toggleTryIt);

  fetch('services.json', { cache: 'no-cache' })
    .then((res) => {
      if (!res.ok) throw new Error('Could not load services.json');
      return res.json();
    })
    .then(applyConfig)
    .catch(() => {
      const status = $('quote-status');
      if (status && !status.textContent) {
        status.textContent = 'The price list could not be loaded. You can still build a quote with the job types on this page.';
      }
      toggleTryIt();
    });

  function randomRef() {
    const bytes = new Uint8Array(6);
    crypto.getRandomValues(bytes);
    let out = 'KS-';
    for (let i = 0; i < 6; i++) out += REF_CHARS[bytes[i] % REF_CHARS.length];
    return out;
  }

  function resolveSelection(typeId, tryItJobId) {
    const job = jobsById[typeId];
    if (job) {
      return { label: job.name, priceLine: job.priceLabel + ' (' + job.currency + ')', turnaround: job.turnaround };
    }
    const pack = packagesById[typeId];
    if (!pack) return null;
    if (pack.id === 'try_it') {
      const picked = jobsById[tryItJobId];
      if (!picked) return null;
      if (Array.isArray(pack.pick_one_of) && !pack.pick_one_of.includes(picked.id)) return null;
      return {
        label: pack.name + ': ' + picked.name,
        priceLine: picked.priceLabel + ' (' + picked.currency + ')',
        turnaround: pack.turnaround || picked.turnaround
      };
    }
    return {
      label: pack.name,
      priceLine: pack.priceLabel + (pack.currency ? ' (' + pack.currency + ')' : ' (USD)'),
      turnaround: pack.turnaround || ''
    };
  }

  let currentQuote = '';
  let currentRef = '';

  const form = $('quote-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const field = (key) => String(data.get(key) || '').trim();
    const typeId = field('type');
    const idea = field('idea');
    const size = field('size');
    const deadline = field('deadline');
    const contact = field('contact');
    const tryItJob = field('tryItJob');
    if (!typeId || !idea || !size || !deadline) return;
    if (typeId === 'try_it' && !tryItJob) return;

    const selection = resolveSelection(typeId, tryItJob);
    if (!selection) return;

    currentRef = randomRef();
    currentQuote = [
      'KSHOT APPLICATIONS — AI WORK DESK QUOTE',
      'Reference: ' + currentRef,
      '',
      'Job or package: ' + selection.label,
      'Price: ' + selection.priceLine,
      selection.turnaround ? 'Typical turnaround: ' + selection.turnaround : '',
      'Size or volume: ' + size,
      'Deadline: ' + deadline,
      'X handle or Telegram: ' + (contact || 'Not provided'),
      '',
      'What they need done:',
      idea,
      '',
      'The work is AI-generated, made with tools including Grok, and reviewed before delivery.',
      'This is a quote request for finished work, not access to an AI tool.',
      "We reply with the exact coin amount at that day's rate. Pay after we confirm, and the amount holds for 24 hours.",
      'Kshot Applications is independent and not affiliated with xAI.',
      'Jobs under $100 are paid upfront. Bigger jobs are half upfront and half on delivery.',
      'When you pay, put this reference code in the payment memo where the coin supports one, and DM the transaction ID together with this code to @kshot9000.',
      'You may not use the output to train AI models.',
      '',
      'To send this: copy it and DM @kshot9000 on X.',
      'Nothing on this page is sent or stored automatically.'
    ].filter((line, i, arr) => line !== '' || (arr[i - 1] !== '')).join('\n');

    const output = $('quote-output');
    const result = $('quote-result');
    const refEl = $('quote-ref');
    const message = $('message-x');
    output.value = currentQuote;
    refEl.textContent = currentRef;
    result.hidden = false;
    if (message) message.href = X_PROFILE;
    $('quote-status').textContent = 'Quote ready. Your reference code is ' + currentRef + '. Copy the quote below and DM it to @kshot9000 on X. We will not see this quote until you send it. Nothing is sent or stored automatically. When you pay, put this reference code in the payment memo where the coin supports one, and DM the transaction ID together with this code to @kshot9000.';
    output.focus();
  });

  $('copy-quote')?.addEventListener('click', () => {
    copyText(currentQuote, $('quote-status'), 'Quote copied. Paste it into a DM to @kshot9000 on X.');
  });

  $('copy-ref')?.addEventListener('click', () => {
    copyText(currentRef, $('quote-status'), 'Reference code ' + currentRef + ' copied.');
  });
})();
