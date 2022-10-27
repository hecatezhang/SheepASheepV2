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
          className="textarea bg-[#e5e9f0] text-[#4c566a] w-full h-40 border p-3 focus:outline-none focus:shadow-lg focus:shadow-[#b48ead] active:outline-none"
        />
        <div>
          <button
            className="btn btn-block bg-[#81a1c1] text-lg hover:text-[#d8dee9] hover:bg-[#4c566a]"
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
  const [hasError, setHasError] = useState(false);
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
      setHasError(true);

      console.error(msg);
    });

    socket.on("solverStarted", () => {
      setMessageList(() => []);
      setHasError(false);
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
            {hasError ? (
              <div
                className={`flex flex-col p-3 bg-[#eceff4] rounded-lg shadow-lg shadow-error w-full overflow-auto md:text-center`}
              >
                {messageList.map(({ type, msg }, index) => (
                  <MessageCard key={msg + index} msg={msg} type={type} />
                ))}
              </div>
            ) : (
              <div
                className={`flex flex-col p-3 bg-[#eceff4] rounded-lg shadow-lg shadow-success w-full overflow-auto md:text-center`}
              >
                {messageList.map(({ type, msg }, index) => (
                  <MessageCard key={msg + index} msg={msg} type={type} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Solver;
