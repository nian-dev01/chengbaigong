const api = require('../../../utils/api.js');
Page({
  data: { user: {}, heritageCount: 0, productCount: 0, activityCount: 0, courseCount: 0 },
  onShow() {
    const u = api.getCurrentUser();
    if (!u || u.role !== 'inheritor') { wx.redirectTo({ url: '/pages/login/login' }); return; }
    this.setData({
      user: u,
      heritageCount: api.inheritorListHeritages().length,
      productCount: api.inheritorListProducts().length,
      activityCount: api.inheritorListActivities().length,
      courseCount: api.inheritorListCourses().length
    });
  },
  go(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }); },
  backHome() { wx.switchTab({ url: '/pages/index/index' }); }
});
