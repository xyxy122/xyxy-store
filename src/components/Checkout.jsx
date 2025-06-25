import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Checkout({ cart, onCheckoutDone }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (cart.length === 0) return;

    const history = JSON.parse(localStorage.getItem("orderHistory")) || [];

    const newOrder = {
      id: Date.now(),
      date: new Date().toLocaleString("id-ID"),
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price, 0),
    };

    const updatedHistory = [newOrder, ...history];
    localStorage.setItem("orderHistory", JSON.stringify(updatedHistory));

    onCheckoutDone();

    // LANGSUNG redirect tanpa delay
    navigate("/history");
  }, [cart, onCheckoutDone, navigate]);

  return null; // tidak render apa pun, langsung navigasi
}

export default Checkout;
