const api = require('../../utils/api.js');
Page({
  data: { item: null, heritage: null, favorited: false, playing: false, progress: 0, timer: null },
  onLoad(opts) {
    const item = api.getVideo(opts.id);
    this.setData({ item, heritage: item ? api.getHeritage(item.heritageId) : null });
    const u = api.getCurrentUser();
    if (u) this.setData({ favorited: api.isFavorite(u.id, 'video', opts.id) });
  },
  togglePlay() {
    const playing = !this.data.playing;
    this.setData({ playing });
    if (playing) {
      const t = setInterval(() => {
        let p = this.data.progress + 2;
        if (p >= 100) { p = 100; clearInterval(this.data.timer); this.setData({ playing: false }); }
        this.setData({ progress: p });
      }, 500);
      this.setData({ timer: t });
    } else {
      clearInterval(this.data.timer);
    }
  },
  toggleFav() {
    if (!api.requireLogin()) return;
    const res = api.toggleFavorite('video', this.data.item.id);
    if (res.code === 200) { this.setData({ favorited: res.data.favorited }); wx.showToast({ title: res.data.favorited ? '已收藏' : '已取消', icon: 'none' }); }
  },
  goHeritage(e) { wx.navigateTo({ url: '/pages/heritageDetail/heritageDetail?id=' + e.currentTarget.dataset.id }); },
  share() { wx.showToast({ title: '分享功能开发中', icon: 'none' }); },
  onUnload() { clearInterval(this.data.timer); }
});
