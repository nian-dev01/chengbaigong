const api = require('../../utils/api.js');
Page({
  data: { form: { realName: '', idCard: '', category: '', intro: '', materials: '' } },
  onInput(e) { this.setData({ ['form.' + e.currentTarget.dataset.field]: e.detail.value }); },
  upload() {
    wx.showToast({ title: '材料上传（模拟）', icon: 'none' });
    this.setData({ 'form.materials': '证明材料_' + Date.now() + '.pdf' });
  },
  submit() {
    const f = this.data.form;
    if (!f.realName || !f.idCard || !f.category || !f.intro) return wx.showToast({ title: '请填写完整信息', icon: 'none' });
    const res = api.submitInheritorApplication(f);
    if (res.code === 200) { wx.showToast({ title: '申请已提交', icon: 'success' }); setTimeout(() => wx.navigateBack(), 1000); }
    else wx.showToast({ title: res.msg, icon: 'none' });
  }
});
