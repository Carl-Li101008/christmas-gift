/* ============================================================
   MERRY & BRIGHT — 圣诞礼物交换所
   A tiny, self-contained Christmas universe.
   ============================================================ */

'use strict';

/* ------------------------------------------------------------
   01. Data
   ------------------------------------------------------------ */

const STORE_KEY = 'merry-bright-v1';
const MAX_TREE_SLOTS = 14;

let state = null;

const ANIMALS = [
  { id: 'fox', emoji: '🦊', name: '小狐狸', vibe: '鬼灵精，嘴硬心软', orb: '#efbd8a', orbDark: '#a8673e', bow: '#e8423f' },
  { id: 'rabbit', emoji: '🐰', name: '雪兔', vibe: '耳朵先听见冬天', orb: '#f6d9db', orbDark: '#bd8b93', bow: '#e46c86' },
  { id: 'bear', emoji: '🐻', name: '棕熊', vibe: '看起来凶，其实想抱抱', orb: '#d5a06e', orbDark: '#8f5c36', bow: '#c47b3d' },
  { id: 'penguin', emoji: '🐧', name: '企鹅', vibe: '走路摇摇摆摆，心里有数', orb: '#b9d9ee', orbDark: '#557c9b', bow: '#4d8bb5' },
  { id: 'deer', emoji: '🦌', name: '小鹿', vibe: '把星光顶在脑袋上', orb: '#e9c58e', orbDark: '#a4783f', bow: '#7fc7a2' },
  { id: 'panda', emoji: '🐼', name: '熊猫', vibe: '熬夜冠军，抱竹子专家', orb: '#e8e8ef', orbDark: '#a4a4b4', bow: '#5e6979' },
  { id: 'cat', emoji: '🐱', name: '小猫', vibe: '看心情亲近你', orb: '#f2cda3', orbDark: '#b27c48', bow: '#e8a04b' },
  { id: 'dog', emoji: '🐶', name: '小狗', vibe: '一叫名字就摇成螺旋桨', orb: '#e8c192', orbDark: '#a76d3f', bow: '#d7723b' },
  { id: 'sheep', emoji: '🐑', name: '小羊', vibe: '云朵成精，软乎乎', orb: '#f7edf1', orbDark: '#bda8b4', bow: '#e7a9c0' },
  { id: 'hamster', emoji: '🐹', name: '仓鼠', vibe: '腮帮子里藏了三颗糖', orb: '#f1cdb2', orbDark: '#b37d5e', bow: '#e29477' },
  { id: 'owl', emoji: '🦉', name: '猫头鹰', vibe: '夜间巡逻，顺便看星星', orb: '#c1b2de', orbDark: '#766594', bow: '#8a72bf' },
  { id: 'tiger', emoji: '🐯', name: '小老虎', vibe: '奶凶奶凶，超好哄', orb: '#f1c183', orbDark: '#b17b34', bow: '#de7e35' },
  { id: 'unicorn', emoji: '🦄', name: '独角兽', vibe: '愿望批发商，偶尔失灵', orb: '#e6c7f0', orbDark: '#9b6eae', bow: '#c67fd6' },
  { id: 'koala', emoji: '🐨', name: '考拉', vibe: '慢半拍，但很认真', orb: '#d3d5df', orbDark: '#8f93a4', bow: '#7d93a8' },
  { id: 'frog', emoji: '🐸', name: '小青蛙', vibe: '雨天限定快乐冠军', orb: '#c2df9f', orbDark: '#78954d', bow: '#6c9b45' },
  { id: 'seal', emoji: '🦭', name: '海豹', vibe: '肚皮很软，心事很少', orb: '#cbd8e8', orbDark: '#8296ae', bow: '#7296b0' }
];

const ANIMAL_MAP = new Map(ANIMALS.map((animal) => [animal.id, animal]));

const GIFT_TYPES = [
  { id: 'cocoa', emoji: '☕', label: '热可可' },
  { id: 'letter', emoji: '💌', label: '手写信' },
  { id: 'scarf', emoji: '🧣', label: '针织围巾' },
  { id: 'vinyl', emoji: '🎵', label: '圣诞唱片' },
  { id: 'cookie', emoji: '🍪', label: '姜饼' },
  { id: 'plant', emoji: '🌿', label: '小盆栽' }
];

const GIFT_TYPE_MAP = new Map(GIFT_TYPES.map((type) => [type.id, type]));
const GIFT_THEMES = ['velvet', 'midnight', 'ginger'];

const QUIZ_QUESTIONS = [
  {
    id: 'eve',
    q: '圣诞夜最想怎么过？',
    options: [
      { emoji: '🛋️', label: '窝在沙发看老电影' },
      { emoji: '🎄', label: '出门看一整条街的灯' },
      { emoji: '🎁', label: '和重要的人交换礼物' },
      { emoji: '🍪', label: '在厨房烤饼干' }
    ]
  },
  {
    id: 'gift',
    q: '收到哪种礼物最开心？',
    options: [
      { emoji: '💌', label: '一封手写长信' },
      { emoji: '🧤', label: '实用又可爱的小物' },
      { emoji: '🕯️', label: '香香的蜡烛' },
      { emoji: '🎟️', label: '一起出门的惊喜行程' }
    ]
  },
  {
    id: 'cocoa',
    q: '热可可里一定要加什么？',
    options: [
      { emoji: '☁️', label: '很多棉花糖' },
      { emoji: '🍦', label: '高高的奶油雪顶' },
      { emoji: '🪵', label: '一点点肉桂粉' },
      { emoji: '☕', label: '什么都不加' }
    ]
  },
  {
    id: 'topper',
    q: '圣诞树顶要放什么？',
    options: [
      { emoji: '⭐', label: '金色星星' },
      { emoji: '👼', label: '小天使' },
      { emoji: '☃️', label: '雪人' },
      { emoji: '🐾', label: '一只小动物' }
    ]
  },
  {
    id: 'snow',
    q: '下雪天第一反应是？',
    options: [
      { emoji: '❄️', label: '冲出去踩第一脚雪' },
      { emoji: '📸', label: '举起手机拍照' },
      { emoji: '🛏️', label: '缩回被窝再睡一会' },
      { emoji: '🍷', label: '煮一锅热红酒' }
    ]
  },
  {
    id: 'company',
    q: '最想和谁一起过圣诞？',
    options: [
      { emoji: '💗', label: '喜欢的人' },
      { emoji: '🏠', label: '家人' },
      { emoji: '🫂', label: '最好的朋友' },
      { emoji: '🐈', label: '一只猫' }
    ]
  }
];

const DEMO_HOST = {
  name: '小鹿',
  animalId: 'deer',
  answers: [1, 0, 0, 3, 2, 0],
  source: 'demo',
  tree: [
    { animalId: 'deer', name: '小鹿' },
    { animalId: 'penguin', name: 'Momo' }
  ]
};

// Ordered so that the first few arrivals are spread across the tree,
// rather than all bunching up on the top branches.
const TREE_SLOTS = [
  { x: 50, y: 44.3 },
  { x: 34.3, y: 70.8 },
  { x: 66.5, y: 71.5 },
  { x: 41.5, y: 58.6 },
  { x: 57.4, y: 59.6 },
  { x: 50, y: 29.4 },
  { x: 39.7, y: 37.1 },
  { x: 60.8, y: 38.6 },
  { x: 21.2, y: 78.6 },
  { x: 72.3, y: 55.7 },
  { x: 38.7, y: 82.6 },
  { x: 62, y: 83.1 },
  { x: 27.2, y: 55.2 },
  { x: 50.4, y: 73.7 }
];

const WISH_TONES = [
  { bg: 'rgba(255, 158, 196, .14)', ink: '#ffdce8', rot: '-1.4deg' },
  { bg: 'rgba(127, 209, 174, .13)', ink: '#d9faed', rot: '1.1deg' },
  { bg: 'rgba(255, 211, 77, .13)', ink: '#ffefb8', rot: '-0.8deg' },
  { bg: 'rgba(142, 197, 255, .14)', ink: '#dceeff', rot: '1.6deg' },
  { bg: 'rgba(255, 255, 255, .07)', ink: '#e6ebf7', rot: '-1deg' }
];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------
   02. Utility
   ------------------------------------------------------------ */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function icon(name) {
  return `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
}

function uid(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getAnimal(id) {
  return ANIMAL_MAP.get(id) || ANIMALS[0];
}

function getGiftType(id) {
  return GIFT_TYPE_MAP.get(id) || GIFT_TYPES[0];
}

function normalizeTheme(theme) {
  return GIFT_THEMES.includes(theme) ? theme : 'velvet';
}

function formatShortDate(timestamp) {
  const date = new Date(timestamp || Date.now());
  return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

function firstFreeSlot(entries = []) {
  const used = new Set(entries.map((entry) => entry.slot));
  for (let index = 0; index < MAX_TREE_SLOTS; index += 1) {
    if (!used.has(index)) return index;
  }
  return -1;
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

/* ------------------------------------------------------------
   03. Seeds + state
   ------------------------------------------------------------ */

function seedGifts() {
  const now = Date.now();
  return [
    {
      id: 'seed-snow',
      fromName: '小雪',
      toName: '你',
      anonymous: false,
      message: '圣诞快乐！今年也要一起在雪里踩出第一串脚印。',
      giftType: 'letter',
      theme: 'velvet',
      createdAt: now - 1000 * 60 * 52,
      dateLabel: '12.24',
      opened: false,
      seed: true
    },
    {
      id: 'seed-ginger',
      fromName: '一位神秘的朋友',
      toName: '你',
      anonymous: true,
      message: '偷偷把一块姜饼放在你门口。别问我是谁，问就是圣诞老人。',
      giftType: 'cookie',
      theme: 'ginger',
      createdAt: now - 1000 * 60 * 33,
      dateLabel: '12.24',
      opened: false,
      seed: true
    },
    {
      id: 'seed-momo',
      fromName: 'Momo',
      toName: '你',
      anonymous: false,
      message: '把你写进今年的圣诞歌单里了，循环播放那种。',
      giftType: 'vinyl',
      theme: 'midnight',
      createdAt: now - 1000 * 60 * 17,
      dateLabel: '12.25',
      opened: false,
      seed: true
    }
  ];
}

function seedWishes() {
  return [
    { id: 'w-seed-1', name: '阿团', text: '希望今年冬天，有人愿意陪我吃烤红薯。', tone: 0 },
    { id: 'w-seed-2', name: 'Momo', text: '想要一场不用赶时间的雪。', tone: 3 },
    { id: 'w-seed-3', name: '匿名', text: '希望重要的人都能平平安安。', tone: 1 },
    { id: 'w-seed-4', name: '小雪', text: '圣诞袜里能长出一只不会掉毛的猫。', tone: 2 },
    { id: 'w-seed-5', name: '冬冬', text: '想和喜欢的人交换一份笨拙但认真的礼物。', tone: 0 },
    { id: 'w-seed-6', name: '一颗星星', text: '今年也要相信，好事会在雪停之前发生。', tone: 4 }
  ];
}

function defaultState() {
  return {
    profile: null,
    tree: [],
    gifts: seedGifts(),
    wishes: seedWishes(),
    hostAnswers: null,
    guestResults: [],
    sound: true,
    liteMotion: false
  };
}

function normalizeGift(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const typeId = GIFT_TYPE_MAP.has(raw.giftType) ? raw.giftType : 'letter';
  const anonymous = Boolean(raw.anonymous);
  const fromName = String(raw.fromName || '一位神秘的朋友').slice(0, 24);
  const toName = String(raw.toName || '你').slice(0, 24);
  const message = String(raw.message || '').slice(0, 120);
  if (!message) return null;
  return {
    id: String(raw.id || uid('g')),
    fromName,
    toName,
    anonymous,
    message,
    giftType: typeId,
    theme: normalizeTheme(raw.theme),
    createdAt: Number(raw.createdAt) || Date.now(),
    dateLabel: raw.dateLabel ? String(raw.dateLabel).slice(0, 8) : '',
    opened: Boolean(raw.opened),
    shared: Boolean(raw.shared),
    seed: Boolean(raw.seed)
  };
}

function normalizeWish(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const text = String(raw.text || '').trim().slice(0, 64);
  if (!text) return null;
  return {
    id: String(raw.id || uid('w')),
    name: String(raw.name || '匿名').slice(0, 20),
    text,
    tone: clamp(Number(raw.tone) || 0, 0, WISH_TONES.length - 1)
  };
}

function normalizeTree(tree, profile) {
  const entries = [];
  const seenAnimals = new Set();
  (Array.isArray(tree) ? tree : []).forEach((raw) => {
    if (!raw || !ANIMAL_MAP.has(raw.animalId) || seenAnimals.has(raw.animalId)) return;
    seenAnimals.add(raw.animalId);
    entries.push({
      id: String(raw.id || uid('tree')),
      animalId: raw.animalId,
      name: String(raw.name || getAnimal(raw.animalId).name).slice(0, 20),
      isMe: Boolean(raw.isMe),
      source: raw.source === 'invite' ? 'invite' : 'local',
      slot: Number.isInteger(raw.slot) ? raw.slot : -1,
      addedAt: Number(raw.addedAt) || Date.now()
    });
  });

  // Every entry needs its own stable, non-overlapping slot.
  const usedSlots = new Set();
  entries.forEach((entry) => {
    if (entry.slot < 0 || entry.slot >= MAX_TREE_SLOTS || usedSlots.has(entry.slot)) {
      entry.slot = -1;
    } else {
      usedSlots.add(entry.slot);
    }
  });
  entries.forEach((entry) => {
    if (entry.slot === -1) {
      const slot = firstFreeSlot(entries.filter((item) => item.slot >= 0));
      entry.slot = slot === -1 ? 0 : slot;
      usedSlots.add(entry.slot);
    }
  });

  if (profile) {
    const me = entries.find((entry) => entry.isMe) || entries.find((entry) => entry.animalId === profile.animalId);
    if (me) {
      me.animalId = profile.animalId;
      me.name = profile.name;
      me.isMe = true;
    } else if (entries.length < MAX_TREE_SLOTS) {
      entries.push({
        id: uid('tree'),
        animalId: profile.animalId,
        name: profile.name,
        isMe: true,
        source: 'local',
        slot: firstFreeSlot(entries),
        addedAt: Date.now()
      });
    }
    entries.sort((a, b) => Number(b.isMe) - Number(a.isMe) || a.slot - b.slot);
  } else {
    entries.sort((a, b) => a.slot - b.slot);
  }
  return entries.slice(0, MAX_TREE_SLOTS);
}

function loadState() {
  let raw = null;
  try {
    raw = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
  } catch (error) {
    raw = null;
  }

  const fallback = defaultState();
  if (!raw || typeof raw !== 'object') return fallback;

  const profile = raw.profile && ANIMAL_MAP.has(raw.profile.animalId)
    ? { name: String(raw.profile.name || '小满').slice(0, 12), animalId: raw.profile.animalId }
    : null;

  const gifts = Array.isArray(raw.gifts)
    ? raw.gifts.map(normalizeGift).filter(Boolean)
    : fallback.gifts;

  const wishes = Array.isArray(raw.wishes)
    ? raw.wishes.map(normalizeWish).filter(Boolean)
    : fallback.wishes;

  const answers = Array.isArray(raw.hostAnswers)
    && raw.hostAnswers.length === QUIZ_QUESTIONS.length
    && raw.hostAnswers.every((answer) => Number.isInteger(answer) && answer >= 0 && answer < 4)
    ? raw.hostAnswers.slice()
    : null;

  const guestResults = Array.isArray(raw.guestResults)
    ? raw.guestResults
      .filter((result) => result && Number.isFinite(Number(result.score)))
      .slice(-20)
      .map((result) => ({
        hostName: String(result.hostName || '').slice(0, 20),
        score: clamp(Number(result.score), 0, 100),
        at: Number(result.at) || Date.now()
      }))
    : [];

  return {
    profile,
    tree: normalizeTree(raw.tree, profile),
    gifts,
    wishes,
    hostAnswers: answers,
    guestResults,
    sound: raw.sound !== false,
    liteMotion: Boolean(raw.liteMotion)
  };
}

function saveState() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (error) {
    // A private-mode browser may refuse storage. The night still goes on.
  }
}

/* ------------------------------------------------------------
   04. Invite + gift links
   ------------------------------------------------------------ */

function encodeToken(payload) {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeToken(token) {
  try {
    const padded = token.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (token.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch (error) {
    return null;
  }
}

function readHash() {
  const hash = location.hash.replace(/^#/, '');
  if (!hash) return { invite: null, gift: null };
  const params = new URLSearchParams(hash);
  const inviteToken = params.get('invite');
  const giftToken = params.get('gift');
  return {
    invite: inviteToken ? decodeInvite(inviteToken) : null,
    gift: giftToken ? decodeGift(giftToken) : null
  };
}

function decodeInvite(token) {
  const data = decodeToken(token);
  if (!data || typeof data !== 'object' || !data.n || !ANIMAL_MAP.has(data.a)) return null;

  const answers = typeof data.q === 'string' && /^[0-3]{6}$/.test(data.q)
    ? data.q.split('').map(Number)
    : null;

  const tree = Array.isArray(data.t)
    ? data.t
      .slice(0, 12)
      .map((item) => {
        const animalId = Array.isArray(item) ? item[0] : item && item.a;
        const name = Array.isArray(item) ? item[1] : item && item.n;
        if (!ANIMAL_MAP.has(animalId)) return null;
        return { animalId, name: String(name || getAnimal(animalId).name).slice(0, 20) };
      })
      .filter(Boolean)
    : [];

  return {
    name: String(data.n).slice(0, 12),
    animalId: data.a,
    answers,
    tree,
    source: 'invite'
  };
}

function decodeGift(token) {
  const data = decodeToken(token);
  if (!data || typeof data !== 'object' || !data.g) return null;
  const raw = {
    id: String(data.g.i || uid('shared')),
    fromName: String(data.g.f || '一位神秘的朋友').slice(0, 24),
    toName: String(data.g.t || '你').slice(0, 24),
    anonymous: Boolean(data.g.a),
    message: String(data.g.m || '').slice(0, 120),
    giftType: GIFT_TYPE_MAP.has(data.g.k) ? data.g.k : 'letter',
    theme: normalizeTheme(data.g.h),
    createdAt: Date.now(),
    opened: false,
    shared: true
  };
  if (!raw.message) return null;
  return normalizeGift(raw);
}

function buildInviteLink() {
  if (!state.profile) return location.href;
  const payload = {
    v: 1,
    n: state.profile.name,
    a: state.profile.animalId,
    q: state.hostAnswers ? state.hostAnswers.join('') : '',
    t: state.tree.slice(0, 12).map((entry) => [entry.animalId, entry.name])
  };
  return `${location.origin}${location.pathname}${location.search}#invite=${encodeToken(payload)}`;
}

function buildGiftLink(gift) {
  const payload = {
    v: 1,
    g: {
      i: gift.id,
      // An anonymous card stays anonymous even if someone decodes the link.
      f: gift.anonymous ? '' : gift.fromName,
      t: gift.toName,
      a: gift.anonymous,
      m: gift.message,
      k: gift.giftType,
      h: gift.theme
    }
  };
  return `${location.origin}${location.pathname}${location.search}#gift=${encodeToken(payload)}`;
}

function importSharedGift(gift) {
  if (!gift) return false;
  const importedId = `shared-${gift.id}`;
  if (state.gifts.some((item) => item.id === importedId || (item.shared && item.message === gift.message && item.fromName === gift.fromName))) {
    return false;
  }
  const imported = {
    ...gift,
    id: importedId,
    createdAt: Date.now(),
    opened: false,
    shared: true
  };
  state.gifts.push(imported);
  state.gifts = state.gifts.slice(-40);
  saveState();
  return true;
}

/* ------------------------------------------------------------
   05. Sound + snow + confetti
   ------------------------------------------------------------ */

let audioContext = null;

function ensureAudio() {
  if (!state || !state.sound) return null;
  try {
    if (!audioContext) {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) return null;
      audioContext = new Context();
    }
    if (audioContext.state === 'suspended') audioContext.resume();
    return audioContext;
  } catch (error) {
    return null;
  }
}

function tone(frequency, start, duration, options = {}) {
  const context = ensureAudio();
  if (!context) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const when = context.currentTime + start;
  oscillator.type = options.type || 'sine';
  oscillator.frequency.setValueAtTime(frequency, when);
  if (options.glide) {
    oscillator.frequency.exponentialRampToValueAtTime(options.glide, when + duration);
  }
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(options.volume || 0.035, when + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(when);
  oscillator.stop(when + duration + 0.05);
}

function playBell() {
  tone(880, 0, 0.25, { type: 'sine', volume: 0.035 });
  tone(1318.5, 0.06, 0.3, { type: 'triangle', volume: 0.022 });
}

function playJingle() {
  [659.25, 659.25, 659.25, 523.25, 659.25, 783.99].forEach((frequency, index) => {
    tone(frequency, index * 0.13, 0.18, { type: 'triangle', volume: 0.025 });
  });
  tone(1046.5, 0.85, 0.5, { type: 'sine', volume: 0.025 });
}

function playWhoosh() {
  tone(180, 0, 0.75, { type: 'sawtooth', volume: 0.009, glide: 760 });
  tone(90, 0.04, 0.9, { type: 'sine', volume: 0.018, glide: 220 });
}

function playPop() {
  tone(440, 0, 0.1, { type: 'sine', volume: 0.025, glide: 660 });
}

function initSnow() {
  const canvas = $('#snowfall');
  if (!canvas) return;
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;

  let width = 0;
  let height = 0;
  let stars = [];
  let flakes = [];
  let raf = null;
  let lastDraw = 0;
  let lastTime = performance.now();

  const build = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    const compact = width < 680;
    // Half-resolution-ish canvas: snowfall is soft, so extra DPR is wasted work.
    const dpr = Math.min(window.devicePixelRatio || 1, compact ? 1 : 1.35);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const starCount = compact ? 24 : 42;
    const flakeCount = compact ? 22 : 44;

    stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.78,
      size: Math.random() > 0.9 ? 2.2 : 1 + Math.random() * 1.2,
      alpha: 0.18 + Math.random() * 0.52,
      speed: 0.45 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2,
      warm: Math.random() > 0.78
    }));

    flakes = Array.from({ length: flakeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.8 + Math.random() * 2.1,
      speed: 14 + Math.random() * 36,
      drift: -5 + Math.random() * 10,
      phase: Math.random() * Math.PI * 2,
      wobble: 2 + Math.random() * 7,
      bright: Math.random() > 0.72
    }));
    lastTime = performance.now();
  };

  const draw = (now, force = false) => {
    if (!force && (document.hidden || document.body.classList.contains('is-locked'))) return;
    const interval = document.body.classList.contains('perf-lite') ? 66 : 32;
    if (!force && now - lastDraw < interval) return;
    const dt = Math.min(Math.max((now - lastTime) / 1000, 0.008), 0.06);
    lastDraw = now;
    lastTime = now;

    context.clearRect(0, 0, width, height);

    // Twinkling stars are drawn on the same canvas so there are no 78 CSS
    // animations / layers running in the background.
    for (let index = 0; index < stars.length; index += 1) {
      const star = stars[index];
      const twinkle = 0.58 + 0.42 * Math.sin(now * 0.001 * star.speed + star.phase);
      context.globalAlpha = star.alpha * twinkle;
      context.fillStyle = star.warm ? '#fff2c4' : '#ffffff';
      context.fillRect(star.x, star.y, star.size, star.size);
    }
    context.globalAlpha = 1;

    for (let index = 0; index < flakes.length; index += 1) {
      const flake = flakes[index];
      flake.phase += dt * 1.4;
      flake.y += flake.speed * dt;
      flake.x += (flake.drift + Math.sin(flake.phase) * flake.wobble) * dt;
      if (flake.y > height + 12) {
        flake.y = -12;
        flake.x = Math.random() * width;
      }
      if (flake.x < -15) flake.x = width + 15;
      if (flake.x > width + 15) flake.x = -15;
    }

    // One path for the distant snow, one for the brighter foreground flakes.
    context.beginPath();
    for (let index = 0; index < flakes.length; index += 1) {
      const flake = flakes[index];
      if (flake.bright) continue;
      context.moveTo(flake.x + flake.r, flake.y);
      context.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
    }
    context.fillStyle = 'rgba(255, 249, 238, 0.48)';
    context.fill();

    context.beginPath();
    for (let index = 0; index < flakes.length; index += 1) {
      const flake = flakes[index];
      if (!flake.bright) continue;
      context.moveTo(flake.x + flake.r, flake.y);
      context.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
    }
    context.fillStyle = 'rgba(255, 252, 244, 0.82)';
    context.fill();
  };

  const tick = (now) => {
    draw(now);
    raf = window.requestAnimationFrame(tick);
  };

  build();
  draw(performance.now(), true);

  if (!reduceMotion) {
    raf = window.requestAnimationFrame(tick);
  }

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      build();
      draw(performance.now(), true);
    }, 180);
  });

  document.addEventListener('visibilitychange', () => {
    if (reduceMotion) return;
    if (document.hidden) {
      if (raf) window.cancelAnimationFrame(raf);
      raf = null;
    } else if (!raf) {
      lastTime = performance.now();
      raf = window.requestAnimationFrame(tick);
    }
  });
}

const confettiState = {
  particles: [],
  raf: null,
  canvas: null,
  context: null,
  width: 0,
  height: 0
};

function initConfetti() {
  const canvas = $('#confetti');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  if (!context) return;
  confettiState.canvas = canvas;
  confettiState.context = context;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.35);
    confettiState.width = window.innerWidth;
    confettiState.height = window.innerHeight;
    canvas.width = Math.floor(confettiState.width * dpr);
    canvas.height = Math.floor(confettiState.height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  const tick = () => {
    const ctx = confettiState.context;
    ctx.clearRect(0, 0, confettiState.width, confettiState.height);
    confettiState.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.11;
      particle.vx *= 0.995;
      particle.rotation += particle.spin;
      particle.life -= 1;
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = clamp(particle.life / 90, 0, 1);
      if (particle.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-particle.size, -particle.size * 0.55, particle.size * 2, particle.size * 1.1);
      }
      ctx.restore();
    });
    confettiState.particles = confettiState.particles.filter((particle) => particle.life > 0 && particle.y < confettiState.height + 40);
    if (confettiState.particles.length) {
      confettiState.raf = window.requestAnimationFrame(tick);
    } else {
      confettiState.raf = null;
      ctx.clearRect(0, 0, confettiState.width, confettiState.height);
    }
  };

  confettiState.start = tick;
}

function burstConfetti(count = 90, origin = null) {
  if (reduceMotion || !confettiState.context) return;
  const colors = ['#ffd34d', '#e8423f', '#7fd1ae', '#ff9ec4', '#8ec5ff', '#fff3cf'];
  const ox = origin ? origin.x : window.innerWidth / 2;
  const oy = origin ? origin.y : window.innerHeight * 0.42;
  const budget = window.innerWidth < 680 ? 48 : 80;
  const amount = Math.min(count, document.body.classList.contains('perf-lite') ? 24 : budget);
  for (let index = 0; index < amount; index += 1) {
    const angle = (Math.random() * Math.PI * 2);
    const power = 2.5 + Math.random() * 7.5;
    confettiState.particles.push({
      x: ox + (Math.random() - 0.5) * 60,
      y: oy + (Math.random() - 0.5) * 30,
      vx: Math.cos(angle) * power,
      vy: Math.sin(angle) * power - 2.4,
      size: 3 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.22,
      life: 90 + Math.random() * 50,
      shape: Math.random() > 0.55 ? 'circle' : 'rect'
    });
  }
  if (!confettiState.raf) confettiState.start();
}

/* ------------------------------------------------------------
   06. Toasts + modals
   ------------------------------------------------------------ */

let toastTimer = 0;

function showToast(message, iconGlyph = '✦') {
  const root = $('#toastRoot');
  if (!root) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">${esc(iconGlyph)}</span><span>${esc(message)}</span>`;
  root.appendChild(toast);
  while (root.children.length > 3) root.firstElementChild.remove();
  window.setTimeout(() => {
    toast.classList.add('is-out');
    window.setTimeout(() => toast.remove(), 320);
  }, 3300);
}

function openModal(html) {
  const root = $('#modalRoot');
  if (!root) return;
  root.innerHTML = html;
  root.hidden = false;
  document.body.classList.add('is-locked');
  window.setTimeout(() => {
    const close = $('.modal-close', root);
    if (close) close.focus();
  }, 30);
}

function closeModal() {
  const root = $('#modalRoot');
  if (!root || root.hidden) return;
  root.hidden = true;
  root.innerHTML = '';
  if ($('#onboarding').hidden) document.body.classList.remove('is-locked');
}

function confirmReset() {
  openModal(`
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="resetTitle">
      <button class="modal-close" type="button" data-modal-close aria-label="关闭">${icon('close')}</button>
      <span class="kicker">ONE MORE NIGHT?</span>
      <h3 id="resetTitle">要重新开始这段<br>圣诞故事吗？</h3>
      <p>礼物、愿望、小动物和默契答案都会被清空。这个动作没办法被雪覆盖，也无法撤回。</p>
      <div class="modal-actions">
        <button class="btn btn-ghost" type="button" data-modal-close style="color:#5d4434;border-color:#d9bc94;background:#fffaf0">再想想</button>
        <button class="btn btn-danger" type="button" id="confirmReset">重新开始</button>
      </div>
    </div>
  `);
}

/* ------------------------------------------------------------
   07. Santa delivery
   ------------------------------------------------------------ */

function runSantaDelivery(callback) {
  const overlay = $('#santaFlight');
  if (!overlay) {
    if (callback) callback();
    return;
  }
  if (reduceMotion) {
    if (callback) callback();
    return;
  }
  playWhoosh();
  overlay.classList.remove('is-flying');
  // Force a reflow so the animation can be replayed.
  void overlay.offsetWidth;
  overlay.classList.add('is-flying');
  window.setTimeout(() => {
    if (callback) callback();
  }, 1650);
  window.setTimeout(() => {
    overlay.classList.remove('is-flying');
  }, 2800);
}

/* ------------------------------------------------------------
   08. Countdown
   ------------------------------------------------------------ */

let countdownTimer = 0;

function initCountdown() {
  const update = () => {
    const now = new Date();
    let target = new Date(now.getFullYear(), 11, 25, 0, 0, 0);
    if (now.getTime() >= target.getTime()) {
      target = new Date(now.getFullYear() + 1, 11, 25, 0, 0, 0);
    }
    let diff = Math.max(0, target.getTime() - now.getTime());
    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const minutes = Math.floor(diff / 60000);
    diff -= minutes * 60000;
    const seconds = Math.floor(diff / 1000);
    const values = { days, hours, minutes, seconds };
    $$('[data-cd]').forEach((element) => {
      const key = element.dataset.cd;
      if (key in values) element.textContent = String(values[key]).padStart(2, '0');
    });
  };
  update();
  countdownTimer = window.setInterval(update, 1000);
}

/* ------------------------------------------------------------
   09. Routing + chrome
   ------------------------------------------------------------ */

let currentRoute = 'home';
let inviteHost = null;
let pendingGift = null;

function showRoute(route, options = {}) {
  const validRoutes = ['home', 'gifts', 'tree', 'quiz'];
  const nextRoute = validRoutes.includes(route) ? route : 'home';
  currentRoute = nextRoute;

  $$('.view').forEach((view) => {
    view.classList.toggle('is-active', view.dataset.view === nextRoute);
  });
  $$('.nav-link, .bottom-link').forEach((link) => {
    link.classList.toggle('is-active', link.dataset.route === nextRoute);
  });

  if (nextRoute === 'gifts') renderGiftWall();
  if (nextRoute === 'tree') renderTree();
  if (nextRoute === 'quiz') renderQuiz();
  if (nextRoute === 'home') renderWishList();

  if (!options.instant) {
    // Long smooth-scroll journeys over fixed glass UI feel laggy; jump for
    // big distances, glide only for nearby ones.
    const behavior = reduceMotion || window.scrollY > 1200 ? 'auto' : 'smooth';
    window.scrollTo({ top: 0, behavior });
  } else {
    window.scrollTo(0, 0);
  }
}

function updateHeader() {
  if (!state.profile) return;
  const animal = getAnimal(state.profile.animalId);
  $('#profileEmoji').textContent = animal.emoji;
  $('#profileName').textContent = state.profile.name;
  $('#profileChip').setAttribute('aria-label', `${state.profile.name}，你的小动物是${animal.name}`);
}

function updateStats() {
  const best = state.guestResults.length
    ? Math.max(...state.guestResults.map((result) => Number(result.score) || 0))
    : null;
  $('#statAnimals').textContent = String(state.tree.length);
  $('#statGifts').textContent = String(state.gifts.length);
  $('#statMatch').textContent = best == null ? '--' : `${best}%`;
}

function renderHeroAnimal() {
  if (!state.profile) return;
  const animal = getAnimal(state.profile.animalId);
  const third = $$('#heroAnimals .scene-animal')[2];
  if (!third) return;
  third.style.setProperty('--x', '62%');
  third.style.setProperty('--y', '58%');
  const emoji = $('span', third);
  const label = $('i', third);
  if (emoji) emoji.textContent = animal.emoji;
  if (label) label.textContent = state.profile.name;
}

function updateSoundButton() {
  const button = $('#soundToggle');
  if (!button) return;
  button.classList.toggle('is-muted', !state.sound);
  button.setAttribute('aria-pressed', String(Boolean(state.sound)));
  button.setAttribute('aria-label', state.sound ? '关闭声音' : '打开声音');
}

function applyMotionPreference() {
  const lite = Boolean(state && state.liteMotion);
  document.body.classList.toggle('perf-lite', lite);
  const button = $('#motionToggle');
  if (!button) return;
  button.setAttribute('aria-pressed', String(lite));
  const label = $('span', button);
  if (label) label.textContent = `轻量动效：${lite ? '开' : '关'}`;
}

/* ------------------------------------------------------------
   10. Onboarding
   ------------------------------------------------------------ */

let selectedOnboardAnimal = null;
let onboardClaimed = new Set();

function claimedForOnboarding() {
  const claimed = new Set(state.tree.map((entry) => entry.animalId));
  if (state.profile) claimed.add(state.profile.animalId);
  if (inviteHost) {
    claimed.add(inviteHost.animalId);
    inviteHost.tree.forEach((entry) => claimed.add(entry.animalId));
  }
  return claimed;
}

function openOnboarding() {
  const overlay = $('#onboarding');
  if (!overlay) return;
  overlay.hidden = false;
  document.body.classList.add('is-locked');
  onboardClaimed = claimedForOnboarding();

  if (inviteHost) {
    const copy = $('.onboard-art-copy p');
    if (copy) copy.textContent = `「${inviteHost.name} 也在等你，先领一只小动物吧。」`;
  } else if (pendingGift) {
    const copy = $('.onboard-art-copy p');
    if (copy) copy.textContent = '「有人把一份礼物，悄悄放在了你的门口。」';
  }

  renderOnboardingPicker();
  window.setTimeout(() => $('#onboardName').focus(), 300);
}

function renderOnboardingPicker() {
  const picker = $('#animalPicker');
  if (!picker) return;
  picker.innerHTML = ANIMALS.map((animal) => {
    const claimed = onboardClaimed.has(animal.id);
    const selected = selectedOnboardAnimal === animal.id;
    return `
      <button class="animal-choice${selected ? ' is-selected' : ''}" type="button" data-animal="${animal.id}" ${claimed ? 'disabled aria-label="' + esc(animal.name) + '，已经被领走"' : `aria-label="${esc(animal.name)}，${esc(animal.vibe)}"`}>
        <em>${animal.emoji}</em>
        <span>${esc(animal.name)}</span>
        ${claimed ? '<i class="claimed-tag">已领</i>' : ''}
      </button>
    `;
  }).join('');

  const claimInfo = $('#animalClaimInfo');
  if (claimInfo) claimInfo.textContent = `已领走 ${onboardClaimed.size} / ${ANIMALS.length}`;
  updateOnboardingPreview();
}

function updateOnboardingPreview() {
  const preview = $('#onboardPreview');
  const picked = $('#onboardPicked');
  const submit = $('#onboardSubmit');
  const name = $('#onboardName').value.trim();
  if (selectedOnboardAnimal) {
    const animal = getAnimal(selectedOnboardAnimal);
    if (preview) {
      const emoji = $('span', preview);
      const label = $('i', preview);
      if (emoji) {
        emoji.textContent = animal.emoji;
        emoji.classList.remove('is-claimed');
      }
      if (label) label.textContent = `${animal.name} · 只属于你`;
    }
    if (picked) {
      picked.innerHTML = `<span>${esc(animal.emoji)} ${esc(animal.name)}</span><small>${esc(animal.vibe)}</small>`;
    }
  } else {
    if (preview) {
      const emoji = $('span', preview);
      const label = $('i', preview);
      if (emoji) emoji.textContent = '🦊';
      if (label) label.textContent = '你的小动物';
    }
    if (picked) picked.innerHTML = '<span>还没有选择</span><small>挑一只喜欢的吧</small>';
  }
  if (submit) submit.disabled = !name || !selectedOnboardAnimal;
}

function selectOnboardAnimal(animalId) {
  if (!ANIMAL_MAP.has(animalId) || onboardClaimed.has(animalId)) return;
  selectedOnboardAnimal = selectedOnboardAnimal === animalId ? null : animalId;
  playPop();
  renderOnboardingPicker();
}

function submitOnboarding() {
  const nameInput = $('#onboardName');
  const name = nameInput.value.trim();
  const submit = $('#onboardSubmit');
  if (!name) {
    showToast('先告诉我们怎么称呼你吧', '✦');
    nameInput.focus();
    return;
  }
  if (!selectedOnboardAnimal) {
    showToast('挑一只只属于你的小动物', '🐾');
    return;
  }
  if (onboardClaimed.has(selectedOnboardAnimal)) {
    showToast('这只小动物刚刚被别人领走了，换一只吧', '❄️');
    selectedOnboardAnimal = null;
    onboardClaimed = claimedForOnboarding();
    renderOnboardingPicker();
    return;
  }

  state.profile = { name: name.slice(0, 12), animalId: selectedOnboardAnimal };
  state.tree = normalizeTree(state.tree, state.profile);
  saveState();

  if (inviteHost) mergeInviteTree();
  const gotGift = pendingGift ? importSharedGift(pendingGift) : false;
  pendingGift = null;

  const overlay = $('#onboarding');
  overlay.hidden = true;
  $('#app').hidden = false;
  document.body.classList.remove('is-locked');

  renderAll();
  updateSoundButton();
  playJingle();
  burstConfetti(60, { x: window.innerWidth / 2, y: window.innerHeight * 0.45 });

  if (inviteHost) {
    renderQuizLanding();
    showRoute('quiz', { instant: true });
    showToast(`收到来自 ${inviteHost.name} 的默契挑战`, '💌');
  } else if (gotGift) {
    showRoute('gifts', { instant: true });
    window.setTimeout(() => {
      runSantaDelivery(() => showToast('圣诞老人把你的礼物送到啦，拆开看看', '🎁'));
    }, 500);
  } else {
    showRoute('home', { instant: true });
    showToast(`欢迎 ${state.profile.name}，${getAnimal(state.profile.animalId).name} 已经在树上了`, '🎄');
  }

  if (location.hash.includes('gift=')) {
    history.replaceState(null, '', `${location.pathname}${location.search}`);
  }
}

/* ------------------------------------------------------------
   11. Tree
   ------------------------------------------------------------ */

let selectedTrayAnimal = null;
let newOrnamentId = null;

function treeEntriesSorted() {
  return state.tree.slice().sort((a, b) => a.slot - b.slot);
}

function isAnimalClaimed(animalId) {
  return state.tree.some((entry) => entry.animalId === animalId)
    || Boolean(state.profile && state.profile.animalId === animalId);
}

function addTreeEntry(animalId, name, options = {}) {
  if (!ANIMAL_MAP.has(animalId) || isAnimalClaimed(animalId)) return null;
  if (state.tree.length >= MAX_TREE_SLOTS) return null;
  const entry = {
    id: uid('tree'),
    animalId,
    name: String(name || getAnimal(animalId).name).trim().slice(0, 12),
    isMe: Boolean(options.isMe),
    source: options.source || 'local',
    slot: firstFreeSlot(state.tree),
    addedAt: Date.now()
  };
  if (entry.slot < 0) return null;
  state.tree.push(entry);
  state.tree = normalizeTree(state.tree, state.profile);
  saveState();
  return entry;
}

function mergeInviteTree() {
  if (!inviteHost) return;
  const candidates = [];
  if (inviteHost.animalId) {
    candidates.push({ animalId: inviteHost.animalId, name: inviteHost.name });
  }
  inviteHost.tree.forEach((entry) => {
    if (!candidates.some((candidate) => candidate.animalId === entry.animalId)) {
      candidates.push(entry);
    }
  });
  candidates.forEach((candidate) => {
    if (state.tree.length >= MAX_TREE_SLOTS) return;
    if (candidate.animalId === state.profile?.animalId) return;
    addTreeEntry(candidate.animalId, candidate.name, { source: 'invite' });
  });
  saveState();
}

function renderTree() {
  if (!state.profile) return;
  const entries = treeEntriesSorted();
  const own = entries.find((entry) => entry.isMe) || entries.find((entry) => entry.animalId === state.profile.animalId);
  const ownAnimal = getAnimal(state.profile.animalId);

  $('#myAnimalEmoji').textContent = ownAnimal.emoji;
  $('#myAnimalName').textContent = ownAnimal.name;
  $('#myAnimalVibe').textContent = ownAnimal.vibe;
  $('#myAnimalCard').querySelector('.my-animal-orb').style.setProperty('--orb', ownAnimal.orb);

  const ornamentRoot = $('#treeOrnaments');
  ornamentRoot.innerHTML = entries.map((entry) => {
    const animal = getAnimal(entry.animalId);
    const slot = TREE_SLOTS[entry.slot] || TREE_SLOTS[0];
    const delay = `-${(entry.slot % 7) * 0.45}s`;
    return `
      <button class="ornament${entry.isMe ? ' is-me' : ''}${newOrnamentId === entry.id ? ' is-new' : ''}" type="button"
        data-ornament="${entry.id}"
        style="--x:${slot.x}%;--y:${slot.y}%;--sway-delay:${delay};--orb:${animal.orb};--orb-dark:${animal.orbDark};--bow:${animal.bow};--rim:#ffe7bb"
        aria-label="${esc(entry.name)}的小动物：${esc(animal.name)}">
        <span class="ornament-string"></span>
        <span class="ornament-bauble">${animal.emoji}${entry.isMe ? '<i class="ornament-me-badge">YOU</i>' : ''}</span>
        <span class="ornament-label">${esc(entry.name)}</span>
      </button>
    `;
  }).join('');

  $('#treeEmptyNote').hidden = entries.length > 0;
  $('#treeFootCount').textContent = String(entries.length);
  $('#treeStampCount').textContent = String(entries.length).padStart(2, '0');
  $('#ornamentListCount').textContent = `${entries.length} / ${MAX_TREE_SLOTS}`;

  const list = $('#ornamentList');
  list.innerHTML = entries.length
    ? entries.map((entry) => {
      const animal = getAnimal(entry.animalId);
      return `
        <div class="ornament-list-row${entry.isMe ? ' is-me' : ''}">
          <span>${animal.emoji}</span>
          <strong>${esc(entry.name)}</strong>
          <small>${entry.isMe ? 'YOU' : esc(animal.name)}</small>
        </div>
      `;
    }).join('')
    : '<p class="ornament-list-empty">树上还空着，挑一只小动物挂上去吧。</p>';

  renderAnimalTray();
  updateStats();
  newOrnamentId = null;
}

function renderAnimalTray() {
  const tray = $('#animalTray');
  if (!tray) return;
  tray.innerHTML = ANIMALS.map((animal) => {
    const claimed = isAnimalClaimed(animal.id);
    const selected = selectedTrayAnimal === animal.id;
    return `
      <button class="tray-animal${selected ? ' is-selected' : ''}" type="button" data-tray-animal="${animal.id}"
        ${claimed ? 'disabled' : ''}
        title="${claimed ? `${esc(animal.name)}已经被领走` : esc(animal.name)}"
        aria-label="${esc(animal.name)}${claimed ? '，已经被领走' : ''}">
        ${animal.emoji}
      </button>
    `;
  }).join('');
  const hint = $('#hangHint');
  if (hint) {
    hint.textContent = selectedTrayAnimal
      ? `已选择 ${getAnimal(selectedTrayAnimal).name}`
      : '挑一只小动物';
  }
}

function handleHangSubmit(event) {
  event.preventDefault();
  const nameInput = $('#hangName');
  const name = nameInput.value.trim();
  if (!name) {
    showToast('先写下这位访客的名字吧', '✍️');
    nameInput.focus();
    return;
  }
  if (!selectedTrayAnimal) {
    showToast('还没挑小动物呢', '🐾');
    return;
  }
  if (state.tree.length >= MAX_TREE_SLOTS) {
    showToast('树梢已经挂满啦，今晚的星星刚刚好', '🌟');
    return;
  }
  const entry = addTreeEntry(selectedTrayAnimal, name);
  if (!entry) {
    showToast('这只小动物已经被领走了，换一只吧', '❄️');
    selectedTrayAnimal = null;
    renderTree();
    return;
  }
  newOrnamentId = entry.id;
  nameInput.value = '';
  selectedTrayAnimal = null;
  playBell();
  renderTree();
  updateStats();
  burstConfetti(24, { x: window.innerWidth * 0.5, y: window.innerHeight * 0.45 });
  showToast(`${entry.name} 的 ${getAnimal(entry.animalId).name} 已经挂上树啦`, '🎄');
}

function openOrnamentModal(entryId) {
  const entry = state.tree.find((item) => item.id === entryId);
  if (!entry) return;
  const animal = getAnimal(entry.animalId);
  openModal(`
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="ornamentTitle">
      <button class="modal-close" type="button" data-modal-close aria-label="关闭">${icon('close')}</button>
      <span class="kicker">A LITTLE ONE ON THE TREE</span>
      <div style="display:flex;align-items:center;gap:14px;margin:10px 0 14px">
        <div style="display:grid;place-items:center;width:70px;height:70px;border:2px solid #ead1a9;border-radius:50%;background:#fffaf0;font-size:35px">${animal.emoji}</div>
        <div>
          <h3 id="ornamentTitle" style="margin:0 0 3px">${esc(entry.name)}</h3>
          <p style="margin:0">${esc(animal.name)} · ${esc(animal.vibe)}</p>
        </div>
      </div>
      <p>${entry.isMe ? '这是你的小动物。独一无二，已经稳稳地挂在圣诞树上。' : `这是 ${esc(entry.name)} 的小动物。每位访客的小动物都只有一次出现的机会。`}</p>
      <div class="modal-actions">
        ${entry.isMe ? '' : `<button class="btn btn-ghost" type="button" data-remove-ornament="${esc(entry.id)}" style="color:#8d3538;border-color:#e4c4a0;background:#fffaf0">${icon('close')}取下</button>`}
        <button class="btn btn-primary" type="button" data-modal-close>${icon('check')}知道啦</button>
      </div>
    </div>
  `);
  playBell();
}

function removeOrnament(entryId) {
  const entry = state.tree.find((item) => item.id === entryId);
  if (!entry || entry.isMe) return;
  state.tree = state.tree.filter((item) => item.id !== entryId);
  saveState();
  closeModal();
  renderTree();
  updateStats();
  showToast(`${entry.name} 的小动物已经从树上取下来啦`, '❄️');
}

/* ------------------------------------------------------------
   12. Gifts
   ------------------------------------------------------------ */

let currentGiftType = 'cocoa';
let currentTheme = 'velvet';
let currentAnonymous = true;

function renderGiftTypes() {
  const root = $('#giftTypes');
  if (!root) return;
  root.innerHTML = GIFT_TYPES.map((type) => `
    <button class="gift-type${type.id === currentGiftType ? ' is-active' : ''}" type="button" data-gift-type="${type.id}" aria-pressed="${type.id === currentGiftType}">
      <em>${type.emoji}</em><span>${esc(type.label)}</span>
    </button>
  `).join('');
}

function renderGiftPreview() {
  const preview = $('#giftPreview');
  if (!preview) return;
  const type = getGiftType(currentGiftType);
  const to = $('#giftTo').value.trim() || '某个重要的人';
  const message = $('#giftMessage').value.trim() || '愿你的圣诞袜里，装满热可可、好天气和一点点偏心。';
  const from = currentAnonymous
    ? '一位神秘的朋友'
    : ($('#giftFrom').value.trim() || state.profile?.name || '你');
  preview.className = `mini-card theme-${currentTheme}`;
  $('.mini-card-to', preview).textContent = `TO: ${to}`;
  $('.mini-gift', preview).textContent = type.emoji;
  $('.mini-msg', preview).textContent = message;
  $('.mini-from', preview).textContent = `— ${from}`;
}

function setAnonymous(anonymous) {
  currentAnonymous = anonymous;
  $('#giftAnon').value = String(anonymous);
  $$('.seg-btn').forEach((button) => {
    const isActive = (button.dataset.anon === 'true') === anonymous;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  const field = $('#signatureField');
  field.hidden = anonymous;
  if (!anonymous) {
    const from = $('#giftFrom');
    if (!from.value && state.profile) from.value = state.profile.name;
    window.setTimeout(() => from.focus(), 50);
  }
  renderGiftPreview();
}

function setTheme(theme) {
  currentTheme = normalizeTheme(theme);
  $$('.theme-swatch').forEach((button) => {
    const active = button.dataset.theme === currentTheme;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  renderGiftPreview();
}

function setGiftType(typeId) {
  if (!GIFT_TYPE_MAP.has(typeId)) return;
  currentGiftType = typeId;
  $$('.gift-type').forEach((button) => {
    const active = button.dataset.giftType === typeId;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  renderGiftPreview();
  playPop();
}

function renderGiftWall() {
  const wall = $('#giftWall');
  if (!wall) return;
  const gifts = state.gifts.slice().sort((a, b) => b.createdAt - a.createdAt);
  $('#giftCount').textContent = `${gifts.length} 份已送达`;
  $('#giftEmpty').hidden = gifts.length > 0;
  wall.innerHTML = gifts.map((gift, index) => giftCardHTML(gift, index)).join('');
}

function giftCardHTML(gift, index) {
  const type = getGiftType(gift.giftType);
  const fromLabel = gift.anonymous ? '一位神秘的朋友' : gift.fromName;
  return `
    <article class="gift-card${gift.opened ? ' is-open' : ''}" data-gift-id="${esc(gift.id)}" style="animation-delay:${Math.min(index * 55, 280)}ms">
      <div class="gift-card-inner">
        <div class="gift-face gift-front theme-${gift.theme}">
          <span class="gift-horizontal-ribbon"></span>
          <div class="gift-front-top">
            <span class="gift-to"><small>A LITTLE GIFT FOR</small><strong>${esc(gift.toName)}</strong></span>
            <span class="gift-seal">✦</span>
          </div>
          <div class="gift-front-mid">
            <span class="gift-front-gift">${type.emoji}</span>
            <span class="gift-front-name">${esc(type.label)} · WRAPPED WITH LOVE</span>
          </div>
          <div class="gift-front-foot">
            <span>${gift.anonymous ? 'ANONYMOUS' : 'SIGNED WITH LOVE'}</span>
            <button class="gift-open-btn" type="button" data-open-gift="${esc(gift.id)}">拆开 ${icon('sparkle')}</button>
          </div>
        </div>
        <div class="gift-face gift-back theme-${gift.theme}">
          <div class="gift-back-top">
            <span class="gift-back-recipient">TO · ${esc(gift.toName)}</span>
            <span>${esc(gift.dateLabel || formatShortDate(gift.createdAt))}</span>
          </div>
          <div class="gift-back-msg">
            <p>${esc(gift.message)}</p>
            <span>${esc(type.label)} · FROM ${esc(fromLabel).toUpperCase()}</span>
          </div>
          <div class="gift-back-actions">
            <button class="gift-reply" type="button" data-reply-gift="${esc(gift.id)}">${icon('mail')}回一份礼</button>
            <button class="gift-close gift-share" type="button" data-share-gift="${esc(gift.id)}" aria-label="复制贺卡链接">${icon('share')}<span>分享</span></button>
            <button class="gift-close" type="button" data-close-gift="${esc(gift.id)}" aria-label="合上贺卡">${icon('close')}</button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function handleGiftWallClick(event) {
  const openButton = event.target.closest('[data-open-gift]');
  const closeButton = event.target.closest('[data-close-gift]');
  const replyButton = event.target.closest('[data-reply-gift]');
  const shareButton = event.target.closest('[data-share-gift]');

  if (openButton) {
    const card = openButton.closest('.gift-card');
    const gift = state.gifts.find((item) => item.id === openButton.dataset.openGift);
    if (!card) return;
    card.classList.add('is-open');
    if (gift) {
      gift.opened = true;
      saveState();
    }
    playBell();
  }

  if (closeButton) {
    const card = closeButton.closest('.gift-card');
    const gift = state.gifts.find((item) => item.id === closeButton.dataset.closeGift);
    if (card) card.classList.remove('is-open');
    if (gift) {
      gift.opened = false;
      saveState();
    }
  }

  if (replyButton) {
    const gift = state.gifts.find((item) => item.id === replyButton.dataset.replyGift);
    if (!gift) return;
    const toInput = $('#giftTo');
    toInput.value = gift.anonymous ? '神秘的朋友' : gift.fromName;
    toInput.focus({ preventScroll: true });
    showRoute('gifts');
    window.setTimeout(() => {
      $('#giftForm').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      toInput.focus({ preventScroll: true });
    }, 180);
    showToast('换你来写一张回礼贺卡吧', '💌');
  }

  if (shareButton) {
    const gift = state.gifts.find((item) => item.id === shareButton.dataset.shareGift);
    if (!gift) return;
    copyGiftLink(gift);
  }
}

async function copyGiftLink(gift) {
  const link = buildGiftLink(gift);
  const success = await copyText(link);
  showToast(success ? '贺卡链接已复制，快发给 TA 吧' : '复制失败了，请允许剪贴板权限后再试', success ? '🔗' : '❄️');
}

async function handleGiftSubmit(event) {
  event.preventDefault();
  if (!state.profile) return;
  const toInput = $('#giftTo');
  const messageInput = $('#giftMessage');
  const fromInput = $('#giftFrom');
  const toName = toInput.value.trim();
  const message = messageInput.value.trim();
  const fromName = currentAnonymous ? '一位神秘的朋友' : (fromInput.value.trim() || state.profile.name);

  if (!toName) {
    showToast('还没写这张贺卡要送给谁呢', '✉️');
    toInput.focus();
    return;
  }
  if (!message) {
    showToast('写一句话吧，哪怕只有一句圣诞快乐', '🖋️');
    messageInput.focus();
    return;
  }
  if (!currentAnonymous && !fromInput.value.trim()) {
    showToast('署名送出的话，记得留下你的名字', '✍️');
    fromInput.focus();
    return;
  }

  const gift = {
    id: uid('gift'),
    fromName,
    toName,
    anonymous: currentAnonymous,
    message: message.slice(0, 80),
    giftType: currentGiftType,
    theme: currentTheme,
    createdAt: Date.now(),
    opened: false,
    shared: false
  };

  const button = $('#sendGiftBtn');
  button.disabled = true;
  const original = button.innerHTML;
  button.innerHTML = `<span>圣诞老人出发中…</span>${icon('sparkle')}`;
  playBell();

  runSantaDelivery(() => {
    state.gifts.push(gift);
    saveState();
    renderGiftWall();
    updateStats();
    burstConfetti(46, { x: window.innerWidth * 0.62, y: window.innerHeight * 0.35 });
    playJingle();
    showToast(`贺卡已经送到 ${gift.toName} 的圣诞袜里啦`, '🎅');
    button.disabled = false;
    button.innerHTML = original;
    messageInput.value = '';
    $('#giftChar').textContent = '0';
    renderGiftPreview();
    window.setTimeout(() => {
      const firstCard = $('#giftWall .gift-card');
      if (firstCard) firstCard.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    }, 900);
  });

  if (reduceMotion) {
    button.disabled = false;
    button.innerHTML = original;
  }
}

function openRandomGift() {
  const unopened = $$('#giftWall .gift-card:not(.is-open)');
  if (!unopened.length) {
    showToast('所有礼物都拆开啦，今晚的惊喜刚刚好', '✨');
    return;
  }
  const card = unopened[Math.floor(Math.random() * unopened.length)];
  card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  window.setTimeout(() => {
    card.classList.add('is-open');
    const gift = state.gifts.find((item) => item.id === card.dataset.giftId);
    if (gift) {
      gift.opened = true;
      saveState();
    }
    playBell();
  }, 380);
}

/* ------------------------------------------------------------
   13. Wishes
   ------------------------------------------------------------ */

function renderWishList() {
  const list = $('#wishList');
  if (!list) return;
  const wishes = state.wishes.slice(-11);
  list.innerHTML = wishes.map((wish, index) => {
    const tone = WISH_TONES[wish.tone % WISH_TONES.length] || WISH_TONES[0];
    return `
      <span class="wish-bubble" style="--bubble-bg:${tone.bg};--bubble-ink:${tone.ink};--rot:${tone.rot}" data-wish-id="${esc(wish.id)}" title="${esc(wish.text)}">
        <strong>${esc(wish.name)}</strong><em>${esc(wish.text)}</em>
      </span>
    `;
  }).join('');
}

function handleWishSubmit(event) {
  event.preventDefault();
  const input = $('#wishInput');
  const text = input.value.trim();
  if (!text) {
    showToast('写下一个愿望再放进雪球里吧', '❄️');
    input.focus();
    return;
  }
  const wish = {
    id: uid('wish'),
    name: state.profile?.name || '匿名',
    text: text.slice(0, 48),
    tone: Math.floor(Math.random() * WISH_TONES.length)
  };
  state.wishes.push(wish);
  if (state.wishes.length > 30) state.wishes = state.wishes.slice(-30);
  saveState();
  input.value = '';
  renderWishList();
  playBell();
  burstConfetti(18, { x: window.innerWidth * 0.38, y: window.innerHeight * 0.7 });
  showToast('愿望已经摇进雪球里啦', '❄️');
}

/* ------------------------------------------------------------
   14. Quiz
   ------------------------------------------------------------ */

let quiz = {
  screen: 'landing',
  mode: null,
  host: null,
  answers: [],
  qi: 0,
  result: null,
  isPreview: false
};

function targetHostForGuest() {
  if (inviteHost && inviteHost.answers) return inviteHost;
  if (state.hostAnswers && state.profile) {
    return {
      name: state.profile.name,
      animalId: state.profile.animalId,
      answers: state.hostAnswers,
      source: 'own',
      tree: state.tree.map((entry) => ({ animalId: entry.animalId, name: entry.name }))
    };
  }
  return DEMO_HOST;
}

function renderQuiz() {
  if (!state.profile) return;
  if (quiz.screen === 'play') {
    renderQuizQuestion();
    return;
  }
  if (quiz.screen === 'result' && quiz.result) {
    renderQuizResult();
    return;
  }
  if (quiz.screen === 'hostDone') {
    renderHostDone();
    return;
  }
  renderQuizLanding();
}

function renderQuizLanding() {
  quiz = {
    screen: 'landing',
    mode: null,
    host: null,
    answers: [],
    qi: 0,
    result: null,
    isPreview: false
  };
  const shell = $('#quizShell');
  if (!shell) return;
  const hostReady = Boolean(state.hostAnswers);
  const target = targetHostForGuest();
  const targetAnimal = getAnimal(target.animalId);
  const isInvite = target.source === 'invite';
  const isOwn = target.source === 'own';

  const targetLabel = isInvite
    ? `来自 ${esc(target.name)} 的挑战`
    : isOwn
      ? '预览你自己的挑战'
      : `示例主人 · ${esc(target.name)}`;
  const targetDesc = isInvite
    ? `TA 已经写好了自己的答案，等你来猜。`
    : isOwn
      ? '你已经出好题啦，先自己试玩一遍，看看访客会看到什么。'
      : '还没有收到邀请？先和示例主人小鹿玩一局，熟悉一下圣诞暗号。';
  const guestButton = isOwn ? '试玩访客视角' : isInvite ? '接受挑战' : '挑战示例主人';
  const shareHint = hostReady
    ? '你的挑战已经准备好了。把链接发给朋友，等 TA 来猜。'
    : '先写下你的六个答案，就能生成专属邀请链接。';

  shell.innerHTML = `
    <div class="quiz-landing">
      <article class="quiz-role-card role-host">
        <div class="role-top">
          <span class="role-number">01 / HOST</span>
          <span class="role-icon">✏️</span>
        </div>
        <div class="role-title">
          <span class="kicker dark">I'M THE HOST</span>
          <h2>先写下我的<br>圣诞答案。</h2>
          <p>六道关于冬日与礼物的小题。你的答案会成为谜底，等一个重要的人来猜。</p>
          <div class="role-meta">
            <span class="mini-avatar">${getAnimal(state.profile.animalId).emoji}</span>
            <span>${hostReady ? '你的谜底已经装进圣诞袜' : '大约需要 2 分钟'} · 6 QUESTIONS</span>
          </div>
          <button class="btn btn-primary" type="button" data-quiz="host">
            <span>${hostReady ? '重新写下我的答案' : '开始出题'}</span>${icon('arrow')}
          </button>
        </div>
        <span class="role-deco">?</span>
      </article>

      <article class="quiz-role-card role-guest">
        <div class="role-top">
          <span class="role-number">02 / GUEST</span>
          <span class="role-icon">${targetAnimal.emoji}</span>
        </div>
        <div class="role-title">
          <span class="kicker" style="color:var(--mint)">I'M THE GUEST</span>
          <h2>猜猜 TA 的<br>圣诞答案。</h2>
          <p>${targetDesc}</p>
          <div class="role-meta">
            <span class="mini-avatar">${targetAnimal.emoji}</span>
            <span>${targetLabel} · ${isInvite ? 'INVITED' : isOwn ? 'PREVIEW' : 'SAMPLE'}</span>
          </div>
          <button class="btn btn-light" type="button" data-quiz="guest">
            <span>${guestButton}</span>${icon('heart')}
          </button>
        </div>
        <span class="role-deco">♥</span>
      </article>

      <div class="quiz-demo-strip">
        <div class="demo-copy">
          <span class="demo-avatar">${hostReady ? '💌' : '🎁'}</span>
          <div>
            <strong>${shareHint}</strong>
            <span>邀请链接里只包含你的名字、小动物和六个答案，不会上传到任何服务器。</span>
          </div>
        </div>
        ${hostReady
          ? `<button class="btn btn-primary btn-small" type="button" data-copy-invite>${icon('copy')}复制挑战链接</button>`
          : `<button class="btn btn-ghost btn-small" type="button" data-quiz="host">${icon('arrow')}先去出题</button>`}
      </div>
    </div>
  `;
}

function startHostQuiz() {
  quiz = {
    screen: 'play',
    mode: 'host',
    host: {
      name: state.profile.name,
      animalId: state.profile.animalId,
      source: 'own'
    },
    answers: state.hostAnswers ? state.hostAnswers.slice() : new Array(QUIZ_QUESTIONS.length).fill(null),
    qi: 0,
    result: null,
    isPreview: false
  };
  renderQuiz();
  if (window.innerWidth <= 960) scrollQuizIntoFocus('.quiz-card');
}

function startGuestQuiz(host, options = {}) {
  quiz = {
    screen: 'play',
    mode: 'guest',
    host,
    answers: new Array(QUIZ_QUESTIONS.length).fill(null),
    qi: 0,
    result: null,
    isPreview: Boolean(options.preview)
  };
  renderQuiz();
  if (window.innerWidth <= 960) scrollQuizIntoFocus('.quiz-card');
}

function renderQuizQuestion() {
  const shell = $('#quizShell');
  if (!shell || !quiz.host) return;
  const question = QUIZ_QUESTIONS[quiz.qi];
  const isHost = quiz.mode === 'host';
  const hostAnimal = getAnimal(quiz.host.animalId);
  const selected = quiz.answers[quiz.qi];
  const progress = ((quiz.qi + 1) / QUIZ_QUESTIONS.length) * 100;

  shell.innerHTML = `
    <div class="quiz-play">
      <div class="quiz-progress">
        <div class="quiz-progress-track"><div class="quiz-progress-fill" style="width:${progress}%"></div></div>
        <span class="quiz-progress-label">QUESTION ${String(quiz.qi + 1).padStart(2, '0')} / 06</span>
      </div>
      <div class="quiz-card">
        <div class="quiz-card-top">
          <span>${isHost ? 'YOUR ANSWER, WRITTEN IN THE STARS' : `GUESSING ${esc(quiz.host.name).toUpperCase()}'S ANSWER`}</span>
          <span class="quiz-tag">${isHost ? 'HOST MODE' : `${hostAnimal.emoji} ${esc(quiz.host.name)}`}</span>
        </div>
        <h2 class="quiz-q">${isHost ? '' : `猜猜 ${esc(quiz.host.name)} 会选：`}<br><em>${esc(question.q)}</em></h2>
        <div class="quiz-options" role="group" aria-label="选项">
          ${question.options.map((option, index) => `
            <button class="q-option${selected === index ? ' is-selected' : ''}" type="button" data-opt="${index}" aria-pressed="${selected === index}">
              <em>${option.emoji}</em><span>${esc(option.label)}</span>
            </button>
          `).join('')}
        </div>
        <div class="quiz-next">
          <span class="quiz-next-hint">${selected == null ? '选一个你心里最先冒出来的答案。' : '没有标准答案，跟着直觉走就好。'}</span>
          <button class="btn btn-primary" type="button" data-quiz-next ${selected == null ? 'disabled' : ''}>
            <span>${quiz.qi === QUIZ_QUESTIONS.length - 1 ? '看看结果' : '下一题'}</span>${icon('arrow')}
          </button>
        </div>
      </div>
    </div>
  `;
}

function selectQuizOption(index) {
  const question = QUIZ_QUESTIONS[quiz.qi];
  if (!question || !question.options[index]) return;
  quiz.answers[quiz.qi] = index;
  $$('.q-option').forEach((button) => {
    const active = Number(button.dataset.opt) === index;
    button.classList.toggle('is-selected', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const next = $('[data-quiz-next]');
  if (next) next.disabled = false;
  const hint = $('.quiz-next-hint');
  if (hint) hint.textContent = '没有标准答案，跟着直觉走就好。';
  playPop();
}

function quizNext() {
  if (quiz.answers[quiz.qi] == null) {
    showToast('先选一个答案吧', '✦');
    return;
  }
  if (quiz.qi < QUIZ_QUESTIONS.length - 1) {
    quiz.qi += 1;
    renderQuizQuestion();
    window.setTimeout(() => {
      const card = $('.quiz-card');
      if (card) card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    }, 60);
    return;
  }
  if (quiz.mode === 'host') finishHostQuiz();
  else finishGuestQuiz();
}

function scrollQuizIntoFocus(selector) {
  window.setTimeout(() => {
    const element = $(selector);
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.scrollY - 104;
    window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' });
  }, 80);
}

function finishHostQuiz() {
  state.hostAnswers = quiz.answers.slice();
  saveState();
  quiz.screen = 'hostDone';
  quiz.mode = 'hostDone';
  quiz.host = {
    name: state.profile.name,
    animalId: state.profile.animalId,
    answers: state.hostAnswers.slice(),
    source: 'own'
  };
  playJingle();
  burstConfetti(90, { x: window.innerWidth / 2, y: window.innerHeight * 0.3 });
  renderQuiz();
  scrollQuizIntoFocus('.host-done');
}

function renderHostDone() {
  const shell = $('#quizShell');
  if (!shell) return;
  const animal = getAnimal(state.profile.animalId);
  const link = buildInviteLink();
  const answerTags = state.hostAnswers.map((answer, index) => {
    const option = QUIZ_QUESTIONS[index].options[answer];
    return `<span>${option.emoji} ${esc(option.label)}</span>`;
  }).join('');

  shell.innerHTML = `
    <div class="host-done">
      <div class="host-card cream-panel">
        <span class="kicker dark">YOUR SECRET IS READY</span>
        <h2>谜底已经<br>装进圣诞袜啦。</h2>
        <p>把下面的链接发给那个你想测试的人。TA 会看到你的名字和小动物，然后猜你的六个答案。</p>
        <div class="invite-link-box">
          <input id="hostInviteLink" value="${esc(link)}" readonly aria-label="邀请链接" />
          <button class="btn btn-primary" type="button" data-copy-invite>${icon('copy')}复制</button>
        </div>
        <div class="host-actions">
          <button class="btn btn-primary" type="button" data-quiz="preview">${icon('heart')}预览访客视角</button>
          <button class="btn btn-ghost" type="button" data-quiz="host" style="color:#5d4434;border-color:#d9bc94;background:#fffaf0">重新出题</button>
          <button class="btn btn-ghost" type="button" data-route="tree" style="color:#5d4434;border-color:#d9bc94;background:#fffaf0">${icon('tree')}去看圣诞树</button>
        </div>
      </div>
      <div class="host-preview">
        <div class="big-avatar">${animal.emoji}</div>
        <span class="kicker">YOUR CHRISTMAS PROFILE</span>
        <h3>${esc(state.profile.name)} 的圣诞暗号</h3>
        <p>${esc(animal.name)} · ${esc(animal.vibe)}</p>
        <div class="preview-answers">${answerTags}</div>
        <span class="preview-tag">${icon('sparkle')} 6 个答案 · 等待一位懂你的人</span>
      </div>
    </div>
  `;
}

function finishGuestQuiz() {
  const host = quiz.host;
  const matches = quiz.answers.reduce((total, answer, index) => total + (answer === host.answers[index] ? 1 : 0), 0);
  const pct = Math.round((matches / QUIZ_QUESTIONS.length) * 100);
  quiz.result = {
    score: pct,
    matches,
    total: QUIZ_QUESTIONS.length,
    review: quiz.answers.map((answer, index) => ({
      index,
      question: QUIZ_QUESTIONS[index].q,
      yours: QUIZ_QUESTIONS[index].options[answer].label,
      host: QUIZ_QUESTIONS[index].options[host.answers[index]].label,
      right: answer === host.answers[index]
    }))
  };
  quiz.screen = 'result';

  if (!quiz.isPreview) {
    state.guestResults.push({
      hostName: host.name,
      score: pct,
      at: Date.now()
    });
    state.guestResults = state.guestResults.slice(-20);
    saveState();
  }

  renderQuiz();
  playJingle();
  scrollQuizIntoFocus('.result-hero');
  if (pct >= 50) {
    window.setTimeout(() => burstConfetti(pct >= 83 ? 130 : 70, { x: window.innerWidth / 2, y: window.innerHeight * 0.36 }), 250);
  }
}

function scoreComment(pct) {
  if (pct === 100) return '你们是同一颗圣诞星。连热可可里放几颗棉花糖都猜得到。';
  if (pct >= 83) return '心有灵犀！TA 的答案，你几乎闭着眼都能写对。';
  if (pct >= 66) return '默契正在升温。再多交换几个圣诞夜，就会刚刚好。';
  if (pct >= 50) return '一半命中，一半惊喜。剩下的一半，留给下一次了解。';
  return '圣诞老人说：你们的故事还很长，慢慢猜才有意思。';
}

function scoreRank(pct) {
  if (pct === 100) return 'SAME STAR';
  if (pct >= 83) return 'SOULMATES';
  if (pct >= 66) return 'WARMING UP';
  if (pct >= 50) return 'HALF & HALF';
  return 'A LONG STORY';
}

function animateNumber(element, target, suffix = '') {
  if (!element) return;
  if (reduceMotion) {
    element.textContent = `${target}${suffix}`;
    return;
  }
  const start = performance.now();
  const duration = 900;
  const step = (now) => {
    const t = clamp((now - start) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    element.textContent = `${Math.round(target * eased)}${suffix}`;
    if (t < 1) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
}

function renderQuizResult() {
  const shell = $('#quizShell');
  const result = quiz.result;
  const host = quiz.host;
  if (!shell || !result || !host) return;
  const hostAnimal = getAnimal(host.animalId);
  const circumference = 565.49;
  const offset = circumference * (1 - result.score / 100);
  const comment = scoreComment(result.score);
  const rank = scoreRank(result.score);

  shell.innerHTML = `
    <div class="quiz-result">
      <div class="result-hero">
        <div class="score-ring">
          <svg viewBox="0 0 210 210" aria-hidden="true">
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#7fd1ae"/>
                <stop offset="0.55" stop-color="#ffd34d"/>
                <stop offset="1" stop-color="#ff9ec4"/>
              </linearGradient>
            </defs>
            <circle class="score-ring-track" cx="105" cy="105" r="90"/>
            <circle class="score-ring-fill" id="scoreRingFill" cx="105" cy="105" r="90" style="stroke-dashoffset:${circumference}"/>
          </svg>
          <div class="score-ring-center">
            <strong><span id="scoreNumber">0</span><small>%</small></strong>
            <span>CHRISTMAS CHEMISTRY</span>
          </div>
        </div>
        <div class="result-copy">
          <span class="kicker">${quiz.isPreview ? 'A LITTLE PREVIEW' : 'THE STARS HAVE SPOKEN'} · ${rank}</span>
          <h2>你和 ${esc(host.name)} 的<br><em>默契度是 ${result.score}%。</em></h2>
          <p>${esc(comment)}</p>
          <div class="result-match-line">
            <span>${hostAnimal.emoji}</span>
            <div>${result.matches} / ${result.total} 个答案同频。${quiz.isPreview ? '这是访客视角的预览，结果不会计入你的默契记录。' : '这份结果只保存在你的设备里。'}</div>
          </div>
          <div class="result-actions">
            <button class="btn btn-primary" type="button" data-quiz="again">${icon('refresh')}再猜一次</button>
            <button class="btn btn-light" type="button" data-copy-result>${icon('copy')}复制结果</button>
            <button class="btn btn-ghost" type="button" data-quiz="home">${icon('home')}回到默契首页</button>
          </div>
        </div>
      </div>
      <div class="review-section">
        <div class="review-head"><span>ANSWER BY ANSWER</span><span>${result.matches} 个同频 · ${result.total - result.matches} 个惊喜</span></div>
        <div class="review-list">
          ${result.review.map((item) => `
            <article class="review-item${item.right ? ' is-right' : ''}">
              <div class="review-item-top">
                <span>Q${String(item.index + 1).padStart(2, '0')} · ${item.right ? 'SAME FREQUENCY' : 'A LITTLE SURPRISE'}</span>
                <i class="review-mark">${item.right ? '✓' : '○'}</i>
              </div>
              <p class="review-q">${esc(item.question)}</p>
              <div class="review-answers">
                <span>${esc(host.name)}：<b>${esc(item.host)}</b></span>
                <span>你：<b class="${item.right ? '' : 'wrong'}">${esc(item.yours)}</b></span>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  window.requestAnimationFrame(() => {
    const fill = $('#scoreRingFill');
    if (fill) {
      fill.style.strokeDashoffset = String(offset);
    }
    animateNumber($('#scoreNumber'), result.score);
  });
}

async function copyInviteLink() {
  if (!state.profile) return;
  const link = buildInviteLink();
  const success = await copyText(link);
  showToast(success ? '挑战链接已复制，快发给 TA 吧' : '复制失败了，请手动选中链接复制', success ? '🔗' : '❄️');
}

async function copyQuizResult() {
  if (!quiz.result || !quiz.host) return;
  const text = `我和 ${quiz.host.name} 的圣诞默契度是 ${quiz.result.score}%！${scoreComment(quiz.result.score)} 🎄`;
  const success = await copyText(text);
  showToast(success ? '结果已复制，去分享给 TA 吧' : '复制失败，请检查剪贴板权限', success ? '💌' : '❄️');
}

function handleQuizClick(event) {
  const quizButton = event.target.closest('[data-quiz]');
  if (quizButton) {
    const action = quizButton.dataset.quiz;
    if (action === 'host') startHostQuiz();
    else if (action === 'guest') startGuestQuiz(targetHostForGuest());
    else if (action === 'preview') {
      startGuestQuiz({
        name: state.profile.name,
        animalId: state.profile.animalId,
        answers: state.hostAnswers || DEMO_HOST.answers,
        source: 'own'
      }, { preview: true });
    } else if (action === 'again') {
      if (quiz.host) startGuestQuiz(quiz.host, { preview: quiz.isPreview });
    } else if (action === 'home') {
      renderQuizLanding();
    }
    return;
  }

  const option = event.target.closest('[data-opt]');
  if (option) {
    selectQuizOption(Number(option.dataset.opt));
    return;
  }

  if (event.target.closest('[data-quiz-next]')) {
    quizNext();
    return;
  }

  if (event.target.closest('[data-copy-invite]')) {
    copyInviteLink();
    return;
  }

  if (event.target.closest('[data-copy-result]')) {
    copyQuizResult();
  }
}

/* ------------------------------------------------------------
   15. Clipboard
   ------------------------------------------------------------ */

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    // Fall through to the old way.
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const result = document.execCommand('copy');
    textarea.remove();
    return result;
  } catch (error) {
    return false;
  }
}

/* ------------------------------------------------------------
   16. Hash / invite / gift import
   ------------------------------------------------------------ */

function applyIncomingHash(options = {}) {
  const incoming = readHash();
  if (!incoming.invite && !incoming.gift) return { invite: false, gift: false };

  const hadInvite = Boolean(inviteHost);
  inviteHost = incoming.invite || null;
  pendingGift = incoming.gift || null;

  if (!state.profile) {
    if (inviteHost || pendingGift) openOnboarding();
    return { invite: false, gift: false };
  }

  if (inviteHost) {
    mergeInviteTree();
    renderTree();
  }

  let imported = false;
  if (pendingGift) {
    imported = importSharedGift(pendingGift);
    pendingGift = null;
    renderGiftWall();
    updateStats();
  }

  if (options.route !== false) {
    if (imported) {
      showRoute('gifts', { instant: true });
      window.setTimeout(() => {
        runSantaDelivery(() => {
          const firstCard = $('#giftWall .gift-card');
          if (firstCard) firstCard.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
          showToast('有人给你送来一份圣诞礼物，拆开看看', '🎁');
        });
      }, 500);
      history.replaceState(null, '', `${location.pathname}${location.search}`);
    } else if (incoming.invite) {
      renderQuizLanding();
      showRoute('quiz', { instant: true });
      if (!hadInvite) showToast(`收到来自 ${inviteHost.name} 的默契挑战`, '💌');
    } else {
      showRoute('gifts', { instant: true });
    }
  }

  return { invite: Boolean(inviteHost), gift: imported };
}

/* ------------------------------------------------------------
   17. Global rendering + onboarding initialization
   ------------------------------------------------------------ */

function renderAll() {
  updateHeader();
  updateStats();
  renderHeroAnimal();
  renderGiftTypes();
  renderGiftWall();

  const fromInput = $('#giftFrom');
  if (fromInput && !fromInput.value && state.profile) fromInput.value = state.profile.name;
  const toInput = $('#giftTo');
  if (toInput && !toInput.value && inviteHost) toInput.value = inviteHost.name;
  renderGiftPreview();

  renderTree();
  renderWishList();
  updateSoundButton();
  $('#giftPreview')?.classList.add('is-ready');
}

function finishAppBoot() {
  $('#app').hidden = false;
  renderAll();
  const incoming = readHash();
  if (incoming.gift || incoming.invite) {
    applyIncomingHash({ route: false });
    if (incoming.gift) {
      showRoute('gifts', { instant: true });
      window.setTimeout(() => {
        runSantaDelivery(() => {
          const firstCard = $('#giftWall .gift-card');
          if (firstCard) firstCard.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
          showToast('有人给你送来一份圣诞礼物，拆开看看', '🎁');
        });
      }, 500);
      history.replaceState(null, '', `${location.pathname}${location.search}`);
    } else if (incoming.invite && inviteHost?.answers) {
      renderQuizLanding();
      showRoute('quiz', { instant: true });
      showToast(`收到来自 ${inviteHost.name} 的默契挑战`, '💌');
    } else {
      showRoute('home', { instant: true });
    }
  } else {
    showRoute('home', { instant: true });
  }
  if (state.hostAnswers) {
    renderQuizLanding();
  }
}

/* ------------------------------------------------------------
   18. Event wiring
   ------------------------------------------------------------ */

function bindEvents() {
  document.addEventListener('click', (event) => {
    const routeButton = event.target.closest('[data-route]');
    if (routeButton) {
      event.preventDefault();
      const route = routeButton.dataset.route;
      showRoute(route);
      if (route === 'quiz' && quiz.screen === 'play') renderQuiz();
      return;
    }

    const shareTreeButton = event.target.closest('[data-share-tree]');
    if (shareTreeButton) {
      copyInviteLink();
      return;
    }

    if (event.target.closest('[data-modal-close]')) {
      closeModal();
    }
  });

  $('#soundToggle').addEventListener('click', () => {
    state.sound = !state.sound;
    saveState();
    updateSoundButton();
    if (state.sound) playBell();
    showToast(state.sound ? '圣诞铃声开啦' : '已经安静下来', state.sound ? '🔔' : '🌙');
  });

  $('#profileChip').addEventListener('click', () => {
    showRoute('tree');
    showToast(`你的 ${getAnimal(state.profile.animalId).name} 正在树上等你`, '🐾');
  });

  // Onboarding
  $('#animalPicker').addEventListener('click', (event) => {
    const button = event.target.closest('[data-animal]');
    if (button && !button.disabled) selectOnboardAnimal(button.dataset.animal);
  });
  $('#onboardName').addEventListener('input', updateOnboardingPreview);
  $('#onboardName').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!$('#onboardSubmit').disabled) submitOnboarding();
    }
  });
  $('#onboardSubmit').addEventListener('click', submitOnboarding);

  // Gift form
  $('#giftForm').addEventListener('submit', handleGiftSubmit);
  $$('.seg-btn').forEach((button) => {
    button.addEventListener('click', () => setAnonymous(button.dataset.anon === 'true'));
  });
  $$('.theme-swatch').forEach((button) => {
    button.addEventListener('click', () => setTheme(button.dataset.theme));
  });
  $('#giftTypes').addEventListener('click', (event) => {
    const button = event.target.closest('[data-gift-type]');
    if (button) setGiftType(button.dataset.giftType);
  });
  $('#giftTo').addEventListener('input', renderGiftPreview);
  $('#giftFrom').addEventListener('input', renderGiftPreview);
  $('#giftMessage').addEventListener('input', () => {
    $('#giftChar').textContent = String($('#giftMessage').value.length);
    renderGiftPreview();
  });
  $('#giftWall').addEventListener('click', handleGiftWallClick);
  $('#refreshGifts').addEventListener('click', openRandomGift);

  // Wishes
  $('#wishForm').addEventListener('submit', handleWishSubmit);
  $('#wishList').addEventListener('click', (event) => {
    const bubble = event.target.closest('[data-wish-id]');
    if (!bubble) return;
    const wish = state.wishes.find((item) => item.id === bubble.dataset.wishId);
    if (wish) {
      showToast(`${wish.name}：${wish.text}`, '❄️');
      playPop();
    }
  });

  // Tree
  $('#treeOrnaments').addEventListener('click', (event) => {
    const ornament = event.target.closest('[data-ornament]');
    if (ornament) openOrnamentModal(ornament.dataset.ornament);
  });
  $('#ornamentList').addEventListener('click', (event) => {
    const row = event.target.closest('.ornament-list-row');
    if (!row) return;
    const name = $('strong', row)?.textContent;
    if (name) showToast(`${name} 的小动物正在树上闪闪发光`, '✨');
  });
  $('#animalTray').addEventListener('click', (event) => {
    const button = event.target.closest('[data-tray-animal]');
    if (!button || button.disabled) return;
    selectedTrayAnimal = selectedTrayAnimal === button.dataset.trayAnimal ? null : button.dataset.trayAnimal;
    playPop();
    renderAnimalTray();
  });
  $('#hangForm').addEventListener('submit', handleHangSubmit);
  $('#shakeTree').addEventListener('click', () => {
    const stage = $('#treeStage');
    stage.classList.remove('is-shaking');
    void stage.offsetWidth;
    stage.classList.add('is-shaking');
    window.setTimeout(() => stage.classList.remove('is-shaking'), 900);
    playJingle();
    burstConfetti(20, { x: window.innerWidth * 0.45, y: window.innerHeight * 0.5 });
    showToast('圣诞树被你摇得叮叮当当响', '🔔');
  });
  $('#lightTree').addEventListener('click', () => {
    const stage = $('#treeStage');
    const isLit = !stage.classList.contains('is-lit');
    stage.classList.toggle('is-lit', isLit);
    const button = $('#lightTree');
    button.classList.toggle('is-lit', isLit);
    button.setAttribute('aria-pressed', String(isLit));
    button.innerHTML = isLit ? '<i></i>关灯' : '<i></i>点亮';
    playBell();
    showToast(isLit ? '圣诞树亮起来啦' : '让树先睡一会儿', isLit ? '✨' : '🌙');
  });

  // Quiz
  $('#quizShell').addEventListener('click', handleQuizClick);

  // Footer / modal
  $('#motionToggle').addEventListener('click', () => {
    state.liteMotion = !state.liteMotion;
    saveState();
    applyMotionPreference();
    if (!state.liteMotion) playJingle();
    showToast(state.liteMotion ? '已切换到轻量动效，雪花和星星仍在' : '完整圣诞动效回来啦', state.liteMotion ? '🍃' : '✨');
  });
  $('#resetAll').addEventListener('click', confirmReset);
  $('#modalRoot').addEventListener('click', (event) => {
    if (event.target === $('#modalRoot')) {
      closeModal();
      return;
    }
    if (event.target.closest('#confirmReset')) {
      try {
        localStorage.removeItem(STORE_KEY);
      } catch (error) {
        // ignore
      }
      location.hash = '';
      location.reload();
      return;
    }
    const removeButton = event.target.closest('[data-remove-ornament]');
    if (removeButton) removeOrnament(removeButton.dataset.removeOrnament);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (!$('#modalRoot').hidden) closeModal();
    }
  });

  window.addEventListener('hashchange', () => {
    if (!state.profile) return;
    const incoming = readHash();
    if (!incoming.invite && !incoming.gift) {
      inviteHost = null;
      pendingGift = null;
      renderQuizLanding();
      return;
    }
    applyIncomingHash();
  });
}

/* ------------------------------------------------------------
   19. Boot
   ------------------------------------------------------------ */

function boot() {
  state = loadState();
  applyMotionPreference();
  initSnow();
  initConfetti();
  initCountdown();

  const incoming = readHash();
  inviteHost = incoming.invite || null;
  pendingGift = incoming.gift || null;

  bindEvents();
  updateSoundButton();

  if (state.profile) {
    if (inviteHost) mergeInviteTree();
    finishAppBoot();
  } else {
    $('#app').hidden = true;
    renderGiftTypes();
    openOnboarding();
    if (pendingGift) {
      const copy = $('.onboard-art-copy p');
      if (copy) copy.textContent = '「有人把一份礼物，悄悄放在了你的门口。」';
    }
  }

  // A tiny, quiet welcome for returning visitors.
  if (state.profile) {
    const hour = new Date().getHours();
    const greeting = hour >= 22 || hour < 6 ? '夜深了，圣诞雪还在下。' : '欢迎回来，今晚的雪还在等你。';
    window.setTimeout(() => {
      if (!$('#onboarding').hidden) return;
      showToast(greeting, '❄️');
    }, 900);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
