import React, { useContext, useState, useEffect } from "react";
// import InputMask from "react-input-mask";
import { Container, Form, Modal } from "react-bootstrap";
import InputMask from 'react-input-mask';
import Button from "react-bootstrap/Button";
import { observer } from "mobx-react-lite";
import { updateUser } from "../http/userAPI";
import { Context } from "../index";
import { useNavigate } from "react-router-dom";
import { LOGIN_ROUTE } from "../utils/consts";
import mouse from "../assets/mouse.png";
import "../styles/Style.css";
import { createReview } from "../http/reviewAPI";
import { Link } from "react-router-dom";
import { REVIEWS_ROUTE } from "../utils/consts";
import { toast } from "react-custom-alert";

const UserProfile = observer(() => {
  const { user, order, review } = useContext(Context);
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
  const [patternImages, setPatternImages] = useState({});
  const [orderDetails, setOrderDetails] = useState({});

  // const [selectedPattern, setSelectedPattern] = useState(null);
  const [canReview, setCanReview] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

        const orderDetailsMap = {};
        order.orders.forEach((o) => {
          o.patterns.forEach((p) => {
            if (
              !orderDetailsMap[p.id] ||
              new Date(o.order_date) > new Date(orderDetailsMap[p.id].date)
            ) {
              orderDetailsMap[p.id] = {
                date: o.order_date,
                price: p.price,
                orderNumber: o.order_number,
              };
            }
          });
        });
        setOrderDetails(orderDetailsMap);

        const imagesMap = {};
        uniquePatterns.forEach((p) => {
          imagesMap[p.id] = p.img;
        });
        setPatternImages(imagesMap);
      } catch (e) {
        console.error("Ошибка при получении заказов:", e);
        toast.error("Ошибка при получении заказов");
        setOrderedPatterns([]);
      }
    };

    fetchOrderedPatterns();

    const loadUserReviews = async () => {
      try {
        await review.loadUserReviews();
        setComments(
          review.userReviews.map((review) => ({
            id: review.id,
            patternId: review.pattern.id,
            pattern: review.pattern.name,
            rating: review.rating,
            comment: review.comment,
            date: new Date(review.date).toLocaleDateString(),
            status: review.status
          }))
        );
      } catch (error) {
        console.error("Ошибка при загрузке отзывов пользователя:", error);
        toast.error("Ошибка при получении отзывов");
        setComments([]);
      }
    };

    loadUserReviews();
  }, [user.user, order, review]);

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
      toast.success("Данные успешно обновлены!");
    } catch (error) {
      console.error("Ошибка при сохранении данных:", error);
      toast.error("Произошла ошибка при сохранении данных");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await review.addReview({
        patternId: Number(selectedPatternId),
        rating: Number(rating),
        comment,
      });
      setSelectedPatternId("");
      setRating("");
      setComment("");
      toast.success("Отзыв успешно отправлен!");
    } catch (error) {
      console.error("Ошибка при отправке отзыва:", error);
      toast.error(error.response?.data?.message || "Ошибка при отправке отзыва");
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

  const handleClose = () => {
    setShowModal(false);
    setSelectedPatternId("");
    setRating("");
    setComment("");
  };

  const handleShow = () => setShowModal(true);

  return (
    <Container style={{ minHeight: "90vh" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          className="profile-card"
          style={{
            display: "flex",
            flexDirection: "row",
            maxWidth: comments.length > 0 ? "1200px" : "900px",
            width: comments.length > 0 ? "90%" : "80%",
          }}
        >
          <Form
            style={{
              display: "flex",
              flexDirection: "column",
              width: "30%",
              minWidth: "350px",
              marginRight: "20px",
            }}
          >
            <img src={mouse} width={150} alt="mouse" style={{ marginBottom: "20px" }} />

            <Form.Label style={{ color: "#f7f7f7" }}>Ваши данные</Form.Label>
            <Form.Control
              className="mb-3 border-secondary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
              style={{ background: "#27282a", color: "#f7f7f7" }}
            />
            <Form.Control
              className="mb-3 border-secondary"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              style={{ background: "#27282a", color: "#f7f7f7" }}
            />
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

          <div
            style={{
              width: "50%",
              minWidth: "350px",
              display: "flex",
              flexDirection: "column",
              alignItems: comments.length > 0 ? "flex-start" : "center",
              justifyContent: comments.length > 0 ? "flex-start" : "center",
            }}
          >
            {comments.length > 0 ? (
              <div style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h4 style={{ color: "#f7f7f7", marginBottom: "15px" }}>
                    Ваши отзывы
                  </h4>
                  <Button
                    variant="outline-light"
                    onClick={handleShow}
                    className="mt-2 mb-3"
                    style={{ width: "200px" }}
                  >
                    Добавить отзыв
                  </Button>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                    width: "100%",
                    maxHeight: "650px",
                    overflowY: "auto",
                    paddingRight: "10px",
                  }}
                  className="custom-scroll"
                >
                  {comments.map((comment, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "15px",
                        border: "1px solid #444",
                        borderRadius: "10px",
                        backgroundColor: "rgba(39, 40, 42, 0.7)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          marginBottom: "10px",
                        }}
                      >
                        {patternImages[comment.patternId] && (
                          <img
                            src={
                              process.env.REACT_APP_API_URL +
                              "/" +
                              patternImages[comment.patternId]
                            }
                            alt={comment.pattern}
                            style={{
                              width: "100px",
                              height: "120px",
                              marginTop: "10px",
                              objectFit: "cover",
                              marginRight: "15px",
                              borderRadius: "5px",
                            }}
                          />
                        )}
                        <div>
                          <h5 style={{ color: "#f7f7f7", marginBottom: "5px" }}>
                            {comment.pattern}
                          </h5>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              color: "#aaa",
                            }}
                          >
                            <span style={{ marginRight: "10px" }}>
                              Оценка: {comment.rating}
                            </span>
                            <span>Дата отзыва: {comment.date}</span>
                            <span
                              style={{
                                color:
                                  comment.status === "APPROVED"
                                    ? "#4caf50"
                                    : comment.status === "REJECTED"
                                    ? "#f44336"
                                    : "#ffc107",
                                fontWeight: "bold",
                                marginTop: "5px",
                              }}
                            >
                              {comment.status === "APPROVED"
                                ? "Одобрен"
                                : comment.status === "REJECTED"
                                ? "Отклонен"
                                : "На рассмотрении"}
                            </span>
                          </div>
                          {orderDetails[comment.patternId] && (
                            <div style={{ fontSize: "0.9em", color: "#aaa" }}>
                              <div>
                                Дата покупки:{" "}
                                {new Date(
                                  orderDetails[comment.patternId].date
                                ).toLocaleDateString()}
                              </div>
                              <div>
                                Цена: {orderDetails[comment.patternId].price}{" "}
                                BYN
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <p
                        style={{
                          margin: "0",
                          paddingTop: "10px",
                          borderTop: "1px solid #555",
                          color: "#fff",
                        }}
                      >
                        {comment.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ 
                textAlign: "center", 
                width: "100%", 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center" 
              }}>
                <img src={mouse} width={300} alt="mouse" style={{ marginBottom: "20px" }} />
                <Button
                  variant="outline-light"
                  onClick={handleShow}
                  className="mb-3"
                  style={{ width: "200px" }}
                >
                  Добавить отзыв
                </Button>
                <p>Вы ещё не оставляли отзывов.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header
          closeButton
          style={{ background: "#27282a", color: "#f7f7f7", border: "none" }}
        >
          <Modal.Title>Добавить отзыв</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: "#27282a", color: "#f7f7f7" }}>
          <Form onSubmit={handleReviewSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Выберите товар:</Form.Label>
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
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Оценка:</Form.Label>
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
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ваш отзыв:</Form.Label>
              <Form.Control
                as="textarea"
                name="comment"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ background: "#27282a", color: "#f7f7f7" }}
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="me-2"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                className="auth-button"
                disabled={!canReview}
              >
                Отправить
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
});

export default UserProfile;
