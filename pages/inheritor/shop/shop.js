const api = require('../../../utils/api.js');
Page({
  data: { form: { name: '', region: '', intro: '' } },
  onLoad() {
    const u = api.getCurrentUser();
    if (!u || u.role !== 'inheritor') { wx.redirectTo({ url: '/pages/login/login' }); return; }
    const shop = api.inheritorGetShop();
    if (shop) this.setData({ form: { name: shop.name, region: shop.region, intro: shop.intro } });
  },
  onInput(e) { this.setData({ ['form.' + e.currentTarget.dataset.field]: e.detail.value }); },
  save() {
    if (!this.data.form.name) return wx.showToast({ title: '请输入店铺名', icon: 'none' });
    const res = api.inheritorSaveShop(this.data.form);
    if (res.code === 200) { wx.showToast({ title: '保存成功', icon: 'success' }); setTimeout(() => wx.navigateBack(), 800); }
  }
});
