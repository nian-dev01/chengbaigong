const api = require('../../utils/api.js');
Page({
  data: { cart: [], allSelected: false, total: 0, selectedCount: 0 },
  onShow() { this.load(); },
  load() {
    const cart = api.listCart().map(c => Object.assign({}, c, { selected: true }));
    this.setData({ cart });
    this.calc();
  },
  calc() {
    let total = 0, count = 0;
    this.data.cart.forEach(c => { if (c.selected) { total += c.product.price * c.count; count += c.count; } });
    const all = this.data.cart.length > 0 && this.data.cart.every(c => c.selected);
    this.setData({ total: total.toFixed(2), selectedCount: count, allSelected: all });
  },
  toggleSelect(e) {
    const id = e.currentTarget.dataset.id;
    const cart = this.data.cart.map(c => c.id === id ? Object.assign({}, c, { selected: !c.selected }) : c);
    this.setData({ cart });
    this.calc();
  },
  toggleAll() {
    const all = !this.data.allSelected;
    const cart = this.data.cart.map(c => Object.assign({}, c, { selected: all }));
    this.setData({ cart, allSelected: all });
    this.calc();
  },
  changeCount(e) {
    const id = e.currentTarget.dataset.id;
    const delta = Number(e.currentTarget.dataset.delta);
    const item = this.data.cart.find(c => c.id === id);
    api.updateCart(id, item.count + delta);
    this.load();
  },
  delItem(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({ title: '提示', content: '删除该商品？', success: (r) => {
      if (r.confirm) { api.removeCart(id); this.load(); }
    }});
  },
  checkout() {
    const selected = this.data.cart.filter(c => c.selected);
    if (!selected.length) return wx.showToast({ title: '请选择商品', icon: 'none' });
    const ids = selected.map(c => c.id).join(',');
    wx.navigateTo({ url: '/pages/orderCreate/orderCreate?ids=' + ids });
  },
  goProduct(e) { wx.navigateTo({ url: '/pages/productDetail/productDetail?id=' + e.currentTarget.dataset.id }); },
  goShop() { wx.switchTab({ url: '/pages/shopList/shopList' }); }
});
