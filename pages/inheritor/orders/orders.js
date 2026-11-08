const api = require('../../../utils/api.js');
Page({
  data: { list: [] },
  onShow() { this.setData({ list: api.inheritorListOrders() }); },
  statusText(s) { return { pending: '待付款', paid: '待发货', shipped: '已发货', completed: '已完成', cancelled: '已取消' }[s] || s; },
  ship(e) {
    api.inheritorShipOrder(e.currentTarget.dataset.id);
    wx.showToast({ title: '已发货', icon: 'success' });
    this.onShow();
  }
});
