const api = require('../../utils/api.js');
Page({
  data: { order: null, method: 'wechat' },
  onLoad(opts) { this.setData({ order: api.getOrder(opts.orderId) }); },
  selectMethod(e) { this.setData({ method: e.currentTarget.dataset.v }); },
  doPay() {
    wx.showLoading({ title: '支付中...' });
    setTimeout(() => {
      wx.hideLoading();
      api.payOrder(this.data.order.id);
      wx.showToast({ title: '支付成功', icon: 'success' });
      setTimeout(() => wx.redirectTo({ url: '/pages/orderDetail/orderDetail?id=' + this.data.order.id }), 1000);
    }, 1200);
  },
  skip() { wx.redirectTo({ url: '/pages/orderList/orderList' }); }
});
