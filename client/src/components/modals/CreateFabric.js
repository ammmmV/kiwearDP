import React, { useState } from 'react';
import Modal from "react-bootstrap/Modal";
import { Button, Form } from "react-bootstrap";
import { createFabric } from "../../http/patternAPI";
import styled from "styled-components";

const StyledModal = styled(Modal)`
  .modal-content {
    background: rgba(39, 40, 42, 0.95);
    border: 1px solid #267b54;
  }
`;

const ModalTitle = styled(Modal.Title)`
  color: #ffffff;
`;

const ModalBody = styled(Modal.Body)`
  color: #ffffff;
`;

const StyledForm = styled(Form)`
  .form-control {
    background: rgba(39, 40, 42, 0.7);
    border: 1px solid #267b54;
    color: white;
    margin-top: 10px;
    
    &:focus {
      background: rgba(39, 40, 42, 0.7);
      border-color: #267b54;
      color: white;
      box-shadow: 0 0 0 0.2rem rgba(38, 123, 84, 0.25);
    }
    
    &::placeholder {
      color: #aaa;
    }
  }
`;

const CreateFabric = ({ show, onHide }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);

    const selectFile = e => {
        setFile(e.target.files[0]);
    };

    const addFabric = () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        if (file) {
            formData.append('img', file);
        }
        createFabric(formData).then(data => {
            setName('');
            setDescription('');
            setFile(null);
            onHide();
        });
    };

    return (
        <StyledModal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton>
                <ModalTitle>Добавить ткань</ModalTitle>
            </Modal.Header>
            <ModalBody>
                <StyledForm>
                    <Form.Control
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder={"Введите название"}
                    />
                </StyledForm>
            </ModalBody>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={addFabric}>Добавить</Button>
            </Modal.Footer>
        </StyledModal>
    );
};

export default CreateFabric;