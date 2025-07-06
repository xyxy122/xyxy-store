import GameCard from "../components/GameCard";
import Header from "../components/Header";

function HomePage({ cart, setCart, search, onAddToCart, games, wishlist, toggleWishlist, discountActive, promoId }) {
  const filtered = games.filter((g) => g.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <Header />
      <div className="grid">
        {filtered.map((game, i) => (
          <GameCard
            key={i}
            game={game}
            onAddToCart={onAddToCart}
            toggleWishlist={toggleWishlist}
            wishlist={wishlist}
            discountActive={discountActive}
            promoId={promoId}
          />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
