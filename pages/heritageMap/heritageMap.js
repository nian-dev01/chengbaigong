const api = require("../../utils/api.js");

// 省份热区坐标（百分比，按各省中心点经纬度投影计算，与 china-map.png 精确对应）
const PROV_SPOTS = [
  { province: "北京", x: 68.3, y: 25.4 },
  { province: "天津", x: 73.6, y: 28.6 },
  { province: "河北", x: 66.2, y: 31.2 },
  { province: "山西", x: 62.7, y: 32.1 },
  { province: "内蒙古", x: 65.5, y: 18.9 },
  { province: "辽宁", x: 79.0, y: 24.8 },
  { province: "吉林", x: 84.7, y: 20.1 },
  { province: "黑龙江", x: 87.1, y: 11.6 },
  { province: "山东", x: 72.0, y: 34.5 },
  { province: "河南", x: 64.8, y: 39.4 },
  { province: "江苏", x: 74.1, y: 41.2 },
  { province: "安徽", x: 70.5, y: 43.4 },
  { province: "上海", x: 77.9, y: 45.2 },
  { province: "浙江", x: 75.1, y: 49.6 },
  { province: "湖北", x: 62.6, y: 45.1 },
  { province: "湖南", x: 61.8, y: 51.7 },
  { province: "江西", x: 68.1, y: 51.7 },
  { province: "福建", x: 71.7, y: 54.7 },
  { province: "广东", x: 64.0, y: 59.3 },
  { province: "广西", x: 57.1, y: 59.1 },
  { province: "海南", x: 58.7, y: 68.2 },
  { province: "四川", x: 47.5, y: 45.7 },
  { province: "重庆", x: 55.7, y: 46.9 },
  { province: "贵州", x: 54.1, y: 53.2 },
  { province: "云南", x: 45.5, y: 56.8 },
  { province: "西藏", x: 24.8, y: 43.9 },
  { province: "陕西", x: 57.3, y: 36.7 },
  { province: "甘肃", x: 49.2, y: 35.1 },
  { province: "青海", x: 36.9, y: 35.8 },
  { province: "宁夏", x: 53.0, y: 32.7 },
  { province: "新疆", x: 19.9, y: 24.7 },
  { province: "台湾", x: 77.6, y: 59.3 },
  { province: "香港", x: 69.6, y: 60.4 },
  { province: "澳门", x: 58.6, y: 63.4 },
];

// 从 region 字段提取省份
function getProvince(region) {
  if (!region) return "全国";
  if (region === "全国") return "全国";
  if (region === "北京" || region === "天津" || region === "上海" || region === "重庆") return region;
  if (region.startsWith("新疆")) return "新疆";
  if (region.startsWith("西藏")) return "西藏";
  if (region.startsWith("内蒙古")) return "内蒙古";
  if (region.startsWith("广西")) return "广西";
  if (region.startsWith("宁夏")) return "宁夏";
  if (region.startsWith("青海")) return "青海";
  const match = region.match(/^(北京|天津|上海|重庆|河北|山西|辽宁|吉林|黑龙江|江苏|浙江|安徽|福建|江西|山东|河南|湖北|湖南|广东|海南|四川|贵州|云南|陕西|甘肃|台湾|香港|澳门)/);
  return match ? match[1] : region;
}

Page({
  data: {
    spots: [],
    groups: [],
    total: 0,
    provinces: 0,
    worldwide: 0,
    popup: { show: false, province: "", list: [] },
  },

  onLoad() {
    this.loadData();
  },

  loadData() {
    const list = api.listHeritages();
    const worldwide = list.filter(h => h.level === "世界级").length;

    // 按省份分组
    const map = {};
    list.forEach(h => {
      const prov = getProvince(h.region);
      if (!map[prov]) map[prov] = [];
      map[prov].push(h);
    });

    // 构建热区
    const spots = PROV_SPOTS.map(s => ({
      ...s,
      count: map[s.province] ? map[s.province].length : 0,
    }));

    // 省份卡片（只显示有非遗的省份）
    const groups = Object.keys(map).filter(p => p !== "全国").map(prov => ({
      province: prov,
      list: map[prov],
    })).sort((a, b) => b.list.length - a.list.length);

    // 全国的项也算到一个特殊卡片
    if (map["全国"]) {
      groups.push({ province: "全国", list: map["全国"] });
    }

    this.setData({
      spots,
      groups,
      total: list.length,
      provinces: groups.filter(g => g.province !== "全国").length,
      worldwide,
    });
  },

  onSpot(e) {
    const prov = e.currentTarget.dataset.prov;
    const group = this.data.groups.find(g => g.province === prov);
    if (!group) {
      wx.showToast({ title: "暂无数据", icon: "none" });
      return;
    }
    this.setData({
      popup: { show: true, province: prov, list: group.list },
    });
  },

  showProv(e) {
    const prov = e.currentTarget.dataset.prov;
    const group = this.data.groups.find(g => g.province === prov);
    if (!group) return;
    this.setData({
      popup: { show: true, province: prov, list: group.list },
    });
  },

  closePop() {
    this.setData({ popup: { show: false, province: "", list: [] } });
  },

  stop() {},

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ popup: { show: false, province: "", list: [] } });
    wx.navigateTo({ url: "/pages/heritageDetail/heritageDetail?id=" + id });
  },
});
