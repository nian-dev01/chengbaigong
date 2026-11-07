// 云函数：aiProxy
// 作用：把 DeepSeek 对话与识图请求放在服务端，key 只存在云函数环境变量里。
// 部署后需在云开发控制台给本函数配置环境变量 DEEPSEEK_API_KEY，并把超时时间调到 60 秒。
const cloud = require("wx-server-sdk");
const https = require("https");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const API_KEY = process.env.DEEPSEEK_API_KEY || "";
const MODEL = process.env.AI_MODEL || "deepseek-flash";
const UPSTREAM = "https://api.deepseek.com/chat/completions";

const VISION_PROMPT =
  "你是中国非物质文化遗产（非遗）鉴定专家。用户会发来一张照片，请判断照片里的事物是否属于非遗" +
  "（传统技艺、传统美术、传统音乐、传统舞蹈、传统戏剧、曲艺、传统体育游艺与杂技、民俗等类别）。" +
  "只输出一个 JSON 对象，不要输出任何多余文字或代码块标记：\n" +
  '{"isHeritage":true/false,"name":"非遗项目名称","category":"类别","region":"代表性地区",' +
  '"confidence":0-100,"summary":"80字以内概述","features":["特征1","特征2","特征3"],' +
  '"history":"80字以内历史渊源","narration":"150-250字口语化解说，像讲解员向游客介绍"}\n' +
  "若照片不是非遗，isHeritage 为 false，name 填识别到的物品名，narration 用友好语气说明并引导用户拍非遗相关照片。";

function postJSON(payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = https.request(
      UPSTREAM,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + API_KEY,
          "Content-Length": Buffer.byteLength(body),
        },
        timeout: 55000,
      },
      (res) => {
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          let parsed = null;
          try {
            parsed = JSON.parse(data);
          } catch (e) {
            parsed = null;
          }
          if (res.statusCode !== 200) {
            const remote =
              parsed && parsed.error && parsed.error.message;
            reject(new Error(remote || "AI 服务异常（" + res.statusCode + "）"));
            return;
          }
          const content =
            parsed &&
            parsed.choices &&
            parsed.choices[0] &&
            parsed.choices[0].message &&
            parsed.choices[0].message.content;
          if (!content) {
            reject(new Error("AI 返回内容为空"));
            return;
          }
          resolve(String(content).trim());
        });
      }
    );
    req.on("timeout", () => {
      req.destroy(new Error("AI 请求超时"));
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function loadBase64(event) {
  if (event.imageBase64) return String(event.imageBase64);
  if (!event.fileID) throw new Error("缺少图片参数");
  const file = await cloud.downloadFile({ fileID: event.fileID });
  return file.fileContent.toString("base64");
}

exports.main = async (event) => {
  if (!API_KEY) {
    return {
      ok: false,
      message:
        "云函数缺少环境变量 DEEPSEEK_API_KEY：请在云开发控制台 → 云函数 → aiProxy → 配置 → 环境变量中添加",
    };
  }

  try {
    if (event.action === "chat") {
      const messages = Array.isArray(event.messages) ? event.messages : [];
      const content = await postJSON({
        model: MODEL,
        messages,
        temperature:
          typeof event.temperature === "number" ? event.temperature : 0.7,
        stream: false,
      });
      return { ok: true, content };
    }

    if (event.action === "recognize") {
      const base64 = await loadBase64(event);
      const mime = event.mimeType || "image/jpeg";
      const content = await postJSON({
        model: MODEL,
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
                image_url: { url: "data:" + mime + ";base64," + base64 },
              },
            ],
          },
        ],
        temperature: 0.3,
        stream: false,
        response_format: { type: "json_object" },
      });
      return { ok: true, content };
    }

    return { ok: false, message: "未知的 action：" + String(event.action) };
  } catch (err) {
    return { ok: false, message: (err && err.message) || "云函数调用失败" };
  }
};
