const api = require('../../utils/api.js');
Page({
  data: {
    courseId: '', chapterId: '', course: null, chapter: null, chapters: [],
    playing: false, progress: 0, timer: null, progressMap: {},
    checkins: [], checkinContent: '', rating: 5, reviewContent: ''
  },
  onLoad(opts) {
    this.setData({ courseId: opts.courseId, chapterId: opts.chapterId });
    this.load();
  },
  load() {
    const course = api.getCourse(this.data.courseId);
    const chapters = api.listCourseChapters(this.data.courseId);
    const chapter = chapters.find(c => String(c.id) === String(this.data.chapterId)) || chapters[0];
    this.setData({
      course, chapters, chapter,
      progressMap: api.getLearnProgress(this.data.courseId),
      checkins: api.listMyCheckins(this.data.courseId)
    });
  },
  switchChapter(e) {
    const id = e.currentTarget.dataset.id;
    const ch = this.data.chapters.find(c => c.id === id);
    if (!ch) return;
    if (!api.isCourseBought(this.data.courseId) && !ch.free) {
      return wx.showToast({ title: '请先购买课程', icon: 'none' });
    }
    clearInterval(this.data.timer);
    this.setData({ chapterId: id, chapter: ch, playing: false, progress: 0 });
  },
  togglePlay() {
    const playing = !this.data.playing;
    this.setData({ playing });
    if (playing) {
      const t = setInterval(() => {
        let p = this.data.progress + 1;
        if (p >= 100) {
          p = 100; clearInterval(this.data.timer); this.setData({ playing: false });
          api.setChapterProgress(this.data.courseId, this.data.chapter.id, 100, true);
          this.setData({ progressMap: api.getLearnProgress(this.data.courseId) });
          wx.showToast({ title: '本节已学完', icon: 'success' });
        } else {
          api.setChapterProgress(this.data.courseId, this.data.chapter.id, p, false);
        }
        this.setData({ progress: p });
      }, 300);
      this.setData({ timer: t });
    } else {
      clearInterval(this.data.timer);
    }
  },
  onCheckin(e) { this.setData({ checkinContent: e.detail.value }); },
  doCheckin() {
    if (!this.data.checkinContent) return wx.showToast({ title: '请输入打卡内容', icon: 'none' });
    const res = api.checkIn(this.data.courseId, this.data.checkinContent);
    if (res.code === 200) {
      this.setData({ checkinContent: '', checkins: api.listMyCheckins(this.data.courseId) });
      wx.showToast({ title: '打卡成功', icon: 'success' });
    }
  },
  setRating(e) { this.setData({ rating: e.currentTarget.dataset.v }); },
  onReview(e) { this.setData({ reviewContent: e.detail.value }); },
  submitReview() {
    if (!this.data.reviewContent) return wx.showToast({ title: '请输入评价内容', icon: 'none' });
    api.reviewCourse(this.data.courseId, this.data.rating, this.data.reviewContent);
    this.setData({ reviewContent: '' });
    wx.showToast({ title: '评价成功', icon: 'success' });
  },
  onUnload() { clearInterval(this.data.timer); }
});
