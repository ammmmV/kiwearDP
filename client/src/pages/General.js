import React, { useContext, useEffect } from 'react';
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TypeBar from "../components/TypeBar";
import FabricBar from '../components/FabricBar';
import PatternList from "../components/PatternList";
import { observer } from "mobx-react-lite";
// import { Context } from "../index";
// import { fetchFabrics, fetchPatterns, fetchTypes } from "../http/patternAPI";
import Pages from "../components/Pages";
import '../styles/GeneralStyle.css'

const General = observer(() => {

    return (
        <Container>
            <Row className="mt-2">
                <Col md={3}>
                    <TypeBar />
                </Col>
                <Col md={9}>
                    <PatternList />
                    <Pages />
                </Col>
            </Row>
        </Container>
    );
});

export default General;