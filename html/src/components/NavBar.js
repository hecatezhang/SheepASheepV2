/* eslint-disable jsx-a11y/anchor-is-valid */
import { useNavigate } from "react-router-dom";

const NavBarBrand = ({ children, onClick }) => {
  return (
    <li className="hidden [@media(min-width:340px)]:flex font-bold">
      <a onClick={onClick}>{children}</a>
    </li>
  );
};

const NavBarItem = ({ children, onClick }) => {
  return (
    <li onClick={onClick}>
      <a>{children}</a>
    </li>
  );
};

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <div className="navbar bg-base-100 justify-center">
      <div className="navbar-center flex">
        <ul className="menu menu-horizontal p-0 text-lg">
          <NavBarBrand onClick={() => navigate("/")}>羊了个羊</NavBarBrand>
          <NavBarItem onClick={() => navigate("challenge")}>
            每日挑战
          </NavBarItem>
          <NavBarItem onClick={() => navigate("topic")}>今日话题</NavBarItem>
          {window.enableSettingsPage && (
            <NavBarItem onClick={() => navigate("settings")}>设置</NavBarItem>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
