(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const reveals = document.querySelectorAll('.reveal, .reveal-art');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.documentElement.classList.add('js-motion');
    reveals.forEach(element => observer.observe(element));
    reducedMotion.addEventListener('change', event => {
      if (event.matches) { observer.disconnect(); document.documentElement.classList.remove('js-motion'); }
    });
  }
  const menu = document.getElementById('menu');
  const panel = document.getElementById('panel');
  function closeMenu(returnFocus = false) {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Abrir menu');
    panel.hidden = true;
    if (returnFocus) menu.focus();
  }
  menu.addEventListener('click', () => {
    const isOpen = menu.getAttribute('aria-expanded') === 'true';
    panel.hidden = isOpen;
    menu.setAttribute('aria-expanded', String(!isOpen));
    menu.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
  });
  panel.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !panel.hidden) closeMenu(true); });
  document.addEventListener('click', event => {
    if (!panel.hidden && !panel.contains(event.target) && !menu.contains(event.target)) closeMenu();
  });
  matchMedia('(min-width: 701px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  const progress = document.getElementById('progressBar');
  const artworks = [...document.querySelectorAll('.art-parallax img')];
  let queued = false;
  function updateScroll() {
    queued = false;
    const available = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${available > 0 ? Math.min(1, Math.max(0, scrollY / available)) : 0})`;
    if (!reducedMotion.matches && innerWidth > 700) {
      artworks.forEach(art => {
        const bounds = art.parentElement.getBoundingClientRect();
        if (bounds.bottom > 0 && bounds.top < innerHeight) {
          const offset = (bounds.top + bounds.height / 2 - innerHeight / 2) * -0.027;
          // The individual translate property preserves the entrance animation's transform.
          art.style.translate = `0 ${Math.max(-18, Math.min(18, offset))}px`;
        }
      });
    } else artworks.forEach(art => { art.style.translate = 'none'; });
  }
  function requestScrollUpdate() { if (!queued) { queued = true; requestAnimationFrame(updateScroll); } }
  addEventListener('scroll', requestScrollUpdate, { passive: true });
  addEventListener('resize', requestScrollUpdate, { passive: true });
  reducedMotion.addEventListener('change', requestScrollUpdate);
  updateScroll();

  const copyButton = document.getElementById('copyPix');
  const status = document.getElementById('copyConfirm');
  let resetStatus;
  copyButton.addEventListener('click', async () => {
    const key = 'zuzdri@gmail.com';
    let copied = false;
    try { await navigator.clipboard.writeText(key); copied = true; }
    catch {
      const field = document.createElement('textarea');
      field.value = key; field.readOnly = true;
      field.style.cssText = 'position:fixed;top:0;left:-9999px';
      document.body.append(field); field.select();
      try { copied = document.execCommand('copy'); } catch { copied = false; }
      field.remove(); copyButton.focus({ preventScroll: true });
    }
    status.textContent = copied ? 'Chave Pix copiada ♥' : 'Copie a chave acima: zuzdri@gmail.com';
    clearTimeout(resetStatus);
    resetStatus = setTimeout(() => { status.textContent = ''; }, 5000);
  });
})();
