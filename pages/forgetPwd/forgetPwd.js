const api = require('../../utils/api.js');
Page({
  data: { username: '', phone: '', code: '', password: '', codeText: '获取验证码', sentCode: '' },
  onInput(e) { this.setData({ [e.currentTarget.dataset.field]: e.detail.value }); },
  sendCode() {
    if (!this.data.phone) return wx.showToast({ title: '请输入手机号', icon: 'none' });
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    this.setData({ sentCode: code, codeText: '已发送' });
    wx.showToast({ title: '验证码：' + code, icon: 'none', duration: 3000 });
    let t = 60;
    const timer = setInterval(() => {
      t--;
      if (t <= 0) { clearInterval(timer); this.setData({ codeText: '重新获取' }); }
      else this.setData({ codeText: t + 's' });
    }, 1000);
  },
  doReset() {
    const { username, phone, code, password, sentCode } = this.data;
    if (!username || !phone || !code || !password) return wx.showToast({ title: '请填写完整', icon: 'none' });
    if (code !== sentCode) return wx.showToast({ title: '验证码错误', icon: 'none' });
    const res = api.resetPassword(username, phone, password);
    if (res.code !== 200) return wx.showToast({ title: res.msg, icon: 'none' });
    wx.showToast({ title: '密码已重置', icon: 'success' });
    setTimeout(() => wx.redirectTo({ url: '/pages/login/login' }), 1000);
  }
});
