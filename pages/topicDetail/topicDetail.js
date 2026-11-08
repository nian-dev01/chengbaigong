const api = require('../../utils/api.js');
Page({
  data: { topic: null, comments: [], comment: '', favorited: false, liked: false, isOwner: false },
  onLoad(opts) { this.load(opts.id); },
  load(id) {
    const topic = api.getTopic(id);
    const u = api.getCurrentUser();
    const isOwner = !!(u && topic && String(topic.userId) === String(u.id));
    const liked = !!(u && topic && api.isTopicLiked(u.id, id));
    this.setData({ topic, comments: api.listTopicComments(id), isOwner, liked });
    if (u && topic) this.setData({ favorited: api.isFavorite(u.id, 'topic', id) });
  },
  delTopic() {
    wx.showModal({
      title: '删除话题',
      content: '删除后不可恢复，确定删除这条话题吗？',
      confirmText: '删除',
      confirmColor: '#C0392B',
      success: (res) => {
        if (!res.confirm) return;
        const r = api.deleteTopic(this.data.topic.id);
        if (r.code === 200) {
          wx.showToast({ title: '已删除', icon: 'success' });
          setTimeout(() => wx.navigateBack(), 800);
        } else {
          wx.showToast({ title: r.msg, icon: 'none' });
        }
      }
    });
  },
  toggleLike() {
    if (!api.requireLogin()) return;
    const res = api.toggleTopicLike(this.data.topic.id);
    if (res.code === 200)
      this.setData({ 'topic.likes': res.data.likes, liked: res.data.liked });
  },
  toggleFav() {
    if (!api.requireLogin()) return;
    const res = api.toggleFavorite('topic', this.data.topic.id);
    if (res.code === 200) { this.setData({ favorited: res.data.favorited }); wx.showToast({ title: res.data.favorited?'已收藏':'已取消', icon:'none' }); }
  },
  onComment(e) { this.setData({ comment: e.detail.value }); },
  sendComment() {
    if (!api.requireLogin()) return;
    if (!this.data.comment) return wx.showToast({ title: '请输入内容', icon: 'none' });
    const res = api.commentTopic(this.data.topic.id, this.data.comment);
    if (res.code === 200) {
      this.setData({ comment: '' });
      this.load(this.data.topic.id);
      wx.showToast({ title: '评论成功', icon: 'success' });
    }
  }
});
