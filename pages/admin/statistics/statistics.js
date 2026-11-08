const db = require('../../../utils/db.js');
const api = require('../../../utils/api.js');
Page({
  data: { stats: {}, maxCat: 1 },
  onShow() {
    const stats = api.getStatistics();
    stats.adminCount = db.count('users', u => u.role === 'admin');
    const maxCat = Math.max(1, ...stats.categoryStat.map(c => c.value));
    this.setData({ stats, maxCat });
  }
});
