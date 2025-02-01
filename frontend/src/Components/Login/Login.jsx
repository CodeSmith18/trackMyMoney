import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";  // Import the toast from react-toastify
import 'react-toastify/dist/ReactToastify.css';  // Import the CSS for toastify
import './Login.css';  // Make sure to import the CSS file

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://65.0.183.166:5000/users/login", formData, { withCredentials: true });
      toast.success(response.data.message);  // Success toast notification
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");  // Error toast notification
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="input-field"
        />
        <button type="submit" className="submit-button">Login</button>
        <div className="login-footer">
          <p>Dont have an account? <a href="/signup" className="signup-link">Sign up here</a></p>
        </div>
      </form>
    </div>
  );
}

export default Login;
