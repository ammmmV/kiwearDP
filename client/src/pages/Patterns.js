import React, { useContext, useEffect } from 'react';
import { Container, Row, Col } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { fetchPatterns } from "../http/patternAPI";
// import PatternList from "../components/PatternList";
import styled from 'styled-components';

const StyledContainer = styled(Container)`
    padding: 2rem;
    position: relative;
`;

const PatternHeader = styled.div`
    position: relative;
    text-align: center;
    margin-bottom: 4rem;
    padding-top: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3rem;
`;

const Title = styled.h2`
    color: #267b54;
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0;
`;

const PatternVector = styled.div`
    width: 100px;
    height: 160px;
    position: relative;
    
    &:before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border: 2px dashed #ffffff;
    }

    .neckline {
        position: absolute;
        width: 40%;
        height: 15px;
        border-bottom: 2px dashed #ffffff;
        border-radius: 0 0 40% 40%;
        top: 0;
        left: 80%;
    }

    .shoulder-left, .shoulder-right {
        position: absolute;
        width: 35px;
        height: 2px;
        top: 10px;
        background: repeating-linear-gradient(
            90deg,
            #ffffff,
            #ffffff 4px,
            transparent 4px,
            transparent 8px
        );
    }

    .shoulder-left {
        left: 50px;
        transform: rotate(-35deg);
    }

    .shoulder-right {
        right: -50px;
        transform: rotate(35deg);
    }

    .measurement {
        position: absolute;
        left: -30px;
        height: 100%;
        width: 2px;
        border-left: 2px dashed #ffffff;
        &:after {
            content: '58.3';
            position: absolute;
            left: -30px;
            top: 50%;
            transform: rotate(-90deg);
            color: #ffffff;
            font-size: 12px;
            white-space: nowrap;
        }
    }

    .width-line {
        position: absolute;
        bottom: -25px;
        width: 100%;
        text-align: center;
        color: #ffffff;
        font-size: 12px;
        &:before {
            content: '';
            position: absolute;
            width: 100%;
            height: 2px;
            background: repeating-linear-gradient(
                90deg,
                #ffffff,
                #ffffff 4px,
                transparent 4px,
                transparent 8px
            );
            bottom: 20px;
        }
        &:after {
            content: '22';
        }
    }
`;

const Patterns = observer(() => {
    const { pattern } = useContext(Context);

    useEffect(() => {
        fetchPatterns(null, 1, 6).then(data => {
            pattern.setPatterns(data.rows);
            pattern.setTotalCount(data.count);
        });
    }, []);

    return (
        <StyledContainer>
            <PatternHeader>
                <PatternVector>
                    <div className="neckline"></div>
                    <div className="shoulder-left"></div>
                    <div className="shoulder-right"></div>
                    <div className="measurement"></div>
                    <div className="width-line"></div>
                </PatternVector>
            </PatternHeader>
            <Row>
                <Col md={12}>
                    {/* <PatternList /> */}
                </Col>
            </Row>
        </StyledContainer>
    );
});

export default Patterns;