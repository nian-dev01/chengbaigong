const api = require('../../utils/api.js');
Page({
  data: { categories: [], activeCat: 0, keyword: '', list: [] },
  onLoad(opts) {
    const cat = opts.categoryId ? Number(opts.categoryId) : 0;
    this.setData({ categories: api.listCategories(), activeCat: cat });
    this.load();
  },
  load() {
    const filter = {};
    if (this.data.activeCat) filter.categoryId = this.data.activeCat;
    if (this.data.keyword) filter.keyword = this.data.keyword;
    this.setData({ list: api.listHeritages(filter) });
  },
  setCat(e) { this.setData({ activeCat: Number(e.currentTarget.dataset.id) }); this.load(); },
  onSearch(e) { this.setData({ keyword: e.detail.value }); this.load(); },
  goDetail(e) { wx.navigateTo({ url: '/pages/heritageDetail/heritageDetail?id=' + e.currentTarget.dataset.id }); }
});
