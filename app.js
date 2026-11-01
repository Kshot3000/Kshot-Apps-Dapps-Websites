(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  $('year').textContent = new Date().getFullYear();
  const menu = $('menu-toggle');
  const navigation = $('navigation');
  menu.hidden = false;
  navigation.classList.add('collapsed');
  menu.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(expanded));
    navigation.classList.toggle('collapsed', !expanded);
  });
  navigation.addEventListener('click', e => {
    if (e.target.closest('a')) {
      navigation.classList.add('collapsed');
      menu.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      menu.setAttribute('aria-expanded', 'false');
      navigation.classList.add('collapsed');
      menu.focus();
    }
  });
  const previews = {
    website: ['your-next-business.com', 'A memorable first impression. A clear path to an inquiry.'],
    app: ['your-workspace.app', 'A useful workspace, built around the way your business runs.'],
    dapp: ['your-community.xyz', 'A familiar interface for your next on-chain experience.']
  };
  document.querySelectorAll('[data-preview]').forEach(button => {
    button.addEventListener('click', () => {
      const type = button.dataset.preview;
      Object.keys(previews).forEach(key => { $('concept-' + key).hidden = key !== type; });
      document.querySelectorAll('[data-preview]').forEach(b => {
        const selected = b === button;
        b.classList.toggle('selected', selected);
        b.setAttribute('aria-pressed', String(selected));
      });
      $('preview-url').textContent = previews[type][0];
      $('preview-description').textContent = previews[type][1];
    });
  });
  document.querySelectorAll('[data-package]').forEach(link => {
    link.addEventListener('click', () => {
      $('project-type').value = link.dataset.package;
    });
  });
  let currentBrief = '';
  $('brief-form').addEventListener('submit', e => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const field = key => String(data.get(key) || '').trim();
    currentBrief = [
      'PROJECT BRIEF — KSHOT APPLICATIONS', '',
      'Name: ' + field('name'), 'Email: ' + field('email'),
      'Project: ' + field('type'), 'Budget: ' + field('budget'),
      'Timing: ' + field('timing'), '', 'The idea:', field('idea'), '',
      'Please help me confirm the scope, cost, and delivery plan.'
    ].join('\n');
    $('brief-output').value = currentBrief;
    $('email-brief').href = 'mailto:kcaidevelopment@gmail.com?subject=' + encodeURIComponent('Project inquiry: ' + field('type')) + '&body=' + encodeURIComponent(currentBrief);
    $('brief-result').hidden = false;
    $('brief-status').textContent = 'Brief ready. Open an email draft, copy it, or download it. Nothing has been sent.';
    $('brief-output').focus();
  });
  $('copy-brief').addEventListener('click', async () => {
    if (!currentBrief) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(currentBrief);
      $('brief-status').textContent = 'Brief copied. Paste it into your email to kcaidevelopment@gmail.com.';
    } catch {
      $('brief-output').focus();
      $('brief-output').select();
      $('brief-status').textContent = 'Automatic copy is unavailable. Your brief is selected; use your device’s Copy command, or download the text file.';
    }
  });
  $('download-brief').addEventListener('click', () => {
    if (!currentBrief) return;
    const url = URL.createObjectURL(new Blob([currentBrief], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Kshot-Project-Brief.txt';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $('brief-status').textContent = 'Brief prepared for download. Email the file to kcaidevelopment@gmail.com when ready.';
  });
})();
