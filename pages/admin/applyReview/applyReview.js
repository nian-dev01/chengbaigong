const api = require('../../../utils/api.js');
Page({
  data: { list: [] },
  onShow() { this.setData({ list: api.adminListApplications() }); },
  statusText(s) { return { 0: '待审核', 1: '已通过', 2: '已拒绝' }[s]; },
  review(e) {
    const { id, pass } = e.currentTarget.dataset;
    wx.showModal({ title: '确认', content: pass === '1' ? '确认通过该申请？' : '确认拒绝该申请？', success: (r) => {
      if (r.confirm) {
        api.adminReviewApplication(Number(id), pass === '1');
        wx.showToast({ title: '已处理', icon: 'success' });
        this.onShow();
      }
    }});
  }
});
