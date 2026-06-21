import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Topic() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");

  const topics = [
    { name: "React" },
    { name: "JavaScript" },
    { name: "Node.js" },
    { name: "Python" },
    { name: "Java" },
    { name: "Data Science" },
    { name: "SQL/Database" },
    { name: "System Design" },
    { name: "AWS/Cloud" },
    { name: "Git/DevOps" }
  ];

  const selectTopic = async (topic) => {
    setSelectedTopic(topic.name);
    setLoading(true);

    try {
      const res = await API.post("/generate-topic-questions", {
        topic: topic.name
      });

      localStorage.removeItem("analysis");
      localStorage.setItem("interviewType", "topic");
      localStorage.setItem("selectedTopic", topic.name);
      localStorage.setItem("questions", JSON.stringify(res.data.questions));
      
      navigate("/interview");
    } catch (err) {
      console.error("Failed to generate questions:", err);
      alert("Failed to generate questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };  

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.logo}>IQ</div>
          <h2 style={styles.loadingTitle}>Generating Questions...</h2>
          <p style={styles.loadingText}>Creating {selectedTopic} interview questions</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>IQ</div>
        <h1 style={styles.title}>Choose Topic</h1>

        {topics.map((topic, index) => (
          <button
            key={index}
            style={styles.topicButton}
            onClick={() => selectTopic(topic)}
          >
            {topic.name}
          </button>
        ))}
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
  topicButton: {
    display: "block",
    width: "100%",
    padding: "14px 16px",
    background: "#ffffff",
    border: "1px solid #cccccc",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 600,
    color: "#000000",
    marginBottom: "10px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  loadingTitle: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#000000",
    marginBottom: "12px",
  },
  loadingText: {
    fontSize: "14px",
    color: "#666666",
    marginBottom: "24px",
  },
};

export default Topic;