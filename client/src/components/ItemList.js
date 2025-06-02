import React, { useState, useEffect } from 'react';
import { Col, Card, Image } from "react-bootstrap";
import styled from 'styled-components';
import bigStar from '../assets/star-svg.svg'

const StyledCard = styled(Card)`
    width: 220px;
    transition: transform 0.3s ease;
    background: rgba(39, 40, 42, 0.8);
    border: 1px solid #267b54;
    margin: 15px;
    cursor: pointer;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px #267b54;
    }
`;

const ItemName = styled.div`
    color: #ffffff;
    font-size: 1.1em;
    margin: 0;
`;

const ItemPrice = styled.div`
    color: #267b54;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const StarRating = styled.div`
    display: flex;
    align-items: center;
`;

const StarContainer = styled.div`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 15px;
    height: 15px;
    margin-right: 2px;
    background: url(${bigStar}) no-repeat center center;
    background-size: contain;
    color: #ffffff;
    font-size: 8px;
    font-weight: bold;
`;

const CardRating = styled.div`
    display: flex;
    align-items: center;
    color: #ffffff; /* Цвет текста для рейтинга */
    font-size: 0.9em;
    margin-top: 5px;
    margin-bottom: 5px;

    span {
        font-weight: bold;
        color: #267b54; /* Ваш акцентный зеленый для цифры рейтинга */
        margin-left: 5px;
    }

    img {
        width: 18px; /* Размер звезды */
        height: 18px;
        margin-left: 5px;
        filter: brightness(1.2) saturate(1.5);
    }
`;

// Новый стилизованный компонент для краткого описания в карточке
const CardDescription = styled.div`
    color: #cccccc; /* Более светлый цвет для описания */
    font-size: 0.85em;
    margin-bottom: 10px;
    max-height: 2.8em; /* Примерно 2 строки, регулируйте line-height */
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1; /* Ограничение до 2 строк */
    -webkit-box-orient: vertical;
    line-height: 1.4; /* Установите желаемый line-height */
`;

const ItemList = ({ items, ItemModal }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemRatings, setItemRatings] = useState({});

    useEffect(() => {
        // Загрузка рейтингов для всех товаров
        const loadRatings = async () => {
            const ratings = {};
            for (const item of items || []) {
                try {
                    const reviews = await fetchPatternReviews(item.id);
                    if (reviews.length > 0) {
                        // Вычисляем средний рейтинг
                        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
                        ratings[item.id] = Math.round(totalRating / reviews.length);
                    } else {
                        ratings[item.id] = 0;
                    }
                } catch (error) {
                    console.error(`Ошибка при загрузке отзывов для товара ${item.id}:`, error);
                    ratings[item.id] = 0;
                }
            }
            setItemRatings(ratings);
        };

        if (items && items.length > 0) {
            loadRatings();
        }
    }, [items]);

    const handleClick = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    return (
        <>
            {items?.map(item =>
                <Col md={3} key={item.id} style={{ marginBottom: '20px' }}>
                    <StyledCard onClick={() => handleClick(item)}>
                        <Image
                            width={220}
                            height={220}
                            src={process.env.REACT_APP_API_URL + '/' + item.img}
                            style={{
                                objectFit: 'cover',
                                borderRadius: 'var(--bs-card-border-radius)'
                            }}
                        />
                        <Card.Body>
                            <ItemName>{item.name}</ItemName>
                            
                            {item.description  ? (
                                <CardDescription>
                                    {item.description}
                                </CardDescription>
                            ) : (
                                <CardDescription>
                                    Нет описания
                                </CardDescription>
                            )}
                        
                            <ItemPrice>{item.price} BYN</ItemPrice>
                            {item.averageRating !== undefined && item.averageRating > 0 ? (
                                <CardRating>
                                    Рейтинг: <span>{item.averageRating.toFixed(1)}</span>
                                    <img src={bigStar} alt="star" />
                                </CardRating>
                            ) : (
                                <CardRating style={{ color: '#aaa', fontStyle: 'italic' }}>
                                    Нет отзывов
                                </CardRating>
                            )}
                        </Card.Body>
                    </StyledCard>
                </Col>
            )}

            {ItemModal && selectedItem && (
                <ItemModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    item={selectedItem}
                />
            )}
        </>
    );
};

export default ItemList;