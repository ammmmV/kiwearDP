import { $authHost, $host } from "./index";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios'

export const registration = async (email, password, name, phone) => {
    const {data} = await $host.post('api/user/registration', {email, password, name, phone})
    console.log('Registration response:', data);
    localStorage.setItem('token', data.token)
    const decoded = jwtDecode(data.token);
    console.log('Decoded registration data:', decoded);
    return decoded;
}

export const login = async (email, password) => {
    const { data } = await $host.post('api/user/login', { email, password })
    console.log('Login response:', data);
    localStorage.setItem('token', data.token)
    const decodedData = jwtDecode(data.token)
    console.log('Decoded login data:', decodedData)
    return decodedData
}

export const check = async () => {
    const { data } = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const fetchUsers = async (email, password, role) => {
    const { data } = await $host.get('api/user/', { email, password, role })
    return data;
}

export const fetchOnePattern = async (id) => {
    const { data } = await $host.get('api/pattern/' + id)
    return data
}

export const deleteUser = async (id) => {
    try {
        const { data } = await $host.delete('api/user/' + id);
        return data;
    } catch (error) {
        console.error("Ошибка при удалении пользователя:", error);
        throw error;
    }
}

export const updateUserRole = async (userId, newRole) => {
    try {
        const response = await $host.put(`api/user/${userId}/role`, { role: newRole });
        return response.data;
    } catch (error) {
        console.error("Ошибка при обновлении роли пользователя:", error);
        throw error;
    }
};

export const updateUser = async (userData) => {
    const { data } = await $authHost.put('api/user/update', userData);
    return data;
}

export const fetchHeaderData = async () => {
    try {
        const { data } = await $authHost.get('api/user/header-data');
        return data;
    } catch (e) {
        console.error("Failed to fetch header data:", e.response?.data?.message || e.message);
        return null;
    }
};