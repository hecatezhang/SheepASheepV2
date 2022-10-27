import { useContext, useEffect, useState } from "react";
import MessageCard from "./MessageCard";
import { SocketContext } from "../App";

const TokenInput = ({ onClick }) => {
  return (
    <div className="flex flex-col w-full space-y-4">
      <div className="flex flex-col w-full space-y-4">
        <textarea
          id="token_input"
          placeholder="请在此处输入 token"
          className="textarea bg-white w-full h-40 border p-3 focus:outline-none focus:shadow-lg focus:shadow-[#88c0d0] active:outline-none"
        />
        <div>
          <button
            className="btn btn-block bg-[#5e81ac] text-lg"
            onClick={onClick}
          >
            开 始
          </button>
        </div>
      </div>
    </div>
  );
};

const Solver = ({ solverType }) => {
  const [messageList, setMessageList] = useState([]);
  const [socket, connected] = useContext(SocketContext);

  useEffect(() => {
    socket.on("serverError", (err) => {
      console.log(err);
      // setMessageList([]);
    });

    socket.on("solverUpdate", (msg) => {
      if (msg === ">>>CLEAR<<<") {
        setMessageList(() => []);
        return;
      }
      if (msg === ">>>COMPLETED<<<") {
        return;
      }

      setMessageList((messageList) => [
        ...messageList,
        { type: "message", msg },
      ]);
      console.log(msg);
    });

    socket.on("solverError", (msg) => {
      setMessageList((messageList) => [...messageList, { type: "error", msg }]);

      console.error(msg);
    });

    socket.on("solverStarted", () => {
      setMessageList(() => []);
    });
  }, [socket]);

  useEffect(() => {
    if (!connected) {
      setMessageList(() => []);
    }
  }, [connected]);

  const onClick = () => {
    if (!socket.connected) return;
    const token = document.getElementById("token_input").value;
    socket.emit(solverType, token);
    // setMessageList([]);
  };

  return (
    <div className="flex flex-col self-center items-center w-full bg-neutral-content flex-grow rounded-lg">
      <div className="flex flex-col align-middle items-center w-full lg:w-11/12 space-y-4 p-3 pb-8">
        <div className="flex flex-col text-2xl py-5">
          {solverType === "challenge" ? "每日挑战" : "今日话题"}自动解题
        </div>
        {!connected && (
          <div className="text-2xl text-error">!!!未连接至服务器!!!</div>
        )}
        {connected && <TokenInput onClick={onClick} />}
        {connected && messageList.length !== 0 && (
          <>
            <div className="divider before:bg-[#4c566a] after:bg-[#4c566a] before:h-px after:h-px">
              程序输出
            </div>
            <div className="flex flex-col border p-3 rounded-md shadow-lg shadow-[#8fbcbb] w-full overflow-auto bg-base-100 md:text-center">
              {messageList.map(({ type, msg }, index) => (
                <MessageCard key={msg + index} msg={msg} type={type} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Solver;
