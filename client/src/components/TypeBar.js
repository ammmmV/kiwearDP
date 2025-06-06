
import React, { useContext } from 'react';
import { ListGroup, Button } from "react-bootstrap";
import { Context } from "../index";
import { observer } from "mobx-react-lite";

const TypeBar = observer(() => {
    const { pattern } = useContext(Context);

    const handleFilter = (type) => {
        pattern.setSelectedType(type);
        pattern.setPage(1); 
    };

    return (
        <div className="filter-box">
            <h5 style={{ color: '#f7f7f7' }}>Сортировка</h5>
            <ListGroup>
                <ListGroup.Item
                    action
                    onClick={() => handleFilter({ id: null, name: 'Все' })}
                    active={pattern.selectedType.id === null}
                    className={`custom-active-type`}
                >
                    Все
                </ListGroup.Item>
                <ListGroup.Item
                    action
                    onClick={() => handleFilter({ id: 1, name: 'Ткань' })}
                    active={pattern.selectedType.id === 1}
                    className={`custom-active-type`}
                >
                    Ткань
                </ListGroup.Item>
                <ListGroup.Item
                    action
                    onClick={() => handleFilter({ id: 2, name: 'Фурнитура' })}
                    active={pattern.selectedType.id === 2}
                    className={`custom-active-type`}
                >
                    Фурнитура
                </ListGroup.Item>
                <ListGroup.Item
                    action
                    onClick={() => handleFilter({ id: 3, name: 'Лекало' })}
                    active={pattern.selectedType.id === 3}
                    className={`custom-active-type`}
                >
                    Лекало
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
});

export default TypeBar;
