import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./components/HomePage";
import CartPage from "./components/CartPage";
import Checkout from "./components/Checkout";
import History from "./components/History";
import TransactionDetail from "./components/TransactionDetail";
import Wishlist from "./components/Wishlist";
import Profile from "./components/Profile";
import DailyPoint from "./components/DailyPoint";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem("wishlist");
    return stored ? JSON.parse(stored) : [];
  });
  const [discountActive, setDiscountActive] = useState(
    localStorage.getItem("discountApplied") === "true"
  );
  const [promoId, setPromoId] = useState(null);

  const games = [
    {
      id: 1,
      title: "Cyberpunk 2077",
      price: 10000,
      image:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
    },
    {
      id: 2,
      title: "Red Dead Redemption 2",
      price: 10000,
      image:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg",
    },
    {
      id: 3,
      title: "Elden Ring",
      price: 10000,
      image:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
    },
    {
      id: 4,
      title: "Assassins Creed IV",
      price: 10000,
      image: "https://wallpapercave.com/wp/wp3076360.jpg",
    },
    {
      id: 5,
      title: "Batman Arkham Origins",
      price: 10000,
      image:
        "https://www.nintendo.com/eu/media/images/10_share_images/games_15/wiiu_14/SI_WiiU_BatmanArkhamOrigins_image1600w.jpg",
    },
    {
      id: 6,
      title: "Persona 5 : Royale",
      price: 10000,
      image: "https://www.gamereactor.eu/media/33/persona5royal_3113393b.jpg",
    },
    {
      id: 7,
      title: "Balatro",
      price: 10000,
      image:
        "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/08/balatro-1.jpg",
    },
    {
      id: 8,
      title: "Tekken 7",
      price: 10000,
      image: "https://media.graphassets.com/jHYvjBVjT3OnOuPQrTfs",
    },
    {
      id: 9,
      title: "Tekken 8",
      price: 10000,
      image:
        "https://akinseagleseye.com/wp-content/uploads/2024/02/tekken-8-artwork.jpg",
    },
    {
      id: 10,
      title: "Among Us",
      price: 10000,
      image:
        "https://static1.srcdn.com/wordpress/wp-content/uploads/2020/11/Among-Us-217-million.jpg",
    },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Simpan cart agar tidak hilang saat refresh
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // PROMO RANDOM
  useEffect(() => {
    const today = new Date().toLocaleDateString("id-ID");
    const lastPromo = JSON.parse(localStorage.getItem("dailyPromo")) || {};

    if (lastPromo.date !== today) {
      const randomId = games[Math.floor(Math.random() * games.length)].id;
      localStorage.setItem(
        "dailyPromo",
        JSON.stringify({ id: randomId, date: today })
      );
      setPromoId(randomId);
    } else {
      setPromoId(lastPromo.id);
    }
  }, []);

  const handleAddToCart = (game) => setCart((prev) => [...prev, game]);

  const toggleWishlist = (game) => {
    const exists = wishlist.find((g) => g.id === game.id);
    if (exists) {
      setWishlist(wishlist.filter((g) => g.id !== game.id));
    } else {
      setWishlist([...wishlist, game]);
    }
  };

  const handleCheckoutDone = () => {
    setCart([]);
    localStorage.removeItem("cart"); // biar clear cart setelah checkout
  };

  return (
    <Router>
      <Navbar
        search={search}
        setSearch={setSearch}
        user={user}
        setUser={setUser}
      />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <DailyPoint
                user={user}
                discountActive={discountActive}
                setDiscountActive={setDiscountActive}
              />
              <HomePage
                discountActive={discountActive}
                promoId={promoId}
                cart={cart}
                setCart={setCart}
                search={search}
                onAddToCart={handleAddToCart}
                games={games}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
              />
            </>
          }
        />
        <Route
          path="/profile"
          element={<Profile user={user} setUser={setUser} />}
        />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/cart"
          element={<CartPage cart={cart} setCart={setCart} />}
        />

        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              setCart={setCart}
              onCheckoutDone={handleCheckoutDone}
              discountActive={discountActive}
              user={user}
            />
          }
        />
        <Route path="/history" element={<History />} />
        <Route path="/history/:id" element={<TransactionDetail />} />
        <Route
          path="/wishlist"
          element={
            <Wishlist wishlist={wishlist} toggleWishlist={toggleWishlist} />
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={2000} />
    </Router>
  );
}

export default App;
