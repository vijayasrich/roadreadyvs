import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For redirection
import { toast } from "react-toastify"; // For success/failure notifications
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
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
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
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
      <form onSubmit={handleSubmit}>
        {successMessage && <p className="success-message">{successMessage}</p>} {/* Success message */}
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
          <i className="fas fa-envelope"></i>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
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

        <div className="form-group">
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select a role</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        <div className="form-group">
          <i className="fas fa-phone"></i>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
          />
        </div>

        <div className="form-group">
          <i className="fas fa-user-circle"></i>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
        </div>

        <div className="form-group">
          <i className="fas fa-user-circle"></i>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
        </div>

        <button type="submit" disabled={loading}>
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
