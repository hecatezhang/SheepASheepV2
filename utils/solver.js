const spawn = require("child_process").spawn;
const { exit } = require("process");
const { performance } = require("perf_hooks");
const { getMap } = require("./mapUtils");
const {
  getMapInfo,
  getTopicMapInfo,
  getTopicInfo,
  topicJoinSide,
  sendTopicMatchInfo,
  sendMatchInfo,
} = require("../services/services");
const { getRandom, delay, prompt } = require("./helpers");
const { matchPlayInfoToStr } = require("./getMatchPlayInfo");
const { getSkinName } = require("./skins");

const getMode = (issort, percent) => {
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

const findSolution = (mapData, issort, percent = 0, t = 60) => {
  return new Promise((resolve) => {
    let solved = false;
    let solution = undefined;
    const mode = getMode(issort, percent);
    console.log("启动", mode);

    const pyExec = process.platform === "win32" ? "python" : "python3";
    const args = [__dirname + "/../sheep/autoSolve.py", "-t", t, "-p", percent];
    if (issort == "reverse") {
      args.push("-s", "reverse");
    }

    const py = spawn(pyExec, args);

    py.stdin.write(JSON.stringify(mapData));
    py.stdin.end();

    py.stdout.on("data", function (data) {
      const outputs = data
        .toString()
        .split(/\r?\n/)
        .filter((e) => e);

      for (line of outputs) {
        if (line.includes("result")) {
          solved = true;
          solution = JSON.parse(line.replace("result", ""));
        }
      }
    });

    py.stderr.on("data", function (data) {
      console.error(data.toString());
    });

    py.on("exit", async () => {
      if (!solved) {
        console.log(mode, "在", t, "秒内没有找到解");
      } else {
        console.log(mode, "在", t, "秒内成功找到解, 等待其他线程结束");
      }
      resolve(solution);
    });
  });
};

const filterSolutions = async (threads) => {
  const solutions = await Promise.all(threads);
  console.log("===================================");
  const validSolutions = solutions.filter((solution) => solution);
  if (validSolutions.length > 0) {
    console.log("找到", validSolutions.length, "个解. 使用第一个解");

    return validSolutions[0];
  }
  return undefined;
};

const startThreads = (mapData, timeout) => {
  const promises = [];
  promises.push(findSolution(mapData, "reverse", 0.85, timeout));
  promises.push(findSolution(mapData, "reverse", 0, timeout));
  // promises.push(findSolution(mapData, "", 0.85, timeout));
  // promises.push(findSolution(mapData, "", 0, timeout));

  return promises;
};

const initializeTopic = async (token) => {
  const topicInfoData = await getTopicInfo(token);
  if (topicInfoData.err_code !== 0) {
    console.error("无法获取话题数据, 请检查token是否有效");
    exit(1);
  }

  const side = topicInfoData.data.side;
  if (side === 0) {
    const randSide = getRandom(1, 3);
    console.log(
      "今日未选择队伍，随机选择",
      randSide === 1 ? "左侧" : "右侧",
      "队伍"
    );
    const { err_code: errorCode } = await topicJoinSide(token, randSide);
    if (errorCode !== 0) {
      console.error("无法加入队伍");
      exit(1);
    }
    const {
      data: { side },
    } = await getTopicInfo(token);
    if (side !== randSide) {
      console.error("无法加入队伍");
      exit(1);
    } else {
      console.log("已加入队伍:", side === 1 ? "左侧" : "右侧");
    }
  } else {
    console.log("已加入队伍:", side === 1 ? "左侧" : "右侧");
  }
};

const initialize = async (token, isTopic = false) => {
  if (isTopic) {
    await initializeTopic(token);
  }
  console.log("获取地图信息");
  let mapInfoData;
  if (isTopic) {
    mapInfoData = await getTopicMapInfo(token);
  } else {
    mapInfoData = await getMapInfo(token);
  }
  if (mapInfoData.err_code !== 0) {
    console.error("无法获取地图信息, 请检查token是否有效");
    exit(1);
  }

  const mapInfo = mapInfoData.data;
  console.log("获取地图数据");
  const mapData = await getMap(mapInfo.map_md5[1], mapInfo.map_seed);
  return [mapInfo, mapData];
};

const waitForSomeTime = async (runningTime) => {
  console.log("求解线程运行时间:", runningTime, "秒");
  if (runningTime < 80) {
    const waitTime = 80 - runningTime;
    console.log("等待", waitTime, "秒");
    console.log("===================================");
    await delay(waitTime);
  }
};

const main = async (isTopic) => {
  let retryCount = 0;
  let token;
  let serverMode = false;

  if (process.argv.slice(2)[0] === "-t") {
    token = process.argv.slice(2)[1];
    serverMode = true;
    if (!token) {
      console.error("未提供token");
      exit(1);
    }
  } else {
    token = await prompt("请输入token: ");
  }

  while (1) {
    if (serverMode) {
      console.log(">>>CLEAR<<<");
    } else {
      console.clear();
    }
    retryCount += 1;
    try {
      console.log(">>> 第", retryCount, "次尝试 <<<");
      console.log("===================================");
      await delay(3);
      console.log(">> 初始化地图信息 <<");
      const [mapInfo, mapData] = await initialize(token, isTopic);
      console.log("===================================");
      console.log(">> 求解 <<");
      const startTime = performance.now();
      const threads = startThreads(mapData, 60);
      console.log("===================================");

      const solution = await filterSolutions(threads);
      if (!solution) {
        console.log("无解, 开始下一轮尝试");
        await delay(3);
        continue;
      }
      const endTime = performance.now();

      const runningTime = Math.ceil((endTime - startTime) / 1000);
      await waitForSomeTime(runningTime);

      console.log(">> 发送MatchPlayInfo到服务器 <<");
      const matchPlayInfo = await matchPlayInfoToStr(mapData, solution);
      // console.log(matchPlayInfo);
      let result;
      if (isTopic) {
        result = await sendTopicMatchInfo(
          token,
          mapInfo.map_seed_2,
          matchPlayInfo
        );
      } else {
        result = await sendMatchInfo(token, mapInfo.map_seed_2, matchPlayInfo);
      }
      console.log("服务器返回数据:", result);
      const { err_code: errorCode, data } = result;
      if (errorCode !== 0) {
        console.error("服务器返回数据出错, 可能今日已通关或者解不正确");
        exit(1);
      }
      console.log(">> 完成 <<");
      console.log("获得皮肤", getSkinName(data.skin_id));
      if (serverMode) {
        console.log(">>>COMPLETED<<<");
      }
      exit(0);
    } catch (e) {
      console.error(e);
      console.log("出现异常");
      exit(1);
    }
  }
};

module.exports = { main };
