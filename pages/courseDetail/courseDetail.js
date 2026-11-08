const api = require('../../utils/api.js');
Page({
  data: { item: null, chapters: [], bought: false, favorited: false, progressMap: {} },
  onLoad(opts) {
    const item = api.getCourse(opts.id);
    this.setData({
      item,
      chapters: api.listCourseChapters(opts.id),
      bought: api.isCourseBought(opts.id),
      progressMap: api.getLearnProgress(opts.id)
    });
    const u = api.getCurrentUser();
    if (u) this.setData({ favorited: api.isFavorite(u.id, 'course', opts.id) });
  },
  toggleFav() {
    if (!api.requireLogin()) return;
    const res = api.toggleFavorite('course', this.data.item.id);
    if (res.code === 200) { this.setData({ favorited: res.data.favorited }); wx.showToast({ title: res.data.favorited?'已收藏':'已取消', icon:'none' }); }
  },
  buyCourse() {
    if (!api.requireLogin()) return;
    const price = this.data.item.price;
    const content = price > 0 ? `确认支付 ¥${price} 购买该课程？` : '确认免费领取该课程？';
    wx.showModal({ title: '购买课程', content, success: (r) => {
      if (!r.confirm) return;
      const res = api.buyCourse(this.data.item.id);
      if (res.code === 200) { wx.showToast({ title: '购买成功', icon: 'success' }); this.setData({ bought: true }); }
      else wx.showToast({ title: res.msg, icon: 'none' });
    }});
  },
  goLearn(e) {
    const id = this.data.item.id;
    const chapterId = e.currentTarget.dataset.chapter;
    const ch = this.data.chapters.find(c => c.id === chapterId);
    if (!this.data.bought && ch && !ch.free) {
      return wx.showToast({ title: '请先购买课程', icon: 'none' });
    }
    wx.navigateTo({ url: '/pages/courseLearn/courseLearn?courseId=' + id + '&chapterId=' + chapterId });
  }
});
