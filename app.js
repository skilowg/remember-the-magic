let homeIdleTimerId = null;

function clearHomeIdleWave() {
  if (homeIdleTimerId !== null) {
    clearTimeout(homeIdleTimerId);
    homeIdleTimerId = null;
  }
  const stack = document.getElementById('cardStack');
  if (stack) {
    stack.classList.remove('stack-idle');
  }
}

function scheduleHomeIdleWave() {
  clearHomeIdleWave(); // reset if already scheduled

  const stack = document.getElementById('cardStack');
  if (!stack) return;

  homeIdleTimerId = setTimeout(() => {
    const stackEl = document.getElementById('cardStack');
    if (!stackEl) return;
    stackEl.classList.add('stack-idle');
  }, 3000); // 3s idle → start wave
}

/* ---------------------------------------------------
   Static asset paths for web version
--------------------------------------------------- */

// --- Home card image pools ---
// Full set (all images you want to use when online)
const FULL_HOME_CARD_IMAGES = [
  // Valley of Witches
  'assets/zones/zone_valley_of_witches/zone_valley_of_witches-majo011.jpg',
  'assets/zones/zone_valley_of_witches/zone_valley_of_witches-majo037.jpg',
  'assets/zones/zone_valley_of_witches/zone_valley_of_witches-majo043.jpg',
  'assets/zones/zone_valley_of_witches/zone_valley_of_witches-howl016.jpg',
  'assets/zones/zone_valley_of_witches/zone_valley_of_witches-howl035.jpg',

  // Hill of Youth
  'assets/zones/zone_hill_of_youth/zone_hill_of_youth-mimi044.jpg',
  'assets/zones/zone_hill_of_youth/zone_hill_of_youth-baron033.jpg',
  'assets/zones/zone_hill_of_youth/zone_hill_of_youth-kokurikozaka045.jpg',

  // Dondoko Forest
  'assets/zones/zone_dondoko_forest/zone_dondoko_forest-totoro019.jpg',
  'assets/zones/zone_dondoko_forest/zone_dondoko_forest-totoro025.jpg',
  'assets/zones/zone_dondoko_forest/zone_dondoko_forest-totoro046.jpg',

  // Grand Warehouse
  'assets/zones/zone_grand_warehouse/zone_grand_warehouse-laputa001.jpg',
  'assets/zones/zone_grand_warehouse/zone_grand_warehouse-laputa040.jpg',
  'assets/zones/zone_grand_warehouse/zone_grand_warehouse-chihiro002.jpg',
  'assets/zones/zone_grand_warehouse/zone_grand_warehouse-chihiro047.jpg',
  'assets/zones/zone_grand_warehouse/zone_grand_warehouse-karigurashi009.jpg',
  'assets/zones/zone_grand_warehouse/zone_grand_warehouse-nausicaa012.jpg',

  // Mononoke Village
  'assets/zones/zone_mononoke_village/zone_mononoke_village-mononoke002.jpg',
  'assets/zones/zone_mononoke_village/zone_mononoke_village-mononoke015.jpg',
  'assets/zones/zone_mononoke_village/zone_mononoke_village-mononoke026.jpg'
];

// Offline-safe subset (matches sw.js CORE_ASSETS)
const OFFLINE_HOME_CARD_IMAGES = [
  // Valley of Witches
  'assets/zones/zone_valley_of_witches/zone_valley_of_witches-majo043.jpg',
  'assets/zones/zone_valley_of_witches/zone_valley_of_witches-howl016.jpg',

  // Hill of Youth
  'assets/zones/zone_hill_of_youth/zone_hill_of_youth-mimi044.jpg',
  'assets/zones/zone_hill_of_youth/zone_hill_of_youth-kokurikozaka045.jpg',

  // Dondoko Forest
  'assets/zones/zone_dondoko_forest/zone_dondoko_forest-totoro025.jpg',
  'assets/zones/zone_dondoko_forest/zone_dondoko_forest-totoro046.jpg',

  // Grand Warehouse
  'assets/zones/zone_grand_warehouse/zone_grand_warehouse-laputa040.jpg',
  'assets/zones/zone_grand_warehouse/zone_grand_warehouse-chihiro047.jpg',

  // Mononoke Village
  'assets/zones/zone_mononoke_village/zone_mononoke_village-mononoke015.jpg',
  'assets/zones/zone_mononoke_village/zone_mononoke_village-mononoke026.jpg'
];

// Decide which pool to use
function getHomeImagePool() {
  // If we explicitly know we’re offline, stick to the cached subset
  if ('onLine' in navigator && !navigator.onLine) {
    return OFFLINE_HOME_CARD_IMAGES;
  }
  // Otherwise, assume we can use the full set
  return FULL_HOME_CARD_IMAGES;
}

// Icon paths used throughout the UI.
// Make sure these filenames match what you actually have in assets/icons/.
const ICONS = {
  homeActive:      'assets/icons/Home_active.svg',
  homeInactive:    'assets/icons/Home_inactive.svg',
  historyActive:   'assets/icons/History_active.svg',
  historyInactive: 'assets/icons/History_inactive.svg',
  shuffleActive:   'assets/icons/Shuffle_active.svg',
  swipeActive:     'assets/icons/Swipe_active.svg',
  key:             'assets/icons/Code_active.svg',      // code/zone button (even if hidden)
  exportActive:    'assets/icons/Export_active.svg',    // used in History export
  delete:          'assets/icons/Delete.svg'            // used in History cards
};

// Header "Remember the Magic" logo
// Point this to your actual header SVG inside assets/.
const HEADER_LOGO = 'assets/Header_RemembertheMagic.svg';

/* ---------------------------------------------------
   Zones + Prompt Library (injected from prompts.json)
--------------------------------------------------- */

// Canonical zone IDs for future ENTER CODE feature.
// These strings must match the "zones" values in prompts.json.
const ZONES = {
  HILL_OF_YOUTH:    'HILL_OF_YOUTH',
  WAREHOUSE:        'WAREHOUSE',
  DONDOKO:          'DONDOKO',
  VALLEY_OF_WITCHES:'VALLEY_OF_WITCHES',
  MONONOKE:         'MONONOKE',
  SPRINGTIME_HILL:  'SPRINGTIME_HILL'
};

// Fallback prompts used only if prompts.json is missing or invalid.
// Structure matches prompts.json entries.
const FALLBACK_PROMPTS = [
  {
    id: 1,
    tag: "Life",
    tagKey: "life",
    text: "Did anything small today grab your attention without really trying?",
    zones: []
  },
  {
    id: 2,
    tag: "Life",
    tagKey: "life",
    text: "Was there a moment that felt a little like walking into a familiar scene from a Ghibli film?",
    zones: []
  },
  {
    id: 3,
    tag: "Trip",
    tagKey: "trip",
    text: "If you could freeze one scene from today like a photo, which would you choose?",
    zones: []
  },
  {
    id: 4,
    tag: "Trip",
    tagKey: "trip",
    text: "Where did your feet take you today that your morning self didn’t expect?",
    zones: []
  },
  {
    id: 5,
    tag: "Trip",
    tagKey: "trip",
    text: "What’s one detail from today that future-you might forget unless you write it down now?",
    zones: []
  },
  {
    id: 6,
    tag: "Life",
    tagKey: "life",
    text: "Did you notice a quiet kindness today—something that would be easy to miss in a hurry?",
    zones: []
  },
  {
    id: 7,
    tag: "Ghibli",
    tagKey: "ghibli",
    text: "Did anything today feel like it could belong in a Ghibli-style background shot?",
    zones: []
  },
  {
    id: 8,
    tag: "Ghibli",
    tagKey: "ghibli",
    text: "Was there a moment that felt like walking into a familiar shot from a Ghibli film?",
    zones: []
  },
  {
    id: 9,
    tag: "Ghibli",
    tagKey: "ghibli",
    text: "If today had a Ghibli-style background shot, what would be in the foreground?",
    zones: []
  }
];

// Main prompt source: injected from prompts.json by Scriptable loader.
// If that fails or is empty, we fall back to the small built-in list above.
function getPromptPool() {
  return (window.RTM_PROMPTS && Array.isArray(window.RTM_PROMPTS) && window.RTM_PROMPTS.length)
    ? window.RTM_PROMPTS
    : FALLBACK_PROMPTS;
}

function loadPromptsFromJson() {
  fetch('prompts.json')
    .then(res => {
      if (!res.ok) {
        throw new Error('HTTP ' + res.status);
      }
      return res.json();
    })
    .then(data => {
      if (Array.isArray(data) && data.length) {
        // Make the prompts globally available
        window.RTM_PROMPTS = data;
        console.log('Prompts loaded:', data.length);
      } else {
        console.log('prompts.json loaded but empty or invalid, using fallback.');
      }
    })
    .catch(err => {
      console.log('Failed to load prompts.json, using fallback.', err);
    });
}
	
// ---------- Tag metadata + helpers ----------

	const TAG_META = {
	  life:   { label: 'LIFE'   },
	  trip:   { label: 'TRIP'   },
	  ghibli: { label: 'GHIBLI' }
	};

	// Apply a pill-style tag to a selection card; returns the tagKey we used
	function applySelectionTag(tagEl, prompt) {
	  if (!tagEl || !prompt) return null;

	  const key = (prompt.tagKey || inferTagKey(prompt.tag) || 'life').toLowerCase();
	  const meta = TAG_META[key];

	  if (!meta) {
	    tagEl.style.display = 'none';
	    return key;
	  }

	  tagEl.style.display = 'inline-flex';
	  tagEl.textContent   = meta.label;
	  tagEl.className     = 'prompt-tag tag-' + key; // keeps existing CSS naming
	  return key;
	}

	// Apply tag to the VIEW screen pill
	function applyViewTag(prompt) {
	  const tagEl = document.getElementById('view-tag');
	  if (!tagEl || !prompt) return;

	  const key = (prompt.tagKey || inferTagKey(prompt.tag) || 'life').toLowerCase();
	  const meta = TAG_META[key];

	  if (!meta) {
	    tagEl.style.display = 'none';
	    return;
	  }

	  tagEl.style.display = 'inline-flex';
	  tagEl.textContent   = meta.label;
	  tagEl.className     = 'view-tag tag-' + key;
	}

let currentSelection = [];
let currentPrompt = null;
let historyEntries = [];
let toastTimeout = null;

// ----- View screen swipe-up detection -----
let viewSwipeStartY = null;
let viewSwipeActive = false;
let viewFinishing   = false;  // guard so we don't double-finish


// ---------- History storage ----------

/* ---------------------------------------------------
   History persistence (localStorage inside WebView)
--------------------------------------------------- */

function loadHistory() {
  try {
    const raw = localStorage.getItem('rtmHistory');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        historyEntries = parsed;
      }
    }
  } catch (e) {
    console.log('Failed to load history', e);
  }
}

function saveHistory() {
  try {
    localStorage.setItem('rtmHistory', JSON.stringify(historyEntries));
  } catch (e) {
    console.log('Failed to save history', e);
  }
}

/* ---------------------------------------------------
   Home – Images + Icons
--------------------------------------------------- */

function applyHomeCardImages() {
  const cards = [
    document.getElementById('card-1'),
    document.getElementById('card-2'),
    document.getElementById('card-3')
  ];

  const pool = getHomeImagePool(); // uses FULL vs OFFLINE based on navigator.onLine

  if (!Array.isArray(pool) || !pool.length) return;

  // Shallow copy & shuffle for a fresh order every time
  const shuffled = pool.slice().sort(() => Math.random() - 0.5);

  cards.forEach((card, i) => {
    if (!card) return;
    const url = shuffled[i % shuffled.length]; // each entry is a string path
    if (url) {
      card.style.backgroundImage = "url('" + url + "')";
    }
  });

  triggerHomeStackEnter();
}

function triggerHomeStackEnter() {
  const stack = document.getElementById('cardStack');
  if (!stack) return;

  // Remove & re-add to restart animation each time
  stack.classList.remove('stack-enter');
  // force reflow so animation restarts reliably
  void stack.offsetWidth;
  stack.classList.add('stack-enter');
}

function applyIconsAndHeader() {
  const keyEl     = document.getElementById('icon-key');
  const homeEl    = document.getElementById('icon-home');
  const histEl    = document.getElementById('icon-history');
  const logoEl    = document.getElementById('header-logo');
  const rfEl      = document.getElementById('icon-reshuffle');
  const swipeEl   = document.getElementById('icon-swipe');
  const exportEl  = document.getElementById('icon-export');

  if (ICONS.key && keyEl) keyEl.src = ICONS.key;
  if (homeEl && ICONS.homeActive) homeEl.src = ICONS.homeActive;
  if (histEl && ICONS.historyInactive) histEl.src = ICONS.historyInactive;
  if (logoEl && HEADER_LOGO) logoEl.src = HEADER_LOGO;
  if (rfEl && ICONS.shuffleActive) rfEl.src = ICONS.shuffleActive;
  if (swipeEl && ICONS.swipeActive) swipeEl.src = ICONS.swipeActive;

  // --- Export icon: try multiple possible keys from the loader ---
  if (exportEl) {
    const exportSrc =
      ICONS.exportActive ||
      ICONS.export ||
      ICONS.Export_active;

    if (exportSrc) {
      exportEl.src = exportSrc;
    }
  }
}

/* ---------------------------------------------------
   Screen Switching
--------------------------------------------------- */

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('screen-' + name);
  if (target) target.classList.add('active');

  const shuffleControl = document.querySelector('.shuffle-control');
  if (shuffleControl) shuffleControl.style.display = (name === 'home') ? 'block' : 'none';

  const nav = document.querySelector('.bottom-nav');
  if (nav) nav.style.display = (name === 'view') ? 'none' : 'flex';
}

/* NEW: high-level navigation + icons + idle wave */
function switchScreen(name) {
  showScreen(name);

  // update nav active state
  document.querySelectorAll('.nav-item').forEach(n =>
    n.classList.remove('nav-item-active')
  );
  const navItem = document.querySelector('.nav-item[data-screen="' + name + '"]');
  if (navItem) navItem.classList.add('nav-item-active');

  const homeEl = document.getElementById('icon-home');
  const histEl = document.getElementById('icon-history');

  if (name === 'home') {
    if (homeEl && ICONS.homeActive) homeEl.src = ICONS.homeActive;
    if (histEl && ICONS.historyInactive) histEl.src = ICONS.historyInactive;
    applyHomeCardImages();      // refresh images + entrance animation
    scheduleHomeIdleWave();     // start idle timer for wave
  } else if (name === 'history') {
    if (homeEl && ICONS.homeInactive) homeEl.src = ICONS.homeInactive;
    if (histEl && ICONS.historyActive) histEl.src = ICONS.historyActive;
    clearHomeIdleWave();        // stop idle when leaving home
    renderHistory();
  } else {
    // any other future screen → just clear idle wave
    clearHomeIdleWave();
  }
}

/* ---------------------------------------------------
   Random Prompt Selection
--------------------------------------------------- */

function pickRandomPrompts(count) {
  const pool = getPromptPool().slice();
  const selected = [];
  while (pool.length && selected.length < count) {
    const i = Math.floor(Math.random() * pool.length);
    selected.push(pool.splice(i, 1)[0]);
  }
  return selected;
}

// ---------------------------------------------------
// Swipe up to select a card (Selection screen)
// ---------------------------------------------------
function attachSwipeUpToCard(card, index) {
  if (!card || card._swipeHandlerAttached) return;

  let touchStartY = null;
  let touchStartX = null;

  card.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    touchStartY = t.clientY;
    touchStartX = t.clientX;
  }, { passive: true });

  card.addEventListener('touchend', (e) => {
    if (touchStartY === null) return;

    const t  = e.changedTouches[0];
    const dy = touchStartY - t.clientY;
    const dx = Math.abs(t.clientX - touchStartX);

    // Mostly-vertical upward swipe, ~40px+
    if (dy > 40 && dy > dx) {
      choosePrompt(index);  // same flow as tap
    }

    touchStartY = null;
    touchStartX = null;
  });

  // Prevent double-binding if we re-populate cards
  card._swipeHandlerAttached = true;
}

// ---------------------------------------------------
// Center the middle selection card in the viewport
// ---------------------------------------------------
function centerSelectionOnMiddle() {
  const container = document.getElementById('selectionCards');
  if (!container) return;

  // middle card is data-index="1"
  const middle = container.querySelector('.selection-card[data-index="1"]');
  if (!middle) return;

  const cardWidth       = middle.offsetWidth;
  const cardLeft        = middle.offsetLeft;
  const containerWidth  = container.clientWidth;

  // scroll so the card’s center lines up with the container’s center
  const targetScroll =
    cardLeft - (containerWidth / 2 - cardWidth / 2);

  container.scrollLeft = Math.max(0, targetScroll);
}

function populateSelectionCards() {
  const cards = document.querySelectorAll('.selection-card');
  cards.forEach(card => {
    const index = parseInt(card.getAttribute('data-index'));
    const prompt = currentSelection[index];
    const tagEl = card.querySelector('.prompt-tag');
    const textEl = card.querySelector('.prompt-text');

    if (!prompt) {
      card.style.display = 'none';
      return;
    }

    card.style.display = 'flex';

    // text
    textEl.textContent = prompt.text;

    // tag pill (uses tagKey or infers from tag)
    const tagKey = applySelectionTag(tagEl, prompt);

    // card gradient class uses the same key
    const keyForCard = (tagKey || 'life').toLowerCase();
    card.className = 'prompt-card selection-card card-' + keyForCard;

    attachSwipeUpToCard(card, index);
  });
}

function prepareSelection() {
  currentSelection = pickRandomPrompts(3);
  populateSelectionCards();

  const container = document.getElementById('selectionCards');
  if (container) {
    container.classList.remove('fade-in');
    void container.offsetWidth;
    container.classList.add('fade-in');
  }

  // Center after the screen is visible & layout has settled
  setTimeout(() => {
    centerSelectionOnMiddle();
  }, 0);
}

function reshuffleSelection() {
  prepareSelection();
}

/* ---------------------------------------------------
   HOME Shuffle → Selection Transition
--------------------------------------------------- */

function onSpin() {
  clearHomeIdleWave(); 
  const stack = document.getElementById('cardStack');
  stack.classList.add('shuffling');

  setTimeout(() => {
    stack.classList.remove('shuffling');
    showScreen('select');   // make selection screen visible first
    prepareSelection();     // then populate + center in next tick
  }, 500);
}

/* ---------------------------------------------------
   Selection → View
--------------------------------------------------- */

function choosePrompt(index) {
  const card = document.querySelector('.selection-card[data-index="' + index + '"]');
  const overlay = document.getElementById('whiteTransition');

  currentPrompt = currentSelection[index];
  if (!currentPrompt) return;

  // Prepare VIEW screen content, but don't show yet
  const tagEl  = document.getElementById('view-tag');
  const textEl = document.getElementById('view-text');
  const innerEl = document.getElementById('view-inner');

  if (textEl) {
    textEl.textContent = currentPrompt.text;
  }

  // tag pill on VIEW screen
  applyViewTag(currentPrompt);

  if (innerEl) {
    const key = (currentPrompt.tagKey || inferTagKey(currentPrompt.tag) || 'life').toLowerCase();
    innerEl.className = 'view-inner card-' + key;
  }

  // If we can't find the card for some reason, just jump straight to view
  if (!card) {
    if (overlay) {
      // still give a white flash even if card isn't found
      overlay.classList.remove('active');
      void overlay.offsetWidth;
      overlay.classList.add('active');
      setTimeout(() => showScreen('view'), 450);
    } else {
      showScreen('view');
    }
    return;
  }

  // Start the zoom animation on the selected card
  card.classList.add('animate-to-view');

  // Trigger white flash overlay
  if (overlay) {
    overlay.classList.remove('active');  // reset so animation can replay
    void overlay.offsetWidth;           // force reflow
    overlay.classList.add('active');
  }

  // After a short delay, switch to VIEW while white flash is still active
  setTimeout(() => {
    card.classList.remove('animate-to-view');
    showScreen('view');
  }, 220);  // ~mid-zoom; white overlay continues for the rest of its animation
}

/* ---------------------------------------------------
   Toast Utility
--------------------------------------------------- */

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('visible');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('visible');
  }, 2000);
}

/* ---------------------------------------------------
   History Rendering
--------------------------------------------------- */

function renderHistory() {
  const listEl    = document.getElementById('history-list');
  const emptyEl   = document.getElementById('history-empty');
  const clearBtn  = document.getElementById('history-clear-all');
  const exportWrap = document.getElementById('history-export-wrap');

  if (!listEl || !emptyEl) return;

  // No history yet
  if (!historyEntries.length) {
    listEl.innerHTML = '';
    emptyEl.style.display = 'flex';          // show empty state
    if (clearBtn)  clearBtn.style.display  = 'none';
    if (exportWrap) exportWrap.style.display = 'none';
    return;
  }

  // We have history
  emptyEl.style.display = 'none';
  if (exportWrap) exportWrap.style.display = 'flex';

  if (clearBtn) {
    // Only show "CLEAR ALL" when we have more than one entry
    clearBtn.style.display = (historyEntries.length > 1) ? 'inline-flex' : 'none';
  }

  listEl.innerHTML = '';

  historyEntries.forEach((entry, index) => {
    const tagKey = (entry.tagKey || inferTagKey(entry.tag)).toLowerCase();

    const cardHtml = `
      <div class="history-card card-${tagKey}">
        <div class="history-card-header">
          <div class="history-date">${entry.date}</div>
          <button class="history-delete-btn" onclick="confirmDeletePrompt(${index})">
            <img src="${ICONS.delete || ''}" alt="Delete">
          </button>
        </div>
        <div class="history-tag tag-${tagKey}">${(entry.tag || '').toUpperCase()}</div>
        <div class="history-text">${entry.text}</div>
      </div>
    `;
    listEl.insertAdjacentHTML('beforeend', cardHtml);
  });
}

/* ---------------------------------------------------
   History Delete / Clear (with confirm modal)
--------------------------------------------------- */

let confirmState = { mode: null, index: null };

function confirmDeletePrompt(index) {
  confirmState.mode = 'single';
  confirmState.index = index;

  const modal = document.getElementById('confirm-modal');
  const msg = document.getElementById('confirm-message');
  const ok = document.getElementById('confirm-ok');

  if (!modal || !msg || !ok) return;

  msg.textContent = 'Delete this prompt from history?';
  ok.textContent = 'Delete';
  modal.classList.add('visible');
}

function confirmClearAll() {
  if (!historyEntries.length) return;

  confirmState.mode = 'all';
  confirmState.index = null;

  const modal = document.getElementById('confirm-modal');
  const msg = document.getElementById('confirm-message');
  const ok = document.getElementById('confirm-ok');

  if (!modal || !msg || !ok) return;

  msg.textContent = 'Delete all prompts from history?';
  ok.textContent = 'Delete All';
  modal.classList.add('visible');
}

function cancelConfirm() {
  const modal = document.getElementById('confirm-modal');
  if (modal) modal.classList.remove('visible');
  confirmState = { mode: null, index: null };
}

function confirmOk() {
  const modal = document.getElementById('confirm-modal');

  if (confirmState.mode === 'single' && confirmState.index != null) {
    historyEntries.splice(confirmState.index, 1);
    saveHistory();
    renderHistory();
  } else if (confirmState.mode === 'all') {
    historyEntries = [];
    saveHistory();
    renderHistory();
  }

  if (modal) modal.classList.remove('visible');
  confirmState = { mode: null, index: null };
}

/* ---------------------------------------------------
   History Export → CSV  (hidden textarea copy)
--------------------------------------------------- */
function exportHistory() {
  if (!historyEntries.length) {
    showToast('no history to export');
    return;
  }

  const header = ['Date', 'Tag', 'Prompt'];
  const rows = historyEntries.map(e => {
    const date = (e.date || '').replace(/"/g, '""');
    const tag  = (e.tag  || '').replace(/"/g, '""');
    const text = (e.text || '').replace(/"/g, '""');
    return `"${date}","${tag}","${text}"`;
  });

  const csv = header.join(',') + '\n' + rows.join('\n');

  // Create a hidden textarea and use execCommand('copy')
  const ta = document.createElement('textarea');
  ta.value = csv;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  ta.style.pointerEvents = 'none';

  document.body.appendChild(ta);
  ta.focus();
  ta.select();

  try {
    const ok = document.execCommand('copy');
    if (ok) {
      showToast('Copied to Clipboard \uD83D\uDCCB');
    } else {
      // Fallback: show raw CSV so user can long-press + copy
      alert(csv);
    }
  } catch (err) {
    console.log('Clipboard export failed', err);
    alert(csv);
  } finally {
    document.body.removeChild(ta);
  }
}

/* ---------------------------------------------------
   Finish Prompt → Add to history
--------------------------------------------------- */

function inferTagKey(tag) {
  const t = (tag || "").toLowerCase();
  if (t.includes("trip")) return "trip";
  if (t.includes("ghibli")) return "ghibli";
  return "life";
}

function onViewTouchStart(e) {
  if (viewFinishing) return;
  if (!e.touches || e.touches.length === 0) return;

  viewSwipeStartY = e.touches[0].clientY;
  viewSwipeActive = true;
}

function onViewTouchMove(e) {
  if (!viewSwipeActive || viewFinishing) return;
  if (!e.touches || e.touches.length === 0) return;

  // You could add visual feedback here later if you want
}

function onViewTouchEnd(e) {
  if (!viewSwipeActive || viewFinishing) {
    viewSwipeActive = false;
    viewSwipeStartY = null;
    return;
  }

  const threshold = 80; // px of upward movement required

  let endY = viewSwipeStartY;
  if (e.changedTouches && e.changedTouches.length > 0) {
    endY = e.changedTouches[0].clientY;
  }

  const deltaY = viewSwipeStartY - endY; // positive if user swiped up

  if (deltaY > threshold) {
    // Trigger the same behavior as tapping the swipe button
    finishPrompt();
  }

  viewSwipeActive = false;
  viewSwipeStartY = null;
}

function completeFinishPrompt() {
  if (currentPrompt) {
    // 1. Pretty date for display
    const prettyDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    // 2. Add to in-memory history (newest first)
    const key = (currentPrompt.tagKey || inferTagKey(currentPrompt.tag) || 'life').toLowerCase();
    const meta = TAG_META[key];

    historyEntries.unshift({
      id: Date.now(),
      text: currentPrompt.text,
      tag: currentPrompt.tag || (meta ? meta.label : key.toUpperCase()),
      tagKey: key,
      date: prettyDate
    });

    // 3. Persist + refresh History UI + toast
    saveHistory();
    renderHistory();
    showToast("prompt added to history \u2728");
  }

  // 4. Go back to Home
  switchScreen('home');
}

function finishPrompt() {
  if (viewFinishing) return;
  viewFinishing = true;

  const viewInner = document.getElementById('view-inner');

  if (viewInner) {
    viewInner.classList.remove('fly-out');
    void viewInner.offsetWidth; // reflow
    viewInner.classList.add('fly-out');

    setTimeout(() => {
      completeFinishPrompt();
      viewInner.classList.remove('fly-out');
      viewFinishing = false;
    }, 450); // keep in sync with viewFlyOut duration
  } else {
    completeFinishPrompt();
    viewFinishing = false;
  }
}

/* ---------------------------------------------------
   Key Button Placeholder
--------------------------------------------------- */
function openCodeScreen() {
  alert("Code entry screen coming soon.");
}

/* ---------------------------------------------------
   DOM Ready
--------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  loadPromptsFromJson();
  applyHomeCardImages();
  applyIconsAndHeader();
  loadHistory();
  scheduleHomeIdleWave();
});

// Service worker registration for offline support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .catch((err) => {
        console.log("SW registration failed:", err);
      });
  });
}