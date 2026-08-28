/* AniFlex v3 landing — masters selector, sword rail, ambient embers, scroll reveals */

// ---------- The Five Masters ----------
const MASTERS = [
  {
    id: 'goro', name: 'Goro Arakida', stat: 'Strength', weapon: 'Spiked Club',
    philosophy: 'Loud, laughing, and impossible to move. Goro teaches that true strength isn’t how hard you hit — it’s remaining unbroken no matter what hits you.',
    titles: [['Bond 3', 'Iron Will'], ['Bond 7', 'The Colossus'], ['Bond 10', 'The Unbroken']],
  },
  {
    id: 'akane', name: 'Akane Homura', stat: 'Power', weapon: 'Twin Hammers', artTransform: 'translate(-7px, 0)',
    philosophy: 'Blunt, fiercely competitive, and always first through the door. For Akane, power is life itself — force gathered, then released in one decisive moment.',
    titles: [['Bond 3', 'Rising Force'], ['Bond 7', 'The Unleashed'], ['Bond 10', 'Living Power']],
  },
  {
    id: 'ryohei', name: 'Ryohei Sazanami', stat: 'Stamina', weapon: 'Double-Sided Spear',
    philosophy: 'Dry, understated, and utterly relentless. Ryohei’s lesson is simple: the fight goes to whoever refuses to stop — so become the one who cannot be outlasted.',
    titles: [['Bond 3', 'Steadfast'], ['Bond 7', 'Relentless'], ['Bond 10', 'Endless']],
  },
  {
    id: 'shiori', name: 'Shiori Kuroha', stat: 'Agility', weapon: 'Kunai', artTransform: 'translate(-12px, 5px)',
    philosophy: 'A mischievous former thief who fights on instinct. Shiori teaches you to never be where the opponent expects — reaction over rehearsal, always.',
    titles: [['Bond 3', 'Born of Instinct'], ['Bond 7', 'Untouchable'], ['Bond 10', 'The After-Image']],
  },
  {
    id: 'takumi', name: 'Takumi Mikage', stat: 'Control', weapon: 'Staff', artTransform: 'translate(12px, 0)',
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
    artEl.style.transform = m.artTransform || '';
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
  ['diamond_blade', 'Diamond Blade', 'Tier 18'],
  ['legendary_sword', 'Blade of Legend', 'Tier 20'],
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
