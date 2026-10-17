/* ═══ Portfolio — main.js ════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger);

/* ─── Lenis ────────────────────────────────────────────────────── */
const lenis = new Lenis({ lerp: 0.075, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

/* ─── Custom cursor ────────────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const mx = { x: 0, y: 0 }, cx = { x: 0, y: 0 };

document.addEventListener('mousemove', e => { mx.x = e.clientX; mx.y = e.clientY; });

gsap.ticker.add(() => {
  const ease = 0.14;
  cx.x += (mx.x - cx.x) * ease;
  cx.y += (mx.y - cx.y) * ease;
  if (cursor) gsap.set(cursor, { x: cx.x, y: cx.y });
});

document.querySelectorAll('a, button, .magnetic, .project-card, .faq-q, select').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});
document.querySelectorAll('input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-text'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-text'));
});

/* ─── Magnetic buttons ─────────────────────────────────────────── */
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    gsap.to(el, { x: dx * 0.3, y: dy * 0.3, duration: 0.4, ease: 'power2.out' });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' });
  });
});

/* ─── Rail + progress ──────────────────────────────────────────── */
const STAGES = ['work', 'about', 'skills', 'process', 'services', 'contact'];
const railLinks = document.querySelectorAll('.rail-link');
const counter   = document.getElementById('rail-counter');
const mobFill   = document.getElementById('mob-fill');

function setStage(i) {
  railLinks.forEach(l => l.classList.remove('active'));
  const l = document.querySelector(`[data-stage="${i}"]`);
  if (l) l.classList.add('active');
  if (counter) counter.textContent = `0${i + 1}/06`;
}

STAGES.forEach((id, i) => {
  const el = document.getElementById(id);
  if (!el) return;
  ScrollTrigger.create({
    trigger: el, start: 'top 55%', end: 'bottom 55%',
    onEnter: () => setStage(i), onEnterBack: () => setStage(i),
  });
});

ScrollTrigger.create({
  start: 'top top', end: 'bottom bottom',
  onUpdate: s => { if (mobFill) mobFill.style.width = (s.progress * 100) + '%'; }
});

railLinks.forEach(link => {
  const d = link.querySelector('.rail-diamond');
  link.addEventListener('mouseenter', () => gsap.to(d, { scale: 1.3, duration: .2, ease: 'power2.out' }));
  link.addEventListener('mouseleave', () => gsap.to(d, { scale: 1, duration: .3, ease: 'elastic.out(1,0.5)' }));
});

/* ─── Marquee ──────────────────────────────────────────────────── */
function initMarquee() {
  const track = document.getElementById('marquee');
  if (!track) return;
  const w = track.scrollWidth / 2;
  gsap.to(track, { x: -w, duration: 28, ease: 'none', repeat: -1 });
  track.addEventListener('mouseenter', () => gsap.to(track, { timeScale: 0.3, duration: 0.5 }));
  track.addEventListener('mouseleave', () => gsap.to(track, { timeScale: 1, duration: 0.5 }));
}

/* ─── Text scramble ────────────────────────────────────────────── */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&';
function scramble(el, finalText, duration = 800) {
  let frame = 0;
  const total = Math.ceil(duration / 16);
  const original = finalText || el.textContent;
  const run = () => {
    el.textContent = original.split('').map((ch, i) => {
      if (ch === ' ') return ' ';
      if (frame / total > i / original.length) return ch;
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }).join('');
    frame++;
    if (frame < total) requestAnimationFrame(run);
    else el.textContent = original;
  };
  requestAnimationFrame(run);
}

/* ─── Hero orb float + mouse parallax ─────────────────────────── */
gsap.to('#hero-orb', { y: -16, duration: 3.5, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1 });

document.addEventListener('mousemove', e => {
  const xp = (e.clientX / window.innerWidth  - 0.5) * 2;
  const yp = (e.clientY / window.innerHeight - 0.5) * 2;
  gsap.to('#hero-orb', { rotationY: xp * 12, rotationX: -yp * 6, duration: 1, ease: 'power1.out', overwrite: 'auto' });
});

/* ─── Orb: individual facet animations ─────────────────────────── */
function initOrbAnimation() {
  const orb = document.getElementById('hero-orb');
  if (!orb) return;

  const groups = orb.querySelectorAll('g');

  groups.forEach((g, i) => {
    const yAmt  = -4 + Math.sin(i * 0.9)  * 14;
    const xAmt  =  0 + Math.cos(i * 0.6)  * 5;
    const dur   = 2.2 + Math.abs(Math.sin(i * 0.5)) * 2.2;
    const delay = i * 0.11;

    /* float each crystal facet independently */
    gsap.to(g, {
      y: yAmt, x: xAmt,
      duration: dur, ease: 'sine.inOut',
      repeat: -1, yoyo: true, delay,
    });

    /* shimmer: random top polygon opacity */
    const top = g.querySelector('polygon:first-child');
    if (top) {
      gsap.to(top, {
        fillOpacity: 0.55 + Math.random() * 0.45,
        duration: 1.0 + Math.random() * 1.4,
        ease: 'sine.inOut', repeat: -1, yoyo: true,
        delay: delay * 0.7,
      });
    }

    /* scale breathe on larger facets */
    if (i % 4 === 0) {
      gsap.to(g, {
        scale: 1.06, transformOrigin: 'center center',
        duration: 2.8 + i * 0.1, ease: 'sine.inOut',
        repeat: -1, yoyo: true, delay: delay * 1.3,
      });
    }
  });

  /* glow circle pulse */
  const glowCircle = orb.querySelector('circle');
  if (glowCircle) {
    gsap.to(glowCircle, {
      attr: { r: 112 }, opacity: 0.6,
      duration: 2.4, ease: 'sine.inOut',
      repeat: -1, yoyo: true,
    });
  }

  /* slow continuous Y-rotation on whole orb */
  gsap.to(orb, {
    rotationY: 8, duration: 6, ease: 'sine.inOut',
    repeat: -1, yoyo: true, delay: 1,
  });
}

/* ─── Orb: orbiting particle canvas ────────────────────────────── */
function initOrbParticles() {
  const orbEl  = document.getElementById('hero-orb');
  const wrap   = document.querySelector('.hero-right');
  if (!orbEl || !wrap) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position:absolute; inset:0;
    width:100%; height:100%;
    pointer-events:none; z-index:2;
  `;
  wrap.style.position = 'relative';
  wrap.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W = 0, H = 0;

  function resize() {
    W = canvas.width  = wrap.offsetWidth;
    H = canvas.height = wrap.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* two rings of particles */
  const COLORS = ['#ff6a3d', '#e6265a', '#ffb03d', '#ffffff'];
  const particles = Array.from({ length: 48 }, (_, i) => ({
    angle:  (i / 48) * Math.PI * 2,
    ring:   i < 28 ? 0 : 1,
    speed:  (i < 28 ? 0.004 : -0.003) + (Math.random() - 0.5) * 0.002,
    rBase:  i < 28 ? 0.30 : 0.38,
    rVar:   (Math.random() - 0.5) * 0.06,
    size:   0.8 + Math.random() * 2.2,
    alpha:  0.15 + Math.random() * 0.55,
    color:  COLORS[Math.floor(Math.random() * COLORS.length)],
    phase:  Math.random() * Math.PI * 2,
    phaseSpeed: 0.01 + Math.random() * 0.02,
  }));

  /* trailing glow ring (SVG-less alternative) */
  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.012;

    const cx = W * 0.5;
    const cy = H * 0.44;  /* align with orb centre */
    const rx = Math.min(W, H) * 0.42;
    const ry = rx * 0.52;

    /* outer glow halo */
    const grad = ctx.createRadialGradient(cx, cy, ry * 0.3, cx, cy, ry * 1.1);
    grad.addColorStop(0,   'rgba(255,106,61,0.0)');
    grad.addColorStop(0.7, 'rgba(255,106,61,0.04)');
    grad.addColorStop(1,   'rgba(230,38,90,0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    /* particles */
    particles.forEach(p => {
      p.angle += p.speed;
      p.phase += p.phaseSpeed;

      const r  = rx * (p.rBase + p.rVar + Math.sin(p.phase) * 0.025);
      const ry2 = r * 0.52;
      const x  = cx + Math.cos(p.angle) * r;
      const y  = cy + Math.sin(p.angle) * ry2;
      const alpha = p.alpha * (0.7 + 0.3 * Math.sin(p.phase));

      /* trail */
      const tx = cx + Math.cos(p.angle - p.speed * 4) * r;
      const ty = cy + Math.sin(p.angle - p.speed * 4) * ry2;
      const trail = ctx.createLinearGradient(tx, ty, x, y);
      trail.addColorStop(0,   p.color + '00');
      trail.addColorStop(1,   p.color + Math.round(alpha * 200).toString(16).padStart(2,'0'));
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(x, y);
      ctx.strokeStyle = trail;
      ctx.lineWidth = p.size * 0.7;
      ctx.stroke();

      /* dot */
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.round(alpha * 255).toString(16).padStart(2,'0');
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

/* ─── Stats: glow pulse on numbers ─────────────────────────────── */
function initStatsGlow() {
  document.querySelectorAll('.stat-num').forEach((el, i) => {
    gsap.to(el, {
      textShadow: `0 0 20px rgba(255,106,61,0.7), 0 0 40px rgba(230,38,90,0.4)`,
      duration: 1.5 + i * 0.3, ease: 'sine.inOut',
      repeat: -1, yoyo: true, delay: i * 0.4,
    });
  });

  /* stat items slide up on hero reveal */
  const items = document.querySelectorAll('.stat-item');
  gsap.set(items, { opacity: 0, y: 16 });
  gsap.to(items, {
    opacity: 1, y: 0, duration: 0.55, ease: 'power2.out',
    stagger: 0.12, delay: 1.8,
  });
}

/* ─── Project card 3D tilt ─────────────────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width  - 0.5;
    const dy = (e.clientY - r.top)  / r.height - 0.5;
    gsap.to(card, { rotationY: dx * 8, rotationX: -dy * 5, transformPerspective: 800, duration: 0.4, ease: 'power2.out' });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
  });
});

/* ─── Stats count-up ───────────────────────────────────────────── */
function initCounters() {
  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => {
        gsap.fromTo(el, { innerText: 0 }, {
          innerText: target, duration: 1.8, ease: 'power2.out', snap: { innerText: 1 },
          onUpdate() { el.textContent = Math.round(parseFloat(el.textContent)); }
        });
        scramble(el);
      }
    });
  });
}

/* ─── Skill bars ───────────────────────────────────────────────── */
function initSkillBars() {
  document.querySelectorAll('.skill-item').forEach((item, i) => {
    ScrollTrigger.create({
      trigger: item, start: 'top 88%', once: true,
      onEnter: () => {
        setTimeout(() => item.classList.add('animated'), i * 60);
      }
    });
  });
}

/* ─── INTRO animation ──────────────────────────────────────────── */
function runIntro() {
  const overlay = document.getElementById('intro');
  const il = document.getElementById('il');
  const ir = document.getElementById('ir');
  const ip = document.getElementById('ip');

  gsap.set([il, ir], { opacity: 0 });
  gsap.set(il, { x: '-44vw' });
  gsap.set(ir, { x: '44vw' });
  gsap.set(ip, { scale: 3, opacity: 0 });
  gsap.set(overlay, { opacity: 1 });

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      overlay.style.display = 'none';
      animateHeroIn();
    }
  });

  tl
    .to(ip, { scale: 0.4, opacity: 0.35, duration: 1.0 }, 0)
    .to(il, { x: 0, opacity: 1, duration: 0.8 }, 0.2)
    .to(ir, { x: 0, opacity: 1, duration: 0.8 }, 0.2)
    .to({}, { duration: 0.85 })
    .to(il, { x: '-55vw', opacity: 0, duration: 0.5, ease: 'power3.in' })
    .to(ir, { x: '55vw',  opacity: 0, duration: 0.5, ease: 'power3.in' }, '<')
    .to(ip, { opacity: 0, scale: 0.5, duration: 0.4, ease: 'power2.in' }, '<0.05')
    .to(overlay, { opacity: 0, duration: 0.4, ease: 'power2.in' }, '<0.1');
}

/* ─── Hero in ──────────────────────────────────────────────────── */
function animateHeroIn() {
  const lines   = document.querySelectorAll('#hero-h1 .line');
  const eyebrow = document.getElementById('hero-eyebrow');
  const body    = document.getElementById('hero-body');
  const cta     = document.getElementById('hero-cta');
  const orb     = document.getElementById('hero-orb');
  const stats   = document.getElementById('hero-stats');
  const hint    = document.getElementById('scroll-hint');
  const rule    = document.querySelector('.sec-hero .stage-rule');

  gsap.set(lines,  { y: '115%' });
  gsap.set([eyebrow, body, cta, stats, hint], { opacity: 0, y: 20 });
  gsap.set(orb,    { opacity: 0, scale: 0.8, rotationY: 15 });
  gsap.set(rule,   { scaleX: 0, transformOrigin: 'left' });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl
    .to(rule,    { scaleX: 1, duration: 0.5 }, 0)
    .to(eyebrow, { opacity: 1, y: 0, duration: 0.5 }, 0.1)
    .to(lines,   { y: 0, duration: 0.8, stagger: 0.09 }, 0.2)
    .to(body,    { opacity: 1, y: 0, duration: 0.6 }, 0.6)
    .to(cta,     { opacity: 1, y: 0, duration: 0.5 }, 0.75)
    .to(orb,     { opacity: 1, scale: 1, rotationY: 0, duration: 1, ease: 'power2.out' }, 0.35)
    .to(stats,   { opacity: 1, y: 0, duration: 0.5 }, 0.85)
    .to(hint,    { opacity: 1, y: 0, duration: 0.4 }, 1.0);

  /* scramble hero headline after reveal */
  setTimeout(() => {
    document.querySelectorAll('#hero-h1 .line').forEach((l, i) => {
      setTimeout(() => scramble(l, l.textContent), i * 80);
    });
  }, 500);
}

/* ─── Scroll animations ────────────────────────────────────────── */
function initScroll() {

  /* stage rules */
  document.querySelectorAll('.sec:not(.sec-hero) .stage-rule').forEach(el => {
    gsap.set(el, { scaleX: 0, transformOrigin: 'left' });
    gsap.to(el, { scaleX: 1, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%' } });
  });

  /* generic fade-up panels */
  document.querySelectorAll('.reveal').forEach(el => {
    gsap.set(el, { opacity: 0, y: 32 });
    gsap.to(el, { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 86%' } });
  });

  /* split-line text blocks */
  document.querySelectorAll('.reveal-lines').forEach(block => {
    const lines = block.querySelectorAll('.line');
    gsap.set(lines, { y: '112%' });
    gsap.to(lines, { y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.065,
      scrollTrigger: { trigger: block, start: 'top 86%' } });
  });

  /* contact heading open-line */
  const contactOpen = document.querySelector('#contact-h .open-line');
  if (contactOpen) {
    gsap.set(contactOpen, { rotation: 4, y: '120%', opacity: 0, transformOrigin: '0% 100%' });
    gsap.to(contactOpen, { rotation: 0, y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: contactOpen, start: 'top 86%' } });
  }

  /* staggered project cards */
  const cards = gsap.utils.toArray('.reveal-card');
  cards.forEach((card, i) => {
    gsap.set(card, { opacity: 0, y: 40 });
    gsap.to(card, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: card, start: 'top 88%' },
      delay: (i % 2) * 0.12 });
  });

  /* about photo parallax */
  const photo = document.querySelector('.about-photo-placeholder');
  if (photo) {
    gsap.to(photo, { y: -30, ease: 'none',
      scrollTrigger: { trigger: '#about', scrub: 1.5, start: 'top bottom', end: 'bottom top' } });
  }

  /* service cards stagger */
  const svcCards = gsap.utils.toArray('.service-card');
  svcCards.forEach((c, i) => {
    gsap.set(c, { opacity: 0, y: 24 });
    gsap.to(c, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: i * 0.08,
      scrollTrigger: { trigger: '.services-grid', start: 'top 85%' } });
  });

  /* skills grid stagger */
  const skillGroups = gsap.utils.toArray('.skill-group');
  skillGroups.forEach((g, i) => {
    gsap.set(g, { opacity: 0, y: 24 });
    gsap.to(g, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: i * 0.1,
      scrollTrigger: { trigger: '.skills-grid', start: 'top 85%' } });
  });

  /* section headings scramble on enter */
  document.querySelectorAll('.sec-h').forEach(heading => {
    const lines = heading.querySelectorAll('.line');
    ScrollTrigger.create({
      trigger: heading, start: 'top 80%', once: true,
      onEnter: () => {
        lines.forEach((l, i) => setTimeout(() => scramble(l, l.textContent, 600), i * 100));
      }
    });
  });

  /* marquee parallax on scroll */
  const mq = document.querySelector('.marquee-wrap');
  if (mq) {
    gsap.to(mq, { backgroundPositionX: '200px', ease: 'none',
      scrollTrigger: { trigger: mq, scrub: 1, start: 'top bottom', end: 'bottom top' } });
  }

  /* contact links stagger */
  const clinks = gsap.utils.toArray('.contact-link');
  clinks.forEach((l, i) => {
    gsap.set(l, { opacity: 0, x: -20 });
    gsap.to(l, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', delay: i * 0.07,
      scrollTrigger: { trigger: '.contact-links', start: 'top 86%' } });
  });

  /* about photo reveal */
  const photoWrap = document.querySelector('.about-photo-wrap');
  if (photoWrap) {
    gsap.set(photoWrap, { opacity: 0, x: 30 });
    gsap.to(photoWrap, { opacity: 1, x: 0, duration: 0.9, ease: 'power2.out',
      scrollTrigger: { trigger: photoWrap, start: 'top 85%' } });
  }

  /* footer appear */
  gsap.set('footer', { opacity: 0 });
  gsap.to('footer', { opacity: 1, duration: 0.6, ease: 'power2.out',
    scrollTrigger: { trigger: 'footer', start: 'top 95%' } });
}

/* ─── Contact form ─────────────────────────────────────────────── */
function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Sending…';
    btn.style.opacity = '0.6';
    setTimeout(() => {
      btn.textContent = 'Sent ✓';
      btn.style.background = 'var(--accent-green)';
      btn.style.color = 'var(--paper)';
      btn.style.borderColor = 'var(--accent-green)';
      btn.style.opacity = '1';
    }, 1500);
  });

  /* input focus glow */
  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', () => gsap.to(input, { borderColor: 'rgba(245,245,245,0.45)', duration: 0.2 }));
    input.addEventListener('blur',  () => gsap.to(input, { borderColor: 'rgba(245,245,245,0.12)', duration: 0.2 }));
  });
}

/* ─── Floating section labels (scroll-driven) ──────────────────── */
function initFloatingLabels() {
  document.querySelectorAll('.sec:not(.sec-hero)').forEach(sec => {
    const label = document.createElement('div');
    label.className = 'sec-float-label hud-label';
    label.textContent = sec.id.toUpperCase();
    label.style.cssText = `
      position:absolute; top:2rem; right:2rem;
      color:rgba(245,245,245,0.08); font-size:7rem;
      font-family:'Sora',sans-serif; font-weight:800;
      letter-spacing:-0.05em; pointer-events:none;
      line-height:1; z-index:0; user-select:none;
    `;
    sec.style.position = 'relative';
    sec.insertBefore(label, sec.firstChild);

    gsap.to(label, { y: -40, ease: 'none',
      scrollTrigger: { trigger: sec, scrub: 1.5, start: 'top bottom', end: 'bottom top' } });
  });
}

/* ─── Init ─────────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initMarquee();
  initCounters();
  initSkillBars();
  initForm();
  initFloatingLabels();
  initScroll();
  initOrbAnimation();
  initOrbParticles();
  initStatsGlow();

  setStage(0);

  if (reduced) {
    document.getElementById('intro').style.display = 'none';
    animateHeroIn();
  } else {
    runIntro();
  }
});
