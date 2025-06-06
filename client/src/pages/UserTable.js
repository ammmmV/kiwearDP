import React, { useEffect, useState } from 'react'
import { Table } from "react-bootstrap"
import { fetchUsers, deleteUser, updateUserRole } from "../http/userAPI"
import { Dropdown } from "react-bootstrap"
import "../styles/Style.css"
import minus from '../assets/minus-svg.svg'
import { toast } from 'react-custom-alert'

const UserTable = () => {
    console.log('table')
    const [users, setUsers] = useState([]);
    console.log(useState([]))

    useEffect(() => {
        fetchUsers().then(data => setUsers(data));
    }, []);

    const handleRemove = async (userId) => {
        if (window.confirm("Вы уверены, что хотите удалить этого пользователя?")) {
            try {
                await deleteUser(userId);
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
                toast.success("Пользователь успешно удалён.");
            } catch (error) {
                toast.error("Ошибка при удалении пользователя.");
            }
        }
    };

    const handleRoleChange = async (newRole, userId) => {
        try {
            await updateUserRole(userId, newRole);
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId ? { ...user, role: newRole } : user
                )
            );
            toast.success(`Роль пользователя успешно обновлена на ${newRole}.`);
        } catch (error) {
            toast.error("Ошибка при обновлении роли пользователя.");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            {/* <Table striped bordered hover className="mt-3 custom-table"> */}
            <Table striped bordered hover variant="dark" style={{ width: '80%' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Роль</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users?.map((user, index) => (
                        <tr key={user.id} className='userLine'>
                            <td>{index + 1}</td>
                            <td>{user.email}</td>
                            <td>{user.name}</td>
                            <td>{user.phone}</td>
                            <td>
                                <Dropdown>
                                    <Dropdown.Toggle variant="none" style={{ color: 'white' }}>{user.role}</Dropdown.Toggle>
                                    <Dropdown.Menu style={{ overflowY: 'auto' }} className="custom-scroll">
                                        <Dropdown.Item style={{fontSize: '1em'}} onClick={() => handleRoleChange('ADMIN', user.id)}>ADMIN</Dropdown.Item>
                                        <Dropdown.Item style={{fontSize: '1em'}} onClick={() => handleRoleChange('USER', user.id)}>USER</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                            <td className="btn-remove">
                                <button className="hover-image-btn hidden" onClick={() => handleRemove(user.id)}>
                                    <img src={minus} height={25} alt="Remove" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default UserTable;