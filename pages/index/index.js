const api = require("../../utils/api.js");
const U = (seed, w = 800, h = 400) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

Page({
  data: {
    banners: [
      {
        id: 1,
        title: "匠心传承 · 非遗焕新",
        sub: "探索中华五千年文化瑰宝",
        bg: "linear-gradient(135deg,#B8DCCF 0%,#91CBB8 100%)",
        src: "/images/banner/匠心传承.png",
      },
      {
        id: 2,
        title: "苏绣体验工坊报名中",
        sub: "跟随大师亲手绣一幅牡丹",
        bg: "linear-gradient(135deg,#F0CFC1 0%,#E8C7D1 100%)",
        src: "/images/banner/苏绣体验.png",
      },
      {
        id: 3,
        title: "景德镇制瓷大师课",
        sub: "从拉坯到烧制全流程教学",
        bg: "linear-gradient(135deg,#D8E8D0 0%,#B8DCCF 100%)",
        src: "/images/banner/景德镇制瓷.png",
      },
    ],
    recommends: [],
    activities: [],
    courses: [],
  },
  onLoad() {
    this.loadData();
  },
  onShow() {
    this.loadData();
  },
  loadData() {
    this.setData({
      recommends: api.recommendHeritages(4),
      activities: api.listActivities().slice(0, 5),
      courses: api.listCourses().slice(0, 4),
    });
  },
  goHeritageList() {
    wx.navigateTo({ url: "/pages/heritageList/heritageList" });
  },
  goHeritageDetail(e) {
    wx.navigateTo({
      url:
        "/pages/heritageDetail/heritageDetail?id=" + e.currentTarget.dataset.id,
    });
  },
  goCourseList() {
    wx.navigateTo({ url: "/pages/courseList/courseList" });
  },
  goCourseDetail(e) {
    wx.navigateTo({
      url: "/pages/courseDetail/courseDetail?id=" + e.currentTarget.dataset.id,
    });
  },
  goActivityList() {
    wx.navigateTo({ url: "/pages/activityList/activityList" });
  },
  goActivityDetail(e) {
    wx.navigateTo({
      url:
        "/pages/activityDetail/activityDetail?id=" + e.currentTarget.dataset.id,
    });
  },
  goHeritageMap() {
    wx.navigateTo({ url: "/pages/heritageMap/heritageMap" });
  },
  applyInheritor() {
    wx.navigateTo({ url: "/pages/applyInheritor/applyInheritor" });
  },
  goConsult() {
    wx.switchTab({ url: "/pages/consult/consult" });
  },
});
