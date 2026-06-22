import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function UploadResume() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const uploadResume = async () => {
    if (!file) {
      alert("Please select a resume first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    setLoading(true);

    try {
      const res = await API.post("/upload-resume", formData);
      
      localStorage.setItem("analysis", JSON.stringify(res.data.analysis));
      localStorage.setItem("questions", JSON.stringify(res.data.questions.questions));
      localStorage.setItem("interviewType", "resume");
      
      navigate("/interview");
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>IQ</div>
        <h1 style={styles.title}>Upload Resume</h1>

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          style={styles.fileInput}
          id="resumeInput"
        />
        
        <label htmlFor="resumeInput" style={styles.uploadBox}>
          {file ? (
            <span> {file.name}</span>
          ) : (
            <span> Click to select PDF</span>
          )}
        </label>

        <button
          style={{
            ...styles.button,
            opacity: file && !loading ? 1 : 0.6,
          }}
          onClick={uploadResume}
          disabled={!file || loading}
        >
          {loading ? "Processing..." : "Start Interview"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#000000",
    marginBottom: "24px",
  },
  fileInput: {
    display: "none",
  },
  uploadBox: {
    display: "block",
    padding: "40px 20px",
    border: "2px dashed #cccccc",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    color: "#666666",
    fontWeight: 500,
    marginBottom: "20px",
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
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
};

export default UploadResume;