const api = require('../../utils/api.js');
Page({
  data: { item: null, inheritor: null, myReg: null, showRatingModal: false, rating: 5, comment: '' },
  onLoad(opts) {
    const item = api.getActivity(opts.id);
    this.setData({ item, inheritor: item ? api.getInheritor(item.inheritorId) : null });
    this.loadReg();
  },
  onShow() { this.loadReg(); },
  loadReg() {
    const u = api.getCurrentUser();
    if (u && this.data.item) {
      this.setData({ myReg: api.getMyRegistration(this.data.item.id) });
    }
  },
  doRegister() {
    if (!api.requireLogin()) return;
    wx.showModal({ title: '确认报名', content: '确定报名参加该活动吗？', success: (r) => {
      if (!r.confirm) return;
      const res = api.registerActivity(this.data.item.id);
      if (res.code === 200) {
        wx.showToast({ title: '报名成功', icon: 'success' });
        this.loadReg();
      } else wx.showToast({ title: res.msg, icon: 'none' });
    }});
  },
  doCancel() {
    wx.showModal({ title: '确认取消', content: '确定取消该活动报名吗？', success: (r) => {
      if (!r.confirm) return;
      api.cancelRegistration(this.data.item.id);
      this.loadReg();
      wx.showToast({ title: '已取消', icon: 'none' });
    }});
  },
  goSignin() {
    wx.navigateTo({ url: '/pages/activitySignin/activitySignin?id=' + this.data.item.id });
  },
  showRating() { this.setData({ showRatingModal: true }); },
  closeRating() { this.setData({ showRatingModal: false }); },
  setRating(e) { this.setData({ rating: e.currentTarget.dataset.v }); },
  onComment(e) { this.setData({ comment: e.detail.value }); },
  submitRating() {
    api.reviewActivity(this.data.item.id, this.data.rating, this.data.comment);
    this.setData({ showRatingModal: false });
    wx.showToast({ title: '评价成功', icon: 'success' });
    this.loadReg();
  }
});
