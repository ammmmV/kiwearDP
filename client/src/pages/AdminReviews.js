import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Form } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import ReviewStore from '../store/ReviewStore';

const AdminReviews = observer(() => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRating, setFilterRating] = useState('');

    useEffect(() => {
        ReviewStore.loadReviews();
    }, []);

    const handleDelete = async (reviewId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
            try {
                await ReviewStore.deleteReview(reviewId);
                alert('Отзыв успешно удален');
            } catch (error) {
                alert('Ошибка при удалении отзыва');
            }
        }
    };

    const filteredReviews = ReviewStore.reviews.filter(review => {
        const matchesSearch = review.pattern?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            review.comment.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRating = filterRating === '' || review.rating === parseInt(filterRating);
        return matchesSearch && matchesRating;
    });

    return (
        <Container style={{ minHeight: '90vh', color: '#f7f7f7' }}>
            <h2 className="mt-4 mb-4">Управление отзывами</h2>
            
            <div className="mb-4" style={{ display: 'flex', gap: '20px' }}>
                <Form.Group style={{ flex: 1 }}>
                    <Form.Control
                        type="text"
                        placeholder="Поиск по названию товара или комментарию"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ background: '#27282a', color: '#f7f7f7', border: '1px solid #3d3d3d' }}
                    />
                </Form.Group>
                
                <Form.Group style={{ width: '200px' }}>
                    <Form.Select
                        value={filterRating}
                        onChange={(e) => setFilterRating(e.target.value)}
                        style={{ background: '#27282a', color: '#f7f7f7', border: '1px solid #3d3d3d' }}
                    >
                        <option value="">Все оценки</option>
                        <option value="5">5 звезд</option>
                        <option value="4">4 звезды</option>
                        <option value="3">3 звезды</option>
                        <option value="2">2 звезды</option>
                        <option value="1">1 звезда</option>
                    </Form.Select>
                </Form.Group>
            </div>

            <Table striped bordered hover style={{ background: '#27282a', color: '#f7f7f7' }}>
                <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Товар</th>
                        <th>Пользователь</th>
                        <th>Оценка</th>
                        <th>Комментарий</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReviews.map((review) => (
                        <tr key={review.id}>
                            <td>{new Date(review.date).toLocaleDateString()}</td>
                            <td>{review.pattern?.name || 'Товар не найден'}</td>
                            <td>{review.user?.email || 'Пользователь не найден'}</td>
                            <td>{review.rating}/5</td>
                            <td>{review.comment}</td>
                            <td>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(review.id)}
                                >
                                    Удалить
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {filteredReviews.length === 0 && (
                <div className="text-center mt-4">
                    <p>Отзывы не найдены</p>
                </div>
            )}
        </Container>
    );
});

export default AdminReviews;