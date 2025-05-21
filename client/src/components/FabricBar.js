// import React, { useContext } from 'react';
// import { observer } from "mobx-react-lite";
// import { Context } from "../index";
// import { Card, Row } from "react-bootstrap";
// import "../styles/Style.css"

// const FabricBar = observer(() => {
//     const { pattern } = useContext(Context)

//     return (
//         <Row className="d-flex">
//             {pattern.fabrics?.map(fabric =>
//                 <Card
//                     style={{ cursor: 'pointer', maxWidth: '180px' }}
//                     key={fabric.id}
//                     className="p-3"
//                     onClick={() => pattern.setSelectedFabric(fabric)}
//                     border={fabric.id === pattern.selectedFabric.id ? 'success' : 'light-secondary'}
//                 >
//                     {fabric.name}
//                 </Card>
//             )}
//         </Row>
//     );
// });

// export default FabricBar;

import React, { useContext } from 'react';
import { ListGroup } from "react-bootstrap";
import { Context } from "../index";
import { observer } from "mobx-react-lite";

const FabricBar = observer(() => {
    const { pattern } = useContext(Context);

    const handleFabricFilter = (fabric) => {
        pattern.setSelectedFabric(fabric);
        pattern.setPage(1);
    };

    return (
        <div className="filter-box">
            <h5 style={{ color: '#f7f7f7' }}>Фильтр по ткани</h5>
            <ListGroup>
                {pattern.fabrics.map(fabric => (
                    <ListGroup.Item
                        key={fabric.id}
                        action
                        onClick={() => handleFabricFilter(fabric)}
                        active={pattern.selectedFabric?.id === fabric.id}
                        className={`custom-active-type`}
                    >
                        {fabric.name}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
});

export default FabricBar;
