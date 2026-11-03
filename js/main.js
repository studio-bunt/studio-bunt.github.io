/* studio bunt — live plotter
   Any <canvas class="plot"> becomes a sheet: pens drift along a smooth flow field
   and leave ink that never fades. The cursor (or a finger) bends their paths like a
   light source; a click starts a new sheet. Optional readout: elements with ids
   t, x, y, n inside the same .hero are updated.

   Settings per canvas, as data attributes:
     data-pens="70"     number of pens
     data-seed="0"      shifts the flow field, so each page gets its own drawing
     data-palette="pink,gold,copper"
*/
(function () {
    const PALETTES = { pink: [242, 167, 195], gold: [243, 215, 122], copper: [232, 135, 91], paper: [236, 232, 225] };
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function startPlotter(canvas) {
        const g = canvas.getContext('2d');
        const hero = canvas.closest('.hero');
        const out = id => hero ? hero.querySelector('#' + id) : null;
        const nPens = +canvas.dataset.pens || 70;
        const seed = +canvas.dataset.seed || 0;
        const ramp = (canvas.dataset.palette || 'pink,gold,copper').split(',').map(n => PALETTES[n.trim()] || PALETTES.paper);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let W, H, pens = [], lines = 0, mx = -1e4, my = -1e4, visible = true;
        const t0 = performance.now();

        function colour(t) {
            t = Math.max(0, Math.min(1, t)) * (ramp.length - 1);
            const i = Math.min(ramp.length - 2, Math.floor(t)), f = t - i, a = ramp[i], b = ramp[i + 1] || a;
            return 'rgb(' + a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(',') + ')';
        }
        function angle(x, y, s) {
            s += seed * 37;
            return Math.sin(x * .0042 + s * .07) * 1.6 + Math.cos(y * .0051 - s * .05) * 1.4 + Math.sin((x + y) * .0023 + seed) * 1.1;
        }
        const newPen = () => ({ x: Math.random() * W, y: Math.random() * H, life: 200 + Math.random() * 400 });

        function newSheet() {
            W = canvas.clientWidth; H = canvas.clientHeight;
            canvas.width = W * dpr; canvas.height = H * dpr;
            g.setTransform(dpr, 0, 0, dpr, 0, 0);
            g.fillStyle = getComputedStyle(document.body).backgroundColor;
            g.fillRect(0, 0, W, H);
            pens = Array.from({ length: nPens }, newPen);
            for (let i = 0; i < 500; i++) step(i / 60);   // open on a drawing already in progress
        }

        function step(s) {
            g.lineWidth = .7;
            g.globalAlpha = .22;
            for (let i = 0; i < pens.length; i++) {
                const p = pens[i];
                let a = angle(p.x, p.y, s);
                const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
                if (d2 < 40000) a += Math.atan2(dy, dx) * (1 - d2 / 40000) * 1.2;
                const nx = p.x + Math.cos(a) * 1.6, ny = p.y + Math.sin(a) * 1.6;
                g.strokeStyle = colour(p.y / H * .7 + p.x / W * .3);
                g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(nx, ny); g.stroke();
                p.x = nx; p.y = ny; p.life--; lines++;
                if (p.life < 0 || p.x < 0 || p.x > W || p.y < 0 || p.y > H) pens[i] = newPen();
            }
            g.globalAlpha = 1;
        }

        function pointer(e) {
            const r = canvas.getBoundingClientRect();
            const pt = e.touches ? e.touches[0] : e;
            mx = pt.clientX - r.left; my = pt.clientY - r.top;
        }
        window.addEventListener('mousemove', pointer);
        canvas.addEventListener('touchmove', pointer, { passive: true });
        canvas.addEventListener('click', newSheet);
        let resizeTimer;
        window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(newSheet, 200); });

        // Pause when scrolled out of view, to spare laptops and phones.
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(canvas);
        }

        newSheet();
        if (reduceMotion) return;   // static drawing only

        const tEl = out('t'), xEl = out('x'), yEl = out('y'), nEl = out('n');
        (function loop(now) {
            if (visible) {
                const s = (now - t0) / 1000;
                for (let k = 0; k < 3; k++) step(500 / 60 + s);
                if (tEl) {
                    const S = Math.floor(s);
                    tEl.textContent = [S / 3600 | 0, (S / 60 | 0) % 60, S % 60].map(v => String(v).padStart(2, '0')).join(':');
                }
                if (xEl) xEl.textContent = Math.max(0, Math.round(mx));
                if (yEl) yEl.textContent = Math.max(0, Math.round(my));
                if (nEl) nEl.textContent = lines.toLocaleString('en').replace(/,/g, ' ');
            }
            requestAnimationFrame(loop);
        })(performance.now());
    }

    document.querySelectorAll('canvas.plot').forEach(startPlotter);
})();

/* Work images: fade in on scroll, open large on click. */
(function () {
    const imgs = document.querySelectorAll('.work-images img');
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const io = new IntersectionObserver(entries => entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        }), { rootMargin: '0px 0px -8% 0px' });
        document.querySelectorAll('.work-images figure').forEach(f => { f.classList.add('reveal'); io.observe(f); });
    }
    const box = document.querySelector('.lightbox');
    if (!box) return;
    const big = box.querySelector('img');
    const close = () => { box.hidden = true; big.removeAttribute('src'); };
    imgs.forEach(img => img.addEventListener('click', () => { big.src = img.src; big.alt = img.alt; box.hidden = false; }));
    box.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* Works list: click a row to open or close that work. A link to #dart (etc.) opens it. */
(function () {
    const works = document.querySelectorAll('.work');
    function setOpen(work, open) {
        work.classList.toggle('open', open);
        const btn = work.querySelector('.work-head button');
        if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    works.forEach(work => {
        const btn = work.querySelector('.work-head button');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const open = !work.classList.contains('open');
            setOpen(work, open);
            if (open) history.replaceState(null, '', '#' + work.id);
        });
    });
    // "see more": show only the first N works (data-visible on #works), the rest behind a button
    const section = document.getElementById('works');
    const limit = section ? parseInt(section.dataset.visible, 10) || 0 : 0;
    let moreBtn = null;
    function showAll() {
        works.forEach(w => w.classList.remove('extra'));
        if (moreBtn) moreBtn.parentElement.remove();
    }
    if (limit && works.length > limit) {
        works.forEach((w, i) => { if (i >= limit) w.classList.add('extra'); });
        const wrap = document.createElement('div');
        wrap.className = 'works-more';
        moreBtn = document.createElement('button');
        moreBtn.type = 'button';
        moreBtn.className = 'see-more';
        moreBtn.textContent = 'see more works (' + (works.length - limit) + ')';
        moreBtn.addEventListener('click', showAll);
        wrap.appendChild(moreBtn);
        works[works.length - 1].after(wrap);
    }

    function openFromHash() {
        const id = location.hash.slice(1);
        const work = id && document.getElementById(id);
        if (work && work.classList.contains('work')) {
            if (work.classList.contains('extra')) showAll();
            setOpen(work, true);
            setTimeout(() => work.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
        }
    }
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
})();

/* Collect page: thumbnails switch the main image (or play the video); the main image opens large on click. */
(function () {
    document.querySelectorAll('.piece').forEach(piece => {
        const main = piece.querySelector('.piece-frame img.main');
        const video = piece.querySelector('.piece-frame video.main-video');
        if (!main) return;
        const thumbs = piece.querySelectorAll('.thumbs .t');
        thumbs.forEach(t => {
            const show = () => {
                thumbs.forEach(o => o.classList.toggle('on', o === t));
                if (t.dataset.video && video) {
                    if (!video.getAttribute('src')) video.src = t.dataset.video;
                    main.hidden = true; video.hidden = false;
                    video.play().catch(() => {});
                    return;
                }
                if (video) { video.pause(); video.hidden = true; }
                main.hidden = false;
                if (main.getAttribute('src') === t.dataset.src) return;
                main.classList.add('fade');
                setTimeout(() => { main.src = t.dataset.src; main.onload = () => main.classList.remove('fade'); }, 180);
            };
            t.addEventListener('click', show);
            if (!t.dataset.video) t.addEventListener('mouseenter', show);   // the video starts on click only
        });
    });
    const box = document.querySelector('.lightbox');
    if (!box) return;
    const big = box.querySelector('img');
    document.querySelectorAll('.piece-frame img.main').forEach(img =>
        img.addEventListener('click', () => { big.src = img.src; big.alt = img.alt; box.hidden = false; }));
})();

/* Collect page, frame option: ticking "add a frame" shows the note and adds it to the email. */
(function () {
    document.querySelectorAll('.piece').forEach(piece => {
        const ask = piece.querySelector('.ask');
        const box = piece.querySelector('.frame-opt input');
        const note = piece.querySelector('.frame-note');
        if (!ask || !box) return;
        const base = ask.getAttribute('href');
        const update = () => {
            if (note) note.hidden = !box.checked;
            ask.setAttribute('href', base + encodeURIComponent(box.checked ? 'Option: with frame\n' : ''));
        };
        box.addEventListener('change', update);
        update();
    });
})();
