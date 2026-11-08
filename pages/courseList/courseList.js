const api = require('../../utils/api.js');
Page({
  data: { categories: [], activeCat: 0, keyword: '', list: [], mine: false },
  onLoad(opts) {
    if (opts.mine) this.setData({ mine: true });
    this.setData({ categories: api.listCourseCategories() });
    this.load();
  },
  load() {
    let list;
    if (this.data.mine) {
      const u = api.getCurrentUser();
      const orders = api.listFavorites ? [] : [];
      // 已购课程
      const paidCourseIds = (wx.getStorageSync('db_courseOrders') || []).filter(o => o.userId === u.id && o.status === 'paid').map(o => o.courseId);
      list = api.listCourses().filter(c => paidCourseIds.includes(c.id));
    } else {
      const filter = {};
      if (this.data.activeCat) filter.categoryId = this.data.activeCat;
      if (this.data.keyword) filter.keyword = this.data.keyword;
      list = api.listCourses(filter);
    }
    this.setData({ list });
  },
  setCat(e) { this.setData({ activeCat: Number(e.currentTarget.dataset.id) }); this.load(); },
  onSearch(e) { this.setData({ keyword: e.detail.value }); this.load(); },
  goDetail(e) { wx.navigateTo({ url: '/pages/courseDetail/courseDetail?id=' + e.currentTarget.dataset.id }); }
});
