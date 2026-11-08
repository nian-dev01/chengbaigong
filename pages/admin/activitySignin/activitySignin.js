const api = require('../../../utils/api.js');
Page({
  data: { activities: [], activityNames: [], actIdx: 0, regs: [] },
  onShow() {
    const acts = api.listActivities();
    this.setData({ activities: acts, activityNames: acts.map(a => a.title) });
    if (acts.length) this.loadRegs(acts[0].id);
  },
  onAct(e) {
    const idx = Number(e.detail.value);
    this.setData({ actIdx: idx });
    this.loadRegs(this.data.activities[idx].id);
  },
  loadRegs(activityId) {
    this.setData({ regs: api.adminListActivityRegistrations(activityId) });
  }
});
