import React, { useContext, useEffect, useState } from 'react';
import Modal from "react-bootstrap/Modal";
import { Button, Dropdown, Form, Row, Col } from "react-bootstrap";
import { Context } from "../../index";
import { createPattern, fetchFabrics, fetchTypes } from "../../http/patternAPI";
import { observer } from "mobx-react-lite";
import styled from 'styled-components';

// Стили для модального окна и его элементов
const StyledModalHeader = styled(Modal.Header)`
    background: #27282a;
    color: #f7f7f7;
    border-bottom: 1px solid rgb(127, 153, 141);
    border-top-left-radius: 12px; /* Унаследуем border-radius от Modal.Dialog */
    border-top-right-radius: 12px;
`;

const StyledModalBody = styled(Modal.Body)`
    background: #27282a;
    color: #f7f7f7;
`;

const StyledModalFooter = styled(Modal.Footer)`
    background: #27282a;
    border-top: 1px solid #198754;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
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
    &[as="textarea"] {
        min-height: 80px; /* Например, минимальная высота для textarea */
        resize: vertical; /* Разрешить изменение размера только по вертикали */
    }
`;

const StyledFormLabel = styled(Form.Label)`
    color: #f7f7f7;
    margin-top: 10px;
    margin-bottom: 5px;
`;

const StyledDropdownToggle = styled(Dropdown.Toggle)`
    background: linear-gradient(135deg, #267b54, #43d08e) !important;
    border: none !important;
    color: #f7f7f7 !important;
    &:hover, &:focus {
        background: linear-gradient(135deg, #267b54, #43d08e) !important;
        box-shadow: 0 0 0 0.25rem rgba(67, 208, 142, 0.25);
    }
`;

const StyledDropdownMenu = styled(Dropdown.Menu)`
    background-color: #333538;
    border: 1px solid #444;
    max-height: 300px;
    overflow-y: auto;
    .dropdown-item {
        color: #f7f7f7;
        &:hover {
            background-color: #43d08e;
            color: #000;
        }
    }
`;

const CreatePattern = observer(({ show, onHide }) => {
    const { pattern } = useContext(Context);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [imgFile, setImgFile] = useState(null); // Изменено на imgFile
    const [pdfFile, setPdfFile] = useState(null); // Новое состояние для PDF
    const [description, setDescription] = useState(''); // description - это строка, не массив
    // const [info, setInfo] = useState([]) // Это поле не используется, можно удалить или использовать для других целей

    useEffect(() => {
        fetchTypes().then(data => pattern.setTypes(data));
        fetchFabrics().then(data => pattern.setFabrics(data));
    }, []);

    const selectImgFile = e => {
        setImgFile(e.target.files[0]);
    };

    const selectPdfFile = e => {
        setPdfFile(e.target.files[0]);
    };

    const addPattern = () => {
        if (!pattern.selectedType || !pattern.selectedType.id) {
            alert("Пожалуйста, выберите тип фурнитуры!");
            return;
        }

        // Проверка на выбор ткани
        if (!pattern.selectedFabric || !pattern.selectedFabric.id) {
            alert("Пожалуйста, выберите тип ткани!");
            return;
        }

        // Проверка на наличие имени
        if (!name.trim()) {
            alert("Пожалуйста, введите название лекала!");
            return;
        }

        // Проверка на цену
        if (price <= 0) {
            alert("Пожалуйста, введите корректную стоимость (больше 0)!");
            return;
        }

        // Проверка на наличие изображения
        if (!imgFile) {
            alert("Пожалуйста, загрузите изображение лекала!");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', `${price}`);
        formData.append('description', description);
        formData.append('fabricId', pattern.selectedFabric.id);
        formData.append('typeId', pattern.selectedType.id);

        if (imgFile) {
            formData.append('img', imgFile);
        } else {
            alert("Пожалуйста, загрузите изображение!");
            return;
        }

        if (pdfFile) {
            formData.append('pdf', pdfFile);
        }

        createPattern(formData).then(data => {
            onHide();
            alert("Лекало успешно добавлено!");
        }).catch(error => {
            console.error("Ошибка при добавлении лекала:", error);
            alert("Ошибка при добавлении лекала: " + (error.response?.data?.message || error.message));
        });
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            dialogClassName="modal-90w"
            style={{ borderRadius: '15px' }}
        >
            <StyledModalHeader closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить лекало
                </Modal.Title>
            </StyledModalHeader>
            <StyledModalBody>
                <Form>
                    <StyledFormLabel>Тип фурнитуры:</StyledFormLabel>
                    <Dropdown style={{ marginTop: '2px', marginBottom: '10px' }}>
                        <StyledDropdownToggle>{pattern.selectedType?.name || "Выберите фурнитуру"}</StyledDropdownToggle>
                        <StyledDropdownMenu>
                            {pattern.types?.map(type =>
                                <Dropdown.Item
                                    onClick={() => pattern.setSelectedType(type)}
                                    key={type.id}
                                >
                                    {type.name}
                                </Dropdown.Item>
                            )}
                        </StyledDropdownMenu>
                    </Dropdown>

                    <StyledFormLabel>Тип ткани:</StyledFormLabel>
                    <Dropdown style={{ marginTop: '2px', marginBottom: '10px' }}>
                        <StyledDropdownToggle>{pattern.selectedFabric?.name || "Выберите ткань"}</StyledDropdownToggle>
                        <StyledDropdownMenu>
                            {pattern.fabrics?.map(fabric =>
                                <Dropdown.Item
                                    onClick={() => pattern.setSelectedFabric(fabric)}
                                    key={fabric.id}
                                >
                                    {fabric.name}
                                </Dropdown.Item>
                            )}
                        </StyledDropdownMenu>
                    </Dropdown>

                    <StyledFormLabel>Название лекала:</StyledFormLabel>
                    <StyledFormControl
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Введите название лекала"
                    />

                    <StyledFormLabel>Стоимость (BYN):</StyledFormLabel>
                    <StyledFormControl
                        value={price}
                        onChange={e => setPrice(Number(e.target.value))}
                        placeholder="Введите стоимость"
                        type="number"
                    />

                    <StyledFormLabel>Описание:</StyledFormLabel>
                    <StyledFormControl
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Введите описание лекала"
                        as="textarea"
                        className='form-control'
                        rows={3} // Количество строк
                    />

                    <StyledFormLabel>Загрузить изображение лекала (.jpg, .png):</StyledFormLabel>
                    <StyledFormControl
                        type="file"
                        onChange={selectImgFile}
                    />

                    <StyledFormLabel>Загрузить файл лекала (.pdf):</StyledFormLabel>
                    <StyledFormControl
                        type="file"
                        onChange={selectPdfFile}
                    />
                </Form>
            </StyledModalBody>
            <StyledModalFooter>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={addPattern}>Добавить</Button>
            </StyledModalFooter>
        </Modal>
    );
});

export default CreatePattern;