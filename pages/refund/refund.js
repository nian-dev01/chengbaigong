const api = require('../../utils/api.js');
Page({
  data: { orderId: '', reasons: ['不想要了', '商品质量问题', '与描述不符', '发错货', '其他'], reason: '', desc: '' },
  onLoad(opts) { this.setData({ orderId: opts.orderId }); },
  selectReason(e) { this.setData({ reason: e.currentTarget.dataset.v }); },
  onDesc(e) { this.setData({ desc: e.detail.value }); },
  submit() {
    if (!this.data.reason) return wx.showToast({ title: '请选择退款原因', icon: 'none' });
    const res = api.applyRefund(this.data.orderId, this.data.reason + (this.data.desc ? '：' + this.data.desc : ''));
    if (res.code === 200) { wx.showToast({ title: '申请已提交', icon: 'success' }); setTimeout(() => wx.navigateBack(), 1000); }
  }
});
