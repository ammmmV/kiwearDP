import React, { useState, useEffect, useContext } from "react";
import { Button, Container, Table } from "react-bootstrap";
import CreateType from "../components/modals/CreateType";
import CreateFabric from "../components/modals/CreateFabric";
import CreatePattern from "../components/modals/CreatePattern";
import kiwi from "../assets/kiwi-bird.svg";
import "../styles/Style.css";
import { fetchTypes, fetchFabrics } from "../http/patternAPI";
import { Context } from "../index";
import minus from "../assets/minus-svg.svg";
import { $authHost } from "../http";

const Admin = () => {
  const [typeVisible, setTypeVisible] = useState(false);
  const [fabricVisible, setFabricVisible] = useState(false);
  const [patternVisible, setPatternVisible] = useState(false);
  const [types, setTypes] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const { pattern } = useContext(Context);

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

  return (
    <Container style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "1000px" }}>
          <Button
            variant="outline-light"
            className="mt-3 p-2 w-100"
            onClick={() => setTypeVisible(true)}
          >
            Добавить фурнитуру
          </Button>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Table striped bordered hover className="mt-3 custom-table">
          <thead>
            <tr>
              <th>№</th>
              <th>ID</th>
              <th>Название</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {types?.map((type, index) => (
              <tr key={type.id} className="userLine">
                <td>{index + 1}</td>
                <td>{type.id}</td>
                <td>{type.name}</td>
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
        <div style={{ width: "100%", maxWidth: "1000px" }}>
          <Button
            variant={"outline-light"}
            className="mt-2 p-2 w-100"
            onClick={() => setFabricVisible(true)}
          >
            <div>
              <div></div>
              Добавить ткань
            </div>
          </Button>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Table striped bordered hover className="mt-3 custom-table">
          <thead>
            <tr>
              <th>№</th>
              <th>ID</th>
              <th>Название</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {fabrics?.map((fabric, index) => (
              <tr key={fabric.id} className="userLine">
                <td>{index + 1}</td>
                <td>{fabric.id}</td>
                <td>{fabric.name}</td>
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
      {/* <div className="kiwi-background"></div> */}
    </Container>
  );
};

export default Admin;
