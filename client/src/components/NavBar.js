import React, { useState, useEffect, useContext } from "react";
import { Context } from "../index";
import Navbar from "react-bootstrap/Navbar";
import { Dropdown } from "react-bootstrap";
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
  REVIEWS_ROUTE,
  ADMIN_REVIEWS_ROUTE,
  ADMIN_ORDERS_ROUTE
} from "../utils/consts";
import { Button } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import kiwi from "../assets/kiwi-kube-svg.svg";
import menu from "../assets/menu-svg.svg";
import "../styles/Style.css";
import { fetchHeaderData } from '../http/userAPI'; //

const NavBar = observer(() => {
  const { user } = useContext(Context);
  const history = useNavigate();
  const location = useLocation();

  const logOut = () => {
    user.setUser({});
    user.setIsAuth(false);
    user.setBasketCount(0);
    history(LOGIN_ROUTE);
  };

  const [menuVisible, setMenuVisible] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getPageTitle = (path) => {
    switch (path) {
      case SHOP_ROUTE:
        return "Каталог";
      case BASKET_ROUTE:
        return "Корзина";
      case USER_PROFILE_DATA_ROUTE:
        return "Личный кабинет";
      case ORDERS_ROUTE:
        return "Заказы";
      case REVIEWS_ROUTE:
        return "Отзывы";
      case PATTERNS_FIX_ROUTE:
        return "Лекала";
      case ADMIN_ORDERS_ROUTE:
        return "Заказы";
      case ADMIN_REVIEWS_ROUTE:
        return "Отзывы";
      case USERS_FIX_ROUTE:
        return "Пользователи";
      case ADMIN_ROUTE  :
        return "Ткани / Фурнитура";
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

  const userNavItems = [
    { label: "Каталог", path: SHOP_ROUTE },
    { label: "Корзина", path: BASKET_ROUTE },
    { label: "Личный кабинет", path: USER_PROFILE_DATA_ROUTE },
    { label: "Мои Заказы", path: ORDERS_ROUTE },
  ];

  const adminNavItems = [
    { label: "Ткани / Фурнитура", path: ADMIN_ROUTE },
    { label: "Ассортимент лекала", path: PATTERNS_FIX_ROUTE },
    { label: "Заказы пользователей", path: ADMIN_ORDERS_ROUTE },
    { label: "Отзывы пользователей", path: ADMIN_REVIEWS_ROUTE },
    { label: "Пользователи", path: USERS_FIX_ROUTE }
  ];

  useEffect(() => {
    const loadHeaderData = async () => {
      if (user.isAuth) {
        const data = await fetchHeaderData();
        if (data) {
          user.setUser({ ...user.user, name: data.name });
          user.setBasketCount(data.basketCount);
        } else {
          user.setBasketCount(0);
          // user.setUser({});
        }
      } else {
        user.setBasketCount(0);
        user.setUser({});
      }
    };

    loadHeaderData();
  }, [user.isAuth]);


  const updateBasketCount = async () => {
    if (user.isAuth) {
      const data = await fetchHeaderData();
      if (data) {
        user.setBasketCount(data.basketCount);
      }
    }
  };

  return (
    <Navbar bg="none" variant="dark" style={{ padding: "10px 20px" }}>
      <div className="d-flex justify-content-between align-items-center w-100">
        <div className="d-flex justify-content-between w-100">
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Button
              variant={"outline"}
              onClick={() => setMenuVisible(!menuVisible)}
              style={{ marginRight: "15px", padding: "5px" }}
            >
              <img
                src={menu}
                height={50}
                alt="Menu"
              />
            </Button>


            <img
              src={kiwi}
              height={55}
              alt="Kiwi Logo"
              style={{ marginRight: "10px", cursor: "pointer" }}
              onClick={() => history(SHOP_ROUTE)}
            />

            <span
              style={{
                color: "white",
                fontSize: "32px",
                cursor: "pointer",
                fontStyle: "italic",
                display: "flex",
                alignItems: "center", 
              }}
              onClick={() => history(SHOP_ROUTE)}
            >
              <span>k</span>
              <span
                style={{
                  color: "#267b54",
                  fontSize: "33px",
                  fontWeight: "bold",
                }}
              >
                i
              </span>
              Wear
            </span>

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
                <span style={{ color: "#fff", marginRight: "10px" }}>→</span>
                {currentPageTitle}
              </span>
            )}
          </div>


          <Nav className="ms-auto d-flex align-items-center right-nav-group"> 
            {user.isAuth ? (
              <>
                <Nav.Link
                  className="user-name-link"
                  onClick={() => history(USER_PROFILE_DATA_ROUTE)}
                >
                  {user.user.name || "Пользователь"}
                </Nav.Link>

                <Button
                  variant={"outline-light"}
                  onClick={() => history(BASKET_ROUTE)}
                  className="ms-3 basket-button"
                >
                  Корзина <span className="basket-count-badge">{user.basketCount}</span>
                </Button>

                {user.user.role === "ADMIN" && (
                  <Button
                    variant={"outline-light"}
                    onClick={() => history(ADMIN_ROUTE)}
                    className="ms-3 admin-button"
                  >
                    Админ панель
                  </Button>
                )}

                <Button
                  variant={"outline-light"}
                  onClick={logOut}
                  className="ms-3 logout-button"
                >
                  Выйти
                </Button>
              </>
            ) : (
              <Button
                variant={"outline-light"}
                onClick={() => history(LOGIN_ROUTE)}
                className="login-button"
              >
                Авторизация
              </Button>
            )}
          </Nav>
          <div
            className={`menuShow ${menuVisible ? "active" : ""}`}
            onClick={() => setMenuVisible(false)}
          >
            <nav style={{ color: "white" }}>
              <ul>
                {!user.isAuth && (
                  <>
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
                          history(LOGIN_ROUTE);
                          setMenuVisible(false);
                        }}
                        style={menuItemStyle(LOGIN_ROUTE)}
                      >
                        Войти
                      </a>
                    </li>
                  </>
                )}
                {user.isAuth && (
                  <>
                    {user.user.role === "USER" &&
                      userNavItems.map(({ label, path }) => (
                        <li key={path}>
                          <a
                            onClick={(e) => {
                              e.stopPropagation();
                              history(path);
                              setMenuVisible(false);
                            }}
                            style={menuItemStyle(path)}
                          >
                            {label}
                          </a>
                        </li>
                      ))
                    }
                    {user.user.role === "ADMIN" && (
                      <>
                        {userNavItems.map(({ label, path }) => (
                          <li key={path}>
                            <a
                              onClick={(e) => {
                                e.stopPropagation();
                                history(path);
                                setMenuVisible(false);
                              }}
                              style={menuItemStyle(path)}
                            >
                              {label}
                            </a>
                          </li>
                        ))}

                        <li style={{ borderTop: "1px solid #555", margin: "10px 0", maxWidth: "100px" }}></li>

                        {adminNavItems.map(({ label, path }) => (
                          <li key={path}>
                            <a
                              onClick={(e) => {
                                e.stopPropagation();
                                history(path);
                                setMenuVisible(false);
                              }}
                              style={menuItemStyle(path)}
                            >
                              {label}
                            </a>
                          </li>
                        ))}
                      </>
                    )}
                    <li>
                      <a
                        onClick={(e) => {
                          e.stopPropagation();
                          logOut();
                          setMenuVisible(false);
                        }}
                        style={menuItemStyle("")}
                      >
                        Выйти
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </Navbar>
  );
});

export default NavBar;
