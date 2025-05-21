import React, { useContext, useState } from 'react';
import { Container, Form } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE, USER_PROFILE_DATA_ROUTE } from "../utils/consts";
import { login, registration } from "../http/userAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import InputMask from 'react-input-mask';
import "../styles/Style.css"

const Auth = observer(() => {
    const { user } = useContext(Context);
    const location = useLocation();
    const history = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const click = async () => {
        try {
            let data;
            if (isLogin) {
                data = await login(email, password);
            } else {
                data = await registration(email, password, name, phone);
            }
            user.setUser(data);
            user.setIsAuth(true);
            history(USER_PROFILE_DATA_ROUTE);
        } catch (e) {
            alert(e.response?.data?.message || 'Ошибка!');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
            <div className="auth-card">
                <Card className="p-5 auth-card-content">
                    <h2 className="m-auto">{isLogin ? "Авторизация" : "Регистрация"}</h2>
                    <Form className="d-flex flex-column">
                        {!isLogin && (
                            <>
                                <Form.Control
                                    className="mt-3 border-secondary"
                                    placeholder="Введите ваше имя..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{ background: "#27282a", color: "#f7f7f7" }}
                                />
                                <InputMask
                                    mask="+375 (99) 999-99-99"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                >
                                    {(inputProps) => (
                                        <Form.Control
                                            {...inputProps}
                                            className="mt-3 border-secondary"
                                            placeholder="Введите ваш телефон..."
                                            style={{ background: "#27282a", color: "#f7f7f7" }}
                                        />
                                    )}
                                </InputMask>
                            </>
                        )}
                        <Form.Control
                            className={`mt-3 ${email && email.includes("@") && email.includes(".") ? "is-valid" : "is-invalid"} border-secondary`}
                            placeholder="Введите ваш email..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ background: "#27282a", color: "#f7f7f7" }}
                        />
                        <Form.Control
                            className={`mt-2 ${password && password.length > 3 ? "is-valid" : "is-invalid"} border-secondary`}
                            placeholder="Введите ваш пароль..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            style={{ background: "#27282a", color: "#f7f7f7" }}
                        />
                        <Row className="d-flex justify-content-between mt-3">
                            {isLogin ? (
                                <div>
                                    Нет аккаунта? <NavLink to={REGISTRATION_ROUTE} style={{ color: '#3fc586', fontSize: '1.1em', textDecoration: 'underline' }}>Зарегистрируйтесь!</NavLink>
                                </div>
                            ) : (
                                <div>
                                    Есть аккаунт? <NavLink to={LOGIN_ROUTE} style={{ color: '#3fc586', fontSize: '1.1em', textDecoration: 'underline' }}>Войдите!</NavLink>
                                </div>
                            )}
                            <Button className="mt-2 auth-button" onClick={click}>
                                {isLogin ? "Войти" : "Регистрация"}
                            </Button>
                        </Row>
                    </Form>
                </Card>
            </div>
        </Container>
    );
});

export default Auth;
