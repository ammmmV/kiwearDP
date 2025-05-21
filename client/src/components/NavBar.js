import React, { useState, useContext } from "react";
import { Context } from "../index";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink, useLocation } from "react-router-dom";
import {
  ADMIN_ROUTE,
  LOGIN_ROUTE,
  PATTERNS_FIX_ROUTE,
  SHOP_ROUTE,
  USER_PROFILE_DATA_ROUTE,
  PATTERNS_ROUTE,
  BASKET_ROUTE,
  USERS_FIX_ROUTE,
  ORDERS_ROUTE,
} from "../utils/consts";
import { Button } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import kiwi from "../assets/kiwi-kube-svg.svg";
import menu from "../assets/menu-svg.svg";
import "../styles/Style.css";
import GooeyNav from "../components/GooeyNav/GooeyNav";

const NavBar = observer(() => {
  const { user } = useContext(Context);
  const history = useNavigate();
  const location = useLocation();

  const logOut = () => {
    user.setUser({});
    user.setIsAuth(false);
  };

  const [menuVisible, setMenuVisible] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getPageTitle = (path) => {
    switch (path) {
      case PATTERNS_ROUTE:
        return "Patterns";
      case SHOP_ROUTE:
        return "Catalog";
      case USER_PROFILE_DATA_ROUTE:
        return "Profile";
      case BASKET_ROUTE:
        return "Basket";
      case ORDERS_ROUTE:
        return "Orders";
      default:
        return "";
    }
  };

  const currentPageTitle = getPageTitle(location.pathname);

  const menuItemStyle = (path) => ({
    cursor: "pointer",
    color: isActive(path) ? "white" : "#c4c4c4",
    textDecoration: "none",
    transition: "color 0.3s ease",
  });

  const navItems = [
    {
      label: "Админ панель",
      href: ADMIN_ROUTE,
      show: user.isAuth && user.user.role === 'ADMIN',
    },
    {
      label: "Пользователи",
      href: USERS_FIX_ROUTE,
      show: user.isAuth && user.user.role === 'ADMIN',
    },
    {
      label: "Лекала",
      href: PATTERNS_FIX_ROUTE,
      show: user.isAuth && user.user.role === 'ADMIN',
    },
    {
      label: "Корзина",
      href: BASKET_ROUTE,
      show: user.isAuth,
    },
  ];

  return (
    <Navbar bg="none" variant="dark">
      <div>
        <Button
          variant={"outline"}
          onClick={() => setMenuVisible(!menuVisible)}
        >
          <img
            src={menu}
            height={60}
            // style={{ 
            //   paddingLeft: "20px",
            //   transform: menuVisible ? 'rotate(90deg)' : 'rotate(0deg)',
            //   transition: 'transform 0.3s ease'
            // }}
            alt="Menu"
          />
        </Button>

        <div
          className={`menuShow ${menuVisible ? "active" : ""}`}
          onClick={() => setMenuVisible(false)}
        >
          <nav style={{ color: "white" }}>
            <ul>
              Ricotta
              <li>
                <a
                  onClick={(e) => {
                    e.stopPropagation();
                    history(USER_PROFILE_DATA_ROUTE);
                    setMenuVisible(false);
                  }}
                  style={menuItemStyle(USER_PROFILE_DATA_ROUTE)}
                >
                  Личный кабинет
                </a>
              </li>
              <li>
                <a
                  onClick={(e) => {
                    e.stopPropagation();
                    history(SHOP_ROUTE);
                    setMenuVisible(false);
                  }}
                  style={menuItemStyle(SHOP_ROUTE)}
                >
                  Каталог
                </a>
              </li>
              <li>
                <a
                  onClick={(e) => {
                    e.stopPropagation();
                    history(PATTERNS_ROUTE);
                    setMenuVisible(false);
                  }}
                  style={menuItemStyle(PATTERNS_ROUTE)}
                >
                  нет
                </a>
              </li>
            </ul>
            <ul>
              Mozzarella
              <li>
                <a
                  onClick={() => history(BASKET_ROUTE)}
                  style={menuItemStyle(BASKET_ROUTE)}
                >
                  Корзина
                </a>
              </li>
              <li>
                <a
                  onClick={() => history(ORDERS_ROUTE)}
                  style={menuItemStyle(ORDERS_ROUTE)}
                >
                  Заказы
                </a>
              </li>
              <li>
                <a
                  onClick={() => history(BASKET_ROUTE)}
                  style={menuItemStyle(BASKET_ROUTE)}
                >
                  что-то
                </a>
              </li>
            </ul>
            <ul>
              Sour-cream
              <li>
                <a href="#">one</a>
              </li>
              <li>
                <a href="#">two</a>
              </li>
              <li>
                <a href="#">three</a>
              </li>
            </ul>
            <ul>
              Cheese
              <li>
                <a href="#">one</a>
              </li>
              <li>
                <a href="#">two</a>
              </li>
              <li>
                <a href="#">three</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <Container>
        <div style={{ display: "flex", alignItems: "center" }}>
          <NavLink
            style={{
              fontSize: "2em",
              textDecoration: "none",
              color: "#fff",
              display: "flex",
              alignItems: "center",
            }}
            to={SHOP_ROUTE}
          >
            <img src={kiwi} style={{ height: "60px", marginRight: "10px" }} />
            KIWEAR
          </NavLink>
          {currentPageTitle && (
            <span
              style={{
                color: "#fff",
                fontSize: "1.5em",
                marginLeft: "15px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#fff", margin: "0 10px" }}>{"→"}</span>
              {currentPageTitle}
            </span>
          )}
        </div>
        {user.isAuth ? (
          <Nav>
            {user.user.role === 'ADMIN' && (
              <>
                <Button
                  variant={isActive(ADMIN_ROUTE) ? "outline-success" : "outline-light"}
                  onClick={() => history(ADMIN_ROUTE)}
                  className="items"
                  style={{ fontSize: "1.1em" }}
                >
                  Админ панель
                </Button>
                <Button
                  variant={isActive(USERS_FIX_ROUTE) ? "outline-success" : "outline-light"}
                  onClick={() => history(USERS_FIX_ROUTE)}
                  style={{ fontSize: "1.1em" }}
                  className="items"
                >
                  Пользователи
                </Button>
                <Button
                  variant={isActive(PATTERNS_FIX_ROUTE) ? "outline-success" : "outline-light"}
                  onClick={() => history(PATTERNS_FIX_ROUTE)}
                  style={{ fontSize: "1.1em" }}
                  className="items"
                >
                  Лекала
                </Button>
              </>
            )}
            {/* <Button
              variant={"outline-light"}
              onClick={() => logOut()}
              className="ml-2"
              style={{ fontSize: "1.1em" }}
            >
              Выйти
            </Button> */}
          </Nav>
        ) : (
          <Nav className="ml-auto" style={{ color: "white" }}>
            <Button
              variant={isActive(LOGIN_ROUTE) ? "outline-success" : "outline-light"}
              onClick={() => history(LOGIN_ROUTE)}
            >
              Авторизация
            </Button>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
});

export default NavBar;
