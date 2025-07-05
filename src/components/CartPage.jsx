import React from "react";
import { Link } from "react-router-dom";
import "./CartPage.css";


function CartPage({ cart }) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="cart-container">
      <h2>🛒 Keranjang Belanja</h2>

      {cart.length === 0 ? (
        <p>Keranjang kamu kosong 😅</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item, idx) => (
              <li key={idx} className="cart-item">
                <img src={item.image} alt={item.title} />
                <div>
                  <strong>{item.title}</strong>
                  <p>Rp {item.price.toLocaleString("id-ID")}</p>
                </div>
              </li>
            ))}
          </ul>
          <h3>Total: Rp {total.toLocaleString("id-ID")}</h3>

          {/* PROMO */}
          <div style={{
            backgroundColor: "#f0f9ff",
            border: "1px solid #90caf9",
            padding: "10px",
            borderRadius: "6px",
            margin: "15px 0",
            color: "#1565c0"
          }}>
            🎉 Bayar pakai <strong>QRIS</strong> di checkout dan dapatkan <strong>Diskon 10%</strong>!
          </div>

          <Link to="/checkout">
            <button className="checkout-button">Lanjut ke Checkout</button>
          </Link>
        </>
      )}
    </div>
  );
}

export default CartPage;
