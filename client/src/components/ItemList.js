import React, { useState } from 'react';
import { Col, Card, Image } from "react-bootstrap";
import styled from 'styled-components';

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
`;

const ItemList = ({ items, ItemModal }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

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
                            <ItemPrice>{item.price} BYN</ItemPrice>
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