import React, { useEffect, useState } from 'react'
import { Table, Button, Form, InputGroup, Row, Col } from "react-bootstrap"
import { fetchPattern, deletePattern, updatePattern } from "../http/patternAPI"
import styled from 'styled-components'
import minus from '../assets/minus-svg.svg'
import cross from '../assets/cross-svg.svg'
import check from '../assets/check-svg.svg'
import pen from '../assets/pen-svg.svg'
import CreatePattern from "../components/modals/CreatePattern"
import kiwi from '../assets/kiwi-bird.svg'
import { toast } from 'react-custom-alert';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
`;

// Обновляем стилизованную кнопку
const StyledButton = styled(Button)`
    margin: 20px 0;
    width: 300px;
    background: linear-gradient(135deg, #267b54, #43d08e) !important;
    border: none !important;
    color: #f7f7f7 !important;
    &:hover, &:focus {
        background: linear-gradient(135deg, #267b54, #43d08e) !important;
        box-shadow: 0 0 0 0.25rem rgba(67, 208, 142, 0.25);
    }
`;

const SearchContainer = styled.div`
    width: 100%;
    margin-bottom: 20px;
`;

const PatternTable = () => {
    const [patterns, setPatterns] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [editData, setEditData] = useState({ name: '', price: '', img: '' });
    const [patternVisible, setPatternVisible] = useState(false);
    
    // Добавляем состояния для поиска и фильтрации
    const [searchQuery, setSearchQuery] = useState('');
    const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        fetchPattern().then(data => setPatterns(data));
    }, []);

    // Функция для фильтрации и сортировки паттернов
    const filteredAndSortedPatterns = patterns
        .filter(pattern => {
            // Фильтрация по поисковому запросу (имя или описание)
            const matchesSearch = pattern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 (pattern.description && pattern.description.toLowerCase().includes(searchQuery.toLowerCase()));
            
            // Фильтрация по цене
            const matchesMinPrice = priceFilter.min === '' || Number(pattern.price) >= Number(priceFilter.min);
            const matchesMaxPrice = priceFilter.max === '' || Number(pattern.price) <= Number(priceFilter.max);
            
            return matchesSearch && matchesMinPrice && matchesMaxPrice;
        })
        .sort((a, b) => {
            // Сортировка по выбранному полю
            let comparison = 0;
            if (sortField === 'name') {
                comparison = a.name.localeCompare(b.name);
            } else if (sortField === 'price') {
                comparison = Number(a.price) - Number(b.price);
            } else if (sortField === 'id') {
                comparison = a.id - b.id;
            }
            
            // Применение порядка сортировки
            return sortOrder === 'asc' ? comparison : -comparison;
        });

    // Функция для сброса фильтров
    const resetFilters = () => {
        setSearchQuery('');
        setPriceFilter({ min: '', max: '' });
        setSortField('name');
        setSortOrder('asc');
    };

    const handleEdit = (pattern) => {
        setEditMode(pattern.id);
        setEditData({
            name: pattern.name,
            price: pattern.price,
            img: pattern.img,
            description: pattern.description,
        });
    };

    const handleRemove = async (patternId) => {
            if (window.confirm("Вы уверены, что хотите удалить?")) {
                try {
                    await deletePattern(patternId);
                    setPatterns((prevPatterns) => prevPatterns.filter((pattern) => pattern.id !== patternId));
                    toast.success("Паттерн успешно удалён.");
                } catch (error) {
                    toast.error("Ошибка при удалении паттерна.");
                }
            }
        };

    const handleChange = (field, value) => {
        setEditData((prevData) => ({ ...prevData, [field]: value }));
    };

    const handleSave = async (patternId) => {
        try {
            const formData = new FormData();
            formData.append('name', editData.name);
            formData.append('price', editData.price);
            formData.append('description', editData.description);
            
            if (editData.img instanceof File) {
                formData.append('img', editData.img);
            }

            await updatePattern(patternId, formData);
            setPatterns((prevPatterns) =>
                prevPatterns.map((pattern) =>
                    pattern.id === patternId ? { ...pattern, ...editData } : pattern
                )
            );
            setEditMode(null);
            toast.success("Изменения успешно сохранены.");
        } catch (error) {
            toast.error("Ошибка при сохранении изменений.");
        }
    };

    return (
        <Container>
            {/* Добавляем компоненты поиска и фильтрации */}
            <SearchContainer>
                <Form>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: 'white' }}>Поиск по названию или описанию</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Введите текст для поиска..."
                                    value={searchQuery}
                                    variant="dark"
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: 'white' }}>Фильтр по цене</Form.Label>
                                <Row>
                                    <Col>
                                        <Form.Control
                                            type="number"
                                            placeholder="Мин."
                                            value={priceFilter.min}
                                            onChange={(e) => setPriceFilter({...priceFilter, min: e.target.value})}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            type="number"
                                            placeholder="Макс."
                                            value={priceFilter.max}
                                            onChange={(e) => setPriceFilter({...priceFilter, max: e.target.value})}
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: 'white' }}>Сортировать по</Form.Label>
                                <Form.Select 
                                    value={sortField}
                                    onChange={(e) => setSortField(e.target.value)}
                                >
                                    <option value="name">Названию</option>
                                    <option value="price">Цене</option>
                                    <option value="id">ID</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: 'white' }}>Порядок</Form.Label>
                                <Form.Select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                >
                                    <option value="asc">По возрастанию</option>
                                    <option value="desc">По убыванию</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3} className="d-flex align-items-end">
                            <StyledButton 
                                className="mb-3 w-100"
                                onClick={resetFilters}
                            >
                                Сбросить фильтры
                            </StyledButton>
                        </Col>
                    </Row>
                </Form>
            </SearchContainer>

            <Table striped bordered hover variant="dark" style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>№</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAndSortedPatterns?.map((pattern, index) => (
                        <tr key={pattern.id} className='userLine'>
                            <td>{index + 1}</td>
                            <td>{pattern.id}</td>
                            <td>
                                {editMode === pattern.id ? (
                                    <input
                                        type="text"
                                        value={editData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                    />
                                ) : (
                                    pattern.name
                                )}
                            </td>
                            <td>
                                {editMode === pattern.id ? (
                                    <input
                                        style={{width: '100px'}}
                                        type="number"
                                        value={editData.price}
                                        onChange={(e) => handleChange('price', e.target.value)}
                                    />
                                ) : (
                                    pattern.price
                                )} BYN
                            </td>
                            <td>
                                {editMode === pattern.id ? (
                                    <input
                                        type="text"
                                        value={editData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                    />
                                ) : (
                                    pattern.description
                                )}
                            </td>
                            <td>
                                {editMode === pattern.id ? (
                                    <input
                                        type="file"
                                        onChange={(e) => handleChange('img', e.target.files[0])}
                                    />
                                ) : (
                                    <img
                                        src={process.env.REACT_APP_API_URL + '/' + pattern.img}
                                        alt={pattern.name}
                                        style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}
                                    />
                                )}
                            </td>
                            <td>
                                {editMode === pattern.id ? (
                                    <div style={{display: 'flex', flexDirection: 'row'}}>
                                        <button style={{paddingRight: '10px'}} className='butt_edit' onClick={() => handleSave(pattern.id)}><img src={check} height={25}/></button>
                                        <button className='butt_edit' onClick={() => setEditMode(null)}><img src={cross} height={18}/></button>
                                    </div>
                                ) : (
                                    <button className='butt_edit' onClick={() => handleEdit(pattern)}><img src={pen} height={25}/></button>
                                )}
                            </td>
                            <td className="btn-remove">
                                <button className="hover-image-btn hidden" onClick={() => handleRemove(pattern.id)}>
                                    <img src={minus} height={25} alt="Remove" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <StyledButton
                onClick={() => setPatternVisible(true)}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em' }}>
                    <div></div>
                    Добавить лекало
                    {/* <div className="image-container">
                        <img src={kiwi} width={30} alt="Kiwi" />
                    </div> */}
                </div>
            </StyledButton>
            
            <CreatePattern show={patternVisible} onHide={() => setPatternVisible(false)} />
        </Container>
    );
};

export default PatternTable;
