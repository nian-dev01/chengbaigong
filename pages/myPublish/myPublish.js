const api = require('../../utils/api.js');
Page({
  data: { list: [] },
  onShow() { this.load(); },
  load() {
    const u = api.getCurrentUser();
    if (u) this.setData({ list: api.listTopics({ userId: u.id }) });
  },
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
  }
});
