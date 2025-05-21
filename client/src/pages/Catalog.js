import React, { useContext, useEffect, useState } from 'react';
import { Container, Button, Modal, Form } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { fetchPatterns, fetchFabrics, fetchTypes } from "../http/patternAPI";
import ItemList from "../components/ItemList";
import { PatternModal } from '../components/modals/ItemModal';
import styled from 'styled-components';
import filter from '../assets/filters-svgrepo-com.svg'
import FilterModal from '../components/modals/FilterModal'; 

const SearchInput = styled.input`
    background: rgba(39, 40, 42, 0.8);
    border: 1px solid #267b54;
    color: white;
    padding: 10px;
    margin-bottom: 20px;
    width: 100%;
    border-radius: 5px;
    
    &:focus {
        outline: none;
        border-color: #3fc586;
        box-shadow: 0 0 0 2px rgba(63, 197, 134, 0.2);
    }
    
    &::placeholder {
        color: rgba(255, 255, 255, 0.5);
    }
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 0px;
    width: 100%;
    padding-right: 20px;
    overflow-y: auto;
    max-height: calc(100vh - 200px);
    
    &::-webkit-scrollbar {
        width: 8px;
    }
    
    &::-webkit-scrollbar-track {
        background: rgba(39, 40, 42, 0.8);
    }
    
    &::-webkit-scrollbar-thumb {
        background: #267b54;
        border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
        background: #3fc586;
    }
`;

const CatalogLayout = styled.div`
    display: flex;
    gap: 30px;
    margin-top: 20px;
    max-width: 100%;
    height: 100%;
`;

const ProductsContainer = styled.div`
    flex: 1;
    max-width: calc(100% - 210px);
`;

const FilterButton = styled(Button)`
    background: #267b54;
    border-color: #267b54;
    margin-bottom: 20px;
    
    &:hover {
        background: #3fc586;
        border-color: #3fc586;
    }
`;

const Catalog = observer(() => {
    const { pattern } = useContext(Context);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [selectedFabric, setSelectedFabric] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [filteredPatterns, setFilteredPatterns] = useState([]);

    useEffect(() => {
        fetchPatterns(null, null, 1, 100).then(data => {
            pattern.setPatterns(data.rows);
            setFilteredPatterns(data.rows);
        });
        fetchFabrics().then(data => pattern.setFabrics(data));
        fetchTypes().then(data => pattern.setTypes(data));
    }, []);

    const handleFilter = () => {
        let filtered = [...pattern.patterns];

        if (priceRange.min) {
            filtered = filtered.filter(item => Number(item.price) >= Number(priceRange.min));
        }
        if (priceRange.max) {
            filtered = filtered.filter(item => Number(item.price) <= Number(priceRange.max));
        }

        if (selectedFabric) {
            filtered = filtered.filter(item => item.fabricId === Number(selectedFabric));
        }

        if (selectedType) {
            filtered = filtered.filter(item => item.typeId === Number(selectedType));
        }

        setFilteredPatterns(filtered);
        setShowFilter(false);
    };

    const filterItemsBySearch = (items) => {
        if (!searchQuery) return items;
        return items.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    };

    const resetFilters = () => {
        setPriceRange({ min: '', max: '' });
        setSelectedFabric('');
        setSelectedType('');
        setFilteredPatterns(pattern.patterns);
        setShowFilter(false);
    };

    return (
        <Container>
            <CatalogLayout>
                <ProductsContainer>
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                        <SearchInput
                            type="text"
                            placeholder="Поиск..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FilterButton onClick={() => setShowFilter(true)} style={{background: "none", border: "none"}}>
                            <img src={filter} alt="Фильтры" style={{ width: '30px', height: 'auto' }} />
                        </FilterButton>
                    </div>
                    <ContentContainer>
                        <ItemList 
                            items={filterItemsBySearch(filteredPatterns)} 
                            ItemModal={PatternModal}
                        />
                    </ContentContainer>
                </ProductsContainer>
            </CatalogLayout>

            <FilterModal 
                show={showFilter}
                onHide={() => setShowFilter(false)}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedFabric={selectedFabric}
                setSelectedFabric={setSelectedFabric}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                onFilter={handleFilter}
                onReset={resetFilters}
                fabrics={pattern.fabrics}
                types={pattern.types}
            />
        </Container>
    );
});

export default Catalog;