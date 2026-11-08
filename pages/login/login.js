const api = require('../../utils/api.js');
const app = getApp();

Page({
  data: { username: '', password: '' },
  onInput(e) {
    this.setData({ [e.currentTarget.dataset.field]: e.detail.value });
  },
  doLogin() {
    const { username, password } = this.data;
    if (!username || !password) return wx.showToast({ title: '请输入账号密码', icon: 'none' });
    const res = api.login(username, password);
    if (res.code !== 200) return wx.showToast({ title: res.msg, icon: 'none' });
    app.globalData.userInfo = res.data.user;
    app.globalData.token = res.data.token;
    wx.showToast({ title: '登录成功', icon: 'success' });
    setTimeout(() => wx.switchTab({ url: '/pages/index/index' }), 800);
  },
  onWechatLogin() {
    if (this._wxLogging) return;
    this._wxLogging = true;
    wx.login({
      success: (res) => {
        this._wxLogging = false;
        const r = api.loginByWechat(res.code);
        if (r.code !== 200) return wx.showToast({ title: r.msg, icon: 'none' });
        app.globalData.userInfo = r.data.user;
        app.globalData.token = r.data.token;
        wx.showToast({ title: '登录成功', icon: 'success' });
        setTimeout(() => wx.switchTab({ url: '/pages/index/index' }), 800);
      },
      fail: () => {
        this._wxLogging = false;
        wx.showToast({ title: '微信登录失败，请重试', icon: 'none' });
      },
    });
  },
  goRegister() { wx.navigateTo({ url: '/pages/register/register' }); },
  goForget() { wx.navigateTo({ url: '/pages/forgetPwd/forgetPwd' }); }
});
