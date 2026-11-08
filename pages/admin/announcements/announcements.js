const api = require('../../../utils/api.js');
Page({
  data: { list: [], showModal: false, form: {}, typeIdx: 0 },
  onShow() { this.setData({ list: api.listAnnouncements() }); },
  add() { this.setData({ form: { title: '', content: '', type: 'system' }, typeIdx: 0, showModal: true }); },
  edit(e) {
    const f = Object.assign({}, e.currentTarget.dataset.item);
    this.setData({ form: f, typeIdx: f.type === 'activity' ? 1 : 0, showModal: true });
  },
  del(e) {
    wx.showModal({ title: '提示', content: '删除该公告？', success: (r) => {
      if (r.confirm) { api.adminDeleteAnnouncement(e.currentTarget.dataset.id); this.onShow(); }
    }});
  },
  closeModal() { this.setData({ showModal: false }); },
  onInput(e) { this.setData({ ['form.' + e.currentTarget.dataset.field]: e.detail.value }); },
  onType(e) {
    const idx = Number(e.detail.value);
    this.setData({ typeIdx: idx, 'form.type': idx === 1 ? 'activity' : 'system' });
  },
  save() {
    if (!this.data.form.title || !this.data.form.content) return wx.showToast({ title: '请填写完整', icon: 'none' });
    api.adminSaveAnnouncement(this.data.form);
    this.setData({ showModal: false });
    wx.showToast({ title: '保存成功', icon: 'success' });
    this.onShow();
  }
});
