import React, { useState } from 'react';
import Modal from "react-bootstrap/Modal";
import { Button, Form } from "react-bootstrap";
import { createFabric } from "../../http/patternAPI";

const CreateFabric = ({ show, onHide }) => {
    const [name, setName] = useState('')

    const addFabric = () => {
        const formData = new FormData()
        formData.append('name', name)
        createFabric(formData).then(data => onHide())
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
                    Добавить ткань
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
                <Button variant="outline-success" onClick={addFabric}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateFabric;