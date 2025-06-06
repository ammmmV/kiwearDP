import React, { useContext, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';

const Reviews = observer(() => {
    const { review } = useContext(Context);
    
    useEffect(() => {
        review.loadReviews();
    }, [review]);

    return (
        <Container style={{ minHeight: '90vh' }}>
            <div className="reviews-container">
                {review.reviews && review.reviews.map((review, index) => (
                    <div key={index} className="review-card" style={{ 
                        background: '#27282a',
                        color: '#f7f7f7',
                        padding: '20px',
                        marginBottom: '20px',
                        borderRadius: '8px',
                        border: '1px solid #3d3d3d'
                    }}>
                        <div className="review-header" style={{ 
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '10px'
                        }}>
                            <h5>{review.pattern?.name || 'Товар'}</h5>
                            <div className="rating">Оценка: {review.rating}/5</div>
                        </div>
                        <p style={{ margin: 0 }}>{review.comment}</p>
                        <small style={{ color: '#999' }}>
                            {new Date(review.date).toLocaleDateString()}
                        </small>
                    </div>
                ))}
                {(!review.reviews || review.reviews.length === 0) && (
                    <p style={{ color: '#f7f7f7', textAlign: 'center' }}>
                        Отзывов пока нет
                    </p>
                )}
            </div>
        </Container>
    );
});

export default Reviews;