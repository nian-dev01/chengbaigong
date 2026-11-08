const api = require('../../../utils/api.js');
Page({
  data: { form: { name: '', category: '', price: '', originalPrice: '', stock: '', intro: '' } },
  onLoad(opts) {
    if (opts.id) {
      const p = api.getProduct(opts.id);
      if (p) this.setData({ form: p });
    }
  },
  onInput(e) { this.setData({ ['form.' + e.currentTarget.dataset.field]: e.detail.value }); },
  save() {
    const f = this.data.form;
    if (!f.name) return wx.showToast({ title: '请输入商品名', icon: 'none' });
    const res = api.inheritorSaveProduct(f);
    if (res.code === 200) { wx.showToast({ title: '保存成功', icon: 'success' }); setTimeout(() => wx.navigateBack(), 800); }
  }
});
