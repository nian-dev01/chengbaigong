const db = require('../../../utils/db.js');
const api = require('../../../utils/api.js');
Page({
  data: { list: [] },
  onShow() {
    // 显示所有话题（包括待审核和已通过），按时间倒序
    const list = db.query('topics').sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
    this.setData({ list });
  },
  review(e) {
    const { id, pass } = e.currentTarget.dataset;
    api.adminReviewTopic(Number(id), pass === '1');
    wx.showToast({ title: pass === '1' ? '已通过' : '已拒绝', icon: 'success' });
    this.onShow();
  }
});
