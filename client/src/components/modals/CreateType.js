import React, { useState } from 'react';
import Modal from "react-bootstrap/Modal";
import { Form, Button } from "react-bootstrap";
import { createType } from "../../http/patternAPI";

const CreateType  = ({ show, onHide }) => {
    const [name, setName] = useState('')

    const addType = () => {
        const formData = new FormData()
        formData.append('name', name)
        createType  (formData).then(data => onHide())
        console.log('fabric')
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить фурнитуру
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder={"Введите название"}
                    />
                    <hr/>
                    {/* <Form.Control
                        value={price}
                        onChange={e => setPrice(Number(e.target.value))}
                        className="mt-3"
                        placeholder="Введите стоимость"
                        type="number"
                    />
                    <hr/>
                    <Form.Control
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder={"Введите описание"}
                    />
                    <Form.Control
                        className="mt-3"
                        type="file"
                        onChange={selectFile}
                    /> */}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={addType}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateType;