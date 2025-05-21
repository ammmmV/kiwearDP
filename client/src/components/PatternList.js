// import React, { useContext } from 'react';
// import { observer } from "mobx-react-lite";
// import { Context } from "../index";
// import { Row } from "react-bootstrap";
// import PatternItem from "./PatternItem";

// const PatternList = observer(() => {
//     const { pattern: pattern } = useContext(Context)
//     console.log(pattern.patterns);

//     return (
//         <Row className="d-flex">
//             {pattern.patterns.map(pattern =>
//                 <PatternItem key={pattern.id} pattern={pattern} />
//             )}
//         </Row>
//     );
// });

// export default PatternList;