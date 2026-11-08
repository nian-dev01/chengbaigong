const api = require('../../utils/api.js');
Page({
  data: { types: [], activeType: 0, keyword: '', list: [] },
  onLoad() { this.setData({ types: api.listVideoTypes() }); this.load(); },
  load() {
    const filter = {};
    if (this.data.activeType) filter.typeId = this.data.activeType;
    if (this.data.keyword) filter.keyword = this.data.keyword;
    this.setData({ list: api.listVideos(filter) });
  },
  setType(e) { this.setData({ activeType: Number(e.currentTarget.dataset.id) }); this.load(); },
  onSearch(e) { this.setData({ keyword: e.detail.value }); this.load(); },
  goDetail(e) { wx.navigateTo({ url: '/pages/videoDetail/videoDetail?id=' + e.currentTarget.dataset.id }); }
});
