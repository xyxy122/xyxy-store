// Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.find(u => u.username === username);
    if (exists) return alert("Username sudah digunakan");

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registrasi berhasil");
    navigate("/login");
  };

  return (
    <div className="auth-form">
      <h2>Daftar Akun</h2>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Daftar</button>
    </div>
  );
}

export default Register;
