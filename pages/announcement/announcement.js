const api = require('../../utils/api.js');
Page({
  data: { list: [] },
  onShow() { this.setData({ list: api.listAnnouncements() }); }
});
