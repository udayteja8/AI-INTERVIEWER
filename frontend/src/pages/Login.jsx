import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/login", formData);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      navigate("/post");
    } catch (err) {
      console.log(err);
      alert("Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoSection}>
          <div style={styles.logo}>IQ</div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to continue</p>
        </div>

        <form onSubmit={loginUser}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={styles.signupText}>
          Don't have an account?{" "}
          <Link to="/signup" style={styles.link}>
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ffffff",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    background: "#ffffff",
    borderRadius: "8px",
    padding: "40px",
    maxWidth: "400px",
    width: "100%",
    border: "1px solid #e0e0e0",
    textAlign: "center",
  },
  logoSection: {
    marginBottom: "30px",
  },
  logo: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "50px",
    height: "50px",
    background: "#000000",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "16px",
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#000000",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666666",
    margin: 0,
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    marginBottom: "16px",
    border: "1px solid #cccccc",
    borderRadius: "6px",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "#ffffff",
    color: "#000000",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "#000000",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "8px",
    marginBottom: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  signupText: {
    fontSize: "14px",
    color: "#666666",
    margin: 0,
  },
  link: {
    color: "#000000",
    fontWeight: 600,
    textDecoration: "underline",
  },
};

export default Login;