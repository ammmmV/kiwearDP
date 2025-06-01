import React, { useEffect, useState } from "react";
import { Container, Table, Dropdown, Form, Row, Col, Button } from "react-bootstrap";
import { $authHost } from "../http";
import styled from "styled-components";
import { toast } from "react-custom-alert";

const StyledContainer = styled(Container)`
  padding: 2rem;
  color: white;
`;


const StyledDropdownToggle = styled(Dropdown.Toggle)`
  background-color: rgba(39, 40, 42, 0.95) !important;
  color: white !important;
  border-color: #267b54 !important;
  width: 100%;
  text-align: left;
  
  &:hover, &:focus, &:active {
    background-color: #267b54 !important;
    border-color: #267b54 !important;
    color: white !important;
  }
`;

const StyledDropdownItem = styled(Dropdown.Item)`
  background-color: rgba(39, 40, 42, 0.95) !important;
  color: white !important;
  
  &:hover, &:focus, &:active {
    background-color: #267b54 !important;
    color: white !important;
  }
`;


const StyledSelect = styled(Form.Select)`
  background-color: rgba(39, 40, 42, 0.95) !important;
  color: white !important;
  border-color: #267b54 !important;
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  
  &:focus {
    border-color: #267b54 !important;
    box-shadow: 0 0 0 0.2rem rgba(38, 123, 84, 0.25) !important;
    background-color: rgba(39, 40, 42, 0.95) !important;
  }

  &:hover {
    background-color: #267b54 !important;
    border-color: #267b54 !important;
    cursor: pointer;
  }

  & option {
    background-color: rgba(39, 40, 42, 0.95) !important;
    color: white !important;

    &:hover, &:focus, &:active, &:checked {
      background-color: #267b54 !important;
      color: white !important;
    }
  }

  &::-ms-expand {
    display: none;
  }
`;

const StyledFormLabel = styled(Form.Label)`
  color: white;
  &:after {
    content: " ";
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #267b54;
    border-radius: 50%;
    margin-left: 8px;
  }
`;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter]);

  const fetchOrders = async () => {
    try {
      const { data } = await $authHost.get("api/order/admin/all");
      setOrders(data);
    } catch (e) {
      console.error("Ошибка при получении заказов:", e);
      toast.error("Ошибка при получении заказов");
    }
  };

  const filterOrders = () => {
    if (statusFilter === 'ALL') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => order.status === statusFilter);
      setFilteredOrders(filtered);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await $authHost.put(`api/order/admin/status/${orderId}`, {
        status: newStatus,
      });
      fetchOrders();
    } catch (e) {
      console.error("Ошибка при обновлении статуса:", e);
      toast.error("Ошибка при обновлении статуса");
    }
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm("Вы действительно хотите удалить этот заказ?")) {
      try {
        await $authHost.delete(`api/order/admin/${orderId}`);
        fetchOrders();
      } catch (e) {
        console.error("Ошибка при удалении заказа:", e);
        toast.error("Ошибка при удалении заказа");
      }
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "PROCESSING":
        return "primary";
      case "COMPLETED":
        return "success";
      case "CANCELLED":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <StyledContainer>
      <h2 style={{ marginBottom: '2rem' }}>Управление заказами</h2>
      
      <Row style={{marginBottom: "4px"}}>
        <Col md={4}>
          <Form.Group>
            <StyledFormLabel>Фильтр по статусу</StyledFormLabel>
            <StyledSelect 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Все заказы</option>
              <option value="PENDING">В обработке</option>
              <option value="PROCESSING">Выполняется</option>
              <option value="COMPLETED">Завершён</option>
              <option value="CANCELLED">Отменён</option>
            </StyledSelect>
          </Form.Group>
        </Col>
      </Row>

      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>№ Заказа</th>
            <th>Дата</th>
            <th>Клиент</th>
            <th>Сумма</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.order_number}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>{order.user_id}</td>
              <td>{Number(order.total_price).toFixed(2)} BYN</td>
              <td>
                <span style={{
                  padding: '0.35em 0.65em',
                  fontSize: '0.75em',
                  fontWeight: '700',
                  lineHeight: '1',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  verticalAlign: 'baseline',
                  borderRadius: '0.25rem',
                  backgroundColor: `var(--bs-${getStatusVariant(order.status)})`,
                  color: '#fff'
                }}>
                  {order.status}
                </span>
              </td>
              <td style={{ display: 'flex', gap: '0.5rem' }}>
                <Dropdown>
                  <Dropdown.Toggle 
                    style={{ 
                      backgroundColor: 'transparent',
                      borderColor: '#f8f9fa',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    Изменить статус
                  </Dropdown.Toggle>
                  <Dropdown.Menu variant="dark">
                    <Dropdown.Item onClick={() => updateOrderStatus(order.id, "PENDING")}>
                      В обработке
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => updateOrderStatus(order.id, "PROCESSING")}>
                      Выполняется
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => updateOrderStatus(order.id, "COMPLETED")}>
                      Завершён
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => updateOrderStatus(order.id, "CANCELLED")}>
                      Отменён
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Button 
                  onClick={() => deleteOrder(order.id)}
                  style={{ 
                    backgroundColor: 'transparent',
                    borderColor: '#dc3545',
                    color: '#dc3545',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  Удалить
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </StyledContainer>
  );
};

export default AdminOrders;
