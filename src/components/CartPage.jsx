import { Link, useNavigate } from "react-router-dom";
import './CartPages.css'

function CartPage({ cart, setCart }) {
  const navigate = useNavigate();

  const handleRemove = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="cart-container">
      <h2>🛒 Keranjang Belanja</h2>

      {cart.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Keranjang kamu kosong. <Link to="/">Belanja sekarang!</Link>
        </p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item, idx) => (
              <li className="cart-item" key={idx}>
                <img src={item.image} alt={item.title} className="cart-img" />
                <div className="cart-info">
                  <h4>{item.title}</h4>
                  <p>Rp {item.price.toLocaleString("id-ID")}</p>
                </div>
                <button onClick={() => handleRemove(item.id)}>Hapus</button>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <h3>Total: Rp {total.toLocaleString("id-ID")}</h3>
            <button onClick={() => navigate("/checkout")}>
              Lanjut ke Checkout
            </button>
          </div>
          <Link className="back-link" to="/">
            ← Kembali Belanja
          </Link>
        </>
      )}
    </div>
  );
}

export default CartPage;
