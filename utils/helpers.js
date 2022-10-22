const readline = require("readline");
const protobufjs = require("protobufjs");

function delay(sec) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, sec * 1000);
  });
}

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function prompt(userPrompt) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(userPrompt, (token) => {
      resolve(token);
    });
  });
}

function buildMatchPlayInfo(map, solution, gameType = 3) {
  let flattened = [];

  for (idx in map.levelData) {
    flattened = [...flattened, ...map.levelData[idx]];
  }

  const idIndexMap = {};
  flattened.forEach((value, index) => {
    idIndexMap[value.id] = { ...value, index };
  });

  const stepInfoList = solution.map((id) => {
    return { chessIndex: idIndexMap[id].index, timeTag: idIndexMap[id].type };
  });

  const matchPlayInfo = {
    gameType,
    stepInfoList,
  };

  return matchPlayInfo;
}

function matchPlayInfoToStr(map, solution, isTopic = false) {
  return new Promise((resolve) => {
    protobufjs.load("yang.proto", (_, root) => {
      const MatchPlayInfo = root.lookupType("yang.MatchPlayInfo");
      const matchPlayInfo = buildMatchPlayInfo(map, solution, isTopic ? 4 : 3);
      const buf = MatchPlayInfo.encode(matchPlayInfo).finish();
      const b64 = Buffer.from(buf).toString("base64");

      resolve(b64);
    });
  });
}

const getSolverMode = (issort, percent) => {
  if (issort !== "true" && issort !== "reverse" && percent === 0.85) {
    return "普通模式";
  } else if (issort == "reverse" && percent == 0.85) {
    return "高层优先模式";
  } else if (issort != "true" && issort != "reverse" && percent == 0) {
    return "优先移除两张相同类型的手牌模式";
  } else if (issort == "reverse" && percent == 0) {
    return "高层优先且优先移除两张相同类型的手牌模式";
  } else {
    return "自定义模式";
  }
};

module.exports = { delay, getRandom, prompt, matchPlayInfoToStr, getSolverMode };
