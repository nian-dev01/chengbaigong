const api = require('../../../utils/api.js');
Page({
  data: { list: [], showModal: false, form: {} },
  onShow() { this.setData({ list: api.listActivities() }); },
  add() { this.setData({ form: { title: '', region: '', address: '', startTime: '', endTime: '', maxPeople: 20, intro: '', inheritorId: 1 }, showModal: true }); },
  edit(e) { this.setData({ form: Object.assign({}, e.currentTarget.dataset.item), showModal: true }); },
  del(e) {
    wx.showModal({ title: '提示', content: '删除该活动？', success: (r) => {
      if (r.confirm) { api.adminDeleteActivity(e.currentTarget.dataset.id); this.onShow(); }
    }});
  },
  closeModal() { this.setData({ showModal: false }); },
  onInput(e) { this.setData({ ['form.' + e.currentTarget.dataset.field]: e.detail.value }); },
  save() {
    if (!this.data.form.title) return wx.showToast({ title: '请填写标题', icon: 'none' });
    api.adminSaveActivity(this.data.form);
    this.setData({ showModal: false });
    wx.showToast({ title: '保存成功', icon: 'success' });
    this.onShow();
  }
});
