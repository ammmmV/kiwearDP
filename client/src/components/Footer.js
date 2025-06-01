import React, { useState } from "react";
import { Container, Modal, Button } from "react-bootstrap";
import styled from "styled-components";

const StyledFooter = styled.footer`
  background-color: rgba(39, 40, 42, 0.95);
  color: white;
  padding: 1.5rem 0;
  position: relative;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #267b54;
`;

const StyledLink = styled.span`
  color: white;
  text-decoration: underline;
  cursor: pointer;
  margin: 0 1rem;

  &:hover {
    color: #267b54;
  }
`;

const Footer = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <StyledFooter>
      <Container className="d-flex justify-content-between align-items-center">
        <div>
          <span>Телефон: +375 (29) 123-45-67</span>
        </div>
        <div>
          <StyledLink onClick={() => setShowAbout(true)}>О нас</StyledLink>
          <StyledLink onClick={() => setShowHelp(true)}>Справка</StyledLink>
        </div>
      </Container>

      <Modal
        show={showAbout}
        onHide={() => setShowAbout(false)}
        centered
        style={{ color: "white" }}
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "rgba(39, 40, 42, 0.95)",
            borderBottom: "1px solid #267b54",
          }}
        >
          <Modal.Title>О нас</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "rgba(39, 40, 42, 0.95)" }}>
          <p>
            KiWear - ваш надежный партнер в мире выкроек. Мы предоставляем
            качественные выкройки для создания уникальной одежды.
          </p>
          <p>
            Наша миссия - помочь вам воплотить ваши творческие идеи в
            реальность.
          </p>
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: "rgba(39, 40, 42, 0.95)",
            borderTop: "1px solid #267b54",
          }}
        >
          <Button variant="outline-light" onClick={() => setShowAbout(false)}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showHelp}
        onHide={() => setShowHelp(false)}
        centered
        style={{ color: "white" }}
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "rgba(39, 40, 42, 0.95)",
            borderBottom: "1px solid #267b54",
          }}
        >
          <Modal.Title>Справка</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "rgba(39, 40, 42, 0.95)" }}>
          <h5>Как сделать заказ:</h5>
          <ol>
            <li>Выберите понравившуюся выкройку</li>
            <li>Добавьте её в корзину</li>
            <li>Перейдите к оформлению заказа</li>
            <li>Заполните необходимые данные</li>
            <li>Подтвердите заказ</li>
            <li>
              В личном кабинете вы можете оставить отзыв на товар, который
              находится в статусе "COMPLETED"
            </li>
            <li>
              Отзыв подразумевает модерацию, поэтому сразу после отправки он
              будет находится в режиме ожидания, а после одобрения
              администратора станет видимым для других пользователей
            </li>
          </ol>
          <p>
            У заказов есть статус, который устанавливает администратор.
            Администратор может установить статус заказа, в том числе и
            отклонить его.
          </p>
          <h5>Контакты поддержки:</h5>
          <p>Email: support@kiwear.by</p>
          <p>Телефон: +375 (29) 123-45-67</p>
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: "rgba(39, 40, 42, 0.95)",
            borderTop: "1px solid #267b54",
          }}
        >
          <Button variant="outline-light" onClick={() => setShowHelp(false)}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </StyledFooter>
  );
};

export default Footer;
