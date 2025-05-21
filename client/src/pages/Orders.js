import React, { useState, useEffect, useContext } from 'react';
import { Container, Badge, Modal, Table, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { Context } from '../index';

const StyledContainer = styled(Container)`
  padding: 2rem;
  color: white;
`;

const OrderRow = styled.div`
  background: rgba(39, 40, 42, 0.9);
  border: 1px solid #267b54;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &:hover {
    background: rgba(39, 40, 42, 0.95);
    border-color: #2a8f61;
  }
`;

const OrderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const OrderDetailRow = styled.div`
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(38, 123, 84, 0.3);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  &:last-child {
    border-bottom: none;
  }
`;

const OrderDetailLabel = styled.div`
  color: #8a8a8a;
  font-size: 0.9rem;
`;

const OrderDetailValue = styled.div`
  color: white;
  font-size: 1.1rem;
`;

const Orders = () => {
    const { user } = useContext(Context);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/order', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error('Ошибка при загрузке заказов:', error);
            }
        };

        if (user.isAuth) {
            fetchOrders();
        }
    }, [user.isAuth]);

    const getStatusBadge = (status) => {
        let variant;
        switch (status) {
            case 'PENDING':
                variant = 'warning';
                break;
            case 'COMPLETED':
                variant = 'success';
                break;
            case 'CANCELLED':
                variant = 'danger';
                break;
            default:
                variant = 'info';
        }
        return <Badge bg={variant}>{status}</Badge>;
    };

    const getItemsString = (patterns) => {
        return patterns.map(pattern => `${pattern.name} (${pattern.basket_pattern.quantity} шт.)`).join(', ');
    };

    const calculateTotalPrice = (patterns) => {
        return patterns.reduce((sum, pattern) => 
            sum + (Number(pattern.price) * pattern.basket_pattern.quantity), 0);
    };

    const handleOrderClick = (order) => {
        const orderWithTotal = {
            ...order,
            totalPrice: calculateTotalPrice(order.items)
        };
        setSelectedOrder(orderWithTotal);
        setShowOrderModal(true);
    };

    return (
        <StyledContainer>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '2rem',
                borderBottom: '2px solid #267b54',
                paddingBottom: '0.5rem'
            }}>
                <h2 style={{ color: '#fff', margin: 0 }}>Мои заказы</h2>
                {orders.length > 0 && (
                    <Button 
                        variant="outline-danger" 
                        // onClick={clearOrders}
                    >
                        Очистить историю заказов
                    </Button>
                )}
            </div>
            
            {orders.map(order => (
                <OrderRow 
                    key={order.id} 
                    onClick={() => handleOrderClick(order)}
                    style={{ cursor: 'pointer' }}
                >
                    <OrderInfo>
                        <span style={{ minWidth: '100px' }}>#{order.id}</span>
                        <span style={{ minWidth: '120px' }}>{order.date}</span>
                        <span style={{ flex: 1 }}>{getItemsString(order.items)}</span>
                    </OrderInfo>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <span style={{ color: '#ffbf00' }}>
                            {calculateTotalPrice(order.items).toFixed(2)} BYN
                        </span>
                        {getStatusBadge(order.status)}
                    </div>
                </OrderRow>
            ))}

            {/* чек */}
            <Modal
                show={showOrderModal}
                onHide={() => setShowOrderModal(false)}
                centered
                size="lg"
            >
                <Modal.Header closeButton style={{ 
                    background: 'rgba(39, 40, 42, 0.95)', 
                    border: '1px solid #267b54', 
                    color: 'white' 
                }}>
                    <Modal.Title>
                        Детали заказа #{selectedOrder?.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ 
                    background: 'rgba(39, 40, 42, 0.95)', 
                    border: '1px solid #267b54', 
                    color: 'white',
                    padding: '2rem'
                }}>
                    {selectedOrder && (
                        <>
                            <OrderDetailRow>
                                <OrderDetailLabel>Дата заказа</OrderDetailLabel>
                                <OrderDetailValue>{selectedOrder.date}</OrderDetailValue>
                            </OrderDetailRow>

                            <OrderDetailRow>
                                <OrderDetailLabel>Статус заказа</OrderDetailLabel>
                                <OrderDetailValue>{getStatusBadge(selectedOrder.status)}</OrderDetailValue>
                            </OrderDetailRow>

                            <OrderDetailRow>
                                <OrderDetailLabel>Имя покупателя</OrderDetailLabel>
                                <OrderDetailValue>{user?.user?.name || 'Не указано'}</OrderDetailValue>
                            </OrderDetailRow>

                            <OrderDetailRow>
                                <OrderDetailLabel>Телефон</OrderDetailLabel>
                                <OrderDetailValue>{user?.user?.phone || 'Не указан'}</OrderDetailValue>
                            </OrderDetailRow>

                            <OrderDetailRow>
                                <OrderDetailLabel>Email</OrderDetailLabel>
                                <OrderDetailValue>{user?.user?.email || 'Не указан'}</OrderDetailValue>
                            </OrderDetailRow>

                            <OrderDetailRow>
                                <OrderDetailLabel>Номер карты</OrderDetailLabel>
                                <OrderDetailValue>{selectedOrder.cardNumber || 'Не указан'}</OrderDetailValue>
                            </OrderDetailRow>

                            <OrderDetailRow>
                                <OrderDetailLabel>Товары</OrderDetailLabel>
                                {selectedOrder.items.map((item, index) => (
                                    <OrderDetailValue key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{item.name} × {item.quantity}</span>
                                        <span style={{ color: '#ffbf00' }}>{(Number(item.price) * item.quantity).toFixed(2)} BYN</span>
                                    </OrderDetailValue>
                                ))}
                            </OrderDetailRow>

                            <OrderDetailRow>
                                <OrderDetailLabel>Итоговая сумма</OrderDetailLabel>
                                <OrderDetailValue style={{ color: '#ffbf00', fontSize: '1.3rem', fontWeight: 'bold' }}>
                                    {Number(selectedOrder.totalPrice).toFixed(2)} BYN
                                </OrderDetailValue>
                            </OrderDetailRow>

                            <OrderDetailRow style={{ marginTop: '2rem' }}>
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '1rem',
                                    opacity: '0.7',
                                    pointerEvents: 'none'
                                }}>
                                    <input 
                                        type="checkbox" 
                                        checked={true} 
                                        readOnly 
                                    />
                                    <span>Заказ подтвержден и оплачен</span>
                                </div>
                            </OrderDetailRow>
                        </>
                    )}
                </Modal.Body>
            </Modal>

            {orders.length === 0 && (
                <div style={{ 
                    textAlign: 'center',
                    marginTop: '2rem',
                    padding: '2rem',
                    background: 'rgba(39, 40, 42, 0.9)',
                    borderRadius: '10px'
                }}>
                    <h4>У вас пока нет заказов</h4>
                </div>
            )}
        </StyledContainer>
    );
};

export default Orders;