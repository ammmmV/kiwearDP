import React, { useState } from "react";
import { Container, Modal, Button, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import kiwiLogo from "../assets/kiwi-bird.svg";
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
  ADMIN_ORDERS_ROUTE,
  ADMIN_CALCULATOR_ROUTE,
  FABRIC_CALCULATOR_ROUTE
} from "../utils/consts";

const StyledFooter = styled.footer`
  background-color: rgba(39, 40, 42, 0.95);
  color: white;
  padding: 2rem 0 1rem;
  position: relative;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #267b54;
  box-shadow: 0 -5px 15px rgba(38, 123, 84, 0.1);
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  img {
    height: 40px;
    margin-right: 10px;
    filter: brightness(0) saturate(100%) invert(56%) sepia(75%) saturate(385%) hue-rotate(101deg) brightness(95%) contrast(91%);
  }
  
  h3 {
    color: #267b54;
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
  }
`;

const FooterSection = styled.div`
  margin-bottom: 1.5rem;
  
  h5 {
    color: #267b54;
    margin-bottom: 1rem;
    font-weight: 600;
    position: relative;
    padding-bottom: 8px;
    
    &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 40px;
      height: 2px;
      background: #267b54;
    }
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  
  svg {
    margin-right: 10px;
    color: #267b54;
  }
`;

const StyledLink = styled.span`
  color: white;
  text-decoration: none;
  cursor: pointer;
  display: block;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
  padding-left: 15px;
  
  &:before {
    content: '›';
    position: absolute;
    left: 0;
    color: #267b54;
    transition: transform 0.3s ease;
  }

  &:hover {
    color: #267b54;
    transform: translateX(3px);
    
    &:before {
      transform: translateX(3px);
    }
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 1rem;
`;

const SocialIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  svg {
    color: white;
    font-size: 18px;
  }
  
  &:hover {
    background-color: #267b54;
    transform: translateY(-3px);
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 1.5rem;
  margin-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
`;

const StyledModal = styled(Modal)`
  .modal-content {
    background: rgba(39, 40, 42, 0.95);
    border: 1px solid #267b54;
    color: white;
  }
  
  .modal-header {
    border-bottom: 1px solid #267b54;
  }
  
  .modal-footer {
    border-top: 1px solid #267b54;
  }
  
  .btn-outline-light:hover {
    background-color: #267b54;
    border-color: #267b54;
  }
`;

const Footer = () => {
  const history = useNavigate();
  const [showAbout, setShowAbout] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <StyledFooter>
      <Container>
        <Row>
          <Col lg={4} md={6} sm={12}>
            <FooterSection>
              <FooterLogo>
                <img src={kiwiLogo} alt="KiWear Logo" />
                <h3>KiWear</h3>
              </FooterLogo>
              <p>Ваш надежный партнер в мире выкроек. Мы предоставляем качественные выкройки для создания уникальной одежды.</p>
              
              {/* <SocialIcons>
                <SocialIcon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                </SocialIcon>
                <SocialIcon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                  </svg>
                </SocialIcon>
                <SocialIcon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
                </SocialIcon>
              </SocialIcons> */}
            </FooterSection>
          </Col>
          
          <Col lg={3} md={6} sm={12}>
            <FooterSection>
              <h5>Информация</h5>
              <StyledLink onClick={() => setShowAbout(true)}>О нас</StyledLink>
              <StyledLink onClick={() => setShowHelp(true)}>Справка</StyledLink>
              {/* <StyledLink>Выход</StyledLink> */}
            </FooterSection>
          </Col>
          
          <Col lg={2} md={6} sm={12}>
            <FooterSection>
              <h5>Категории</h5>
              <StyledLink onClick={() => history(SHOP_ROUTE)}>Каталог</StyledLink>
              <StyledLink onClick={() => history(USER_PROFILE_DATA_ROUTE)}>Личный кабинет</StyledLink>
              <StyledLink onClick={() => history(BASKET_ROUTE)}>Корзина</StyledLink>
            </FooterSection>
          </Col>
          
          <Col lg={3} md={6} sm={12}>
            <FooterSection>
              <h5>Контакты</h5>
              <ContactItem>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                </svg>
                <span>+375 (29) 123-45-67</span>
              </ContactItem>
              <ContactItem>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                </svg>
                <span>support@kiwear.by</span>
              </ContactItem>
            </FooterSection>
          </Col>
        </Row>
        
        <Copyright>
          © {currentYear} KiWear. Все права защищены.
        </Copyright>
      </Container>

      <StyledModal
        show={showAbout}
        onHide={() => setShowAbout(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>О нас</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            KiWear - ваш надежный партнер в мире выкроек. Мы предоставляем
            качественные выкройки для создания уникальной одежды.
          </p>
          <p>
            Наша миссия - помочь вам воплотить ваши творческие идеи в
            реальность.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-light" onClick={() => setShowAbout(false)}>
            Закрыть
          </Button>
        </Modal.Footer>
      </StyledModal>

      <StyledModal
        show={showHelp}
        onHide={() => setShowHelp(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Справка</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        <Modal.Footer>
          <Button variant="outline-light" onClick={() => setShowHelp(false)}>
            Закрыть
          </Button>
        </Modal.Footer>
      </StyledModal>
    </StyledFooter>
  );
};

export default Footer;
