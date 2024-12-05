import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import "./Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !role || !phoneNumber || !firstName || !lastName) {
      toast.error("All fields are required.");
      return;
    }

    setLoading(true);
    setSuccessMessage(""); // Clear any previous success message
    try {
      const response = await axios.post("https://localhost:7020/api/Authentication/register", {
        userName: username,
        email,
        password,
        role,
        phoneNumber,
        firstName,
        lastName,
      });

      if (response.data.status === "Success") {
        setSuccessMessage("Registration successful! Redirecting to login...");
        toast.success("Registration successful!");
        setTimeout(() => {
          navigate("/login");
        }, 3000); // Wait 3 seconds before redirecting
      }
    } catch (error) {
      toast.error(`Registration failed: ${error.response?.data?.message || "Please try again!"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
    {/*<h2>Register</h2>*/}
    <form onSubmit={handleSubmit}>
      {successMessage && <p className="success-message">{successMessage}</p>} {/* Success message */}
      
      <div className="form-group">
        <label htmlFor="username">
          <i className="fas fa-user"></i>
          <span>Username</span>
        </label>
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
        <label htmlFor="email">
          <i className="fas fa-envelope"></i>
          <span>Email</span>
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">
          <i className="fas fa-lock"></i>
          <span>Password</span>
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="role">
          <i className="fas fa-user-circle"></i>
          <span>Role</span>
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">Select a role</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="phoneNumber">
          <i className="fas fa-phone"></i>
          <span>Phone Number</span>
        </label>
        <input
          type="text"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter your phone number"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="firstName">
          <i className="fas fa-user-circle"></i>
          <span>First Name</span>
        </label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter your first name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="lastName">
          <i className="fas fa-user-circle"></i>
          <span>Last Name</span>
        </label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Enter your last name"
          required
        />
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? "Registering..." : "Register"}
      </button>

      <div className="login-link">
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </form>
  </div>

);
};

export default Register;
