const api = require('../../utils/api.js');
Page({
  data: { categories: [], activeCat: 0, list: [], myId: null },
  onLoad() { this.setData({ categories: api.listTopicCategories() }); },
  onShow() {
    const u = api.getCurrentUser();
    this.setData({ myId: u ? u.id : null });
    this.load();
  },
  load() {
    const filter = {};
    if (this.data.activeCat) filter.categoryId = this.data.activeCat;
    this.setData({ list: api.listTopics(filter) });
  },
  setCat(e) { this.setData({ activeCat: Number(e.currentTarget.dataset.id) }); this.load(); },
  goDetail(e) { wx.navigateTo({ url: '/pages/topicDetail/topicDetail?id=' + e.currentTarget.dataset.id }); },
  delTopic(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除话题',
      content: '删除后不可恢复，确定删除这条话题吗？',
      confirmText: '删除',
      confirmColor: '#C0392B',
      success: (res) => {
        if (!res.confirm) return;
        const r = api.deleteTopic(id);
        if (r.code === 200) {
          wx.showToast({ title: '已删除', icon: 'success' });
          this.load();
        } else {
          wx.showToast({ title: r.msg, icon: 'none' });
        }
      }
    });
  },
  publish() {
    if (!api.requireLogin()) return;
    wx.navigateTo({ url: '/pages/topicPublish/topicPublish' });
  }
});
