const SKINS = [
  "",
  "羊了个羊",
  "卷羊",
  "节日羊",
  "披羊皮的狼",
  "汉堡羊",
  "水手羊",
  "乌龟羊",
  "书生",
  "武生",
  "狼人",
  "吸血鬼",
  "黑羊",
  "白羊",
  "西瓜羊",
  "建设羊",
  "学生羊",
  "米饭羊",
  "老师羊",
  "煎蛋羊",
  "公主羊",
  "刺猬羊",
  "鲨鱼羊",
  "驯鹿羊",
  "太空羊",
  "粉粉羊",
  "bug羊",
  "茶壶羊",
  "程序羊",
  "小猪羊",
  "吐司羊",
  "蜗牛羊",
  "蜜蜂羊",
  "甜点羊",
  "厨师羊",
  "雪人羊",
  "猴羊",
  "花花羊",
  "斯巴达羊",
  "戴耳环羊",
  "圣诞羊",
  "五仁羊",
  "豆沙羊",
  "学生羊",
  "老师羊",
  "嫦娥羊",
  "玉兔羊",
  "学童羊",
  "夫子羊",
  "奥比羊",
  "摩尔羊",
  "潮羊",
];

const getSkinName = (id) => {
  return SKINS[id] || id;
};

module.exports = { getSkinName };