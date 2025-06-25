import { useState, useEffect } from "react";

function GameDetail({ game }) {
  const [review, setReview] = useState(null); 
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`review-${game.id}`));
    if (stored) {
      setReview(stored);
      setRating(stored.rating);
      setComment(stored.comment);
    }
  }, [game]);

  const handleSave = () => {
    const newReview = {
      rating,
      comment,
      date: new Date().toLocaleString("id-ID"),
    };

    localStorage.setItem(`review-${game.id}`, JSON.stringify(newReview));
    setReview(newReview);
  };

  return (
    <div className="game-detail">
      <h2>{game.title}</h2>
      <img src={game.image} alt={game.title} />
      <p>Rp {game.price.toLocaleString("id-ID")}</p>

      <div className="review-form">
        <h4>{review ? "Edit Ulasan" : "⭐ Beri Ulasan"}</h4>

        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[5, 4, 3, 2, 1].map((num) => (
            <option key={num} value={num}>
              {num} Bintang
            </option>
          ))}
        </select>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tulis komentarmu..."
        />

        <button onClick={handleSave}>{review ? "Simpan Perubahan" : "Kirim Ulasan"}</button>
      </div>

      {review && (
        <div className="review-list">
          <h5>📋 Ulasan Kamu</h5>
          <div className="review">
            <strong>{review.rating} ⭐</strong>
            <p>{review.comment}</p>
            <small>{review.date}</small>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameDetail;
