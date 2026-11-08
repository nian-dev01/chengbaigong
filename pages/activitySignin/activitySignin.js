const api = require('../../utils/api.js');
Page({
  data: { activityId: '', code: '', result: false },
  onLoad(opts) { this.setData({ activityId: opts.id }); },
  onInput(e) { this.setData({ code: e.detail.value.toUpperCase() }); },
  doSignin() {
    if (!this.data.code) return wx.showToast({ title: '请输入签到码', icon: 'none' });
    const res = api.signinActivity(this.data.activityId, this.data.code);
    if (res.code === 200) this.setData({ result: true });
    else wx.showToast({ title: res.msg, icon: 'none' });
  }
});
