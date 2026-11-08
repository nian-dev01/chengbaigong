const api = require('../../utils/api.js');
Page({
  data: { order: null, statusText: '', statusSub: '', logistics: [] },
  onLoad(opts) { this.load(opts.id); },
  onShow() { if (this.data.order) this.load(this.data.order.id); },
  load(id) {
    const order = api.getOrder(id);
    if (!order) return;
    const map = {
      pending: ['待付款', '请尽快完成支付', '💳'],
      paid: ['待发货', '商家正在备货中', '📦'],
      shipped: ['待收货', '商品正在运输中', '🚚'],
      completed: ['已完成', '感谢您的购买', '✨'],
      cancelled: ['已取消', '订单已取消', '❌'],
      refunding: ['退款中', '退款申请处理中', '🔄'],
      refunded: ['已退款', '退款已完成', '💰']
    };
    const [t, s, icon] = map[order.status] || [order.status, '', '📋'];
    this.setData({ order, statusText: t, statusSub: s, statusIcon: icon, logistics: api.getLogistics() });
  },
  pay() { wx.redirectTo({ url: '/pages/payResult/payResult?orderId=' + this.data.order.id }); },
  cancel() {
    wx.showModal({ title: '提示', content: '确认取消该订单？', success: (r) => {
      if (r.confirm) { api.cancelOrder(this.data.order.id); this.load(this.data.order.id); }
    }});
  },
  confirm() {
    wx.showModal({ title: '提示', content: '确认已收到商品？', success: (r) => {
      if (r.confirm) { api.confirmReceive(this.data.order.id); this.load(this.data.order.id); }
    }});
  },
  refund() { wx.navigateTo({ url: '/pages/refund/refund?orderId=' + this.data.order.id }); }
});
