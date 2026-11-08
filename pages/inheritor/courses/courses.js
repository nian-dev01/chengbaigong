const api = require('../../../utils/api.js');
Page({
  data: { list: [], showModal: false, form: {}, catNames: [], catIdx: 0 },
  onLoad() {
    const cats = api.listCourseCategories();
    this.setData({ catNames: cats.map(c => c.name) });
  },
  onShow() { this.setData({ list: api.inheritorListCourses() }); },
  add() { this.setData({ form: { title: '', teacher: '', categoryId: 1, price: 0, lessons: 0, intro: '' }, catIdx: 0, showModal: true }); },
  edit(e) {
    const f = Object.assign({}, e.currentTarget.dataset.item);
    const cats = api.listCourseCategories();
    const idx = cats.findIndex(c => c.id === f.categoryId);
    this.setData({ form: f, catIdx: idx >= 0 ? idx : 0, showModal: true });
  },
  del(e) {
    wx.showModal({ title: '提示', content: '删除该课程？', success: (r) => {
      if (r.confirm) { api.adminDeleteCourse(e.currentTarget.dataset.id); this.onShow(); }
    }});
  },
  closeModal() { this.setData({ showModal: false }); },
  onCat(e) {
    const idx = Number(e.detail.value);
    const cats = api.listCourseCategories();
    this.setData({ catIdx: idx, 'form.categoryId': cats[idx].id });
  },
  onInput(e) { this.setData({ ['form.' + e.currentTarget.dataset.field]: e.detail.value }); },
  save() {
    if (!this.data.form.title) return wx.showToast({ title: '请填写标题', icon: 'none' });
    api.inheritorSaveCourse(this.data.form);
    this.setData({ showModal: false });
    wx.showToast({ title: '保存成功', icon: 'success' });
    this.onShow();
  }
});
