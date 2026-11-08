// app.js
const mock = require('./utils/mock.js');

App({
  onLaunch() {
    // 初始化云开发（AI 对话与识图走云函数，不依赖本地代理）
    if (wx.cloud) {
      wx.cloud.init({ env: 'cloud1-d3gjo2bvg48be863d', traceUser: true });
    }
    // 初始化本地数据（首次启动时注入模拟数据）
    mock.initMockData();
    // 恢复登录态
    const token = wx.getStorageSync('token');
    const user = wx.getStorageSync('currentUser');
    if (token && user) {
      this.globalData.token = token;
      this.globalData.userInfo = user;
    }
  },
  globalData: {
    token: '',
    userInfo: null,
    baseUrl: 'https://mock.feiyi.local/api'
  }
});
