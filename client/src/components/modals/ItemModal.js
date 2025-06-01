import React, { useContext, useEffect } from "react";
import { Context } from "../../index";
import { Modal, Button, Image } from "react-bootstrap";
import styled from "styled-components";

const StyledModal = styled(Modal)`
  .modal-content {
    background: rgba(39, 40, 42, 0.95);
    border: 1px solid #267b54;
  }
`;

const ModalTitle = styled(Modal.Title)`
  color: #ffffff;
`;

const ModalBody = styled(Modal.Body)`
  color: #ffffff;
  &.custom-scroll {
    overflow-y: auto;
  }
`;

const ItemPrice = styled.div`
  color: #267b54;
  font-size: 1.5em;
  font-weight: bold;
  margin: 1rem 0;
`;

const ItemDescription = styled.div`
  margin: 1rem 0;
`;

const ItemModal = ({ show, onHide, item, type }) => {
  const { basket, user } = useContext(Context);

  useEffect(() => {
    if (user.currentUser?.email) {
      basket.setUser(user.currentUser.email);
    }
  }, [user.currentUser?.email, basket]);

  const addToBasket = async () => {
    try {
        if (!user.isAuth) {
            alert("АВТОРИЗУЙСЯ");
            return;
        }

        await basket.addToBasket({
            patternId: item.id
        });
        onHide();
    } catch (error) {
        console.error("Ошибка при добавлении в корзину:", error);
        alert("Произошла ошибка при добавлении товара в корзину");
    }
};

  return (
    <StyledModal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <ModalTitle>{item.name}</ModalTitle>
      </Modal.Header>
      <ModalBody className="custom-scroll">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            width="20%"
            src={process.env.REACT_APP_API_URL + '/' + item.img}
            style={{ objectFit: "cover", maxHeight: "400px" }}
          />
          <ItemDescription style={{ margin: "5px 20px" }}>
            {item.description}
          </ItemDescription>
        </div>
        <ItemPrice>{item.price} BYN</ItemPrice>
      </ModalBody>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="outline-success" onClick={addToBasket}>
          Добавить в корзину
        </Button>
      </Modal.Footer>
    </StyledModal>
  );
};

export const PatternModal = (props) => <ItemModal {...props} type="pattern" />;
