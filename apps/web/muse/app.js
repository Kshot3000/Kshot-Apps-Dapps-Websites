(() => {
  const $ = (id) => document.getElementById(id);

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

  const year = $('year');
  if (year) year.textContent = String(new Date().getFullYear());

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDate(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'America/Chicago',
    });
  }

  function renderItem(item) {
    const title = escapeHtml(item.title || 'Muse on X');
    const url = escapeHtml(item.url || '');
    const when = formatDate(item.createdAt);
    const time = when
      ? `<time datetime="${escapeHtml(item.createdAt)}">${escapeHtml(when)}</time>`
      : '';
    let media = '';
    if (item.type === 'video') {
      const src = escapeHtml(item.src || '');
      const poster = escapeHtml(item.poster || '');
      media = `<video class="media" controls playsinline preload="metadata"${poster ? ` poster="${poster}"` : ''}><source src="${src}" type="video/mp4"></video>`;
    } else {
      const src = escapeHtml(item.src || item.poster || '');
      media = `<img class="media still" src="${src}" alt="${title}" width="720" height="1280" loading="lazy" decoding="async">`;
    }
    return `<article class="gallery-card">
      ${media}
      <div class="card-body">
        <h3>${title}</h3>
        ${time}
        <a class="text-link" href="${url}" target="_blank" rel="noopener noreferrer">View on X <span aria-hidden="true">↗</span></a>
      </div>
    </article>`;
  }

  function renderEmbeds(items) {
    const list = $('embed-list');
    if (!list) return;
    const chosen = items.filter((item) => item.embed).slice(0, 3);
    if (!chosen.length) {
      list.hidden = true;
      return;
    }
    list.innerHTML = chosen.map((item) => {
      const title = escapeHtml(item.title || '');
      const url = escapeHtml(item.url || '');
      const when = formatDate(item.createdAt);
      return `<article class="embed-card">
        <blockquote class="twitter-tweet">
          <p>${title}</p>
          <a href="${url}">${escapeHtml(when || 'View post')}</a>
        </blockquote>
        <p class="embed-meta"><a class="text-link" href="${url}" target="_blank" rel="noopener noreferrer">Open on X <span aria-hidden="true">↗</span></a></p>
      </article>`;
    }).join('');
    if (!document.querySelector('script[data-muse-twitter]')) {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.charset = 'utf-8';
      script.dataset.museTwitter = 'true';
      document.body.appendChild(script);
    }
  }

  async function loadGallery() {
    const grid = $('gallery-grid');
    const status = $('gallery-status');
    if (!grid) return;
    try {
      const res = await fetch('muse.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('Could not load muse.json');
      const data = await res.json();
      const items = Array.isArray(data.items) ? data.items : [];
      if (!items.length) throw new Error('No gallery items');
      grid.innerHTML = items.map(renderItem).join('');
      renderEmbeds(items);
    } catch (err) {
      if (status) {
        status.textContent = 'The gallery could not be loaded. You can still follow the clips on X.';
      } else {
        grid.innerHTML = '<p class="gallery-status">The gallery could not be loaded. You can still follow the clips on X.</p>';
      }
    }
  }

  loadGallery();
})();
