import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Table, Modal, Row, Col } from 'react-bootstrap';
import { fetchCalculators, createCalculator, updateCalculator, deleteCalculator } from '../http/fabricCalculatorAPI';
import { fetchFabrics } from '../http/patternAPI';
import '../styles/Style.css';

const FabricCalculatorAdmin = () => {
    const [calculators, setCalculators] = useState([]);
    const [fabrics, setFabrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        clothing_type: '',
        fabric_id: '',
        height_min: '',
        height_max: '',
        size_min: '',
        size_max: '',
        base_consumption: '',
        height_factor: '0',
        size_factor: '0'
    });

    // Типы одежды
    const clothingTypes = [
        'Футболка',
        'Кофта',
        'Лонгслив',
        'Худи',
        'Платье',
        'Брюки',
        'Юбка',
        'Шорты'
    ];

    useEffect(() => {
        fetchCalculators().then(data => {
            setCalculators(data);
            fetchFabrics().then(fabricData => {
                setFabrics(fabricData);
                setLoading(false);
            });
        });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        try {
            if (editMode) {
                await updateCalculator(currentId, formData);
            } else {
                await createCalculator(formData);
            }
            
            // Обновляем список после добавления/редактирования
            const data = await fetchCalculators();
            setCalculators(data);
            
            // Закрываем модальное окно и сбрасываем форму
            handleCloseModal();
        } catch (error) {
            console.error('Ошибка при сохранении данных:', error);
            alert('Произошла ошибка при сохранении данных');
        }
    };

    const handleEdit = (calculator) => {
        setEditMode(true);
        setCurrentId(calculator.id);
        setFormData({
            clothing_type: calculator.clothing_type,
            fabric_id: calculator.fabric_id,
            height_min: calculator.height_min,
            height_max: calculator.height_max,
            size_min: calculator.size_min,
            size_max: calculator.size_max,
            base_consumption: calculator.base_consumption,
            height_factor: calculator.height_factor || '0',
            size_factor: calculator.size_factor || '0'
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
            try {
                await deleteCalculator(id);
                // Обновляем список после удаления
                const data = await fetchCalculators();
                setCalculators(data);
            } catch (error) {
                console.error('Ошибка при удалении записи:', error);
                alert('Произошла ошибка при удалении записи');
            }
        }
    };

    const handleShowModal = () => {
        setEditMode(false);
        setFormData({
            clothing_type: '',
            fabric_id: '',
            height_min: '',
            height_max: '',
            size_min: '',
            size_max: '',
            base_consumption: '',
            height_factor: '0',
            size_factor: '0'
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditMode(false);
        setCurrentId(null);
    };

    const getFabricName = (fabricId) => {
        const fabric = fabrics.find(f => f.id === fabricId);
        return fabric ? fabric.name : 'Неизвестно';
    };

    if (loading) {
        return <Container className="d-flex justify-content-center align-items-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Загрузка...</span>
            </div>
        </Container>;
    }

    return (
        <Container className="mt-4 mb-4">
            <h2 className="text-center mb-4">Управление калькулятором расхода ткани</h2>
            
            <Button 
                variant="primary" 
                className="mb-4" 
                onClick={handleShowModal}
            >
                Добавить новую запись
            </Button>
            
            <Card className="shadow-sm">
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Тип одежды</th>
                            <th>Ткань</th>
                            <th>Рост (мин-макс)</th>
                            <th>Размер (мин-макс)</th>
                            <th>Базовый расход</th>
                            <th>Коэф. роста</th>
                            <th>Коэф. размера</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {calculators.map(calculator => (
                            <tr key={calculator.id}>
                                <td>{calculator.id}</td>
                                <td>{calculator.clothing_type}</td>
                                <td>{getFabricName(calculator.fabric_id)}</td>
                                <td>{calculator.height_min} - {calculator.height_max}</td>
                                <td>{calculator.size_min} - {calculator.size_max}</td>
                                <td>{calculator.base_consumption}</td>
                                <td>{calculator.height_factor}</td>
                                <td>{calculator.size_factor}</td>
                                <td>
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm" 
                                        className="me-2"
                                        onClick={() => handleEdit(calculator)}
                                    >
                                        Редактировать
                                    </Button>
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => handleDelete(calculator.id)}
                                    >
                                        Удалить
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            {/* Модальное окно для добавления/редактирования */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? 'Редактировать запись' : 'Добавить новую запись'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Тип одежды</Form.Label>
                                    <Form.Select 
                                        name="clothing_type" 
                                        value={formData.clothing_type} 
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Выберите тип одежды</option>
                                        {clothingTypes.map((type, index) => (
                                            <option key={index} value={type}>{type}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Тип ткани</Form.Label>
                                    <Form.Select 
                                        name="fabric_id" 
                                        value={formData.fabric_id} 
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Выберите тип ткани</option>
                                        {fabrics.map(fabric => (
                                            <option key={fabric.id} value={fabric.id}>{fabric.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Минимальный рост (см)</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        name="height_min" 
                                        value={formData.height_min} 
                                        onChange={handleInputChange} 
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Максимальный рост (см)</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        name="height_max" 
                                        value={formData.height_max} 
                                        onChange={handleInputChange} 
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Минимальный размер</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        name="size_min" 
                                        value={formData.size_min} 
                                        onChange={handleInputChange} 
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Максимальный размер</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        name="size_max" 
                                        value={formData.size_max} 
                                        onChange={handleInputChange} 
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Базовый расход ткани (м)</Form.Label>
                            <Form.Control 
                                type="number" 
                                step="0.1" 
                                name="base_consumption" 
                                value={formData.base_consumption} 
                                onChange={handleInputChange} 
                                required
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Коэффициент роста</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        step="0.01" 
                                        name="height_factor" 
                                        value={formData.height_factor} 
                                        onChange={handleInputChange} 
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Коэффициент размера</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        step="0.01" 
                                        name="size_factor" 
                                        value={formData.size_factor} 
                                        onChange={handleInputChange} 
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        {editMode ? 'Сохранить изменения' : 'Добавить'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default FabricCalculatorAdmin;