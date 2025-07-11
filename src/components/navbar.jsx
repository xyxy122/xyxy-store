import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ search, setSearch, user, setUser }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleProfileClick = () => {
    if (window.innerWidth <= 768) {
      navigate("/profile");
      setIsMobileMenuOpen(false);
    } else {
      setShowDropdown((prev) => !prev);
    }
  };

  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
    setShowDropdown(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    navigate("/");
    handleNavLinkClick();
  };

  return (
    <nav className="navbar">
      <div className="logo-section" onClick={handleNavLinkClick}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/252/252035.png"
          alt="Xyxy Logo"
          className="logo-img"
        />
        <span className="logo-text">Xyxy Store</span>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Cari game..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ul className={`nav-links ${isMobileMenuOpen ? "open" : ""}`}>
        <li><Link to="/" onClick={handleNavLinkClick}>Beranda</Link></li>
        <li><Link to="/cart" onClick={handleNavLinkClick}>Keranjang</Link></li>
        <li><Link to="/history" onClick={handleNavLinkClick}>Riwayat</Link></li>
        <li><Link to="/wishlist" onClick={handleNavLinkClick}>Wishlist</Link></li>

        {!user ? (
          <>
            <li><Link to="/login" onClick={handleNavLinkClick}>Login</Link></li>
            <li><Link to="/register" onClick={handleNavLinkClick}>Register</Link></li>
          </>
        ) : (
          <li className="user-dropdown">
            <div onClick={handleProfileClick} className="user-avatar-wrapper">
              <img
                src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt="User"
                className="user-avatar"
              />
              <span>{user.username}</span>
            </div>
            {showDropdown && (
              <ul className="dropdown-menu">
                <li><Link to="/profile" onClick={handleNavLinkClick}>Profil</Link></li>
                <li onClick={handleLogout}>Logout</li>
              </ul>
            )}
          </li>
        )}
      </ul>

      <div className="mobile-toggle" onClick={toggleMobileMenu}>☰</div>
    </nav>
  );
}

export default Navbar;
