(() => {
  'use strict';
  const section = document.querySelector('.hero-sequence');
  if (!section) return;
  const stage = section.querySelector('.hero-stage');
  const canvas = section.querySelector('canvas');
  const context = canvas.getContext('2d', { alpha: false });
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!context || motion.matches) return; // The responsive poster remains usable without animation.
  const mobile = matchMedia('(max-width: 700px)').matches;
  const base = `assets/sequence/${mobile ? 'mobile' : 'desktop'}/frame-`;
  const COUNT = 120;
  const MAX_DECODED = mobile ? 6 : 10;
  const blobs = new Map(), decoded = new Map(), decoding = new Set(), fetching = new Set(), failed = new Set();
  const progressBar = section.querySelector('.sequence-progress > span');
  let wanted = 0, displayed = -1, active = true, visible = true, raf = 0;
  let width = 0, height = 0, pixelRatio = 1, resized = true;
  section.classList.add('sequence-enabled');
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const frameAt = progress => Math.round(clamp(progress, 0, 1) * (COUNT - 1));
  function update() {
    raf = 0;
    if (!active) return;
    const rect = section.getBoundingClientRect();
    const range = Math.max(1, section.offsetHeight - stage.offsetHeight);
    const progress = clamp(-rect.top / range, 0, 1);
    wanted = frameAt(progress);
    progressBar.style.transform = `scaleX(${progress})`;
    visible = rect.top < innerHeight && rect.bottom > 0;
    if (visible) {
      prepare(wanted);
      for (const delta of [-1, 1]) if (wanted + delta >= 0 && wanted + delta < COUNT) prepare(wanted + delta);
      draw();
      pump();
    }
  }
  function schedule() { if (!raf && active) raf = requestAnimationFrame(update); }
  function cleanup(image) { if (image && typeof image.close === 'function') image.close(); }
  function evict() {
    while (decoded.size > MAX_DECODED) {
      let victim = -1, farthest = -1;
      for (const index of decoded.keys()) {
        const distance = Math.abs(index - wanted);
        if (distance > farthest && index !== wanted) { farthest = distance; victim = index; }
      }
      if (victim < 0) break;
      cleanup(decoded.get(victim)); decoded.delete(victim);
    }
  }
  async function toImage(blob) {
    if (typeof createImageBitmap === 'function') return createImageBitmap(blob);
    return new Promise((resolve, reject) => {
      const image = new Image(), url = URL.createObjectURL(blob);
      image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
      image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image decoding failed')); };
      image.src = url;
    });
  }
  async function prepare(index) {
    if (!active || decoded.has(index) || decoding.has(index) || !blobs.has(index)) return;
    decoding.add(index);
    try {
      const image = await toImage(blobs.get(index));
      if (!active || Math.abs(index - wanted) > 6) { cleanup(image); return; }
      decoded.set(index, image); evict(); schedule();
    } catch (_) { failed.add(index); }
    finally { decoding.delete(index); }
  }
  function nextIndex() {
    // Prioritize the scroll destination, then load the rest in distance order.
    for (let distance = 0; distance < COUNT; distance++) {
      for (const index of distance ? [wanted + distance, wanted - distance] : [wanted]) {
        if (index >= 0 && index < COUNT && !blobs.has(index) && !fetching.has(index) && !failed.has(index)) return index;
      }
    }
    return -1;
  }
  function pump() {
    if (!active || !visible) return;
    while (fetching.size < 4) {
      const index = nextIndex();
      if (index < 0) break;
      fetching.add(index);
      fetch(`${base}${String(index).padStart(3, '0')}.webp`, { cache: 'force-cache' })
        .then(response => { if (!response.ok) throw new Error('Frame unavailable'); return response.blob(); })
        .then(blob => { if (active) { blobs.set(index, blob); if (Math.abs(index - wanted) <= 2) prepare(index); } })
        .catch(() => failed.add(index))
        .finally(() => { fetching.delete(index); pump(); });
    }
  }
  function draw() {
    if (!decoded.size) return;
    let index = wanted;
    if (!decoded.has(index)) index = [...decoded.keys()].reduce((best, n) => Math.abs(n - wanted) < Math.abs(best - wanted) ? n : best);
    if (index === displayed && !resized) return;
    const image = decoded.get(index);
    const scale = Math.max(width / image.width, height / image.height);
    const drawWidth = image.width * scale, drawHeight = image.height * scale;
    // Follow the product as it moves right in the latter half, on narrow screens.
    const focal = width < 701 ? .5 + .16 * clamp((index / (COUNT - 1) - .35) / .3, 0, 1) : .5;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.drawImage(image, (width - drawWidth) * focal, (height - drawHeight) / 2, drawWidth, drawHeight);
    displayed = index; resized = false; canvas.classList.add('has-frame');
    canvas.dataset.frame = String(index);
  }
  function resize() {
    width = stage.clientWidth; height = stage.clientHeight;
    pixelRatio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * pixelRatio); canvas.height = Math.round(height * pixelRatio);
    resized = true; schedule();
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', resize, { passive: true });
  addEventListener('pageshow', resize);
  motion.addEventListener('change', event => {
    if (!event.matches) return;
    active = false;
    if (raf) cancelAnimationFrame(raf);
    section.classList.remove('sequence-enabled'); canvas.classList.remove('has-frame');
    decoded.forEach(cleanup); decoded.clear(); blobs.clear();
  });
  resize();
})();
