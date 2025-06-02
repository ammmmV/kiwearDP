import React, { useState, useEffect } from 'react';
import { Col, Card, Image } from "react-bootstrap";
import styled from 'styled-components';
import bigStar from '../assets/bigStar.png';
import { fetchPatternReviews } from "../http/reviewAPI";

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
                <Col md={3} key={item.id}>
                    <StyledCard onClick={() => handleClick(item)}>
                        <Image 
                            width={220} 
                            height={220} 
                            src={process.env.REACT_APP_API_URL + '/' + item.img}
                            style={{ objectFit: 'cover' }}
                        />
                        <Card.Body>
                            <ItemName>{item.name}</ItemName>
                            <ItemPrice>
                                {item.price} BYN
                                {itemRatings[item.id] > 0 && (
                                    <StarRating>
                                        {[...Array(itemRatings[item.id])].map((_, i) => (
                                            <StarContainer key={i}>★</StarContainer>
                                        ))}
                                    </StarRating>
                                )}
                            </ItemPrice>
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