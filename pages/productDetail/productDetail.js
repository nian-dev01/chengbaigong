const api = require("../../utils/api.js");
Page({
  data: { item: null, shop: null, favorited: false },
  onLoad(opts) {
    const item = api.getProduct(opts.id);
    this.setData({ item, shop: item ? api.getShop(item.shopId) : null });
    const u = api.getCurrentUser();
    if (u)
      this.setData({ favorited: api.isFavorite(u.id, "product", opts.id) });
  },
  goShop() {
    wx.navigateTo({
      url: "/pages/shopDetail/shopDetail?id=" + this.data.item.shopId,
    });
  },
  goCart() {
    wx.navigateTo({ url: "/pages/cart/cart" });
  },
  toggleFav() {
    if (!api.requireLogin()) return;
    const res = api.toggleFavorite("product", this.data.item.id);
    if (res.code === 200) {
      this.setData({ favorited: res.data.favorited });
      wx.showToast({
        title: res.data.favorited ? "已收藏" : "已取消",
        icon: "none",
      });
    }
  },
  addCart() {
    if (!api.requireLogin()) return;
    const res = api.addToCart(this.data.item.id, 1);
    if (res.code === 200)
      wx.showToast({ title: "已加入购物车", icon: "success" });
  },
  buyNow() {
    if (!api.requireLogin()) return;
    api.addToCart(this.data.item.id, 1);
    // 直接跳到确认订单，带上该商品
    const cart = api.listCart();
    const myItem = cart.find((c) => c.productId === this.data.item.id);
    if (myItem) {
      wx.navigateTo({ url: "/pages/orderCreate/orderCreate?ids=" + myItem.id });
    }
  },
});
