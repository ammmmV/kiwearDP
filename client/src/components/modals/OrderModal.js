import React from 'react';
import { Modal, Button, Form } from "react-bootstrap";
import InputMask from 'react-input-mask';
import styled from "styled-components";

const StyledModal = styled(Modal)`
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

const OrderModal = ({ 
    show, 
    onHide, 
    orderData, 
    handleOrderInput, 
    handleCreateOrder, 
    formErrors 
}) => {
    return (
        <StyledModal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Оформление заказа</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup>
                    <Form.Label>Номер телефона</Form.Label>
                    <InputMask
                        mask="+7 (999) 999-99-99"
                        className="form-control"
                        name="cardNumber"
                        value={orderData.cardNumber}
                        onChange={handleOrderInput}
                        placeholder="+7 (___) ___-__-__"
                    />
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
                            as="textarea"
                            name="delivery_address"
                            value={orderData.delivery_address}
                            onChange={handleOrderInput}
                            placeholder="Введите адрес доставки"
                        />
                    </FormGroup>
                )}
                <FormGroup>
                    <Form.Label>Примечания к заказу</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="notes"
                        value={orderData.notes}
                        onChange={handleOrderInput}
                        placeholder="Дополнительная информация по заказу"
                    />
                </FormGroup>
                <FormGroup>
                    <Form.Check
                        type="checkbox"
                        name="agreed"
                        checked={orderData.agreed}
                        onChange={handleOrderInput}
                        label="Я согласен с условиями оформления заказа"
                    />
                    {formErrors.agreed && (
                        <div className="text-danger">{formErrors.agreed}</div>
                    )}
                </FormGroup>
                {formErrors.submit && (
                    <div className="text-danger mb-3">{formErrors.submit}</div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Отмена
                </Button>
                <Button variant="primary" onClick={handleCreateOrder}>
                    Оформить заказ
                </Button>
            </Modal.Footer>
        </StyledModal>
    );
};

export default OrderModal;