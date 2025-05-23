import { $authHost, $host } from "./index";

export const createType = async (type) => {
    const { data } = await $authHost.post('api/type', type)
    return data
}

export const fetchTypes = async () => {
    const { data } = await $host.get('api/type')
    return data
}

export const createFabric = async (fabric) => {
    const { data } = await $authHost.post('api/fabric', fabric)
    return data
}

export const fetchFabrics = async () => {
    const { data } = await $host.get('api/fabric')
    return data
}

export const createPattern = async (pattern) => {
    const { data } = await $authHost.post('api/pattern', pattern)
    return data
}

export const fetchPatterns = async (typeId, fabricId, page, limit = 5) => {
    const { data } = await $host.get('api/pattern', {
        params: {
            typeId, fabricId, page, limit
        }
    })
    return data
}

export const fetchOnePattern = async (id) => {
    const { data } = await $host.get('api/pattern', id)
    return data
}

export const fetchPattern = async (patternId) => {
    try {
        const { data } = await $host.get(`api/pattern/patt`)
        return data
    } catch (error) {
        console.error("Ошибка при получении паттернов:", error);
        throw error;
    }
}

export const deletePattern = async (id) => {
    try {
        const { data } = await $host.delete('api/pattern/' + id);
        return data;
    } catch (error) {
        console.error("Ошибка при удалении:", error);
        throw error;
    }
}

export const updatePattern = async (patternId, updatedData) => {
    try {
        const { data } = await $host.put(`/api/pattern/${patternId}`, updatedData);
        return data;
    } catch (error) {
        console.error("Ошибка при обновлении паттерна:", error);
        throw error;
    }
};

export const addBasketItem = async (basket) => {
    const { data } = await $authHost.post('api/basket', basket)
    return data
};

export const removeFromBasket = async (id) => {
    const { data } = await $authHost.post('api/basket', id)
    return data
};