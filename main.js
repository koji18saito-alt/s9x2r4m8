/* ============================================================
   図々しいボーイズ FC — main.js
   ============================================================ */

// ── Stars canvas ────────────────────────────────────────────
(function initStars() {
  const canvas = document.getElementById('stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function createStars(n) {
    stars = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.3,
        a: Math.random(),
        da: (Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
        speed: Math.random() * 0.05 + 0.01,
      });
    }
  }
  createStars(180);

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.a += s.da;
      if (s.a > 1) { s.a = 1; s.da *= -1; }
      if (s.a < 0) { s.a = 0; s.da *= -1; }
      s.y -= s.speed;
      if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── Navbar scroll ────────────────────────────────────────────
(function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Hamburger
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (btn && links) {
    btn.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    // Close on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }
})();

// ── BGM ──────────────────────────────────────────────────────
(function initBGM() {
  const audio = document.getElementById('bgm');
  const btn   = document.getElementById('bgm-btn');
  if (!audio || !btn) return;

  let playing = false;

  // Try autoplay on first user interaction
  function startBGM() {
    if (!playing) {
      audio.volume = 0.45;
      audio.play().then(() => {
        playing = true;
        updateBtnState();
      }).catch(() => {});
    }
    document.removeEventListener('click', startBGM);
    document.removeEventListener('touchstart', startBGM);
    document.removeEventListener('scroll', startBGM);
  }

  document.addEventListener('click', startBGM, { once: true });
  document.addEventListener('touchstart', startBGM, { once: true });
  document.addEventListener('scroll', startBGM, { once: true });

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (playing) {
      audio.pause();
      playing = false;
    } else {
      audio.play().then(() => { playing = true; }).catch(() => {});
    }
    updateBtnState();
  });

  function updateBtnState() {
    const icon  = btn.querySelector('.bgm-icon');
    const label = btn.querySelector('.bgm-label');
    if (playing) {
      btn.classList.remove('muted');
      icon.textContent = '♪';
      label.textContent = 'BGM ON';
    } else {
      btn.classList.add('muted');
      icon.textContent = '♩';
      label.textContent = 'BGM OFF';
    }
  }
  updateBtnState();
})();

// ── Scroll reveal ─────────────────────────────────────────────
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(el => observer.observe(el));
})();

// ── Counter animation ─────────────────────────────────────────
(function initCounters() {
  const nums = document.querySelectorAll('.stat-n[data-target]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target);
        let current  = 0;
        const step   = Math.ceil(target / 60);
        const timer  = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current.toLocaleString();
          if (current >= target) clearInterval(timer);
        }, 25);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  nums.forEach(el => observer.observe(el));
})();

// ── Gallery lightbox ──────────────────────────────────────────
(function initLightbox() {
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lb-img');
  const lbCap   = document.getElementById('lb-caption');
  const lbClose = document.getElementById('lb-close');

  if (!lb) return;

  document.querySelectorAll('.gallery-item:not(.gi-locked)').forEach(item => {
    item.addEventListener('click', () => {
      const img     = item.querySelector('img');
      const caption = item.dataset.caption || '';
      if (img && img.src && !item.classList.contains('gi-fallback')) {
        lbImg.src = img.src;
        lbCap.textContent = caption;
        lb.classList.add('open');
      }
    });
  });

  lbClose.addEventListener('click', () => lb.classList.remove('open'));
  lb.addEventListener('click', (e) => {
    if (e.target === lb) lb.classList.remove('open');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lb.classList.remove('open');
  });
})();

// ── Smooth active nav highlight ───────────────────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], div[id="top"]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === '#' + entry.target.id) {
            if (!a.classList.contains('nav-join')) a.style.color = '#FFD700';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

// ── Parallax poster tilt ──────────────────────────────────────
(function initTilt() {
  const poster = document.querySelector('.poster-wrap');
  if (!poster) return;
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    poster.style.transform = `rotate(${2 - dy * 3}deg) rotateY(${dx * 8}deg)`;
  });
})();
