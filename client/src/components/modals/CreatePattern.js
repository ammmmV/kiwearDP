import React, { useContext, useEffect, useState } from 'react';
import Modal from "react-bootstrap/Modal";
import { Button, Dropdown, Form, Row, Col } from "react-bootstrap";
import { Context } from "../../index";
import { createPattern, fetchFabrics, fetchTypes } from "../../http/patternAPI";
import { observer } from "mobx-react-lite";

const CreatePattern = observer(({ show, onHide }) => {
    const { pattern } = useContext(Context)
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [file, setFile] = useState(null)
    const [info, setInfo] = useState([])
    const [description, setDescription] = useState([])

    useEffect(() => {
        fetchTypes().then(data => pattern.setTypes(data))
        fetchFabrics().then(data => pattern.setFabrics(data))
    }, [])

    const selectFile = e => {
        setFile(e.target.files[0])
    }

    const addPattern = () => {
        if (!pattern.selectedType || !pattern.selectedFabric) {
            alert("Выберите тип и лекало перед добавлением!");
            return;
        }

        const formData = new FormData()
        formData.append('name', name)
        formData.append('price', `${price}`)
        formData.append('img', file)
        formData.append('description', description)
        formData.append('fabricId', pattern.selectedFabric.id)
        formData.append('typeId', pattern.selectedType.id)
        createPattern(formData).then(data => onHide())
        console.log('pattern')
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить лекало
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Dropdown variant="success" style={{marginTop: '2px', marginBottom: '2px'}}>
                        <Dropdown.Toggle variant="success">{pattern.selectedType?.name || "Выберите фурнитуру"}</Dropdown.Toggle>
                        <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {pattern.types?.map(type =>
                                <Dropdown.Item
                                    onClick={() => pattern.setSelectedType(type)}
                                    key={type.id}
                                >
                                    {type.name}
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown style={{marginTop: '2px', marginBottom: '2px'}}>
                        <Dropdown.Toggle variant="success">{pattern.selectedFabric?.name || "Выберите ткань"}</Dropdown.Toggle>
                        <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {pattern.fabrics?.map(fabric =>
                                <Dropdown.Item
                                    onClick={() => pattern.setSelectedFabric(fabric)}
                                    key={fabric.id}
                                >
                                    {fabric.name}
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form.Control
                        value={name}
                        onChange={e => setName(e.target.value)}
                            style={{marginTop: '3px'}}
                        placeholder="Введите название"
                    />
                    <Form.Control
                        value={price}
                        onChange={e => setPrice(Number(e.target.value))}
                        className="mt-3"
                        placeholder="Введите стоимость"
                        type="number"
                    />
                    <Form.Control
                        style={{ marginTop: '3px' }}
                        type="file"
                        onChange={selectFile}
                    />
                    <Form.Control
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="mt-3"
                        placeholder="Введите описание"
                    />
                    <hr />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={addPattern}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreatePattern;