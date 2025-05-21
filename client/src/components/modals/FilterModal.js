import React, { useContext, useEffect, useState } from 'react';
import { Container, Button, Modal, Form } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import { fetchPatterns, fetchFabrics, fetchTypes } from "../../http/patternAPI";
import styled from 'styled-components';

const FilterModal = observer(({ 
    show, 
    onHide, 
    priceRange, 
    setPriceRange, 
    selectedFabric, 
    setSelectedFabric, 
    selectedType, 
    setSelectedType,
    onFilter,
    onReset,
    fabrics,
    types
}) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton style={{ background: 'rgba(39, 40, 42, 0.95)', border: '1px solid #267b54', color: 'white' }}>
                <Modal.Title>Фильтры</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ background: 'rgba(39, 40, 42, 0.95)', border: '1px solid #267b54', color: 'white' }}>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Диапазон цены</Form.Label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Form.Control
                                type="number"
                                placeholder="От"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                            />
                            <Form.Control
                                type="number"
                                placeholder="До"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group style={{marginBottom: "3px"}}>
                        <Form.Label>Ткань</Form.Label>
                        <Form.Select 
                            value={selectedFabric}
                            onChange={(e) => setSelectedFabric(e.target.value)}
                        >
                            <option value="">Все ткани</option>
                            {fabrics.map(fabric => (
                                <option key={fabric.id} value={fabric.id}>
                                    {fabric.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group style={{marginBottom: "3px"}}>
                        <Form.Label>Фурнитура</Form.Label>
                        <Form.Select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <option value="">Вся фурнитура</option>
                            {types.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer style={{ background: 'rgba(39, 40, 42, 0.95)', border: '1px solid #267b54' }}>
                <Button variant="secondary" onClick={onReset}>
                    Сбросить
                </Button>
                <Button variant="success" onClick={onFilter}>
                    Применить
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default FilterModal;