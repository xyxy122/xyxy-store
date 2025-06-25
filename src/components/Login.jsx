import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
      setUser(foundUser);
      navigate("/");
    } else {
      alert("Username atau password salah!");
    }
  };

  return (
    <div className="login-container">
      <h2>Masuk</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
