import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile({ user, setUser }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState(user?.password || "");
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleUpdate = () => {
    if (!username.trim() || !password.trim()) {
      setMessage("Username dan password tidak boleh kosong.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const isTaken =
      username !== user.username &&
      users.some((u) => u.username === username);

    if (isTaken) {
      setMessage("Username sudah digunakan oleh pengguna lain.");
      return;
    }

    const updatedUsers = users.map((u) =>
      u.username === user.username ? { username, password, avatar } : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    const updatedUser = { username, password, avatar };
    setUser(updatedUser);
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    setMessage("✅ Profil berhasil diperbarui!");
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    navigate("/");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Ukuran gambar maksimal 2MB.");
    }
  };

  return (
    <div className="profile-container">
      <h2>👤 Profil Saya</h2>
      {message && <p className="message">{message}</p>}

      <div className="avatar-section">
        <img
          src={avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
          alt="Avatar"
          className="avatar-img"
        />
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
      </div>

      <label>Username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleUpdate}>💾 Simpan Perubahan</button>
      <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
    </div>
  );
}

export default Profile;
