import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import AuthContext from "../utils/AuthContext";
import { login as loginService } from "../services/AuthService";
import "./Login.css";
import axios from "axios";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogin = async (credentials) => {
    try {
        const response = await axios.post('https://localhost:7020/api/Login', credentials);
        
        if (response.data.token) {
            // Store the token and userId in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId); // Store userId
            toast.success('Login successful!');
            navigate('/dashboard');
        } else {
            toast.error('Login failed');
        }
    } catch (error) {
        toast.error('Login failed, please try again!');
    }
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await loginService(username, password);
      login(token);
      toast.success("Login Success");
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Login failed: Invalid credentials");
      } else {
        toast.error("Login failed: An unexpected error occurred");
      }
    }
  };
  const handleResetPasswordClick = () => {
    navigate('/reset-password');
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Login
            </button>
          </div>
          <button onClick={handleResetPasswordClick} className="reset-password-btn">
        Reset Password
      </button>
        
        {/* Registration Link */}
        <p className="register-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
