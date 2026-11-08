const api = require('../../utils/api.js');
Page({
  data: { list: [], fromOrder: false },
  onLoad(opts) { this.setData({ fromOrder: opts.from === 'order' }); },
  onShow() { this.load(); },
  load() { this.setData({ list: api.listAddresses() }); },
  addAddr() { wx.navigateTo({ url: '/pages/addressEdit/addressEdit' }); },
  editAddr(e) { wx.navigateTo({ url: '/pages/addressEdit/addressEdit?id=' + e.currentTarget.dataset.id }); },
  delAddr(e) {
    wx.showModal({ title: '提示', content: '删除该地址？', success: (r) => {
      if (r.confirm) { api.deleteAddress(e.currentTarget.dataset.id); this.load(); }
    }});
  },
  setDefault(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.list.find(a => a.id === id);
    api.saveAddress(Object.assign({}, item, { isDefault: 1 }));
    this.load();
  },
  selectAddr(e) {
    if (this.data.fromOrder) {
      const pages = getCurrentPages();
      const prev = pages[pages.length - 2];
      if (prev) prev.setData({ addressId: e.currentTarget.dataset.id });
      wx.navigateBack();
    }
  }
});
