const COLORS = [
  "linear-gradient(135deg, #B8DCCF, #91CBB8)",  // 柔性薄荷 → 生命青绿
  "linear-gradient(135deg, #F0CFC1, #E8C7D1)",  // 培养粉 → 组织淡粉
  "linear-gradient(135deg, #D8E8D0, #C1E4D2)",  // 菌落米绿 → 薄荷嫩叶
  "linear-gradient(135deg, #C7E4EC, #B8DCCF)",  // 透明浅蓝 → 柔性薄荷
  "linear-gradient(135deg, #EAF6E8, #D8E8D0)",  // 雾岛白绿 → 菌落米绿
  "linear-gradient(135deg, #F5E6CC, #D4B896)",  // 温润金渐变
  "linear-gradient(135deg, #F8F3E7, #EAF6E8)",  // 培养皿白 → 雾岛白绿
  "linear-gradient(135deg, #D8C8E8, #B8DCCF)",  // 柔紫 → 柔性薄荷
];

Component({
  properties: {
    text: { type: String, value: "" },
    emoji: { type: String, value: "" },
    seed: { type: String, value: "" },
    src: { type: String, value: "" },
  },
  data: {
    bg: COLORS[0],
    imgFailed: false,
    showText: "",
  },
  lifetimes: {
    attached() {
      const seed = this.data.seed || this.data.text || "0";
      let h = 0;
      for (let i = 0; i < seed.length; i++)
        h = (h * 31 + seed.charCodeAt(i)) >>> 0;
      const idx = h % COLORS.length;
      // 计算兜底显示的文字
      const t = this.data.text || "";
      const showText = t ? t.slice(0, 4) : "";
      this.setData({ bg: COLORS[idx], showText });
    },
  },
  methods: {
    onImgError() {
      // 图片加载失败 → 标记失败 → 显示色块+文字兜底
      this.setData({ imgFailed: true, src: "" });
    },
  },
});
