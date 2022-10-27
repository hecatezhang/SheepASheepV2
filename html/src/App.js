import { io } from "socket.io-client";
import { createContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";

export const SocketContext = createContext();
const SERVER_URL = window.SERVER_URL;

const App = () => {
  const [socket] = useState(io(SERVER_URL, { autoConnect: false }));
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("connected to server");
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("disconnected from server");
      setConnected(false);
    });
  });

  return (
    <SocketContext.Provider value={[socket, connected]}>
      <div className="flex flex-col min-h-screen items-center text-[#eceff4]">
        <NavBar />
        <div className="flex align-middle flex-grow px-6 py-4 w-full md:w-11/12 lg:w-8/12 [@media(min-width:1600px)]:w-5/12 h-full text-[#2e3400]">
          <Outlet />
        </div>
        <div className="flex w-full text-[#2e3440]">
          {connected ? (
            <div className="bg-success p-4 flex w-full text-center">
              <div className="w-full">已连接到服务器: {SERVER_URL}</div>
            </div>
          ) : (
            <div className="bg-[#d08770] p-4 flex w-full text-center">
              <div className="w-full">正在连接到服务器: {SERVER_URL}</div>
            </div>
          )}
        </div>
      </div>
    </SocketContext.Provider>
  );
};

export default App;
