export interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  location: string;
  readingTime: number;
  image: number;
}

export const articles: Article[] = [
  { id: 1, title: "在世界的边缘，等一场缓慢的日出", excerpt: "当城市还未醒来，海岸线先被染成金色。我们沿着风的方向出发，记录那些地图上并不起眼，却值得专程抵达的地方。", category: "封面故事", author: "林之遥", location: "冰岛 · 维克镇", readingTime: 8, image: 1 },
  { id: 2, title: "山野来信：走进云雾缭绕的森林", excerpt: "穿过湿润的苔藓与高大的冷杉，听溪水穿过山谷。一次没有匆忙行程的徒步，让我们重新理解时间的尺度。", category: "自然", author: "周野", location: "挪威 · 松恩", readingTime: 6, image: 3 },
  { id: 3, title: "一座城市的味道，藏在清晨的街巷里", excerpt: "面包房推开木门，咖啡香混着街角的花香。跟随当地人的脚步，寻找旅行指南之外的日常。", category: "城市漫步", author: "陈叙", location: "丹麦 · 哥本哈根", readingTime: 5, image: 2 },
  { id: 4, title: "公路尽头，是寂静而辽阔的蓝色", excerpt: "把车窗摇下来，让海风进入车厢。沿途的每一次停留，都成为旅途中意料之外的惊喜。", category: "公路旅行", author: "许川", location: "新西兰 · 南岛", readingTime: 7, image: 5 },
  { id: 5, title: "设计的温度：那些让生活更美好的细节", excerpt: "从一把椅子到一盏灯，好的设计不急着表达自己，而是在长久使用中与人建立安静的联系。", category: "设计", author: "唐可", location: "芬兰 · 赫尔辛基", readingTime: 4, image: 4 },
  { id: 6, title: "日落以后，另一种生活才刚刚开始", excerpt: "夜幕降临，小巷里的灯逐一亮起。食物、音乐与陌生人的交谈，组成一座城市柔软的轮廓。", category: "人文", author: "苏禾", location: "葡萄牙 · 里斯本", readingTime: 6, image: 6 },
  { id: 7, title: "住进湖边的小木屋，度过没有通知的两天", excerpt: "关掉提醒，把时钟留在房间里。读书、划船、生火，在简单的日常中找回久违的专注。", category: "生活方式", author: "程一", location: "加拿大 · 班夫", readingTime: 5, image: 3 },
  { id: 8, title: "胶片里的夏天，依然带着海风的温度", excerpt: "十二张照片，十二段关于夏天的记忆。快门按下的瞬间，也成为我们与这个地方最真实的连接。", category: "影像", author: "顾南", location: "意大利 · 阿马尔菲", readingTime: 4, image: 2 },
  { id: 9, title: "向山而行：一条适合初次徒步者的路线", excerpt: "不必征服高峰，也不必追赶速度。一份包含装备、补给与沿途风景的轻徒步指南。", category: "户外指南", author: "韩松", location: "瑞士 · 格林德瓦", readingTime: 9, image: 5 },
  { id: 10, title: "独立书店漫游：在纸张之间遇见陌生人", excerpt: "书店不仅保存书籍，也保存一座城市的性格。我们拜访了三间藏在街角的小店，听店主讲述他们的坚持。", category: "阅读", author: "叶青", location: "英国 · 伦敦", readingTime: 7, image: 4 },
  { id: 11, title: "冬日餐桌：认真准备一顿热气腾腾的晚餐", excerpt: "当季蔬菜、新鲜香草和一只温热的餐盘。越是寒冷的季节，越值得花时间与喜欢的人围坐在一起。", category: "食物", author: "乔安", location: "法国 · 安纳西", readingTime: 5, image: 6 },
  { id: 12, title: "把日子过成风景：六位创作者的空间手记", excerpt: "家不是风格的陈列，而是生活自然留下的痕迹。走进他们的房间，看见旅行、阅读与创作如何融入日常。", category: "空间", author: "沈言", location: "日本 · 京都", readingTime: 8, image: 1 },
  { id: 13, title: "清晨六点，鱼市刚刚开始一天的热闹", excerpt: "木质箱子里装着刚靠岸的收获，摊主们用熟悉的方言招呼彼此。一座海滨城市最真实的气息，就藏在这份忙碌里。", category: "城市漫步", author: "陆离", location: "日本 · 小樽", readingTime: 5, image: 3 },
  { id: 14, title: "沿着河谷慢慢走，直到忘记手机的时间", excerpt: "一条平缓的步道连接树林、草场与村庄。没有需要打卡的景点，只有不断变化的云和恰到好处的微风。", category: "自然", author: "周野", location: "英国 · 湖区", readingTime: 6, image: 7 },
  { id: 15, title: "一杯咖啡的时间，认识一座陌生城市", excerpt: "坐在街角观察来往的人，听杯碟轻轻碰撞。咖啡馆像是城市的客厅，也让旅行者短暂成为日常的一部分。", category: "咖啡地图", author: "陈叙", location: "澳大利亚 · 墨尔本", readingTime: 4, image: 8 },
  { id: 16, title: "在北境的夜里，等待极光掠过屋顶", excerpt: "寒冷让等待变得漫长，也让天空亮起的那一刻格外难忘。一次关于耐心、运气与自然力量的记录。", category: "自然", author: "许川", location: "芬兰 · 罗瓦涅米", readingTime: 7, image: 5 },
  { id: 17, title: "老街新生：传统手艺如何回到年轻人身边", excerpt: "竹编、染布与木作并没有停留在博物馆里。新一代手艺人用自己的方式，让古老技艺重新进入今天的生活。", category: "人文", author: "苏禾", location: "中国 · 大理", readingTime: 8, image: 10 },
  { id: 18, title: "一个人的美术馆下午，安静地与自己相处", excerpt: "不必急着看懂每件作品。选择一幅画坐下来，让目光停留，让思绪自由发生。", category: "艺术", author: "唐可", location: "荷兰 · 阿姆斯特丹", readingTime: 5, image: 4 },
  { id: 19, title: "小岛巴士慢游记：下一站下车就是风景", excerpt: "买一张一日车票，沿着环岛公路随意停留。渔港、山坡和无人海滩，都在车窗外依次展开。", category: "公路旅行", author: "林之遥", location: "日本 · 濑户内海", readingTime: 6, image: 9 },
  { id: 20, title: "用一顿早餐，打开在地生活的入口", excerpt: "一碗热汤、一块刚出炉的饼，都是理解地方文化的线索。我们记录了六座城市不同的清晨餐桌。", category: "食物", author: "乔安", location: "中国 · 泉州", readingTime: 5, image: 6 },
  { id: 21, title: "山谷里的温泉旅馆，保留着旧时光的尺度", excerpt: "拉门、榻榻米与窗外四季变化的庭院。在这里，待客之道不是热闹的仪式，而是细致安静的照顾。", category: "旅居", author: "沈言", location: "日本 · 箱根", readingTime: 7, image: 11 },
  { id: 22, title: "海风、旧唱片与一间面向港口的书店", excerpt: "店主把旅行文学放在窗边，也把居民的故事收进书架。书页翻动时，港口正迎来傍晚的归船。", category: "阅读", author: "叶青", location: "中国 · 厦门", readingTime: 6, image: 12 },
  { id: 23, title: "从轻装出发：一日徒步的实用收纳清单", excerpt: "水、轻食、防雨外套和一双合适的鞋。减少不必要的负担，把注意力重新还给沿途的风景。", category: "户外指南", author: "韩松", location: "中国 · 四姑娘山", readingTime: 8, image: 7 },
  { id: 24, title: "城市上空的绿色：屋顶花园访问记", excerpt: "在高楼之间，人们种下香草、蔬菜和一小片树荫。这些微型花园，也在重新连接邻里与自然。", category: "空间", author: "程一", location: "新加坡", readingTime: 5, image: 12 },
  { id: 25, title: "雪落无声：冬夜小镇的十二个温暖瞬间", excerpt: "路灯照亮积雪，餐馆窗上蒙着薄雾。寒冷的季节里，人们用灯光、热饮和问候彼此靠近。", category: "影像", author: "顾南", location: "加拿大 · 魁北克", readingTime: 4, image: 1 },
  { id: 26, title: "跟随当地主厨，去市场挑选今天的晚餐", excerpt: "从当季食材开始决定菜单，让市场而不是食谱带领烹饪。一顿饭因此有了明确的时间与地点。", category: "食物", author: "乔安", location: "西班牙 · 圣塞瓦斯蒂安", readingTime: 7, image: 2 },
  { id: 27, title: "古老城墙之外，还有正在生长的日常", excerpt: "离开游客聚集的街道，走进菜市场、社区球场与小餐馆。历史与生活在这里从来不是彼此分离。", category: "城市漫步", author: "陆离", location: "中国 · 西安", readingTime: 6, image: 8 },
  { id: 28, title: "海边住所：让光线与风参与空间设计", excerpt: "白色墙面、天然木材和面向大海的窗户。真正舒适的度假空间，懂得把主角位置留给自然。", category: "设计", author: "唐可", location: "希腊 · 帕罗斯", readingTime: 5, image: 11 },
  { id: 29, title: "夜行列车：在轻轻摇晃中穿过陌生土地", excerpt: "车厢灯光渐暗，城市与村庄在窗外掠过。慢速移动让旅程本身重新成为旅行的一部分。", category: "铁路旅行", author: "许川", location: "挪威 · 奥斯陆", readingTime: 7, image: 9 },
  { id: 30, title: "草原上的星空课堂，重新认识头顶的宇宙", excerpt: "远离城市灯光后，银河清晰得令人惊叹。跟随天文向导辨认星座，也学习如何守护暗夜。", category: "自然", author: "周野", location: "中国 · 阿拉善", readingTime: 8, image: 5 },
  { id: 31, title: "周末农夫市集：从产地到餐桌的短距离", excerpt: "摊主也是种植者，季节直接写在摊位上。带回一袋新鲜蔬菜，也带回一段关于土地的交流。", category: "生活方式", author: "程一", location: "美国 · 波特兰", readingTime: 4, image: 7 },
  { id: 32, title: "老建筑里的新旅馆，如何保留时间的痕迹", excerpt: "砖墙上的磨损没有被完全遮盖，旧木梁也成为空间的一部分。更新不意味着抹去过去。", category: "设计", author: "沈言", location: "中国 · 上海", readingTime: 6, image: 10 },
  { id: 33, title: "雨季旅行指南：天气也可以成为风景", excerpt: "准备一双防滑鞋和轻便雨具，接受行程中的变化。雨后的树林、街道与咖啡馆，有另一种安静的魅力。", category: "旅行指南", author: "林之遥", location: "中国 · 杭州", readingTime: 5, image: 3 },
  { id: 34, title: "港口黄昏：那些与大海一起工作的人们", excerpt: "渔船归港，修理厂亮起灯。我们跟随一位船长度过傍晚，看见风景之外真实的海边生活。", category: "人文", author: "苏禾", location: "中国 · 舟山", readingTime: 7, image: 12 },
  { id: 35, title: "一只旅行包的十年：长期使用者的物品观", excerpt: "磨损、修补与不断调整的收纳方式，让物品逐渐带上主人的性格。好的陪伴不需要频繁更新。", category: "生活方式", author: "程一", location: "德国 · 柏林", readingTime: 5, image: 4 },
  { id: 36, title: "骑行穿过葡萄园，在村庄之间自由停留", excerpt: "平缓的乡道连接酒庄与小镇，骑行让距离变得具体，也让每一次转弯都可能带来新的发现。", category: "户外指南", author: "韩松", location: "法国 · 卢瓦尔河谷", readingTime: 6, image: 8 },
  { id: 37, title: "地方报纸、手写菜单与街角的生活方式", excerpt: "数字化时代里，这些看似低效率的细节仍然被保留。它们让社区有了可以触摸的记忆。", category: "人文", author: "叶青", location: "爱尔兰 · 戈尔韦", readingTime: 6, image: 6 },
  { id: 38, title: "带孩子去自然里，上一堂没有黑板的课", excerpt: "观察昆虫、辨认树叶，在溪边搭一座小石头桥。自然教育不一定需要复杂的课程与设备。", category: "亲子旅行", author: "周野", location: "中国 · 莫干山", readingTime: 5, image: 7 },
  { id: 39, title: "山居七日：远程工作者如何重建生活节律", excerpt: "上午处理工作，下午走进森林。稳定的网络与适当的距离，让效率和休息不再彼此冲突。", category: "旅居", author: "陆离", location: "中国 · 安吉", readingTime: 8, image: 11 },
  { id: 40, title: "一座桥的两种表情：黎明与深夜的城市摄影", excerpt: "同一个地点，在不同光线下呈现完全不同的性格。摄影师分享等待、构图与步行观察的方法。", category: "影像", author: "顾南", location: "中国 · 重庆", readingTime: 6, image: 9 },
  { id: 41, title: "沙漠中的绿洲营地，节约也可以很舒适", excerpt: "遮阳、自然通风与循环用水共同构成营地。有限的资源并没有削弱体验，反而让设计更专注。", category: "设计", author: "唐可", location: "摩洛哥 · 梅尔祖卡", readingTime: 7, image: 2 },
  { id: 42, title: "在香草园里，学习一瓶精油的漫长旅程", excerpt: "从种植、采摘到蒸馏，气味背后是漫长的季节劳动。一次闻得到的植物课程。", category: "自然", author: "乔安", location: "法国 · 普罗旺斯", readingTime: 5, image: 10 },
  { id: 43, title: "小岛图书馆计划：把阅读带到海另一端", excerpt: "一只图书箱乘船往返于岛屿之间。志愿者与居民共同维护，让故事抵达交通不便的地方。", category: "阅读", author: "叶青", location: "中国 · 嵊泗", readingTime: 6, image: 12 },
  { id: 44, title: "早春寻花：一条不追赶花期的散步路线", excerpt: "不必寻找最盛大的花海。街边的玉兰、河岸的柳芽，都在提醒季节正在发生变化。", category: "城市漫步", author: "林之遥", location: "中国 · 苏州", readingTime: 4, image: 1 },
  { id: 45, title: "露营之后，把营地完整地还给自然", excerpt: "带走垃圾、减少火痕、控制音量。真正亲近自然的方式，是尽量减少我们留下的痕迹。", category: "户外指南", author: "韩松", location: "中国 · 喀纳斯", readingTime: 7, image: 5 },
  { id: 46, title: "深夜食堂之外，那些认真做一碗面的人", excerpt: "熬汤、揉面与日复一日的准备，构成小店稳定的滋味。我们记录三位店主平凡而专注的一天。", category: "食物", author: "苏禾", location: "中国 · 兰州", readingTime: 8, image: 8 },
  { id: 47, title: "旅途中如何整理照片，让记忆不被文件夹淹没", excerpt: "从当天筛选到主题归档，一套简单可持续的方法，帮助每段旅行留下清晰而温暖的线索。", category: "影像", author: "顾南", location: "编辑部", readingTime: 5, image: 4 },
  { id: 48, title: "下一趟旅程，从认真观察身边开始", excerpt: "不必等到长假才出发。换一条回家的路，拜访附近的市场，也能重新发现熟悉之地的细节。", category: "编辑手记", author: "远方编辑部", location: "此时此刻", readingTime: 4, image: 3 },
];
