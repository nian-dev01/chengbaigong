const api = require('../../../utils/api.js');
Page({
  data: { list: [] },
  onShow() { this.setData({ list: api.inheritorListProducts() }); },
  add() { wx.navigateTo({ url: '/pages/inheritor/productEdit/productEdit' }); },
  edit(e) { wx.navigateTo({ url: '/pages/inheritor/productEdit/productEdit?id=' + e.currentTarget.dataset.id }); },
  del(e) {
    wx.showModal({ title: '提示', content: '删除该商品？', success: (r) => {
      if (r.confirm) { api.inheritorDeleteProduct(e.currentTarget.dataset.id); this.onShow(); }
    }});
  }
});
