const api = require('../../utils/api.js');
const app = getApp();
Page({
  data: { username: '', phone: '', password: '', password2: '' },
  onInput(e) { this.setData({ [e.currentTarget.dataset.field]: e.detail.value }); },
  doRegister() {
    const { username, phone, password, password2 } = this.data;
    if (!username || !phone || !password) return wx.showToast({ title: '请填写完整信息', icon: 'none' });
    if (!/^1\d{10}$/.test(phone)) return wx.showToast({ title: '手机号格式错误', icon: 'none' });
    if (password !== password2) return wx.showToast({ title: '两次密码不一致', icon: 'none' });
    if (password.length < 6) return wx.showToast({ title: '密码至少6位', icon: 'none' });
    const res = api.register(username, password, phone);
    if (res.code !== 200) return wx.showToast({ title: res.msg, icon: 'none' });
    app.globalData.userInfo = res.data.user;
    app.globalData.token = res.data.token;
    wx.showToast({ title: '注册成功', icon: 'success' });
    setTimeout(() => wx.switchTab({ url: '/pages/index/index' }), 800);
  },
  goLogin() { wx.navigateBack(); }
});
