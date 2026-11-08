const api = require('../../utils/api.js');
Page({
  data: { shop: null, products: [] },
  onLoad(opts) {
    const shop = api.getShop(opts.id);
    this.setData({ shop, products: api.listShopProducts(opts.id) });
  },
  goProduct(e) { wx.navigateTo({ url: '/pages/productDetail/productDetail?id=' + e.currentTarget.dataset.id }); }
});
