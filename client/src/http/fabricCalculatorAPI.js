import { $authHost, $host } from "./index";

// Получение всех записей калькулятора
export const fetchCalculators = async () => {
    const { data } = await $host.get('api/calculator');
    return data;
};

// Получение записи калькулятора по ID
export const fetchOneCalculator = async (id) => {
    const { data } = await $host.get(`api/calculator/${id}`);
    return data;
};

// Получение записей калькулятора по типу одежды
export const fetchCalculatorsByType = async (clothingType) => {
    const { data } = await $host.get(`api/calculator/type/${clothingType}`);
    return data;
};

// Создание новой записи калькулятора (только для админа)
export const createCalculator = async (calculator) => {
    const { data } = await $authHost.post('api/calculator', calculator);
    return data;
};

// Обновление записи калькулятора (только для админа)
export const updateCalculator = async (id, calculator) => {
    const { data } = await $authHost.put(`api/calculator/${id}`, calculator);
    return data;
};

// Удаление записи калькулятора (только для админа)
export const deleteCalculator = async (id) => {
    const { data } = await $authHost.delete(`api/calculator/${id}`);
    return data;
};

// Расчет расхода ткани
export const calculateFabricConsumption = async (calculationData) => {
    const { data } = await $host.post('api/calculator/calculate', calculationData);
    return data;
};