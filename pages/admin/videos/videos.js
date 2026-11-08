const api = require('../../../utils/api.js');
Page({
  data: { list: [], showModal: false, form: {}, typeNames: [], typeIdx: 0 },
  onLoad() {
    const types = api.listVideoTypes();
    this.setData({ typeNames: types.map(t => t.name) });
  },
  onShow() { this.setData({ list: api.listVideos() }); },
  add() { this.setData({ form: { title: '', duration: '00:00', typeId: 1, intro: '', heritageId: 1 }, typeIdx: 0, showModal: true }); },
  edit(e) {
    const f = Object.assign({}, e.currentTarget.dataset.item);
    const types = api.listVideoTypes();
    const idx = types.findIndex(t => t.id === f.typeId);
    this.setData({ form: f, typeIdx: idx >= 0 ? idx : 0, showModal: true });
  },
  del(e) {
    wx.showModal({ title: '提示', content: '删除该视频？', success: (r) => {
      if (r.confirm) { api.adminDeleteVideo(e.currentTarget.dataset.id); this.onShow(); }
    }});
  },
  closeModal() { this.setData({ showModal: false }); },
  onInput(e) { this.setData({ ['form.' + e.currentTarget.dataset.field]: e.detail.value }); },
  onType(e) {
    const idx = Number(e.detail.value);
    const types = api.listVideoTypes();
    this.setData({ typeIdx: idx, 'form.typeId': types[idx].id });
  },
  save() {
    if (!this.data.form.title) return wx.showToast({ title: '请填写标题', icon: 'none' });
    api.adminSaveVideo(this.data.form);
    this.setData({ showModal: false });
    wx.showToast({ title: '保存成功', icon: 'success' });
    this.onShow();
  }
});
