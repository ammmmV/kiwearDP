import React, { useState } from 'react';
import { Button, Container } from "react-bootstrap";
import CreateType from "../components/modals/CreateType";
import CreateFabric from '../components/modals/CreateFabric';
import CreatePattern from "../components/modals/CreatePattern";
import kiwi from '../assets/kiwi-bird.svg'
import "../styles/Style.css"

const Admin = () => {
    const [typeVisible, setTypeVisible] = useState(false)
    const [fabricVisible, setFabricVisible] = useState(false)
    const [patternVisible, setPatternVisible] = useState(false)

    return (
        <Container className="d-flex flex-column">
            <Button
                variant="outline-light"
                className="mt-3 p-2"
                onClick={() => setTypeVisible(true)}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em' }}>
                    <div></div>
                    Добавить фурнитуру
                    <div className="image-container">
                        <img src={kiwi} width={30} alt="Kiwi" />
                    </div>
                </div>
            </Button>

            <Button
                variant={"outline-light"}
                className="mt-2 p-2"
                onClick={() => setFabricVisible(true)}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em' }}>
                    <div></div>
                    Добавить ткань
                    <div className="image-container">
                        <img src={kiwi} width={30} alt="Kiwi" />
                    </div>
                </div>
            </Button>
            {/* <Button
                variant={"outline-light"}
                className="mt-2 p-2"
                onClick={() => setPatternVisible(true)}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em' }}>
                    <div></div>
                    Добавить лекало
                    <div className="image-container">
                        <img src={kiwi} width={30} alt="Kiwi" />
                    </div>
                </div>
            </Button> */}
            <CreatePattern show={patternVisible} onHide={() => setPatternVisible(false)} />
            <CreateFabric show={fabricVisible} onHide={() => setFabricVisible(false)} />
            <CreateType show={typeVisible} onHide={() => setTypeVisible(false)} />
            <div className="kiwi-background"></div>
        </Container>
    );
};

export default Admin;
