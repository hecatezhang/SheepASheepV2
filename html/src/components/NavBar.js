import { useNavigate } from "react-router-dom";

const NavBarBrand = ({ children }) => {
  return (
    <div className="hidden self-center items-center text-lg cursor-default h-2/3 md:px-5 select-none md:flex">
      {children}
    </div>
  );
};

const NavBarItem = ({ children, onClick }) => {
  return (
    <div
      className="flex self-center items-center text-lg cursor-pointer px-2 md:px-5 h-2/3"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex w-full h-14 divide-x bg-zinc-700 text-gray-200">
      <div className="flex h-full divide-x divide-slate-400 flex-grow lg:justify-center">
        <NavBarBrand>羊了个羊羊</NavBarBrand>
        <NavBarItem
          onClick={() => {
            navigate("/");
          }}
        >
          主页
        </NavBarItem>
        <NavBarItem
          onClick={() => {
            navigate("challenge");
          }}
        >
          每日挑战
        </NavBarItem>
        <NavBarItem
          onClick={() => {
            navigate("topic");
          }}
        >
          今日话题
        </NavBarItem>
        <NavBarItem
          onClick={() => {
            navigate("settings");
          }}
        >
          设置
        </NavBarItem>
      </div>
    </div>
  );
};

export default NavBar;
