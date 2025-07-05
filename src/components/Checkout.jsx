import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Checkout({ cart, onCheckoutDone, discountActive }) {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [error, setError] = useState("");

  // Hitung harga per item sesuai daily point
  const adjustedCart = cart.map(item => ({
    ...item,
    price: discountActive ? 10000 : 8500
  }));

  // Total awal
  const initialTotal = adjustedCart.reduce((sum, item) => sum + item.price, 0);

  // Jika QRIS dipilih, potong 10%
  const totalHarga = paymentMethod === "QRIS"
    ? Math.round(initialTotal * 0.8)
    : initialTotal;

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  const handleFinish = () => {
    if (!paymentMethod) {
      setError("Pilih metode pembayaran terlebih dahulu.");
      return;
    }

    const order = {
      id: Date.now(),
      date: new Date().toLocaleString("id-ID"),
      items: adjustedCart,
      total: totalHarga,
      paymentMethod,
      discountApplied: discountActive || paymentMethod === "QRIS",
    };

    const history = JSON.parse(localStorage.getItem("orderHistory")) || [];
    localStorage.setItem("orderHistory", JSON.stringify([order, ...history]));

    onCheckoutDone();
    toast.success("Pembayaran berhasil! Pesanan dicatat.");
    navigate("/history");
  };

  return (
    <div className="checkout-container">
      <h2>💳 Checkout</h2>

      <div className="summary-box">
        <h4>🧾 Produk yang Dibeli:</h4>
        <ul className="checkout-list">
          {adjustedCart.map((game, idx) => (
            <li key={idx} className="checkout-item">
              <img src={game.image} alt={game.title} />
              <div>
                <strong>{game.title}</strong>
                <p>Rp {game.price.toLocaleString("id-ID")}</p>
              </div>
            </li>
          ))}
        </ul>
        <h3>
          Total: Rp {totalHarga.toLocaleString("id-ID")}
          {paymentMethod === "QRIS" && <span> (diskon 10% QRIS)</span>}
        </h3>
      </div>

      <div className="payment-methods">
        <h4>Pilih Metode Pembayaran</h4>
        <select
          value={paymentMethod}
          onChange={(e) => {
            setPaymentMethod(e.target.value);
            setError("");
          }}
        >
          <option value="">-- Pilih --</option>
          <option value="Transfer Bank">Transfer Bank</option>
          <option value="E-Wallet">E-Wallet</option>
          <option value="QRIS">QRIS (Diskon 10%)</option>
          <option value="COD">COD (Bayar di Tempat)</option>
        </select>
        {error && <p className="error">{error}</p>}
      </div>

      <div className="payment-details">
        <h4>📋 Instruksi Pembayaran</h4>
        {paymentMethod === "Transfer Bank" && (
          <p>Transfer ke: <strong>123-456-7890 (BCA)</strong></p>
        )}
        {paymentMethod === "E-Wallet" && (
          <p>Kirim ke: <strong>0812-3456-7890 (OVO / DANA / GOPAY)</strong></p>
        )}
        {paymentMethod === "QRIS" && (
          <div>
            <p>Scan kode QR berikut untuk diskon tambahan 10%:</p>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/36/QR_code_example.svg"
              alt="QRIS"
              className="qris-img"
              style={{ width: "150px", marginTop: "10px" }}
            />
          </div>
        )}
        {paymentMethod === "COD" && (
          <p>Bayar saat pesanan sampai ke rumah kamu 🚚</p>
        )}
      </div>

      <button onClick={handleFinish}>Selesaikan Pembayaran</button>
    </div>
  );
}

export default Checkout;
