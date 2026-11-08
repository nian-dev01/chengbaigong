const api = require('../../utils/api.js');
Page({
  data: { status: 'all', list: [] },
  onLoad(opts) { if (opts.status) this.setData({ status: opts.status }); },
  onShow() { this.load(); },
  load() { this.setData({ list: api.listOrders(this.data.status) }); },
  setStatus(e) { this.setData({ status: e.currentTarget.dataset.v }); this.load(); },
  statusText(s) { return { pending: '待付款', paid: '待发货', shipped: '待收货', completed: '已完成', cancelled: '已取消', refunding: '退款中', refunded: '已退款' }[s] || s; },
  statusClass(s) { return s; },
  goDetail(e) { wx.navigateTo({ url: '/pages/orderDetail/orderDetail?id=' + e.currentTarget.dataset.id }); },
  pay(e) {
    const id = e.currentTarget.dataset.id;
    wx.redirectTo({ url: '/pages/payResult/payResult?orderId=' + id });
  },
  cancel(e) {
    wx.showModal({ title: '提示', content: '确认取消该订单？', success: (r) => {
      if (r.confirm) { api.cancelOrder(e.currentTarget.dataset.id); this.load(); wx.showToast({ title: '已取消', icon: 'none' }); }
    }});
  },
  confirm(e) {
    wx.showModal({ title: '提示', content: '确认已收到商品？', success: (r) => {
      if (r.confirm) { api.confirmReceive(e.currentTarget.dataset.id); this.load(); wx.showToast({ title: '已收货', icon: 'success' }); }
    }});
  },
  refund(e) {
    wx.navigateTo({ url: '/pages/refund/refund?orderId=' + e.currentTarget.dataset.id });
  }
});
