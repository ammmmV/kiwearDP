import React, { useState, useEffect, useContext } from "react";
import { Button, Container, Table, Row, Card } from "react-bootstrap";
import CreateType from "../components/modals/CreateType";
import CreateFabric from "../components/modals/CreateFabric";
import CreatePattern from "../components/modals/CreatePattern";
import kiwi from "../assets/kiwi-bird.svg";
import "../styles/Style.css";
import { fetchTypes, fetchFabrics, updateType, updateFabric } from "../http/patternAPI";
import { Context } from "../index";
import {
  ADMIN_ORDERS_ROUTE,
  ADMIN_REVIEWS_ROUTE,
  ADMIN_ROUTE,
  PATTERNS_FIX_ROUTE,
  USERS_FIX_ROUTE,
  ADMIN_CALCULATOR_ROUTE,
} from "../utils/consts";
import minus from "../assets/minus-svg.svg";
import pen from "../assets/pen-svg.svg";
import check from "../assets/check-svg.svg";
import cross from "../assets/cross-svg.svg";
import { $authHost } from "../http";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';

// Добавляем стилизованную кнопку
const StyledButton = styled(Button)`
    background: linear-gradient(135deg, #267b54, #43d08e) !important;
    border: none !important;
    color: #f7f7f7 !important;
    &:hover, &:focus {
        background: linear-gradient(135deg, #267b54, #43d08e) !important;
        box-shadow: 0 0 0 0.25rem rgba(67, 208, 142, 0.25);
    }
`;

const Admin = () => {
  const [typeVisible, setTypeVisible] = useState(false);
  const [fabricVisible, setFabricVisible] = useState(false);
  const [patternVisible, setPatternVisible] = useState(false);
  const [types, setTypes] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const { pattern } = useContext(Context);
  const history = useNavigate();
  
  const [editTypeMode, setEditTypeMode] = useState(null);
  const [editTypeData, setEditTypeData] = useState({ name: '' });
  const [editFabricMode, setEditFabricMode] = useState(null);
  const [editFabricData, setEditFabricData] = useState({ name: '' });

  useEffect(() => {
    fetchTypes().then((data) => setTypes(data));
    fetchFabrics().then((data) => setFabrics(data));
  }, []);

  const handleRemoveType = async (typeId) => {
    if (window.confirm("Вы уверены, что хотите удалить эту фурнитуру?")) {
      try {
        await $authHost.delete(`api/type/${typeId}`);
        setTypes((prevTypes) => prevTypes.filter((type) => type.id !== typeId));
        alert("Фурнитура успешно удалена.");
      } catch (error) {
        alert("Ошибка при удалении фурнитуры.");
      }
    }
  };

  const handleRemoveFabric = async (fabricId) => {
    if (window.confirm("Вы уверены, что хотите удалить эту ткань?")) {
      try {
        await $authHost.delete(`api/fabric/${fabricId}`);
        setFabrics((prevFabrics) =>
          prevFabrics.filter((fabric) => fabric.id !== fabricId)
        );
        alert("Ткань успешно удалена.");
      } catch (error) {
        alert("Ошибка при удалении ткани.");
      }
    }
  };

  const handleEditType = (type) => {
    setEditTypeMode(type.id);
    setEditTypeData({ name: type.name });
  };

  const handleTypeChange = (value) => {
    setEditTypeData({ name: value });
  };

  const handleSaveType = async (typeId) => {
    try {
      const formData = new FormData();
      formData.append('name', editTypeData.name);
      
      await updateType(typeId, formData);
      setTypes((prevTypes) =>
        prevTypes.map((type) =>
          type.id === typeId ? { ...type, name: editTypeData.name } : type
        )
      );
      setEditTypeMode(null);
      alert("Изменения успешно сохранены.");
    } catch (error) {
      alert("Ошибка при сохранении изменений.");
    }
  };

  const handleEditFabric = (fabric) => {
    setEditFabricMode(fabric.id);
    setEditFabricData({ name: fabric.name });
  };

  const handleFabricChange = (value) => {
    setEditFabricData({ name: value });
  };

  const handleSaveFabric = async (fabricId) => {
    try {
      const formData = new FormData();
      formData.append('name', editFabricData.name);
      
      await updateFabric(fabricId, formData);
      setFabrics((prevFabrics) =>
        prevFabrics.map((fabric) =>
          fabric.id === fabricId ? { ...fabric, name: editFabricData.name } : fabric
        )
      );
      setEditFabricMode(null);
      alert("Изменения успешно сохранены.");
    } catch (error) {
      alert("Ошибка при сохранении изменений.");
    }
  };

  return (
    <Container style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "1400px" }}>
          <StyledButton
            className="mt-3 p-2 w-100"
            onClick={() => setTypeVisible(true)}
          >
            Добавить фурнитуру
          </StyledButton>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
      <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>№</th>
              <th>ID</th>
              <th>Название</th>
              <th>Редактировать</th>
              <th>Удалить</th>
            </tr>
          </thead>
          <tbody>
            {types?.map((type, index) => (
              <tr key={type.id} className="userLine">
                <td>{index + 1}</td>
                <td>{type.id}</td>
                <td>
                  {editTypeMode === type.id ? (
                    <input
                      type="text"
                      value={editTypeData.name}
                      onChange={(e) => handleTypeChange(e.target.value)}
                    />
                  ) : (
                    type.name
                  )}
                </td>
                <td>
                  {editTypeMode === type.id ? (
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                      <button style={{paddingRight: '10px'}} className='butt_edit' onClick={() => handleSaveType(type.id)}>
                        <img src={check} height={25} alt="Save" />
                      </button>
                      <button className='butt_edit' onClick={() => setEditTypeMode(null)}>
                        <img src={cross} height={18} alt="Cancel" />
                      </button>
                    </div>
                  ) : (
                    <button className='butt_edit' onClick={() => handleEditType(type)}>
                      <img src={pen} height={25} alt="Edit" />
                    </button>
                  )}
                </td>
                <td className="btn-remove">
                  <button
                    className="hover-image-btn hidden"
                    onClick={() => handleRemoveType(type.id)}
                  >
                    <img src={minus} height={25} alt="Remove" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "1400px" }}>
          <StyledButton
            className="mt-2 p-2 w-100"
            onClick={() => setFabricVisible(true)}
          >
            <div>
              <div></div>
              Добавить ткань
            </div>
          </StyledButton>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
      <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>№</th>
              <th>ID</th>
              <th>Название</th>
              <th>Редактировать</th>
              <th>Удалить</th>
            </tr>
          </thead>
          <tbody>
            {fabrics?.map((fabric, index) => (
              <tr key={fabric.id} className="userLine">
                <td>{index + 1}</td>
                <td>{fabric.id}</td>
                <td>
                  {editFabricMode === fabric.id ? (
                    <input
                      type="text"
                      value={editFabricData.name}
                      onChange={(e) => handleFabricChange(e.target.value)}
                    />
                  ) : (
                    fabric.name
                  )}
                </td>
                <td>
                  {editFabricMode === fabric.id ? (
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                      <button style={{paddingRight: '10px'}} className='butt_edit' onClick={() => handleSaveFabric(fabric.id)}>
                        <img src={check} height={25} alt="Save" />
                      </button>
                      <button className='butt_edit' onClick={() => setEditFabricMode(null)}>
                        <img src={cross} height={18} alt="Cancel" />
                      </button>
                    </div>
                  ) : (
                    <button className='butt_edit' onClick={() => handleEditFabric(fabric)}>
                      <img src={pen} height={25} alt="Edit" />
                    </button>
                  )}
                </td>
                <td className="btn-remove">
                  <button
                    className="hover-image-btn hidden"
                    onClick={() => handleRemoveFabric(fabric.id)}
                  >
                    <img src={minus} height={25} alt="Remove" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <CreatePattern
        show={patternVisible}
        onHide={() => setPatternVisible(false)}
      />
      <CreateFabric
        show={fabricVisible}
        onHide={() => {
          setFabricVisible(false);
          fetchFabrics().then((data) => setFabrics(data));
        }}
      />
      <CreateType
        show={typeVisible}
        onHide={() => {
          setTypeVisible(false);
          fetchTypes().then((data) => setTypes(data));
        }}
      />
    </Container>
  );
};

export default Admin;
