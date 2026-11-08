const api = require('../../utils/api.js');
Page({
  data: { tab: 0, form: { nickname: '', phone: '' }, oldPwd: '', newPwd: '', newPwd2: '' },
  onLoad(opts) {
    if (opts.tab) this.setData({ tab: Number(opts.tab) });
    const u = api.getCurrentUser();
    if (u) this.setData({ form: { nickname: u.nickname, phone: u.phone } });
  },
  onInput(e) { this.setData({ [e.currentTarget.dataset.field]: e.detail.value }); },
  save() {
    const res = api.updateUser({ nickname: this.data.form.nickname, phone: this.data.form.phone });
    if (res.code === 200) { wx.showToast({ title: '保存成功', icon: 'success' }); setTimeout(() => wx.navigateBack(), 800); }
    else wx.showToast({ title: res.msg, icon: 'none' });
  },
  changePwd() {
    const { oldPwd, newPwd, newPwd2 } = this.data;
    if (!oldPwd || !newPwd) return wx.showToast({ title: '请填写完整', icon: 'none' });
    if (newPwd !== newPwd2) return wx.showToast({ title: '两次密码不一致', icon: 'none' });
    const res = api.changePassword(oldPwd, newPwd);
    if (res.code === 200) { wx.showToast({ title: '修改成功', icon: 'success' }); setTimeout(() => wx.navigateBack(), 800); }
    else wx.showToast({ title: res.msg, icon: 'none' });
  }
});
