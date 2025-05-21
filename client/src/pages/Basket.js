import React, { useState, useEffect, useContext } from "react";
import { Container, Button, Modal, Form } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import InputMask from 'react-input-mask';
import styled from "styled-components";
import "../styles/Style.css";

const StyledContainer = styled(Container)`
  padding: 2rem;
  color: white;
`;

const BasketItem = styled.div`
  display: flex;
  background: rgba(39, 40, 42, 0.9);
  border: 1px solid #267b54;
  border-radius: 10px;
  margin-bottom: 1rem;
  width: 100%;
`;

const QuantityControls = styled.div`
    
    .quantity-change {
        transition: all 0.3s ease;
    }
    
    .quantity-increase {
        animation: pulse 0.3s ease;
    }
    
    .quantity-decrease {
        animation: shake 0.3s ease;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    @keyframes shake {
        0% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
        100% { transform: translateX(0); }
    }
`;

const ImageContainer = styled.div`
  flex: 0 0 200px;
  padding: 1rem;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const EmptyBasket = styled.div`
    text-align: center;
    padding: 3rem;
    color: #ccc;
    
    h3 {
        margin-bottom: 1.5rem;
        color: #fff;
    }
    
    .empty-basket-icon {
        font-size: 4rem;
        margin-bottom: 1.5rem;
        color: #267b54;
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
    
    .form-control, .form-select {
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
    
    const { basket, user } = useContext(Context);

    const [orderData, setOrderData] = useState({
        cardNumber: '',
        cardOwner: user?.user?.fullName || '',
        delivery_method: 'courier',
        delivery_address: '',
        notes: '',
        agreed: false
    });

    useEffect(() => {
        const loadBasket = async () => {
            try {
                if (user.isAuth && localStorage.getItem('token')) {
                    await basket.fetchBasket();
                    basket.setCurrentUserEmail(user.user.email);
                } else {
                    basket.setCurrentUserEmail('');
                    basket.loadUserBasket();
                }
            } catch (error) {
                console.error('Ошибка при загрузке корзины:', error);
            }
        };
        
        loadBasket();
    }, [user.isAuth, user.user?.email]);

    const handleOrderInput = (e) => {
        const { name, value, type, checked } = e.target;
        setOrderData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const removeFromBasket = (id) => {
        basket.removeFromBasket(id);
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        basket.updateQuantity(id, newQuantity);
    };

    const [formErrors, setFormErrors] = useState({
        cardNumber: '',
        expiry: '',
        cardHolder: '',
        agreed: ''
    });

    const handleOrder = () => {
        if (!user.isAuth) {
            alert("Необходимо войти в аккаунт, чтобы оформить заказ");
            return;
        }
    
        setFormErrors({
            cardNumber: '',
            expiry: '',
            cardHolder: '',
            agreed: ''
        });
    
        setShowConfirmModal(true);
    };
    

    const confirmOrder = async () => {
        if (!orderData.cardNumber || !orderData.cardOwner || 
            (orderData.delivery_method === 'courier' && !orderData.delivery_address) || 
            !orderData.agreed) {
            setFormErrors({
                cardNumber: !orderData.cardNumber ? 'Введите номер карты' : '',
                cardOwner: !orderData.cardOwner ? 'Введите имя держателя карты' : '',
                delivery_address: orderData.delivery_method === 'courier' && !orderData.delivery_address ? 'Введите адрес доставки' : '',
                agreed: !orderData.agreed ? 'Необходимо согласие с условиями' : ''
            });
            return;
        }

        try {
            const orderPayload = {
                shipping_address: orderData.delivery_address,
                delivery_method: orderData.delivery_method,
                contact_phone: user.user.phone,
                notes: orderData.notes,
                patterns: basket.basket.map(item => ({
                    id: item.patternId || item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            const response = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(orderPayload)
            });

            if (!response.ok) {
                throw new Error('Ошибка при создании заказа');
            }

            const data = await response.json();
            basket.clearBasket();
            setShowConfirmModal(false);
            setShowSuccessModal(true);

            setTimeout(() => {
                setShowSuccessModal(false);
                window.location.href = '/orders';
            }, 2000);

        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
            alert('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте позже.');
        }
    };

    
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        expiry: '',
        cardHolder: '',
        agreed: false
    });

    const handlePaymentInput = (e) => {
        const { name, value, type, checked } = e.target;
        setPaymentData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const isFormValid = () => {
        return paymentData.cardNumber.replace(/\D/g, '').length === 16 &&
               paymentData.expiry.replace(/\D/g, '').length === 4 &&
               paymentData.cardHolder.length > 3 &&
               paymentData.agreed;
    };

    return (
        <StyledContainer>
            {basket.loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <span>Загрузка корзины...</span>
                </div>
            ) : basket.basket && basket.basket.length > 0 ? (
                <>
                    {basket.basket.map((item) => (
                        <BasketItem key={item.id || `${item.patternId}-${item.typeId}-${item.fabricId}`}>
                            <ImageContainer>
                                <img
                                    src={process.env.REACT_APP_API_URL + item.img}
                                    alt={item.name}
                                    style={{ width: '90%', height: '90%', objectFit: 'cover' }}
                                />
                            </ImageContainer>
                            <ContentContainer>
                                <div>
                                    <h4>{item.name}</h4>
                                    <p style={{ color: '#8a8a8a' }}>Цена: {item.price} BYN</p>
                                    <p style={{ 
                                        color: '#a0a0a0',
                                        fontSize: '0.9rem',
                                        marginTop: '0.5rem',
                                        maxWidth: '80%'
                                    }}>
                                        {item.description}
                                    </p>
                                </div>
                                <QuantityControls>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <Button 
                                            variant="outline-light"
                                            style={{ 
                                                borderRadius: '50%',
                                                width: '30px',
                                                height: '30px',
                                                padding: '0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            size="sm"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            -
                                        </Button>
                                        <span>{item.quantity}</span>
                                        <Button 
                                            variant="outline-light"
                                            style={{ 
                                                borderRadius: '50%',
                                                width: '30px',
                                                height: '30px',
                                                padding: '0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            size="sm"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </Button>
                                        <Button 
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => removeFromBasket(item.id)}
                                            style={{ marginLeft: '1rem' }}
                                        >
                                            Удалить
                                        </Button>
                                    </div>
                                    <div style={{ marginTop: '0.5rem', color: '#267b54', fontWeight: 'bold' }}>
                                        Итого: {Number(item.price * item.quantity).toFixed(2)} BYN
                                    </div>
                                </QuantityControls>
                            </ContentContainer>
                        </BasketItem>
                    ))}
                    <div style={{ 
                        marginTop: '2rem', 
                        textAlign: 'right',
                        borderTop: '1px solid #267b54',
                        paddingTop: '1rem'
                    }}>
                        <Button 
                            variant="success" 
                            size="lg"
                            onClick={handleOrder}
                            style={{ marginTop: '1rem' }}
                        >
                            К оформлению: {Number(basket.totalPrice).toFixed(2)} BYN
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
            <OrderModal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: 'white' }}>Оформление заказа</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup>
                        <Form.Label>Номер карты</Form.Label>
                        <InputMask
                            mask="9999 9999 9999 9999"
                            value={orderData.cardNumber}
                            onChange={handleOrderInput}
                            name="cardNumber"
                        >
                            {(inputProps) => (
                                <Form.Control
                                    {...inputProps}
                                    type="text"
                                    placeholder="XXXX XXXX XXXX XXXX"
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
                            type="text"
                            name="cardOwner"
                            value={orderData.cardOwner}
                            onChange={handleOrderInput}
                            placeholder="IVAN IVANOV"
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

                    {orderData.delivery_method === 'courier' && (
                        <FormGroup>
                            <Form.Label>Адрес доставки</Form.Label>
                            <Form.Control
                                type="text"
                                name="delivery_address"
                                value={orderData.delivery_address}
                                onChange={handleOrderInput}
                                placeholder="Введите адрес доставки"
                            />
                        </FormGroup>
                    )}

                    <FormGroup>
                        <Form.Label>Дополнительные примечания</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="notes"
                            value={orderData.notes}
                            onChange={handleOrderInput}
                            placeholder="Комментарий к заказу"
                            rows={3}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Form.Check
                            type="checkbox"
                            name="agreed"
                            checked={orderData.agreed}
                            onChange={handleOrderInput}
                            label="Я согласен с обработкой персональных данных"
                            isInvalid={!!formErrors.agreed}
                        />
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-danger" onClick={() => setShowConfirmModal(false)}>
                        Отмена
                    </Button>
                    <Button 
                        variant="outline-success" 
                        onClick={confirmOrder}
                        disabled={!orderData.agreed}
                    >
                        Подтвердить заказ
                    </Button>
                </Modal.Footer>
            </OrderModal>

            <Modal show={showSuccessModal} centered>
                <Modal.Body className="text-center" style={{ background: 'rgba(39, 40, 42, 0.95)', color: 'white' }}>
                    <h4>Заказ успешно оформлен!</h4>
                    <p>Вы будете перенаправлены в раздел заказов...</p>
                </Modal.Body>
            </Modal>
        </StyledContainer>
    );
});

export default Basket;
