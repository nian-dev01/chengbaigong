const api = require('../../utils/api.js');
const { VISION_CONFIG, CLOUD_CONFIG } = require('../../utils/config.js');

function chooseImage() {
  return new Promise((resolve, reject) => {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera', 'album'],
      sizeType: ['compressed'],
      camera: 'back',
      success: (res) => resolve(res.tempFiles[0]),
      fail: reject,
    });
  });
}

function compressImage(src, quality) {
  return new Promise((resolve) => {
    wx.compressImage({
      src,
      quality: quality || 70,
      success: (res) => resolve(res.tempFilePath),
      fail: () => resolve(src),
    });
  });
}

function readBase64(filePath) {
  return new Promise((resolve, reject) => {
    wx.getFileSystemManager().readFile({
      filePath,
      encoding: 'base64',
      success: (res) => resolve(res.data),
      fail: reject,
    });
  });
}

Page({
  data: {
    msgs: [],
    content: '',
    typing: false,
    recognizing: false,
    scrollId: '',
    quickQuestions: [
      '有哪些非遗项目？',
      '最近有什么活动？',
      '课程怎么购买？',
      '商品在哪买？',
    ],
    aiName: '小智',
  },

  onLoad() {
    // 对话上下文（不含当前正在发送的消息）
    this.history = [];
    // 首屏欢迎消息
    const welcomeMsg = {
      id: 'welcome',
      fromAI: true,
      content:
        '你好呀~ 我是小智 🌿\n可以问我关于非遗文化、活动报名、课程学习、文创商品等问题。\n也可以点左下角 📷 拍照，我来识别这是什么非遗并给你解说！',
      createTime: this.formatTime(new Date()),
    };
    this.setData({ msgs: [welcomeMsg] });
    this.scrollBottom();
  },

  formatTime(d) {
    const pad = (n) => n < 10 ? '0' + n : '' + n;
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  },

  nextId() {
    return Date.now() + '-' + Math.floor(Math.random() * 1000);
  },

  scrollBottom() {
    const msgs = this.data.msgs;
    if (msgs.length) {
      this.setData({ scrollId: 'msg-' + msgs[msgs.length - 1].id });
    }
  },

  onInput(e) {
    this.setData({ content: e.detail.value });
  },

  useQuick(e) {
    this.setData({ content: e.currentTarget.dataset.q });
  },

  async send() {
    const text = this.data.content.trim();
    if (!text || this.data.typing || this.data.recognizing) return;

    // 用户消息
    const userMsg = {
      id: this.nextId(),
      fromAI: false,
      content: text,
      createTime: this.formatTime(new Date()),
    };
    const msgs = this.data.msgs.concat([userMsg]);
    this.setData({ msgs, content: '', typing: true });
    this.scrollBottom();

    // 调 AI 获取回复
    const history = this.history.slice();
    try {
      const reply = await api.chatAI(text, history);
      this.history.push(
        { role: 'user', content: text },
        { role: 'assistant', content: reply },
      );
      if (this.history.length > 20) this.history = this.history.slice(-20);
      this.setData({ typing: false });
      this.typeWriter(reply);
    } catch (err) {
      this.setData({ typing: false });
      const tip = err && err.message ? err.message : '抱歉，我这边网络不太好，稍后再试试吧~';
      this.typeWriter('⚠️ ' + tip);
      wx.showToast({ title: 'AI 服务调用失败', icon: 'none' });
    }
  },

  // 拍照 / 相册识别非遗
  async takePhoto() {
    if (this.data.recognizing || this.data.typing) return;

    // 未配置识别能力时给出明确指引
    if (!CLOUD_CONFIG.ENABLE_CLOUD && !VISION_CONFIG.API_URL) {
      wx.showModal({
        title: '还差一步配置',
        content: '拍照识非遗需要在 utils/config.js 的 VISION_CONFIG 填入识别接口地址。',
        showCancel: false,
        confirmText: '知道了',
      });
      return;
    }

    let file;
    try {
      file = await chooseImage();
    } catch (err) {
      // 用户取消选择，不提示
      return;
    }

    const userMsg = {
      id: this.nextId(),
      fromAI: false,
      content: '',
      image: file.tempFilePath,
      createTime: this.formatTime(new Date()),
    };
    this.setData({
      msgs: this.data.msgs.concat([userMsg]),
      recognizing: true,
    });
    this.scrollBottom();

    try {
      const compressed = await compressImage(file.tempFilePath, 70);
      const base64 = await readBase64(compressed);
      const ext = (file.tempFilePath.match(/\.(\w+)$/) || [])[1] || 'jpg';
      const mime = /png/i.test(ext) ? 'image/png' : 'image/jpeg';
      const heritage = await api.recognizeHeritage(base64, mime, compressed);

      const aiMsg = {
        id: this.nextId(),
        fromAI: true,
        content: '',
        heritage,
        createTime: this.formatTime(new Date()),
      };
      this.setData({ msgs: this.data.msgs.concat([aiMsg]), recognizing: false });
      this.scrollBottom();
    } catch (err) {
      const tip = err && err.message ? err.message : '识别失败，请换个角度再拍一张试试~';
      this.setData({ recognizing: false });
      this.typeWriter('⚠️ ' + tip);
      wx.showToast({ title: '识别失败', icon: 'none' });
    }
  },

  previewImage(e) {
    const src = e.currentTarget.dataset.src;
    if (src) wx.previewImage({ current: src, urls: [src] });
  },

  // 打字机逐字显示
  typeWriter(fullText) {
    const id = 'ai-' + this.nextId();
    const aiMsg = {
      id,
      fromAI: true,
      content: '',
      fullText,
      createTime: this.formatTime(new Date()),
      typing: true,
    };
    const msgs = this.data.msgs.concat([aiMsg]);
    this.setData({ msgs });
    this.scrollBottom();

    // 逐字
    let i = 0;
    const speed = 50; // ms per char
    const timer = setInterval(() => {
      i++;
      const currentMsgs = this.data.msgs;
      const idx = currentMsgs.findIndex(m => m.id === id);
      if (idx === -1) {
        clearInterval(timer);
        return;
      }
      currentMsgs[idx].content = fullText.slice(0, i);
      if (i >= fullText.length) {
        currentMsgs[idx].typing = false;
        clearInterval(timer);
      }
      this.setData({ msgs: currentMsgs });
      this.scrollBottom();
    }, speed);
  },
});
