/* AniFlex landing — lite avatar builder + stat roll.
   Class derivation and dice mechanics mirror the app
   (step12_summary.dart / spire_class_kits.dart), base tier only. */
(function () {
  'use strict';

  // ---------- Avatar builder ----------
  // Layers are separate transparent WebP sprites stacked in the app's real
  // z-order (see avatar_builder.dart): aura → wings → skin → brows → eyes →
  // mouth → bottoms → top → hair → shoes → lightning. All share one 380×522
  // (0.728) frame, so CSS object-fit:contain registers them pixel-for-pixel.
  var AV = 'assets/avatar/';
  // Shared hair dye set — all six exist on the app CDN for every style below.
  var HAIR_COLORS = [
    { key: 'black', css: '#1c1c1c' },
    { key: 'blond', css: '#e3c36a' },
    { key: 'blue', css: '#2b6bff' },
    { key: 'red', css: '#d92b2b' },
    { key: 'purple', css: '#9a4dff' },
    { key: 'pink', css: '#f06bb8' }
  ];
  // Effects live under the app's common/ path — same file for both genders.
  var AURAS = [
    { key: '', label: 'None' },
    { key: 'blue', label: 'Blue' },
    { key: 'purple', label: 'Violet' },
    { key: 'red', label: 'Ember' }
  ];
  var WINGS = [
    { key: '', label: 'None' },
    { key: 'angel', label: 'Angel' },
    { key: 'energy', label: 'Energy' }
  ];
  var BOLTS = [
    { key: '', label: 'None' },
    { key: 'blue', label: 'Blue' },
    { key: 'purple', label: 'Violet' }
  ];
  var CONFIG = {
    male: {
      hair: [
        { key: 'samurai', label: 'Samurai' },
        { key: 'attack', label: 'Attack' },
        { key: 'sharp_fade', label: 'Sharp Fade' },
        { key: 'buzz_cut', label: 'Buzz Cut' },
        { key: 'ponytail', label: 'Ponytail' },
        { key: 'shaggy', label: 'Shaggy' },
        { key: 'cyber_fade', label: 'Cyber Fade' },
        { key: 'sleek_straight', label: 'Sleek' }
      ],
      hairColors: HAIR_COLORS,
      tops: [{ key: 'tank_top', label: 'Tank' }, { key: 'workout_hoodie', label: 'Hoodie' }],
      bottoms: [{ key: 'shorts', label: 'Shorts' }, { key: 'sweats', label: 'Sweats' }],
      shoes: 'male_shoes_sneakers.webp',
      eyes: 'male_eyes_friendly_brown.webp',
      brows: 'male_brows_normal.webp',
      mouth: 'male_mouth_smirk.webp'
    },
    female: {
      hair: [
        { key: 'high_ponytail', label: 'Ponytail' },
        { key: 'twin_braids', label: 'Twin Braids' },
        { key: 'layered_bob', label: 'Bob' },
        { key: 'high_bun', label: 'High Bun' },
        { key: 'curly_fro', label: 'Curls' },
        { key: 'double_buns', label: 'Double Buns' },
        { key: 'tousled_waves', label: 'Waves' },
        { key: 'sleek_straight', label: 'Sleek' }
      ],
      hairColors: HAIR_COLORS,
      tops: [{ key: 'crop_top', label: 'Crop' }, { key: 'shirt', label: 'Shirt' }],
      bottoms: [{ key: 'leggings', label: 'Leggings' }, { key: 'shorts', label: 'Shorts' }],
      shoes: 'female_shoes_sneakers.webp',
      eyes: 'female_eyes_friendly_brown.webp',
      brows: 'female_brows_normal.webp',
      mouth: 'female_mouth_smirk.webp'
    }
  };
  var SKINS = [
    { key: 'fair', css: '#f2cfae' },
    { key: 'medium', css: '#c98d5f' },
    { key: 'deep', css: '#6e4530' }
  ];
  var VISIBLE_HAIR = 3; // first N styles shown; rest live behind the "More" toggle

  var state = {
    gender: 'male', skin: 'medium',
    hairStyle: 'samurai', hairColor: 'black', hairExpanded: false,
    top: 'tank_top', bottom: 'shorts',
    aura: '', wing: '', lightning: ''
  };

  var canvas = document.getElementById('avatar-canvas');

  function renderAvatar() {
    var g = state.gender;
    var c = CONFIG[g];
    var layers = []; // {f: file, c: optional css class}
    if (state.aura) layers.push({ f: 'fx_aura_' + state.aura + '.webp', c: 'lyr-aura' });
    if (state.wing) layers.push({ f: 'fx_wings_' + state.wing + '.webp', c: 'lyr-wings' });
    layers.push({ f: g + '_skin_' + state.skin + '.webp' });
    layers.push({ f: c.brows }, { f: c.eyes }, { f: c.mouth });
    layers.push({ f: g + '_bottom_' + state.bottom + '.webp' });
    layers.push({ f: g + '_top_' + state.top + '.webp' });
    layers.push({ f: g + '_hair_' + state.hairStyle + '_' + state.hairColor + '.webp' });
    layers.push({ f: c.shoes });
    if (state.lightning) layers.push({ f: 'fx_lightning_' + state.lightning + '.webp', c: 'lyr-bolt' });

    canvas.innerHTML = '';
    layers.forEach(function (L) {
      var img = document.createElement('img');
      img.src = AV + L.f;
      if (L.c) img.className = L.c;
      img.alt = '';
      img.draggable = false;
      canvas.appendChild(img);
    });
  }

  // Generic chip-row selector. items: [{key,label}]. getSel/setSel operate on state.
  function buildChips(wrapId, items, getSel, setSel) {
    var wrap = document.getElementById(wrapId);
    if (!wrap) return;
    wrap.innerHTML = '';
    items.forEach(function (it) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip' + (it.key === getSel() ? ' active' : '');
      b.textContent = it.label;
      b.onclick = function () { setSel(it.key); buildControls(); renderAvatar(); };
      wrap.appendChild(b);
    });
  }

  function buildSwatches(wrapId, items, getSel, setSel, labelPrefix) {
    var wrap = document.getElementById(wrapId);
    if (!wrap) return;
    wrap.innerHTML = '';
    items.forEach(function (s) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'swatch' + (s.key === getSel() ? ' active' : '');
      b.style.background = s.css;
      b.setAttribute('aria-label', labelPrefix + ' ' + s.key);
      b.onclick = function () { setSel(s.key); buildControls(); renderAvatar(); };
      wrap.appendChild(b);
    });
  }

  function buildControls() {
    var c = CONFIG[state.gender];

    buildSwatches('skin-swatches', SKINS,
      function () { return state.skin; }, function (v) { state.skin = v; }, 'Skin tone');

    // Hair styles — expandable (first 3 + "More" toggle)
    var hairWrap = document.getElementById('hair-styles');
    hairWrap.innerHTML = '';
    var selIdx = 0;
    c.hair.forEach(function (h, i) { if (h.key === state.hairStyle) selIdx = i; });
    var expanded = state.hairExpanded || selIdx >= VISIBLE_HAIR;
    c.hair.forEach(function (h, idx) {
      if (idx >= VISIBLE_HAIR && !expanded) return;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip' + (h.key === state.hairStyle ? ' active' : '');
      b.textContent = h.label;
      b.onclick = function () { state.hairStyle = h.key; buildControls(); renderAvatar(); };
      hairWrap.appendChild(b);
    });
    if (c.hair.length > VISIBLE_HAIR) {
      var toggle = document.createElement('button');
      toggle.className = 'chip more';
      toggle.type = 'button';
      toggle.textContent = expanded ? 'Less ▴' : 'More ▾';
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      toggle.onclick = function () { state.hairExpanded = !expanded; buildControls(); };
      hairWrap.appendChild(toggle);
    }

    buildSwatches('hair-colors', c.hairColors,
      function () { return state.hairColor; }, function (v) { state.hairColor = v; }, 'Hair color');
    buildChips('top-styles', c.tops,
      function () { return state.top; }, function (v) { state.top = v; });
    buildChips('bottom-styles', c.bottoms,
      function () { return state.bottom; }, function (v) { state.bottom = v; });
    buildChips('aura-styles', AURAS,
      function () { return state.aura; }, function (v) { state.aura = v; });
    buildChips('wing-styles', WINGS,
      function () { return state.wing; }, function (v) { state.wing = v; });
    buildChips('lightning-styles', BOLTS,
      function () { return state.lightning; }, function (v) { state.lightning = v; });
  }

  document.querySelectorAll('#gender-toggle .toggle-btn').forEach(function (btn) {
    btn.onclick = function () {
      document.querySelectorAll('#gender-toggle .toggle-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      state.gender = btn.dataset.gender;
      var c = CONFIG[state.gender];
      // Reset gender-specific selections to that gender's defaults; keep effects.
      state.hairStyle = c.hair[0].key;
      state.hairExpanded = false;
      state.top = c.tops[0].key;
      state.bottom = c.bottoms[0].key;
      if (!c.hairColors.some(function (hc) { return hc.key === state.hairColor; })) {
        state.hairColor = c.hairColors[0].key;
      }
      buildControls();
      renderAvatar();
    };
  });

  // ---------- Class kits (base tier, from spire_class_kits.dart) ----------
  var KITS = {
    'strength': { name: 'Brawler', passiveName: 'Raw Force', passive: '+8% damage on everything.', specialName: 'Colossal Blow', special: 'One devastating hit at 250% damage.', evolve: 'Iron Vanguard', flavor: 'Raw force answers every question.' },
    'agility': { name: 'Runner', passiveName: 'Slipstream', passive: '+10% evade chance on Dodge.', specialName: 'Afterimage Assault', special: 'Three rapid hits of 100% damage each.', evolve: 'Velocity Striker', flavor: 'They cannot hit what they cannot see.' },
    'power': { name: 'Striker', passiveName: 'Trigger Finger', passive: '+10% crit chance.', specialName: 'Detonation Strike', special: '210% damage with 50% crit chance on this hit.', evolve: 'Kinetic Architect', flavor: 'Precision beats power when fatigue sets in.' },
    'balance': { name: 'Guardian', passiveName: 'Rooted', passive: 'Take -8% damage from all hits.', specialName: 'Bastion Slam', special: '200% damage plus a light shield: take -25% damage for the next 2 enemy turns.', evolve: 'Anchor Warden', flavor: 'An immovable wall between chaos and calm.' },
    'stamina': { name: 'Survivor', passiveName: 'Deep Reserves', passive: '+10% max HP.', specialName: 'Second Wind Strike', special: '200% damage and heal 10% max HP.', evolve: 'Stamina Builder', flavor: 'Outlast everything. Then keep going.' },
    'strength+agility': { name: 'Skirmisher', passiveName: 'Cut and Run', passive: '+5% damage and +6% evade chance.', specialName: 'Blade Dance', special: '230% damage; your evade chance is doubled for the rest of this turn cycle.', evolve: 'Savage Duelist', flavor: 'Strike first. Vanish before the counter.' },
    'strength+power': { name: 'Juggernaut', passiveName: 'Heavy Hands', passive: '+5% damage and +6% crit chance.', specialName: 'Seismic Crush', special: '260% damage; on crit, a shockwave deals bonus 50% damage. The hardest-hitting Special in the game.', evolve: 'Titan Breaker', flavor: 'Subtlety is for people who can’t lift.' },
    'strength+balance': { name: 'Sentinel', passiveName: 'Forward Wall', passive: '+5% damage and take -5% damage.', specialName: 'Aegis Breaker', special: '220% damage and brace: the enemy’s next hit is reduced by 40%.', evolve: 'Stone Sentinel', flavor: 'The wall that walks forward.' },
    'strength+stamina': { name: 'Warbearer', passiveName: 'Titan’s Blood', passive: '+5% damage and +6% max HP.', specialName: 'War Cry Strike', special: '225% damage, heal 25% of damage dealt.', evolve: 'Iron Survivor', flavor: 'Forged through suffering and persistence.' },
    'agility+power': { name: 'Blitzer', passiveName: 'Live Wire', passive: '+6% evade chance and +6% crit chance.', specialName: 'Lightning Flurry', special: 'Four fast hits of 55% damage each — every hit rolls its own crit.', evolve: 'Flash Striker', flavor: 'Speed is a weapon. So is timing.' },
    'agility+balance': { name: 'Flowfighter', passiveName: 'Like Water', passive: '+6% evade chance and take -5% damage.', specialName: 'Redirective Flow', special: '200% damage, then enter Flow for 2 enemy turns: auto-evade rolls against every attack, and evaded attacks are redirected back for 50% of their damage.', evolve: 'Flow Warden', flavor: 'Bend, redirect, and never break.' },
    'agility+stamina': { name: 'Windrunner', passiveName: 'Pacer', passive: '+6% evade chance and +6% max HP.', specialName: 'Tempo Strike', special: '190% damage and refund 1 AP immediately.', evolve: 'Endless Runner', flavor: 'The horizon is just a suggestion.' },
    'power+balance': { name: 'Crusher', passiveName: 'Counterweight', passive: '+6% crit chance and take -5% damage.', specialName: 'Aftershock', special: 'Every hit you take stores force (max 5 stacks). Aftershock deals 200% damage, +15% per stack, and consumes all stacks.', evolve: 'Impact Architect', flavor: 'Absorb the storm. Return it doubled.' },
    'power+stamina': { name: 'Berserker', passiveName: 'Pain Engine', passive: '+6% crit chance and +6% max HP; below 50% HP your crit bonus doubles.', specialName: 'Reckless Overdrive', special: '220% damage; costs 8% of your max HP to use.', evolve: 'Overdrive Striker', flavor: 'Pain is fuel. Burn bright.' },
    'balance+stamina': { name: 'Bulwark', passiveName: 'Living Fortress', passive: 'Take -5% damage and +6% max HP.', specialName: 'Fortress Reprisal', special: '200% damage plus bonus damage equal to 15% of your max HP, and guard (next hit -40%).', evolve: 'Fortress Keeper', flavor: 'Some heroes charge. You endure.' },
    'balanced': { name: 'Adventurer', passiveName: 'Well-Rounded', passive: '+4% to all five mechanics: damage, evade, crit, damage reduction, and max HP.', specialName: 'Adaptive Strike', special: '215% damage plus a bonus effect: below 50% HP it heals 12% max HP, otherwise it raises a light shield reducing the next 2 enemy hits by 30%.', evolve: 'System Integrator', flavor: 'Master of nothing. Threat in everything.' }
  };

  // Canonical stat order for dual-pair keys (matches _kStatOrder in the app)
  var STAT_ORDER = ['strength', 'agility', 'power', 'balance', 'stamina'];

  // Mirrors _deriveClass() in step12_summary.dart
  function deriveClass(stats) {
    var entries = STAT_ORDER.map(function (k) { return { key: k, value: stats[k] }; });
    entries.sort(function (a, b) { return b.value - a.value; });
    var top = entries[0].value, second = entries[1].value,
        third = entries[2].value, fifth = entries[4].value;

    if (fifth > 0 && (top - fifth) <= 2) return KITS['balanced'];
    if (second === 0 || top >= second * 1.3 - 0.001) return KITS[entries[0].key];
    if ((third === 0 || (top >= third * 1.2 - 0.001 && second >= third * 1.2 - 0.001)) &&
        top < second * 1.3 - 0.001) {
      var a = entries[0].key, b = entries[1].key;
      var pair = STAT_ORDER.indexOf(a) < STAT_ORDER.indexOf(b) ? a + '+' + b : b + '+' + a;
      return KITS[pair] || KITS['balanced'];
    }
    return KITS['balanced'];
  }

  // Mirrors the app's dice roll: 5 dice of 1-10, reroll the whole set until total >= 20
  function rollStats() {
    var rolled;
    do {
      rolled = [];
      for (var i = 0; i < 5; i++) rolled.push(Math.floor(Math.random() * 10) + 1);
    } while (rolled.reduce(function (a, b) { return a + b; }, 0) < 20);
    return {
      strength: rolled[0], agility: rolled[1], power: rolled[2],
      balance: rolled[3], stamina: rolled[4]
    };
  }

  // ---------- Roll UI ----------
  var STAT_META = [
    { key: 'strength', label: 'STR', cls: 'stat-str' },
    { key: 'agility', label: 'AGL', cls: 'stat-agl' },
    { key: 'power', label: 'POW', cls: 'stat-pow' },
    { key: 'balance', label: 'BAL', cls: 'stat-bal' },
    { key: 'stamina', label: 'STA', cls: 'stat-sta' }
  ];

  var rollBtn = document.getElementById('roll-btn');
  var rerollBtn = document.getElementById('reroll-btn');
  var reveal = document.getElementById('reveal');
  var statGrid = document.getElementById('stat-grid');
  var scan = document.getElementById('scan-overlay');

  function buildStatCells() {
    statGrid.innerHTML = '';
    return STAT_META.map(function (m) {
      var cell = document.createElement('div');
      cell.className = 'stat-cell ' + m.cls;
      cell.innerHTML = '<span class="stat-key">' + m.label + '</span><span class="stat-val">0</span>';
      statGrid.appendChild(cell);
      return cell.querySelector('.stat-val');
    });
  }

  function doRoll() {
    rollBtn.disabled = true;
    var stats = rollStats();
    var kit = deriveClass(stats);

    scan.classList.remove('scanning');
    void scan.offsetWidth; // restart animation
    scan.classList.add('scanning');

    reveal.classList.remove('hidden');
    document.getElementById('class-card').style.visibility = 'hidden';
    var cells = buildStatCells();

    // Slot-machine shuffle, then settle on the real values (result is pre-rolled, like the app)
    var t = 0;
    var shuffle = setInterval(function () {
      t += 1;
      cells.forEach(function (c) { c.textContent = Math.floor(Math.random() * 10) + 1; });
      if (t >= 14) {
        clearInterval(shuffle);
        STAT_META.forEach(function (m, i) { cells[i].textContent = stats[m.key]; });
        showClass(kit);
        rollBtn.disabled = false;
        rollBtn.querySelector('.roll-btn-label').textContent = 'ROLL AGAIN';
      }
    }, 110);

    reveal.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function showClass(kit) {
    var card = document.getElementById('class-card');
    document.getElementById('class-name').textContent = kit.name.toUpperCase();
    document.getElementById('class-flavor').textContent = '“' + kit.flavor + '”';
    document.getElementById('passive-name').textContent = kit.passiveName.toUpperCase();
    document.getElementById('passive-text').textContent = kit.passive;
    document.getElementById('special-name').textContent = kit.specialName.toUpperCase();
    document.getElementById('special-text').textContent = kit.special;
    document.getElementById('class-evolve').innerHTML =
      'Reach Rank C in the app and ' + kit.name + ' evolves into <b>' + kit.evolve + '</b>.';
    card.style.visibility = 'visible';
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = '';
  }

  rollBtn.addEventListener('click', doRoll);
  rerollBtn.addEventListener('click', doRoll);
  document.getElementById('ascend-btn').addEventListener('click', function () {
    document.querySelector('.final-cta').scrollIntoView({ behavior: 'smooth' });
  });

  // Clear the scan class once the sweep finishes so no band is ever left frozen,
  // and so the next roll restarts it cleanly.
  scan.addEventListener('animationend', function (e) {
    if (e.animationName === 'scanSweep') scan.classList.remove('scanning');
  });

  // ---------- ambient parallax ----------
  var ambient = document.getElementById('ambient');
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (ambient && !reduceMotion) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        ambient.style.transform = 'translateY(' + (window.pageYOffset * 0.06) + 'px)';
        ticking = false;
      });
    }, { passive: true });
  }

  // ---------- init ----------
  buildControls();
  renderAvatar();
})();
