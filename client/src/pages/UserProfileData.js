import React, { useContext, useState, useEffect } from "react";
import InputMask from "react-input-mask";
import { Container, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { observer } from "mobx-react-lite";
import { updateUser } from "../http/userAPI";
import { Context } from "../index";
import { useNavigate } from "react-router-dom";
import { LOGIN_ROUTE } from "../utils/consts";
import mouse from "../assets/mouse.png";
import "../styles/Style.css";
import { createReview } from "../http/reviewAPI";
import ReviewStore from "../store/ReviewStore";

const UserProfile = observer(() => {
  const { user, order } = useContext(Context);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [size, setSize] = useState("");
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [comments, setComments] = useState([]);
  const [orderedPatterns, setOrderedPatterns] = useState([]);
  const [selectedPatternId, setSelectedPatternId] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [selectedPattern, setSelectedPattern] = useState(null);
  const [canReview, setCanReview] = useState(false);

  useEffect(() => {
    if (user && user.user) {
      setEmail(user.user.email || "");
      setPhone(user.user.phone || "");
      setSize(user.user.size || "");
      setName(user.user.name || "");
    }

    const fetchOrderedPatterns = async () => {
      try {
        await order.fetchOrders();
        const allPatterns = order.orders.flatMap((o) => o.patterns || []);
        const uniquePatterns = Array.from(
          new Map(allPatterns.map((p) => [p.id, p])).values()
        );
        setOrderedPatterns(uniquePatterns);
      } catch (e) {
        console.error("Ошибка при получении заказов:", e);
        setOrderedPatterns([]);
      }
    };

    fetchOrderedPatterns();

    setComments([]);
  }, [user.user, order]);

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
        size,
      };
      const updatedUser = await updateUser(updatedData);
      user.setUser({
        ...user.user,
        ...updatedData,
      });
      setEmail(updatedData.email);
      setPhone(updatedData.phone);
      setSize(updatedData.size);
      setName(updatedData.name);
      setIsEditing(false);
      alert("Данные успешно обновлены!");
    } catch (error) {
      console.error("Ошибка при сохранении данных:", error);
      alert("Произошла ошибка при сохранении данных");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await ReviewStore.addReview({
        patternId: Number(selectedPatternId),
        rating: Number(rating),
        comment
      });
      setSelectedPatternId("");
      setRating("");
      setComment("");
      alert("Отзыв успешно отправлен!");
    } catch (error) {
      console.error("Ошибка при отправке отзыва:", error);
      alert(error.response?.data?.message || "Ошибка при отправке отзыва");
    }
  };

  const checkCanReview = (patternId) => {
    const hasCompletedOrder = order.orders.some(
      (order) =>
        order.status === "COMPLETED" &&
        order.patterns.some((pattern) => pattern.id === Number(patternId))
    );
    setCanReview(hasCompletedOrder);
  };

  return (
    <Container style={{ minHeight: "90vh" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="profile-card">
          <Form style={{ display: "flex", flexDirection: "column" }}>
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
              <Button variant="outline-light" onClick={handleLogout}>
                Выйти
              </Button>
              {isEditing ? (
                <Button className="auth-button" onClick={handleSave}>
                  Сохранить
                </Button>
              ) : (
                <Button
                  className="auth-button"
                  onClick={() => setIsEditing(true)}
                >
                  Редактировать
                </Button>
              )}
            </div>
          </Form>

          <Form onSubmit={handleReviewSubmit} className="mb-4">
            <Form.Label style={{ color: "#f7f7f7" }}>
              Выберите товар:
            </Form.Label>
            <Form.Select
              name="patternId"
              required
              style={{ background: "#27282a", color: "#f7f7f7" }}
              onChange={(e) => {
                const patternId = e.target.value;
                setSelectedPatternId(patternId);
                checkCanReview(patternId);
              }}
            >
              <option value="">Лекало</option>
              {orderedPatterns.map((pattern) => (
                <option key={pattern.id} value={pattern.id}>
                  {pattern.name}
                </option>
              ))}
            </Form.Select>
            {selectedPatternId && !canReview && (
              <div style={{ color: "#ff6b6b", marginTop: "0.5rem" }}>
                Отзыв можно оставить только на товары из завершённых заказов
              </div>
            )}
            <div>
              <Form.Label style={{ color: "#f7f7f7", marginTop: "1rem" }}>
                Оценка:
              </Form.Label>
              <Form.Select
                name="rating"
                required
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                style={{ background: "#27282a", color: "#f7f7f7" }}
              >
                <option value="">___</option>
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
              </Form.Select>
            </div>
            <Form.Label style={{ color: "#f7f7f7", marginTop: "1rem" }}>
              Ваш отзыв:
            </Form.Label>
            <Form.Control
              as="textarea"
              name="comment"
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ background: "#27282a", color: "#f7f7f7" }}
            />
            <Button
              type="submit"
              className="mt-3 auth-button"
              disabled={!canReview}
            >
              Оставить отзыв
            </Button>{" "}
          </Form>

          <ul className="mt-2" style={{ color: "#ccc" }}>
            {comments.length > 0 ? (
              comments.map((comment, idx) => (
                <li key={idx} style={{ marginBottom: "0.5rem" }}>
                  <b>{comment.pattern}</b> — Оценка: {comment.rating}
                  <br />
                  {comment.comment}
                </li>
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
    </Container>
  );
});

export default UserProfile;
