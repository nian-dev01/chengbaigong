const api = require('../../../utils/api.js');
Page({
  data: { list: [], showModal: false, form: {}, levels: ['国家级','世界级','省级','市级'], levelIdx: 0, catNames: [], catIdx: 0 },
  onLoad() {
    const cats = api.listCategories();
    this.setData({ catNames: cats.map(c => c.name) });
  },
  onShow() { this.setData({ list: api.listHeritages() }); },
  add() { this.setData({ form: { name: '', region: '', level: '国家级', categoryId: 1, intro: '', content: '', inheritorId: 1 }, levelIdx: 0, catIdx: 0, showModal: true }); },
  edit(e) {
    const f = Object.assign({}, e.currentTarget.dataset.item);
    const cats = api.listCategories();
    const catIdx = cats.findIndex(c => c.id === f.categoryId);
    const levelIdx = this.data.levels.indexOf(f.level);
    this.setData({ form: f, catIdx: catIdx >= 0 ? catIdx : 0, levelIdx: levelIdx >= 0 ? levelIdx : 0, showModal: true });
  },
  del(e) {
    wx.showModal({ title: '提示', content: '删除该非遗？', success: (r) => {
      if (r.confirm) { api.adminDeleteHeritage(e.currentTarget.dataset.id); this.onShow(); }
    }});
  },
  closeModal() { this.setData({ showModal: false }); },
  onInput(e) { this.setData({ ['form.' + e.currentTarget.dataset.field]: e.detail.value }); },
  onLevel(e) {
    const idx = Number(e.detail.value);
    this.setData({ levelIdx: idx, 'form.level': this.data.levels[idx] });
  },
  onCat(e) {
    const idx = Number(e.detail.value);
    const cats = api.listCategories();
    this.setData({ catIdx: idx, 'form.categoryId': cats[idx].id });
  },
  save() {
    if (!this.data.form.name) return wx.showToast({ title: '请填写名称', icon: 'none' });
    api.adminSaveHeritage(this.data.form);
    this.setData({ showModal: false });
    wx.showToast({ title: '保存成功', icon: 'success' });
    this.onShow();
  }
});
