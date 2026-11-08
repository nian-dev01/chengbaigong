const api = require('../../../utils/api.js');
Page({
  data: { list: [] },
  onShow() { this.setData({ list: api.adminListUsers() }); },
  roleText(r) { return { user: '普通用户', inheritor: '传承人', admin: '管理员' }[r] || r; },
  toggle(e) {
    api.adminToggleUserStatus(e.currentTarget.dataset.id);
    wx.showToast({ title: '已更新', icon: 'success' });
    this.onShow();
  }
});
