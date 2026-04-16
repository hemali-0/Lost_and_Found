// =============================================
//  FOUND_ — Campus Lost & Found
//  app.js
// =============================================

// --- EMOJI MAP BY CATEGORY ---
const EMOJIS = {
  'Electronics':       '📱',
  'Bag / Backpack':    '🎒',
  'ID / Cards':        '💳',
  'Keys':              '🔑',
  'Books / Stationery':'📚',
  'Clothing':          '👕',
  'Accessories':       '⌚',
  'Sports Equipment':  '⚽',
  'Other':             '📦',
};

// --- SAMPLE DATA ---
let items = [
  {
    id: 1, type: 'lost',
    name: 'iPhone 13 (Black)',
    desc: 'Black case with a small crack on the back. Has stickers on the case.',
    location: 'Main Library', category: 'Electronics',
    date: '2 hours ago', contact: 'rahul.s@college.edu', resolved: false,
  },
  {
    id: 2, type: 'found',
    name: 'Blue Water Bottle',
    desc: 'Steel blue bottle with a college sticker. Found near the staircase.',
    location: 'Lecture Hall Block A', category: 'Other',
    date: '3 hours ago', contact: '9876543210', resolved: false,
  },
  {
    id: 3, type: 'lost',
    name: 'Student ID Card',
    desc: 'Belongs to year 2, CSE department. Name should be visible.',
    location: 'Canteen / Cafeteria', category: 'ID / Cards',
    date: '5 hours ago', contact: 'priya.m@college.edu', resolved: false,
  },
  {
    id: 4, type: 'found',
    name: 'Set of Keys (4 keys)',
    desc: 'Keychain with a small red charm. Found on a bench outside.',
    location: 'Sports Ground', category: 'Keys',
    date: 'Yesterday', contact: 'arjun.k@college.edu', resolved: true,
  },
  {
    id: 5, type: 'lost',
    name: 'Grey Backpack',
    desc: 'Dell laptop inside, notebooks, water bottle. Very important, please help!',
    location: 'Computer Lab', category: 'Bag / Backpack',
    date: 'Yesterday', contact: '9988776655', resolved: false,
  },
  {
    id: 6, type: 'found',
    name: 'Scientific Calculator',
    desc: 'Casio FX-991EX. Name written faintly inside the cover.',
    location: 'Lecture Hall Block B', category: 'Books / Stationery',
    date: '2 days ago', contact: 'sneha.p@college.edu', resolved: false,
  },
  {
    id: 7, type: 'lost',
    name: 'Earphones (White)',
    desc: 'Apple AirPods in white case. Possibly left in canteen or library.',
    location: 'Main Library', category: 'Electronics',
    date: '2 days ago', contact: 'vikram.r@college.edu', resolved: false,
  },
  {
    id: 8, type: 'found',
    name: 'Denim Jacket',
    desc: 'Blue denim jacket, medium size. Left on a chair in the seminar hall.',
    location: 'Admin Block', category: 'Clothing',
    date: '3 days ago', contact: '9123456789', resolved: false,
  },
];

// --- STATE ---
let currentFilter = 'all';
let currentType   = 'lost';

// =============================================
//  RENDER
// =============================================
function renderItems(data) {
  const grid  = document.getElementById('items-grid');
  const noRes = document.getElementById('no-results');

  grid.innerHTML = '';

  if (data.length === 0) {
    noRes.style.display = 'block';
    document.getElementById('result-count').textContent = '0 items';
    return;
  }

  noRes.style.display = 'none';
  document.getElementById('result-count').textContent =
    `${data.length} item${data.length !== 1 ? 's' : ''}`;

  data.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = `item-card ${item.type}${item.resolved ? ' resolved' : ''}`;
    card.style.animationDelay = `${i * 0.05}s`;

    card.innerHTML = `
      ${item.resolved ? '<span class="resolved-badge">Reunited ✓</span>' : ''}
      <span class="item-emoji">${EMOJIS[item.category] || '📦'}</span>
      <span class="item-tag ${item.type}">${item.type}</span>
      <div class="item-title">${item.name}</div>
      <div class="item-desc">${item.desc}</div>
      <div class="item-meta">
        <span class="item-location">📍 ${item.location}</span>
        <span class="item-date">${item.date}</span>
      </div>
    `;

    card.addEventListener('click', () => openContact(item));
    grid.appendChild(card);
  });

  updateStats();
}

// =============================================
//  STATS
// =============================================
function updateStats() {
  const lost     = items.filter(i => i.type === 'lost'  && !i.resolved).length;
  const found    = items.filter(i => i.type === 'found' && !i.resolved).length;
  const resolved = items.filter(i => i.resolved).length;

  animateNum('stat-total',    items.length);
  animateNum('stat-lost',     lost);
  animateNum('stat-found',    found);
  animateNum('stat-resolved', resolved);
}

function animateNum(id, target) {
  const el   = document.getElementById(id);
  let   cur  = 0;
  const step = Math.ceil(target / 20);
  const t    = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur;
    if (cur >= target) clearInterval(t);
  }, 40);
}

// =============================================
//  FILTER & SEARCH
// =============================================
function filterItems() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  let data = items;

  if (currentFilter !== 'all') {
    data = data.filter(i => i.type === currentFilter);
  }

  if (q) {
    data = data.filter(i =>
      i.name.toLowerCase().includes(q)     ||
      i.desc.toLowerCase().includes(q)     ||
      i.location.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q)
    );
  }

  renderItems(data);
}

function setFilter(f) {
  currentFilter = f;

  ['all', 'lost', 'found'].forEach(x => {
    const btn = document.getElementById(`btn-${x}`);
    btn.className = 'filter-btn';
    if (x === f) btn.className += ` active-${x}`;
  });

  filterItems();
}

// =============================================
//  REPORT MODAL
// =============================================
function openReport() {
  document.getElementById('reportModal').classList.add('open');
}

function closeReport() {
  document.getElementById('reportModal').classList.remove('open');
}

function setType(t) {
  currentType = t;
  document.getElementById('typeLost').className  = 'type-btn' + (t === 'lost'  ? ' lost-active'  : '');
  document.getElementById('typeFound').className = 'type-btn' + (t === 'found' ? ' found-active' : '');
}

function submitReport() {
  const name     = document.getElementById('f-name').value.trim();
  const desc     = document.getElementById('f-desc').value.trim();
  const location = document.getElementById('f-location').value;
  const category = document.getElementById('f-category').value;
  const contact  = document.getElementById('f-contact').value.trim();

  if (!name || !location || !contact) {
    showToast('Please fill all required fields!', '#f54242');
    return;
  }

  const newItem = {
    id: Date.now(),
    type: currentType,
    name, desc, location, category,
    date: 'Just now',
    contact,
    resolved: false,
  };

  items.unshift(newItem);
  closeReport();
  filterItems();
  showToast('Report submitted successfully!');

  // Reset form
  ['f-name', 'f-desc', 'f-contact'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('f-location').value = '';
}

// =============================================
//  CONTACT MODAL
// =============================================
function openContact(item) {
  const tagStyle = item.type === 'lost'
    ? 'background:rgba(245,66,66,0.15); color:#f54242;'
    : 'background:rgba(66,245,161,0.12); color:#42f5a1;';

  document.getElementById('contact-detail').innerHTML = `
    <div style="display:flex; align-items:flex-start; gap:1rem; margin-bottom:1.25rem;">
      <span style="font-size:2.5rem">${EMOJIS[item.category] || '📦'}</span>
      <div>
        <span style="font-family:'Space Mono',monospace; font-size:0.6rem; letter-spacing:0.15em;
          text-transform:uppercase; padding:0.2rem 0.6rem; display:inline-block;
          margin-bottom:0.4rem; ${tagStyle}">${item.type}</span>
        <div style="font-size:1.1rem; font-weight:700; margin-bottom:0.25rem;">${item.name}</div>
        <div style="font-family:'Space Mono',monospace; font-size:0.7rem; color:var(--muted);">
          📍 ${item.location} · ${item.date}
        </div>
      </div>
    </div>
    <div style="font-size:0.85rem; color:var(--muted); line-height:1.6; margin-bottom:1rem;">
      ${item.desc || 'No description provided.'}
    </div>
  `;

  document.getElementById('contact-info').textContent = item.contact;
  document.getElementById('contactModal').classList.add('open');
}

function closeContact() {
  document.getElementById('contactModal').classList.remove('open');
}

// Close modals when clicking overlay background
document.querySelectorAll('.modal-overlay').forEach(el => {
  el.addEventListener('click', e => {
    if (e.target === el) el.classList.remove('open');
  });
});

// =============================================
//  TOAST
// =============================================
function showToast(msg, color = 'var(--found-color)') {
  const t = document.getElementById('toast');
  t.textContent    = msg;
  t.style.background = color;
  t.style.color    = color === 'var(--found-color)' ? '#000' : '#fff';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// =============================================
//  INIT
// =============================================
renderItems(items);
