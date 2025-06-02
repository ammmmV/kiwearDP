import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Table, Modal, Row, Col, ButtonGroup } from 'react-bootstrap';
import { fetchCalculators, createCalculator, updateCalculator, deleteCalculator } from '../http/fabricCalculatorAPI';
import { fetchFabrics } from '../http/patternAPI';
import '../styles/Style.css';
import styled from 'styled-components';
import { toast } from 'react-custom-alert';

// Стилизованные компоненты
const StyledContainer = styled(Container)`
    color: #f7f7f7;
    padding: 20px;
`;

const StyledCard = styled(Card)`
    background: #333538;
    color: #f7f7f7;
    border: 1px solid #444;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const StyledFormLabel = styled(Form.Label)`
    color: #f7f7f7;
    margin-top: 10px;
    margin-bottom: 5px;
`;

const StyledFormControl = styled(Form.Control)`
    background-color: #333538;
    color: #f7f7f7;
    border: 1px solid #444;
    &:focus {
        background-color: #333538;
        color: #f7f7f7;
        border-color: #43d08e;
        box-shadow: 0 0 0 0.25rem rgba(67, 208, 142, 0.25);
    }
    &::placeholder {
        color: #dcdcdc !important;
    }
`;

const StyledFormSelect = styled(Form.Select)`
    background-color: #333538;
    color: #f7f7f7;
    border: 1px solid #444;
    &:focus {
        background-color: #333538;
        color: #f7f7f7;
        border-color: #43d08e;
        box-shadow: 0 0 0 0.25rem rgba(67, 208, 142, 0.25);
    }
    option {
        background-color: #333538;
        color: #f7f7f7;
    }
    // Styles for disabled state
    &:disabled {
        background-color: #44464a; // Slightly lighter dark background for disabled state
        color: #a0a0a0; // Grey out the text
        border-color: #555;
        opacity: 1; // Prevent Bootstrap's default opacity reduction for disabled elements
        // Also update the caret for disabled state if necessary
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23a0a0a0' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
    }

    // Styles for the caret (arrow)
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23f7f7f7' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 16px 12px; // Adjust size if needed
`;

const StyledButton = styled(Button)`
    background: linear-gradient(135deg, #267b54, #43d08e) !important;
    border: none !important;
    color: #f7f7f7 !important;
    &:hover, &:focus {
        background: linear-gradient(135deg, #267b54, #43d08e) !important;
        box-shadow: 0 0 0 0.25rem rgba(67, 208, 142, 0.25);
    }
`;

const StyledSpinnerContainer = styled(Container)`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #27282a; /* Фоновый цвет, как у модального окна */
`;

const StyledModal = styled(Modal)`
    .modal-content {
        background-color: #333538;
        color: #f7f7f7;
        border: 1px solid #444;
    }
    .modal-header {
        border-bottom: 1px solid #444;
    }
    .modal-footer {
        border-top: 1px solid #444;
    }
    .close {
        color: #f7f7f7;
    }
`;

const StyledTable = styled(Table)`
    color: #f7f7f7;
    background-color: #333538;
    
    thead tr th {
        background-color: #27282a;
        color: #f7f7f7;
        border-color: #444;
    }
    
    tbody tr {
        background-color: #333538;
        color: #f7f7f7;
        border-color: #444;
    }
    
    tbody tr:nth-of-type(odd) {
        background-color: #2e3033;
    }
    
    td, th {
        border-color: #444;
    }
    
`;

const FabricCalculatorAdmin = () => {
    const [calculators, setCalculators] = useState([]);
    const [fabrics, setFabrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterFabric, setFilterFabric] = useState("");
    const [filterHeightRange, setFilterHeightRange] = useState("");
    const [filterSizeRange, setFilterSizeRange] = useState("");
    const [formData, setFormData] = useState({
        clothing_type: '',
        fabricId: '',
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
        const loadData = async () => {
            try {
                const data = await fetchCalculators();
                setCalculators(data);
                const fabricData = await fetchFabrics();
                setFabrics(fabricData);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                toast.error('Ошибка при загрузке данных');
                setLoading(false);
            }
        };
        loadData();
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
            toast.error('Произошла ошибка при сохранении данных');
        }
    };

    const handleEdit = (calculator) => {
        setEditMode(true);
        setCurrentId(calculator.id);
        setFormData({
            clothing_type: calculator.clothing_type,
            fabricId: calculator.fabricId,
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
                toast.error('Произошла ошибка при удалении записи');
            }
        }
    };

    const handleShowModal = () => {
        setEditMode(false);
        setFormData({
            clothing_type: '',
            fabricId: '',
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

    // Фильтрация данных
    const filteredCalculators = calculators.filter(calculator => {
        const matchesSearch = calculator.clothing_type.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             getFabricName(calculator.fabricId).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFabric = filterFabric === "" || calculator.fabricId.toString() === filterFabric;
        
        let matchesHeightRange = true;
        if (filterHeightRange) {
            const [min, max] = filterHeightRange.split('-').map(Number);
            matchesHeightRange = calculator.height_min >= min && calculator.height_max <= max;
        }
        
        let matchesSizeRange = true;
        if (filterSizeRange) {
            const [min, max] = filterSizeRange.split('-').map(Number);
            matchesSizeRange = calculator.size_min >= min && calculator.size_max <= max;
        }
        
        return matchesSearch && matchesFabric && matchesHeightRange && matchesSizeRange;
    });

    // Получение уникальных диапазонов роста и размеров для фильтров
    const heightRanges = [...new Set(calculators.map(c => `${c.height_min}-${c.height_max}`))];
    const sizeRanges = [...new Set(calculators.map(c => `${c.size_min}-${c.size_max}`))];

    if (loading) {
        return <StyledSpinnerContainer>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Загрузка...</span>
            </div>
        </StyledSpinnerContainer>;
    }

    return (
        <StyledContainer style={{ minHeight: "90vh" }}>
            <h2 className="text-center mb-4">Управление калькулятором расхода ткани</h2>
            
            <div className="mb-4" style={{ display: "flex", justifyContent: "space-between" }}>
                <StyledButton 
                    variant="primary" 
                    onClick={handleShowModal}
                >
                    Добавить новую запись
                </StyledButton>
            </div>
            
            <div className="mb-4" style={{ display: "flex", gap: "20px" }}>
                <Form.Group style={{ flex: 1 }}>
                    <StyledFormControl
                        type="text"
                        placeholder="Поиск по типу одежды или ткани"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Form.Group>

                <Form.Group style={{ width: "200px" }}>
                    <StyledFormSelect
                        value={filterFabric}
                        onChange={(e) => setFilterFabric(e.target.value)}
                    >
                        <option value="">Все ткани</option>
                        {fabrics.map(fabric => (
                            <option key={fabric.id} value={fabric.id}>{fabric.name}</option>
                        ))}
                    </StyledFormSelect>
                </Form.Group>

                <Form.Group style={{ width: "200px" }}>
                    <StyledFormSelect
                        value={filterHeightRange}
                        onChange={(e) => setFilterHeightRange(e.target.value)}
                    >
                        <option value="">Любой рост</option>
                        {heightRanges.map((range, index) => (
                            <option key={index} value={range}>{range} см</option>
                        ))}
                    </StyledFormSelect>
                </Form.Group>

                <Form.Group style={{ width: "200px" }}>
                    <StyledFormSelect
                        value={filterSizeRange}
                        onChange={(e) => setFilterSizeRange(e.target.value)}
                    >
                        <option value="">Любой размер</option>
                        {sizeRanges.map((range, index) => (
                            <option key={index} value={range}>{range}</option>
                        ))}
                    </StyledFormSelect>
                </Form.Group>
            </div>
            
            <StyledCard>
                <StyledTable striped bordered hover variant="dark" responsive>
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
                        {filteredCalculators.map(calculator => (
                            <tr key={calculator.id}>
                                <td>{calculator.id}</td>
                                <td>{calculator.clothing_type}</td>
                                <td>{getFabricName(calculator.fabricId)}</td>
                                <td>{calculator.height_min} - {calculator.height_max}</td>
                                <td>{calculator.size_min} - {calculator.size_max}</td>
                                <td>{calculator.base_consumption}</td>
                                <td>{calculator.height_factor}</td>
                                <td>{calculator.size_factor}</td>
                                <td>
                                        <Button 
                                            variant="outline-success" 
                                            onClick={() => handleEdit(calculator)}
                                            style={{ marginRight: '10px' }} // <--- ADD THIS STYLE
                                        >
                                            Редактировать
                                        </Button>
                                        <Button 
                                            variant="outline-danger" 
                                            onClick={() => handleDelete(calculator.id)}
                                        >
                                            Удалить
                                        </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </StyledTable>
            </StyledCard>
            
            {filteredCalculators.length === 0 && (
                <div className="text-center mt-4">
                    <p>Записи не найдены</p>
                </div>
            )}

            {/* Модальное окно для добавления/редактирования */}
            <StyledModal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? 'Редактировать запись' : 'Добавить новую запись'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <StyledFormLabel>Тип одежды</StyledFormLabel>
                                    <StyledFormSelect 
                                        name="clothing_type" 
                                        value={formData.clothing_type} 
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Выберите тип одежды</option>
                                        {clothingTypes.map((type, index) => (
                                            <option key={index} value={type}>{type}</option>
                                        ))}
                                    </StyledFormSelect>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <StyledFormLabel>Тип ткани</StyledFormLabel>
                                    <StyledFormSelect 
                                        name="fabricId" 
                                        value={formData.fabricId} 
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Выберите тип ткани</option>
                                        {fabrics.map(fabric => (
                                            <option key={fabric.id} value={fabric.id}>{fabric.name}</option>
                                        ))}
                                    </StyledFormSelect>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <StyledFormLabel>Минимальный рост (см)</StyledFormLabel>
                                    <StyledFormControl 
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
                                    <StyledFormLabel>Максимальный рост (см)</StyledFormLabel>
                                    <StyledFormControl 
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
                                    <StyledFormLabel>Минимальный размер</StyledFormLabel>
                                    <StyledFormControl 
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
                                    <StyledFormLabel>Максимальный размер</StyledFormLabel>
                                    <StyledFormControl 
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
                            <StyledFormLabel>Базовый расход ткани (м)</StyledFormLabel>
                            <StyledFormControl 
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
                                    <StyledFormLabel>Коэффициент роста</StyledFormLabel>
                                    <StyledFormControl 
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
                                    <StyledFormLabel>Коэффициент размера</StyledFormLabel>
                                    <StyledFormControl 
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
                    <StyledButton variant="primary" onClick={handleSubmit}>
                        {editMode ? 'Сохранить изменения' : 'Добавить'}
                    </StyledButton>
                </Modal.Footer>
            </StyledModal>
        </StyledContainer>
    );
};

export default FabricCalculatorAdmin;