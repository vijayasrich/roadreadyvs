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
  const [role, setRole] = useState(""); // Role state
  const [loading, setLoading] = useState(false); // To show loading state
  const navigate = useNavigate(); // To navigate to another page

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!username || !email || !password || !role) {
      toast.error("All fields are required.");
      return;
    }
    
    setLoading(true); // Set loading to true while making the API call
    try {
      // Make API request to register the user
      const response = await axios.post("https://localhost:7020/api/Authentication/register", { 
        username, 
        email, 
        password, 
        role 
      });

      if (response.data.success) {
        toast.success("Registration successful!");
        // Redirect to login page after successful registration
        setTimeout(() => {
          navigate("/login");
        }, 2000); // Delay navigation to allow the success toast to appear
      }
    } catch (error) {
      toast.error(`Registration failed: ${error.response?.data?.message || "Please try again!"}`);
    } finally {
      setLoading(false); // Reset loading state
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

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;