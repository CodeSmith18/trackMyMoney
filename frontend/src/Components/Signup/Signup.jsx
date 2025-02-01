import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Import toastify
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles
import './Signup.css';  // Make sure to import the CSS file

function Signup() {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/users/signUp", formData);
      toast.success(response.data.message); // Success toast
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed"); // Error toast
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 className="signup-title">Sign Up</h2>
        <input
          type="text"
          name="fname"
          placeholder="First Name"
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="text"
          name="lname"
          placeholder="Last Name"
          onChange={handleChange}
          required
          className="input-field"
        />
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
        <button type="submit" className="submit-button">Sign Up</button>
        <div className="signup-footer">
          <p>Already have an account? <a href="/" className="login-link">Login here</a></p>
        </div>
      </form>
      
      {/* Toast Container for global toasts */}
      <ToastContainer />
    </div>
  );
}

export default Signup;
