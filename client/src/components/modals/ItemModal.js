import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../index";
import { Modal, Button, Image } from "react-bootstrap";
import styled from "styled-components";
import { fetchPatternReviews } from "../../http/reviewAPI";

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

const ReviewsSection = styled.div`
  margin-top: 20px;
  border-top: 1px solid #267b54;
  padding-top: 15px;
`;

const ReviewItem = styled.div`
  background: rgba(39, 40, 42, 0.7);
  border: 1px solid #444;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const ReviewRating = styled.div`
  color: #267b54;
  font-weight: bold;
`;

const ReviewDate = styled.div`
  color: #aaa;
  font-size: 0.9em;
`;

const ReviewComment = styled.div`
  color: #f7f7f7;
`;

const ItemModal = ({ show, onHide, item, type }) => {
  const { basket, user } = useContext(Context);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (user.currentUser?.email) {
      basket.setUser(user.currentUser.email);
    }
  }, [user.currentUser?.email, basket]);

  useEffect(() => {
    if (show && item?.id) {
      fetchPatternReviews(item.id)
        .then(data => {
          setReviews(data);
        })
        .catch(error => {
          console.error("Ошибка при загрузке отзывов:", error);
        });
    }
  }, [show, item]);

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

        {reviews.length > 0 && (
          <ReviewsSection>
            <h5 style={{ color: "#f7f7f7", marginBottom: "15px" }}>Отзывы</h5>
            {reviews.map((review, index) => (
              <ReviewItem key={index}>
                <ReviewHeader>
                  <ReviewRating>Оценка: {review.rating}/5</ReviewRating>
                  <ReviewDate>
                    {new Date(review.date).toLocaleDateString()}
                  </ReviewDate>
                </ReviewHeader>
                <ReviewComment>{review.comment}</ReviewComment>
              </ReviewItem>
            ))}
          </ReviewsSection>
        )}
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
