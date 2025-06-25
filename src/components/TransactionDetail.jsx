// src/components/TransactionDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("orderHistory")) || [];
    const found = data.find((o) => o.id.toString() === id);
    setOrder(found);
  }, [id]);

  if (!order) {
    return <p>Transaksi tidak ditemukan</p>;
  }

  return (
    <div className="transaction-detail">
      <h2>🧾 Detail Transaksi</h2>
      <p><strong>ID:</strong> {order.id}</p>
      <p><strong>Tanggal:</strong> {order.date}</p>
      <ul className="history-items">
        {order.items.map((item, i) => (
          <li key={i} className="history-item">
            <img src={item.image} alt={item.title} className="history-img" />
            <div>
              <p>{item.title}</p>
              <p>Rp {item.price.toLocaleString("id-ID")}</p>
            </div>
          </li>
        ))}
      </ul>
      <strong>Total: Rp {order.total.toLocaleString("id-ID")}</strong>
      <br />
      <button onClick={() => navigate(-1)}>⬅️ Kembali</button>
    </div>
  );
}

export default TransactionDetail;
