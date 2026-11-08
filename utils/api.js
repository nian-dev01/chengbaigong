// utils/api.js 模拟接口层（基于本地存储）
const db = require("./db.js");
const { uuid, formatTime } = require("./util.js");

// iOS 不支持 "2026-05-10 22:14:30" 这种日期格式，统一转成 "2026/05/10 22:14:30"
function parseTime(v) {
  if (!v) return 0;
  return new Date(String(v).replace(/-/g, "/")).getTime() || 0;
}

// ============ 用户相关 ============
function login(username, password) {
  const user = db.findOne(
    "users",
    (u) => u.username === username && u.password === password,
  );
  if (!user) return { code: 400, msg: "账号或密码错误" };
  if (user.status !== 1) return { code: 400, msg: "账号已被禁用" };
  const token = "tk_" + uuid();
  const safeUser = Object.assign({}, user);
  delete safeUser.password;
  wx.setStorageSync("token", token);
  wx.setStorageSync("currentUser", safeUser);
  return { code: 200, data: { token, user: safeUser } };
}

// 微信一键登录（本地模拟：真机 wx.login 拿 code，第一次登录时建本地账号，
// 之后用缓存里的 openid 复用同一账号。接真实后端时把这里换成 code2session 即可）
function loginByWechat(code) {
  if (!code) return { code: 400, msg: "微信登录失败，请重试" };
  let openid = wx.getStorageSync("wx_openid_sim");
  if (!openid) {
    openid = "wx_" + String(code).slice(0, 10) + Date.now().toString(36);
    wx.setStorageSync("wx_openid_sim", openid);
  }
  let user = db.findOne("users", (u) => u.openid === openid);
  if (!user) {
    user = {
      id: Date.now(),
      username: openid,
      password: "",
      openid,
      nickname: "微信用户",
      avatar: "",
      phone: "",
      role: "user",
      status: 1,
      createTime: formatTime(new Date()),
    };
    db.insert("users", user);
  }
  const token = "tk_" + uuid();
  const safeUser = Object.assign({}, user);
  delete safeUser.password;
  wx.setStorageSync("token", token);
  wx.setStorageSync("currentUser", safeUser);
  return { code: 200, data: { token, user: safeUser } };
}

function register(username, password, phone) {
  if (db.findOne("users", (u) => u.username === username)) {
    return { code: 400, msg: "用户名已存在" };
  }
  const user = {
    id: Date.now(),
    username,
    password,
    phone,
    nickname: username,
    avatar: "",
    role: "user",
    status: 1,
    createTime: formatTime(new Date()),
  };
  db.insert("users", user);
  const safeUser = Object.assign({}, user);
  delete safeUser.password;
  const token = "tk_" + uuid();
  wx.setStorageSync("token", token);
  wx.setStorageSync("currentUser", safeUser);
  return { code: 200, data: { token, user: safeUser } };
}

function getCurrentUser() {
  return wx.getStorageSync("currentUser");
}

function updateUser(patch) {
  const u = getCurrentUser();
  if (!u) return { code: 401, msg: "未登录" };
  db.update("users", u.id, patch);
  const fresh = db.findById("users", u.id);
  delete fresh.password;
  wx.setStorageSync("currentUser", fresh);
  return { code: 200, data: fresh };
}

function changePassword(oldPwd, newPwd) {
  const u = getCurrentUser();
  if (!u) return { code: 401, msg: "未登录" };
  const full = db.findById("users", u.id);
  if (full.password !== oldPwd) return { code: 400, msg: "原密码错误" };
  db.update("users", u.id, { password: newPwd });
  return { code: 200, msg: "修改成功" };
}

function resetPassword(username, phone, newPwd) {
  const u = db.findOne(
    "users",
    (x) => x.username === username && x.phone === phone,
  );
  if (!u) return { code: 400, msg: "账号或手机号不匹配" };
  db.update("users", u.id, { password: newPwd });
  return { code: 200, msg: "密码已重置" };
}

function logout() {
  wx.removeStorageSync("token");
  wx.removeStorageSync("currentUser");
}

function requireLogin() {
  const u = getCurrentUser();
  if (!u) {
    wx.navigateTo({ url: "/pages/login/login" });
    return null;
  }
  return u;
}

// ============ 通用列表 ============
function listCategories() {
  return db.query("categories");
}
function listHeritages(filter) {
  let list = db.query("heritages", (h) => h.status === 1);
  if (filter && filter.categoryId)
    list = list.filter((h) => h.categoryId === filter.categoryId);
  if (filter && filter.keyword)
    list = list.filter(
      (h) =>
        h.name.includes(filter.keyword) || h.region.includes(filter.keyword),
    );
  return list;
}
function getHeritage(id) {
  return db.findById("heritages", id);
}

function listInheritors() {
  return db.query("inheritors", (i) => i.status === 1);
}
function getInheritor(id) {
  return db.findById("inheritors", id);
}

function listVideoTypes() {
  return db.query("videoTypes");
}
function listVideos(filter) {
  let list = db.query("videos", (v) => v.status === 1);
  if (filter && filter.typeId)
    list = list.filter((v) => v.typeId === filter.typeId);
  if (filter && filter.keyword)
    list = list.filter((v) => v.title.includes(filter.keyword));
  return list;
}
function getVideo(id) {
  return db.findById("videos", id);
}

function listActivities(filter) {
  let list = db.query("activities", (a) => a.status === 1);
  if (filter && filter.keyword)
    list = list.filter(
      (a) =>
        a.title.includes(filter.keyword) || a.region.includes(filter.keyword),
    );
  return list;
}
function getActivity(id) {
  return db.findById("activities", id);
}

function listCourseCategories() {
  return db.query("courseCategories");
}
function listCourses(filter) {
  let list = db.query("courses", (c) => c.status === 1);
  if (filter && filter.categoryId)
    list = list.filter((c) => c.categoryId === filter.categoryId);
  if (filter && filter.keyword)
    list = list.filter((c) => c.title.includes(filter.keyword));
  return list;
}
function getCourse(id) {
  return db.findById("courses", id);
}
function listCourseChapters(courseId) {
  return db
    .query("courseChapters", (c) => c.courseId === courseId)
    .sort((a, b) => a.order - b.order);
}

function listShops(filter) {
  let list = db.query("shops");
  if (filter && filter.keyword)
    list = list.filter((s) => s.name.includes(filter.keyword));
  return list;
}
function getShop(id) {
  return db.findById("shops", id);
}
function listShopProducts(shopId) {
  return db.query("products", (p) => p.shopId === shopId && p.status === 1);
}

function listProducts(filter) {
  let list = db.query("products", (p) => p.status === 1);
  if (filter && filter.shopId)
    list = list.filter((p) => p.shopId === filter.shopId);
  if (filter && filter.keyword)
    list = list.filter((p) => p.name.includes(filter.keyword));
  return list;
}
function getProduct(id) {
  return db.findById("products", id);
}

function listTopicCategories() {
  return db.query("topicCategories");
}
function topicStats(t) {
  return Object.assign({}, t, {
    comments: db.count("topicComments", (c) => String(c.topicId) === String(t.id)),
    likes: db.count("topicLikes", (l) => String(l.topicId) === String(t.id)),
  });
}
function listTopics(filter) {
  let list = db.query("topics", (t) => t.status === 1);
  if (filter && filter.categoryId)
    list = list.filter((t) => t.categoryId === filter.categoryId);
  if (filter && filter.keyword)
    list = list.filter((t) => t.title.includes(filter.keyword));
  if (filter && filter.userId)
    list = list.filter((t) => t.userId === filter.userId);
  list.sort(
    (a, b) =>
      b.isRecommend - a.isRecommend ||
      parseTime(b.createTime) - parseTime(a.createTime),
  );
  return list.map(topicStats);
}
function getTopic(id) {
  const t = db.findById("topics", id);
  return t ? topicStats(t) : null;
}
function listTopicComments(topicId) {
  return db.query(
    "topicComments",
    (c) => String(c.topicId) === String(topicId),
  );
}
function publishTopic(data) {
  const u = requireLogin();
  if (!u) return { code: 401, msg: "未登录" };
  const topic = Object.assign(
    {
      id: Date.now(),
      userId: u.id,
      userName: u.nickname,
      userAvatar: u.avatar,
      images: [],
      likes: 0,
      comments: 0,
      views: 0,
      isRecommend: 0,
      status: 1,
      createTime: formatTime(new Date()),
    },
    data,
  );
  db.insert("topics", topic);
  return { code: 200, data: topic };
}
function deleteTopic(id) {
  const u = requireLogin();
  if (!u) return { code: 401, msg: "未登录" };
  const t = db.findById("topics", id);
  if (!t) return { code: 404, msg: "话题不存在" };
  if (String(t.userId) !== String(u.id))
    return { code: 403, msg: "只能删除自己发布的内容" };
  db.remove("topics", id);
  db.removeBy("topicComments", (c) => String(c.topicId) === String(id));
  db.removeBy("topicLikes", (l) => String(l.topicId) === String(id));
  db.removeBy(
    "favorites",
    (f) => f.type === "topic" && String(f.targetId) === String(id),
  );
  return { code: 200 };
}
function commentTopic(topicId, content) {
  const u = requireLogin();
  if (!u) return { code: 401, msg: "未登录" };
  const c = {
    id: Date.now(),
    topicId,
    userId: u.id,
    userName: u.nickname,
    userAvatar: u.avatar || "/images/common/default_avatar.png",
    content,
    createTime: formatTime(new Date()),
  };
  db.insert("topicComments", c);
  const comments = db.count(
    "topicComments",
    (x) => String(x.topicId) === String(topicId),
  );
  db.update("topics", topicId, { comments });
  return { code: 200, data: c };
}

function listAnnouncements() {
  return db.query("announcements");
}

// ============ 收藏 ============
function isFavorite(userId, type, targetId) {
  return !!db.findOne(
    "favorites",
    (f) => f.userId === userId && f.type === type && f.targetId === targetId,
  );
}
function toggleFavorite(type, targetId) {
  const u = requireLogin();
  if (!u) return { code: 401, msg: "未登录" };
  const exist = db.findOne(
    "favorites",
    (f) => f.userId === u.id && f.type === type && f.targetId === targetId,
  );
  if (exist) {
    db.remove("favorites", exist.id);
    return { code: 200, data: { favorited: false } };
  }
  db.insert("favorites", {
    id: Date.now(),
    userId: u.id,
    type,
    targetId,
    createTime: formatTime(new Date()),
  });
  return { code: 200, data: { favorited: true } };
}
function listFavorites(type) {
  const u = requireLogin();
  if (!u) return [];
  return db.query(
    "favorites",
    (f) => f.userId === u.id && (!type || f.type === type),
  );
}

// ============ 点赞（话题） ============
function isTopicLiked(userId, topicId) {
  return !!db.findOne(
    "topicLikes",
    (l) =>
      String(l.userId) === String(userId) &&
      String(l.topicId) === String(topicId),
  );
}
function toggleTopicLike(topicId) {
  const u = requireLogin();
  if (!u) return { code: 401, msg: "未登录" };
  const t = db.findById("topics", topicId);
  if (!t) return { code: 404, msg: "话题不存在" };
  const exist = db.findOne(
    "topicLikes",
    (l) =>
      String(l.userId) === String(u.id) &&
      String(l.topicId) === String(topicId),
  );
  if (exist) db.remove("topicLikes", exist.id);
  else
    db.insert("topicLikes", {
      id: "like_" + u.id + "_" + topicId,
      topicId,
      userId: u.id,
      createTime: formatTime(new Date()),
    });
  const liked = !exist;
  const likes = db.count(
    "topicLikes",
    (l) => String(l.topicId) === String(topicId),
  );
  db.update("topics", topicId, { likes });
  return { code: 200, data: { liked, likes } };
}

// ============ 购物车 ============
function listCart() {
  const u = requireLogin();
  if (!u) return [];
  const items = db.query("carts", (c) => c.userId === u.id);
  return items.map((it) =>
    Object.assign({}, it, { product: db.findById("products", it.productId) }),
  );
}
function addToCart(productId, count = 1) {
  const u = requireLogin();
  if (!u) return { code: 401, msg: "未登录" };
  const exist = db.findOne(
    "carts",
    (c) => c.userId === u.id && c.productId === productId,
  );
  if (exist) {
    db.update("carts", exist.id, { count: exist.count + count });
  } else {
    db.insert("carts", { id: Date.now(), userId: u.id, productId, count });
  }
  return { code: 200, msg: "已加入购物车" };
}
function updateCart(id, count) {
  if (count <= 0) db.remove("carts", id);
  else db.update("carts", id, { count });
  return { code: 200 };
}
function removeCart(id) {
  db.remove("carts", id);
  return { code: 200 };
}

// ============ 地址 ============
function listAddresses() {
  const u = requireLogin();
  if (!u) return [];
  return db.query("addresses", (a) => a.userId === u.id);
}
function saveAddress(data) {
  const u = requireLogin();
  if (!u) return { code: 401, msg: "未登录" };
  if (data.isDefault) {
    db.query("addresses", (a) => a.userId === u.id).forEach((a) =>
      db.update("addresses", a.id, { isDefault: 0 }),
    );
  }
  if (data.id) db.update("addresses", data.id, data);
  else
    db.insert(
      "addresses",
      Object.assign({ id: Date.now(), userId: u.id }, data),
    );
  return { code: 200 };
}
function deleteAddress(id) {
  db.remove("addresses", id);
  return { code: 200 };
}
function getDefaultAddress() {
  const u = requireLogin();
  if (!u) return null;
  return (
    db.findOne("addresses", (a) => a.userId === u.id && a.isDefault === 1) ||
    listAddresses()[0]
  );
}

// ============ 订单（商城） ============
function createOrder(itemIds, addressId) {
  const u = requireLogin();
  if (!u) return { code: 401, msg: "未登录" };
  const cart = itemIds.map((id) => db.findById("carts", id)).filter(Boolean);
  if (!cart.length) return { code: 400, msg: "请选择商品" };
  const addr = db.findById("addresses", addressId);
  if (!addr) return { code: 400, msg: "请选择收货地址" };
  const items = cart.map((c) => {
    const p = db.findById("products", c.productId);
    return {
      productId: p.id,
      name: p.name,
      price: p.price,
      count: c.count,
      cover: p.cover,
    };
  });
  const total = items.reduce((s, i) => s + i.price * i.count, 0);
  const order = {
    id: Date.now(),
    orderNo: "FY" + Date.now(),
    userId: u.id,
    items,
    total,
    address: {
      name: addr.name,
      phone: addr.phone,
      full: addr.province + addr.city + addr.district + addr.detail,
    },
    status: "pending", // pending->paid->shipped->completed / cancelled / refunding / refunded
    createTime: formatTime(new Date()),
  };
  db.insert("orders", order);
  cart.forEach((c) => db.remove("carts", c.id));
  return { code: 200, data: order };
}
function listOrders(status) {
  const u = requireLogin();
  if (!u) return [];
  let list = db.query("orders", (o) => o.userId === u.id);
  if (status && status !== "all")
    list = list.filter((o) => o.status === status);
  list.sort((a, b) => parseTime(b.createTime) - parseTime(a.createTime));
  return list;
}
function getOrder(id) {
  return db.findById("orders", id);
}
function payOrder(id) {
  // 模拟支付宝/微信支付：直接改为已支付
  db.update("orders", id, { status: "paid", payTime: formatTime(new Date()) });
  // 模拟自动发货
  setTimeout(() => {
    db.update("orders", id, {
      status: "shipped",
      shipTime: formatTime(new Date()),
      logistics: { company: "顺丰速运", no: "SF" + Date.now() },
    });
  }, 2000);
  return { code: 200, msg: "支付成功" };
}
function cancelOrder(id) {
  db.update("orders", id, { status: "cancelled" });
  return { code: 200 };
}
function confirmReceive(id) {
  db.update("orders", id, {
    status: "completed",
    completeTime: formatTime(new Date()),
  });
  return { code: 200 };
}
function applyRefund(id, reason) {
  db.update("orders", id, { status: "refunding", refundReason: reason });
  db.insert("refunds", {
    id: Date.now(),
    orderId: id,
    reason,
    status: "pending",
    createTime: formatTime(new Date()),
  });
  return { code: 200, msg: "退款申请已提交" };
}
function getLogistics() {
  // 模拟物流轨迹
  return [
    { time: "2024-06-10 09:00", desc: "快件已从【苏州集散中心】发出" },
    { time: "2024-06-10 14:30", desc: "快件到达【上海转运中心】" },
    {
      time: "2024-06-11 08:15",
      desc: "快件正在派送中，派件员：张师傅 138****1234",
    },
    { time: "2024-06-11 11:20", desc: "快件已签收，签收人：本人" },
  ];
}

// ============ 活动报名 ============
function registerActivity(activityId) {
  const u = requireLogin();
  if (!u) return { code: 401, msg: "未登录" };
  const exist = db.findOne(
    "activityRegistrations",
    (r) => r.activityId === activityId && r.userId === u.id,
  );
  if (exist) return { code: 400, msg: "您已报名该活动" };
  const a = db.findById("activities", activityId);
  if (a.joined >= a.maxPeople) return { code: 400, msg: "名额已满" };
  const reg = {
    id: Date.now(),
    activityId,
    userId: u.id,
    status: "approved",
    signinCode: "SIN" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    createTime: formatTime(new Date()),
  };
  db.insert("activityRegistrations", reg);
  db.update("activities", activityId, { joined: a.joined + 1 });
  return { code: 200, data: reg };
}
function getMyRegistration(activityId) {
  const u = requireLogin();
  if (!u) return null;
  return db.findOne(
    "activityRegistrations",
    (r) => r.activityId === activityId && r.userId === u.id,
  );
}
function cancelRegistration(activityId) {
  const u = requireLogin();
  if (!u) return { code: 401 };
  const r = db.findOne(
    "activityRegistrations",
    (r) => r.activityId === activityId && r.userId === u.id,
  );
  if (r) {
    db.remove("activityRegistrations", r.id);
    const a = db.findById("activities", activityId);
    db.update("activities", activityId, { joined: Math.max(0, a.joined - 1) });
  }
  return { code: 200 };
}
function signinActivity(activityId, code) {
  const u = requireLogin();
  if (!u) return { code: 401 };
  const r = db.findOne(
    "activityRegistrations",
    (r) => r.activityId === activityId && r.userId === u.id,
  );
  if (!r) return { code: 400, msg: "未报名该活动" };
  if (r.signinCode !== code) return { code: 400, msg: "签到码错误" };
  db.update("activityRegistrations", r.id, {
    status: "signed",
    signinTime: formatTime(new Date()),
  });
  return { code: 200, msg: "签到成功" };
}
function reviewActivity(activityId, rating, comment) {
  const u = requireLogin();
  if (!u) return { code: 401 };
  const r = db.findOne(
    "activityRegistrations",
    (r) => r.activityId === activityId && r.userId === u.id,
  );
  if (r) db.update("activityRegistrations", r.id, { rating, comment });
  return { code: 200, msg: "评价成功" };
}
function listMyActivities() {
  const u = requireLogin();
  if (!u) return [];
  const regs = db.query("activityRegistrations", (r) => r.userId === u.id);
  return regs.map((r) =>
    Object.assign({}, r, { activity: db.findById("activities", r.activityId) }),
  );
}

// ============ 课程 ============
function buyCourse(courseId) {
  const u = requireLogin();
  if (!u) return { code: 401 };
  const exist = db.findOne(
    "courseOrders",
    (o) => o.courseId === courseId && o.userId === u.id && o.status === "paid",
  );
  if (exist) return { code: 400, msg: "您已购买该课程" };
  const c = db.findById("courses", courseId);
  db.insert("courseOrders", {
    id: Date.now(),
    courseId,
    userId: u.id,
    status: "paid",
    createTime: formatTime(new Date()),
  });
  db.update("courses", courseId, { students: c.students + 1 });
  return { code: 200, msg: "购买成功" };
}
function isCourseBought(courseId) {
  const u = getCurrentUser();
  if (!u) return false;
  return !!db.findOne(
    "courseOrders",
    (o) => o.courseId === courseId && o.userId === u.id && o.status === "paid",
  );
}
function getLearnProgress(courseId) {
  const u = getCurrentUser();
  if (!u) return {};
  const list = db.query(
    "learnProgress",
    (p) => p.courseId === courseId && p.userId === u.id,
  );
  const map = {};
  list.forEach((p) => (map[p.chapterId] = p));
  return map;
}
function setChapterProgress(courseId, chapterId, progress, finished) {
  const u = requireLogin();
  if (!u) return { code: 401 };
  const exist = db.findOne(
    "learnProgress",
    (p) =>
      p.courseId === courseId && p.userId === u.id && p.chapterId === chapterId,
  );
  if (exist) db.update("learnProgress", exist.id, { progress, finished });
  else
    db.insert("learnProgress", {
      id: Date.now(),
      courseId,
      userId: u.id,
      chapterId,
      progress,
      finished,
    });
  return { code: 200 };
}
function checkIn(courseId, content) {
  const u = requireLogin();
  if (!u) return { code: 401 };
  db.insert("checkIns", {
    id: Date.now(),
    courseId,
    userId: u.id,
    day: formatTime(new Date()).slice(0, 10),
    content,
    createTime: formatTime(new Date()),
  });
  return { code: 200, msg: "打卡成功" };
}
function listMyCheckins(courseId) {
  const u = getCurrentUser();
  if (!u) return [];
  return db.query(
    "checkIns",
    (p) => p.courseId === courseId && p.userId === u.id,
  );
}
function reviewCourse(courseId, rating, content) {
  const u = requireLogin();
  if (!u) return { code: 401 };
  db.insert("courseReviews", {
    id: Date.now(),
    courseId,
    userId: u.id,
    userName: u.nickname,
    rating,
    content,
    createTime: formatTime(new Date()),
  });
  return { code: 200, msg: "评价成功" };
}
function listCourseReviews(courseId) {
  return db.query("courseReviews", (r) => r.courseId === courseId);
}

// ============ 在线咨询（WebSocket 模拟） ============
function listConsultations(withUserId) {
  const u = requireLogin();
  if (!u) return [];
  return db
    .query(
      "consultations",
      (c) => c.userId === u.id && (!withUserId || c.toUserId === withUserId),
    )
    .sort((a, b) => parseTime(a.createTime) - parseTime(b.createTime));
}
function sendConsultation(toUserId, content) {
  const u = requireLogin();
  if (!u) return { code: 401 };
  db.insert("consultations", {
    id: Date.now(),
    userId: u.id,
    toUserId,
    content,
    fromAdmin: false,
    read: false,
    createTime: formatTime(new Date()),
  });
  // 模拟客服自动回复
  setTimeout(() => {
    db.insert("consultations", {
      id: Date.now() + 1,
      userId: u.id,
      toUserId,
      content: "收到您的咨询，客服会尽快为您处理~（模拟自动回复）",
      fromAdmin: true,
      read: false,
      createTime: formatTime(new Date()),
    });
  }, 1200);
  return { code: 200 };
}
function listUnreadConsultCount() {
  const u = getCurrentUser();
  if (!u) return 0;
  return db.count(
    "consultations",
    (c) => c.userId === u.id && c.fromAdmin === true && c.read === false,
  );
}

// ============ 传承人申请 ============
function submitInheritorApplication(data) {
  const u = requireLogin();
  if (!u) return { code: 401 };
  const exist = db.findOne(
    "inheritorApplications",
    (a) => a.userId === u.id && a.status === 0,
  );
  if (exist) return { code: 400, msg: "您有申请正在审核中" };
  db.insert(
    "inheritorApplications",
    Object.assign(
      {
        id: Date.now(),
        userId: u.id,
        status: 0,
        createTime: formatTime(new Date()),
      },
      data,
    ),
  );
  return { code: 200, msg: "申请已提交" };
}

// ============ 推荐算法（协同过滤简化版） ============
function recommendHeritages(limit = 6) {
  const u = getCurrentUser();
  const all = db.query("heritages", (h) => h.status === 1);
  if (!u) {
    // 未登录：按热度推荐
    return all.sort((a, b) => b.views - a.views).slice(0, limit);
  }
  // 登录后：根据收藏偏好做简单协同（按收藏类别加权 + 热度）
  const favs = db.query(
    "favorites",
    (f) => f.userId === u.id && f.type === "heritage",
  );
  const favCatMap = {};
  favs.forEach((f) => {
    const h = db.findById("heritages", f.targetId);
    if (h) favCatMap[h.categoryId] = (favCatMap[h.categoryId] || 0) + 1;
  });
  const scored = all.map((h) => {
    let score = h.views * 0.3 + h.likes * 0.7;
    if (favCatMap[h.categoryId]) score *= 1 + favCatMap[h.categoryId] * 0.5;
    return { h, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.h).slice(0, limit);
}

// ============ 管理员/传承人端接口 ============
function adminListUsers() {
  return db.query("users");
}
function adminToggleUserStatus(id) {
  const u = db.findById("users", id);
  db.update("users", id, { status: u.status === 1 ? 0 : 1 });
  return { code: 200 };
}
function adminListApplications() {
  return db.query("inheritorApplications");
}
function adminReviewApplication(id, pass) {
  const a = db.findById("inheritorApplications", id);
  db.update("inheritorApplications", id, {
    status: pass ? 1 : 2,
    reviewTime: formatTime(new Date()),
  });
  if (pass) {
    db.update("users", a.userId, { role: "inheritor" });
    const u = db.findById("users", a.userId);
    if (u) {
      db.insert("inheritors", {
        id: Date.now(),
        userId: u.id,
        name: u.nickname,
        avatar: "",
        title: a.category + "传承人",
        category: a.category,
        region: "",
        intro: a.intro,
        phone: u.phone,
        status: 1,
        createTime: formatTime(new Date()),
      });
    }
  }
  return { code: 200 };
}
function adminSaveHeritage(data) {
  if (data.id) db.update("heritages", data.id, data);
  else
    db.insert(
      "heritages",
      Object.assign(
        {
          id: Date.now(),
          views: 0,
          likes: 0,
          status: 1,
          createTime: formatTime(new Date()),
        },
        data,
      ),
    );
  return { code: 200 };
}
function adminDeleteHeritage(id) {
  db.remove("heritages", id);
  return { code: 200 };
}
function adminSaveVideo(data) {
  if (data.id) db.update("videos", data.id, data);
  else
    db.insert(
      "videos",
      Object.assign(
        {
          id: Date.now(),
          views: 0,
          status: 1,
          createTime: formatTime(new Date()),
        },
        data,
      ),
    );
  return { code: 200 };
}
function adminDeleteVideo(id) {
  db.remove("videos", id);
  return { code: 200 };
}
function adminSaveActivity(data) {
  if (data.id) db.update("activities", data.id, data);
  else
    db.insert(
      "activities",
      Object.assign(
        {
          id: Date.now(),
          joined: 0,
          status: 1,
          createTime: formatTime(new Date()),
        },
        data,
      ),
    );
  return { code: 200 };
}
function adminDeleteActivity(id) {
  db.remove("activities", id);
  return { code: 200 };
}
function adminListActivityRegistrations(activityId) {
  return db
    .query("activityRegistrations", (r) => r.activityId === activityId)
    .map((r) => {
      const u = db.findById("users", r.userId);
      return Object.assign({}, r, {
        userName: u ? u.nickname : "",
        phone: u ? u.phone : "",
      });
    });
}
function adminSaveCourse(data) {
  if (data.id) db.update("courses", data.id, data);
  else
    db.insert(
      "courses",
      Object.assign(
        {
          id: Date.now(),
          students: 0,
          rating: 5,
          status: 1,
          createTime: formatTime(new Date()),
        },
        data,
      ),
    );
  return { code: 200 };
}
function adminDeleteCourse(id) {
  db.remove("courses", id);
  return { code: 200 };
}
function adminReviewTopic(id, pass) {
  db.update("topics", id, { status: pass ? 1 : 2, isRecommend: pass ? 1 : 0 });
  return { code: 200 };
}
function adminSaveAnnouncement(data) {
  if (data.id) db.update("announcements", data.id, data);
  else
    db.insert(
      "announcements",
      Object.assign(
        { id: Date.now(), createTime: formatTime(new Date()) },
        data,
      ),
    );
  return { code: 200 };
}
function adminDeleteAnnouncement(id) {
  db.remove("announcements", id);
  return { code: 200 };
}

// 传承人端
function inheritorGetShop() {
  const u = requireLogin();
  if (!u) return null;
  const inh = db.findOne("inheritors", (i) => i.userId === u.id);
  if (!inh) return null;
  return (
    db.findOne("shops", (s) => s.inheritorId === inh.id) || {
      inheritorId: inh.id,
      name: "",
      avatar: "",
      region: "",
      intro: "",
      rating: 5,
      sales: 0,
    }
  );
}
function inheritorSaveShop(data) {
  const u = requireLogin();
  if (!u) return { code: 401 };
  const inh = db.findOne("inheritors", (i) => i.userId === u.id);
  if (!inh) return { code: 400, msg: "非传承人" };
  const exist = db.findOne("shops", (s) => s.inheritorId === inh.id);
  if (exist)
    db.update(
      "shops",
      exist.id,
      Object.assign({}, data, { inheritorId: inh.id }),
    );
  else
    db.insert(
      "shops",
      Object.assign(
        { id: Date.now(), inheritorId: inh.id, rating: 5, sales: 0 },
        data,
      ),
    );
  return { code: 200 };
}
function inheritorListProducts() {
  const u = requireLogin();
  if (!u) return [];
  const inh = db.findOne("inheritors", (i) => i.userId === u.id);
  if (!inh) return [];
  const shop = db.findOne("shops", (s) => s.inheritorId === inh.id);
  if (!shop) return [];
  return db.query("products", (p) => p.shopId === shop.id);
}
function inheritorSaveProduct(data) {
  const u = requireLogin();
  if (!u) return { code: 401 };
  const inh = db.findOne("inheritors", (i) => i.userId === u.id);
  const shop = db.findOne("shops", (s) => s.inheritorId === inh.id);
  if (data.id) db.update("products", data.id, data);
  else
    db.insert(
      "products",
      Object.assign(
        {
          id: Date.now(),
          shopId: shop.id,
          sales: 0,
          status: 1,
          createTime: formatTime(new Date()),
        },
        data,
      ),
    );
  return { code: 200 };
}
function inheritorDeleteProduct(id) {
  db.remove("products", id);
  return { code: 200 };
}
function inheritorListOrders() {
  const u = requireLogin();
  if (!u) return [];
  const inh = db.findOne("inheritors", (i) => i.userId === u.id);
  const shop = db.findOne("shops", (s) => s.inheritorId === inh.id);
  if (!shop) return [];
  // 包含该店铺商品的订单
  const all = db.query("orders");
  return all.filter((o) =>
    o.items.some((it) => {
      const p = db.findById("products", it.productId);
      return p && p.shopId === shop.id;
    }),
  );
}
function inheritorShipOrder(id) {
  db.update("orders", id, {
    status: "shipped",
    shipTime: formatTime(new Date()),
    logistics: { company: "顺丰速运", no: "SF" + Date.now() },
  });
  return { code: 200 };
}
function inheritorUpdateInfo(data) {
  const u = requireLogin();
  if (!u) return { code: 401 };
  const inh = db.findOne("inheritors", (i) => i.userId === u.id);
  if (inh) db.update("inheritors", inh.id, data);
  db.update("users", u.id, { nickname: data.name || u.nickname });
  return { code: 200 };
}
function inheritorListHeritages() {
  const u = requireLogin();
  if (!u) return [];
  const inh = db.findOne("inheritors", (i) => i.userId === u.id);
  if (!inh) return [];
  return db.query("heritages", (h) => h.inheritorId === inh.id);
}
function inheritorSaveHeritage(data) {
  const u = requireLogin();
  if (!u) return { code: 401 };
  const inh = db.findOne("inheritors", (i) => i.userId === u.id);
  if (data.id) db.update("heritages", data.id, data);
  else
    db.insert(
      "heritages",
      Object.assign(
        {
          id: Date.now(),
          inheritorId: inh.id,
          views: 0,
          likes: 0,
          status: 1,
          createTime: formatTime(new Date()),
        },
        data,
      ),
    );
  return { code: 200 };
}
function inheritorListActivities() {
  const u = requireLogin();
  if (!u) return [];
  const inh = db.findOne("inheritors", (i) => i.userId === u.id);
  if (!inh) return [];
  return db.query("activities", (a) => a.inheritorId === inh.id);
}
function inheritorSaveActivity(data) {
  const u = requireLogin();
  if (!u) return { code: 401 };
  const inh = db.findOne("inheritors", (i) => i.userId === u.id);
  if (data.id) db.update("activities", data.id, data);
  else
    db.insert(
      "activities",
      Object.assign(
        {
          id: Date.now(),
          inheritorId: inh.id,
          joined: 0,
          status: 1,
          createTime: formatTime(new Date()),
        },
        data,
      ),
    );
  return { code: 200 };
}
function inheritorListCourses() {
  const u = requireLogin();
  if (!u) return [];
  const inh = db.findOne("inheritors", (i) => i.userId === u.id);
  if (!inh) return [];
  return db.query("courses", (c) => c.inheritorId === inh.id);
}
function inheritorSaveCourse(data) {
  const u = requireLogin();
  if (!u) return { code: 401 };
  const inh = db.findOne("inheritors", (i) => i.userId === u.id);
  if (data.id) db.update("courses", data.id, data);
  else
    db.insert(
      "courses",
      Object.assign(
        {
          id: Date.now(),
          inheritorId: inh.id,
          students: 0,
          rating: 5,
          status: 1,
          createTime: formatTime(new Date()),
        },
        data,
      ),
    );
  return { code: 200 };
}

// 统计
function getStatistics() {
  return {
    userCount: db.count("users", (u) => u.role === "user"),
    inheritorCount: db.count("inheritors"),
    heritageCount: db.count("heritages", (h) => h.status === 1),
    videoCount: db.count("videos", (v) => v.status === 1),
    activityCount: db.count("activities"),
    courseCount: db.count("courses", (c) => c.status === 1),
    orderCount: db.count("orders"),
    topicCount: db.count("topics", (t) => t.status === 1),
    totalSales: db
      .query(
        "orders",
        (o) =>
          o.status === "completed" ||
          o.status === "paid" ||
          o.status === "shipped",
      )
      .reduce((s, o) => s + o.total, 0),
    categoryStat: db.query("categories").map((c) => ({
      name: c.name,
      value: db.count("heritages", (h) => h.categoryId === c.id),
    })),
  };
}

// ============ 智能客服 AI 对话 ============
const { AI_CONFIG, VISION_CONFIG, CLOUD_CONFIG } = require("./config.js");

// 本地智能关键词匹配（当 ENABLE_REAL_API = false 时使用）
const AI_REPLY_RULES = [
  // 问候
  {
    keys: ["你好", "您好", "hi", "hello", "在吗", "在不"],
    reply: () =>
      "你好呀~ 我是非遗小助手 🌿 有什么想了解的吗？比如非遗文化、活动报名、课程学习都可以问我哦！",
  },
  // 非遗
  {
    keys: ["非遗", "文化", "遗产", "介绍"],
    reply: () =>
      "我们的平台收录了全国34个省级行政区的非遗项目，包括传统技艺、民俗活动、传统音乐等。你可以在首页「非遗」板块浏览，或在「华夏非遗地图」里按省份探索~",
  },
  {
    keys: ["京剧", "昆曲", "粤剧", "豫剧", "越剧", "戏曲"],
    reply: () =>
      "戏曲是中华传统文化的瑰宝！我们平台收录了京剧、昆曲、粤剧、豫剧等多个戏曲剧种的介绍、视频和课程。其中昆曲更是被联合国教科文组织列入人类非物质文化遗产代表作名录哦~",
  },
  {
    keys: ["苏绣", "蜀绣", "刺绣", "缂丝"],
    reply: () =>
      "刺绣是中国古老的传统手工艺，四大名绣（苏绣、粤绣、蜀绣、湘绣）各具特色。我们有苏绣大师工坊活动可以报名体验，还有传承人讲解刺绣课程，感兴趣吗？",
  },
  {
    keys: ["景德镇", "陶瓷", "瓷器", "制瓷"],
    reply: () =>
      "景德镇被誉为千年瓷都，制瓷技艺源远流长。平台上有景德镇陶瓷器相关商品、制瓷大师课视频和体验工坊活动，快来感受泥土与火焰的艺术吧~",
  },
  {
    keys: ["剪纸", "年画"],
    reply: () =>
      "剪纸和年画是中国民间最普及的传统艺术。蔚县剪纸、广灵剪纸、朱仙镇木版年画、杨柳青年画都是国家级非遗项目，快来了解一下吧！",
  },
  {
    keys: ["茶文化", "普洱茶", "茶道", "茶艺"],
    reply: () =>
      "中国是茶的故乡，普洱茶制作技艺、乌龙茶制作技艺都已列入非遗。平台有普洱茶相关课程和文创商品，欢迎品茶论道~",
  },
  // 活动
  {
    keys: ["活动", "报名", "参加", "体验", "workshop"],
    reply: () =>
      "点击底部「活动」Tab，可以看到所有热门活动！有苏绣体验工坊、景德镇制瓷课、各地非遗展览等，报名后可在「我的活动」查看记录~",
  },
  {
    keys: ["什么时候", "几点", "时间", "开始"],
    reply: () =>
      "活动详情页会显示具体的时间、地点和剩余名额哦~ 点击「活动」标签页选择感兴趣的活动查看详情吧！",
  },
  // 课程
  {
    keys: ["课程", "学习", "视频", "教学", "教程"],
    reply: () =>
      "我们有丰富的非遗课程！大师亲授制瓷、刺绣、古琴等课程，支持购买后永久观看。点击「课程」Tab 浏览全部课程~",
  },
  {
    keys: ["免费", "要钱吗", "收费", "价格", "多少钱"],
    reply: () =>
      "平台上的非遗介绍和大部分视频是免费观看的，大师课程和部分体验活动会有费用，具体金额在详情页都会标明哦~",
  },
  // 商品
  {
    keys: ["买", "购买", "商城", "商品", "文创", "淘宝", "拼多多"],
    reply: () =>
      "底部「商城」Tab 是非遗文创商品区！有京剧脸谱冰箱贴、手工茶杯、昆曲书签等好物，都是传承人亲手制作或授权的正品~",
  },
  {
    keys: ["发货", "快递", "物流", "多久到"],
    reply: () =>
      "下单后 48 小时内发货，一般 2-5 天送达。订单详情页可以查看实时物流信息哦！",
  },
  // 传承人
  {
    keys: ["传承人", "大师", "师傅", "老师"],
    reply: () =>
      "平台汇集了众多国家级、省级非遗传承人，你可以在非遗详情页看到他们的故事和作品。如果想成为传承人，也可以在「我的」里申请认证~",
  },
  {
    keys: ["申请", "认证", "怎么进", "加入"],
    reply: () =>
      "想成为非遗传承人？在「我的」页面底部点击「申请传承人」，填写你的非遗项目、传承经历等信息，审核通过后就可以上架商品、发布课程啦！",
  },
  // 地图
  {
    keys: ["地图", "哪里", "哪个省", "地方", "分布"],
    reply: () =>
      "首页顶部有「华夏非遗地图」入口，可以按省份查看当地非遗项目~ 覆盖全国34个省级行政区哦！",
  },
  // 订单
  {
    keys: ["订单", "付款", "支付", "退款"],
    reply: () =>
      "「我的」页面可以查看全部订单，支持微信支付。申请退款也在订单详情页操作，一般 1-3 个工作日处理~",
  },
  // 话题
  {
    keys: ["话题", "讨论", "交流", "社区"],
    reply: () =>
      "底部「话题」Tab 是非遗爱好者社区，可以发帖交流、分享作品、参与讨论~ 欢迎来认识更多同好！",
  },
  // 万能兜底
  { keys: ["价格", "联系客服"], reply: () => "" }, // 空触发兜底
];

function localAIReply(content) {
  const text = content.toLowerCase().trim();
  for (const rule of AI_REPLY_RULES) {
    if (rule.keys.some((k) => text.includes(k))) {
      return rule.reply();
    }
  }
  // 兜底回复
  const fallbacks = [
    "嗯嗯~ 这个问题我记下来了！你可以在对应板块查看更多信息，或者告诉我具体想了解哪个方面？🌿",
    "好问题！平台内容很丰富呢，能再说说你想了解非遗文化、活动报名、还是课程学习吗？",
    "收到！我帮你查一下~ 你说的是关于非遗、活动、课程还是商城的问题呀？",
    "感谢提问！你可以试着说具体一点，比如「苏绣有什么活动？」「景德镇陶瓷课程」，这样我能更好地帮到你哦~",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// 把接口错误转成用户能看懂的中文提示
function networkErrorMessage(err) {
  const msg = (err && err.errMsg) || "";
  if (/domain list/i.test(msg))
    return "接口域名不在白名单：真机请点右上角「⋯」打开调试模式，或改用 https 域名";
  if (/timeout/i.test(msg))
    return "接口请求超时：请确认手机和电脑连的是同一个 WiFi，且代理在运行";
  if (/refused|ECONNREFUSED/i.test(msg))
    return "代理没启动：请在电脑执行 node server/proxy.js";
  if (/-501000|FunctionName|function not found|does not exist/i.test(msg))
    return "云函数未部署：右键 cloudfunctions/aiProxy → 上传并部署（云端安装依赖）";
  if (/-601001|-501001|env|environment|环境/i.test(msg))
    return "云开发环境有问题：请在 app.js 里填 env 环境ID，并确认已开通云开发";
  return "请求失败：" + (msg || "无错误信息（检查是否已开通云开发、部署云函数）");
}

function explainApiError(statusCode, data) {
  if (statusCode === 401 || statusCode === 403) {
    return "API Key 无效或已过期，请重新输入";
  }
  if (statusCode === 402) {
    return "AI 接口额度不足，请检查账户余额";
  }
  if (statusCode === 429) {
    return "请求太频繁啦，稍后再试试吧~";
  }
  if (statusCode >= 500) {
    return "AI 服务暂时不可用，请稍后再试~";
  }
  const remote =
    data && data.error && (data.error.message || data.error.code);
  return remote ? `AI 服务返回：${remote}` : `AI 服务异常（${statusCode}）`;
}

function getApiKey() {
  return (
    AI_CONFIG.API_KEY || wx.getStorageSync("deepseek_api_key") || ""
  ).trim();
}

// 首次使用弹窗让用户填一次 key，存本地，不写进源码
function ensureApiKey() {
  if (!AI_CONFIG.ALLOW_CLIENT_KEY_INPUT) {
    return Promise.reject(
      new Error("AI 服务暂时不可用，请稍后再试"),
    );
  }
  const key = getApiKey();
  if (key) return Promise.resolve(key);
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: "首次使用，填一次 API Key",
      editable: true,
      placeholderText: "粘贴 sk- 开头的 DeepSeek Key",
      confirmText: "保存",
      success(res) {
        const value = (res.content || "").trim();
        if (!res.confirm) {
          reject(new Error("未填写 API Key，AI 功能无法使用"));
          return;
        }
        if (!/^sk-/.test(value)) {
          reject(new Error("Key 格式不对，应以 sk- 开头"));
          return;
        }
        wx.setStorageSync("deepseek_api_key", value);
        resolve(value);
      },
      fail(err) {
        reject(
          new Error("无法弹出输入框：" + ((err && err.errMsg) || "未知错误")),
        );
      },
    });
  });
}

function aiHeaders() {
  const header = { "Content-Type": "application/json" };
  const key = getApiKey();
  if (key) {
    header.Authorization = "Bearer " + key;
  }
  return header;
}

// ============ 云函数通道（任意网络可用） ============
function canUseCloud() {
  return !!(CLOUD_CONFIG.ENABLE_CLOUD && wx.cloud && wx.cloud.callFunction);
}

function callCloud(data) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: CLOUD_CONFIG.FUNCTION_NAME,
      data,
      success(res) {
        const result = (res && res.result) || {};
        if (result.ok) {
          resolve(result);
        } else {
          reject(new Error(result.message || "云函数返回异常"));
        }
      },
      fail(err) {
        const msg = (err && err.errMsg) || "";
        if (/FunctionName|-501000|not found/i.test(msg)) {
          reject(new Error("云函数未部署：请右键 cloudfunctions/aiProxy 上传并部署"));
        } else {
          reject(new Error(networkErrorMessage(err)));
        }
      },
    });
  });
}

function cloudRecognize(filePath, mimeType) {
  const upload = filePath
    ? new Promise((resolve, reject) => {
        wx.cloud.uploadFile({
          cloudPath:
            "recognize/" +
            Date.now() +
            "-" +
            Math.floor(Math.random() * 1000) +
            ".jpg",
          filePath,
          success: (res) => resolve(res.fileID),
          fail: (err) =>
            reject(new Error("图片上传失败：" + ((err && err.errMsg) || "未知错误"))),
        });
      })
    : Promise.reject(new Error("缺少本地图片路径"));

  return upload
    .then((fileID) => callCloud({ action: "recognize", fileID, mimeType }))
    .then((res) => {
      const parsed = parseJsonReply(res.content);
      if (!parsed) {
        return {
          isHeritage: false,
          name: "识别结果",
          category: "",
          region: "",
          confidence: 0,
          summary: "",
          features: [],
          history: "",
          narration: String(res.content || "").trim(),
        };
      }
      parsed.isHeritage = parsed.isHeritage !== false;
      parsed.features = Array.isArray(parsed.features) ? parsed.features : [];
      return parsed;
    });
}

/**
 * 智能客服 AI 对话（通过代理调用大模型）
 * @param {string} content 用户消息
 * @param {Array} history 历史消息 [{role:'user'/'assistant', content}]
 * @returns {Promise<string>} AI 回复内容
 */
function chatAI(content, history = []) {
  if (!AI_CONFIG.ENABLE_REAL_API) {
    // 本地智能匹配（模拟远程 API 延迟）
    return new Promise((resolve) => {
      setTimeout(
        () => {
          resolve(localAIReply(content));
        },
        600 + Math.random() * 800,
      );
    });
  }

  const messages = [
    { role: "system", content: AI_CONFIG.SYSTEM_PROMPT },
  ].concat(
    (history || []).slice(-AI_CONFIG.MAX_HISTORY),
    [{ role: "user", content }],
  );

  if (canUseCloud()) {
    return callCloud({
      action: "chat",
      messages,
      temperature: AI_CONFIG.TEMPERATURE,
    }).then((res) => String(res.content || "").trim());
  }

  if (!getApiKey()) {
    return ensureApiKey().then(() => chatAI(content, history));
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: AI_CONFIG.API_URL,
      method: "POST",
      header: aiHeaders(),
      timeout: AI_CONFIG.TIMEOUT,
      data: {
        model: AI_CONFIG.MODEL,
        messages,
        temperature: AI_CONFIG.TEMPERATURE,
        stream: false,
      },
      success(res) {
        const reply =
          res.data &&
          res.data.choices &&
          res.data.choices[0] &&
          res.data.choices[0].message &&
          res.data.choices[0].message.content;
        if (res.statusCode === 200 && reply) {
          resolve(String(reply).trim());
        } else {
          if (res.statusCode === 401 || res.statusCode === 403) {
            wx.removeStorageSync("deepseek_api_key");
          }
          reject(new Error(explainApiError(res.statusCode, res.data)));
        }
      },
      fail(err) {
        reject(new Error(networkErrorMessage(err)));
      },
    });
  });
}

// ============ 拍照识非遗（视觉模型） ============
const VISION_PROMPT =
  "你是中国非物质文化遗产（非遗）鉴定专家。用户会发来一张照片，请判断照片里的事物是否属于非遗" +
  "（传统技艺、传统美术、传统音乐、传统舞蹈、传统戏剧、曲艺、传统体育游艺与杂技、民俗等类别）。" +
  "只输出一个 JSON 对象，不要输出任何多余文字或代码块标记：\n" +
  '{"isHeritage":true/false,"name":"非遗项目名称","category":"类别","region":"代表性地区",' +
  '"confidence":0-100,"summary":"80字以内概述","features":["特征1","特征2","特征3"],' +
  '"history":"80字以内历史渊源","narration":"150-250字口语化解说，像讲解员向游客介绍"}\n' +
  "若照片不是非遗，isHeritage 为 false，name 填识别到的物品名，narration 用友好语气说明并引导用户拍非遗相关照片。";

function parseJsonReply(text) {
  if (!text) return null;
  const cleaned = String(text)
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch (e) {
    return null;
  }
}

/**
 * 拍照识别非遗
 * @param {string} base64 图片 base64（不含 data: 前缀，仅 HTTP 代理模式使用）
 * @param {string} mimeType 如 image/jpeg
 * @param {string} filePath 本地图片路径（云函数模式用于上传云存储）
 * @returns {Promise<Object>} 结构化解说
 */
function recognizeHeritage(base64, mimeType = "image/jpeg", filePath) {
  if (canUseCloud()) {
    return cloudRecognize(filePath, mimeType);
  }

  if (!getApiKey()) {
    return ensureApiKey().then(() =>
      recognizeHeritage(base64, mimeType, filePath),
    );
  }

  return new Promise((resolve, reject) => {
    if (!VISION_CONFIG.API_URL) {
      reject(new Error("拍照识非遗未配置识别接口，请检查 utils/config.js"));
      return;
    }

    wx.request({
      url: VISION_CONFIG.API_URL,
      method: "POST",
      header: aiHeaders(),
      timeout: VISION_CONFIG.TIMEOUT,
      data: {
        model: VISION_CONFIG.MODEL,
        messages: [
          { role: "system", content: VISION_PROMPT },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "请识别这张照片里的非遗项目，并按约定的 JSON 格式输出。",
              },
              {
                type: "image_url",
                image_url: { url: `data:${mimeType};base64,${base64}` },
              },
            ],
          },
        ],
        temperature: 0.3,
        stream: false,
        response_format: { type: "json_object" },
      },
      success(res) {
        const reply =
          res.data &&
          res.data.choices &&
          res.data.choices[0] &&
          res.data.choices[0].message &&
          res.data.choices[0].message.content;
        if (res.statusCode !== 200 || !reply) {
          if (res.statusCode === 401 || res.statusCode === 403) {
            wx.removeStorageSync("deepseek_api_key");
          }
          reject(new Error(explainApiError(res.statusCode, res.data)));
          return;
        }
        const parsed = parseJsonReply(reply);
        if (!parsed) {
          resolve({
            isHeritage: true,
            name: "识别结果",
            category: "",
            region: "",
            confidence: 0,
            summary: "",
            features: [],
            history: "",
            narration: String(reply).trim(),
            raw: String(reply).trim(),
          });
          return;
        }
        parsed.isHeritage = parsed.isHeritage !== false;
        parsed.features = Array.isArray(parsed.features) ? parsed.features : [];
        resolve(parsed);
      },
      fail(err) {
        reject(new Error(networkErrorMessage(err)));
      },
    });
  });
}

module.exports = {
  login,
  loginByWechat,
  register,
  getCurrentUser,
  updateUser,
  changePassword,
  resetPassword,
  logout,
  requireLogin,
  listCategories,
  listHeritages,
  getHeritage,
  listInheritors,
  getInheritor,
  listVideoTypes,
  listVideos,
  getVideo,
  listActivities,
  getActivity,
  listCourseCategories,
  listCourses,
  getCourse,
  listCourseChapters,
  listShops,
  getShop,
  listShopProducts,
  listProducts,
  getProduct,
  listTopicCategories,
  listTopics,
  getTopic,
  listTopicComments,
  publishTopic,
  deleteTopic,
  commentTopic,
  listAnnouncements,
  isFavorite,
  toggleFavorite,
  listFavorites,
  toggleTopicLike,
  isTopicLiked,
  listCart,
  addToCart,
  updateCart,
  removeCart,
  listAddresses,
  saveAddress,
  deleteAddress,
  getDefaultAddress,
  createOrder,
  listOrders,
  getOrder,
  payOrder,
  cancelOrder,
  confirmReceive,
  applyRefund,
  getLogistics,
  registerActivity,
  getMyRegistration,
  cancelRegistration,
  signinActivity,
  reviewActivity,
  listMyActivities,
  buyCourse,
  isCourseBought,
  getLearnProgress,
  setChapterProgress,
  checkIn,
  listMyCheckins,
  reviewCourse,
  listCourseReviews,
  listConsultations,
  sendConsultation,
  listUnreadConsultCount,
  chatAI,
  recognizeHeritage,
  submitInheritorApplication,
  recommendHeritages,
  adminListUsers,
  adminToggleUserStatus,
  adminListApplications,
  adminReviewApplication,
  adminSaveHeritage,
  adminDeleteHeritage,
  adminSaveVideo,
  adminDeleteVideo,
  adminSaveActivity,
  adminDeleteActivity,
  adminListActivityRegistrations,
  adminSaveCourse,
  adminDeleteCourse,
  adminReviewTopic,
  adminSaveAnnouncement,
  adminDeleteAnnouncement,
  inheritorGetShop,
  inheritorSaveShop,
  inheritorListProducts,
  inheritorSaveProduct,
  inheritorDeleteProduct,
  inheritorListOrders,
  inheritorShipOrder,
  inheritorUpdateInfo,
  inheritorListHeritages,
  inheritorSaveHeritage,
  inheritorListActivities,
  inheritorSaveActivity,
  inheritorListCourses,
  inheritorSaveCourse,
  getStatistics,
};
