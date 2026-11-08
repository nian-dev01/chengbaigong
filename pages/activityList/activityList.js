const api = require("../../utils/api.js");
Page({
  data: { keyword: "", list: [], mine: false },
  onLoad(opts) {
    if (opts.mine) this.setData({ mine: true });
  },
  onShow() {
    if (wx.getStorageSync("activityMine")) {
      this.setData({ mine: true });
      wx.removeStorageSync("activityMine");
    }
    this.load();
  },
  load() {
    let list;
    if (this.data.mine) {
      list = api
        .listMyActivities()
        .map((r) => r.activity)
        .filter(Boolean);
    } else {
      list = api.listActivities({ keyword: this.data.keyword });
    }
    this.setData({ list });
  },
  onSearch(e) {
    this.setData({ keyword: e.detail.value });
    this.load();
  },
  goDetail(e) {
    wx.navigateTo({
      url:
        "/pages/activityDetail/activityDetail?id=" + e.currentTarget.dataset.id,
    });
  },
});
