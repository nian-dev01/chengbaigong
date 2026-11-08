const api = require('../../utils/api.js');
Page({
  data: { item: null, inheritor: null, favorited: false },
  onLoad(opts) {
    const id = opts.id;
    const item = api.getHeritage(id);
    this.setData({
      item,
      inheritor: item ? api.getInheritor(item.inheritorId) : null
    });
    const u = api.getCurrentUser();
    if (u) this.setData({ favorited: api.isFavorite(u.id, 'heritage', id) });
  },
  toggleFav() {
    if (!api.requireLogin()) return;
    const res = api.toggleFavorite('heritage', this.data.item.id);
    if (res.code === 200) {
      this.setData({ favorited: res.data.favorited });
      wx.showToast({ title: res.data.favorited ? '已收藏' : '已取消', icon: 'none' });
    }
  },
  share() { wx.showToast({ title: '分享功能开发中', icon: 'none' }); },
  goInheritor(e) {
    wx.showToast({ title: '传承人：' + this.data.inheritor.name, icon: 'none' });
  },
  consult() {
    if (!api.requireLogin()) return;
    wx.switchTab({ url: '/pages/consult/consult' });
  },
  onShareAppMessage() {
    return { title: this.data.item.name, path: '/pages/heritageDetail/heritageDetail?id=' + this.data.item.id };
  }
});
