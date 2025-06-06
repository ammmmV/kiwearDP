import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../index";
import { Modal, Button, Image } from "react-bootstrap";
import styled from "styled-components";
import { fetchPatternReviews } from "../../http/reviewAPI";
import { toast } from "react-custom-alert";
import { fetchHeaderData } from "../../http/userAPI";
import bigStar from "../../assets/bigStar.png";

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
  margin: 0.5rem 0;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  margin-bottom: 10px;
`;

const ImageContainer = styled.div`
  flex: 0 0 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InfoContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TabContent = styled.div`
  border: 1px solid #444;
  border-radius: 8px;
  padding: 15px;
  background: rgba(39, 40, 42, 0.7);
  height: 300px;
  overflow-y: auto;
  margin-bottom: 15px;
  
  /* Стили для скроллбара */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(39, 40, 42, 0.5);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #267b54;
    border-radius: 4px;
  }
`;

const ItemDescription = styled.div`
  margin-bottom: 10px;
`;

const ReviewsSection = styled.div``;

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
  display: flex;
  align-items: center;
  color: #267b54;
  font-weight: bold;
`;

const StarRating = styled.div`
  display: flex;
  align-items: center;
  margin-left: 5px;
`;

const StarContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 2px;
  background: url(${bigStar}) no-repeat center center;
  background-size: contain;
  color: #ffffff;
  font-size: 10px;
  font-weight: bold;
`;

const ReviewDate = styled.div`
  color: #aaa;
  font-size: 0.9em;
`;

const ReviewComment = styled.div`
  color: #f7f7f7;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const Tab = styled.div`
  margin-right: 20px;
  cursor: pointer;
  color: ${props => props.active ? '#267b54' : '#ffffff'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  padding-bottom: 5px;
  border-bottom: ${props => props.active ? '2px solid #267b54' : 'none'};
`;

// Стилизованный компонент для отображения среднего рейтинга в футере
const FooterRating = styled.div`
    display: flex;
    align-items: center;
    color: #ffffff;
    font-size: 1.1em; /* Чуть меньше, чем цена, но хорошо видно */
    
    span {
        font-weight: bold;
        color: #aaaaaa;
        margin-left: 5px;
    }

    img {
        width: 20px;
        height: 20px;
        margin-left: 5px;
        filter: brightness(1.2) saturate(1.5);
    }
`;

// Стилизованный контейнер для кнопок
const ButtonContainer = styled.div`
    display: flex;
    gap: 10px; /* Отступ между кнопками */
`;

const PriceAndRatingContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 15px; /* Отступ между ценой и рейтингом */
`;

const ItemModal = ({ show, onHide, item, type }) => {
  const { basket, user } = useContext(Context);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('description');

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
          toast.error("Ошибка при загрузке отзывов");
        });
    }
  }, [show, item]);

  const addToBasket = async () => {
    try {
      if (!user.isAuth) {
        toast.error("Авторизуйтесь чтобы продолжить");
        return;
      }

      await basket.addToBasket({
        patternId: item.id
      });
      onHide();
      toast.success("Добавлено в корзину")
      const headerData = await fetchHeaderData();
      if (headerData) {
        user.setBasketCount(headerData.basketCount);
      } else {
        toast.warn("Не удалось получить данные для шапки, сбрасываю счетчик корзины.");
        user.setBasketCount(0);
      }
    } catch (error) {
      console.error("Ошибка при добавлении в корзину:", error);
      toast.error("Произошла ошибка при добавлении товара в корзину");
    }
  };

  return (
    <StyledModal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <ModalTitle>{item.name}</ModalTitle>
      </Modal.Header>
      <ModalBody className="custom-scroll">
        <ContentContainer>
          <ImageContainer>
            <Image
              width="100%"
              src={process.env.REACT_APP_API_URL + '/' + item.img}
              style={{ objectFit: "cover", maxHeight: "400px", marginTop: "45px" }}
            />
          </ImageContainer>

          <InfoContainer>
            <TabContainer>
              <Tab
                active={activeTab === 'description'}
                onClick={() => setActiveTab('description')}
              >
                Описание
              </Tab>
              <Tab
                active={activeTab === 'reviews'}
                onClick={() => setActiveTab('reviews')}
              >
                Отзывы
              </Tab>
            </TabContainer>

            <TabContent>
              {activeTab === 'description' && (
                <ItemDescription>
                  {item.description}
                </ItemDescription>
              )}

              {activeTab === 'reviews' && (
                <ReviewsSection>
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <ReviewItem key={index}>
                        <ReviewHeader>
                          <ReviewRating>
                            {/* Оценка: {review.rating} */}
                            <StarRating>
                              {[...Array(review.rating)].map((_, i) => (
                                <StarContainer key={i}>★</StarContainer>
                              ))}
                            </StarRating>
                          </ReviewRating>
                          <ReviewDate>
                            {new Date(review.date).toLocaleDateString()}
                          </ReviewDate>
                        </ReviewHeader>
                        <ReviewComment>{review.comment}</ReviewComment>
                      </ReviewItem>
                    ))
                  ) : (
                    <div>Отзывов пока нет</div>
                  )}
                </ReviewsSection>
              )}
            </TabContent>
          </InfoContainer>
        </ContentContainer>
      </ModalBody>
      <Modal.Footer style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <PriceAndRatingContainer>
          <ItemPrice>{item.price} BYN</ItemPrice>
          {item.averageRating !== undefined && item.averageRating > 0 && (
            <FooterRating>
              <span>{item.averageRating.toFixed(1)}</span>
              <img src={bigStar} alt="star" />
            </FooterRating>
          )}
        </PriceAndRatingContainer>
        <ButtonContainer>
          <Button variant="outline-danger" onClick={onHide}>
            Закрыть
          </Button>
          <Button variant="outline-success" onClick={addToBasket}>
            Добавить в корзину
          </Button>
        </ButtonContainer>
      </Modal.Footer>
    </StyledModal>
  );
};

export const PatternModal = (props) => <ItemModal {...props} type="pattern" />;
