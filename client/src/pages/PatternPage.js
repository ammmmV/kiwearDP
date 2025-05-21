// import React, { useEffect, useState } from 'react';
// import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
// import bigStar from '../assets/bigStar.png'
// import { useParams } from 'react-router-dom'
// import { fetchOnePattern } from "../http/patternAPI";

// const PatternPage = () => {
//     const [pattern, setPattern] = useState({ info: [] })
//     const { id } = useParams()
//     useEffect(() => {
//         fetchOnePattern(id).then(data => setPattern(data))
//     }, [id])

//     return (
//         <Container className="mt-3">
//             <Row>
//                 <Col md={4}>
//                     <Image width={300} height={300} src={process.env.REACT_APP_API_URL + pattern.img} />
//                 </Col>
//                 <Col md={4}>
//                     <Row className="d-flex flex-column align-items-center">
//                         <h2>{pattern.name}</h2>
//                         <div
//                             className="d-flex align-items-center justify-content-center"
//                             style={{ background: `url(${bigStar}) no-repeat center center`, width: 240, height: 240, backgroundSize: 'cover', fontSize: 64 }}
//                         >
//                             {pattern.price}
//                         </div>
//                     </Row>
//                 </Col>
//                 <Col md={4}>
//                     <Card
//                         className="d-flex flex-column align-items-center justify-content-around"
//                         style={{ width: 300, height: 300, fontSize: 32, border: '5px solid lightgray' }}
//                     >
//                         <div>{pattern.price || 'Нет рейтинга'}</div>
//                         <h3>От: {pattern.price || 'Не указано'} BYN </h3>

//                         {/* <h3>От: {pattern.price} руб.</h3> */}
//                         <Button variant={"outline-dark"}>Добавить в корзину</Button>
//                     </Card>
//                 </Col>
//             </Row>
//             <Row className="d-flex flex-column m-3">
//                 <h1>Характеристики</h1>
//                 {pattern.info?.map((info, index) =>
//                     <Row key={info.id} style={{ background: index % 2 === 0 ? 'lightgray' : 'transparent', padding: 10 }}>
//                         {info.title}: {info.description}
//                     </Row>
//                 )}
//             </Row>
//         </Container>
//     );
// };

// export default PatternPage;



import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import bigStar from '../assets/bigStar.png'
import { useParams } from 'react-router-dom'
import { fetchOnePattern } from "../http/patternAPI";

const PatternPage = () => {
    const [pattern, setPattern] = useState({ info: [] })
    const { id } = useParams()
    useEffect(() => {
        fetchOnePattern(id).then(data => setPattern(data))
    }, [id])

    return (
        <Container className="mt-3">
            <Row>
                <Col md={4}>
                    <Image width={300} height={300} src={process.env.REACT_APP_API_URL + pattern.img} />
                </Col>
                <Col md={4}>
                    <Row className="d-flex flex-column align-items-center">
                        <div>
                        <h2>{pattern.name}</h2>
                        <h3>{pattern.price}</h3>
                        <h3>{pattern.description}</h3>
                        </div>
                    </Row>
                </Col>
            </Row>
            {/* <Row className="d-flex flex-column m-3">
                <h1>Характеристики</h1>
                {pattern.info?.map((info, index) =>
                    <Row key={info.id} style={{ background: index % 2 === 0 ? 'lightgray' : 'transparent', padding: 10 }}>
                        {info.title}: {info.description}
                    </Row>
                )}
            </Row> */}
        </Container>
    );
};

export default PatternPage;
