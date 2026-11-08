Page({
  goConsult() { wx.switchTab({ url: '/pages/consult/consult' }); },
  goAnnouncement() { wx.navigateTo({ url: '/pages/announcement/announcement' }); }
});
