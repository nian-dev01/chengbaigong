// utils/util.js 通用工具
function formatTime(date) {
  if (typeof date === 'number' || typeof date === 'string') date = new Date(date);
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  const h = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${mm}`;
}

function formatDate(date) {
  if (typeof date === 'number' || typeof date === 'string') date = new Date(date);
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function uuid(prefix = '') {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function toast(title, icon = 'none') {
  wx.showToast({ title, icon, duration: 1800 });
}

function showModal(title, content) {
  return new Promise(resolve => {
    wx.showModal({
      title, content,
      success: (res) => resolve(res.confirm)
    });
  });
}

function loadImage(id, fallback = '') {
  // 由于没有真实图片，使用纯色占位（通过wx.createSelectorQuery绘制太复杂），这里统一返回空，页面用view背景色占位
  return fallback || '';
}

// 颜色调色板，用于无图片时展示非遗色块
const COLORS = ['#c8161d', '#d4a017', '#2b7fff', '#18b35c', '#8e44ad', '#e67e22', '#16a085', '#c0392b'];
function colorById(id) {
  let h = 0;
  const s = String(id);
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return COLORS[h % COLORS.length];
}

module.exports = { formatTime, formatDate, uuid, toast, showModal, colorById };
