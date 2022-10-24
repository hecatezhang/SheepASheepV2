const spawn = require("child_process").spawn;

const spawnSolverProcess = (type, token) => {
  return new Promise((resolve) => {
    const solverProcess = spawn("node", [`${type}.js`, "-t", token]);
    solverProcess.stdout.on("data", (data) => {
      const outputs = data
        .toString()
        .split(/\r?\n/)
        .filter((e) => e);

      for (line of outputs) {
        console.log(line);
      }
    });

    solverProcess.stderr.on("data", (data) => {
      console.log(data.toString());
    });

    solverProcess.on("exit", () => {
      resolve();
    });
  });
};

const main = async () => {
  console.log("正在读取 tokens.json");
  const tokens = require("./tokens.json");

  for (id in tokens) {
    console.log("=========================");
    console.log("开始", id, "每日挑战");
    console.log("=========================");
    await spawnSolverProcess("challenge", tokens[id]);

    console.log("=========================");
    console.log("开始", id, "每日话题");
    console.log("=========================");
    await spawnSolverProcess("challenge", tokens[id]);
  }
};

main();
