/* AniFlex landing — lite avatar builder + stat roll.
   Class derivation and dice mechanics mirror the app
   (step12_summary.dart / spire_class_kits.dart), base tier only. */
(function () {
  'use strict';

  // ---------- Avatar builder ----------
  var AV = 'assets/avatar/';
  var CONFIG = {
    male: {
      hair: [
        { key: 'samurai', label: 'Samurai' },
        { key: 'attack', label: 'Attack' },
        { key: 'sharp_fade', label: 'Sharp Fade' }
      ],
      hairColors: [
        { key: 'black', css: '#1c1c1c' },
        { key: 'blue', css: '#2b6bff' },
        { key: 'red', css: '#d92b2b' }
      ],
      top: 'male_top_tank_top.webp',
      bottom: 'male_bottom_shorts.webp',
      shoes: 'male_shoes_sneakers.webp',
      eyes: 'male_eyes_friendly_brown.webp',
      brows: 'male_brows_normal.webp',
      mouth: 'male_mouth_smirk.webp'
    },
    female: {
      hair: [
        { key: 'high_ponytail', label: 'Ponytail' },
        { key: 'twin_braids', label: 'Twin Braids' },
        { key: 'layered_bob', label: 'Bob' }
      ],
      hairColors: [
        { key: 'black', css: '#1c1c1c' },
        { key: 'blue', css: '#2b6bff' },
        { key: 'pink', css: '#f06bb8' }
      ],
      top: 'female_top_crop_top.webp',
      bottom: 'female_bottom_leggings.webp',
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

  var state = { gender: 'male', skin: 'medium', hairStyle: 'samurai', hairColor: 'black' };

  var canvas = document.getElementById('avatar-canvas');
  var skinWrap = document.getElementById('skin-swatches');
  var hairWrap = document.getElementById('hair-styles');
  var colorWrap = document.getElementById('hair-colors');

  function renderAvatar() {
    var g = state.gender;
    var c = CONFIG[g];
    // Z-order mirrors the app: body → clothing → eyebrows → eyes → mouth → hair
    var layers = [
      g + '_skin_' + state.skin + '.webp',
      c.bottom, c.top, c.shoes,
      c.brows, c.eyes, c.mouth,
      g + '_hair_' + state.hairStyle + '_' + state.hairColor + '.webp'
    ];
    canvas.innerHTML = '';
    layers.forEach(function (file) {
      var img = document.createElement('img');
      img.src = AV + file;
      img.alt = '';
      img.draggable = false;
      canvas.appendChild(img);
    });
  }

  function buildControls() {
    var c = CONFIG[state.gender];

    skinWrap.innerHTML = '';
    SKINS.forEach(function (s) {
      var b = document.createElement('button');
      b.className = 'swatch' + (s.key === state.skin ? ' active' : '');
      b.style.background = s.css;
      b.setAttribute('aria-label', 'Skin tone ' + s.key);
      b.onclick = function () { state.skin = s.key; buildControls(); renderAvatar(); };
      skinWrap.appendChild(b);
    });

    hairWrap.innerHTML = '';
    c.hair.forEach(function (h) {
      var b = document.createElement('button');
      b.className = 'chip' + (h.key === state.hairStyle ? ' active' : '');
      b.textContent = h.label;
      b.onclick = function () { state.hairStyle = h.key; buildControls(); renderAvatar(); };
      hairWrap.appendChild(b);
    });

    colorWrap.innerHTML = '';
    c.hairColors.forEach(function (hc) {
      var b = document.createElement('button');
      b.className = 'swatch' + (hc.key === state.hairColor ? ' active' : '');
      b.style.background = hc.css;
      b.setAttribute('aria-label', 'Hair color ' + hc.key);
      b.onclick = function () { state.hairColor = hc.key; buildControls(); renderAvatar(); };
      colorWrap.appendChild(b);
    });
  }

  document.querySelectorAll('#gender-toggle .toggle-btn').forEach(function (btn) {
    btn.onclick = function () {
      document.querySelectorAll('#gender-toggle .toggle-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      state.gender = btn.dataset.gender;
      var c = CONFIG[state.gender];
      state.hairStyle = c.hair[0].key;
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

  // ---------- init ----------
  buildControls();
  renderAvatar();
})();
