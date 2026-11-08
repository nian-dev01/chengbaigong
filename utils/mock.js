// utils/mock.js 模拟数据初始化 - 真实匹配图片版
const db = require("./db.js");

// picsum.photos 稳定随机图（seed 相同返回同一张，保证每条非遗图固定）
const U = (seed, w = 600, h = 600) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
const DICEBEAR = (seed, color = "f4e1d2") =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${color}`;

const DATA_VERSION = "v12_hongkong_heritage";

function seed(key, data) {
  wx.setStorageSync("db_" + key, data);
}

// ============ 34 个省级行政区非遗补充数据 ============
// 字段：[省份, 名称, 分类ID, 级别, 简介, 详情]
const HERITAGE_EXTRA = [
  // 北京（已有：京剧、景泰蓝制作）
  [
    "北京",
    "相声",
    3,
    "国家级",
    "说学逗唱四门功课，京津茶馆里的民间幽默。",
    "相声形成于清末，以说、学、逗、唱为基本功，侯宝林、马三立为代表人物。",
  ],
  [
    "北京",
    "花丝镶嵌",
    1,
    "国家级",
    "金银细丝掐编织焊，皇家首饰技艺。",
    "花丝镶嵌以金银拉丝、掐丝、编织、焊接而成，明清时为宫廷御用工艺。",
  ],
  [
    "北京",
    "雕漆技艺",
    1,
    "国家级",
    "层层髹漆百遍，刀刻浮雕纹样。",
    "雕漆需在胎体上髹漆数十至上百道，再以刀雕刻山水人物纹样，工期经年。",
  ],
  // 天津（已有：杨柳青年画、京韵大鼓）
  [
    "天津",
    "泥人张彩塑",
    2,
    "国家级",
    "一把泥塑出市井百态，形神兼备。",
    "泥人张始于清道光年间，以写实传神著称，作品多取材民俗生活。",
  ],
  [
    "天津",
    "天津风筝魏",
    1,
    "国家级",
    "骨架可拆可装，彩绘工笔重彩。",
    "风筝魏以打眼扣榫、可拆装骨架和工笔重彩绘制闻名，曾在国际赛会获奖。",
  ],
  // 河北
  [
    "河北",
    "吴桥杂技",
    8,
    "国家级",
    "杂技之乡，上至九十九下至刚会走。",
    "吴桥杂技历史悠久，艺人遍及国内外，被誉为杂技之乡。",
  ],
  [
    "河北",
    "蔚县剪纸",
    2,
    "世界级",
    "点彩刻纸，色彩浓艳的窗花。",
    "蔚县剪纸以刻代剪，再施点彩，2009年随中国剪纸入选人类非遗。",
  ],
  [
    "河北",
    "衡水内画",
    2,
    "国家级",
    "壶中天地，一笔一画反手作画。",
    "衡水内画在鼻烟壶内壁反向绘制，以冀派内画最为著名。",
  ],
  [
    "河北",
    "定州缂丝",
    1,
    "国家级",
    "通经断纬，一寸缂丝一寸金。",
    "定州缂丝以通经断纬技法织造，图案如刻如画，宋代即为贡品。",
  ],
  // 山西
  [
    "山西",
    "晋剧",
    5,
    "国家级",
    "中路梆子，梆子腔中的婉转一派。",
    "晋剧又称中路梆子，流行于晋中一带，唱腔婉转，代表剧目《打金枝》。",
  ],
  [
    "山西",
    "平遥推光漆器髹饰技艺",
    1,
    "国家级",
    "手掌推光，漆面如镜。",
    "平遥推光漆器以天然大漆反复髹涂，用手掌推磨出镜面光泽，再绘金描彩。",
  ],
  [
    "山西",
    "广灵剪纸",
    2,
    "世界级",
    "刀刻染色，细腻如画。",
    "广灵剪纸以刀刻为主、染色为辅，构图饱满，2009年随中国剪纸入选人类非遗。",
  ],
  [
    "山西",
    "山西老陈醋酿造技艺",
    1,
    "国家级",
    "蒸酵熏淋陈，五年方成老醋。",
    "老陈醋经蒸、酵、熏、淋、陈五步，夏晒冬捞，陈酿愈久愈香。",
  ],
  [
    "山西",
    "五台山佛乐",
    3,
    "国家级",
    "梵音清越，寺庙音乐的活化石。",
    "五台山佛乐分青庙、黄庙两派，曲调古朴，是研究古代佛教音乐的活标本。",
  ],
  // 内蒙古
  [
    "内蒙古",
    "蒙古族长调民歌",
    3,
    "世界级",
    "字少腔长，草原上的悠远歌声。",
    "长调民歌节奏自由、气息悠长，多咏叹草原、骏马与亲情，2005年入选人类非遗。",
  ],
  [
    "内蒙古",
    "蒙古族呼麦",
    3,
    "世界级",
    "一人唱出双声，喉音艺术的绝技。",
    "呼麦以特殊发声方法同时发出持续低音与高音旋律，2010年入选人类非遗。",
  ],
  [
    "内蒙古",
    "蒙古族刺绣",
    2,
    "国家级",
    "针脚之间绣出草原纹样。",
    "蒙古族刺绣题材多为花草、云纹与牲畜，色彩浓烈，兼具实用与装饰。",
  ],
  // 辽宁
  [
    "辽宁",
    "岫岩玉雕",
    1,
    "国家级",
    "因材施艺，素活见长。",
    "岫岩玉雕以本地玉石为材，讲究因料设计，素活与花活并重。",
  ],
  [
    "辽宁",
    "满族剪纸",
    2,
    "世界级",
    "萨满信仰与山林生活的剪影。",
    "满族剪纸题材多取萨满神偶、山林动物，2009年随中国剪纸入选人类非遗。",
  ],
  // 吉林（已有：二人转）
  // 黑龙江
  [
    "黑龙江",
    "东北大鼓",
    3,
    "国家级",
    "一人击鼓说唱，关东腔调。",
    "东北大鼓以鼓板击节、三弦伴奏，唱腔粗犷豪放。",
  ],
  // 上海
  [
    "上海",
    "沪剧",
    5,
    "国家级",
    "吴语软糯，唱尽市井悲欢。",
    "沪剧由滩簧发展而来，以现代题材见长，代表剧目《芦荡火种》。",
  ],
  [
    "上海",
    "顾绣",
    1,
    "国家级",
    "以针代笔，绣出宋元名画。",
    "顾绣源于明代顾名世家族，以丝线摹绣书画，讲究丝理与晕色。",
  ],
  [
    "上海",
    "江南丝竹",
    3,
    "国家级",
    "竹笛二胡，江南水乡的清音。",
    "江南丝竹以笛、二胡、琵琶、扬琴等合奏，曲调轻快流畅，代表曲《行街》。",
  ],
  // 江苏（已有：苏绣、南京云锦织造、昆曲）
  // 浙江（已有：龙泉青瓷烧制、金石篆刻）
  [
    "浙江",
    "西湖绸伞",
    1,
    "国家级",
    "竹为骨绸为面，撑开西湖景。",
    "西湖绸伞以淡竹为骨、丝绸为面，伞面刷花图案多取西湖风景。",
  ],
  // 安徽
  [
    "安徽",
    "黄梅戏",
    5,
    "国家级",
    "树上的鸟儿成双对，唱遍大江南北。",
    "黄梅戏源于安庆，唱腔明快流畅，代表剧目《天仙配》《女驸马》。",
  ],
  [
    "安徽",
    "徽州三雕",
    2,
    "国家级",
    "砖木石三雕，徽派建筑之魂。",
    "徽州三雕指砖雕、木雕、石雕，多用于民居门楼、窗棂与梁架装饰。",
  ],
  // 福建
  [
    "福建",
    "闽南木偶戏",
    5,
    "世界级",
    "掌中木偶，指尖演尽悲欢。",
    "闽南木偶戏含提线、掌中两类，以泉州、漳州最为兴盛，2012年入选人类非遗。",
  ],
  // 江西（已有：景德镇手工制瓷）
  // 山东
  [
    "山东",
    "吕剧",
    5,
    "国家级",
    "山东琴书化装登台，乡土味浓。",
    "吕剧由山东琴书演变而来，唱腔朴实，代表剧目《李二嫂改嫁》。",
  ],
  [
    "山东",
    "山东快书",
    3,
    "国家级",
    "竹板一打，说唱武松。",
    "山东快书以竹板击节、韵白说唱，代表曲目《武松传》。",
  ],
  [
    "山东",
    "潍坊风筝",
    1,
    "国家级",
    "扎糊绘放，一线牵风。",
    "潍坊风筝以竹骨绢面、工笔彩绘见长，讲究扎、糊、绘、放四艺。",
  ],
  // 河南（已有：朱仙镇木版年画）
  [
    "河南",
    "豫剧",
    5,
    "国家级",
    "中州音韵，唱遍黄河两岸。",
    "豫剧以唱功见长，唱腔铿锵大气，代表剧目《花木兰》《朝阳沟》。",
  ],
  // 湖北
  [
    "湖北",
    "汉剧",
    5,
    "国家级",
    "皮黄之源，湖北大戏。",
    "汉剧以西皮二黄为主，对京剧形成有重要影响，代表剧目《宇宙锋》。",
  ],
  [
    "湖北",
    "楚剧",
    5,
    "国家级",
    "贴近生活的湖北乡土戏。",
    "楚剧由黄孝花鼓发展而来，语言通俗，擅长表现民间生活。",
  ],
  [
    "湖北",
    "汉绣",
    2,
    "国家级",
    "平金夹绣，浓艳富丽。",
    "汉绣针法丰富，色彩浓艳，多用于戏衣、堂彩与民俗用品。",
  ],
  [
    "湖北",
    "武当武术",
    8,
    "国家级",
    "内家拳宗，以静制动。",
    "武当武术以太极、形意、八卦等内家拳法为代表，讲究以柔克刚。",
  ],
  // 湖南
  [
    "湖南",
    "湘绣",
    1,
    "国家级",
    "以鬅毛针绣狮虎，栩栩如生。",
    "湘绣以鬅毛针法绣狮虎最为著名，色彩层次丰富，与苏绣并称。",
  ],
  [
    "湖南",
    "花鼓戏",
    5,
    "国家级",
    "湖南花鼓，载歌载舞。",
    "湖南花鼓戏源于民歌小调，代表剧目《刘海砍樵》《打铜锣》。",
  ],
  // 广东（已有：粤绣、粤剧）
  [
    "广东",
    "醒狮",
    8,
    "国家级",
    "南狮腾跃，采青纳福。",
    "醒狮融武术、舞蹈与鼓乐于一体，南狮以采青技艺最为精彩。",
  ],
  // 广西
  [
    "广西",
    "瑶族服饰",
    7,
    "国家级",
    "挑花刺绣，五彩斑斓。",
    "瑶族服饰以挑花、刺绣、蜡染装饰，不同支系图案各异。",
  ],
  // 海南
  [
    "海南",
    "海南椰雕",
    2,
    "国家级",
    "以椰壳为材，雕出南国风物。",
    "椰雕利用椰壳天然纹理雕刻，可制茶具、摆件，古朴雅致。",
  ],
  [
    "海南",
    "琼剧",
    5,
    "国家级",
    "海南大戏，唱腔婉转。",
    "琼剧以琼语演唱，融合板腔与曲牌，代表剧目《张文秀》。",
  ],
  // 重庆
  [
    "重庆",
    "铜梁龙舞",
    4,
    "国家级",
    "火龙腾空，铁水飞花。",
    "铜梁龙舞含火龙、大蠕龙等形式，火龙表演以铁水打花最为壮观。",
  ],
  // 四川（已有：川剧变脸）
  [
    "四川",
    "蜀绣",
    1,
    "国家级",
    "针法严谨，蜀中名绣。",
    "蜀绣以晕针、铺针等针法见长，题材多为花鸟鱼虫，与苏绣齐名。",
  ],
  // 贵州（已有：侗族大歌）
  // 云南（已有：傣族泼水节）
  // 西藏（已有：藏戏）
  // 陕西（已有：剪纸、秦腔、红拳）
  // 甘肃
  [
    "甘肃",
    "兰州太平鼓",
    4,
    "国家级",
    "鼓声如雷，鼓舞太平。",
    "兰州太平鼓鼓身长大，舞者挎鼓腾跃，动作雄浑，多在春节表演。",
  ],
  // 青海
  [
    "青海",
    "热贡艺术",
    2,
    "世界级",
    "唐卡、壁画与堆绣的艺术之乡。",
    "热贡艺术含唐卡、壁画、泥塑、堆绣等，2009年入选人类非遗。",
  ],
  [
    "青海",
    "土族盘绣",
    1,
    "国家级",
    "一盘一针，七彩盘绕。",
    "土族盘绣以两针两线盘绕成纹，图案多为太阳、五瓣梅。",
  ],
  // 宁夏
  [
    "宁夏",
    "宁夏花儿",
    3,
    "国家级",
    "六盘山下的高亢山歌。",
    "宁夏花儿融合回族音乐元素，曲调高亢，多用比兴唱词。",
  ],
  [
    "宁夏",
    "回族服饰",
    7,
    "国家级",
    "素净端庄，白帽盖头。",
    "回族服饰以白、黑、绿为主色，男子戴白帽，女子戴盖头。",
  ],
  // 新疆（已有：维吾尔十二木卡姆）
  // 台湾
  [
    "台湾",
    "布袋戏",
    5,
    "国家级",
    "掌中乾坤，木偶演江湖。",
    "布袋戏以手掌操偶，配合口白与锣鼓，角色行当分明。",
  ],
  // 香港
  [
    "香港",
    "大坑舞火龙",
    7,
    "国家级",
    "稻草扎龙插满长寿香，中秋夜火龙穿街。",
    "大坑舞火龙始于十九世纪末，以稻草扎成龙身并插满长寿香，中秋夜于大坑区舞动穿梭，祈求平安。",
  ],
  // 澳门
  // 恢复条目（图片存在，文件名已统一为完整名称）
  [
    "黑龙江",
    "冰灯冰雕制作技艺",
    1,
    "国家级",
    "以冰为材，灯火透亮。",
    "冰灯以天然冰块雕琢成形，内置灯盏，是哈尔滨冬季标志性民俗艺术。",
  ],
  [
    "广西",
    "刘三姐歌谣",
    3,
    "国家级",
    "歌仙传说，山歌传情。",
    "刘三姐歌谣以七言四句为主，曲调丰富，是壮族山歌的代表。",
  ],
  [
    "广西",
    "壮锦技艺",
    1,
    "国家级",
    "通经断纬，织出壮乡纹样。",
    "壮锦以棉纱为经、彩绒为纬，图案多为几何与花鸟，与云锦、宋锦并称。",
  ],
  [
    "福建",
    "妈祖信俗",
    7,
    "世界级",
    "海上守护神，两岸共同信仰。",
    "妈祖信俗以湄洲祖庙为中心，祭典、进香与庙会世代相传，2009年入选人类非遗。",
  ],
  [
    "安徽",
    "宣纸制作技艺",
    1,
    "世界级",
    "纸寿千年，书画之魂。",
    "宣纸以青檀皮和沙田稻草为料，经百余道工序制成，2009年入选人类非遗。",
  ],
  [
    "甘肃",
    "庆阳香包绣制",
    1,
    "国家级",
    "针线纳福，香草随身。",
    "庆阳香包以彩绸缝制、刺绣纹样，内填香草，端午佩戴祈福。",
  ],
  [
    "甘肃",
    "敦煌彩塑制作技艺",
    2,
    "国家级",
    "泥胎彩绘，佛国造像。",
    "敦煌彩塑以木骨泥胎塑形，再施彩绘，延续千年造像传统。",
  ],
  [
    "云南",
    "普洱茶制作技艺",
    1,
    "国家级",
    "杀青揉捻，越陈越香。",
    "普洱茶经杀青、揉捻、晒干、蒸压成饼，后发酵愈久愈醇。",
  ],
  [
    "黑龙江",
    "桦树皮制作技艺",
    1,
    "国家级",
    "剥皮成器，森林民族的日用。",
    "桦树皮制作以桦皮缝制器具、船篷，轻便耐用，纹饰古朴。",
  ],
  [
    "澳门",
    "澳门神像雕刻",
    2,
    "国家级",
    "木雕神像，庙宇庄严。",
    "澳门神像雕刻以樟木等雕制佛像、神像，兼作贴金与彩绘。",
  ],
  [
    "天津",
    "狗不理包子制作技艺",
    1,
    "国家级",
    "十八个褶形似菊花，皮薄馅大。",
    "狗不理包子始创于清咸丰年间，以水馅半发面工艺和十八褶造型著称。",
  ],
  [
    "云南",
    "白族扎染技艺",
    1,
    "国家级",
    "板蓝根染，蓝白相间。",
    "大理白族扎染以针线扎缚布料，用板蓝根染液反复浸染，纹样自然。",
  ],
  [
    "湖南",
    "湘西苗族鼓舞",
    4,
    "国家级",
    "鼓声激越，鼓舞飞扬。",
    "苗族鼓舞边击鼓边舞，动作刚劲，是湘西苗寨节庆的重要内容。",
  ],
  [
    "重庆",
    "荣昌折扇制作技艺",
    1,
    "国家级",
    "竹骨纸面，开合生风。",
    "荣昌折扇以棕竹为骨、丝绸或纸为面，做工精细，曾为贡品。",
  ],
  [
    "宁夏",
    "贺兰砚制作技艺",
    1,
    "国家级",
    "紫石为砚，发墨不损毫。",
    "贺兰砚以贺兰山紫石雕制，石质细密，雕工多取山水花鸟。",
  ],
  [
    "黑龙江",
    "达斡尔族鲁日格勒舞",
    4,
    "国家级",
    "边歌边舞，模拟劳动与鸟兽。",
    "鲁日格勒意为燃烧，舞者边唱边舞，动作模拟采集、狩猎与鸟兽形态。",
  ],
  [
    "内蒙古",
    "蒙古族那达慕",
    7,
    "国家级",
    "赛马摔跤射箭，草原盛会。",
    "那达慕为蒙古族传统盛会，以男儿三艺赛马、摔跤、射箭为主要内容。",
  ],
  [
    "江西",
    "铅山连四纸制作技艺",
    1,
    "国家级",
    "古法造纸，纸白如玉。",
    "连四纸以嫩竹为料，经浸沤、蒸煮、舂捣、抄纸等工序，历久不变色。",
  ],
  [
    "内蒙古",
    "马头琴音乐",
    3,
    "国家级",
    "两弦之间，草原的风与马嘶。",
    "马头琴琴头雕马头，音色苍凉悠远，是蒙古族代表性乐器。",
  ],
  [
    "海南",
    "黎族传统纺染织绣技艺",
    1,
    "世界级",
    "絣染织锦，黎锦千年。",
    "黎锦以踞腰织机织造，絣染技法独特，2009年入选人类非遗。",
  ],
  [
    "浙江",
    "龙泉宝剑锻制技艺",
    1,
    "国家级",
    "千锤百炼，剑光如秋水。",
    "龙泉宝剑经锻打、淬火、磨光等工序，传统剑身可柔可刚。",
  ],
];

// 把补充表转换成完整非遗对象（id 从 26 开始，不与已有 25 条冲突）
function buildExtraHeritages() {
  return HERITAGE_EXTRA.map(function (row, i) {
    const region = row[0];
    const name = row[1];
    return {
      id: 26 + i,
      categoryId: row[2],
      name: name,
      cover: "/images/heritage/" + name + ".png",
      region: region,
      level: row[3],
      intro: row[4],
      content: row[5],
      inheritorId: (i % 3) + 1,
      views: 2600 + ((i * 137) % 9000),
      likes: 160 + ((i * 57) % 700),
      status: 1,
      createTime: "2026-02-10 10:00:00",
    };
  });
}

function ensureTopicCategories() {
  const key = "db_topicCategories";
  const exist = wx.getStorageSync(key);
  if (!exist || !exist.length) {
    wx.setStorageSync(key, [
      { id: 1, name: "技艺交流" },
      { id: 2, name: "体验分享" },
      { id: 3, name: "国风雅集" },
      { id: 4, name: "活动约伴" },
      { id: 5, name: "求助问答" },
    ]);
  }
}

// 把内置样例活动统一更新到 2026 年 11 月档期（老数据也能生效）
function refreshActivityTime() {
  const times = {
    1: ["2026-11-08 09:00:00", "2026-11-08 12:00:00"],
    2: ["2026-11-14 14:00:00", "2026-11-14 17:00:00"],
    3: ["2026-11-21 10:00:00", "2026-11-21 12:00:00"],
    4: ["2026-11-28 14:00:00", "2026-11-28 16:00:00"],
  };
  const list = db.getTable("activities");
  let changed = false;
  list.forEach((a) => {
    const t = times[a.id];
    if (t && a.startTime !== t[0]) {
      a.startTime = t[0];
      a.endTime = t[1];
      changed = true;
    }
  });
  if (changed) db.setTable("activities", list);
}

// 话题评论/点赞补真数据：让列表数字和详情内容完全对得上
function ensureTopicInteractions() {
  if (wx.getStorageSync("topic_interactions_v1")) return;

  const extra = [
    { id: 9001, topicId: 1, userId: 101, userName: "王绣娘", userAvatar: DICEBEAR("wangxiuniang"), content: "蚕丝线光泽好，绣出来的花更立体，就是价格高一点。", createTime: "2026-05-10 15:20:00" },
    { id: 9002, topicId: 1, userId: 2, userName: "纸韵", userAvatar: DICEBEAR("zhiyun"), content: "我用的是棉线，练手不心疼，熟练了再换蚕丝线。", createTime: "2026-05-10 16:10:00" },
    { id: 9003, topicId: 1, userId: 102, userName: "李瓷匠", userAvatar: DICEBEAR("licijiang"), content: "预算够就直接上桑蚕丝，颜色正，不容易起毛。", createTime: "2026-05-10 18:05:00" },
    { id: 9004, topicId: 1, userId: 3, userName: "陶泥客", userAvatar: DICEBEAR("taonike"), content: "搭车问一句，绣绷用圆的还是方的？", createTime: "2026-05-10 19:30:00" },
    { id: 9005, topicId: 1, userId: 101, userName: "王绣娘", userAvatar: DICEBEAR("wangxiuniang"), content: "回楼上：小件用圆绷，大件用方绷，方绷不容易变形。", createTime: "2026-05-10 20:00:00" },
    { id: 9006, topicId: 1, userId: 2, userName: "纸韵", userAvatar: DICEBEAR("zhiyun"), content: "学到了，谢谢绣娘！", createTime: "2026-05-10 20:30:00" },
    { id: 9007, topicId: 1, userId: 3, userName: "陶泥客", userAvatar: DICEBEAR("taonike"), content: "收藏了，周末就去买线。", createTime: "2026-05-11 09:10:00" },
    { id: 9008, topicId: 1, userId: 102, userName: "李瓷匠", userAvatar: DICEBEAR("licijiang"), content: "新手记得先练平针，别急着绣花。", createTime: "2026-05-11 10:40:00" },
    { id: 9009, topicId: 1, userId: 2, userName: "纸韵", userAvatar: DICEBEAR("zhiyun"), content: "同新手，一起加油～", createTime: "2026-05-11 11:20:00" },
    { id: 9010, topicId: 2, userId: 102, userName: "李瓷匠", userAvatar: DICEBEAR("licijiang"), content: "欢迎来景德镇玩，下次可以试试青花。", createTime: "2026-05-11 10:20:00" },
    { id: 9011, topicId: 2, userId: 1, userName: "小绣迷", userAvatar: DICEBEAR("user-1"), content: "歪歪扭扭才可爱，独一无二的作品。", createTime: "2026-05-11 11:00:00" },
    { id: 9012, topicId: 2, userId: 101, userName: "王绣娘", userAvatar: DICEBEAR("wangxiuniang"), content: "手作的意义就在于此，加油！", createTime: "2026-05-11 13:15:00" },
    { id: 9013, topicId: 2, userId: 3, userName: "陶泥客", userAvatar: DICEBEAR("taonike"), content: "拉坯最考验耐心，深有同感。", createTime: "2026-05-11 14:40:00" },
    { id: 9014, topicId: 2, userId: 2, userName: "纸韵", userAvatar: DICEBEAR("zhiyun"), content: "看照片就知道很用心。", createTime: "2026-05-11 16:00:00" },
    { id: 9015, topicId: 3, userId: 2, userName: "纸韵", userAvatar: DICEBEAR("zhiyun"), content: "古琴的泛音现场听真的会起鸡皮疙瘩。", createTime: "2026-05-09 09:00:00" },
    { id: 9016, topicId: 3, userId: 1, userName: "小绣迷", userAvatar: DICEBEAR("user-1"), content: "求推荐入门琴曲！", createTime: "2026-05-09 10:30:00" },
    { id: 9017, topicId: 3, userId: 101, userName: "王绣娘", userAvatar: DICEBEAR("wangxiuniang"), content: "可以从《仙翁操》开始练。", createTime: "2026-05-09 11:20:00" },
    { id: 9018, topicId: 3, userId: 102, userName: "李瓷匠", userAvatar: DICEBEAR("licijiang"), content: "上次在苏州听了现场，同样被震撼到。", createTime: "2026-05-09 14:00:00" },
    { id: 9019, topicId: 4, userId: 3, userName: "陶泥客", userAvatar: DICEBEAR("taonike"), content: "工具链接能发一下吗？谢谢！", createTime: "2026-05-08 09:30:00" },
    { id: 9020, topicId: 4, userId: 1, userName: "小绣迷", userAvatar: DICEBEAR("user-1"), content: "剪对称图案真的会上瘾。", createTime: "2026-05-08 10:50:00" },
    { id: 9021, topicId: 4, userId: 101, userName: "王绣娘", userAvatar: DICEBEAR("wangxiuniang"), content: "新手先用普通红纸练手就行。", createTime: "2026-05-08 13:10:00" },
  ];
  const comments = db.getTable("topicComments");
  const ids = comments.map((c) => String(c.id));
  extra.forEach((c) => {
    if (!ids.includes(String(c.id))) comments.push(c);
  });
  db.setTable("topicComments", comments);

  // 给内置话题补齐真实点赞记录（数量沿用原来的展示值）
  const base = { 1: 28, 2: 156, 3: 234, 4: 89 };
  const likesTable = db.getTable("topicLikes");
  Object.keys(base).forEach((tid) => {
    let n = likesTable.filter((l) => String(l.topicId) === String(tid)).length;
    for (let i = n; i < base[tid]; i++) {
      likesTable.push({
        id: "seed_like_" + tid + "_" + i,
        topicId: Number(tid),
        userId: 5000 + i,
        createTime: "2026-05-11 08:00:00",
      });
    }
  });
  db.setTable("topicLikes", likesTable);

  // 用真实记录数覆盖 topics 里的展示数字
  const topics = db.getTable("topics");
  topics.forEach((t) => {
    t.comments = db.count("topicComments", (c) => String(c.topicId) === String(t.id));
    t.likes = db.count("topicLikes", (l) => String(l.topicId) === String(t.id));
  });
  db.setTable("topics", topics);

  wx.setStorageSync("topic_interactions_v1", true);
}

// 清理测试账号「123」留下的评论，并重新同步话题评论数
function removeTestComments() {
  if (wx.getStorageSync("test_123_removed")) return;
  db.removeBy("topicComments", (c) => String(c.userName).trim() === "123");
  const topics = db.getTable("topics");
  topics.forEach((t) => {
    t.comments = db.count("topicComments", (c) => String(c.topicId) === String(t.id));
  });
  db.setTable("topics", topics);
  wx.setStorageSync("test_123_removed", true);
}

function initMockData() {
  refreshActivityTime();
  removeTestComments();
  // 论坛分类单独兜底（老用户 stash 里没有这张表）
  ensureTopicCategories();

  if (
    wx.getStorageSync("mock_inited") &&
    wx.getStorageSync("mock_version") === DATA_VERSION
  ) {
    ensureTopicInteractions();
    return;
  }

  seed("categories", [
    { id: 1, name: "传统技艺", icon: "🎨", count: 12 },
    { id: 2, name: "传统美术", icon: "🖼️", count: 8 },
    { id: 3, name: "传统音乐", icon: "🎵", count: 6 },
    { id: 4, name: "传统舞蹈", icon: "💃", count: 5 },
    { id: 5, name: "传统戏剧", icon: "🎭", count: 9 },
    { id: 6, name: "传统医药", icon: "💊", count: 7 },
    { id: 7, name: "民俗", icon: "🏮", count: 10 },
    { id: 8, name: "传统体育", icon: "🥋", count: 4 },
  ]);

  // 非遗 - 每条配真实主题图
  const heritages = [
    {
      id: 1,
      categoryId: 1,
      name: "苏绣",
      cover: "/images/heritage/苏绣.png",
      region: "江苏苏州",
      level: "世界级",
      intro: "中国四大名绣之首，针法精细色彩淡雅，两千余年历史。",
      content:
        "苏绣源于苏州，国家级非遗。图案秀丽、色彩和谐、针法活泼。主要针法有齐针、套针、打子针等几十种。代表作《猫》《百鸟朝凤》。",
      inheritorId: 1,
      views: 12340,
      likes: 856,
      status: 1,
      createTime: "2026-01-15 10:00:00",
    },
    {
      id: 2,
      categoryId: 1,
      name: "南京云锦织造",
      cover: "/images/heritage/南京云锦织造.png",
      region: "江苏南京",
      level: "世界级",
      intro: "云锦如天上云霞，一天仅织五厘米的千年技艺。",
      content:
        "云锦用大花楼木质提花机，上下两人配合，一天仅能织出5-6厘米。2009年入选人类非遗名录。",
      inheritorId: 1,
      views: 8900,
      likes: 620,
      status: 1,
      createTime: "2026-01-16 10:00:00",
    },
    {
      id: 3,
      categoryId: 5,
      name: "昆曲",
      cover: "/images/heritage/昆曲.png",
      region: "江苏苏州",
      level: "世界级",
      intro: "百戏之祖，中国最古老剧种，牡丹亭长生殿流传至今。",
      content:
        "昆曲发源于昆山，融合唱念做打，唱腔婉转悠扬。2001年入选人类非遗名录。代表剧目《牡丹亭》《长生殿》。",
      inheritorId: 3,
      views: 15600,
      likes: 1230,
      status: 1,
      createTime: "2026-01-17 10:00:00",
    },
    {
      id: 4,
      categoryId: 1,
      name: "景德镇手工制瓷",
      cover: "/images/heritage/景德镇陶瓷器.png",
      region: "江西景德镇",
      level: "国家级",
      intro: "白如玉明如镜薄如纸声如磬，青花粉彩玲珑四大名瓷。",
      content:
        "景德镇手工制瓷要经拉坯、利坯、画坯、施釉、烧窑七十二道工序。青花、粉彩、玲珑、颜色釉四大名瓷享誉世界。",
      inheritorId: 2,
      views: 9870,
      likes: 720,
      status: 1,
      createTime: "2026-01-18 10:00:00",
    },
    {
      id: 5,
      categoryId: 5,
      name: "京剧",
      cover: "/images/heritage/京剧.png",
      region: "北京",
      level: "世界级",
      intro: "国粹京剧，生旦净丑唱念做打，二〇一〇年入选人类非遗。",
      content:
        "京剧融合徽剧汉剧昆曲，角色分生旦净丑四大行当，唱腔以西皮二黄为主。2010年入选人类非遗名录。",
      inheritorId: 3,
      views: 23450,
      likes: 1890,
      status: 1,
      createTime: "2026-01-19 10:00:00",
    },
    {
      id: 6,
      categoryId: 1,
      name: "景泰蓝制作",
      cover: "/images/heritage/景泰蓝制作.png",
      region: "北京",
      level: "国家级",
      intro: "铜胎掐丝珐琅，明代景泰年间盛行，北京传统名手工艺品。",
      content:
        "景泰蓝经设计、制胎、掐丝、点蓝、烧蓝、磨光、镀金十余道工序。因明代景泰年间用蓝色釉料而得名。",
      inheritorId: 2,
      views: 5670,
      likes: 430,
      status: 1,
      createTime: "2026-01-20 10:00:00",
    },
    {
      id: 7,
      categoryId: 2,
      name: "杨柳青年画",
      cover: "/images/heritage/杨柳青年画.png",
      region: "天津",
      level: "国家级",
      intro: "木版套印手工彩绘，连年有余五子夺莲家喻户晓。",
      content:
        "杨柳青年画继承宋元绘画传统，采用木版套印和手工彩绘结合。代表作《连年有余》《五子夺莲》。",
      inheritorId: 2,
      views: 6540,
      likes: 432,
      status: 1,
      createTime: "2026-01-21 10:00:00",
    },
    {
      id: 8,
      categoryId: 5,
      name: "京韵大鼓",
      cover: "/images/heritage/京韵大鼓.png",
      region: "天津",
      level: "国家级",
      intro: "一人自击鼓板演唱，三弦四胡伴奏，京津地区重要说唱艺术。",
      content:
        "京韵大鼓由河北木板大鼓演变而来，一人自击鼓板演唱，伴奏有三弦、四胡等。代表曲目《长坂坡》《黛玉葬花》。",
      inheritorId: 3,
      views: 3450,
      likes: 280,
      status: 1,
      createTime: "2026-01-22 10:00:00",
    },
    {
      id: 9,
      categoryId: 1,
      name: "剪纸",
      cover: "/images/heritage/剪纸.png",
      region: "陕西延安",
      level: "世界级",
      intro: "最古老的民间艺术之一，粗犷豪放用于婚嫁节庆。",
      content:
        "剪纸艺术2009年入选人类非遗。陕西剪纸粗犷豪放，题材花鸟鱼虫、神话传说。",
      inheritorId: 1,
      views: 11200,
      likes: 890,
      status: 1,
      createTime: "2026-01-23 10:00:00",
    },
    {
      id: 10,
      categoryId: 5,
      name: "秦腔",
      cover: "/images/heritage/秦腔.png",
      region: "陕西西安",
      level: "国家级",
      intro: "中国最古老梆子腔，唱腔高亢激昂，西北人人会唱。",
      content:
        "秦腔又称乱弹，唱腔高亢激昂，脸谱黑红两色为主。代表剧目《三滴血》《周仁回府》。",
      inheritorId: 3,
      views: 7890,
      likes: 560,
      status: 1,
      createTime: "2026-01-24 10:00:00",
    },
    {
      id: 11,
      categoryId: 8,
      name: "红拳",
      cover: "/images/heritage/红拳.png",
      region: "陕西西安",
      level: "国家级",
      intro: "陕西地方拳种，源于宋代，三十六式炮捶大红拳。",
      content:
        "红拳讲究势法劲力，有三十六式、炮捶、大红拳套路。2008年入选国家级非遗名录。",
      inheritorId: 1,
      views: 3200,
      likes: 210,
      status: 1,
      createTime: "2026-01-25 10:00:00",
    },
    {
      id: 12,
      categoryId: 1,
      name: "龙泉青瓷烧制",
      cover: "/images/heritage/龙泉青瓷.png",
      region: "浙江龙泉",
      level: "世界级",
      intro: "三国两晋至今，粉青梅子青釉色闻名，人类非遗。",
      content:
        "龙泉青瓷是中国制瓷史上烧制时间最长的青瓷名窑。粉青、梅子青釉色闻名于世。2009年入选人类非遗。",
      inheritorId: 2,
      views: 6780,
      likes: 490,
      status: 1,
      createTime: "2026-01-26 10:00:00",
    },
    {
      id: 13,
      categoryId: 1,
      name: "金石篆刻",
      cover: "/images/heritage/金石篆刻.png",
      region: "浙江杭州",
      level: "世界级",
      intro: "以刀代笔刻金石，章法刀法篆法三绝。",
      content:
        "篆刻艺术讲究章法、刀法、篆法三者结合。西泠印社是篆刻研究著名学术团体。2009年入选人类非遗。",
      inheritorId: 2,
      views: 4560,
      likes: 320,
      status: 1,
      createTime: "2026-01-27 10:00:00",
    },
    {
      id: 14,
      categoryId: 1,
      name: "粤绣",
      cover: "/images/heritage/粤绣.png",
      region: "广东广州",
      level: "国家级",
      intro: "中国四大名绣之一，色彩富丽布局饱满，百鸟朝凤代表作。",
      content: "粤绣又称广绣，布局饱满图案繁茂色彩富丽。代表作《百鸟朝凤》。",
      inheritorId: 1,
      views: 5890,
      likes: 410,
      status: 1,
      createTime: "2026-01-28 10:00:00",
    },
    {
      id: 15,
      categoryId: 5,
      name: "粤剧",
      cover: "/images/heritage/粤剧.png",
      region: "广东广州",
      level: "世界级",
      intro: "广东大戏，海外华人聚居区流传，二〇〇九年入选人类非遗。",
      content: "粤剧融合唱做念打，唱腔以梆黄为主。2009年入选人类非遗名录。",
      inheritorId: 3,
      views: 10230,
      likes: 780,
      status: 1,
      createTime: "2026-01-29 10:00:00",
    },
    {
      id: 16,
      categoryId: 5,
      name: "川剧变脸",
      cover: "/images/heritage/川剧变脸.png",
      region: "四川成都",
      level: "国家级",
      intro: "抹脸吹脸扯脸运气变脸，瞬间十余张脸谱，中国一绝。",
      content:
        "川剧变脸有抹脸、吹脸、扯脸、运气变脸等多种手法，一张脸皮薄如蝉翼可连续变换十余张。",
      inheritorId: 3,
      views: 18900,
      likes: 1560,
      status: 1,
      createTime: "2026-01-30 10:00:00",
    },
    {
      id: 17,
      categoryId: 6,
      name: "中医针灸",
      cover: "/images/heritage/中医针灸.png",
      region: "全国",
      level: "世界级",
      intro: "刺激特定穴位调节气血，二〇一〇年入选人类非遗。",
      content: "针灸含针法和灸法，基于传统医学理论。2010年入选人类非遗名录。",
      inheritorId: 1,
      views: 15600,
      likes: 1230,
      status: 1,
      createTime: "2026-02-01 10:00:00",
    },
    {
      id: 18,
      categoryId: 1,
      name: "傣族泼水节",
      cover: "/images/heritage/傣族泼水节.png",
      region: "云南西双版纳",
      level: "国家级",
      intro: "傣族新年三至七天，互相泼水祝福放孔明灯。",
      content:
        "泼水节期间穿节日盛装，互相泼水表示祝福。还有赛龙舟、放孔明灯、跳象脚鼓舞。",
      inheritorId: 2,
      views: 8700,
      likes: 650,
      status: 1,
      createTime: "2026-02-02 10:00:00",
    },
    {
      id: 19,
      categoryId: 7,
      name: "春节",
      cover: "/images/heritage/春节.png",
      region: "全国",
      level: "世界级",
      intro: "贴春联放鞭炮吃年夜饭守岁，中华民族最隆重佳节。",
      content:
        "春节从腊月二十三祭灶到正月十五，除夕和正月初一为高潮。贴春联、吃年夜饭、守岁、拜年。2026年入选人类非遗。",
      inheritorId: 2,
      views: 18900,
      likes: 1560,
      status: 1,
      createTime: "2026-02-03 10:00:00",
    },
    {
      id: 20,
      categoryId: 3,
      name: "侗族大歌",
      cover: "/images/heritage/侗族大歌.png",
      region: "贵州黎平",
      level: "世界级",
      intro: "无指挥无伴奏多声部合唱，模拟鸟鸣高山流水。",
      content:
        "侗族大歌以模拟自然之音为特色，多声部无指挥无伴奏。2009年入选人类非遗。",
      inheritorId: 1,
      views: 5400,
      likes: 380,
      status: 1,
      createTime: "2026-02-04 10:00:00",
    },
    {
      id: 21,
      categoryId: 5,
      name: "藏戏",
      cover: "/images/heritage/藏戏.png",
      region: "西藏拉萨",
      level: "世界级",
      intro: "戴着面具表演，唱腔雄浑苍凉，唐东杰布十四世纪创立。",
      content:
        "藏戏藏语称阿吉拉姆，由唐东杰布创立。戴面具表演，剧目多改编自藏族历史和佛教故事。2009年入选人类非遗。",
      inheritorId: 3,
      views: 4300,
      likes: 290,
      status: 1,
      createTime: "2026-02-05 10:00:00",
    },
    {
      id: 22,
      categoryId: 3,
      name: "维吾尔十二木卡姆",
      cover: "/images/heritage/维吾尔十二木卡姆.png",
      region: "新疆喀什",
      level: "世界级",
      intro: "维吾尔古典音乐之母，十二套大曲穹乃格曼达斯坦麦西热甫。",
      content:
        "十二木卡姆包括拉克、且比亚特等十二套大曲，每套三部分。2005年入选人类非遗。",
      inheritorId: 1,
      views: 4560,
      likes: 320,
      status: 1,
      createTime: "2026-02-06 10:00:00",
    },
    {
      id: 23,
      categoryId: 3,
      name: "古琴艺术",
      cover: "/images/heritage/古琴艺术.png",
      region: "全国",
      level: "世界级",
      intro: "三千多年历史，音域宽广余音悠远，广陵散高山流水梅花三弄。",
      content:
        "古琴又名瑶琴玉琴，代表曲目《广陵散》《高山流水》《梅花三弄》。2008年入选人类非遗。",
      inheritorId: 3,
      views: 8760,
      likes: 654,
      status: 1,
      createTime: "2026-02-07 10:00:00",
    },
    {
      id: 24,
      categoryId: 5,
      name: "二人转",
      cover: "/images/heritage/二人转.png",
      region: "吉林",
      level: "国家级",
      intro: "东北三省一男一女表演，持手绢彩扇唱词通俗易懂。",
      content: "二人转一男一女，手持手绢彩扇。2006年入选第一批国家级非遗名录。",
      inheritorId: 3,
      views: 5600,
      likes: 390,
      status: 1,
      createTime: "2026-02-08 10:00:00",
    },
    {
      id: 25,
      categoryId: 2,
      name: "朱仙镇木版年画",
      cover: "/images/heritage/朱仙镇木版年画.png",
      region: "河南开封",
      level: "国家级",
      intro: "中国年画鼻祖始于北宋，线条粗犷造型饱满色彩浓烈。",
      content: "朱仙镇木版年画是中国年画历史最悠久的。代表作《门神》《灶王》。",
      inheritorId: 2,
      views: 3800,
      likes: 260,
      status: 1,
      createTime: "2026-02-09 10:00:00",
    },
  ];
  seed("heritages", heritages.concat(buildExtraHeritages()));

  // 传承人
  seed("inheritors", [
    {
      id: 1,
      userId: 101,
      name: "王绣娘",
      avatar: DICEBEAR("wangxiuniang"),
      title: "国家级非遗传承人",
      category: "传统技艺",
      region: "江苏苏州",
      intro: "从事苏绣四十余年，代表作获国家级奖项。",
      phone: "13800000001",
      status: 1,
      createTime: "2026-01-10 09:00:00",
    },
    {
      id: 2,
      userId: 102,
      name: "李瓷匠",
      avatar: DICEBEAR("licijiang"),
      title: "省级非遗传承人",
      category: "传统技艺",
      region: "江西景德镇",
      intro: "景德镇制瓷世家，精通青花粉彩。",
      phone: "13800000002",
      status: 1,
      createTime: "2026-01-10 09:00:00",
    },
    {
      id: 3,
      userId: 103,
      name: "张戏痴",
      avatar: DICEBEAR("zhangxichi"),
      title: "国家级非遗传承人",
      category: "传统戏剧",
      region: "北京",
      intro: "京剧表演艺术家，工旦角，从艺三十载。",
      phone: "13800000003",
      status: 1,
      createTime: "2026-01-10 09:00:00",
    },
  ]);

  seed("videoTypes", [
    { id: 1, name: "技艺展示" },
    { id: 2, name: "传承人访谈" },
    { id: 3, name: "教学课程" },
    { id: 4, name: "活动纪实" },
  ]);

  // 视频
  seed("videos", [
    {
      id: 1,
      typeId: 1,
      heritageId: 1,
      title: "苏绣：一针一线绣江南",
      cover: U("silk-embroidery-process"),
      duration: "08:32",
      views: 5680,
      intro: "走进苏州绣娘工作室",
      inheritorId: 1,
      status: 1,
      createTime: "2026-02-01 10:00:00",
    },
    {
      id: 2,
      typeId: 3,
      heritageId: 1,
      title: "苏绣入门基础针法",
      cover: U("embroidery-beginner,needlecraft"),
      duration: "15:20",
      views: 3420,
      intro: "浅入深出讲解基础针法",
      inheritorId: 1,
      status: 1,
      createTime: "2026-02-02 10:00:00",
    },
    {
      id: 3,
      typeId: 2,
      heritageId: 5,
      title: "京剧大师访谈",
      cover: U("opera-interview,stage"),
      duration: "22:10",
      views: 8900,
      intro: "对话京剧名家畅谈传承",
      inheritorId: 3,
      status: 1,
      createTime: "2026-02-03 10:00:00",
    },
    {
      id: 4,
      typeId: 1,
      heritageId: 17,
      title: "针灸古老医术",
      cover: U("acupuncture-therapy"),
      duration: "12:45",
      views: 4560,
      intro: "见证中医针灸神奇疗效",
      inheritorId: 1,
      status: 1,
      createTime: "2026-02-04 10:00:00",
    },
    {
      id: 5,
      typeId: 4,
      heritageId: 19,
      title: "春节年味中国",
      cover: U("chinese-newyear-celebration"),
      duration: "18:30",
      views: 12300,
      intro: "记录全国各地春节民俗",
      inheritorId: 2,
      status: 1,
      createTime: "2026-02-05 10:00:00",
    },
    {
      id: 6,
      typeId: 3,
      heritageId: 9,
      title: "剪纸入门教程",
      cover: U("paper-cutting-tutorial"),
      duration: "10:15",
      views: 6700,
      intro: "跟着传承人学剪纸",
      inheritorId: 1,
      status: 1,
      createTime: "2026-02-06 10:00:00",
    },
  ]);

  // 活动
  seed("activities", [
    {
      id: 1,
      title: "苏绣体验工坊",
      region: "江苏苏州",
      address: "苏州市姑苏区非遗中心",
      startTime: "2026-11-08 09:00:00",
      endTime: "2026-11-08 12:00:00",
      cover: "/images/activity/屏幕截图 2026-10-24 193949.png",
      maxPeople: 20,
      joined: 15,
      intro: "跟着王绣娘亲手绣一朵牡丹",
      inheritorId: 1,
      status: 1,
      createTime: "2026-05-01 10:00:00",
    },
    {
      id: 2,
      title: "景德镇拉坯体验",
      region: "江西景德镇",
      address: "景德镇陶瓷文化园",
      startTime: "2026-11-14 14:00:00",
      endTime: "2026-11-14 17:00:00",
      cover: "/images/activity/屏幕截图 2026-10-24 194211.png",
      maxPeople: 15,
      joined: 8,
      intro: "亲手拉坯制陶",
      inheritorId: 2,
      status: 1,
      createTime: "2026-05-02 10:00:00",
    },
    {
      id: 3,
      title: "京剧脸谱彩绘",
      region: "北京",
      address: "北京梅兰芳大剧院",
      startTime: "2026-11-21 10:00:00",
      endTime: "2026-11-21 12:00:00",
      cover: "/images/activity/屏幕截图 2026-10-24 194320.png",
      maxPeople: 25,
      joined: 20,
      intro: "了解脸谱亲手绘制",
      inheritorId: 3,
      status: 1,
      createTime: "2026-05-03 10:00:00",
    },
    {
      id: 4,
      title: "剪纸迎春课",
      region: "陕西西安",
      address: "西安市群众艺术馆",
      startTime: "2026-11-28 14:00:00",
      endTime: "2026-11-28 16:00:00",
      cover: "/images/activity/屏幕截图 2026-10-24 194442.png",
      maxPeople: 30,
      joined: 28,
      intro: "学剪纸剪福字",
      inheritorId: 1,
      status: 1,
      createTime: "2026-05-04 10:00:00",
    },
  ]);

  seed("courseCategories", [
    { id: 1, name: "技艺入门" },
    { id: 2, name: "进阶研修" },
    { id: 3, name: "大师课" },
    { id: 4, name: "理论文化" },
  ]);

  // 课程
  seed("courses", [
    {
      id: 1,
      categoryId: 1,
      title: "苏绣零基础20讲",
      cover: "/images/course/屏幕截图 2026-10-24 201139.png",
      price: 99,
      originalPrice: 199,
      intro: "零基础也能学会苏绣",
      content: "20课时，王绣娘主讲，涵盖历史、针法、图案。",
      teacher: "王绣娘",
      lessons: 20,
      students: 1280,
      rating: 4.9,
      inheritorId: 1,
      status: 1,
      createTime: "2026-03-01 10:00:00",
    },
    {
      id: 2,
      categoryId: 2,
      title: "青花瓷绘制进阶",
      cover: "/images/course/屏幕截图 2026-10-24 201245.png",
      price: 299,
      originalPrice: 399,
      intro: "系统学青花绘制",
      content: "12课时讲青花料调制、构图、上色。",
      teacher: "李瓷匠",
      lessons: 12,
      students: 560,
      rating: 4.8,
      inheritorId: 2,
      status: 1,
      createTime: "2026-03-02 10:00:00",
    },
    {
      id: 3,
      categoryId: 3,
      title: "京剧旦角表演大师课",
      cover: "/images/course/屏幕截图 2026-10-24 201333.png",
      price: 599,
      originalPrice: 899,
      intro: "京剧大师亲授旦角精髓",
      content: "8课时张戏痴主讲。",
      teacher: "张戏痴",
      lessons: 8,
      students: 320,
      rating: 5.0,
      inheritorId: 3,
      status: 1,
      createTime: "2026-03-03 10:00:00",
    },
    {
      id: 4,
      categoryId: 4,
      title: "中国非遗通识",
      cover: "/images/course/屏幕截图 2026-10-24 201503.png",
      price: 0,
      originalPrice: 0,
      intro: "免费公开课，十大非遗门类",
      content: "10课时梳理非遗门类。",
      teacher: "文化馆",
      lessons: 10,
      students: 3500,
      rating: 4.7,
      inheritorId: 1,
      status: 1,
      createTime: "2026-03-04 10:00:00",
    },
  ]);

  seed("courseChapters", [
    {
      id: 1,
      courseId: 1,
      title: "第1讲：苏绣的历史与文化",
      duration: "25:30",
      free: true,
      order: 1,
    },
    {
      id: 2,
      courseId: 1,
      title: "第2讲：工具与材料",
      duration: "20:15",
      free: true,
      order: 2,
    },
    {
      id: 3,
      courseId: 1,
      title: "第3讲：基础针法——齐针",
      duration: "28:40",
      free: false,
      order: 3,
    },
    {
      id: 4,
      courseId: 1,
      title: "第4讲：基础针法——套针",
      duration: "30:20",
      free: false,
      order: 4,
    },
    {
      id: 5,
      courseId: 1,
      title: "第5讲：简单图案绣制",
      duration: "35:00",
      free: false,
      order: 5,
    },
    {
      id: 6,
      courseId: 2,
      title: "第1讲：青花料调制",
      duration: "22:10",
      free: true,
      order: 1,
    },
    {
      id: 7,
      courseId: 2,
      title: "第2讲：构图与立意",
      duration: "26:30",
      free: false,
      order: 2,
    },
    {
      id: 8,
      courseId: 3,
      title: "第1讲：旦角四功五法",
      duration: "28:00",
      free: true,
      order: 1,
    },
  ]);

  // 店铺
  seed("shops", [
    {
      id: 1,
      inheritorId: 1,
      name: "姑苏绣坊",
      avatar: DICEBEAR("shop-1"),
      region: "江苏苏州",
      intro: "专注苏绣文创三十年",
      rating: 4.9,
      sales: 1280,
    },
    {
      id: 2,
      inheritorId: 2,
      name: "景德镇瓷韵",
      avatar: DICEBEAR("shop-2"),
      region: "江西景德镇",
      intro: "千年瓷都匠心传承",
      rating: 4.8,
      sales: 2100,
    },
    {
      id: 3,
      inheritorId: 3,
      name: "梨园雅韵",
      avatar: DICEBEAR("shop-3"),
      region: "北京",
      intro: "京剧文创周边",
      rating: 4.7,
      sales: 680,
    },
  ]);

  // 商品
  seed("products", [
    {
      id: 1,
      shopId: 1,
      name: "苏绣手工丝巾-牡丹款",
      price: 288,
      originalPrice: 388,
      stock: 50,
      sales: 120,
      cover: "/images/product/牡丹.png",
      intro: "手工苏绣真丝丝巾牡丹图案",
      category: "苏绣",
      status: 1,
      createTime: "2026-04-01 10:00:00",
    },
    {
      id: 2,
      shopId: 1,
      name: "苏绣团扇-荷花",
      price: 168,
      originalPrice: 218,
      stock: 30,
      sales: 85,
      cover: "/images/product/荷花.png",
      intro: "传统团扇苏绣荷花古风",
      category: "苏绣",
      status: 1,
      createTime: "2026-04-02 10:00:00",
    },
    {
      id: 3,
      shopId: 2,
      name: "青花瓷茶具套装",
      price: 588,
      originalPrice: 788,
      stock: 20,
      sales: 45,
      cover: "/images/product/青花瓷茶具.png",
      intro: "景德镇手绘青花瓷一壶四杯",
      category: "陶瓷",
      status: 1,
      createTime: "2026-04-03 10:00:00",
    },
    {
      id: 4,
      shopId: 2,
      name: "手工拉坯茶杯对杯",
      price: 128,
      originalPrice: 168,
      stock: 100,
      sales: 320,
      cover: "/images/product/手工拉胚茶杯.png",
      intro: "匠人手工拉坯独一无二",
      category: "陶瓷",
      status: 1,
      createTime: "2026-04-04 10:00:00",
    },
    {
      id: 5,
      shopId: 3,
      name: "京剧脸谱冰箱贴",
      price: 68,
      originalPrice: 98,
      stock: 200,
      sales: 890,
      cover: "/images/product/京剧脸谱冰箱贴.png",
      intro: "经典京剧脸谱文创周边",
      category: "京剧",
      status: 1,
      createTime: "2026-04-05 10:00:00",
    },
    {
      id: 6,
      shopId: 3,
      name: "昆曲书签礼盒",
      price: 98,
      originalPrice: 138,
      stock: 80,
      sales: 210,
      cover: "/images/product/昆曲书签.png",
      intro: "昆曲牡丹亭元素书签",
      category: "昆曲",
      status: 1,
      createTime: "2026-04-06 10:00:00",
    },
  ]);

  // 话题
  seed("topics", [
    {
      id: 1,
      categoryId: 1,
      title: "新手苏绣选什么线？",
      content: "刚入坑苏绣，蚕丝线还是棉线好？姐妹们用什么呀？",
      userId: 1,
      userName: "小绣迷",
      userAvatar: DICEBEAR("user-1"),
      createTime: "2026-05-10 14:30:00",
      comments: 12,
      views: 156,
      likes: 28,
      isRecommend: 1,
      status: 1,
    },
    {
      id: 2,
      categoryId: 2,
      title: "景德镇拉坯体验太感动了",
      content: "亲手做了个小碗，虽然歪歪扭扭但是自己的作品好开心！",
      userId: 102,
      userName: "李瓷匠",
      userAvatar: DICEBEAR("licijiang"),
      createTime: "2026-05-09 09:20:00",
      comments: 34,
      views: 678,
      likes: 156,
      isRecommend: 1,
      status: 1,
    },
    {
      id: 3,
      categoryId: 3,
      title: "古琴现场演奏起鸡皮疙瘩",
      content: "现场听真的和耳机里完全不一样！余音绕梁！",
      userId: 2,
      userName: "纸韵",
      userAvatar: DICEBEAR("zhiyun"),
      createTime: "2026-05-08 20:15:00",
      comments: 45,
      views: 1024,
      likes: 234,
      isRecommend: 0,
      status: 1,
    },
    {
      id: 4,
      categoryId: 1,
      title: "剪纸入门心得分享",
      content: "学剪纸一个月，工具选择和小技巧，希望对新手有帮助。",
      userId: 3,
      userName: "陶泥客",
      userAvatar: DICEBEAR("taonike"),
      createTime: "2026-05-07 16:40:00",
      comments: 18,
      views: 432,
      likes: 89,
      isRecommend: 1,
      status: 1,
    },
  ]);

  // 话题评论
  seed("topicComments", [
    {
      id: 1,
      topicId: 1,
      userId: 101,
      userName: "王绣娘",
      userAvatar: DICEBEAR("wangxiuniang"),
      content: "新手建议用桑蚕丝线，粗细适中颜色也正。",
      createTime: "2026-05-10 15:00:00",
    },
    {
      id: 2,
      topicId: 1,
      userId: 2,
      userName: "纸韵",
      userAvatar: DICEBEAR("zhiyun"),
      content: "同问，收藏了！",
      createTime: "2026-05-10 16:00:00",
    },
    {
      id: 3,
      topicId: 2,
      userId: 3,
      userName: "陶泥客",
      userAvatar: DICEBEAR("taonike"),
      content: "太感动了，希望能传承下去。",
      createTime: "2026-05-11 10:00:00",
    },
  ]);

  // 公告
  seed("announcements", [
    {
      id: 1,
      title: "欢迎来到非遗传承小程序",
      content: "致力于非遗文化传播与传承，欢迎广大非遗爱好者加入。",
      type: "system",
      createTime: "2026-05-01 09:00:00",
    },
    {
      id: 2,
      title: "苏绣体验工坊报名开启",
      content: "6月15日苏绣体验工坊开放报名，名额有限先到先得。",
      type: "activity",
      createTime: "2026-05-15 10:00:00",
    },
    {
      id: 3,
      title: "传承人申请通道上线",
      content: "符合条件的传承人可在「我的」页面提交申请。",
      type: "system",
      createTime: "2026-05-20 10:00:00",
    },
  ]);

  // 咨询
  seed("consultations", [
    {
      id: 1,
      userId: 1,
      toUserId: 101,
      content: "苏绣体验工坊什么时候有名额？",
      fromAdmin: false,
      read: true,
      createTime: "2026-05-12 10:00:00",
    },
    {
      id: 2,
      userId: 1,
      toUserId: 101,
      content: "苏绣工坊每月举办一次，关注活动页面~",
      fromAdmin: true,
      read: false,
      createTime: "2026-05-12 10:05:00",
    },
  ]);

  // 用户
  seed("users", [
    {
      id: 1,
      username: "user",
      password: "123456",
      nickname: "小绣迷",
      avatar: DICEBEAR("user-1"),
      phone: "13900000001",
      role: "user",
      status: 1,
      createTime: "2026-01-01 10:00:00",
    },
    {
      id: 2,
      username: "zhiyun",
      password: "123456",
      nickname: "纸韵",
      avatar: DICEBEAR("zhiyun"),
      phone: "13900000002",
      role: "user",
      status: 1,
      createTime: "2026-01-02 10:00:00",
    },
    {
      id: 3,
      username: "taonike",
      password: "123456",
      nickname: "陶泥客",
      avatar: DICEBEAR("taonike"),
      phone: "13900000003",
      role: "user",
      status: 1,
      createTime: "2026-01-03 10:00:00",
    },
    {
      id: 101,
      username: "wx101",
      password: "123456",
      nickname: "王绣娘",
      avatar: DICEBEAR("wangxiuniang"),
      phone: "13800000001",
      role: "inheritor",
      status: 1,
      createTime: "2026-01-10 09:00:00",
    },
    {
      id: 102,
      username: "wx102",
      password: "123456",
      nickname: "李瓷匠",
      avatar: DICEBEAR("licijiang"),
      phone: "13800000002",
      role: "inheritor",
      status: 1,
      createTime: "2026-01-10 09:00:00",
    },
    {
      id: 103,
      username: "wx103",
      password: "123456",
      nickname: "张戏痴",
      avatar: DICEBEAR("zhangxichi"),
      phone: "13800000003",
      role: "inheritor",
      status: 1,
      createTime: "2026-01-10 09:00:00",
    },
    {
      id: 999,
      username: "admin",
      password: "123456",
      nickname: "管理员",
      avatar: DICEBEAR("admin"),
      phone: "13800000000",
      role: "admin",
      status: 1,
      createTime: "2026-01-01 00:00:00",
    },
  ]);

  seed("inheritorApplications", [
    {
      id: 1,
      userId: 2,
      realName: "纸小妹",
      idCard: "110101199001011234",
      category: "剪纸",
      intro: "剪纸爱好者，师从民间艺人多年。",
      materials: "",
      status: 0,
      createTime: "2026-05-15 10:00:00",
    },
  ]);

  seed("addresses", [
    {
      id: 1,
      userId: 1,
      name: "小绣迷",
      phone: "13900000001",
      province: "江苏省",
      city: "苏州市",
      district: "姑苏区",
      detail: "人民路100号非遗公寓1栋302",
      isDefault: 1,
    },
    {
      id: 2,
      userId: 1,
      name: "小绣迷",
      phone: "13900000001",
      province: "上海市",
      city: "上海市",
      district: "黄浦区",
      detail: "南京东路100号",
      isDefault: 0,
    },
  ]);

  seed("favorites", []);
  seed("carts", []);
  seed("orders", []);
  seed("activityRegistrations", []);
  seed("courseOrders", []);
  seed("learnProgress", []);
  seed("checkIns", []);
  seed("courseReviews", []);
  seed("productReviews", []);
  seed("refunds", []);

  wx.setStorageSync("mock_inited", true);
  wx.setStorageSync("mock_version", DATA_VERSION);

  ensureTopicInteractions();
}

module.exports = { initMockData, U };
