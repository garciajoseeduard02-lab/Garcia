/**
 * JOSE E. GARCIA — Portfolio Engine & Interactive Media Systems
 * Interactive Canvas, Particle Field, Digital Media Lab, Web Audio Synth
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  initLabCanvas();
  initNavScroll();
  initFilters();
  initLightbox();
  initEmailCopy();
  initLiveClock();
  initAudioSynth();
});

/* ==========================================================================
   01. HERO CANVAS: NEO-BLUE CONSTELLATION & PARTICLE MESH
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const maxDistance = 140;
  const particleCount = window.innerWidth < 768 ? 45 : 90;

  const mouse = { x: null, y: null, radius: 160 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.75,
        vy: (Math.random() - 0.5) * 0.75,
        radius: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.6 + 0.2
      });
    }
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  resize();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Mouse repulsion/interaction
      if (mouse.x !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 2.5;
          p.y -= (dy / dist) * force * 2.5;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00f0ff';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Connect near neighbors
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const edgeAlpha = (1 - dist / maxDistance) * 0.22;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${edgeAlpha})`;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   02. DIGITAL MEDIA LAB // INTERACTIVE GENERATIVE SANDBOX
   ========================================================================== */
function initLabCanvas() {
  const canvas = document.getElementById('lab-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const parent = canvas.parentElement;

  let width, height;
  let mode = 'NEO_FLOW'; // Modes: 'NEO_FLOW', 'CYBER_MATRIX', 'AUDIO_PULSE'
  let speed = 1.0;
  let density = 60;
  let luminescence = 1.0;
  let time = 0;
  let ripple = null;

  let labParticles = [];

  function resize() {
    width = canvas.width = parent.clientWidth;
    height = canvas.height = parent.clientHeight;
    initModeParticles();
  }

  function initModeParticles() {
    labParticles = [];
    const count = Math.floor(density * (width / 500));
    for (let i = 0; i < count; i++) {
      labParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 2 + 1,
        size: Math.random() * 2.5 + 1,
        hue: Math.random() * 40 + 175, // 175-215 (Cyan to Neo Blue)
        history: []
      });
    }
  }

  window.addEventListener('resize', resize);
  resize();

  // Mode Preset Controls
  const presetBtns = document.querySelectorAll('.preset-btn');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      mode = btn.getAttribute('data-mode');
      document.getElementById('lab-mode-display').textContent = `MODE: ${mode}`;
      initModeParticles();
      playTone(440, 0.08);
    });
  });

  // Slider Controls
  const speedSlider = document.getElementById('speed-slider');
  const densitySlider = document.getElementById('density-slider');
  const glowSlider = document.getElementById('glow-slider');

  if (speedSlider) {
    speedSlider.addEventListener('input', (e) => {
      speed = parseFloat(e.target.value);
    });
  }
  if (densitySlider) {
    densitySlider.addEventListener('input', (e) => {
      density = parseInt(e.target.value);
      initModeParticles();
    });
  }
  if (glowSlider) {
    glowSlider.addEventListener('input', (e) => {
      luminescence = parseFloat(e.target.value);
    });
  }

  // Interactive Click Ripple Effect
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.x;
    const y = e.clientY - rect.y;
    ripple = { x, y, radius: 0, maxRadius: 180, alpha: 1 };
    playTone(660, 0.12);
  });

  function render() {
    time += 0.015 * speed;

    // Dark semi-transparent clear for motion trails
    ctx.fillStyle = mode === 'NEO_FLOW' ? 'rgba(1, 2, 4, 0.22)' : 'rgba(1, 2, 4, 0.4)';
    ctx.fillRect(0, 0, width, height);

    if (ripple) {
      ripple.radius += 5 * speed;
      ripple.alpha = 1 - ripple.radius / ripple.maxRadius;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 240, 255, ${ripple.alpha * luminescence})`;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00f0ff';
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (ripple.radius >= ripple.maxRadius) {
        ripple = null;
      }
    }

    if (mode === 'NEO_FLOW') {
      // Flowfield simulation
      for (let p of labParticles) {
        const noiseAngle = Math.sin(p.x * 0.005 + time) + Math.cos(p.y * 0.005 + time) * Math.PI;
        p.vx = Math.cos(noiseAngle) * p.speed * speed;
        p.vy = Math.sin(noiseAngle) * p.speed * speed;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (luminescence * 0.8), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${0.8 * luminescence})`;
        ctx.shadowBlur = 10 * luminescence;
        ctx.shadowColor = '#00f0ff';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    } else if (mode === 'CYBER_MATRIX') {
      // Geometric Cybernetic Grid
      const step = 40;
      ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 * luminescence})`;
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += step) {
        for (let y = 0; y < height; y += step) {
          const wave = Math.sin((x + y) * 0.02 + time * 3) * 6;
          const nodeX = x + wave;
          const nodeY = y + wave;

          ctx.beginPath();
          ctx.arc(nodeX, nodeY, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 240, 255, ${0.5 * luminescence})`;
          ctx.fill();

          if (x + step < width) {
            ctx.beginPath();
            ctx.moveTo(nodeX, nodeY);
            ctx.lineTo(nodeX + step, nodeY);
            ctx.stroke();
          }
          if (y + step < height) {
            ctx.beginPath();
            ctx.moveTo(nodeX, nodeY);
            ctx.lineTo(nodeX, nodeY + step);
            ctx.stroke();
          }
        }
      }
    } else if (mode === 'AUDIO_PULSE') {
      // Circular Audio Spectrum Simulation
      const centerX = width / 2;
      const centerY = height / 2;
      const bars = 64;
      const radius = Math.min(width, height) * 0.22;

      for (let i = 0; i < bars; i++) {
        const angle = (i / bars) * Math.PI * 2;
        const freqAmp = Math.abs(Math.sin(i * 0.4 + time * 4)) * 60 * luminescence;
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + freqAmp);
        const y2 = centerY + Math.sin(angle) * (radius + freqAmp);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `hsla(${180 + i * 2}, 100%, 65%, ${0.75 * luminescence})`;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00f0ff';
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.85, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 240, 255, ${0.4 * luminescence})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   03. NAVIGATION & SCROLL TRACKER
   ========================================================================== */
function initNavScroll() {
  const nav = document.querySelector('.site-nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinksContainer = document.querySelector('.nav-links');

  if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('mobile-open');
    });
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('mobile-open');
      });
    });
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    let currentSection = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   04. PROJECT FILTER SYSTEM
   ========================================================================== */
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      playTone(520, 0.06);

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   05. LIGHTBOX MODAL (FOR ART & DIGITAL MEDIA ASSETS)
   ========================================================================== */
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalTitle = document.getElementById('lightbox-title');
  const modalDetails = document.getElementById('lightbox-details');
  const closeBtn = document.querySelector('.lightbox-close');

  if (!modal) return;

  const triggerLinks = document.querySelectorAll('[data-lightbox]');
  triggerLinks.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const src = item.getAttribute('data-src') || item.getAttribute('href');
      const title = item.getAttribute('data-title') || 'Digital Media Asset';
      const meta = item.getAttribute('data-meta') || 'Format: Digital Asset // Resolution: High-DPI';

      modalImg.src = src;
      modalTitle.textContent = `// PREVIEW: ${title}`;
      modalDetails.textContent = meta;

      modal.classList.add('open');
      playTone(580, 0.1);
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('open');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.classList.remove('open');
    }
  });
}

/* ==========================================================================
   06. COPY EMAIL & TOAST NOTIFICATION
   ========================================================================== */
function initEmailCopy() {
  const copyBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast-msg');
  const emailText = 'garcia.jose.eduardo02@gmail.com';

  if (!copyBtn || !toast) return;

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(emailText).then(() => {
      showToast(`Copied to clipboard: ${emailText}`);
      playTone(740, 0.1);
    }).catch(() => {
      showToast(`Contact: ${emailText}`);
    });
  });

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
}

/* ==========================================================================
   07. LIVE CLOCK (UTC & LOCAL TIME)
   ========================================================================== */
function initLiveClock() {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMins = String(now.getUTCMinutes()).padStart(2, '0');
    const utcSs = String(now.getUTCSeconds()).padStart(2, '0');
    clockEl.textContent = `UTC ${utcHours}:${utcMins}:${utcSs} // SYS: ONLINE`;
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   08. WEB AUDIO SYNTHESIZER (SUBTLE CYBERNETIC SOUNDS)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudioSynth() {
  const soundToggle = document.getElementById('sound-toggle');
  if (!soundToggle) return;

  soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? 'AUDIO: [ON]' : 'AUDIO: [OFF]';
    soundToggle.style.color = soundEnabled ? 'var(--neo-blue)' : 'var(--text-muted)';
    if (soundEnabled) playTone(880, 0.08);
  });
}

function playTone(freq, duration) {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    // AudioContext blocked or unsupported
  }
}
