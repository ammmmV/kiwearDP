import React, { useContext, useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { Container, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { observer } from "mobx-react-lite";
import { updateUser } from "../http/userAPI";
import { Context } from "../index";
import { useNavigate } from "react-router-dom";
import { LOGIN_ROUTE } from "../utils/consts";
import mouse from '../assets/mouse.png'
import "../styles/Style.css";

const mockComments = [];

const UserProfile = observer(() => {
    const { user } = useContext(Context);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [size, setSize] = useState('');
    const [name, setName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (user && user.user) {
            console.log('User data:', user.user);
            console.log('User type:', typeof user.user);
            setEmail(user.user.email || '');
            setPhone(user.user.phone || '');
            setSize(user.user.size || '');
            setName(user.user.name || '');
        }
        setComments(mockComments);
    }, [user.user]);

    const handleLogout = () => {
        user.setUser({});
        user.setIsAuth(false);
        navigate(LOGIN_ROUTE);
    };

    const handleSave = async () => {
        try {
            const updatedData = {
                id: user.user.id,
                email,
                name,
                phone,
                size
            };

            const updatedUser = await updateUser(updatedData);
            
            user.setUser({
                ...user.user,
                ...updatedData
            });
            
            setEmail(updatedData.email);
            setPhone(updatedData.phone);
            setSize(updatedData.size);
            setName(updatedData.name);
            
            setIsEditing(false);
            alert('Данные успешно обновлены!');
        } catch (error) {
            console.error('Ошибка при сохранении данных:', error);
            alert('Произошла ошибка при сохранении данных');
        }
    };

    return (
        <Container style={{ minHeight: '90vh' }}>
            <div style={{display: "flex", justifyContent: "center"}}>
                <div className='profile-card'>
                    <Form style={{display: "flex", flexDirection: "column"}}>
                        <Form.Label style={{ color: "#f7f7f7" }}>Email:</Form.Label>
                        <Form.Control
                            className="mb-3 border-secondary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!isEditing}
                            style={{ background: "#27282a", color: "#f7f7f7" }}
                        />
                        <Form.Label style={{ color: "#f7f7f7" }}>Имя:</Form.Label>
                        <Form.Control
                            className="mb-3 border-secondary"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!isEditing}
                            style={{ background: "#27282a", color: "#f7f7f7" }}
                        />

                        <Form.Label style={{ color: "#f7f7f7" }}>Телефон:</Form.Label>
                        <InputMask
                            mask="+375 (99) 999-99-99"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={!isEditing}
                        >
                            {(inputProps) => (
                                <Form.Control
                                    {...inputProps}
                                    className="mb-3 border-secondary"
                                    placeholder="+375 (__) ___-__-__"
                                    style={{ background: "#27282a", color: "#f7f7f7" }}
                                />
                            )}
                        </InputMask>

                        <Form.Label style={{ color: "#f7f7f7" }}>Размер одежды:</Form.Label>
                        <Form.Select
                            className="mb-4 border-secondary"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            disabled={!isEditing}
                            style={{ background: "#27282a", color: "#f7f7f7" }}
                        >
                            <option value="">Выберите размер</option>
                            <option value="XS">XS (42)</option>
                            <option value="S">S (44)</option>
                            <option value="M">M (46)</option>
                            <option value="L">L (48)</option>
                            <option value="XL">XL (50)</option>
                        </Form.Select>

                        <div className="d-flex justify-content-between mb-4">
                            <Button variant="outline-light" onClick={handleLogout}>Выйти</Button>
                            {isEditing ? (
                                <Button className="auth-button" onClick={handleSave}>Сохранить</Button>
                            ) : (
                                <Button className="auth-button" onClick={() => setIsEditing(true)}>Редактировать</Button>
                            )}

                        </div>
                    </Form>


                    <div>
                        {/* <h5 style={{ color: "#f7f7f7" }}>Ваши комментарии:</h5> */}
                        <ul className="mt-2" style={{ color: "#ccc" }}>
                            {comments.length > 0 ? (
                                comments.map((comment, idx) => (
                                    <li key={idx} style={{ marginBottom: "0.5rem" }}>{comment}</li>
                                ))
                            ) : (
                                <div>
                                    <img src={mouse} width={300} alt="mouse" />
                                    <p>Вы ещё не оставляли комментариев.</p>
                                </div>
                            )}
                        </ul>
                    </div>

                </div>
            </div>
        </Container>
    );
});

export default UserProfile;
