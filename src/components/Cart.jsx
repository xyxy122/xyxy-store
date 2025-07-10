import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import './CartPage.css'

function Checkout({ cart, onCheckoutDone = () => {}, discountActive = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState(location.state?.paymentMethod || "");
  const [error, setError] = useState("");

  const totalAsli = cart.reduce((total, game) => total + game.price, 0);
  const diskon = discountActive ? totalAsli * 0.1 : 0;
  const totalHarga = totalAsli - diskon;

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
      items: cart,
      total: Math.round(totalHarga),
      paymentMethod,
      discountApplied: discountActive,
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
          {cart.map((game, idx) => (
            <li key={idx} className="checkout-item">
              <img src={game.image} alt={game.title} />
              <div>
                <strong>{game.title}</strong>
                <p>Rp {game.price.toLocaleString("id-ID")}</p>
              </div>
            </li>
          ))}
        </ul>

        {discountActive && (
          <p style={{ color: "#00c853", fontWeight: "bold", marginTop: "10px" }}>
            🎉 Diskon 10% aktif! Hemat Rp {diskon.toLocaleString("id-ID")}
          </p>
        )}

        <h3>Total: Rp {totalHarga.toLocaleString("id-ID")}</h3>
      </div>

      <div className="payment-methods">
        <h4>Pilih Metode Pembayaran</h4>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="">-- Pilih --</option>
          <option value="Transfer Bank">Transfer Bank</option>
          <option value="E-Wallet">E-Wallet</option>
          <option value="QRIS">QRIS</option>
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
            <p>Scan kode QR berikut:</p>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/36/QR_code_example.svg"
              alt="QRIS"
              className="qris-img"
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
