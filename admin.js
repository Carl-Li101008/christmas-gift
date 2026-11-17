'use strict';

/* The admin passcode is not stored here, only its SHA-256 hash. */
const ADMIN_HASH = 'a1d04719fb46008c4792c67742369ec08dd9c97ec8868251d6d39be93768d3f5';
const ADMIN_SESSION_KEY = 'merry-bright-admin-v1';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

let tab = 'tree';
let search = '';
let adminModalAction = null;
let toastTimer = 0;

function escHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(timestamp) {
  if (!timestamp) return '—';
  const date = new Date(timestamp);
  return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function toast(message) {
  const root = $('#adminToast');
  if (!root) return;
  root.textContent = message;
  root.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => root.classList.remove('is-show'), 2600);
}

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function updateConnection(status) {
  const root = $('#connectionStatus');
  if (!root) return;
  const label = root.querySelector('span');
  root.classList.remove('is-live', 'is-offline');
  if (status === 'ready') {
    root.classList.add('is-live');
    label.textContent = '实时同步中';
  } else if (status === 'cached') {
    label.textContent = '缓存快照';
  } else if (status === 'connecting') {
    label.textContent = '连接公共树…';
  } else {
    root.classList.add('is-offline');
    label.textContent = '未连接';
  }
}

function allUsers() {
  return Object.values(remote.snapshot?.users || {});
}

function openReports() {
  return (remote.snapshot?.reports || []).filter((report) => report.status === 'open');
}

function showLogin() {
  $('#loginView').hidden = false;
  $('#dashView').hidden = true;
  $('#passInput')?.focus();
}

function showDashboard() {
  $('#loginView').hidden = true;
  $('#dashView').hidden = false;
  remote.connect();
  remote.onState((snapshot, status) => {
    updateConnection(status);
    render();
  });
  updateConnection(remote.status);
  render();
}

async function handleLogin(event) {
  event.preventDefault();
  const input = $('#passInput');
  const error = $('#loginError');
  const value = input?.value || '';
  if (!value) {
    if (error) error.hidden = false;
    input?.focus();
    return;
  }
  const digest = await sha256(value.trim());
  if (digest !== ADMIN_HASH) {
    if (error) error.hidden = false;
    input.value = '';
    input.focus();
    return;
  }
  sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
  if (error) error.hidden = true;
  showDashboard();
}

function memberStatus(user) {
  if (user.banned) return { key: 'banned', label: '已封禁', className: 'is-banned' };
  if (user.hidden) return { key: 'hidden', label: '已隐藏', className: 'is-hidden' };
  if (user.onTree) return { key: 'tree', label: '在树上', className: '' };
  return { key: 'ready', label: '未上树', className: '' };
}

function renderStats() {
  const users = allUsers();
  const visible = users.filter((user) => user.onTree && !user.banned && !user.hidden);
  const banned = users.filter((user) => user.banned);
  const reports = openReports();
  $('#statTotal').textContent = String(users.length);
  $('#statOnTree').textContent = String(visible.length);
  $('#statBanned').textContent = String(banned.length);
  $('#statReports').textContent = String(reports.length);
  $('#tabTreeCount').textContent = String(users.filter((user) => !user.banned).length);
  $('#tabBannedCount').textContent = String(banned.length);
  $('#tabReportCount').textContent = String(reports.length);
}

function memberCard(user) {
  const animal = getAnimal(user.animal);
  const outfit = getOutfit(user.outfit);
  const status = memberStatus(user);
  const dateLabel = user.onTree && user.treeAt ? `上树 ${formatDate(user.treeAt)}` : `领取 ${formatDate(user.createdAt)}`;
  return `
    <article class="member ${status.className}">
      <div class="member-head">
        ${avatarMarkup(user.animal, user.outfit, { size: 48 })}
        <div class="member-id">
          <h3>${escHtml(user.name)}</h3>
          <p>${escHtml(animal.name)} · ${escHtml(outfit.name)}</p>
        </div>
        <span class="member-status">${status.label}</span>
      </div>
      <div class="member-meta">
        <span>送出 ${user.sendCount} 份</span>
        <span>${dateLabel}</span>
        <span title="${escHtml(user.id)}">ID ${escHtml(user.id.slice(-8))}</span>
      </div>
      <div class="member-actions">
        ${user.banned
          ? `<button class="mini-btn is-good" type="button" data-action="unban" data-user="${escHtml(user.id)}">解除封禁</button>`
          : `<button class="mini-btn is-danger" type="button" data-action="ban" data-user="${escHtml(user.id)}">封禁</button>
             <button class="mini-btn" type="button" data-action="${user.hidden ? 'unhide' : 'hide'}" data-user="${escHtml(user.id)}">${user.hidden ? '恢复到树上' : '暂时隐藏'}</button>`}
      </div>
    </article>
  `;
}

function filteredUsers() {
  const users = allUsers().filter((user) => (tab === 'banned' ? user.banned : !user.banned));
  const term = search.trim().toLowerCase();
  if (!term) return users.sort((a, b) => (b.treeAt || b.createdAt) - (a.treeAt || a.createdAt));
  return users
    .filter((user) => `${user.name} ${getAnimal(user.animal).name} ${getOutfit(user.outfit).name}`.toLowerCase().includes(term))
    .sort((a, b) => (b.treeAt || b.createdAt) - (a.treeAt || a.createdAt));
}

function renderMembers() {
  const grid = $('#memberGrid');
  const empty = $('#memberEmpty');
  if (!grid) return;
  const users = filteredUsers();
  grid.innerHTML = users.map(memberCard).join('');
  if (empty) empty.hidden = users.length > 0;
  const title = $('#membersPanel h2');
  if (title) title.textContent = tab === 'banned' ? '封禁名单' : '全部成员';
}

function reportCard(report) {
  const user = remote.snapshot?.users?.[report.userId];
  if (!user) return '';
  return `
    <article class="report">
      ${avatarMarkup(user.animal, user.outfit, { size: 38 })}
      <div class="report-copy">
        <strong>${escHtml(user.name)}</strong>
        <p>${escHtml(report.reason)}</p>
        <small>${formatDate(report.at)} · ${escHtml(getAnimal(user.animal).name)} · ${escHtml(getOutfit(user.outfit).name)}</small>
      </div>
      <div class="report-actions">
        <button class="mini-btn" type="button" data-action="resolve-report" data-report="${escHtml(report.id)}">忽略</button>
        <button class="mini-btn is-danger" type="button" data-action="ban-report" data-report="${escHtml(report.id)}" data-user="${escHtml(user.id)}">封禁并处理</button>
      </div>
    </article>
  `;
}

function renderReports() {
  const list = $('#reportList');
  const empty = $('#reportEmpty');
  if (!list) return;
  const reports = openReports();
  list.innerHTML = reports.map(reportCard).filter(Boolean).join('');
  if (empty) empty.hidden = reports.length > 0;
}

function render() {
  renderStats();
  const showReports = tab === 'reports';
  $('#membersPanel').hidden = showReports;
  $('#reportsPanel').hidden = !showReports;
  if (showReports) {
    renderReports();
  } else {
    renderMembers();
  }
  $$('.tab').forEach((button) => button.classList.toggle('is-active', button.dataset.tab === tab));
}

function openBanModal(userId, reportId = null) {
  const user = remote.snapshot?.users?.[userId];
  if (!user) return;
  adminModalAction = { type: 'ban', userId, reportId };
  $('#adminModalTitle').textContent = `封禁 ${user.name}？`;
  $('#adminModalCopy').textContent = '封禁后，这个形象会立刻从公共树上消失，也无法再送出礼物。人物记录和名字仍会保留。';
  $('#banReasonInput').value = '';
  $('#adminModal').hidden = false;
  $('#banReasonInput').focus();
}

function closeAdminModal() {
  $('#adminModal').hidden = true;
  adminModalAction = null;
}

async function runAction(mutator, successMessage) {
  const outcome = await remote.mutate(mutator);
  if (outcome.error) {
    toast(outcome.error === 'offline' ? '公共树暂时没连上，稍后再试' : '操作没有完成，请重试');
    return false;
  }
  toast(successMessage);
  return true;
}

async function handleMemberAction(action, userId) {
  const user = remote.snapshot?.users?.[userId];
  if (!user) return;
  if (action === 'ban') {
    openBanModal(userId);
    return;
  }
  if (action === 'unban') {
    await runAction((draft) => {
      if (!draft.users[userId]) return { error: 'missing' };
      draft.users[userId].banned = false;
      draft.users[userId].banReason = '';
      draft.users[userId].bannedAt = null;
      return { ok: true };
    }, `已解除 ${user.name} 的封禁`);
    return;
  }
  if (action === 'hide' || action === 'unhide') {
    const hidden = action === 'hide';
    await runAction((draft) => {
      if (!draft.users[userId]) return { error: 'missing' };
      draft.users[userId].hidden = hidden;
      return { ok: true };
    }, hidden ? `已把 ${user.name} 暂时从树上取下` : `已把 ${user.name} 恢复到树上`);
    return;
  }
}

async function confirmBan() {
  if (!adminModalAction || adminModalAction.type !== 'ban') return;
  const reason = $('#banReasonInput').value.trim() || '管理员处理';
  const { userId, reportId } = adminModalAction;
  const user = remote.snapshot?.users?.[userId];
  closeAdminModal();
  const success = await runAction((draft) => {
    if (!draft.users[userId]) return { error: 'missing' };
    draft.users[userId].banned = true;
    draft.users[userId].banReason = reason;
    draft.users[userId].bannedAt = Date.now();
    draft.reports.forEach((report) => {
      if (report.userId === userId) report.status = 'resolved';
    });
    return { ok: true };
  }, `已封禁 ${user?.name || '该成员'}`);
  if (success && reportId) render();
}

async function handleReportAction(action, reportId, userId) {
  if (action === 'ban-report') {
    openBanModal(userId, reportId);
    return;
  }
  if (action === 'resolve-report') {
    await runAction((draft) => {
      const report = draft.reports.find((item) => item.id === reportId);
      if (!report) return { error: 'missing' };
      report.status = 'resolved';
      return { ok: true };
    }, '已忽略这条举报');
  }
}

function exportData() {
  const data = remote.snapshot || remote.emptySharedState();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  anchor.href = url;
  anchor.download = `merry-bright-tree-${date}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
  toast('数据已导出');
}

function bind() {
  $('#loginForm').addEventListener('submit', handleLogin);
  $('#logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    location.reload();
  });
  $('#exportBtn').addEventListener('click', exportData);
  $('#searchInput').addEventListener('input', (event) => {
    search = event.target.value;
    if (tab === 'reports') return;
    renderMembers();
  });
  $$('.tab').forEach((button) => {
    button.addEventListener('click', () => {
      tab = button.dataset.tab;
      search = '';
      $('#searchInput').value = '';
      render();
    });
  });
  $('#memberGrid').addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    handleMemberAction(button.dataset.action, button.dataset.user);
  });
  $('#reportList').addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    handleReportAction(button.dataset.action, button.dataset.report, button.dataset.user);
  });
  $('#modalCancel').addEventListener('click', closeAdminModal);
  $('#modalConfirm').addEventListener('click', confirmBan);
  $('#adminModal').addEventListener('click', (event) => {
    if (event.target === $('#adminModal')) closeAdminModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAdminModal();
  });
}

function boot() {
  bind();
  if (sessionStorage.getItem(ADMIN_SESSION_KEY) === '1') {
    showDashboard();
  } else {
    showLogin();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
