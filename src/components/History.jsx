import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./History.css";

function History() {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState({});
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [newReviewText, setNewReviewText] = useState("");
  const [newRating, setNewRating] = useState(5);

  // State untuk filter
  const [filterDate, setFilterDate] = useState(
    () => localStorage.getItem("history_filter_date") || "semua"
  );
  const [filterPayment, setFilterPayment] = useState(
    () => localStorage.getItem("history_filter_payment") || "semua"
  );
  const [filterReview, setFilterReview] = useState(
    () => localStorage.getItem("history_filter_review") || "semua"
  );

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orderHistory")) || [];
    setOrders(storedOrders);

    const storedReviews = {};
    storedOrders.forEach((order) => {
      const review = localStorage.getItem(`review-${order.id}`);
      if (review) {
        storedReviews[order.id] = JSON.parse(review);
      }
    });
    setReviews(storedReviews);
  }, []);

  // Simpan filter ke localStorage saat berubah
  useEffect(() => {
    localStorage.setItem("history_filter_date", filterDate);
  }, [filterDate]);

  useEffect(() => {
    localStorage.setItem("history_filter_payment", filterPayment);
  }, [filterPayment]);

  useEffect(() => {
    localStorage.setItem("history_filter_review", filterReview);
  }, [filterReview]);

  // Helper functions untuk tanggal
  const isToday = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isThisWeek = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay());
    return date >= firstDayOfWeek && date <= today;
  };

  const isThisMonth = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    let include = true;

    // Filter by tanggal
    if (filterDate === "hari_ini" && !isToday(order.date)) include = false;
    if (filterDate === "minggu_ini" && !isThisWeek(order.date)) include = false;
    if (filterDate === "bulan_ini" && !isThisMonth(order.date)) include = false;

    // Filter by metode pembayaran
    if (
      filterPayment !== "semua" &&
      order.paymentMethod?.toLowerCase() !== filterPayment.toLowerCase()
    ) {
      include = false;
    }

    // Filter by ulasan
    const hasReview = Boolean(reviews[order.id]);
    if (filterReview === "sudah" && !hasReview) include = false;
    if (filterReview === "belum" && hasReview) include = false;

    return include;
  });

  const handleEditReview = (orderId, currentReview) => {
    if (currentReview) {
      setNewReviewText(currentReview.comment);
      setNewRating(currentReview.rating);
    } else {
      setNewReviewText("");
      setNewRating(5);
    }
    setEditingReviewId(orderId);
  };

  const handleSubmitReview = (orderId) => {
    const updatedReview = {
      rating: newRating,
      comment: newReviewText,
      date: new Date().toLocaleString("id-ID"),
    };

    localStorage.setItem(`review-${orderId}`, JSON.stringify(updatedReview));
    setReviews({
      ...reviews,
      [orderId]: updatedReview,
    });

    setEditingReviewId(null);
  };

  return (
    <div className="history-container">
      <h2>📜 Riwayat Transaksi</h2>

      {/* Filter Section */}
      <div className="filters">
        <select
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        >
          <option value="semua">Semua Tanggal</option>
          <option value="hari_ini">Hari Ini</option>
          <option value="minggu_ini">Minggu Ini</option>
          <option value="bulan_ini">Bulan Ini</option>
        </select>

        <select
          value={filterPayment}
          onChange={(e) => setFilterPayment(e.target.value)}
        >
          <option value="semua">Semua Metode</option>
          <option value="Transfer Bank">Transfer Bank</option>
          <option value="E-Wallet">E-Wallet</option>
          <option value="QRIS">QRIS</option>
          <option value="COD">COD</option>
        </select>

        <select
          value={filterReview}
          onChange={(e) => setFilterReview(e.target.value)}
        >
          <option value="semua">Semua Ulasan</option>
          <option value="sudah">Sudah Diulas</option>
          <option value="belum">Belum Diulas</option>
        </select>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <p>Tidak ada transaksi yang sesuai dengan filter.</p>
      ) : (
        filteredOrders.map((order) => {
          const existingReview = reviews[order.id];
          const isEditing = editingReviewId === order.id;

          return (
            <div key={order.id} className="order-card">
              <h4>{order.date}</h4>

              <ul className="history-items">
                {order.items.map((item, idx) => (
                  <li key={idx} className="history-item">
                    <img src={item.image} alt={item.title} className="history-img" />
                    <div>
                      <strong>{item.title}</strong>
                      <p>Rp {item.price.toLocaleString("id-ID")}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <h3>Total: Rp {order.total.toLocaleString("id-ID")}</h3>
              <p><strong>Metode:</strong> {order.paymentMethod || "-"}</p>

              {/* Review Section */}
              {!isEditing ? (
                existingReview ? (
                  <div className="review-display">
                    <h4>📋 Ulasan Kamu:</h4>
                    <div className="review-content">
                      <p>⭐ Rating: {existingReview.rating}/5</p>
                      <p>"{existingReview.comment}"</p>
                      <small>{existingReview.date}</small>
                    </div>
                    <button
                      className="edit-button"
                      onClick={() => handleEditReview(order.id, existingReview)}
                    >
                      Edit Ulasan
                    </button>
                  </div>
                ) : (
                  <button
                    className="add-review-button"
                    onClick={() => handleEditReview(order.id)}
                  >
                    Beri Ulasan
                  </button>
                )
              ) : (
                <div className="review-form">
                  <h4>{existingReview ? "✏️ Edit Ulasan" : "⭐ Beri Ulasan"}</h4>

                  <label>Pilih Rating:</label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                  >
                    {[5, 4, 3, 2, 1].map((num) => (
                      <option key={num} value={num}>
                        {num} Bintang
                      </option>
                    ))}
                  </select>

                  <textarea
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    placeholder="Tulis pengalaman atau pendapatmu tentang pembelian ini..."
                  />

                  <button onClick={() => handleSubmitReview(order.id)}>
                    {existingReview ? "Simpan Perubahan" : "Kirim Ulasan"}
                  </button>
                </div>
              )}

              <Link to={`/history/${order.id}`}>
                <button className="detail-button">Lihat Detail</button>
              </Link>
            </div>
          );
        })
      )}
    </div>
  );
}

export default History;