const api = require('../../utils/api.js');
Page({
  data: { form: { name: '', phone: '', province: '', city: '', district: '', detail: '', isDefault: 0 } },
  onLoad(opts) {
    if (opts.id) {
      const list = api.listAddresses();
      const addr = list.find(a => a.id === Number(opts.id));
      if (addr) this.setData({ form: addr });
    }
  },
  onInput(e) { this.setData({ ['form.' + e.currentTarget.dataset.field]: e.detail.value }); },
  onDefault(e) { this.setData({ 'form.isDefault': e.detail.value ? 1 : 0 }); },
  save() {
    const f = this.data.form;
    if (!f.name || !f.phone || !f.detail) return wx.showToast({ title: '请填写完整', icon: 'none' });
    if (!/^1\d{10}$/.test(f.phone)) return wx.showToast({ title: '手机号格式错误', icon: 'none' });
    api.saveAddress(f);
    wx.showToast({ title: '保存成功', icon: 'success' });
    setTimeout(() => wx.navigateBack(), 800);
  }
});
