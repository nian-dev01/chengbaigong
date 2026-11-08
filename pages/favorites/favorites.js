const api = require('../../utils/api.js');
Page({
  data: { type: 'heritage', list: [] },
  onShow() { this.load(); },
  load() {
    const favs = api.listFavorites(this.data.type);
    const ids = favs.map(f => f.targetId);
    let list = [];
    if (this.data.type === 'heritage') list = ids.map(id => api.getHeritage(id)).filter(Boolean);
    else if (this.data.type === 'video') list = ids.map(id => api.getVideo(id)).filter(Boolean);
    else if (this.data.type === 'course') list = ids.map(id => api.getCourse(id)).filter(Boolean);
    else if (this.data.type === 'topic') list = ids.map(id => api.getTopic(id)).filter(Boolean);
    else if (this.data.type === 'product') list = ids.map(id => api.getProduct(id)).filter(Boolean);
    this.setData({ list });
  },
  setType(e) { this.setData({ type: e.currentTarget.dataset.v }); this.load(); },
  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    const map = { heritage: 'heritageDetail', video: 'videoDetail', course: 'courseDetail', topic: 'topicDetail', product: 'productDetail' };
    wx.navigateTo({ url: `/pages/${map[this.data.type]}/${map[this.data.type]}?id=${id}` });
  }
});
