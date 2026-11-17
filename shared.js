/* ============================================================
   MERRY & BRIGHT — shared characters + live tree relay
   This file is used by both the public page and admin.html.
   ============================================================ */

'use strict';

/* ------------------------------------------------------------
   Characters
   ------------------------------------------------------------ */

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

const OUTFITS = [
  { id: 'santa', name: '圣诞帽', tag: 'HO HO HO', color: '#e8423f' },
  { id: 'reindeer', name: '驯鹿角', tag: 'RUDOLPH', color: '#c98a56' },
  { id: 'elf', name: '精灵帽', tag: 'NORTH POLE', color: '#2f8a65' },
  { id: 'beanie', name: '毛线帽', tag: 'COZY', color: '#5689c6' },
  { id: 'scarf', name: '针织围巾', tag: 'WARM HUG', color: '#d46a7e' },
  { id: 'halo', name: '星光环', tag: 'SHINING', color: '#e8bf4f' },
  { id: 'snowman', name: '雪人帽', tag: 'FROSTY', color: '#e6eef8' },
  { id: 'crown', name: '小皇冠', tag: 'ROYAL', color: '#e8bf4f' }
];

const OUTFIT_MAP = new Map(OUTFITS.map((outfit) => [outfit.id, outfit]));

const OUTFIT_ART = {
  santa: '<i class="acc acc-santa"></i>',
  reindeer: '<i class="acc acc-antlers"><b></b><em></em></i>',
  elf: '<i class="acc acc-elf"><b></b></i>',
  beanie: '<i class="acc acc-beanie"></i>',
  scarf: '<i class="acc acc-scarf"><b></b></i>',
  halo: '<i class="acc acc-halo"></i>',
  snowman: '<i class="acc acc-snowman"><b></b></i>',
  crown: '<i class="acc acc-crown"><b></b></i>'
};

function getAnimal(id) {
  return ANIMAL_MAP.get(id) || ANIMALS[0];
}

function getOutfit(id) {
  return OUTFIT_MAP.get(id) || OUTFITS[0];
}

function avatarMarkup(animalId, outfitId, options = {}) {
  const animal = getAnimal(animalId);
  const outfit = getOutfit(outfitId);
  const size = Number(options.size) || 48;
  const className = options.className ? ` ${options.className}` : '';
  const ariaHidden = options.ariaHidden === false ? 'false' : 'true';
  return `<span class="avatar outfit-${outfit.id}${className}" style="--avatar-size:${size}px;--orb:${animal.orb};--orb-dark:${animal.orbDark};--bow:${animal.bow}" aria-hidden="${ariaHidden}"><span class="avatar-ring"></span><span class="avatar-animal">${animal.emoji}</span>${OUTFIT_ART[outfit.id] || ''}</span>`;
}

/* ------------------------------------------------------------
   Live tree relay (MQTT retained state)
   ------------------------------------------------------------ */

const REMOTE_BROKER = 'wss://broker.emqx.io:8084/mqtt';
const REMOTE_TOPIC = 'merry-bright/2026/live-tree/9c41f7b2d8e64a35';
const REMOTE_CACHE_KEY = 'merry-bright-shared-v1';

function nameKey(value) {
  return String(value || '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
}

function validPlayerName(value) {
  const text = String(value || '').normalize('NFKC').trim().replace(/\s+/g, ' ');
  const chars = Array.from(text);
  if (chars.length < 2 || chars.length > 12) return false;
  if (/[<>&"']/.test(text)) return false;
  return /^[\p{L}\p{N}][\p{L}\p{N}·•_\- ]*$/u.test(text);
}

function emptySharedState() {
  return {
    v: 1,
    rev: 0,
    updatedAt: new Date(0).toISOString(),
    users: {},
    reports: [],
    settings: { treeCapacity: 24 }
  };
}

function normalizeSharedUser(id, raw) {
  if (!id || !raw || !ANIMAL_MAP.has(raw.animal) || !OUTFIT_MAP.has(raw.outfit)) return null;
  const name = String(raw.name || '匿名').slice(0, 12);
  return {
    id: String(id),
    name,
    nameKey: String(raw.nameKey || nameKey(name)).slice(0, 40),
    animal: raw.animal,
    outfit: raw.outfit,
    createdAt: Number(raw.createdAt) || Date.now(),
    onTree: Boolean(raw.onTree),
    treeAt: Number(raw.treeAt) || null,
    sendCount: Math.max(0, Number(raw.sendCount) || 0),
    lastSendAt: Number(raw.lastSendAt) || null,
    banned: Boolean(raw.banned),
    hidden: Boolean(raw.hidden),
    banReason: String(raw.banReason || '').slice(0, 80),
    bannedAt: Number(raw.bannedAt) || null
  };
}

function normalizeSharedState(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const users = {};
  Object.keys(raw.users || {}).forEach((id) => {
    const user = normalizeSharedUser(id, raw.users[id]);
    if (user) users[user.id] = user;
  });
  const reports = Array.isArray(raw.reports)
    ? raw.reports
      .filter((report) => report && users[report.userId])
      .slice(-80)
      .map((report) => ({
        id: String(report.id || `report-${report.at || Date.now()}`),
        userId: String(report.userId),
        reason: String(report.reason || '').slice(0, 80),
        at: Number(report.at) || Date.now(),
        status: report.status === 'resolved' ? 'resolved' : 'open'
      }))
    : [];
  return {
    v: 1,
    rev: Math.max(0, Number(raw.rev) || 0),
    updatedAt: String(raw.updatedAt || new Date(0).toISOString()),
    users,
    reports,
    settings: { treeCapacity: 24 }
  };
}

function sharedTreeUsers(snapshot) {
  if (!snapshot) return [];
  return Object.values(snapshot.users)
    .filter((user) => user.onTree && !user.banned && !user.hidden)
    .sort((a, b) => (a.treeAt || a.createdAt) - (b.treeAt || b.createdAt));
}

function sharedNameConflict(snapshot, name, selfId) {
  if (!snapshot) return null;
  const key = nameKey(name);
  return Object.values(snapshot.users).find((user) => user.id !== selfId && user.nameKey === key) || null;
}

function sharedComboConflict(snapshot, animal, outfit, selfId) {
  if (!snapshot) return null;
  return Object.values(snapshot.users)
    .find((user) => user.id !== selfId && user.animal === animal && user.outfit === outfit) || null;
}

function sharedUserFor(snapshot, profile) {
  if (!snapshot || !profile || !profile.id) return null;
  return snapshot.users[profile.id] || null;
}

const remote = (() => {
  let client = null;
  let snapshot = null;
  let status = 'idle';
  let connectStarted = false;
  let liveState = false;
  const listeners = new Set();
  const readyWaiters = [];
  const connectWaiters = [];
  const liveWaiters = [];

  function cacheSnapshot(value) {
    try {
      localStorage.setItem(REMOTE_CACHE_KEY, JSON.stringify(value));
    } catch (error) {
      // Storage may be unavailable in private mode.
    }
  }

  function readCachedSnapshot() {
    try {
      return normalizeSharedState(JSON.parse(localStorage.getItem(REMOTE_CACHE_KEY) || 'null'));
    } catch (error) {
      return null;
    }
  }

  function emit() {
    listeners.forEach((listener) => {
      try { listener(snapshot, status); } catch (error) { /* one bad listener must not stop the tree */ }
    });
  }

  function setStatus(next) {
    if (status === next) return;
    status = next;
    emit();
  }

  function acceptSnapshot(raw) {
    const normalized = normalizeSharedState(raw);
    if (!normalized) return false;
    snapshot = normalized;
    liveState = true;
    cacheSnapshot(snapshot);
    setStatus('ready');
    while (readyWaiters.length) {
      const waiter = readyWaiters.shift();
      clearTimeout(waiter.timer);
      waiter.resolve(snapshot);
    }
    while (liveWaiters.length) {
      const waiter = liveWaiters.shift();
      clearTimeout(waiter.timer);
      waiter.resolve(snapshot);
    }
    emit();
    return true;
  }

  function connect() {
    if (connectStarted) return;
    connectStarted = true;
    snapshot = readCachedSnapshot();
    if (snapshot) setStatus('cached');

    if (typeof mqtt === 'undefined' || !mqtt.connect) {
      setStatus('offline');
      return;
    }

    setStatus('connecting');
    try {
      client = mqtt.connect(REMOTE_BROKER, {
        clientId: `mb_${Math.random().toString(16).slice(2, 10)}${Date.now().toString(36).slice(-4)}`,
        clean: true,
        connectTimeout: 12000,
        reconnectPeriod: 3500,
        keepalive: 30,
        protocolVersion: 4
      });
    } catch (error) {
      setStatus('offline');
      return;
    }

    client.on('connect', () => {
      setStatus('ready');
      while (connectWaiters.length) {
        const waiter = connectWaiters.shift();
        clearTimeout(waiter.timer);
        waiter.resolve();
      }
      client.subscribe(REMOTE_TOPIC, { qos: 1 }, (error) => {
        if (error) setStatus('error');
      });
      // If the broker has lost its retained snapshot, rebuild a small empty
      // tree so the public page cannot get stuck waiting forever.
      window.setTimeout(() => {
        if (liveState || !client || !client.connected) return;
        const seed = snapshot || emptySharedState();
        snapshot = normalizeSharedState(seed);
        liveState = true;
        cacheSnapshot(snapshot);
        setStatus('ready');
        emit();
        client.publish(REMOTE_TOPIC, JSON.stringify(snapshot), { qos: 1, retain: true });
      }, 5000);
    });

    client.on('reconnect', () => setStatus('connecting'));
    client.on('close', () => {
      if (status !== 'ready') setStatus(snapshot ? 'cached' : 'offline');
    });
    client.on('offline', () => setStatus(snapshot ? 'cached' : 'offline'));
    client.on('error', () => setStatus(snapshot ? 'cached' : 'error'));

    client.on('message', (topic, payload) => {
      if (topic !== REMOTE_TOPIC) return;
      try {
        acceptSnapshot(JSON.parse(payload.toString()));
      } catch (error) {
        // Ignore a malformed retained message.
      }
    });
  }

  function waitReady(timeout = 8000) {
    if (snapshot) return Promise.resolve(snapshot);
    return new Promise((resolve, reject) => {
      const waiter = { resolve, reject, timer: 0 };
      waiter.timer = window.setTimeout(() => {
        const index = readyWaiters.indexOf(waiter);
        if (index >= 0) readyWaiters.splice(index, 1);
        reject(new Error('tree-sync-timeout'));
      }, timeout);
      readyWaiters.push(waiter);
    });
  }

  function waitConnected(timeout = 6000) {
    if (client && client.connected) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const waiter = { resolve, reject, timer: 0 };
      waiter.timer = window.setTimeout(() => {
        const index = connectWaiters.indexOf(waiter);
        if (index >= 0) connectWaiters.splice(index, 1);
        reject(new Error('broker-timeout'));
      }, timeout);
      connectWaiters.push(waiter);
    });
  }

  function waitLiveState(timeout = 5000) {
    if (liveState && snapshot) return Promise.resolve(snapshot);
    return new Promise((resolve, reject) => {
      const waiter = { resolve, reject, timer: 0 };
      waiter.timer = window.setTimeout(() => {
        const index = liveWaiters.indexOf(waiter);
        if (index >= 0) liveWaiters.splice(index, 1);
        reject(new Error('state-timeout'));
      }, timeout);
      liveWaiters.push(waiter);
    });
  }

  async function mutate(mutator) {
    try {
      await waitConnected(6000);
      if (!liveState) await waitLiveState(5000);
    } catch (error) {
      return { error: 'offline' };
    }
    const draft = JSON.parse(JSON.stringify(snapshot || emptySharedState()));
    let outcome;
    try {
      outcome = mutator(draft);
    } catch (error) {
      return { error: 'mutate-failed' };
    }
    if (outcome && outcome.error) return outcome;
    draft.rev = (Number(snapshot?.rev) || 0) + 1;
    draft.updatedAt = new Date().toISOString();
    snapshot = normalizeSharedState(draft);
    cacheSnapshot(snapshot);
    setStatus(client && client.connected ? 'ready' : 'cached');
    emit();
    if (client && client.connected) {
      client.publish(REMOTE_TOPIC, JSON.stringify(draft), { qos: 1, retain: true });
    }
    return Object.assign({ ok: true }, outcome || {});
  }

  function onState(listener) {
    listeners.add(listener);
    if (snapshot) listener(snapshot, status);
    return () => listeners.delete(listener);
  }

  return {
    connect,
    waitReady,
    mutate,
    onState,
    get snapshot() { return snapshot; },
    get status() { return status; },
    get connected() { return Boolean(client && client.connected); },
    cacheSnapshot,
    emptySharedState
  };
})();
