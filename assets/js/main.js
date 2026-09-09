/* AniFlex v3 landing — masters selector, sword rail, ambient embers, scroll reveals */

// ---------- The Five Masters ----------
const MASTERS = [
  {
    id: 'goro', name: 'Goro Arakida', stat: 'Strength', weapon: 'Spiked Club',
    philosophy: 'Loud, laughing, and impossible to move. Goro teaches that true strength isn’t how hard you hit — it’s remaining unbroken no matter what hits you.',
    titles: [['Bond 3', 'Iron Will'], ['Bond 7', 'The Colossus'], ['Bond 10', 'The Unbroken']],
  },
  {
    id: 'akane', name: 'Akane Homura', stat: 'Power', weapon: 'Twin Hammers',
    philosophy: 'Blunt, fiercely competitive, and always first through the door. For Akane, power is life itself — force gathered, then released in one decisive moment.',
    titles: [['Bond 3', 'Rising Force'], ['Bond 7', 'The Unleashed'], ['Bond 10', 'Living Power']],
  },
  {
    id: 'ryohei', name: 'Ryohei Sazanami', stat: 'Stamina', weapon: 'Double-Sided Spear',
    philosophy: 'Dry, understated, and utterly relentless. Ryohei’s lesson is simple: the fight goes to whoever refuses to stop — so become the one who cannot be outlasted.',
    titles: [['Bond 3', 'Steadfast'], ['Bond 7', 'Relentless'], ['Bond 10', 'Endless']],
  },
  {
    id: 'shiori', name: 'Shiori Kuroha', stat: 'Agility', weapon: 'Kunai',
    philosophy: 'A mischievous former thief who fights on instinct. Shiori teaches you to never be where the opponent expects — reaction over rehearsal, always.',
    titles: [['Bond 3', 'Born of Instinct'], ['Bond 7', 'Untouchable'], ['Bond 10', 'The After-Image']],
  },
  {
    id: 'takumi', name: 'Takumi Mikage', stat: 'Control', weapon: 'Staff',
    philosophy: 'A precise perfectionist who wastes nothing. Takumi’s discipline is awareness and exact execution — a technique done sloppily is a technique not done at all.',
    titles: [['Bond 3', 'Centered'], ['Bond 7', 'Unwavering'], ['Bond 10', 'The Perfected']],
  },
];

const tabsWrap = document.querySelector('.master-tabs');
const artEl = document.getElementById('master-art');
const nameEl = document.getElementById('master-name');
const discEl = document.getElementById('master-discipline');
const weapEl = document.getElementById('master-weapon');
const philEl = document.getElementById('master-philosophy');
const titlesEl = document.getElementById('master-titles');

function renderMaster(m) {
  artEl.classList.add('swapping');
  setTimeout(() => {
    artEl.src = 'assets/v3/masters/' + m.id + '.webp';
    artEl.alt = m.name + ', Master of ' + m.stat;
    artEl.onload = () => artEl.classList.remove('swapping');
  }, 200);
  discEl.textContent = m.stat.toUpperCase();
  nameEl.textContent = m.name;
  weapEl.textContent = 'Weapon — ' + m.weapon;
  philEl.textContent = m.philosophy;
  titlesEl.innerHTML = m.titles.map(([bond, title]) =>
    '<span class="title-chip"><small>' + bond + '</small>' + title + '</span>').join('');
}

MASTERS.forEach((m, i) => {
  const btn = document.createElement('button');
  btn.className = 'master-tab' + (i === 0 ? ' active' : '');
  btn.setAttribute('role', 'tab');
  btn.innerHTML = m.name.split(' ')[0] + '<span class="tab-stat">' + m.stat + '</span>';
  btn.addEventListener('click', () => {
    tabsWrap.querySelectorAll('.master-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderMaster(m);
  });
  tabsWrap.appendChild(btn);
});
renderMaster(MASTERS[0]);

// preload master art so tab switches are instant
MASTERS.forEach(m => { const img = new Image(); img.src = 'assets/v3/masters/' + m.id + '.webp'; });

// ---------- Sword prestige rail ----------
const SWORDS = [
  ['rusted_sword', 'Rusted Practice Blade', 'Tier 1'],
  ['samruai_blade', 'Samurai Blade', 'Tier 3'],
  ['folded_steel', 'Folded Steel', 'Tier 5'],
  ['cherry_steel', 'Cherry Steel', 'Tier 7'],
  ['moon_lit_katana', 'Moonlit Katana', 'Tier 9'],
  ['oni_katana', 'Oni Katana', 'Tier 12'],
  ['dragon_fang', 'Dragon Fang', 'Tier 15'],
  ['lightning_cutter', 'Thunder Katana', 'Tier 18'],
  ['divine_steel', 'Blade of Legend', 'Tier 20'],
];
const rail = document.getElementById('sword-rail');
SWORDS.forEach(([file, name, tier], i) => {
  const card = document.createElement('div');
  card.className = 'sword-card' + (i === 0 ? ' first' : i === SWORDS.length - 1 ? ' last' : '');
  card.innerHTML = '<img src="assets/v3/swords/' + file + '.webp" alt="' + name + '" loading="lazy">' +
    '<span class="tier">' + tier + '</span><h4>' + name + '</h4>';
  rail.appendChild(card);
});

// drag-to-scroll on the sword rail (scrollbar is hidden)
const railWrap = document.querySelector('.sword-rail-wrap');
if (railWrap) {
  let down = false, startX = 0, startScroll = 0;
  railWrap.addEventListener('pointerdown', e => {
    down = true; startX = e.clientX; startScroll = railWrap.scrollLeft;
    railWrap.classList.add('dragging'); railWrap.setPointerCapture(e.pointerId);
  });
  railWrap.addEventListener('pointermove', e => {
    if (down) railWrap.scrollLeft = startScroll - (e.clientX - startX);
  });
  ['pointerup', 'pointercancel'].forEach(ev => railWrap.addEventListener(ev, () => {
    down = false; railWrap.classList.remove('dragging');
  }));
}

// ---------- Ambient embers ----------
const emberWrap = document.getElementById('embers');
if (emberWrap && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  for (let i = 0; i < 26; i++) {
    const e = document.createElement('span');
    e.className = 'ember';
    e.style.left = Math.random() * 100 + 'vw';
    e.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
    e.style.animationDuration = (9 + Math.random() * 14) + 's';
    e.style.animationDelay = (Math.random() * 16) + 's';
    e.style.width = e.style.height = (2 + Math.random() * 3) + 'px';
    emberWrap.appendChild(e);
  }
}

// ---------- Scroll reveals ----------
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal-on-scroll').forEach(el => io.observe(el));

// ---------- Echo diagram ----------
(function () {
  const svg = document.getElementById('echoSvg');
  if (!svg) return;

  const CENTER = { x: 280, y: 240 };
  const RADIUS = 190;
  const POLES = {
    ideal: { x: 280, y: 50, color: '#7ea8ff' },
    desire: { x: 460, y: 240, color: '#e0708c' },
    trauma: { x: 280, y: 430, color: '#6fbf7a' },
    experience: { x: 100, y: 240, color: '#d8a24a' },
  };
  const POLE_ORDER = ['ideal', 'desire', 'trauma', 'experience'];
  const POLE_NAMES = { ideal: 'Ideal', desire: 'Desire', trauma: 'Trauma', experience: 'Experience' };

  // 8 boundary points around the diamond, index 0 starting at Desire
  const BOUNDARY = [
    [460, 240], [370, 335], [280, 430], [190, 335],
    [100, 240], [190, 145], [280, 50], [370, 145],
  ];

  const SECTORS = [
    { pole: 'desire', title: 'Desire, hardened by loss',
      desc: 'Your Echo comes out fast and heavy and it does not pace itself. You open at full power and push for an early finish, keeping nothing back for a second round — which works, right up until there is one.',
      risk: 'You start taking what you want from people who cannot stop you, and telling yourself you are owed it because of what you lost.' },
    { pole: 'trauma', title: 'Trauma, pointed at a target',
      desc: 'Your Echo is sharpest against one particular person or thing. Aimed at what you actually hate it is more dangerous than anything else on this chart; in a sparring match against a stranger, it barely shows up.',
      risk: 'You win, and then you cannot stop. You go looking for the next enemy, because you have been the person who is owed something for so long that you do not know who you are without one.' },
    { pole: 'trauma', title: 'Trauma, worked into skill',
      desc: 'Your Echo defends before it does anything else — it reinforces, absorbs, and waits. You are hard to hurt, harder to surprise, and nobody catches you with the same thing twice.',
      risk: 'You get so good at not being hit that you stop hitting back. A fight you could have ended in ten seconds runs ten minutes, and the people counting on you run out of time.' },
    { pole: 'experience', title: 'Experience, carrying old scars',
      desc: 'Your Echo does not spike, it lasts. You are still standing and still swinging long after faster fighters have burned out, and the longer something drags on the more it favours you.',
      risk: 'You keep going when stopping was the right call. You decide this is the same as everything else you have survived, and you find out it is not while you are still in it.' },
    { pole: 'experience', title: 'Experience, guided by belief',
      desc: 'Your Echo is precise and repeatable. The same technique comes out the same way whether you are calm or in serious trouble, and you can break it down and teach it to someone else.',
      risk: 'You start demanding that precision from everyone. Students working as hard as they can get told it is not good enough, and keeping things perfect turns into removing whoever is not.' },
    { pole: 'ideal', title: 'Belief, backed by the work',
      desc: 'Your Echo holds. It does not waver when you are exhausted, outnumbered or frightened, because what it is built on has already been tested and did not break.',
      risk: 'You keep doing what used to be right. The situation changes, the rule you trained under stops fitting it, everyone around you can see that — and you follow the rule anyway.' },
    { pole: 'ideal', title: 'Belief, driven by ambition',
      desc: 'Your Echo is loud and visible. It carries across a fight and lifts the people beside you, and it tells everyone in the area exactly where you are.',
      risk: 'You start doing things you would have refused a year ago and calling them necessary. The people following you do them too, because you are the one who said it was fine.' },
    { pole: 'desire', title: 'Desire, justified by belief',
      desc: 'Your Echo grows faster than any other form. Every win feeds straight into the next one, so you get visibly stronger over weeks where other people flatten out.',
      risk: 'You never stop climbing. There is always one more fight worth taking, and you keep taking them until everyone who was training beside you has been left behind or used up.' },
  ];

  const CENTER_STATE = {
    pole: 'ideal', title: 'Unshaped',
    desc: 'Nothing is fixed yet. Your Echo answers effort but has no habits — no strength it reaches for, no way it reliably fails. Early in the story this is exactly where your character sits.',
    risk: 'Nothing yet. An unshaped Echo has no bad habit to fall into, because it does not have any habits at all.',
  };

  const highlight = document.getElementById('echoHighlight');
  const wisp = document.getElementById('echoWisp');
  const light = document.getElementById('echoLight');
  const halo = document.getElementById('echoHalo');
  const hint = document.getElementById('echoHint');
  const ripples = document.getElementById('echoRipples');
  const readout = document.getElementById('echoReadout');
  const titleEl = document.getElementById('echoTitle');
  const descEl = document.getElementById('echoDesc');
  const riskEl = document.getElementById('echoRisk');
  const mixEl = document.getElementById('echoMix');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    document.querySelectorAll('#echoWispFilter animate').forEach(a => a.remove());
  }

  POLE_ORDER.forEach(p => {
    const row = document.createElement('div');
    row.className = 'echo-mix-row';
    row.innerHTML =
      '<span class="echo-mix-name">' + POLE_NAMES[p] + '</span>' +
      '<div class="echo-mix-track"><div class="echo-mix-fill" data-pole="' + p + '" style="--bar-color:' + POLES[p].color + '"></div></div>' +
      '<span class="echo-mix-pct" data-pole-pct="' + p + '"></span>';
    mixEl.appendChild(row);
  });

  let hintDismissed = false;
  let dragging = false;

  function clampToRoi(x, y) {
    const dx = x - CENTER.x, dy = y - CENTER.y;
    const m = (Math.abs(dx) + Math.abs(dy)) / RADIUS;
    if (m > 1) return { x: CENTER.x + dx / m, y: CENTER.y + dy / m };
    return { x, y };
  }

  function computeMix(x, y) {
    const weights = {};
    let total = 0;
    POLE_ORDER.forEach(p => {
      const val = 1 / (Math.pow(Math.hypot(x - POLES[p].x, y - POLES[p].y), 1.7) + 400);
      weights[p] = val;
      total += val;
    });
    const raw = {};
    POLE_ORDER.forEach(p => { raw[p] = (weights[p] / total) * 100; });

    // largest-remainder rounding so the four values always sum to exactly 100
    const floored = {};
    let usedSum = 0;
    POLE_ORDER.forEach(p => { floored[p] = Math.floor(raw[p]); usedSum += floored[p]; });
    let remainder = 100 - usedSum;
    const byRemainder = POLE_ORDER.slice().sort((a, b) => (raw[b] - Math.floor(raw[b])) - (raw[a] - Math.floor(raw[a])));
    for (let i = 0; i < remainder; i++) floored[byRemainder[i]]++;
    return floored;
  }

  function updateFromPosition(x, y) {
    const clamped = clampToRoi(x, y);
    x = clamped.x; y = clamped.y;

    light.setAttribute('cx', x); light.setAttribute('cy', y);
    halo.setAttribute('cx', x); halo.setAttribute('cy', y);

    const dx = x - CENTER.x, dy = y - CENTER.y;
    const dist = Math.hypot(dx, dy);

    let state, sectorPoints = '';
    if (dist < 34) {
      state = CENTER_STATE;
    } else {
      const deg = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
      const idx = Math.floor(deg / 45) % 8;
      state = SECTORS[idx];
      const p0 = BOUNDARY[idx], p1 = BOUNDARY[(idx + 1) % 8];
      sectorPoints = CENTER.x + ',' + CENTER.y + ' ' + p0[0] + ',' + p0[1] + ' ' + p1[0] + ',' + p1[1];
    }

    highlight.setAttribute('points', sectorPoints);
    highlight.style.color = POLES[state.pole].color;
    wisp.setAttribute('points', sectorPoints);
    wisp.style.color = POLES[state.pole].color;

    readout.style.setProperty('--pole-color', POLES[state.pole].color);
    titleEl.textContent = state.title;
    descEl.textContent = state.desc;
    riskEl.textContent = state.risk;

    const mix = computeMix(x, y);
    POLE_ORDER.forEach(p => {
      mixEl.querySelector('[data-pole="' + p + '"]').style.width = mix[p] + '%';
      mixEl.querySelector('[data-pole-pct="' + p + '"]').textContent = mix[p];
    });

    return { x, y };
  }

  function svgPoint(clientX, clientY) {
    const rect = svg.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (560 / rect.width),
      y: (clientY - rect.top) * (500 / rect.height),
    };
  }

  function spawnRipple(x, y) {
    if (reduceMotion) return;
    [0, 260, 520].forEach(delay => {
      setTimeout(() => {
        const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        ring.setAttribute('class', 'echo-ripple');
        ring.setAttribute('cx', x); ring.setAttribute('cy', y); ring.setAttribute('r', 8);
        ring.style.opacity = '.55';
        ripples.appendChild(ring);
        const anim = ring.animate(
          [{ r: 8, opacity: .55 }, { r: 120, opacity: 0 }],
          { duration: 1700, easing: 'ease-out' }
        );
        anim.onfinish = () => ring.remove();
      }, delay);
    });
  }

  function dismissHint() {
    if (hintDismissed) return;
    hintDismissed = true;
    hint.style.opacity = '0';
  }

  let moved = false;

  svg.addEventListener('pointerdown', e => {
    dragging = true;
    moved = false;
    svg.classList.add('dragging');
    svg.setPointerCapture(e.pointerId);
    dismissHint();
    const pt = svgPoint(e.clientX, e.clientY);
    updateFromPosition(pt.x, pt.y);
    spawnRipple(pt.x, pt.y);
  });
  svg.addEventListener('pointermove', e => {
    if (!dragging) return;
    moved = true;
    const pt = svgPoint(e.clientX, e.clientY);
    updateFromPosition(pt.x, pt.y);
  });
  ['pointerup', 'pointercancel'].forEach(ev => svg.addEventListener(ev, () => {
    if (!dragging) return;
    dragging = false;
    svg.classList.remove('dragging');
    if (!moved) return;
    const x = parseFloat(light.getAttribute('cx'));
    const y = parseFloat(light.getAttribute('cy'));
    spawnRipple(x, y);
  }));

  updateFromPosition(332, 178);
})();
