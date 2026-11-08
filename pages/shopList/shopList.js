const api = require('../../utils/api.js');
Page({
  data: { keyword: '', tab: 'product', shops: [], products: [] },
  onShow() { this.load(); },
  load() {
    this.setData({
      shops: api.listShops({ keyword: this.data.keyword }),
      products: api.listProducts({ keyword: this.data.keyword })
    });
  },
  setTab(e) { this.setData({ tab: e.currentTarget.dataset.v }); },
  onSearch(e) { this.setData({ keyword: e.detail.value }); this.load(); },
  goShop(e) { wx.navigateTo({ url: '/pages/shopDetail/shopDetail?id=' + e.currentTarget.dataset.id }); },
  goProduct(e) { wx.navigateTo({ url: '/pages/productDetail/productDetail?id=' + e.currentTarget.dataset.id }); }
});
