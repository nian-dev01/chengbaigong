const api = require('../../../utils/api.js');
Page({
  data: { form: { name: '', title: '', category: '', region: '', phone: '', intro: '' } },
  onLoad() {
    const u = api.getCurrentUser();
    if (!u || u.role !== 'inheritor') { wx.redirectTo({ url: '/pages/login/login' }); return; }
    const inh = (api.listInheritors() || []).find(i => i.userId === u.id);
    if (inh) this.setData({ form: inh });
  },
  onInput(e) { this.setData({ ['form.' + e.currentTarget.dataset.field]: e.detail.value }); },
  save() {
    const res = api.inheritorUpdateInfo(this.data.form);
    if (res.code === 200) { wx.showToast({ title: '保存成功', icon: 'success' }); setTimeout(() => wx.navigateBack(), 800); }
  }
});
