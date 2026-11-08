const api = require('../../utils/api.js');
Page({
  data: { ids: [], items: [], address: null, addressId: '', goodsTotal: '0.00' },
  onLoad(opts) {
    const ids = opts.ids.split(',').map(Number);
    const cart = api.listCart();
    const items = cart.filter(c => ids.includes(c.id)).map(c => ({ productId: c.productId, name: c.product.name, price: c.product.price, count: c.count, cover: c.product.cover }));
    const total = items.reduce((s, i) => s + i.price * i.count, 0);
    const def = api.getDefaultAddress();
    this.setData({ ids, items, goodsTotal: total.toFixed(2), address: def, addressId: def ? def.id : '' });
  },
  chooseAddress() { wx.navigateTo({ url: '/pages/addressList/addressList?from=order' }); },
  onShow() {
    if (this.data.addressId) {
      const list = api.listAddresses();
      const addr = list.find(a => a.id === this.data.addressId);
      this.setData({ address: addr });
    }
  },
  submitOrder() {
    if (!this.data.addressId) return wx.showToast({ title: '请选择收货地址', icon: 'none' });
    const res = api.createOrder(this.data.ids, this.data.addressId);
    if (res.code === 200) {
      wx.redirectTo({ url: '/pages/payResult/payResult?orderId=' + res.data.id });
    } else wx.showToast({ title: res.msg, icon: 'none' });
  }
});
