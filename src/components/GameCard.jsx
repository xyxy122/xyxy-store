import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function GameCard({ game, onAddToCart, discountActive, promoId }) {
  const [isWished, setIsWished] = useState(false);

  // Harga yang sudah di-adjust diskon daily & promo
  let adjustedPrice = game.price;
  if (discountActive) adjustedPrice = 10000;
  if (game.id === promoId) adjustedPrice *= 0.8;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
    setIsWished(stored.some(item => item.id === game.id));
  }, [game]);

  const toggleWishlist = () => {
    const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
    let updated;

    if (isWished) {
      updated = stored.filter(item => item.id !== game.id);
      toast.info(`${game.title} dihapus dari wishlist.`);
    } else {
      updated = [game, ...stored];
      toast.success(`${game.title} ditambahkan ke wishlist!`);
    }

    localStorage.setItem("wishlist", JSON.stringify(updated));
    setIsWished(!isWished);
  };

  const handleBuy = () => {
    onAddToCart({ ...game, price: Math.round(adjustedPrice) });
    toast.success(`${game.title} ditambahkan ke keranjang!`);
  };

  return (
    <div className="card">
      <img src={game.image} alt={game.title} className="card-img" />
      <div className="card-body">
        <h2>
          {game.title}
          {game.id === promoId && <span style={{
            backgroundColor: "red",
            color: "white",
            padding: "2px 6px",
            borderRadius: "4px",
            marginLeft: "8px",
            fontSize: "0.8rem"
          }}>🔥 Promo</span>}
        </h2>
        <p className="price">
          Rp {Math.round(adjustedPrice).toLocaleString("id-ID")}
        </p>

        <button onClick={handleBuy}>
          🛒 Beli
        </button>

        <button
          onClick={toggleWishlist}
          style={{
            backgroundColor: isWished ? "purple" : "#f2f2f2",
            color: isWished ? "white" : "black",
            marginTop: "8px"
          }}
        >
          {isWished ? "💔 Hapus Wishlist" : "❤️ Wishlist"}
        </button>
      </div>
    </div>
  );
}

export default GameCard;
