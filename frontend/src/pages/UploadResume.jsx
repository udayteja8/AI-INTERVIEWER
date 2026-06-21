// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";

// function UploadResume() {

//   const [file, setFile] = useState(null);

//   const navigate = useNavigate();

//   const uploadResume = async () => {

//     if (!file) {
//       alert("Please select a resume");
//       return;
//     }

//     const formData = new FormData();

//     formData.append(
//       "resume",
//       file
//     );

//     try {

//       const res = await API.post(
//         "/upload-resume",
//         formData
//       );

//       console.log("FULL RESPONSE:");
// console.log(res.data);

// console.log("QUESTIONS OBJECT:");
// console.log(res.data.questions);

// console.log("NESTED QUESTIONS:");
// console.log(res.data.questions?.questions);

//       localStorage.setItem(
//         "analysis",
//         JSON.stringify(res.data.analysis)
//       );

//       localStorage.setItem(
//         "questions",
//         JSON.stringify(
//           res.data.questions.questions
//         )
//       );

//       navigate("/interview");

//     } catch (err) {

//       console.log(err);

//       alert("Resume Upload Failed");
//     }
//   };

//   return (
//     <div className="container mt-5">

//       <div className="card p-4">

//         <h2>Upload Resume</h2>

//         <input
//           type="file"
//           className="form-control"
//           onChange={(e) =>
//             setFile(e.target.files[0])
//           }
//         />

//         <button
//           className="btn btn-primary mt-3"
//           onClick={uploadResume}
//         >
//           Analyze Resume
//         </button>

//       </div>

//     </div>
//   );
// }

// export default UploadResume;

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";

// function UploadResume() {
//   const [file, setFile] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [loadingStep, setLoadingStep] = useState("");
//   const navigate = useNavigate();

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const dropped = e.dataTransfer.files[0];
//     if (dropped && dropped.type === "application/pdf") {
//       setFile(dropped);
//     } else {
//       alert("Please upload a PDF file.");
//     }
//   };

//   const uploadResume = async () => {
//     if (!file) {
//       alert("Please select a resume first.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("resume", file);

//     setIsLoading(true);
//     setLoadingStep("Parsing your resume…");

//     try {
//       setTimeout(() => setLoadingStep("Analyzing skills & projects…"), 2000);
//       setTimeout(() => setLoadingStep("Generating interview questions…"), 5000);

//       const res = await API.post("/upload-resume", formData);

//       setLoadingStep("Ready! Starting interview…");

//       localStorage.setItem("analysis", JSON.stringify(res.data.analysis));
//       localStorage.setItem(
//         "questions",
//         JSON.stringify(res.data.questions.questions)
//       );

//       setTimeout(() => navigate("/interview"), 800);
//     } catch (err) {
//       console.error(err);
//       setIsLoading(false);
//       setLoadingStep("");
//       alert("Resume upload failed. Please check your backend and try again.");
//     }
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.blob1} />
//       <div style={styles.blob2} />

//       <div style={styles.card}>
//         {/* Logo / Title */}
//         <div style={styles.topSection}>
//           <div style={styles.logoMark}>IQ</div>
//           <h1 style={styles.title}>InterviewIQ</h1>
//           <p style={styles.subtitle}>
//             Upload your resume and our AI will conduct a personalized technical interview tailored to your experience.
//           </p>
//         </div>

//         {/* Steps */}
//         <div style={styles.steps}>
//           {[
//             { icon: "📄", label: "Upload Resume" },
//             { icon: "🧠", label: "AI Analyzes" },
//             { icon: "🎙", label: "Live Interview" },
//             { icon: "📊", label: "Get Report" },
//           ].map((s, i) => (
//             <div key={i} style={styles.step}>
//               <div style={styles.stepIcon}>{s.icon}</div>
//               <span style={styles.stepLabel}>{s.label}</span>
//               {i < 3 && <div style={styles.stepArrow}>›</div>}
//             </div>
//           ))}
//         </div>

//         {/* Drop zone */}
//         {!isLoading ? (
//           <>
//             <div
//               style={{
//                 ...styles.dropzone,
//                 borderColor: isDragging
//                   ? "#6366f1"
//                   : file
//                   ? "#10b981"
//                   : "rgba(255,255,255,0.15)",
//                 background: isDragging
//                   ? "rgba(99,102,241,0.08)"
//                   : file
//                   ? "rgba(16,185,129,0.06)"
//                   : "rgba(255,255,255,0.03)",
//               }}
//               onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
//               onDragLeave={() => setIsDragging(false)}
//               onDrop={handleDrop}
//               onClick={() => document.getElementById("resumeInput").click()}
//             >
//               <input
//                 id="resumeInput"
//                 type="file"
//                 accept=".pdf"
//                 style={{ display: "none" }}
//                 onChange={(e) => setFile(e.target.files[0])}
//               />

//               {file ? (
//                 <>
//                   <div style={styles.fileIcon}>✅</div>
//                   <p style={styles.fileName}>{file.name}</p>
//                   <p style={styles.fileSize}>
//                     {(file.size / 1024).toFixed(1)} KB · PDF
//                   </p>
//                   <p style={styles.changeHint}>Click to change file</p>
//                 </>
//               ) : (
//                 <>
//                   <div style={styles.uploadIcon}>📁</div>
//                   <p style={styles.dropText}>
//                     Drag & drop your resume here
//                   </p>
//                   <p style={styles.dropSub}>or click to browse · PDF only</p>
//                 </>
//               )}
//             </div>

//             <button
//               style={{
//                 ...styles.btn,
//                 opacity: file ? 1 : 0.45,
//                 cursor: file ? "pointer" : "not-allowed",
//               }}
//               onClick={uploadResume}
//               disabled={!file}
//             >
//               Analyze Resume & Start Interview →
//             </button>
//           </>
//         ) : (
//           /* Loading state */
//           <div style={styles.loadingBox}>
//             <div style={styles.spinner} />
//             <p style={styles.loadingStep}>{loadingStep}</p>
//             <div style={styles.loadingBar}>
//               <div style={styles.loadingFill} />
//             </div>
//           </div>
//         )}

//         <p style={styles.privacy}>
//           🔒 Your resume is processed securely and never stored permanently.
//         </p>
//       </div>

//       <style>{`
//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }
//         @keyframes fillBar {
//           0%   { width: 5%; }
//           30%  { width: 35%; }
//           60%  { width: 65%; }
//           85%  { width: 88%; }
//           100% { width: 95%; }
//         }
//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50%       { opacity: 0.5; }
//         }
//       `}</style>
//     </div>
//   );
// }

// const styles = {
//   page: {
//     minHeight: "100vh",
//     background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     padding: "32px 16px",
//     fontFamily: "'Inter','Segoe UI',sans-serif",
//     position: "relative", overflow: "hidden",
//   },
//   blob1: {
//     position: "absolute", top: "-140px", left: "-140px",
//     width: "480px", height: "480px",
//     background: "radial-gradient(circle,#6366f140 0%,transparent 70%)",
//     pointerEvents: "none",
//   },
//   blob2: {
//     position: "absolute", bottom: "-120px", right: "-100px",
//     width: "420px", height: "420px",
//     background: "radial-gradient(circle,#8b5cf640 0%,transparent 70%)",
//     pointerEvents: "none",
//   },
//   card: {
//     width: "100%", maxWidth: "560px",
//     background: "rgba(255,255,255,0.04)",
//     border: "1px solid rgba(255,255,255,0.1)",
//     borderRadius: "28px",
//     backdropFilter: "blur(20px)",
//     padding: "44px 40px",
//     boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
//     position: "relative", zIndex: 1,
//   },
//   topSection: {
//     textAlign: "center", marginBottom: "32px",
//   },
//   logoMark: {
//     display: "inline-flex", alignItems: "center", justifyContent: "center",
//     width: "52px", height: "52px", borderRadius: "14px",
//     background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
//     fontWeight: 900, fontSize: "20px", color: "#fff",
//     marginBottom: "14px",
//     boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
//   },
//   title: {
//     margin: "0 0 10px",
//     fontSize: "30px", fontWeight: 800, letterSpacing: "-0.8px",
//     background: "linear-gradient(90deg,#818cf8,#c084fc)",
//     WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
//   },
//   subtitle: {
//     margin: 0,
//     fontSize: "14px", color: "#94a3b8", lineHeight: "1.6",
//   },
//   steps: {
//     display: "flex", alignItems: "center", justifyContent: "center",
//     gap: "4px", marginBottom: "28px",
//   },
//   step: {
//     display: "flex", alignItems: "center", gap: "4px",
//   },
//   stepIcon: {
//     fontSize: "16px",
//   },
//   stepLabel: {
//     fontSize: "11px", fontWeight: 600, color: "#64748b",
//     whiteSpace: "nowrap",
//   },
//   stepArrow: {
//     fontSize: "16px", color: "#334155", marginLeft: "4px",
//   },
//   dropzone: {
//     border: "2px dashed rgba(255,255,255,0.15)",
//     borderRadius: "18px",
//     padding: "40px 24px",
//     textAlign: "center",
//     cursor: "pointer",
//     transition: "all 0.25s ease",
//     marginBottom: "20px",
//   },
//   uploadIcon: { fontSize: "40px", marginBottom: "12px" },
//   dropText: {
//     margin: "0 0 6px",
//     fontSize: "15px", fontWeight: 600, color: "#e2e8f0",
//   },
//   dropSub: {
//     margin: 0, fontSize: "13px", color: "#475569",
//   },
//   fileIcon: { fontSize: "36px", marginBottom: "10px" },
//   fileName: {
//     margin: "0 0 4px",
//     fontSize: "15px", fontWeight: 700, color: "#10b981",
//     wordBreak: "break-all",
//   },
//   fileSize: {
//     margin: "0 0 8px", fontSize: "12px", color: "#64748b",
//   },
//   changeHint: {
//     margin: 0, fontSize: "12px", color: "#475569", fontStyle: "italic",
//   },
//   btn: {
//     width: "100%", padding: "15px",
//     background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
//     color: "#fff", border: "none", borderRadius: "14px",
//     fontSize: "15px", fontWeight: 700,
//     letterSpacing: "0.3px",
//     boxShadow: "0 6px 24px rgba(99,102,241,0.4)",
//     transition: "all 0.2s", fontFamily: "inherit",
//     marginBottom: "16px",
//   },
//   loadingBox: {
//     textAlign: "center", padding: "32px 0",
//   },
//   spinner: {
//     width: "44px", height: "44px",
//     border: "3px solid rgba(255,255,255,0.1)",
//     borderTop: "3px solid #6366f1",
//     borderRadius: "50%",
//     margin: "0 auto 20px",
//     animation: "spin 0.9s linear infinite",
//   },
//   loadingStep: {
//     margin: "0 0 16px",
//     fontSize: "15px", fontWeight: 600, color: "#c7d2fe",
//     animation: "pulse 1.5s ease infinite",
//   },
//   loadingBar: {
//     width: "100%", height: "4px",
//     background: "rgba(255,255,255,0.08)",
//     borderRadius: "99px", overflow: "hidden",
//     margin: "0 auto", maxWidth: "320px",
//   },
//   loadingFill: {
//     height: "100%",
//     background: "linear-gradient(90deg,#6366f1,#a855f7)",
//     borderRadius: "99px",
//     animation: "fillBar 9s ease forwards",
//   },
//   privacy: {
//     margin: 0, textAlign: "center",
//     fontSize: "12px", color: "#334155",
//   },
// };

// export default UploadResume;


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";

// function UploadResume() {
//   const [file, setFile] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [loadingStep, setLoadingStep] = useState("");
//   const navigate = useNavigate();

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const dropped = e.dataTransfer.files[0];
//     if (dropped && dropped.type === "application/pdf") {
//       setFile(dropped);
//     } else {
//       alert("Please upload a PDF file.");
//     }
//   };

//   const uploadResume = async () => {
//     if (!file) {
//       alert("Please select a resume first.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("resume", file);

//     setIsLoading(true);
//     setLoadingStep("Parsing your resume…");

//     try {
//       setTimeout(() => setLoadingStep("Analyzing skills & projects…"), 2000);
//       setTimeout(() => setLoadingStep("Generating interview questions…"), 5000);

//       const res = await API.post("/upload-resume", formData);

//       setLoadingStep("Ready! Starting interview…");

//       localStorage.setItem("analysis", JSON.stringify(res.data.analysis));
//       localStorage.setItem(
//         "questions",
//         JSON.stringify(res.data.questions.questions)
//       );

//       setTimeout(() => navigate("/interview"), 800);
//     } catch (err) {
//       console.error(err);
//       setIsLoading(false);
//       setLoadingStep("");
//       alert("Resume upload failed. Please check your backend and try again.");
//     }
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.blob1} />
//       <div style={styles.blob2} />

//       <div style={styles.card}>
//         {/* Logo / Title */}
//         <div style={styles.topSection}>
//           <div style={styles.logoMark}>IQ</div>
//           <h1 style={styles.title}>InterviewIQ</h1>
//           <p style={styles.subtitle}>
//             Upload your resume and our AI will conduct a personalized technical interview tailored to your experience.
//           </p>
//         </div>

//         {/* Steps */}
//         <div style={styles.steps}>
//           {[
//             { icon: "📄", label: "Upload Resume" },
//             { icon: "🧠", label: "AI Analyzes" },
//             { icon: "🎙", label: "Live Interview" },
//             { icon: "📊", label: "Get Report" },
//           ].map((s, i) => (
//             <div key={i} style={styles.step}>
//               <div style={styles.stepIcon}>{s.icon}</div>
//               <span style={styles.stepLabel}>{s.label}</span>
//               {i < 3 && <div style={styles.stepArrow}>›</div>}
//             </div>
//           ))}
//         </div>

//         {/* Drop zone */}
//         {!isLoading ? (
//           <>
//             <div
//               style={{
//                 ...styles.dropzone,
//                 borderColor: isDragging
//                   ? "#6366f1"
//                   : file
//                   ? "#10b981"
//                   : "rgba(255,255,255,0.15)",
//                 background: isDragging
//                   ? "rgba(99,102,241,0.08)"
//                   : file
//                   ? "rgba(16,185,129,0.06)"
//                   : "rgba(255,255,255,0.03)",
//               }}
//               onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
//               onDragLeave={() => setIsDragging(false)}
//               onDrop={handleDrop}
//               onClick={() => document.getElementById("resumeInput").click()}
//             >
//               <input
//                 id="resumeInput"
//                 type="file"
//                 accept=".pdf"
//                 style={{ display: "none" }}
//                 onChange={(e) => setFile(e.target.files[0])}
//               />

//               {file ? (
//                 <>
//                   <div style={styles.fileIcon}>✅</div>
//                   <p style={styles.fileName}>{file.name}</p>
//                   <p style={styles.fileSize}>
//                     {(file.size / 1024).toFixed(1)} KB · PDF
//                   </p>
//                   <p style={styles.changeHint}>Click to change file</p>
//                 </>
//               ) : (
//                 <>
//                   <div style={styles.uploadIcon}>📁</div>
//                   <p style={styles.dropText}>
//                     Drag & drop your resume here
//                   </p>
//                   <p style={styles.dropSub}>or click to browse · PDF only</p>
//                 </>
//               )}
//             </div>

//             <button
//               style={{
//                 ...styles.btn,
//                 opacity: file ? 1 : 0.45,
//                 cursor: file ? "pointer" : "not-allowed",
//               }}
//               onClick={uploadResume}
//               disabled={!file}
//             >
//               Start Interview →
//             </button>
//           </>
//         ) : (
//           /* Loading state */
//           <div style={styles.loadingBox}>
//             <div style={styles.spinner} />
//             <p style={styles.loadingStep}>{loadingStep}</p>
//             <div style={styles.loadingBar}>
//               <div style={styles.loadingFill} />
//             </div>
//           </div>
//         )}

//         <p style={styles.privacy}>
//           🔒 Your resume is processed securely and never stored permanently.
//         </p>
//       </div>

//       <style>{`
//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }
//         @keyframes fillBar {
//           0%   { width: 5%; }
//           30%  { width: 35%; }
//           60%  { width: 65%; }
//           85%  { width: 88%; }
//           100% { width: 95%; }
//         }
//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50%       { opacity: 0.5; }
//         }
//       `}</style>
//     </div>
//   );
// }

// const styles = {
//   page: {
//     minHeight: "100vh",
//     background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     padding: "32px 16px",
//     fontFamily: "'Inter','Segoe UI',sans-serif",
//     position: "relative", overflow: "hidden",
//   },
//   blob1: {
//     position: "absolute", top: "-140px", left: "-140px",
//     width: "480px", height: "480px",
//     background: "radial-gradient(circle,#6366f140 0%,transparent 70%)",
//     pointerEvents: "none",
//   },
//   blob2: {
//     position: "absolute", bottom: "-120px", right: "-100px",
//     width: "420px", height: "420px",
//     background: "radial-gradient(circle,#8b5cf640 0%,transparent 70%)",
//     pointerEvents: "none",
//   },
//   card: {
//     width: "100%", maxWidth: "560px",
//     background: "rgba(255,255,255,0.04)",
//     border: "1px solid rgba(255,255,255,0.1)",
//     borderRadius: "28px",
//     backdropFilter: "blur(20px)",
//     padding: "44px 40px",
//     boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
//     position: "relative", zIndex: 1,
//   },
//   topSection: {
//     textAlign: "center", marginBottom: "32px",
//   },
//   logoMark: {
//     display: "inline-flex", alignItems: "center", justifyContent: "center",
//     width: "52px", height: "52px", borderRadius: "14px",
//     background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
//     fontWeight: 900, fontSize: "20px", color: "#fff",
//     marginBottom: "14px",
//     boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
//   },
//   title: {
//     margin: "0 0 10px",
//     fontSize: "30px", fontWeight: 800, letterSpacing: "-0.8px",
//     background: "linear-gradient(90deg,#818cf8,#c084fc)",
//     WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
//   },
//   subtitle: {
//     margin: 0,
//     fontSize: "14px", color: "#94a3b8", lineHeight: "1.6",
//   },
//   steps: {
//     display: "flex", alignItems: "center", justifyContent: "center",
//     gap: "4px", marginBottom: "28px",
//   },
//   step: {
//     display: "flex", alignItems: "center", gap: "4px",
//   },
//   stepIcon: {
//     fontSize: "16px",
//   },
//   stepLabel: {
//     fontSize: "11px", fontWeight: 600, color: "#64748b",
//     whiteSpace: "nowrap",
//   },
//   stepArrow: {
//     fontSize: "16px", color: "#334155", marginLeft: "4px",
//   },
//   dropzone: {
//     border: "2px dashed rgba(255,255,255,0.15)",
//     borderRadius: "18px",
//     padding: "40px 24px",
//     textAlign: "center",
//     cursor: "pointer",
//     transition: "all 0.25s ease",
//     marginBottom: "20px",
//   },
//   uploadIcon: { fontSize: "40px", marginBottom: "12px" },
//   dropText: {
//     margin: "0 0 6px",
//     fontSize: "15px", fontWeight: 600, color: "#e2e8f0",
//   },
//   dropSub: {
//     margin: 0, fontSize: "13px", color: "#475569",
//   },
//   fileIcon: { fontSize: "36px", marginBottom: "10px" },
//   fileName: {
//     margin: "0 0 4px",
//     fontSize: "15px", fontWeight: 700, color: "#10b981",
//     wordBreak: "break-all",
//   },
//   fileSize: {
//     margin: "0 0 8px", fontSize: "12px", color: "#64748b",
//   },
//   changeHint: {
//     margin: 0, fontSize: "12px", color: "#475569", fontStyle: "italic",
//   },
//   btn: {
//     width: "100%", padding: "15px",
//     background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
//     color: "#fff", border: "none", borderRadius: "14px",
//     fontSize: "15px", fontWeight: 700,
//     letterSpacing: "0.3px",
//     boxShadow: "0 6px 24px rgba(99,102,241,0.4)",
//     transition: "all 0.2s", fontFamily: "inherit",
//     marginBottom: "16px",
//   },
//   loadingBox: {
//     textAlign: "center", padding: "32px 0",
//   },
//   spinner: {
//     width: "44px", height: "44px",
//     border: "3px solid rgba(255,255,255,0.1)",
//     borderTop: "3px solid #6366f1",
//     borderRadius: "50%",
//     margin: "0 auto 20px",
//     animation: "spin 0.9s linear infinite",
//   },
//   loadingStep: {
//     margin: "0 0 16px",
//     fontSize: "15px", fontWeight: 600, color: "#c7d2fe",
//     animation: "pulse 1.5s ease infinite",
//   },
//   loadingBar: {
//     width: "100%", height: "4px",
//     background: "rgba(255,255,255,0.08)",
//     borderRadius: "99px", overflow: "hidden",
//     margin: "0 auto", maxWidth: "320px",
//   },
//   loadingFill: {
//     height: "100%",
//     background: "linear-gradient(90deg,#6366f1,#a855f7)",
//     borderRadius: "99px",
//     animation: "fillBar 9s ease forwards",
//   },
//   privacy: {
//     margin: 0, textAlign: "center",
//     fontSize: "12px", color: "#334155",
//   },
// };

// export default UploadResume;

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