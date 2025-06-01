import React, { useEffect, useState } from 'react'
import { Table, Button } from "react-bootstrap"
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

const StyledButton = styled(Button)`
    margin: 20px 0;
    width: 200px;
`;

const PatternTable = () => {
    console.log('table')
    const [patterns, setPatterns] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [editData, setEditData] = useState({ name: '', price: '', img: '' });
    const [patternVisible, setPatternVisible] = useState(false)
    console.log(useState([]))

    useEffect(() => {
        fetchPattern().then(data => setPatterns(data));
    }, []);

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
            <Table striped bordered hover className="mt-3 custom-table" style={{ width: '100%' }}>
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
                    {patterns?.map((pattern, index) => (
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
                variant={"outline-light"}
                onClick={() => setPatternVisible(true)}
                style={{
                    border: '1px solid #fff',
                    width: '300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em' }}>
                    <div></div>
                    Добавить лекало
                    <div className="image-container">
                        <img src={kiwi} width={30} alt="Kiwi" />
                    </div>
                </div>
            </StyledButton>
            
            <CreatePattern show={patternVisible} onHide={() => setPatternVisible(false)} />
        </Container>
    );
};

export default PatternTable;
