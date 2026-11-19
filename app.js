/* ============================================================
   MERRY & BRIGHT — 圣诞夜游园会
   A tiny, self-contained Christmas universe.
   ============================================================ */

'use strict';

/* ------------------------------------------------------------
   01. Data
   ------------------------------------------------------------ */

const STORE_KEY = 'merry-bright-v1';
const MAX_TREE_SLOTS = 24;

let state = null;
let sharedTree = null;
let sharedStatus = 'idle';
let onboardStep = 1;

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

const ADVENT_DAYS = [
  { day: 1, flag: '🇩🇪', country: '德国', title: '粉笔画的降临节', text: '19 世纪的德国路德宗家庭会在门上画粉笔线，每天擦掉一格，数到圣诞。后来才出现印在纸上的小门和巧克力日历。', tryIt: '在便签上画 24 个格子，每天划掉一格。' },
  { day: 2, flag: '🇬🇧', country: '英国', title: '圣诞拉炮', text: '伦敦的 Tom Smith 在 1840 年代把糖果包装变成会“砰”一声的纸拉炮。现在里面通常有一顶纸皇冠、一张冷笑话和一个小礼物。', tryIt: '和家人各拉一端，谁拿到纸皇冠谁负责讲笑话。' },
  { day: 3, flag: '🌍', country: '欧美办公室', title: '秘密圣诞老人', text: '每个人抽一个名字，悄悄给那个人准备一份小礼物，不署名。它让礼物交换变得公平，也保留一点“谁送的”悬念。', tryIt: '用本页的抽签器，给群里每个人抽一个名字。' },
  { day: 4, flag: '🇲🇽', country: '墨西哥', title: '拉斯波萨达斯', text: '12 月 16 日到 24 日，人们重演玛利亚和约瑟夫寻找住处的故事，举着蜡烛唱歌、挨家敲门，最后以派对和皮纳塔结束。', tryIt: '和朋友分两队，一队敲门唱歌，一队假装旅店老板。' },
  { day: 5, flag: '🇸🇪', country: '瑞典', title: '圣露西亚节', text: '12 月 13 日，穿白裙、戴蜡烛皇冠的露西亚队伍唱歌送藏红花面包，把光带进一年中最黑的季节。', tryIt: '在窗边点一支蜡烛，放一首安静的圣诞歌。' },
  { day: 6, flag: '🇵🇭', country: '菲律宾', title: 'Simbang Gabi 与星星灯', text: '菲律宾的圣诞季很长。十二月清晨有连续九天的弥撒，家家户户挂着星星形状的 parol 灯笼，象征希望与伯利恒之星。', tryIt: '用纸和竹签做一颗五角星灯，挂在窗边。' },
  { day: 7, flag: '🇮🇸', country: '冰岛', title: '圣诞书潮', text: '冰岛有个可爱的传统：圣诞前出版大量新书，平安夜很多人会收到书，然后窝进被窝里读一整晚，配热可可。', tryIt: '给朋友挑一本书，在扉页写一句只属于你们的话。' },
  { day: 8, flag: '🇩🇪', country: '德国', title: '圣诞市集', text: '德国的 Weihnachtsmarkt 从十一月开始，木屋摊位卖热红酒、姜饼和撒满糖粉的 Stollen 圣诞果脯面包。', tryIt: '煮一锅热红酒（或热苹果汁），加橙皮和肉桂。' },
  { day: 9, flag: '🇯🇵', country: '日本', title: '肯德基与草莓蛋糕', text: '日本的圣诞夜有很特别的组合：炸鸡和草莓奶油蛋糕。1970 年代的广告让“圣诞吃肯德基”变成一种约定俗成。', tryIt: '今晚的晚餐，给炸鸡和蛋糕留一个位置。' },
  { day: 10, flag: '🇵🇱', country: '波兰', title: 'Wigilia 平安夜晚餐', text: '波兰平安夜会准备十二道菜，桌下放干草，先分食薄薄的圣诞薄饼（opłatek），再开始吃饭。', tryIt: '数一数今晚桌上有几道菜，凑不齐十二道也没关系。' },
  { day: 11, flag: '🇺🇦', country: '乌克兰', title: '蜘蛛网与 Kutia', text: '乌克兰有个传说：贫穷家庭里的蜘蛛在圣诞夜织出金网，带来好运。传统甜粥 Kutia 由小麦、蜂蜜和罂粟籽做成。', tryIt: '把一小段毛线绕成星星，夹进卡片里。' },
  { day: 12, flag: '🇳🇴', country: '挪威', title: '藏扫帚与米布丁', text: '挪威旧传说里，圣诞夜女巫会出来借扫帚，所以人们会把扫帚藏起来。晚餐常吃藏着杏仁的米布丁，吃到的人得到杏仁糖。', tryIt: '在甜点里藏一颗坚果，看谁吃到。' },
  { day: 13, flag: '🇨🇿', country: '捷克', title: '浴缸里的鲤鱼', text: '捷克很多家庭会在圣诞前买一条活鲤鱼，养在浴缸里，平安夜做成炸鲤鱼配土豆沙拉。', tryIt: '今晚试试一道你从未吃过的节日菜。' },
  { day: 14, flag: '🇳🇱', country: '荷兰', title: 'Sinterklaas 与鞋子', text: '12 月 5 日是 Sinterklaas 前夜。孩子们把鞋子放在窗边，放一点胡萝卜给马，第二天会收到小礼物和姜饼。', tryIt: '在门口放一只鞋，给家人塞一张小纸条。' },
  { day: 15, flag: '🇪🇸', country: '加泰罗尼亚', title: 'Tió de Nadal', text: '一段画着笑脸的木头盖着毯子，孩子们围着它唱歌、轻轻敲它，让它“送出”小礼物和糖果。', tryIt: '给一段木头画笑脸，盖上围巾，让它当今晚的糖果罐。' },
  { day: 16, flag: '🇻🇪', country: '委内瑞拉', title: '滑轮去望弥撒', text: '在加拉加斯，十二月清晨人们会穿上轮滑鞋去参加圣诞弥撒，街道会为这项传统让路。', tryIt: '如果今晚出门，换一条没走过的路回家。' },
  { day: 17, flag: '🇦🇺', country: '澳大利亚', title: '海滩上的圣诞', text: '南半球的圣诞是夏天：海滩烧烤、冷虾、户外烛光颂歌，圣诞老人有时候穿着短裤出场。', tryIt: '把热可可换成冰饮，在阳台听一首圣诞歌。' },
  { day: 18, flag: '🇪🇹', country: '埃塞俄比亚', title: 'Ganna 与曲棍球', text: '埃塞俄比亚在 1 月 7 日庆祝 Ganna。年轻人会玩一种类似曲棍球的传统游戏，教堂里则举行通宵礼拜。', tryIt: '找一项没玩过的冬季运动，看一场比赛。' },
  { day: 19, flag: '🇮🇹', country: '意大利', title: '女巫贝法娜与七鱼宴', text: '意大利平安夜常有“七鱼宴”；1 月 6 日主显节前夜，女巫贝法娜会骑着扫帚给好孩子送礼物。', tryIt: '给一位很久没联系的人发一句圣诞快乐。' },
  { day: 20, flag: '🇺🇸', country: '美国', title: '饼干、牛奶与圣诞袜', text: '孩子们给圣诞老人留饼干和牛奶，给驯鹿留胡萝卜；床头挂圣诞袜，第二天早上拆礼物。NORAD 还会“追踪”圣诞老人的路线。', tryIt: '在床头挂一只袜子，明早给里面放一张小纸条。' },
  { day: 21, flag: '🇩🇰', country: '丹麦', title: '米布丁里的杏仁', text: '丹麦的圣诞午餐 julefrokost 很长很丰盛。甜点米布丁里藏一颗杏仁，找到的人会得到一份小礼物。', tryIt: '在布丁或酸奶里藏一颗坚果，谁吃到谁许愿。' },
  { day: 22, flag: '🇫🇮', country: '芬兰', title: '桑拿、墓地蜡烛与罗瓦涅米', text: '芬兰人会在圣诞夜蒸桑拿、去墓地给亲人点蜡烛。官方圣诞老人村就在北极圈上的罗瓦涅米。', tryIt: '给自己十分钟安静时间，点一支蜡烛。' },
  { day: 23, flag: '🇫🇷', country: '法国', title: 'Réveillon 与树桩蛋糕', text: '法国的平安夜大餐叫 Réveillon。甜点 bûche de Noël 做成树桩形状，纪念从前放在炉火里的 Yule log。', tryIt: '把蛋糕卷成树桩形状，撒一点糖粉当雪。' },
  { day: 24, flag: '🇬🇷', country: '希腊', title: '圣诞小船与第十二夜', text: '希腊一些岛屿会装饰圣诞小船（karavaki），而不是圣诞树。圣诞季一直延续到 1 月 6 日主显节，也就是“第十二夜”。', tryIt: '今晚把灯留到很晚，给这棵树说一句晚安。' }
];

const ADVENT_COUNTRY_CODES = {
  '德国': 'DE',
  '英国': 'UK',
  '欧美办公室': 'WW',
  '墨西哥': 'MX',
  '瑞典': 'SE',
  '菲律宾': 'PH',
  '冰岛': 'IS',
  '日本': 'JP',
  '波兰': 'PL',
  '乌克兰': 'UA',
  '挪威': 'NO',
  '捷克': 'CZ',
  '荷兰': 'NL',
  '加泰罗尼亚': 'CT',
  '委内瑞拉': 'VE',
  '澳大利亚': 'AU',
  '埃塞俄比亚': 'ET',
  '意大利': 'IT',
  '美国': 'US',
  '丹麦': 'DK',
  '芬兰': 'FI',
  '法国': 'FR',
  '希腊': 'GR'
};
ADVENT_DAYS.forEach((entry) => {
  entry.code = ADVENT_COUNTRY_CODES[entry.country] || 'XX';
});

const CRACKER_JOKES = [
  { q: '有腹肌的雪人叫什么？', a: '腹肌雪人——Abdominal Snowman。' },
  { q: '圣诞树为什么不擅长织毛衣？', a: '因为它总是掉针——drop needles。' },
  { q: '驯鹿讲笑话前会说什么？', a: '“这个笑话会 sleigh 到你。”——slay / sleigh 的谐音。' },
  { q: '雪人和吸血鬼生下的孩子叫什么？', a: '冻伤——Frostbite。' },
  { q: '为什么圣诞老人从不迟到？', a: '因为他有“雪橇”专用道。' },
  { q: '姜饼人去看医生说了什么？', a: '“医生，我总觉得身体里少了一块。”' },
  { q: '哪首歌最喜欢数学？', a: '《Jingle Bells》——因为它一直在“单”数。' },
  { q: '圣诞拉炮为什么很会社交？', a: '因为它一开口就是“砰”然心动。' }
];

const CRACKER_CROWNS = [
  { name: '红色纸皇冠', color: '#d63c45' },
  { name: '金色纸皇冠', color: '#d7a53f' },
  { name: '松绿纸皇冠', color: '#2f8a65' },
  { name: '雪蓝纸皇冠', color: '#5689c6' }
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
  { x: 50, y: 19 },
  { x: 42, y: 35 },
  { x: 58, y: 35 },
  { x: 32, y: 51 },
  { x: 50, y: 51 },
  { x: 68, y: 51 },
  { x: 24, y: 67 },
  { x: 41, y: 67 },
  { x: 59, y: 67 },
  { x: 76, y: 67 },
  { x: 18, y: 82 },
  { x: 34, y: 82 },
  { x: 50, y: 82 },
  { x: 66, y: 82 },
  { x: 82, y: 82 }
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
    adventOpened: [],
    crackerCount: 0,
    secretSanta: null,
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
    ? {
      id: String(raw.profile.id || uid('acct')),
      name: String(raw.profile.name || '小满').slice(0, 12),
      animalId: raw.profile.animalId,
      outfitId: OUTFIT_MAP.has(raw.profile.outfitId) ? raw.profile.outfitId : 'santa'
    }
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

  const adventOpened = Array.isArray(raw.adventOpened)
    ? [...new Set(raw.adventOpened.map(Number).filter((day) => Number.isInteger(day) && day >= 1 && day <= 24))]
    : [];

  let secretSanta = null;
  if (raw.secretSanta && Array.isArray(raw.secretSanta.participants) && Array.isArray(raw.secretSanta.assignment)) {
    const participants = raw.secretSanta.participants
      .filter((person) => person && String(person.name || '').trim())
      .slice(0, 30)
      .map((person) => ({
        name: String(person.name).trim().slice(0, 20),
        wish: String(person.wish || '').slice(0, 40)
      }));
    const assignment = raw.secretSanta.assignment
      .filter((pair) => pair && pair.from && pair.to)
      .slice(0, 30)
      .map((pair) => ({
        from: String(pair.from).slice(0, 20),
        to: String(pair.to).slice(0, 20),
        wish: String(pair.wish || '').slice(0, 40)
      }));
    secretSanta = participants.length >= 2 && assignment.length === participants.length
      ? { participants, assignment, budget: String(raw.secretSanta.budget || '').slice(0, 20), drawnAt: Number(raw.secretSanta.drawnAt) || Date.now() }
      : null;
  }

  return {
    profile,
    tree: normalizeTree(raw.tree, profile),
    gifts,
    wishes,
    hostAnswers: answers,
    guestResults,
    adventOpened,
    crackerCount: Math.max(0, Number(raw.crackerCount) || 0),
    secretSanta,
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
    t: sharedTreeUsers(sharedTree).slice(0, 12).map((user) => [user.animal, user.name])
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
      <p>礼物、愿望、小动物和默契答案都会被清空；你在公共圣诞树上的形象也会一起移除。这个动作没办法被雪覆盖，也无法撤回。</p>
      <div class="modal-actions">
        <button class="btn btn-ghost" type="button" data-modal-close style="color:#5d4434;border-color:#d9bc94;background:#fffaf0">再想想</button>
        <button class="btn btn-danger" type="button" id="confirmReset">重新开始</button>
      </div>
    </div>
  `);
}

async function resetStory() {
  const id = state.profile?.id;
  if (id) {
    try {
      await remote.mutate((draft) => {
        delete draft.users[id];
        draft.reports = draft.reports.filter((report) => report.userId !== id);
        return { ok: true };
      });
    } catch (error) {
      // A local reset still works when the relay is unavailable.
    }
  }
  try {
    localStorage.removeItem(STORE_KEY);
  } catch (error) {
    // ignore
  }
  location.hash = '';
  location.reload();
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
  const validRoutes = ['home', 'gifts', 'tree', 'activities', 'quiz'];
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
  if (nextRoute === 'activities') renderActivities();
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

function mySharedUser() {
  return sharedUserFor(sharedTree, state.profile);
}

function publicTreeUsers() {
  return sharedTreeUsers(sharedTree);
}

function sharedGiftTotal() {
  if (!sharedTree) return 0;
  return Object.values(sharedTree.users).reduce((sum, user) => sum + (Number(user.sendCount) || 0), 0);
}

function updateHeader() {
  const emoji = $('#profileEmoji');
  const name = $('#profileName');
  const caption = $('.profile-meta small');
  const chip = $('#profileChip');
  if (!state.profile) {
    if (emoji) emoji.textContent = '🎄';
    if (name) name.textContent = '加入圣诞夜';
    if (caption) caption.textContent = '访客';
    chip?.classList.add('is-guest');
    chip?.setAttribute('aria-label', '加入圣诞夜');
    return;
  }
  chip?.classList.remove('is-guest');
  const animal = getAnimal(state.profile.animalId);
  if (emoji) emoji.innerHTML = avatarMarkup(state.profile.animalId, state.profile.outfitId, { size: 30 });
  if (name) name.textContent = state.profile.name;
  if (caption) caption.textContent = `${animal.name} · ${getOutfit(state.profile.outfitId).name}`;
  chip?.setAttribute('aria-label', `${state.profile.name}，你的形象是${animal.name}加${getOutfit(state.profile.outfitId).name}`);
}

function updateStats() {
  const best = state.guestResults.length
    ? Math.max(...state.guestResults.map((result) => Number(result.score) || 0))
    : null;
  $('#statAnimals').textContent = String(publicTreeUsers().length);
  $('#statGifts').textContent = String(sharedGiftTotal());
  $('#statMatch').textContent = best == null ? '--' : `${best}%`;
}

async function syncExistingProfile() {
  if (!state.profile || mySharedUser()) return;
  if (!remote.connected && sharedStatus !== 'ready') return;
  const outcome = await remote.mutate((draft) => {
    const id = state.profile.id;
    const existing = draft.users[id];
    if (existing?.banned) return { error: 'banned' };
    if (sharedNameConflict(draft, state.profile.name, id)) return { error: 'name-taken' };
    if (sharedComboConflict(draft, state.profile.animalId, state.profile.outfitId, id)) return { error: 'combo-taken' };
    const now = Date.now();
    draft.users[id] = Object.assign({}, existing || {}, {
      id,
      name: state.profile.name,
      nameKey: nameKey(state.profile.name),
      animal: state.profile.animalId,
      outfit: state.profile.outfitId,
      createdAt: existing?.createdAt || now,
      onTree: Boolean(existing?.onTree),
      treeAt: existing?.treeAt || null,
      sendCount: existing?.sendCount || 0,
      lastSendAt: existing?.lastSendAt || null,
      banned: false,
      hidden: false,
      banReason: '',
      bannedAt: null
    });
    return { ok: true };
  });
  if (outcome.error === 'name-taken' || outcome.error === 'combo-taken') {
    showToast('你的旧名字或形象已经被占用了，重新挑一个吧', '❄️');
    openOnboarding({ upgrade: true, forced: true });
  }
}

let sharedSendWarned = false;

async function recordGiftOnTree() {
  if (!state.profile) return { error: 'guest' };
  if (!mySharedUser()) {
    await syncExistingProfile();
    if (!mySharedUser()) return { error: 'not-registered' };
  }
  const outcome = await remote.mutate((draft) => {
    const user = draft.users[state.profile.id];
    if (!user) return { error: 'not-registered' };
    if (user.banned) return { error: 'banned' };
    const first = !user.onTree;
    const now = Date.now();
    user.onTree = true;
    user.treeAt = user.treeAt || now;
    user.sendCount = (Number(user.sendCount) || 0) + 1;
    user.lastSendAt = now;
    return { ok: true, first };
  });
  if (outcome.error === 'banned') {
    showToast('这个账号已经被管理员限制，礼物只保存在本机', '🚫');
    return outcome;
  }
  if (outcome.error) {
    if (!sharedSendWarned) {
      sharedSendWarned = true;
      showToast('公共树暂时没连上，礼物仍保存在这台设备里', '📡');
    }
    return outcome;
  }
  newOrnamentId = state.profile.id;
  renderPublicChrome();
  if (outcome.first) {
    window.setTimeout(() => showToast('你的形象已经在公共圣诞树上亮起来啦', '🌟'), 1300);
  }
  return outcome;
}

function renderHeroAnimal() {
  const root = $('#heroAnimals');
  if (!root) return;
  const users = publicTreeUsers().slice(-3);
  const positions = [
    { x: 31, y: 53 },
    { x: 47, y: 68 },
    { x: 62, y: 58 }
  ];
  if (!users.length) {
    root.innerHTML = `
      <span class="scene-animal is-empty" style="--x:47%;--y:62%;--delay:-1.2s">
        <span class="scene-avatar"><span class="scene-ghost">?</span></span>
        <i>等你上树</i>
      </span>
    `;
    return;
  }
  root.innerHTML = users.map((user, index) => {
    const slot = positions[index % positions.length];
    return `
      <button class="scene-animal" type="button" data-home-person="${esc(user.id)}" style="--x:${slot.x}%;--y:${slot.y}%;--delay:-${index + 1}.2s" aria-label="${esc(user.name)}的${esc(getAnimal(user.animal).name)}在圣诞树上">
        <span class="scene-avatar">${avatarMarkup(user.animal, user.outfit, { size: 54 })}</span>
        <i>${esc(user.name)}</i>
      </button>
    `;
  }).join('');
}

function renderHomeTree() {
  const root = $('#homeTreePeople');
  const live = $('#homeTreeLiveText');
  if (!root) return;
  const users = publicTreeUsers();
  if (live) {
    if (!sharedTree && ['idle', 'connecting'].includes(sharedStatus)) {
      live.textContent = '正在同步今晚的圣诞树…';
    } else {
      live.textContent = users.length
        ? `${users.length} 位朋友正在树上过圣诞`
        : '树上还空着，等第一位送出礼物的人';
    }
  }
  if (!users.length) {
    root.innerHTML = `
      <div class="home-tree-empty">
        <span class="home-tree-empty-mark">✦</span>
        <strong>今晚的第一颗星星，还在路上。</strong>
        <small>领一只小动物，送出第一份礼物，这里就会出现你。</small>
        <button class="text-link light" type="button" data-join-tree>去成为第一位 <svg><use href="#i-arrow"/></svg></button>
      </div>
    `;
    return;
  }
  const visible = users.slice(-12).reverse();
  const rest = users.length - visible.length;
  root.innerHTML = `
    <div class="home-tree-people-grid">
      ${visible.map((user) => `
        <button class="home-person" type="button" data-home-person="${esc(user.id)}" aria-label="${esc(user.name)}，${esc(getAnimal(user.animal).name)}，${esc(getOutfit(user.outfit).name)}">
          ${avatarMarkup(user.animal, user.outfit, { size: 54 })}
          <strong>${esc(user.name)}</strong>
          <small>${esc(getOutfit(user.outfit).name)}</small>
        </button>
      `).join('')}
    </div>
    ${rest > 0 ? `<button class="home-tree-more" type="button" data-route="tree">还有 ${rest} 位在树上 <svg><use href="#i-arrow"/></svg></button>` : ''}
  `;
}

function renderPublicChrome() {
  updateHeader();
  updateStats();
  renderHeroAnimal();
  renderHomeTree();
  if (currentRoute === 'tree') renderTree();
}

let banNoticeShown = false;

function handleSharedUpdate(snapshot, status) {
  sharedTree = snapshot;
  sharedStatus = status;
  renderPublicChrome();
  if (!$('#onboarding').hidden) renderOnboarding();
  const me = mySharedUser();
  if (me?.banned && state.profile && !banNoticeShown) {
    banNoticeShown = true;
    openModal(`
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="banTitle">
        <button class="modal-close" type="button" data-modal-close aria-label="关闭">${icon('close')}</button>
        <span class="kicker">THE TREE HAS A KEEPER</span>
        <h3 id="banTitle">你已经被移出圣诞夜</h3>
        <p>管理员把你的形象从公共圣诞树上取下来了。${me.banReason ? `原因：${esc(me.banReason)}` : '如果你觉得这是误会，可以联系管理员。'}</p>
        <div class="modal-actions"><button class="btn btn-primary" type="button" data-modal-close>${icon('check')}知道了</button></div>
      </div>
    `);
  }
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
let selectedOnboardOutfit = null;
let onboardForced = false;

function makeAccountId() {
  try {
    return `acct-${crypto.randomUUID()}`;
  } catch (error) {
    return uid('acct');
  }
}

function claimedCombos() {
  return new Set(Object.values(sharedTree?.users || {})
    .filter((user) => user.id !== state.profile?.id)
    .map((user) => `${user.animal}:${user.outfit}`));
}

function availableOutfitsFor(animalId) {
  const taken = claimedCombos();
  return OUTFITS.filter((outfit) => !taken.has(`${animalId}:${outfit.id}`));
}

function comboIsTaken(animalId, outfitId) {
  return Boolean(sharedComboConflict(sharedTree, animalId, outfitId, state.profile?.id));
}

function nameProblem(name) {
  if (!name) return '先写下你的名字吧';
  if (!validPlayerName(name)) return '名字需要 2–12 个字，不要带特殊符号';
  if (sharedNameConflict(sharedTree, name, state.profile?.id)) return '这个名字已经被领走了，换一个吧';
  return '';
}

function onboardingTotalClaimed() {
  return Object.keys(sharedTree?.users || {}).filter((id) => id !== state.profile?.id).length;
}

function openOnboarding(options = {}) {
  const overlay = $('#onboarding');
  if (!overlay) return;
  if (state.profile && mySharedUser() && !options.upgrade) {
    showToast('你已经有自己的形象啦，去送一份礼物吧', '🎁');
    return;
  }
  onboardForced = Boolean(options.forced);
  overlay.hidden = false;
  document.body.classList.add('is-locked');
  onboardStep = 1;

  if (state.profile) {
    selectedOnboardAnimal = state.profile.animalId;
    selectedOnboardOutfit = state.profile.outfitId || null;
  } else {
    selectedOnboardAnimal = null;
    selectedOnboardOutfit = null;
  }
  const nameInput = $('#onboardName');
  if (nameInput && state.profile) nameInput.value = state.profile.name;

  if (inviteHost) {
    const copy = $('.onboard-art-copy p');
    if (copy) copy.textContent = `「${inviteHost.name} 也在等你，先领一只小动物吧。」`;
  } else if (pendingGift) {
    const copy = $('.onboard-art-copy p');
    if (copy) copy.textContent = '「有人把一份礼物，悄悄放在了你的门口。」';
  }

  renderOnboarding();
  window.setTimeout(() => nameInput?.focus(), 300);
}

function closeOnboarding() {
  const overlay = $('#onboarding');
  if (!overlay) return;
  overlay.hidden = true;
  if ($('#modalRoot').hidden) document.body.classList.remove('is-locked');
  if (!state.profile) {
    $('#app').hidden = false;
    renderPublicChrome();
  }
}

function onboardingTitleForStep(step) {
  return step === 1
    ? '先领一只<br /><em>属于你的圣诞小动物。</em>'
    : '再给它，<br /><em>挑一套圣诞装扮。</em>';
}

function onboardingLeadForStep(step) {
  return step === 1
    ? '它会是你在今晚的名字。选好动物和装扮后，它们会被保留下来，等你的第一份礼物送出。'
    : '同一只动物，不同的装扮，就是不同的人。动物 + 装扮只属于一个人，选一个还没被领走的吧。';
}

function renderOnboarding() {
  const stepLabel = $('#onboardStepLabel');
  const title = $('#onboardTitle');
  const lead = $('#onboardLead');
  const stepOne = $('#onboardStepOne');
  const stepTwo = $('#onboardStepTwo');
  const next = $('#onboardNext');
  const submit = $('#onboardSubmit');
  const back = $('#onboardBack');
  if (!stepLabel) return;

  stepLabel.textContent = `STEP ${onboardStep} / 2`;
  if (title) title.innerHTML = onboardingTitleForStep(onboardStep);
  if (lead) lead.textContent = onboardingLeadForStep(onboardStep);
  if (stepOne) stepOne.hidden = onboardStep !== 1;
  if (stepTwo) stepTwo.hidden = onboardStep !== 2;
  if (next) next.hidden = onboardStep === 2;
  if (submit) submit.hidden = onboardStep !== 2;
  if (back) back.hidden = onboardStep !== 2;

  if (onboardStep === 2 && selectedOnboardAnimal) {
    const available = availableOutfitsFor(selectedOnboardAnimal);
    if (!selectedOnboardOutfit || comboIsTaken(selectedOnboardAnimal, selectedOnboardOutfit)) {
      selectedOnboardOutfit = available[0]?.id || null;
    }
  }

  renderOnboardAnimals();
  renderOnboardOutfits();
  renderOnboardSummary();
  updateOnboardingNameUI();
}

function renderOnboardAnimals() {
  const picker = $('#animalPicker');
  if (!picker) return;
  picker.innerHTML = ANIMALS.map((animal) => {
    const available = availableOutfitsFor(animal.id);
    const full = available.length === 0;
    const selected = selectedOnboardAnimal === animal.id;
    return `
      <button class="animal-choice${selected ? ' is-selected' : ''}${full ? ' is-full' : ''}" type="button" data-animal="${animal.id}" ${full ? 'disabled' : ''} aria-label="${esc(animal.name)}${full ? '，装扮已经全部被领走' : `，还有 ${available.length} 套装扮可选`}">
        <em>${animal.emoji}</em>
        <span>${esc(animal.name)}</span>
        <i class="claimed-tag">${full ? '已满' : `${available.length}/8`}</i>
      </button>
    `;
  }).join('');
  const claimInfo = $('#animalClaimInfo');
  if (claimInfo) claimInfo.textContent = sharedTree
    ? `已经被领走 ${onboardingTotalClaimed()} 套形象`
    : '正在同步公共树…';
}

function renderOnboardOutfits() {
  const picker = $('#outfitPicker');
  if (!picker) return;
  if (!selectedOnboardAnimal) {
    picker.innerHTML = '';
    return;
  }
  picker.innerHTML = OUTFITS.map((outfit) => {
    const taken = comboIsTaken(selectedOnboardAnimal, outfit.id);
    const selected = selectedOnboardOutfit === outfit.id;
    return `
      <button class="outfit-choice${selected ? ' is-selected' : ''}${taken ? ' is-taken' : ''}" type="button" data-outfit="${outfit.id}" ${taken ? 'disabled' : ''} aria-label="${esc(outfit.name)}${taken ? '，已经被领走' : ''}">
        <span class="outfit-choice-art">${avatarMarkup(selectedOnboardAnimal, outfit.id, { size: 54 })}</span>
        <span class="outfit-choice-name">${esc(outfit.name)}</span>
        <small>${taken ? '已领走' : '可选'}</small>
      </button>
    `;
  }).join('');
  const info = $('#outfitClaimInfo');
  if (info) info.textContent = `${availableOutfitsFor(selectedOnboardAnimal).length} / 8 套装扮可选`;
}

function renderOnboardSummary() {
  const picked = $('#onboardPicked');
  const preview = $('#onboardPreview');
  const animal = selectedOnboardAnimal ? getAnimal(selectedOnboardAnimal) : null;
  const outfit = selectedOnboardOutfit ? getOutfit(selectedOnboardOutfit) : null;
  if (picked) {
    if (animal && outfit) {
      picked.innerHTML = `<span>${avatarMarkup(animal.id, outfit.id, { size: 52 })}</span><span><strong>${esc(animal.name)} · ${esc(outfit.name)}</strong><small>${esc(animal.vibe)}</small></span>`;
    } else if (animal) {
      picked.innerHTML = `<span>${esc(animal.emoji)}</span><span><strong>${esc(animal.name)}</strong><small>再挑一套装扮</small></span>`;
    } else {
      picked.innerHTML = '<span>还没有选择</span><small>先挑一只小动物吧</small>';
    }
  }
  if (preview) {
    if (animal) {
      preview.innerHTML = `${avatarMarkup(animal.id, outfit?.id || 'santa', { size: 112 })}<i>${esc(animal.name)}${outfit ? ` · ${esc(outfit.name)}` : ''}</i>`;
    } else {
      preview.innerHTML = '<span class="onboard-preview-ghost">?</span><i>你的小动物</i>';
    }
  }
}

function updateOnboardingNameUI() {
  const input = $('#onboardName');
  const hint = $('#onboardNameHint');
  const submit = $('#onboardSubmit');
  const next = $('#onboardNext');
  if (!input) return;
  const name = input.value.trim();
  const problem = name ? nameProblem(name) : '';
  if (hint) {
    hint.textContent = problem || (name ? '这个名字可以用' : '2–12 个字，全站只能有一个人用');
    hint.classList.toggle('is-bad', Boolean(problem));
    hint.classList.toggle('is-ok', Boolean(name && !problem));
  }
  if (next) next.disabled = !name || Boolean(problem) || !selectedOnboardAnimal;
  if (submit) submit.disabled = !name || Boolean(problem) || !selectedOnboardAnimal || !selectedOnboardOutfit;
  renderOnboardSummary();
}

function selectOnboardAnimal(animalId) {
  if (!ANIMAL_MAP.has(animalId)) return;
  if (!availableOutfitsFor(animalId).length) {
    showToast('这只小动物的 8 套装扮都已经被领走了，换一只吧', '❄️');
    return;
  }
  selectedOnboardAnimal = animalId;
  selectedOnboardOutfit = null;
  const available = availableOutfitsFor(animalId);
  if (onboardStep === 2) selectedOnboardOutfit = available[0]?.id || null;
  playPop();
  renderOnboarding();
}

function selectOnboardOutfit(outfitId) {
  if (!OUTFIT_MAP.has(outfitId) || !selectedOnboardAnimal) return;
  if (comboIsTaken(selectedOnboardAnimal, outfitId)) {
    showToast('这套装扮刚刚被领走了，换一套吧', '❄️');
    renderOnboarding();
    return;
  }
  selectedOnboardOutfit = outfitId;
  playPop();
  renderOnboarding();
}

function goOnboardingStep2() {
  const input = $('#onboardName');
  const name = input?.value.trim() || '';
  const problem = nameProblem(name);
  if (!name || problem) {
    showToast(problem || '先写下你的名字吧', '✍️');
    input?.focus();
    return;
  }
  if (!selectedOnboardAnimal) {
    showToast('挑一只只属于你的小动物', '🐾');
    return;
  }
  const available = availableOutfitsFor(selectedOnboardAnimal);
  if (!available.length) {
    showToast('这只小动物的装扮都被领走了，换一只吧', '❄️');
    return;
  }
  selectedOnboardOutfit = selectedOnboardOutfit && !comboIsTaken(selectedOnboardAnimal, selectedOnboardOutfit)
    ? selectedOnboardOutfit
    : available[0].id;
  onboardStep = 2;
  playPop();
  renderOnboarding();
}

function backOnboardingStep1() {
  onboardStep = 1;
  renderOnboarding();
}

async function submitOnboarding() {
  const input = $('#onboardName');
  const name = input?.value.trim() || '';
  const problem = nameProblem(name);
  if (!name || problem) {
    showToast(problem || '先写下你的名字吧', '✍️');
    return;
  }
  if (!selectedOnboardAnimal || !selectedOnboardOutfit) {
    showToast('还差一只小动物或一套装扮', '🎁');
    return;
  }
  if (comboIsTaken(selectedOnboardAnimal, selectedOnboardOutfit)) {
    showToast('这套形象刚刚被领走了，换一套吧', '❄️');
    renderOnboarding();
    return;
  }

  const chosenName = name;
  const chosenAnimal = selectedOnboardAnimal;
  const chosenOutfit = selectedOnboardOutfit;
  const button = $('#onboardSubmit');
  const original = button.innerHTML;
  button.disabled = true;
  button.innerHTML = '<span>正在把名字挂上公共树…</span>';

  try {
    await remote.waitReady(7000);
  } catch (error) {
    button.disabled = false;
    button.innerHTML = original;
    showToast('公共圣诞树暂时没有连上，稍后再试一次', '📡');
    return;
  }

  const accountId = state.profile?.id || makeAccountId();
  const outcome = await remote.mutate((draft) => {
    const existing = draft.users[accountId];
    if (existing?.banned) return { error: 'banned' };
    if (sharedNameConflict(draft, chosenName, accountId)) return { error: 'name-taken' };
    if (sharedComboConflict(draft, chosenAnimal, chosenOutfit, accountId)) return { error: 'combo-taken' };
    const now = Date.now();
    draft.users[accountId] = Object.assign({}, existing || {}, {
      id: accountId,
      name: chosenName,
      nameKey: nameKey(chosenName),
      animal: chosenAnimal,
      outfit: chosenOutfit,
      createdAt: existing?.createdAt || now,
      onTree: Boolean(existing?.onTree),
      treeAt: existing?.treeAt || null,
      sendCount: existing?.sendCount || 0,
      lastSendAt: existing?.lastSendAt || null,
      banned: false,
      hidden: false,
      banReason: '',
      bannedAt: null
    });
    return { ok: true };
  });

  button.disabled = false;
  button.innerHTML = original;

  if (outcome.error === 'name-taken') {
    showToast('这个名字刚刚被别人领走了，换一个吧', '❄️');
    onboardStep = 1;
    renderOnboarding();
    $('#onboardName')?.focus();
    return;
  }
  if (outcome.error === 'combo-taken') {
    showToast('这套形象刚刚被领走了，换一套吧', '❄️');
    renderOnboarding();
    return;
  }
  if (outcome.error === 'banned') {
    showToast('这个账号已经被管理员限制，不能再加入', '🚫');
    return;
  }
  if (outcome.error) {
    showToast('公共树好像没接住你，再试一次吧', '📡');
    return;
  }

  state.profile = {
    id: accountId,
    name: chosenName,
    animalId: chosenAnimal,
    outfitId: chosenOutfit
  };
  state.tree = [];
  saveState();

  if (inviteHost) mergeInviteTree();
  const gotGift = pendingGift ? importSharedGift(pendingGift) : false;
  pendingGift = null;

  closeOnboarding();
  $('#app').hidden = false;
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
    showToast(`欢迎 ${name}，送出一份礼物后，你就会出现在公共圣诞树上`, '🎄');
  }

  if (location.hash.includes('gift=')) {
    history.replaceState(null, '', `${location.pathname}${location.search}`);
  }
}

/* ------------------------------------------------------------
   11. Tree
   ------------------------------------------------------------ */

let newOrnamentId = null;

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

function treeMyState() {
  const me = mySharedUser();
  if (!state.profile) return { kind: 'guest' };
  if (!me) return { kind: 'unclaimed' };
  if (me.banned) return { kind: 'banned', user: me };
  if (me.hidden) return { kind: 'hidden', user: me };
  if (me.onTree) return { kind: 'on-tree', user: me };
  return { kind: 'ready', user: me };
}

function renderTree() {
  const users = publicTreeUsers();
  const me = mySharedUser();
  const stateInfo = treeMyState();
  const avatarRoot = $('#myAnimalAvatar');
  const statusBadge = $('#myAnimalStatus');
  const action = $('#treeActionBtn');

  if (avatarRoot) {
    avatarRoot.innerHTML = state.profile
      ? avatarMarkup(state.profile.animalId, state.profile.outfitId, { size: 84 })
      : '<span class="my-animal-ghost">?</span>';
  }
  if (statusBadge) {
    statusBadge.textContent = stateInfo.kind === 'guest'
      ? 'GUEST'
      : stateInfo.kind === 'banned'
        ? 'RESTRICTED'
        : stateInfo.kind === 'hidden'
          ? 'HIDDEN'
          : stateInfo.kind === 'on-tree'
            ? 'ON TREE'
            : 'READY';
  }
  if (state.profile) {
    const animal = getAnimal(state.profile.animalId);
    $('#myAnimalName').textContent = state.profile.name;
    $('#myAnimalVibe').textContent = animal.vibe;
    const outfit = getOutfit(state.profile.outfitId);
    $('#myAnimalOutfit').textContent = `${animal.name} · ${outfit.name}`;
    if (stateInfo.kind === 'banned') {
      $('#myAnimalNote').textContent = `这个账号已经被管理员移出圣诞夜。${me.banReason ? `原因：${me.banReason}` : ''}`;
    } else if (stateInfo.kind === 'hidden') {
      $('#myAnimalNote').textContent = '管理员暂时把你的形象从公共树上取下了；你仍然可以送礼物，但不会显示在树上。';
    } else if (stateInfo.kind === 'on-tree') {
      $('#myAnimalNote').textContent = `你的形象已经挂在公共树上了，今晚送出 ${me.sendCount} 份礼物。`;
    } else {
      $('#myAnimalNote').textContent = '形象已经准备好了。送出第一份礼物后，你就会出现在这棵公共圣诞树上。';
    }
    if (action) {
      action.innerHTML = stateInfo.kind === 'banned'
        ? '<span>查看规则</span><svg><use href="#i-heart"/></svg>'
        : stateInfo.kind === 'hidden'
          ? '<span>继续送礼物</span><svg><use href="#i-gift"/></svg>'
          : stateInfo.kind === 'on-tree'
            ? '<span>再送一份礼物</span><svg><use href="#i-gift"/></svg>'
            : '<span>去送第一份礼物</span><svg><use href="#i-arrow"/></svg>';
      action.dataset.treeAction = stateInfo.kind === 'banned' ? 'rules' : 'gift';
    }
  } else {
    $('#myAnimalName').textContent = '还没加入';
    $('#myAnimalVibe').textContent = '先领一只小动物，再送出第一份礼物。';
    $('#myAnimalOutfit').textContent = '形象 + 装扮，只属于一个人';
    $('#myAnimalNote').textContent = '加入后，你的动物和装扮会被保留；送出礼物后才会出现在公共圣诞树上。';
    if (action) {
      action.innerHTML = '<span>加入圣诞夜</span><svg><use href="#i-arrow"/></svg>';
      action.dataset.treeAction = 'join';
    }
  }

  const ornamentRoot = $('#treeOrnaments');
  if (ornamentRoot) {
    const max = Math.min(users.length, TREE_SLOTS.length);
    ornamentRoot.innerHTML = users.slice(0, max).map((user, index) => {
      const slot = TREE_SLOTS[index] || TREE_SLOTS[0];
      const isMe = Boolean(state.profile && user.id === state.profile.id);
      return `
        <button class="ornament${isMe ? ' is-me' : ''}${newOrnamentId === user.id ? ' is-new' : ''}" type="button"
          data-ornament="${esc(user.id)}"
          style="--x:${slot.x}%;--y:${slot.y}%;--delay:-${(index % 7) * 0.4}s"
          aria-label="${esc(user.name)}，${esc(getAnimal(user.animal).name)}，${esc(getOutfit(user.outfit).name)}">
          <span class="ornament-string"></span>
          <span class="ornament-avatar">${avatarMarkup(user.animal, user.outfit, { size: 58 })}${isMe ? '<i class="ornament-me-badge">YOU</i>' : ''}</span>
          <span class="ornament-label">${esc(user.name)}</span>
        </button>
      `;
    }).join('');
  }

  $('#treeEmptyNote').hidden = users.length > 0;
  $('#treeFootCount').textContent = String(users.length);
  $('#treeStampCount').textContent = String(users.length).padStart(2, '0');
  $('#ornamentListCount').textContent = String(users.length);
  const list = $('#ornamentList');
  if (list) {
    list.innerHTML = users.length
      ? users.map((user) => `
        <div class="ornament-list-row${state.profile && user.id === state.profile.id ? ' is-me' : ''}" data-home-person="${esc(user.id)}">
          ${avatarMarkup(user.animal, user.outfit, { size: 34 })}
          <strong>${esc(user.name)}</strong>
          <small>${esc(getOutfit(user.outfit).name)}</small>
        </div>
      `).join('')
      : '<p class="ornament-list-empty">树上还空着。第一份礼物送出后，第一只小动物就会在这里亮起来。</p>';
  }

  updateStats();
  newOrnamentId = null;
}

function openOrnamentModal(userId) {
  const user = sharedTree?.users?.[userId];
  if (!user) {
    showToast('这个小动物还没回到树上，稍后再看看', '❄️');
    return;
  }
  const animal = getAnimal(user.animal);
  const outfit = getOutfit(user.outfit);
  const isMe = Boolean(state.profile && user.id === state.profile.id);
  openModal(`
    <div class="modal-card ornament-modal" role="dialog" aria-modal="true" aria-labelledby="ornamentTitle">
      <button class="modal-close" type="button" data-modal-close aria-label="关闭">${icon('close')}</button>
      <span class="kicker">A LITTLE ONE ON THE TREE</span>
      <div class="ornament-modal-head">
        <span class="ornament-modal-avatar">${avatarMarkup(user.animal, user.outfit, { size: 92 })}</span>
        <div>
          <h3 id="ornamentTitle">${esc(user.name)}</h3>
          <p>${esc(animal.name)} · ${esc(outfit.name)}</p>
          <small>${user.onTree ? `${formatShortDate(user.treeAt)} 上树 · 送出 ${user.sendCount} 份礼物` : '还没有上树'}</small>
        </div>
      </div>
      <p>${isMe ? '这是你的小动物。它会和新朋友一起，把这棵树慢慢点亮。' : `这是 ${esc(user.name)} 的圣诞形象。每个动物 + 装扮只属于一个人。`}</p>
      <div class="modal-actions">
        ${isMe ? '' : '<button class="btn btn-ghost" type="button" data-report-user="' + esc(user.id) + '">举报这个形象</button>'}
        <button class="btn btn-primary" type="button" data-modal-close>${icon('check')}知道啦</button>
      </div>
    </div>
  `);
  playBell();
}

function openReportModal(userId) {
  const user = sharedTree?.users?.[userId];
  if (!user) return;
  openModal(`
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="reportTitle">
      <button class="modal-close" type="button" data-modal-close aria-label="关闭">${icon('close')}</button>
      <span class="kicker">KEEP THE TREE KIND</span>
      <h3 id="reportTitle">举报 ${esc(user.name)}</h3>
      <p>如果是名字、形象或行为让人不舒服，可以告诉管理员。只有管理员能看到举报内容。</p>
      <label class="field"><span class="field-label">发生了什么？</span>
        <select id="reportReason">
          <option value="名字或内容不合适">名字或内容不合适</option>
          <option value="冒充别人">冒充别人</option>
          <option value="刷屏或捣乱">刷屏或捣乱</option>
          <option value="其他">其他</option>
        </select>
      </label>
      <div class="modal-actions">
        <button class="btn btn-ghost" type="button" data-modal-close style="color:#5d4434;border-color:#d9bc94;background:#fffaf0">先不举报</button>
        <button class="btn btn-danger" type="button" data-submit-report="${esc(user.id)}">提交给管理员</button>
      </div>
    </div>
  `);
}

async function submitReport(userId) {
  const reason = $('#reportReason')?.value || '其他';
  const outcome = await remote.mutate((draft) => {
    if (!draft.users[userId]) return { error: 'missing' };
    draft.reports.push({
      id: uid('report'),
      userId,
      reason,
      at: Date.now(),
      status: 'open'
    });
    if (draft.reports.length > 80) draft.reports = draft.reports.slice(-80);
    return { ok: true };
  });
  if (outcome.error) {
    showToast('举报没有送出去，稍后再试一次', '📡');
    return;
  }
  closeModal();
  showToast('已经告诉管理员啦，谢谢你一起照看这棵树', '🤍');
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
  if (!state.profile) {
    showToast('先领一只小动物，才能把礼物交给圣诞老人', '🎄');
    openOnboarding({ forced: true });
    return;
  }
  if (mySharedUser()?.banned) {
    showToast('这个账号已经被管理员限制，不能再送出公共礼物', '🚫');
    return;
  }
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
    recordGiftOnTree();
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
   14. Christmas traditions & parlour games
   ------------------------------------------------------------ */

let crackerBusy = false;

function renderActivities() {
  renderAdventCalendar();
  renderSecretSanta();
  ensureAdventClock();
}

let adventRefreshTimer = 0;

function adventStartDate(now = new Date()) {
  return new Date(now.getFullYear(), 11, 1, 0, 0, 0, 0);
}

function adventUnlockedCount(now = new Date()) {
  const start = adventStartDate(now);
  const diff = Math.floor((now.getTime() - start.getTime()) / 86400000) + 1;
  return clamp(diff, 0, 24);
}

function adventDayUnlocked(day, now = new Date()) {
  const unlockAt = new Date(now.getFullYear(), 11, day, 0, 0, 0, 0);
  return now.getTime() >= unlockAt.getTime();
}

function adventNextUnlockText(now = new Date()) {
  const unlocked = adventUnlockedCount(now);
  if (unlocked >= 24) return '二十四扇门都已经打开。圣诞快乐。';
  const nextDay = unlocked + 1;
  const unlockAt = new Date(now.getFullYear(), 11, nextDay, 0, 0, 0, 0);
  const diff = Math.max(0, unlockAt.getTime() - now.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const countdown = days > 0 ? `${days} 天 ${hours} 小时` : hours > 0 ? `${hours} 小时 ${minutes} 分钟` : `${Math.max(1, minutes)} 分钟`;
  if (unlocked === 0) return `第一扇门将在 12 月 1 日 00:00 自动解锁，还有 ${countdown}。打开后会一直亮着。`;
  return `下一扇门：12 月 ${nextDay} 日 00:00 自动解锁，还有 ${countdown}。已经打开的门不会再关上。`;
}

function ensureAdventClock() {
  if (adventRefreshTimer) return;
  adventRefreshTimer = window.setInterval(() => {
    if (currentRoute !== 'activities') return;
    const note = $('#adventUnlockNote');
    if (note) note.textContent = adventNextUnlockText();
    const nextCount = adventUnlockedCount();
    const currentDoors = $$('#adventGrid .advent-door:not(.is-locked)').length;
    if (nextCount !== currentDoors) renderAdventCalendar();
  }, 60000);
}

function renderAdventCalendar() {
  const grid = $('#adventGrid');
  if (!grid) return;
  const now = new Date();
  const unlockedCount = adventUnlockedCount(now);
  const opened = new Set(state.adventOpened.filter((day) => adventDayUnlocked(day, now)));
  if (opened.size !== state.adventOpened.length) {
    state.adventOpened = [...opened].sort((a, b) => a - b);
    saveState();
  }
  grid.innerHTML = ADVENT_DAYS.map((entry) => {
    const isOpen = opened.has(entry.day);
    const isUnlocked = entry.day <= unlockedCount;
    const isToday = entry.day === unlockedCount && !isOpen;
    const dateLabel = `12.${String(entry.day).padStart(2, '0')}`;
    if (!isUnlocked) {
      return `
        <button class="advent-door is-locked" type="button" data-advent-day="${entry.day}" aria-label="第 ${entry.day} 扇门将在 12 月 ${entry.day} 日解锁">
          <span class="advent-door-num">${String(entry.day).padStart(2, '0')}</span>
          <span class="advent-door-lock"><svg><use href="#i-lock"/></svg></span>
          <span class="advent-door-country">${dateLabel} 解锁</span>
        </button>
      `;
    }
    return `
      <button class="advent-door${isOpen ? ' is-open' : ''}${isToday ? ' is-today' : ''}" type="button" data-advent-day="${entry.day}" aria-label="${isOpen ? `第 ${entry.day} 扇门已打开：${entry.country}${entry.title}` : `打开第 ${entry.day} 扇门：${entry.country}`}">
        <span class="advent-door-num">${String(entry.day).padStart(2, '0')}</span>
        ${isOpen ? `<span class="advent-door-code">${esc(entry.code)}</span>` : '<span class="advent-door-face">✦</span>'}
        <span class="advent-door-country">${isOpen ? esc(entry.country) : isToday ? '今天可打开' : dateLabel}</span>
      </button>
    `;
  }).join('');
  const progress = $('#adventProgress');
  if (progress) progress.textContent = `已打开 ${opened.size} / 24 · 已解锁 ${unlockedCount}`;
  const note = $('#adventUnlockNote');
  if (note) note.textContent = adventNextUnlockText(now);
}

function openAdventDoor(day) {
  const entry = ADVENT_DAYS.find((item) => item.day === Number(day));
  if (!entry) return;
  if (!adventDayUnlocked(entry.day)) {
    showToast(`第 ${entry.day} 扇门会在 12 月 ${entry.day} 日 00:00 自动解锁`, '🔒');
    return;
  }
  if (!state.adventOpened.includes(entry.day)) {
    state.adventOpened.push(entry.day);
    state.adventOpened.sort((a, b) => a - b);
    saveState();
    renderAdventCalendar();
    playBell();
  }
  openModal(`
    <div class="modal-card advent-modal" role="dialog" aria-modal="true" aria-labelledby="adventModalTitle">
      <button class="modal-close" type="button" data-modal-close aria-label="关闭">${icon('close')}</button>
      <span class="kicker">DAY ${String(entry.day).padStart(2, '0')} · ${esc(entry.country)}</span>
      <div class="advent-modal-head"><span class="advent-modal-flag">${esc(entry.code)}</span><div><h3 id="adventModalTitle">${esc(entry.title)}</h3><p>${esc(entry.country)}的圣诞小传统</p></div></div>
      <p>${esc(entry.text)}</p>
      <div class="advent-try"><span>今晚可以试试</span><strong>${esc(entry.tryIt)}</strong></div>
      <div class="modal-actions"><button class="btn btn-primary" type="button" data-modal-close>${icon('check')}收下这份小传统</button></div>
    </div>
  `);
}

function pullCracker() {
  if (crackerBusy) return;
  crackerBusy = true;
  const stage = $('#crackerStage');
  const reveal = $('#crackerReveal');
  const visual = $('#crackerVisual');
  if (stage) stage.classList.add('is-pulling');
  if (visual) visual.classList.add('is-pulling');
  playWhoosh();
  burstConfetti(36, { x: window.innerWidth * 0.5, y: window.innerHeight * 0.58 });
  const finish = () => {
    const joke = CRACKER_JOKES[Math.floor(Math.random() * CRACKER_JOKES.length)];
    const crown = CRACKER_CROWNS[Math.floor(Math.random() * CRACKER_CROWNS.length)];
    state.crackerCount += 1;
    saveState();
    if (reveal) {
      reveal.hidden = false;
      const crownEl = $('#crackerCrown');
      if (crownEl) {
        crownEl.textContent = '♛';
        crownEl.style.setProperty('--crown-color', crown.color);
      }
      const headline = $('#crackerHeadline');
      if (headline) headline.textContent = `你抽到了${crown.name}`;
      const jokeEl = $('#crackerJoke');
      if (jokeEl) jokeEl.textContent = `${joke.q} ${joke.a}`;
      const fact = $('#crackerFact');
      if (fact) fact.textContent = `这是你今晚第 ${state.crackerCount} 次拉响。纸拉炮由伦敦的 Tom Smith 在 1840 年代发明，传统里装着纸皇冠、笑话和小礼物。`;
    }
    playBell();
    if (stage) stage.classList.remove('is-pulling');
    if (visual) visual.classList.remove('is-pulling');
    crackerBusy = false;
  };
  if (reduceMotion) finish();
  else window.setTimeout(finish, 820);
}

function parseSecretSantaLines(value) {
  const people = [];
  const seen = new Set();
  String(value || '').split(/\r?\n/).forEach((line) => {
    const raw = line.trim();
    if (!raw) return;
    const parts = raw.split(/\s*[|｜]\s*/);
    const name = (parts[0] || '').trim().slice(0, 20);
    const wish = (parts[1] || '').trim().slice(0, 40);
    if (!name) return;
    const key = name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    people.push({ name, wish });
  });
  return people;
}

function shuffleList(list) {
  const copy = list.slice();
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function drawSecretSanta(people) {
  if (people.length < 2) return null;
  for (let attempt = 0; attempt < 1200; attempt += 1) {
    const targets = shuffleList(people.map((person) => person.name));
    if (targets.every((target, index) => target !== people[index].name)) {
      return people.map((person, index) => {
        const target = people.find((candidate) => candidate.name === targets[index]);
        return { from: person.name, to: targets[index], wish: target?.wish || '' };
      });
    }
  }
  return null;
}

function renderSecretSanta() {
  const form = $('#secretSantaForm');
  const result = $('#ssResult');
  if (!form || !result) return;
  const draw = state.secretSanta;
  if (!draw) {
    form.hidden = false;
    result.hidden = true;
    result.innerHTML = '';
    return;
  }
  form.hidden = true;
  result.hidden = false;
  result.innerHTML = `
    <div class="ss-result-head">
      <div><span class="kicker">DRAW COMPLETE</span><h3>抽名字完成。</h3><p>${esc(draw.budget || '预算由你们自己定')} · 名字只保存在这台设备</p></div>
      <button class="btn btn-ghost btn-small" type="button" id="ssRedraw">${icon('refresh')}<span>重新抽名字</span></button>
    </div>
    <div class="ss-grid">
      ${draw.assignment.map((pair) => `
        <div class="ss-slip" data-ss-from="${esc(pair.from)}">
          <button class="ss-slip-cover" type="button" aria-label="拆开 ${esc(pair.from)} 的签">
            <span class="ss-slip-seal">✉</span>
            <strong>${esc(pair.from)}</strong>
            <small>点开查看你要送给谁</small>
          </button>
          <div class="ss-slip-open">
            <span class="ss-slip-label">你要送给</span>
            <strong>${esc(pair.to)}</strong>
            ${pair.wish ? `<p>TA 想要：${esc(pair.wish)}</p>` : '<p>给 TA 挑一份你觉得合适的小礼物。</p>'}
            <small>${esc(draw.budget || '预算自定')}</small>
            <button class="mini-copy" type="button" data-copy-ss="${esc(pair.from)}">${icon('copy')}复制这条签</button>
          </div>
        </div>
      `).join('')}
    </div>
    <p class="ss-note">想换一组？重新抽名字会覆盖这组结果。礼物不需要很贵，匿名和认真更重要。</p>
  `;
}

function handleSecretSantaSubmit(event) {
  event.preventDefault();
  const people = parseSecretSantaLines($('#ssNames').value);
  if (people.length < 2) {
    showToast('至少写两个参与者的名字，才能开始抽签', '🎁');
    $('#ssNames').focus();
    return;
  }
  if (people.length > 30) {
    showToast('一张签最多 30 个人，分两轮玩吧', '❄️');
    return;
  }
  const assignment = drawSecretSanta(people);
  if (!assignment) {
    showToast('这次没抽成，再试一次吧', '🎲');
    return;
  }
  state.secretSanta = {
    participants: people,
    assignment,
    budget: $('#ssBudget').value.trim().slice(0, 20),
    drawnAt: Date.now()
  };
  saveState();
  renderSecretSanta();
  playJingle();
  burstConfetti(42, { x: window.innerWidth * 0.5, y: window.innerHeight * 0.42 });
  showToast(`${people.length} 个人都抽到名字啦，点开自己的那张签`, '🎁');
}

function importSecretSantaFromTree() {
  const names = publicTreeUsers().map((user) => user.name);
  if (!names.length) {
    showToast('公共圣诞树上还没有人，先请大家上树吧', '🌲');
    return;
  }
  $('#ssNames').value = names.map((name) => `${name} | `).join('\n');
  playPop();
  showToast('已经把树上的朋友放进名单，补上心愿就可以抽签', '🐾');
}

function copySecretSantaResult(from) {
  const draw = state.secretSanta;
  const pair = draw?.assignment.find((item) => item.from === from);
  if (!pair) return;
  const text = `${from}，你要送给 ${pair.to} 一份小礼物${draw.budget ? `（预算：${draw.budget}）` : ''}。${pair.wish ? `TA 想要：${pair.wish}。` : ''}别让对方猜到是你。🎄`;
  copyText(text).then((success) => {
    showToast(success ? '这条签已经复制，发给对应的人吧' : '复制失败了，请允许剪贴板权限', success ? '🔗' : '❄️');
  });
}

function resetSecretSanta() {
  const previous = state.secretSanta;
  state.secretSanta = null;
  saveState();
  if (previous) {
    $('#ssNames').value = previous.participants.map((person) => `${person.name}${person.wish ? ` | ${person.wish}` : ''}`).join('\n');
    $('#ssBudget').value = previous.budget || '';
  }
  renderSecretSanta();
  showToast('名字已经收起来，可以换一组人重新抽', '🎲');
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

async function copyTreeLink() {
  const link = `${location.origin}${location.pathname}`;
  const success = await copyText(link);
  showToast(success ? '公共圣诞树链接已复制，发给下一位朋友吧' : '复制失败了，请手动复制地址栏链接', success ? '🎄' : '❄️');
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
  renderHomeTree();
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
  if (!state.profile && (incoming.gift || incoming.invite)) {
    showRoute('home', { instant: true });
    openOnboarding({ forced: true });
    return;
  }
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

    const joinTreeButton = event.target.closest('[data-join-tree]');
    if (joinTreeButton) {
      openOnboarding({ forced: true });
      return;
    }

    const shareTreeButton = event.target.closest('[data-share-tree]');
    if (shareTreeButton) {
      copyTreeLink();
      return;
    }

    const homePerson = event.target.closest('[data-home-person]');
    if (homePerson) {
      openOrnamentModal(homePerson.dataset.homePerson);
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
    if (!state.profile) {
      openOnboarding();
      return;
    }
    showRoute('tree');
    const me = mySharedUser();
    showToast(me?.onTree
      ? `你的 ${getAnimal(state.profile.animalId).name} 正在公共树上等你`
      : '送出一份礼物后，你就会出现在公共树上', '🐾');
  });

  // Onboarding
  $('#animalPicker').addEventListener('click', (event) => {
    const button = event.target.closest('[data-animal]');
    if (button && !button.disabled) selectOnboardAnimal(button.dataset.animal);
  });
  $('#outfitPicker').addEventListener('click', (event) => {
    const button = event.target.closest('[data-outfit]');
    if (button && !button.disabled) selectOnboardOutfit(button.dataset.outfit);
  });
  $('#onboardName').addEventListener('input', updateOnboardingNameUI);
  $('#onboardName').addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    if (onboardStep === 1) goOnboardingStep2();
    else if (!$('#onboardSubmit').disabled) submitOnboarding();
  });
  $('#onboardNext').addEventListener('click', goOnboardingStep2);
  $('#onboardBack').addEventListener('click', backOnboardingStep1);
  $('#onboardSubmit').addEventListener('click', submitOnboarding);
  $('#onboardClose').addEventListener('click', closeOnboarding);
  $('#onboardSkip').addEventListener('click', closeOnboarding);
  $('.onboarding-backdrop').addEventListener('click', closeOnboarding);

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
  $('#treeActionBtn').addEventListener('click', () => {
    const action = $('#treeActionBtn').dataset.treeAction;
    if (action === 'join') {
      openOnboarding({ forced: true });
    } else if (action === 'gift') {
      showRoute('gifts');
    } else {
      const me = mySharedUser();
      showToast(me?.banReason ? `账号受限：${me.banReason}` : '先看看树上的规则，再送出一份礼物吧', '🌙');
    }
  });
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

  // Traditions / parlour games
  $('#adventGrid').addEventListener('click', (event) => {
    const door = event.target.closest('[data-advent-day]');
    if (door) openAdventDoor(door.dataset.adventDay);
  });
  $('#pullCracker').addEventListener('click', pullCracker);
  $('#secretSantaForm').addEventListener('submit', handleSecretSantaSubmit);
  $('#ssImport').addEventListener('click', importSecretSantaFromTree);
  $('#ssResult').addEventListener('click', (event) => {
    const redraw = event.target.closest('#ssRedraw');
    if (redraw) {
      resetSecretSanta();
      return;
    }
    const copyButton = event.target.closest('[data-copy-ss]');
    if (copyButton) {
      copySecretSantaResult(copyButton.dataset.copySs);
      return;
    }
    const cover = event.target.closest('.ss-slip-cover');
    if (cover) {
      const slip = cover.closest('.ss-slip');
      if (slip) {
        slip.classList.add('is-open');
        playPop();
      }
    }
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
      resetStory();
      return;
    }
    const reportButton = event.target.closest('[data-report-user]');
    if (reportButton) {
      openReportModal(reportButton.dataset.reportUser);
      return;
    }
    const submitReportButton = event.target.closest('[data-submit-report]');
    if (submitReportButton) {
      submitReport(submitReportButton.dataset.submitReport);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!$('#modalRoot').hidden) closeModal();
    else if (!$('#onboarding').hidden) closeOnboarding();
  });

  window.addEventListener('hashchange', () => {
    const incoming = readHash();
    if (!state.profile && !incoming.invite && !incoming.gift) return;
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

  remote.connect();
  remote.onState(handleSharedUpdate);

  bindEvents();
  updateSoundButton();

  if (state.profile && inviteHost) mergeInviteTree();
  finishAppBoot();

  remote.waitReady(9000)
    .then(() => syncExistingProfile())
    .catch(() => {});

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
