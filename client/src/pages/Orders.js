import React, { useState, useEffect, useContext } from "react";
import { Container, Badge, Modal, Table, Button } from "react-bootstrap";
import styled from "styled-components";
import { Context } from "../index";

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
  const { user, order } = useContext(Context); 
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        await order.fetchOrders();
        setOrders(order.orders);
      } catch (error) {
        console.error("Ошибка при загрузке заказов:", error);
      }
    };

    if (user.isAuth && user.user?.email) {
      loadOrders();
    }
  }, [user.isAuth, user.user?.email, order]);


  const getStatusBadge = (status) => {
    let variant;
    switch (status) {
      case "PENDING":
        variant = "warning";
        break;
      case "PROCESSING":
        variant = "primary";
        break;
      case "COMPLETED":
        variant = "success";
        break;
      case "CANCELLED":
        variant = "danger";
        break;
      default:
        variant = "info";
    }
    return <Badge bg={variant}>{status}</Badge>;
  };

  const getItemsString = (patterns) => {
    if (!patterns || !Array.isArray(patterns)) return '';
    return patterns
      .map(
        (pattern) => {
          if (!pattern || !pattern.name) return '';
          const quantity = pattern.order_item?.quantity || 0;
          return `${pattern.name} (${quantity} шт.)`;
        }
      )
      .filter(str => str !== '')
      .join(", ");
  };

  const calculateTotalPrice = (patterns) => {
    if (!patterns || !Array.isArray(patterns)) return 0;
    return patterns.reduce(
      (sum, pattern) => {
        if (!pattern || !pattern.price) return sum;
        const quantity = pattern.order_item?.quantity || 0;
        return sum + Number(pattern.price) * quantity;
      },
      0
    );
  };

  const handleOrderClick = (order) => {
    const orderWithTotal = {
      ...order,
      totalPrice: calculateTotalPrice(order.patterns),
    };
    setSelectedOrder(orderWithTotal);
    setShowOrderModal(true);
  };

  const handleReviewSubmit = (e, patternId) => {
    e.preventDefault();
    const form = e.target;
    const rating = form.rating.value;
    const comment = form.comment.value;
  };

  return (
    <StyledContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          borderBottom: "2px solid #267b54",
          paddingBottom: "0.5rem",
        }}
      >
        <h2 style={{ color: "#fff", margin: 0 }}>Мои заказы</h2>
      </div>

      {orders.map((order) => (
        <OrderRow
          key={order.id}
          onClick={() => handleOrderClick(order)}
          style={{ cursor: "pointer" }}
        >
          <OrderInfo>
            <span style={{ minWidth: "100px" }}>Заказ #{order.id}</span>
            <span style={{ minWidth: "120px" }}>{order.order_date}</span>
            <span style={{ flex: 1 }}>{getItemsString(order.patterns)}</span>
          </OrderInfo>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <span style={{ color: "#ffbf00" }}>
              {Number(order.total_price).toFixed(2)} BYN
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
        <Modal.Header
          closeButton
          style={{
            background: "rgba(39, 40, 42, 0.95)",
            border: "1px solid #267b54",
            color: "white",
          }}
        >
          <Modal.Title>Детали заказа #{selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            background: "rgba(39, 40, 42, 0.95)",
            border: "1px solid #267b54",
            color: "white",
            padding: "2rem",
          }}
        >
          {selectedOrder && (
            <>
              <OrderDetailRow>
                <OrderDetailLabel>Дата заказа</OrderDetailLabel>
                <OrderDetailValue>{selectedOrder.order_date}</OrderDetailValue>
              </OrderDetailRow>

              <OrderDetailRow>
                <OrderDetailLabel>Номер заказа</OrderDetailLabel>
                <OrderDetailValue>{selectedOrder.order_number}</OrderDetailValue>
              </OrderDetailRow>

              <OrderDetailRow>
                <OrderDetailLabel>Статус заказа</OrderDetailLabel>
                <OrderDetailValue>
                  {getStatusBadge(selectedOrder.status)}
                </OrderDetailValue>
              </OrderDetailRow>

              <OrderDetailRow>
                <OrderDetailLabel>Имя покупателя</OrderDetailLabel>
                <OrderDetailValue>
                  {user?.user?.name || "Не указано"}
                </OrderDetailValue>
              </OrderDetailRow>

              <OrderDetailRow>
                <OrderDetailLabel>Телефон</OrderDetailLabel>
                <OrderDetailValue>
                  {user?.user?.phone || "Не указан"}
                </OrderDetailValue>
              </OrderDetailRow>

              <OrderDetailRow>
                <OrderDetailLabel>Email</OrderDetailLabel>
                <OrderDetailValue>
                  {user?.user?.email || "Не указан"}
                </OrderDetailValue>
              </OrderDetailRow>

              <OrderDetailRow>
                <OrderDetailLabel>Номер карты</OrderDetailLabel>
                <OrderDetailValue>
                  {selectedOrder.cardNumber || "Не указан"}
                </OrderDetailValue>
              </OrderDetailRow>

              <OrderDetailRow>
                <OrderDetailLabel>Товары</OrderDetailLabel>
                {selectedOrder?.patterns?.map((pattern, index) => (
                  <div key={index} style={{ width: '100%' }}>
                    <OrderDetailValue style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{pattern.name} × {pattern.order_item?.quantity}</span>
                      <span style={{ color: '#ffbf00' }}>{Number(pattern.price).toFixed(2)} BYN</span>
                    </OrderDetailValue>
                  </div>
                ))}
              </OrderDetailRow>

              <OrderDetailRow>
                <OrderDetailLabel>Адрес доставки</OrderDetailLabel>
                <OrderDetailValue>
                  {selectedOrder.delivery_address || "Не указан"}
                </OrderDetailValue>
              </OrderDetailRow>

              <OrderDetailRow>
                <OrderDetailLabel>Способ доставки</OrderDetailLabel>
                <OrderDetailValue>
                  {selectedOrder.delivery_method || "Не указан"}
                </OrderDetailValue>
              </OrderDetailRow>

              <OrderDetailRow>
                <OrderDetailLabel>Примечания</OrderDetailLabel>
                <OrderDetailValue>
                  {selectedOrder.notes || "Нет примечаний"}
                </OrderDetailValue>
              </OrderDetailRow>

              <OrderDetailRow>
                <OrderDetailLabel>Итоговая сумма</OrderDetailLabel>
                <OrderDetailValue
                  style={{
                    color: "#ffbf00",
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                  }}
                >
                  {Number(selectedOrder.total_price).toFixed(2)} BYN
                </OrderDetailValue>
              </OrderDetailRow>

              <OrderDetailRow style={{ marginTop: "2rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    opacity: "0.7",
                    pointerEvents: "none",
                  }}
                >
                  <input type="checkbox" checked={true} readOnly />
                  <span>Заказ подтвержден и оплачен</span>
                </div>
              </OrderDetailRow>
            </>
          )}
        </Modal.Body>
      </Modal>

      {orders.length === 0 && (
        <div
          style={{
            textAlign: "center",
            marginTop: "2rem",
            padding: "2rem",
            background: "rgba(39, 40, 42, 0.9)",
            borderRadius: "10px",
          }}
        >
          <h4>У вас пока нет заказов</h4>
        </div>
      )}
    </StyledContainer>
  );
};

export default Orders;
