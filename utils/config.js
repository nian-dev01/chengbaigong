// utils/config.js - 全局配置
// ============ 智能客服 API 配置 ============
// 直连 DeepSeek 官方接口：手机用流量/任意 WiFi 都能用，不需要电脑代理。
const AI_CONFIG = {
  // 是否启用真实 API（false = 本地关键词匹配模拟）
  ENABLE_REAL_API: true,

  // 直连官方接口
  API_URL: "https://api.deepseek.com/chat/completions",

  // 把 DeepSeek 的 key（sk- 开头）粘贴到下面这行引号里
  // 正式给用户使用时保持为空：key 放在云函数环境变量里，用户无感
  API_KEY: "",

  // 是否允许在客户端弹窗让用户填 key（仅开发者自测时打开，正式版必须 false）
  ALLOW_CLIENT_KEY_INPUT: false,

  // 对话模型（代理服务端也会使用同名模型）
  MODEL: "deepseek-flash",

  // 请求超时（毫秒）
  TIMEOUT: 30000,

  // 携带的历史消息条数（避免上下文过长）
  MAX_HISTORY: 10,

  // 温度（0-2），越高越发散
  TEMPERATURE: 0.7,

  // 系统提示词（AI 人设）
  SYSTEM_PROMPT:
    '你是"小智"，一个温暖有耐心的非遗文化 AI 客服。请用简洁友好的语气回答用户关于非遗、活动、课程、商品、订单等问题。' +
    "回答控制在 200 字以内，必要时分点说明；不确定的信息不要编造，可以引导用户到对应板块查看。",
};

// ============ 拍照识非遗（视觉模型）配置 ============
// deepseek-flash 支持图片输入，代理端负责鉴权。
const VISION_CONFIG = {
  // 直连官方接口
  API_URL: "https://api.deepseek.com/chat/completions",

  // 复用上方 AI_CONFIG 的 key，无需单独填写
  API_KEY: "",

  // 视觉模型名称（代理服务端也会使用同名模型）
  MODEL: "deepseek-flash",

  // 请求超时（毫秒），图片识别较慢，给足时间
  TIMEOUT: 60000,
};

// ============ 微信云开发配置 ============
// 开启后 AI 对话与拍照识非遗走云函数，不依赖本地代理和同一 WiFi
const CLOUD_CONFIG = {
  // 云函数模式：key 放云函数环境变量，用户端完全无感（正式使用请保持 true）
  ENABLE_CLOUD: true,

  // 云函数名称（对应 cloudfunctions/aiProxy）
  FUNCTION_NAME: "aiProxy",
};

// ============ 通用接口配置 ============
const APP_CONFIG = {
  // 后端 API 根地址（如果有真实后端）
  API_BASE: "",

  // 请求最大重试次数
  MAX_RETRY: 2,
};

module.exports = { AI_CONFIG, VISION_CONFIG, CLOUD_CONFIG, APP_CONFIG };
