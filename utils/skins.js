const SKINS = [
  "",
  "羊了个羊",
  "卷羊",
  "节日羊",
  "披羊皮的狼",
  "汉堡羊",
  "水手羊",
  "乌龟羊",
  "书生羊",
  "武生羊",
  "猫猫羊",
  "狗狗羊",
  "黑羊",
  "白羊",
  "西瓜羊",
  "建设羊",
  "炸虾羊",
  "米饭羊",
  "恐龙羊",
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
  "咖啡羊",
  "茶羊",
  "嫦娥羊",
  "玉兔羊",
  "夏羊",
  "冬羊",
  "奥比羊",
  "摩尔羊",
  "潮羊",
  "咩咩羊",
  "女仆羊",
  "八戒",
  "卧龙",
  "星空羊",
  "武圣",
  "仓鼠羊",
  "青蛙羊",
  "渡渡羊",
  "小虎羊",
  "大象羊",
  "牛牛羊",
  "蚊子羊",
  "足球羊",
  "篮球羊",
  "沙滩羊",
  "雪山羊",
  "护肤羊",
  "美妆羊",
  "复古羊",
  "流行羊",
  "户外羊",
  "宅羊",
  "科技羊",
  "艺术羊",
];

const getSkinName = (id) => {
  return SKINS[id] || id;
};

module.exports = { getSkinName };
