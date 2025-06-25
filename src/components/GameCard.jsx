import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function GameCard({ game, onAddToCart }) {
  const [isWished, setIsWished] = useState(false);

  // Cek apakah game sudah ada di wishlist saat pertama kali render
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
    setIsWished(stored.some(item => item.id === game.id));
  }, [game]);

  // Toggle wishlist logic
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

  // Tambahkan ke keranjang
  const handleBuy = () => {
    onAddToCart(game);
    toast.success(`${game.title} ditambahkan ke keranjang!`);
  };

  return (
    <div className="card">
      <img src={game.image} alt={game.title} className="card-img" />
      <div className="card-body">
        <h2>{game.title}</h2>
        <p className="price">Rp {game.price.toLocaleString("id-ID")}</p>
        
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
