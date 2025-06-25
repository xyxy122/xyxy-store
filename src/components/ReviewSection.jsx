import { useState, useEffect } from "react";
import "./History.css";

function ReviewSection({ gameId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`review-${gameId}`)) || null;
    if (stored) {
      setReviews([stored]);
      setHasReviewed(true);
    }
  }, [gameId]);

  const handleReview = () => {
    const newReview = {
      rating,
      comment,
      date: new Date().toLocaleString("id-ID"),
    };
    localStorage.setItem(`review-${gameId}`, JSON.stringify(newReview));
    setReviews([newReview]);
    setHasReviewed(true);
    setComment("");
    setRating(5);
  };

  return (
    <div className="review-form">
      {!hasReviewed ? (
        <>
          <h4>Beri Ulasan</h4>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} Bintang</option>
            ))}
          </select>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tulis komentar..."
          />
          <button onClick={handleReview}>Kirim Ulasan</button>
        </>
      ) : (
        <div className="review-list">
          <h5>Ulasan Kamu</h5>
          {reviews.map((r, i) => (
            <div key={i} className="review">
              <strong>{r.rating} ⭐</strong>
              <p>{r.comment}</p>
              <small>{r.date}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewSection;
