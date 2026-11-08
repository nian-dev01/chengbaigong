const api = require("../../utils/api.js");
const app = getApp();
Page({
  data: { user: null, favCount: 0, publishCount: 0, orderCount: 0, unread: 0 },
  onShow() {
    const u = api.getCurrentUser();
    this.setData({ user: u });
    if (u) {
      this.setData({
        favCount: api.listFavorites().length,
        publishCount: api.listTopics({ userId: u.id }).length,
        orderCount: api.listOrders().length,
        unread: api.listUnreadConsultCount(),
      });
    }
  },
  goLogin() {
    wx.navigateTo({ url: "/pages/login/login" });
  },
  goEdit() {
    wx.navigateTo({ url: "/pages/editProfile/editProfile" });
  },
  goFavorites() {
    if (!api.requireLogin()) return;
    wx.navigateTo({ url: "/pages/favorites/favorites" });
  },
  goMyPublish() {
    if (!api.requireLogin()) return;
    wx.navigateTo({ url: "/pages/myPublish/myPublish" });
  },
  goOrders(e) {
    if (!api.requireLogin()) return;
    const s = e.currentTarget.dataset.status || "all";
    wx.navigateTo({ url: "/pages/orderList/orderList?status=" + s });
  },
  goMsg() {
    if (!api.requireLogin()) return;
    wx.navigateTo({ url: "/pages/message/message" });
  },
  goMyActivities() {
    if (!api.requireLogin()) return;
    wx.setStorageSync("activityMine", true);
    wx.navigateTo({ url: "/pages/activityList/activityList" });
  },
  goMyCourses() {
    if (!api.requireLogin()) return;
    wx.navigateTo({ url: "/pages/courseList/courseList?mine=1" });
  },
  goAddress() {
    if (!api.requireLogin()) return;
    wx.navigateTo({ url: "/pages/addressList/addressList" });
  },
  goConsult() {
    if (!api.requireLogin()) return;
    wx.switchTab({ url: "/pages/consult/consult" });
  },
  goAnnouncement() {
    wx.navigateTo({ url: "/pages/announcement/announcement" });
  },
  goApplyInheritor() {
    if (!api.requireLogin()) return;
    wx.navigateTo({ url: "/pages/applyInheritor/applyInheritor" });
  },
  goChangePwd() {
    wx.navigateTo({ url: "/pages/editProfile/editProfile?tab=1" });
  },
  goInheritorCenter() {
    wx.navigateTo({ url: "/pages/inheritor/dashboard/dashboard" });
  },
  goAdminCenter() {
    wx.navigateTo({ url: "/pages/admin/dashboard/dashboard" });
  },
  doLogout() {
    wx.showModal({
      title: "提示",
      content: "确定退出登录？",
      success: (r) => {
        if (r.confirm) {
          api.logout();
          app.globalData.userInfo = null;
          app.globalData.token = "";
          this.setData({ user: null });
          wx.showToast({ title: "已退出", icon: "success" });
        }
      },
    });
  },
});
