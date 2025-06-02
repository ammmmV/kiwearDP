import React, { useContext, useState, useEffect, useMemo } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import '../styles/Style.css';
import { fetchFabrics } from '../http/patternAPI';
import { calculateFabricConsumption as calculateAPI, fetchCalculators } from '../http/fabricCalculatorAPI';
import { toast } from 'react-custom-alert';
import { Spinner } from'react-bootstrap';
import styled from 'styled-components';

// Helper function to parse size string like "XS (42)" into a number
const parseSizeValueFromName = (nameString) => {
    if (!nameString) return null;
    const match = nameString.match(/\((\d+)\)/);
    return match ? parseInt(match[1], 10) : null;
};

// Helper function to parse height string like "150-160 см" or "190+ см"
const parseHeightRangeFromName = (nameString) => {
    if (!nameString) return { min: NaN, max: NaN };
    const rangeMatch = nameString.match(/(\d+)-(\d+)/);
    if (rangeMatch) {
        return { min: parseInt(rangeMatch[1], 10), max: parseInt(rangeMatch[2], 10) };
    }
    const plusMatch = nameString.match(/(\d+)\+/);
    if (plusMatch) {
        return { min: parseInt(plusMatch[1], 10), max: Infinity }; // Or a very large number
    }
    return { min: NaN, max: NaN }; // Should not happen with current data
};

const StyledContainer = styled(Container)`
    color: #f7f7f7;
    padding: 20px;
`;

const StyledCard = styled(Card)`
    background: #333538;
    color: #f7f7f7;
    border: 1px solid #444;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const StyledFormLabel = styled(Form.Label)`
    color: #f7f7f7;
    margin-top: 10px;
    margin-bottom: 5px;
`;

const StyledFormControl = styled(Form.Control)`
    background-color: #333538;
    color: #f7f7f7;
    border: 1px solid #444;
    &:focus {
        background-color: #333538;
        color: #f7f7f7;
        border-color: #43d08e;
        box-shadow: 0 0 0 0.25rem rgba(67, 208, 142, 0.25);
    }
    &::placeholder {
        color: #dcdcdc !important;
    }
`;

const StyledFormSelect = styled(Form.Select)`
    background-color: #333538;
    color: #f7f7f7;
    border: 1px solid #444;
    &:focus {
        background-color: #333538;
        color: #f7f7f7;
        border-color: #43d08e;
        box-shadow: 0 0 0 0.25rem rgba(67, 208, 142, 0.25);
    }
    option {
        background-color: #333538;
        color: #f7f7f7;
    }
    // Styles for disabled state
    &:disabled {
        background-color: #44464a; // Slightly lighter dark background for disabled state
        color: #a0a0a0; // Grey out the text
        border-color: #555;
        opacity: 1; // Prevent Bootstrap's default opacity reduction for disabled elements
    }
`;

const StyledButton = styled(Button)`
    background: linear-gradient(135deg, #267b54, #43d08e) !important;
    border: none !important;
    color: #f7f7f7 !important;
    &:hover, &:focus {
        background: linear-gradient(135deg, #267b54, #43d08e) !important;
        box-shadow: 0 0 0 0.25rem rgba(67, 208, 142, 0.25);
    }
`;

const StyledResultCard = styled(Card)`
    background-color: #2e3033; /* Немного светлее, чем основной фон карточки, но темнее фона */
    color: #f7f7f7;
    border: 1px solid #198754; /* Зеленая рамка */
    border-radius: 12px;
    margin-top: 20px;
    padding: 15px;
`;

const StyledSpinnerContainer = styled(Container)`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #27282a; /* Фоновый цвет, как у модального окна */
`;

const StyledFormText = styled(Form.Text)`
    color: #a0a0a0 !important; // Light grey for muted text
`;

const StyledErrorText = styled(Form.Text)`
    color: #ff6b6b !important; // A softer red for error messages
`;

const FabricCalculator = observer(() => {
    const { fabric } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        clothingType: '',
        fabricType: '',
        height: '',
        size: '',
        quantity: 1
    });
    const [result, setResult] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [calculators, setCalculators] = useState([]);
    const [availableClothingTypes, setAvailableClothingTypes] = useState([]);

    // Filtered options for dropdowns
    const [filteredFabricTypes, setFilteredFabricTypes] = useState([]);
    const [filteredHeightOptions, setFilteredHeightOptions] = useState([]);
    const [filteredSizeOptions, setFilteredSizeOptions] = useState([]);

    // Static sizes and heights from your component
    const staticSizes = useMemo(() => [
        { id: 1, name: 'XS (42)' },
        { id: 2, name: 'S (44)' },
        { id: 3, name: 'M (46)' },
        { id: 4, name: 'L (48)' },
        { id: 5, name: 'XL (50)' },
        { id: 6, name: 'XXL (52)' }
    ], []);

    const staticHeights = useMemo(() => [
        { id: 1, name: '140-150 см' },
        { id: 2, name: '150-160 см' },
        { id: 3, name: '160-170 см' },
        { id: 4, name: '170-180 см' },
        { id: 5, name: '180-190 см' },
        { id: 6, name: '190+ см' }
    ], []);

    // Memoized parsed versions for efficient filtering
    const parsedClientSizes = useMemo(() => staticSizes.map(s => ({
        ...s,
        value: parseSizeValueFromName(s.name)
    })), [staticSizes]);

    const parsedClientHeights = useMemo(() => staticHeights.map(h => ({
        ...h,
        ...parseHeightRangeFromName(h.name)
    })), [staticHeights]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fabricsData = await fetchFabrics();
                fabric.setFabrics(fabricsData || []); // Ensure it's an array

                const calculatorsData = await fetchCalculators();
                setCalculators(calculatorsData || []); // Ensure it's an array

                if (calculatorsData && calculatorsData.length > 0) {
                    const uniqueClothingTypes = [...new Set(calculatorsData.map(calc => calc.clothing_type))];
                    const clothingTypesArray = uniqueClothingTypes.map((type, index) => ({
                        id: index + 1, // Or use a more stable ID if possible
                        name: type
                    }));
                    setAvailableClothingTypes(clothingTypesArray);
                } else {
                    setAvailableClothingTypes([]);
                }
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                toast.error('Ошибка при загрузке данных. Пожалуйста, обновите страницу.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [fabric]); // Removed empty dependency array, fabric store might change

    // Effect to filter options when clothingType or calculators change
    useEffect(() => {
        if (!formData.clothingType) {
            setFilteredFabricTypes([]);
            setFilteredHeightOptions([]);
            setFilteredSizeOptions([]);
            return;
        }

        const selectedClothingTypeName = availableClothingTypes.find(
            type => type.id === parseInt(formData.clothingType)
        )?.name;

        if (!selectedClothingTypeName || !calculators || calculators.length === 0) {
            setFilteredFabricTypes([]);
            setFilteredHeightOptions([]);
            setFilteredSizeOptions([]);
            return;
        }

        const relevantCalculators = calculators.filter(
            calc => calc.clothing_type === selectedClothingTypeName
        );

        if (relevantCalculators.length === 0) {
            setFilteredFabricTypes([]);
            setFilteredHeightOptions([]);
            setFilteredSizeOptions([]);
            return;
        }

        // Filter Fabric Types
        const allowedFabricIds = new Set(relevantCalculators.map(calc => calc.fabricId));
        setFilteredFabricTypes(
            (fabric.fabrics || []).filter(f => allowedFabricIds.has(f.id))
        );

        // Filter Height Options
        setFilteredHeightOptions(
            parsedClientHeights.filter(clientHeight =>
                !isNaN(clientHeight.min) && // Ensure min is a number
                relevantCalculators.some(calc =>
                    Math.max(calc.height_min, clientHeight.min) <= Math.min(calc.height_max, clientHeight.max)
                )
            )
        );

        // Filter Size Options
        setFilteredSizeOptions(
            parsedClientSizes.filter(clientSize =>
                clientSize.value !== null && // Ensure value is parsed
                relevantCalculators.some(calc =>
                    calc.size_min <= clientSize.value && clientSize.value <= calc.size_max
                )
            )
        );

    }, [formData.clothingType, calculators, fabric.fabrics, availableClothingTypes, parsedClientHeights, parsedClientSizes]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        const newFormData = {
            ...formData,
            [name]: value
        };

        // If clothingType changes, reset dependent fields
        if (name === 'clothingType') {
            newFormData.fabricType = '';
            newFormData.height = '';
            newFormData.size = '';
            setResult(null); // also clear previous result
            setShowResult(false);
        }
        // If fabricType changes, potentially reset height and size if they become incompatible (more complex logic, for now just reset)
        // For simplicity, we are resetting them primarily when clothingType changes.
        // You might want to add more granular resets if a fabric choice invalidates a height/size.

        setFormData(newFormData);
    };

    const calculateFabricConsumption = async () => {
        try {
            const selectedClothingTypeName = availableClothingTypes.find(type => type.id === parseInt(formData.clothingType))?.name;
            const selectedFabricName = (fabric.fabrics || []).find(f => f.id === parseInt(formData.fabricType))?.name;
            const selectedSizeName = staticSizes.find(size => size.id === parseInt(formData.size))?.name;
            const selectedHeightName = staticHeights.find(height => height.id === parseInt(formData.height))?.name;
            const selectedSizeId = parseInt(formData.size);
            const selectedHeightId = parseInt(formData.height);

            if (!formData.clothingType || !formData.fabricType || !formData.height || !formData.size) {
                toast.error('Пожалуйста, заполните все поля');
                return;
            }

           
            const hasCalculatorEntry = calculators.some(calc =>
                calc.clothing_type === selectedClothingTypeName &&
                calc.fabricId === parseInt(formData.fabricType)
            );

            if (!hasCalculatorEntry) {
                toast.error('Для выбранной комбинации типа одежды и ткани нет точных данных для расчета. Проверьте выбор.');
                return;
            }

            const selectedSizeObject = parsedClientSizes.find(size => size.id === selectedSizeId);
            const actualSizeValue = selectedSizeObject ? selectedSizeObject.value : null;

            // Получаем фактический минимальный рост из staticHeights
            const selectedHeightObject = parsedClientHeights.find(height => height.id === selectedHeightId);
            const actualHeightMin = selectedHeightObject ? selectedHeightObject.min : null;
            const quantity = parseInt(formData.quantity) || 1;


            const response = await calculateAPI({
                clothing_type: selectedClothingTypeName,
                fabricId: parseInt(formData.fabricType), // Send fabric_id
                height: actualHeightMin, // Sending ID, ensure API understands this
                size: actualSizeValue,     // Sending ID, ensure API understands this
                quantity: quantity
            });

            setResult({
                clothingType: selectedClothingTypeName,
                fabricType: selectedFabricName,
                size: selectedSizeName,
                height: selectedHeightName,
                quantity: quantity,
                consumption: response.consumption
            });
            setShowResult(true);
        } catch (error) {
            console.error('Ошибка при расчете расхода ткани:', error);
            const errorMessage = error.response?.data?.message || 'Произошла ошибка при расчете. Пожалуйста, попробуйте еще раз.';
            toast.error(errorMessage);
        }
    };

    if (loading) {
        return (
            <StyledSpinnerContainer>
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Загрузка...</span>
                </Spinner>
            </StyledSpinnerContainer>
        );
    }

    return (
        <StyledContainer className="mt-4 mb-4">
            <h2 className="text-center mb-4">Калькулятор расхода ткани</h2>
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <StyledCard className="p-4 shadow-sm">
                        <Form>
                            <Form.Group className="mb-3">
                                <StyledFormLabel>Тип одежды</StyledFormLabel>
                                <StyledFormSelect
                                    name="clothingType"
                                    value={formData.clothingType}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Выберите тип одежды</option>
                                    {availableClothingTypes.map(type => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </StyledFormSelect>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <StyledFormLabel>Тип ткани</StyledFormLabel>
                                <StyledFormSelect
                                    name="fabricType"
                                    value={formData.fabricType}
                                    onChange={handleInputChange}
                                    disabled={!formData.clothingType || filteredFabricTypes.length === 0}
                                >
                                    <option value="">Выберите тип ткани</option>
                                    {filteredFabricTypes.map(fabricItem => (
                                        <option key={fabricItem.id} value={fabricItem.id}>{fabricItem.name}</option>
                                    ))}
                                </StyledFormSelect>
                                {!formData.clothingType && <StyledFormText>Сначала выберите тип одежды</StyledFormText>}
                                {formData.clothingType && filteredFabricTypes.length === 0 && calculators.length > 0 && <StyledErrorText>Нет доступных тканей для этого типа одежды</StyledErrorText>}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <StyledFormLabel>Рост</StyledFormLabel>
                                <StyledFormSelect
                                    name="height"
                                    value={formData.height}
                                    onChange={handleInputChange}
                                    disabled={!formData.clothingType || filteredHeightOptions.length === 0}
                                >
                                    <option value="">Выберите рост</option>
                                    {filteredHeightOptions.map(height => (
                                        <option key={height.id} value={height.id}>{height.name}</option>
                                    ))}
                                </StyledFormSelect>
                                {!formData.clothingType && <StyledFormText>Сначала выберите тип одежды</StyledFormText>}
                                {formData.clothingType && filteredHeightOptions.length === 0 && calculators.length > 0 && <StyledErrorText>Нет доступных вариантов роста для этого типа одежды</StyledErrorText>}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <StyledFormLabel>Размер</StyledFormLabel>
                                <StyledFormSelect
                                    name="size"
                                    value={formData.size}
                                    onChange={handleInputChange}
                                    disabled={!formData.clothingType || filteredSizeOptions.length === 0}
                                >
                                    <option value="">Выберите размер</option>
                                    {filteredSizeOptions.map(size => (
                                        <option key={size.id} value={size.id}>{size.name}</option>
                                    ))}
                                </StyledFormSelect>
                                {!formData.clothingType && <StyledFormText>Сначала выберите тип одежды</StyledFormText>}
                                {formData.clothingType && filteredSizeOptions.length === 0 && calculators.length > 0 && <StyledErrorText>Нет доступных размеров для этого типа одежды</StyledErrorText>}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <StyledFormLabel>Количество</StyledFormLabel>
                                <StyledFormControl
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    min="1"
                                />
                            </Form.Group>

                            <div className="d-grid gap-2">
                                <StyledButton
                                    variant="primary"
                                    onClick={calculateFabricConsumption}
                                    className="mt-3"
                                    disabled={!formData.clothingType || !formData.fabricType || !formData.height || !formData.size}
                                >
                                    Рассчитать
                                </StyledButton>
                            </div>
                        </Form>

                        {showResult && result && (
                            <StyledResultCard>
                                <h4 className="text-center mb-3">Результат расчета</h4>
                                <p><strong>Тип одежды:</strong> {result.clothingType}</p>
                                <p><strong>Тип ткани:</strong> {result.fabricType}</p>
                                <p><strong>Размер:</strong> {result.size}</p>
                                <p><strong>Рост:</strong> {result.height}</p>
                                <p><strong>Количество:</strong> {result.quantity} шт.</p>
                                <h5 className="text-center mt-3">Примерный расход ткани: <span style={{ color: '#43d08e' }}>{result.consumption} м</span></h5>
                                <p className="small text-center mt-2">Расчет является приблизительным и может отличаться в зависимости от особенностей выкройки и ширины ткани.</p>
                            </StyledResultCard>
                        )}
                    </StyledCard>
                </Col>
            </Row>
        </StyledContainer>
    );
});

export default FabricCalculator;