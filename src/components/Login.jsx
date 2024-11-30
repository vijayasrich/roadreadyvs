import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthContext from "../utils/AuthContext";
import { login as loginService } from "../services/AuthService";
import "./Login.css";
import axios from "axios";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await loginService(username, password);
      login(token);
      toast.success("Login Success");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Login failed: Invalid credentials");
      } else {
        toast.error("Login failed: An unexpected error occurred");
      }
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <i className="fas fa-user"></i>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </div>
        <div className="form-group">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
const loginUser = (username, password) => {
  axios.post('/api/login', { username, password })
    .then(response => {
      // Store the token in localStorage
      localStorage.setItem('authToken', response.data.token);
      
      // Redirect to dashboard or other page
      window.location.href = '/dashboard';  // or use React Router
    })
    .catch(error => {
      console.error('Login error:', error);
      alert('Login failed, please try again.');
    });
};


export default Login;
