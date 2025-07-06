import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Checkout.css";

function Checkout({ cart, setCart, onCheckoutDone, discountActive, user }) {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [error, setError] = useState("");

  // Simpan cart di localStorage agar kalau refresh tetap ada
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    // load cart dari localStorage jika refresh
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      setCart(savedCart);
    }
  }, [setCart]);

  // Kalau keranjang kosong redirect
  useEffect(() => {
    if (!cart || cart.length === 0) navigate("/cart");
  }, [cart, navigate]);

  const canGetDailyDiscount = user && discountActive;

  const adjustedCart = cart.map((item) => ({
    ...item,
    price: canGetDailyDiscount ? 8500 : 10000,
  }));

  let initialTotal = adjustedCart.reduce((sum, item) => sum + item.price, 0);
  const totalHarga = paymentMethod === "QRIS" ? Math.round(initialTotal * 0.9) : initialTotal;

  const handleRemoveItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.info("Item dihapus dari keranjang.");
  };

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
      discountApplied: canGetDailyDiscount || paymentMethod === "QRIS",
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
              <button
                style={{
                  marginLeft: "10px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
                onClick={() => handleRemoveItem(game.id)}
              >
                ❌ Hapus
              </button>
            </li>
          ))}
        </ul>
        <h3>
          Total: Rp {totalHarga.toLocaleString("id-ID")}
          {paymentMethod === "QRIS" && <span> (diskon 10% QRIS)</span>}
        </h3>
        {!user && (
          <p className="error" style={{ color: "red", marginTop: "8px" }}>
            Login untuk mendapatkan diskon daily point
          </p>
        )}
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
        </select>
        {error && <p className="error">{error}</p>}
      </div>

      <div className="payment-details">
        <h4>📋 Instruksi Pembayaran</h4>
        {paymentMethod === "Transfer Bank" && (
          <p>
            Transfer ke: <strong>123-456-7890 (BCA)</strong>
          </p>
        )}
        {paymentMethod === "E-Wallet" && (
          <p>
            Kirim ke: <strong>0812-3456-7890 (OVO / DANA / GOPAY)</strong>
          </p>
        )}
        {paymentMethod === "QRIS" && (
          <div>
            <p>Scan kode QR berikut untuk diskon tambahan 10%:</p>
            <img
              src="https://cdn.britannica.com/17/155017-050-9AC96FC8/Example-QR-code.jpg"
              alt="QRIS"
              className="qris-img"
              style={{ width: "150px", marginTop: "10px" }}
            />
          </div>
        )}
      </div>

      <button onClick={handleFinish}>Selesaikan Pembayaran</button>
    </div>
  );
}

export default Checkout;
