const api = require('../../../utils/api.js');
Page({
  data: { stats: {} },
  onShow() {
    const u = api.getCurrentUser();
    if (!u || u.role !== 'admin') { wx.redirectTo({ url: '/pages/login/login' }); return; }
    this.setData({ stats: api.getStatistics() });
  },
  go(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }); },
  backHome() { wx.switchTab({ url: '/pages/index/index' }); }
});
