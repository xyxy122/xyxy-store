import "./Wishlist.css";

function Wishlist({ wishlist, toggleWishlist }) {
  if (wishlist.length === 0) {
    return <h2>Belum ada game di wishlist.</h2>;
  }

  return (
    <div className="wishlist">
      <h2>Game Wishlist ❤️</h2>
      <ul>
        {wishlist.map((game) => (
          <li
            key={game.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <img src={game.image} alt={game.title} width="100" />
            <div style={{ marginLeft: "1rem" }}>
              <p>{game.title}</p>
              <p>Rp {game.price.toLocaleString("id-ID")}</p>
              <button onClick={() => toggleWishlist(game)}>❌ Hapus</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Wishlist;
