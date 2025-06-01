import React, { useEffect, useState, useContext } from "react";
import { Container, Table, Button, Form, ButtonGroup } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { toast } from "react-custom-alert";

const AdminReviews = observer(() => {
  const { review } = useContext(Context);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    review.loadReviews({
      search: searchTerm,
      rating: filterRating,
      status: filterStatus,
    });
  }, [review, searchTerm, filterRating, filterStatus]);

  const handleDelete = async (reviewId) => {
    if (window.confirm("Вы уверены, что хотите удалить этот отзыв?")) {
      try {
        await review.deleteReview(reviewId);
        toast.success("Отзыв успешно удален");
      } catch (error) {
        toast.error("Ошибка при удалении отзыва");
      }
    }
  };

  const handleStatusChange = async (reviewId, newStatus) => {
    try {
      await review.updateReviewStatus(reviewId, newStatus);
      toast.success("Статус отзыва успешно обновлен");
    } catch (error) {
      toast.error("Ошибка при обновлении статуса отзыва: " + error.message);
    }
  };

  const filteredReviews =
    Array.isArray(review.reviews) && review.reviews.length > 0
      ? review.reviews.filter((review) => {
          if (!review) return false;
          const matchesSearch =
            review.pattern?.name
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            review.comment?.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesRating =
            filterRating === "" || review.rating === parseInt(filterRating);
          const matchesStatus =
            filterStatus === "" || review.status === filterStatus;
          return matchesSearch && matchesRating && matchesStatus;
        })
      : [];

  return (
    <Container style={{ minHeight: "90vh", color: "#f7f7f7" }}>
      <h2 className="mt-4 mb-4">Управление отзывами</h2>

      <div className="mb-4" style={{ display: "flex", gap: "20px" }}>
        <Form.Group style={{ flex: 1 }}>
          <Form.Control
            type="text"
            placeholder="Поиск по названию товара или комментарию"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: "#27282a",
              color: "#f7f7f7",
              border: "1px solid #3d3d3d",
            }}
          />
        </Form.Group>

        <Form.Group style={{ width: "200px" }}>
          <Form.Select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            style={{
              background: "#27282a",
              color: "#f7f7f7",
              border: "1px solid #3d3d3d",
            }}
          >
            <option value="">Все оценки</option>
            <option value="5">5 звезд</option>
            <option value="4">4 звезды</option>
            <option value="3">3 звезды</option>
            <option value="2">2 звезды</option>
            <option value="1">1 звезда</option>
          </Form.Select>
        </Form.Group>

        <Form.Group style={{ width: "200px" }}>
          <Form.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              background: "#27282a",
              color: "#f7f7f7",
              border: "1px solid #3d3d3d",
            }}
          >
            <option value="">Все статусы</option>
            <option value="PENDING">На рассмотрении</option>
            <option value="APPROVED">Одобрено</option>
            <option value="REJECTED">Отклонено</option>
          </Form.Select>
        </Form.Group>
      </div>

      <Table
        striped
        bordered
        hover
        style={{ background: "#27282a", color: "#f7f7f7" }}
      >
        <thead>
          <tr>
            <th>Дата</th>
            <th>Товар</th>
            <th>Пользователь</th>
            <th>Оценка</th>
            <th>Комментарий</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredReviews.map((review) => (
            <tr key={review.id}>
              <td>{new Date(review.date).toLocaleDateString()}</td>
              <td>{review.pattern?.name || "Товар не найден"}</td>
              <td>{review.user?.email || "Пользователь не найден"}</td>
              <td>{review.rating}/5</td>
              <td>{review.comment}</td>
              <td>
                <ButtonGroup size="sm">
                  <Button
                    variant={
                      review.status === "APPROVED"
                        ? "success"
                        : "outline-success"
                    }
                    onClick={() => handleStatusChange(review.id, "APPROVED")}
                  >
                    Одобрить
                  </Button>
                  <Button
                    variant={
                      review.status === "REJECTED" ? "danger" : "outline-danger"
                    }
                    onClick={() => handleStatusChange(review.id, "REJECTED")}
                  >
                    Отклонить
                  </Button>
                </ButtonGroup>
              </td>
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
