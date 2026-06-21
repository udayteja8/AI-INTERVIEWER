import { useNavigate } from "react-router-dom";

function Post() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.navLeft}>
          <span style={styles.logo}>IQ</span>
          <span style={styles.brandName}>InterviewIQ</span>
        </div>
        <div style={styles.navRight}>
          <button style={styles.navBtn} onClick={() => navigate("/post")}>Home</button>
          <button style={styles.navBtn} onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button style={styles.navBtn} onClick={() => navigate("/upload")}>Upload Resume</button>
          <button style={styles.navBtn} onClick={() => navigate("/choose-topic")}>Topics</button>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.card}>
          <div style={styles.logoLarge}>IQ</div>
          <h1 style={styles.title}>Start Interview</h1>
          <p style={styles.subtitle}>Choose how you'd like to begin</p>

          <button
            style={styles.optionButton}
            onClick={() => navigate("/upload")}
          >
            Upload Resume
          </button>

          <button
            style={styles.optionButton}
            onClick={() => navigate("/choose-topic")}
          >
            Choose Topic
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#ffffff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    borderBottom: "1px solid #e0e0e0",
    background: "#ffffff",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logo: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    background: "#000000",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
  },
  brandName: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#000000",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  navBtn: {
    padding: "8px 14px",
    background: "#ffffff",
    color: "#000000",
    border: "1px solid #cccccc",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  logoutBtn: {
    padding: "8px 14px",
    background: "#000000",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  mainContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
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
  logoLarge: {
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
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#000000",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666666",
    marginBottom: "30px",
  },
  optionButton: {
    display: "block",
    width: "100%",
    padding: "16px",
    background: "#ffffff",
    border: "1px solid #cccccc",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 600,
    color: "#000000",
    marginBottom: "12px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
};

export default Post;