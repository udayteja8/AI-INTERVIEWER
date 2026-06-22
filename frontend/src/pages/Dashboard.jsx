import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          setError("Please login first");
          setLoading(false);
          return;
        }
        const user = JSON.parse(userStr);
        if (!user?.email) {
          setError("User email not found");
          setLoading(false);
          return;
        }
        const res = await API.get(`/history/${user.email}`);
        const data = Array.isArray(res.data) ? res.data : [];
        setHistory(data);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const handleLogout = () => { 
    localStorage.clear(); 
    navigate("/"); 
  };

  const getInterviewName = (item) => {
    if (!item) return "Interview";
    if (item.analysis) return "Resume Based Interview";
    try {
      if (item.questions?.[0]?.topic) {
        return "Topic - " + String(item.questions[0].topic);
      }
    } catch(e) {}
    return "Interview";
  };

  const formatDate = (item) => {
    if (!item) return "";
    try {
      if (item.created_at) {
        return new Date(item.created_at).toLocaleDateString("en-US", {
          year: "numeric", month: "short", day: "numeric",
        });
      }
      if (item._id) {
        const id = typeof item._id === 'string' ? item._id : String(item._id);
        const ts = parseInt(id.substring(0, 8), 16) * 1000;
        if (!isNaN(ts)) {
          return new Date(ts).toLocaleDateString("en-US", {
            year: "numeric", month: "short", day: "numeric",
          });
        }
      }
    } catch(e) {}
    return "";
  };

  const safeStr = (val) => {
    if (val === null || val === undefined) return "";
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return String(val);
    try { return JSON.stringify(val); } catch(e) { return ""; }
  };

  const safeArr = (arr) => {
    if (!arr) return [];
    if (Array.isArray(arr)) return arr;
    return [];
  };

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.navbar}>
          <div style={styles.navLeft}>
            <span style={styles.logo}>IQ</span>
            <span style={styles.brandName}>InterviewIQ</span>
          </div>
          <div style={styles.navRight}>
            <button style={styles.navBtn} onClick={() => navigate("/post")}>Home</button>
            <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
          </div>
        </div>
        <div style={styles.mainContent}>
          <h1 style={styles.title}>Interview Dashboard</h1>
          <p style={{ textAlign: "center", color: "#cc0000", marginTop: "40px" }}>{error}</p>
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <button style={styles.startBtn} onClick={() => navigate("/post")}>Start Interview</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
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

      <div style={styles.mainContent}>
        <h1 style={styles.title}>Interview Dashboard</h1>

        {loading ? (
          <p style={{ textAlign: "center", color: "#666" }}>Loading...</p>
        ) : history.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ color: "#666", fontSize: "14px" }}>No interviews yet.</p>
            <button style={styles.startBtn} onClick={() => navigate("/post")}>Start Interview</button>
          </div>
        ) : (
          <div style={styles.grid}>
            {history.map((item, index) => (
              <div key={index} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.interviewName}>{getInterviewName(item)}</h3>
                    <span style={styles.interviewDate}>{formatDate(item)}</span>
                  </div>
                  <span style={styles.interviewNum}>#{index + 1}</span>
                </div>

                {item.report && (
                  <div style={styles.scores}>
                    <div style={styles.scoreItem}>
                      <span style={styles.scoreLabel}>Overall</span>
                      <span style={styles.scoreValue}>{safeStr(item.report.overall_score || 0)}/100</span>
                    </div>
                    <div style={styles.scoreItem}>
                      <span style={styles.scoreLabel}>Technical</span>
                      <span style={styles.scoreValue}>{safeStr(item.report.technical_average || 0)}/10</span>
                    </div>
                    <div style={styles.scoreItem}>
                      <span style={styles.scoreLabel}>Comm</span>
                      <span style={styles.scoreValue}>{safeStr(item.report.communication_average || 0)}/10</span>
                    </div>
                  </div>
                )}

                <button style={styles.detailBtn} onClick={() => setSelectedReport(item)}>
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedReport && (
        <div style={styles.overlay} onClick={() => setSelectedReport(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{getInterviewName(selectedReport)}</h2>
              <button style={styles.closeBtn} onClick={() => setSelectedReport(null)}>✕</button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.modalScores}>
                <div style={styles.modalScoreItem}><span>Overall</span><b>{safeStr(selectedReport.report?.overall_score || 0)}/100</b></div>
                <div style={styles.modalScoreItem}><span>Technical</span><b>{safeStr(selectedReport.report?.technical_average || 0)}/10</b></div>
                <div style={styles.modalScoreItem}><span>Communication</span><b>{safeStr(selectedReport.report?.communication_average || 0)}/10</b></div>
              </div>

              {safeArr(selectedReport.answers).map((ans, i) => (
                <div key={i} style={styles.qCard}>
                  <p style={styles.qNum}>Q{i + 1}: {safeStr(ans.question)}</p>
                  <p style={styles.aText}><i>"{safeStr(ans.answer)}"</i></p>
                  {ans.evaluation && (
                    <div style={styles.evalBox}>
                      <div style={styles.evalScores}>
                        <span>Technical: {safeStr(ans.evaluation.technical_score)}/10</span>
                        <span>Communication: {safeStr(ans.evaluation.communication_score)}/10</span>
                      </div>
                      {ans.evaluation.correct_answer && (
                        <p style={styles.correctAnswer}><strong>Correct Answer:</strong> {safeStr(ans.evaluation.correct_answer)}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {selectedReport.report?.summary && (
                <div style={styles.summaryBox}>
                  <strong>Summary:</strong>
                  <p>{safeStr(selectedReport.report.summary)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#fff", fontFamily: "'Segoe UI', sans-serif" },
  navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px", borderBottom: "1px solid #e0e0e0", position: "sticky", top: 0, background: "#fff", zIndex: 100 },
  navLeft: { display: "flex", alignItems: "center", gap: "10px" },
  logo: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", background: "#000", borderRadius: "6px", color: "#fff", fontSize: "16px", fontWeight: "bold" },
  brandName: { fontSize: "18px", fontWeight: 700, color: "#000" },
  navRight: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
  navBtn: { padding: "8px 14px", background: "#fff", color: "#000", border: "1px solid #ccc", borderRadius: "6px", fontSize: "13px", fontWeight: 500, cursor: "pointer" },
  logoutBtn: { padding: "8px 14px", background: "#000", color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer" },
  mainContent: { maxWidth: "700px", margin: "0 auto", padding: "32px 20px" },
  title: { fontSize: "24px", fontWeight: 700, color: "#000", marginBottom: "24px", textAlign: "center" },
  grid: { display: "flex", flexDirection: "column", gap: "16px" },
  card: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "8px", padding: "20px" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" },
  interviewName: { fontSize: "16px", fontWeight: 700, color: "#000", margin: "0 0 4px 0" },
  interviewDate: { fontSize: "11px", color: "#999", fontWeight: 500 },
  interviewNum: { fontSize: "12px", color: "#999", fontWeight: 600 },
  scores: { display: "flex", gap: "12px", marginBottom: "12px" },
  scoreItem: { flex: 1, textAlign: "center", padding: "10px", background: "#f5f5f5", borderRadius: "6px" },
  scoreLabel: { display: "block", fontSize: "11px", color: "#666", marginBottom: "4px" },
  scoreValue: { display: "block", fontSize: "18px", fontWeight: 700, color: "#000" },
  startBtn: { padding: "12px 24px", background: "#000", color: "#fff", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: 600, cursor: "pointer", marginTop: "16px" },
  detailBtn: { width: "100%", padding: "10px", background: "#555", color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" },
  modal: { background: "#fff", borderRadius: "8px", maxWidth: "600px", width: "100%", maxHeight: "80vh", overflowY: "auto" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #e0e0e0", position: "sticky", top: 0, background: "#fff" },
  modalTitle: { fontSize: "16px", fontWeight: 700, color: "#000", margin: 0 },
  closeBtn: { background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#666" },
  modalBody: { padding: "20px" },
  modalScores: { display: "flex", gap: "12px", marginBottom: "16px" },
  modalScoreItem: { flex: 1, textAlign: "center", padding: "12px", background: "#f5f5f5", borderRadius: "6px", fontSize: "13px" },
  qCard: { background: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: "6px", padding: "12px", marginBottom: "10px" },
  qNum: { fontSize: "13px", fontWeight: 700, margin: "0 0 6px 0" },
  aText: { fontSize: "13px", color: "#555", margin: "0 0 8px 0" },
  evalBox: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "4px", padding: "10px" },
  evalScores: { display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 600, marginBottom: "6px" },
  correctAnswer: { fontSize: "12px", color: "#333", margin: "4px 0 0 0", lineHeight: 1.5 },
  summaryBox: { background: "#f5f5f5", border: "1px solid #e0e0e0", borderRadius: "6px", padding: "12px", marginTop: "10px", fontSize: "13px" },
};

export default Dashboard;