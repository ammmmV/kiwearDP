import React, { useState, useEffect, useContext } from "react";
import { Container, Button, Modal, Form } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import InputMask from "react-input-mask";
import styled from "styled-components";
import { fetchHeaderData } from '../http/userAPI';
import "../styles/Style.css";
import { toast } from "react-custom-alert";

const StyledContainer = styled(Container)`
  padding: 1.5rem;
  color: white;
  max-width: 1000px;
  margin: 0 auto;
`;

const BasketItem = styled.div`
  display: flex;
  background: rgba(39, 40, 42, 0.9);
  border: 1px solid #267b54;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  width: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(38, 123, 84, 0.2);
  }
`;

const ImageContainer = styled.div`
  flex: 0 0 150px;
  padding: 0.75rem;

  img {
    border-radius: 6px;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
  }

  p {
    margin: 0.25rem 0;
  }
`;

const QuantityControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .quantity-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  button {
    padding: 0.25rem 0.5rem;

    &.quantity-btn {
      width: 24px;
      height: 24px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
  }

  .total-price {
    color: #267b54;
    font-weight: bold;
    font-size: 0.9rem;
    margin-top: 0.25rem;
  }
`;

const EmptyBasket = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ccc;

  h3 {
    margin-bottom: 1rem;
    color: #fff;
    font-size: 1.5rem;
  }

  .empty-basket-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #267b54;
  }

  p {
    color: #a0a0a0;
    font-size: 0.9rem;
  }
`;

const OrderModal = styled(Modal)`
  .modal-content {
    background: rgba(39, 40, 42, 0.95);
    border: 1px solid #267b54;
    color: white;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;

  .form-control,
  .form-select {
    background: rgba(39, 40, 42, 0.95);
    border: 1px solid #267b54;
    color: white;

    &:focus {
      background: rgba(39, 40, 42, 0.95);
      border-color: #267b54;
      box-shadow: 0 0 0 0.2rem rgba(38, 123, 84, 0.25);
      color: white;
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  .form-check-input {
    background-color: rgba(39, 40, 42, 0.95);
    border-color: #267b54;

    &:checked {
      background-color: #267b54;
      border-color: #267b54;
    }

    &:focus {
      border-color: #267b54;
      box-shadow: 0 0 0 0.2rem rgba(38, 123, 84, 0.25);
    }
  }

  .form-check-label {
    color: white;
  }

  textarea.form-control {
    min-height: 100px;
  }
`;

const Basket = observer(() => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { basket, user, order } = useContext(Context);

  const [orderData, setOrderData] = useState({
    cardNumber: "",
    cardOwner: user?.user?.fullName || "",
    delivery_method: "courier",
    delivery_address: "",
    notes: "",
    agreed: false,
  });

  const [formErrors, setFormErrors] = useState({
    cardNumber: "",
    cardOwner: "",
    delivery_address: "",
    agreed: "",
  });

  useEffect(() => {
    const loadBasket = async () => {
      try {
        if (user.isAuth && localStorage.getItem("token")) {
          basket.setCurrentUserEmail(user.user.email);
        } else {
          basket.setCurrentUserEmail("");
          basket.loadUserBasket();
        }
      } catch (error) {
        console.error("Ошибка при загрузке корзины:", error);
        toast.error("Ошибка при загрузке корзины");
      }
    };

    loadBasket();
  }, [user.isAuth, user.user?.email]);

  const handleOrderInput = (e) => {
    const { name, value, type, checked } = e.target;
    setOrderData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const removeFromBasket = async (id) => { // <--- СДЕЛАЛИ АСИНХРОННОЙ ФУНКЦИЕЙ
    try {
      await basket.removeFromBasket(id); // Дожидаемся завершения удаления из корзины

      const headerData = await fetchHeaderData();
      if (headerData) {
        user.setBasketCount(headerData.basketCount); // Обновляем значение в UserStore
      } else {
        console.warn("Не удалось получить данные для шапки после удаления, сбрасываю счетчик корзины.");
        user.setBasketCount(0);
      }
    } catch (error) {
      console.error("Ошибка при удалении из корзины:", error);
      toast.error("Произошла ошибка при удалении товара из корзины");
    }
  };


  const updateQuantity = async (id, quantity) => {
    try {
      if (quantity < 1) return;
      await basket.updateQuantity(id, quantity);
      const headerData = await fetchHeaderData();
      if (headerData) {
        user.setBasketCount(headerData.basketCount); // Обновляем значение в UserStore
      } else {
        console.warn("Не удалось получить данные для шапки после удаления, сбрасываю счетчик корзины.");
        user.setBasketCount(0);
      }
    } catch (error) {
      console.error("Ошибка при изменении количества:", error);
      toast.error("Произошла ошибка при изменении количества");
    }
  };

  const handleOrder = () => {
    if (!user.isAuth) {
      toast.error("Необходимо войти в аккаунт, чтобы оформить заказ");
      return;
    }

    setFormErrors({
      cardNumber: "",
      cardOwner: "",
      delivery_address: "",
      agreed: "",
    });

    setShowConfirmModal(true);
  };

  const confirmOrder = async () => {
    if (!user.isAuth) {
      toast.error("Необходимо авторизоваться для оформления заказа");
      return;
    }

    const errors = {
      cardNumber: !orderData.cardNumber ? "Введите номер карты" : "",
      cardOwner: !orderData.cardOwner ? "Введите имя держателя карты" : "",
      delivery_address:
        orderData.delivery_method === "courier" && !orderData.delivery_address
          ? "Введите адрес доставки"
          : "",
      agreed: !orderData.agreed ? "Необходимо согласие с условиями" : "",
    };

    setFormErrors(errors);

    if (Object.values(errors).some((e) => e)) return;

    try {
      const payload = {
        cardNumber: orderData.cardNumber.replace(/\s/g, ""),
        cardOwner: orderData.cardOwner,
        delivery_address: orderData.delivery_address,
        delivery_method: orderData.delivery_method,
        contact_phone: user.user.phone,
        notes: orderData.notes,
        patterns: basket.basket.map((item) => ({
          id: item.patternId || item.id,
          quantity: item.quantity,
          price: item.pattern?.price || 0,
        })),
      };

      const orderResponse = await order.createOrder(payload);

      if (orderResponse) {
        try {
          await basket.clearBasket();
          user.setBasketCount(0);
          setShowConfirmModal(false);
          setShowSuccessModal(true);

          setTimeout(() => {
            setShowSuccessModal(false);
            window.location.href = "/orders";
          }, 2000);
        } catch (clearError) {
          console.error("Ошибка при очистке корзины:", clearError);
          window.location.href = "/orders";
        }
      }
    } catch (err) {
      console.error("Ошибка при оформлении заказа:", err);
      toast.error(
        err.response?.data?.message ||
        "Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте позже."
      );
    }
  };

  return (
    <StyledContainer>
      {basket.loading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          Загрузка корзины...
        </div>
      ) : basket.basket.length > 0 ? (
        <>
          {basket.basket.map((item) => (
            <BasketItem
              key={`${item.id || item.patternId}-${item.typeId}-${item.fabricId
                }`}
            >
              <ImageContainer>
                <img
                  src={
                    item.pattern?.img
                      ? `${process.env.REACT_APP_API_URL + '/' + item.pattern.img}`
                      : ""
                  }
                  alt={item.pattern?.name || "Товар"}
                />
              </ImageContainer>
              <ContentContainer>
                <div>
                  <h4>{item.pattern?.name}</h4>
                  <p>Цена: {item.pattern?.price || 0} BYN</p>
                  <p>{item.pattern?.description}</p>
                </div>
                <QuantityControls>
                  <div className="quantity-controls">
                    <Button
                      variant="outline-light"
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      variant="outline-light"
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeFromBasket(item.id)}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      Удалить
                    </Button>
                  </div>
                  <div className="total-price">
                    Итого: {(item.pattern?.price * item.quantity).toFixed(2)}{" "}
                    BYN
                  </div>
                </QuantityControls>
              </ContentContainer>
            </BasketItem>
          ))}
          <div style={{ textAlign: "right", marginTop: "2rem" }}>
            <Button variant="success" size="lg" onClick={handleOrder}>
              К оформлению: {basket.totalPrice.toFixed(2)} BYN
            </Button>
          </div>
        </>
      ) : (
        <EmptyBasket>
          <div className="empty-basket-icon">🛒</div>
          <h3>Ваша корзина пуста</h3>
          <p>Добавьте товары из каталога, чтобы оформить заказ</p>
        </EmptyBasket>
      )}

      <OrderModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Оформление заказа</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-scroll">
          <FormGroup>
            <Form.Label>Номер карты</Form.Label>
            <InputMask
              mask="9999 9999 9999 9999"
              placeholder="XXXX XXXX XXXX XXXX"
              value={orderData.cardNumber}
              onChange={handleOrderInput}
              name="cardNumber"
            >
              {(inputProps) => (
                <Form.Control
                  {...inputProps}
                  isInvalid={!!formErrors.cardNumber}
                />
              )}
            </InputMask>
            <Form.Control.Feedback type="invalid">
              {formErrors.cardNumber}
            </Form.Control.Feedback>
          </FormGroup>

          <FormGroup>
            <Form.Label>Имя держателя карты</Form.Label>
            <Form.Control
              placeholder="WILL SMITH"
              type="text"
              name="cardOwner"
              value={orderData.cardOwner}
              onChange={handleOrderInput}
              isInvalid={!!formErrors.cardOwner}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.cardOwner}
            </Form.Control.Feedback>
          </FormGroup>

          <FormGroup>
            <Form.Label>Способ доставки</Form.Label>
            <Form.Select
              name="delivery_method"
              value={orderData.delivery_method}
              onChange={handleOrderInput}
            >
              <option value="courier">Курьером</option>
              <option value="pickup">Самовывоз</option>
            </Form.Select>
          </FormGroup>

          {orderData.delivery_method === "courier" && (
            <FormGroup>
              <Form.Label>Адрес доставки</Form.Label>
              <Form.Control
                name="delivery_address"
                value={orderData.delivery_address}
                onChange={handleOrderInput}
                isInvalid={!!formErrors.delivery_address}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.delivery_address}
              </Form.Control.Feedback>
            </FormGroup>
          )}

          <FormGroup>
            <Form.Label>Примечания</Form.Label>
            <Form.Control
              placeholder="Дополнительные сведения..."
              as="textarea"
              rows={3}
              name="notes"
              value={orderData.notes}
              onChange={handleOrderInput}
            />
          </FormGroup>

          <FormGroup>
            <Form.Check
              name="agreed"
              checked={orderData.agreed}
              onChange={handleOrderInput}
              label="Я согласен с обработкой персональных данных"
              isInvalid={!!formErrors.agreed}
            />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-danger"
            onClick={() => setShowConfirmModal(false)}
          >
            Отмена
          </Button>
          <Button
            variant="outline-success"
            onClick={confirmOrder}
            disabled={!orderData.agreed}
          >
            Подтвердить
          </Button>
        </Modal.Footer>
      </OrderModal>

      <Modal show={showSuccessModal} centered>
        <Modal.Body
          className="text-center"
          style={{ background: "rgba(39, 40, 42, 0.95)", color: "white" }}
        >
          <h4>Заказ успешно оформлен!</h4>
          <p>Вы будете перенаправлены в раздел заказов...</p>
        </Modal.Body>
      </Modal>
    </StyledContainer>
  );
});

export default Basket;
