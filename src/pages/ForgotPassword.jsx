import { useState, useEffect } from "react";
import { auth } from "../utilities/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setLoading(false);
      setEmailSent(true);
      setFieldError("");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      const code = error.code;
      const message = error.message;
      console.error({ code, message });
      setLoading(false);
      if (error.code === "auth/user-not-found") {
        setFieldError("User not found");
      }
      if (error.code === "auth/invalid-email") {
        setFieldError("Please enter a valid email");
      }
      setEmailSent(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      navigate("/");
    }
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page forgot-password-page">
      <Link to="/sign-in" className="link" />
      <h2>Get a reset link</h2>
      {emailSent && (
        <div>
          Email sent! Please follow the instructions contained in the email{" "}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <h3>Please enter your email:</h3>
        <input type="text" onChange={handleChange} required />
        <button className="btn" type="submit">
          Submit
        </button>
        {fieldError ? <div className="error-msg">{fieldError}</div> : ""}
      </form>
    </div>
  );
}

export default ForgotPassword;
