const api = require('../../utils/api.js');
Page({
  data: { categories: [], categoryNames: [], catIndex: 0, title: '', content: '' },
  onLoad() {
    const cats = api.listTopicCategories();
    this.setData({ categories: cats, categoryNames: cats.map(c => c.name) });
  },
  onCat(e) { this.setData({ catIndex: Number(e.detail.value) }); },
  onInput(e) { this.setData({ [e.currentTarget.dataset.field]: e.detail.value }); },
  publish() {
    if (!this.data.categories.length)
      return wx.showToast({ title: '分类未加载，请重启小程序', icon: 'none' });
    if (!this.data.title) return wx.showToast({ title: '请输入标题', icon: 'none' });
    if (!this.data.content) return wx.showToast({ title: '请输入内容', icon: 'none' });
    const res = api.publishTopic({
      categoryId: this.data.categories[this.data.catIndex].id,
      title: this.data.title,
      content: this.data.content
    });
    if (res.code === 200) {
      wx.showToast({ title: '发布成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 800);
    } else wx.showToast({ title: res.msg, icon: 'none' });
  }
});
