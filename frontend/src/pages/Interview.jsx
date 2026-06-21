// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";

// function Interview() {

//   const navigate = useNavigate();

//   const questions =
//     JSON.parse(
//       localStorage.getItem("questions")
//     ) || [];

//   const [index, setIndex] = useState(0);

//   const [answer, setAnswer] = useState("");

//   const [evaluation, setEvaluation] =
//     useState(null);

//   const [results, setResults] =
//     useState([]);

//   const [followup, setFollowup] =
//     useState(null);

//   const [isFollowup, setIsFollowup] =
//     useState(false);

//   const submitAnswer = async () => {

//     try {

//       const currentQuestion =
//         isFollowup
//           ? followup.question
//           : questions[index].question;

//       const res = await API.post(
//         "/evaluate",
//         {
//           question: currentQuestion,
//           answer: answer
//         }
//       );

//       setEvaluation(res.data);

//       setResults(prev => [
//         ...prev,
//         {
//           question: currentQuestion,
//           answer: answer,
//           evaluation: res.data,
//           isFollowup: isFollowup
//         }
//       ]);

//       if (
//         !isFollowup &&
//         res.data.technical_score <= 4
//       ) {

//         try {

//           const followupRes =
//             await API.post(
//               "/followup-question",
//               {
//                 topic:
//                   questions[index].topic ||
//                   "General",

//                 score:
//                   res.data.technical_score
//               }
//             );

//           setFollowup(
//             followupRes.data
//           );

//         } catch (err) {

//           console.log(err);
//         }
//       }

//     } catch (err) {

//       console.log(err);

//       alert("Evaluation Failed");
//     }
//   };

//   const nextQuestion = () => {

//     if (
//       index === questions.length - 1 &&
//       !isFollowup
//     ) {

//       localStorage.setItem(
//         "interviewResults",
//         JSON.stringify(results)
//       );

//       navigate("/report");

//       return;
//     }

//     if (isFollowup) {

//       setIsFollowup(false);

//       setFollowup(null);

//       setEvaluation(null);

//       setAnswer("");

//       setIndex(index + 1);

//       return;
//     }

//     setEvaluation(null);

//     setAnswer("");

//     setIndex(index + 1);
//   };

//   if (questions.length === 0) {

//     return (
//       <h2 className="text-center mt-5">
//         No Questions Found
//       </h2>
//     );
//   }

//   return (
//     <div className="container mt-5">

//       <div className="card p-4 shadow">

//         <h4>
//           Question {index + 1} / {questions.length}
//         </h4>

//         <h5 className="mt-3">

//           {
//             isFollowup
//               ? followup?.question
//               : questions[index].question
//           }

//         </h5>

//         <p>

//           <strong>Difficulty:</strong>{" "}

//           {
//             isFollowup
//               ? followup?.difficulty
//               : questions[index].difficulty
//           }

//         </p>

//         <textarea
//           className="form-control mt-3"
//           rows="6"
//           value={answer}
//           onChange={(e) =>
//             setAnswer(e.target.value)
//           }
//           placeholder="Type your answer here..."
//         />

//         {!evaluation ? (

//           <button
//             className="btn btn-primary mt-3"
//             onClick={submitAnswer}
//           >
//             Submit Answer
//           </button>

//         ) : (

//           <>

//             <div className="mt-4">

//               <h4>Evaluation</h4>

//               <h5>
//                 Technical Score:
//                 {" "}
//                 {evaluation.technical_score}/10
//               </h5>

//               <h5>
//                 Communication Score:
//                 {" "}
//                 {evaluation.communication_score}/10
//               </h5>

//               <h5 className="mt-3">
//                 Strengths
//               </h5>

//               <ul>
//                 {
//                   evaluation.strengths?.map(
//                     (s, i) => (
//                       <li key={i}>
//                         {s}
//                       </li>
//                     )
//                   )
//                 }
//               </ul>

//               <h5>
//                 Weaknesses
//               </h5>

//               <ul>
//                 {
//                   evaluation.weaknesses?.map(
//                     (s, i) => (
//                       <li key={i}>
//                         {s}
//                       </li>
//                     )
//                   )
//                 }
//               </ul>

//               <h5>
//                 Correct Answer
//               </h5>

//               <p>
//                 {evaluation.correct_answer}
//               </p>

//               <h5>
//                 Improvement Tips
//               </h5>

//               <ul>
//                 {
//                   evaluation.improvement_tips?.map(
//                     (tip, i) => (
//                       <li key={i}>
//                         {tip}
//                       </li>
//                     )
//                   )
//                 }
//               </ul>

//             </div>

//             {
//               followup &&
//               !isFollowup && (

//                 <button
//                   className="btn btn-warning mt-3 me-2"
//                   onClick={() => {

//                     setIsFollowup(true);

//                     setEvaluation(null);

//                     setAnswer("");
//                   }}
//                 >
//                   Take Follow-Up Question
//                 </button>

//               )
//             }

//             <button
//               className="btn btn-success mt-3"
//               onClick={nextQuestion}
//             >
//               {
//                 index === questions.length - 1 &&
//                 !isFollowup
//                   ? "Generate Report"
//                   : "Next Question"
//               }
//             </button>

//           </>

//         )}

//       </div>

//     </div>
//   );
// }

// export default Interview;

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";

// import SpeechRecognition, {
//   useSpeechRecognition
// } from "react-speech-recognition";

// function Interview() {

//   const navigate = useNavigate();

//   const questions =
//     JSON.parse(
//       localStorage.getItem("questions")
//     ) || [];

//   const [index, setIndex] = useState(0);

//   const [answer, setAnswer] =
//     useState("");

//   const [evaluation, setEvaluation] =
//     useState(null);

//   const [results, setResults] =
//     useState([]);

//   const [followup, setFollowup] =
//     useState(null);

//   const [isFollowup, setIsFollowup] =
//     useState(false);

//   const {
//     transcript,
//     resetTranscript,
//     browserSupportsSpeechRecognition
//   } = useSpeechRecognition();

//   const submitAnswer = async () => {

//     try {

//       const currentQuestion =
//         isFollowup
//           ? followup.question
//           : questions[index].question;

//       const res = await API.post(
//         "/evaluate",
//         {
//           question: currentQuestion,
//           answer: answer
//         }
//       );

//       setEvaluation(res.data);

//       setResults(prev => [
//         ...prev,
//         {
//           question: currentQuestion,
//           answer: answer,
//           evaluation: res.data,
//           isFollowup
//         }
//       ]);

//       if (
//         !isFollowup &&
//         res.data.technical_score <= 4
//       ) {

//         const followupRes =
//           await API.post(
//             "/followup-question",
//             {
//               topic:
//                 questions[index].topic ||
//                 "General",

//               score:
//                 res.data.technical_score
//             }
//           );

//         setFollowup(
//           followupRes.data
//         );
//       }

//     } catch (err) {

//       console.log(err);

//       alert("Evaluation Failed");
//     }
//   };

//   const nextQuestion = () => {

//     if (
//       index === questions.length - 1 &&
//       !isFollowup
//     ) {

//       localStorage.setItem(
//         "interviewResults",
//         JSON.stringify(results)
//       );

//       navigate("/report");

//       return;
//     }

//     if (isFollowup) {

//       setIsFollowup(false);

//       setFollowup(null);

//       setEvaluation(null);

//       setAnswer("");

//       resetTranscript();

//       setIndex(index + 1);

//       return;
//     }

//     setEvaluation(null);

//     setAnswer("");

//     resetTranscript();

//     setIndex(index + 1);
//   };

//   if (!browserSupportsSpeechRecognition) {

//     return (
//       <h2 className="text-center mt-5">
//         Browser does not support
//         Speech Recognition
//       </h2>
//     );
//   }

//   if (questions.length === 0) {

//     return (
//       <h2 className="text-center mt-5">
//         No Questions Found
//       </h2>
//     );
//   }

//   return (

//     <div className="container mt-5">

//       <div className="card shadow p-4">

//         <h4>
//           Question {index + 1}
//           {" / "}
//           {questions.length}
//         </h4>

//         <h5 className="mt-3">

//           {
//             isFollowup
//               ? followup?.question
//               : questions[index].question
//           }

//         </h5>

//         <p>

//           <strong>
//             Difficulty:
//           </strong>

//           {" "}

//           {
//             isFollowup
//               ? followup?.difficulty
//               : questions[index].difficulty
//           }

//         </p>

//         <div className="mb-3">

//           <button
//             className="btn btn-warning me-2"
//             onClick={() =>
//               SpeechRecognition.startListening({
//                 continuous: true
//               })
//             }
//           >
//             🎤 Start Speaking
//           </button>

//           <button
//             className="btn btn-danger me-2"
//             onClick={() =>
//               SpeechRecognition.stopListening()
//             }
//           >
//             Stop
//           </button>

//           <button
//             className="btn btn-success"
//             onClick={() =>
//               setAnswer(transcript)
//             }
//           >
//             Use Speech
//           </button>

//         </div>

//         <div className="alert alert-secondary">

//           <strong>
//             Transcript:
//           </strong>

//           <br />

//           {transcript}

//         </div>

//         <textarea
//           className="form-control"
//           rows="6"
//           value={answer}
//           onChange={(e) =>
//             setAnswer(
//               e.target.value
//             )
//           }
//           placeholder="Type or speak your answer..."
//         />

//         {
//           !evaluation ? (

//             <button
//               className="btn btn-primary mt-3"
//               onClick={submitAnswer}
//             >
//               Submit Answer
//             </button>

//           ) : (

//             <>

//               <div className="mt-4">

//                 <h4>
//                   Evaluation
//                 </h4>

//                 <h5>
//                   Technical Score:
//                   {" "}
//                   {evaluation.technical_score}/10
//                 </h5>

//                 <h5>
//                   Communication Score:
//                   {" "}
//                   {evaluation.communication_score}/10
//                 </h5>

//                 <h5 className="mt-3">
//                   Strengths
//                 </h5>

//                 <ul>
//                   {
//                     evaluation.strengths?.map(
//                       (s, i) => (
//                         <li key={i}>
//                           {s}
//                         </li>
//                       )
//                     )
//                   }
//                 </ul>

//                 <h5>
//                   Weaknesses
//                 </h5>

//                 <ul>
//                   {
//                     evaluation.weaknesses?.map(
//                       (s, i) => (
//                         <li key={i}>
//                           {s}
//                         </li>
//                       )
//                     )
//                   }
//                 </ul>

//                 <h5>
//                   Correct Answer
//                 </h5>

//                 <p>
//                   {
//                     evaluation.correct_answer
//                   }
//                 </p>

//                 <h5>
//                   Improvement Tips
//                 </h5>

//                 <ul>
//                   {
//                     evaluation.improvement_tips?.map(
//                       (tip, i) => (
//                         <li key={i}>
//                           {tip}
//                         </li>
//                       )
//                     )
//                   }
//                 </ul>

//               </div>

//               {
//                 followup &&
//                 !isFollowup && (

//                   <button
//                     className="btn btn-warning mt-3 me-2"
//                     onClick={() => {

//                       setIsFollowup(true);

//                       setEvaluation(null);

//                       setAnswer("");

//                       resetTranscript();
//                     }}
//                   >
//                     Take Follow-Up Question
//                   </button>

//                 )
//               }

//               <button
//                 className="btn btn-success mt-3"
//                 onClick={nextQuestion}
//               >
//                 {
//                   index ===
//                     questions.length - 1 &&
//                   !isFollowup
//                     ? "Generate Report"
//                     : "Next Question"
//                 }
//               </button>

//             </>

//           )
//         }

//       </div>

//     </div>
//   );
// }

// export default Interview;

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";

// import SpeechRecognition, {
// useSpeechRecognition
// } from "react-speech-recognition";

// function Interview() {

// const navigate = useNavigate();

// const questions =
// JSON.parse(
// localStorage.getItem("questions")
// ) || [];

// const [index, setIndex] = useState(0);

// const [answer, setAnswer] =
// useState("");

// const [evaluation, setEvaluation] =
// useState(null);

// const [results, setResults] =
// useState([]);

// const [followup, setFollowup] =
// useState(null);

// const [isFollowup, setIsFollowup] =
// useState(false);

// const {
// transcript,
// resetTranscript,
// browserSupportsSpeechRecognition
// } = useSpeechRecognition();

// useEffect(() => {


// if (transcript) {

//   setAnswer(transcript);

// }


// }, [transcript]);

// const submitAnswer = async () => {


// try {

//   const currentQuestion =
//     isFollowup
//       ? followup.question
//       : questions[index].question;

//   const res = await API.post(
//     "/evaluate",
//     {
//       question: currentQuestion,
//       answer: answer
//     }
//   );

//   setEvaluation(res.data);

//   setResults(prev => [
//     ...prev,
//     {
//       question: currentQuestion,
//       answer: answer,
//       evaluation: res.data,
//       isFollowup
//     }
//   ]);

//   if (
//     !isFollowup &&
//     res.data.technical_score <= 4
//   ) {

//     try {

//       const followupRes =
//         await API.post(
//           "/followup-question",
//           {
//             topic:
//               questions[index].topic ||
//               "General",

//             score:
//               res.data.technical_score
//           }
//         );

//       setFollowup(
//         followupRes.data
//       );

//     } catch (err) {

//       console.log(err);
//     }
//   }

// } catch (err) {

//   console.log(err);

//   alert(
//     "Evaluation Failed"
//   );
// }


// };

// const nextQuestion = () => {


// if (
//   index === questions.length - 1 &&
//   !isFollowup
// ) {

//   localStorage.setItem(
//     "interviewResults",
//     JSON.stringify(results)
//   );

//   navigate("/report");

//   return;
// }

// if (isFollowup) {

//   setIsFollowup(false);

//   setFollowup(null);

//   setEvaluation(null);

//   setAnswer("");

//   resetTranscript();

//   setIndex(index + 1);

//   return;
// }

// setEvaluation(null);

// setAnswer("");

// resetTranscript();



// };

// if (
// !browserSupportsSpeechRecognition
// ) {


// return (
//   <h2 className="text-center mt-5">
//     Browser does not support
//     Speech Recognition
//   </h2>
// );


// }

// if (questions.length === 0) {


// return (
//   <h2 className="text-center mt-5">
//     No Questions Found
//   </h2>
// );


// }

// return (


// <div className="container mt-5">

//   <div className="card shadow p-4">

//     <h4>
//       Question {index + 1}
//       {" / "}
//       {questions.length}
//     </h4>

//     <h5 className="mt-3">

//       {
//         isFollowup
//           ? followup?.question
//           : questions[index].question
//       }

//     </h5>

//     <p>

//       <strong>
//         Difficulty:
//       </strong>

//       {" "}

//       {
//         isFollowup
//           ? followup?.difficulty
//           : questions[index].difficulty
//       }

//     </p>

//     <div className="mb-3">

//       <button
//         className="btn btn-warning me-2"
//         onClick={() =>
//           SpeechRecognition.startListening({
//             continuous: true,
//             language: "en-US"
//           })
//         }
//       >
//         🎤 Start Speaking
//       </button>

//       <button
//         className="btn btn-danger"
//         onClick={() =>
//           SpeechRecognition.stopListening()
//         }
//       >
//         🛑 Stop Recording
//       </button>

//     </div>

//     <div className="alert alert-secondary">

//       <strong>
//         Live Transcript
//       </strong>

//       <hr />

//       {
//         transcript ||
//         "Start speaking..."
//       }

//     </div>

//     <textarea
//       className="form-control"
//       rows="6"
//       value={answer}
//       onChange={(e) =>
//         setAnswer(
//           e.target.value
//         )
//       }
//       placeholder="Type or speak your answer..."
//     />

//     {
//       !evaluation ? (

//         <button
//           className="btn btn-primary mt-3"
//           onClick={submitAnswer}
//         >
//           Submit Answer
//         </button>

//       ) : (

//         <>

//           <div className="mt-4">

//             <h4>
//               Evaluation
//             </h4>

//             <h5>
//               Technical Score:
//               {" "}
//               {evaluation.technical_score}/10
//             </h5>

//             <h5>
//               Communication Score:
//               {" "}
//               {evaluation.communication_score}/10
//             </h5>

//             <h5 className="mt-3">
//               Strengths
//             </h5>

//             <ul>
//               {
//                 evaluation.strengths?.map(
//                   (s, i) => (
//                     <li key={i}>
//                       {s}
//                     </li>
//                   )
//                 )
//               }
//             </ul>

//             <h5>
//               Weaknesses
//             </h5>

//             <ul>
//               {
//                 evaluation.weaknesses?.map(
//                   (s, i) => (
//                     <li key={i}>
//                       {s}
//                     </li>
//                   )
//                 )
//               }
//             </ul>

//             <h5>
//               Correct Answer
//             </h5>

//             <p>
//               {
//                 evaluation.correct_answer
//               }
//             </p>

//             <h5>
//               Improvement Tips
//             </h5>

//             <ul>
//               {
//                 evaluation.improvement_tips?.map(
//                   (tip, i) => (
//                     <li key={i}>
//                       {tip}
//                     </li>
//                   )
//                 )
//               }
//             </ul>

//           </div>

//           {
//             followup &&
//             !isFollowup && (

//               <button
//                 className="btn btn-warning mt-3 me-2"
//                 onClick={() => {

//                   setIsFollowup(true);

//                   setEvaluation(null);

//                   setAnswer("");

//                   resetTranscript();
//                 }}
//               >
//                 Take Follow-Up Question
//               </button>

//             )
//           }

//           <button
//             className="btn btn-success mt-3"
//             onClick={nextQuestion}
//           >
//             {
//               index ===
//                 questions.length - 1 &&
//               !isFollowup
//                 ? "Generate Report"
//                 : "Next Question"
//             }
//           </button>

//         </>

//       )
//     }

//   </div>

// </div>


// );
// }

// export default Interview;


//real

// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";
// import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
// import interviewer from "../assets/interviewer.png";

// function Interview() {
//   const navigate = useNavigate();

//   // ✅ FIX 1: Use useRef so questions never goes stale across renders
//   const questionsRef = useRef(
//     JSON.parse(localStorage.getItem("questions")) || []
//   );
//   const questions = questionsRef.current;

//   const [index, setIndex] = useState(0);
//   const indexRef = useRef(0); // ✅ FIX 2: Track index in ref so callbacks always get latest

//   const [answer, setAnswer] = useState("");
//   const answerRef = useRef(""); // ✅ FIX 3: Track answer in ref for submitAnswer closure

//   const [results, setResults] = useState([]);
//   const resultsRef = useRef([]);

//   const [followup, setFollowup] = useState(null);
//   const followupRef = useRef(null);

//   const [isFollowup, setIsFollowup] = useState(false);
//   const isFollowupRef = useRef(false);

//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [isListening2, setIsListening2] = useState(false);
//   const [interviewMessage, setInterviewMessage] = useState("Initializing interview…");
//   const [phase, setPhase] = useState("greeting");
//   const [dots, setDots] = useState("");
//   const [mouthOpen, setMouthOpen] = useState(false);
//   const mouthInterval = useRef(null);

//   const {
//     transcript,
//     resetTranscript,
//     browserSupportsSpeechRecognition,
//     listening,
//   } = useSpeechRecognition();

//   // Keep answerRef in sync
//   useEffect(() => {
//     answerRef.current = answer;
//   }, [answer]);

//   // Animated dots
//   useEffect(() => {
//     if (isListening2) {
//       const iv = setInterval(() => setDots((d) => (d.length >= 3 ? "" : d + ".")), 400);
//       return () => clearInterval(iv);
//     }
//     setDots("");
//   }, [isListening2]);

//   // Mouth animation
//   useEffect(() => {
//     if (isSpeaking) {
//       mouthInterval.current = setInterval(() => setMouthOpen((o) => !o), 180);
//     } else {
//       clearInterval(mouthInterval.current);
//       setMouthOpen(false);
//     }
//     return () => clearInterval(mouthInterval.current);
//   }, [isSpeaking]);

//   // Transcript → answer
//   useEffect(() => {
//     if (transcript) {
//       setAnswer(transcript);
//       answerRef.current = transcript;
//     }
//   }, [transcript]);

//   // ── Speak helper ──────────────────────────────────────────
//   const speak = (text, onDone) => {
//     window.speechSynthesis.cancel();
//     setIsSpeaking(true);
//     setInterviewMessage(text);

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.rate = 0.95;
//     utterance.pitch = 1.05;

//     utterance.onend = () => {
//       setIsSpeaking(false);
//       if (onDone) onDone();
//     };
//     utterance.onerror = () => {
//       setIsSpeaking(false);
//       if (onDone) onDone();
//     };

//     window.speechSynthesis.speak(utterance);
//   };

//   const startListening = () => {
//     resetTranscript();
//     setAnswer("");
//     answerRef.current = "";
//     setIsListening2(true);
//     SpeechRecognition.startListening({ continuous: true, language: "en-US" });
//   };

//   const stopListening = () => {
//     setIsListening2(false);
//     SpeechRecognition.stopListening();
//   };

//   // ── Greeting on mount ─────────────────────────────────────
//   useEffect(() => {
//     if (questions.length === 0) return;

//     const greeting =
//       "Hello! Welcome to InterviewIQ. I will be your interviewer today. Please answer each question clearly. Let us begin.";

//     speak(greeting, () => {
//       setPhase("questioning");
//       const firstQ = questions[0]?.question;
//       if (firstQ) {
//         speak(firstQ, () => startListening());
//       }
//     });

//     return () => {
//       window.speechSynthesis.cancel();
//       SpeechRecognition.stopListening();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ── Submit answer ─────────────────────────────────────────
//   const submitAnswer = async () => {
//     stopListening();

//     const currentAnswer = answerRef.current.trim();
//     if (!currentAnswer) {
//       alert("Please speak or type your answer first.");
//       return;
//     }

//     // ✅ FIX 4: Always read question from refs — never from stale closure
//     const currentQuestion = isFollowupRef.current
//       ? followupRef.current?.question
//       : questions[indexRef.current]?.question;

//     // ✅ FIX 5: Guard — never send undefined question to backend
//     if (!currentQuestion) {
//       alert("Question not loaded yet. Please wait a moment.");
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       const res = await API.post("/evaluate", {
//         question: currentQuestion,
//         answer: currentAnswer,
//       });

//       // ✅ FIX 6: Check response has expected fields
//       if (
//         res.data === undefined ||
//         res.data.technical_score === undefined
//       ) {
//         throw new Error("Invalid evaluation response from server");
//       }

//       const newResult = {
//         question: currentQuestion,
//         answer: currentAnswer,
//         evaluation: res.data,
//         isFollowup: isFollowupRef.current,
//       };

//       const updatedResults = [...resultsRef.current, newResult];
//       resultsRef.current = updatedResults;
//       setResults(updatedResults);

//       // Follow-up for low score
//       if (!isFollowupRef.current && res.data.technical_score <= 4) {
//         try {
//           const followupRes = await API.post("/followup-question", {
//             topic: questions[indexRef.current]?.topic || "General",
//             score: res.data.technical_score,
//           });

//           if (followupRes.data?.question) {
//             followupRef.current = followupRes.data;
//             isFollowupRef.current = true;
//             setFollowup(followupRes.data);
//             setIsFollowup(true);
//             setAnswer("");
//             answerRef.current = "";
//             resetTranscript();
//             setIsProcessing(false);
//             speak(followupRes.data.question, () => startListening());
//             return;
//           }
//         } catch (err) {
//           console.warn("Follow-up error (skipping):", err);
//           // Don't block — just advance normally
//         }
//       }

//       advanceInterview(updatedResults);
//     } catch (err) {
//       console.error("Evaluation error:", err);
//       setIsProcessing(false);
//       // ✅ FIX 7: Show specific error and allow retry, don't crash
//       alert(
//         "Evaluation failed. Check your internet connection or backend. You can try submitting again."
//       );
//     }
//   };

//   // ── Advance to next question ──────────────────────────────
//   const advanceInterview = (latestResults) => {
//     const currentIndex = indexRef.current;
//     const nextIndex = currentIndex + 1;
//     const isLast = !isFollowupRef.current && currentIndex >= questions.length - 1;
//     const mainAnswers = latestResults.filter((r) => !r.isFollowup).length;

//     if (isLast || mainAnswers >= questions.length) {
//       setPhase("done");
//       localStorage.setItem("interviewResults", JSON.stringify(latestResults));
//       setIsProcessing(false);

//       speak(
//         "Thank you so much for your time. That concludes our interview. Your report is being prepared now. Great job!",
//         () => setTimeout(() => navigate("/report"), 1500)
//       );
//       return;
//     }

//     // Reset follow-up state
//     if (isFollowupRef.current) {
//       isFollowupRef.current = false;
//       followupRef.current = null;
//       setIsFollowup(false);
//       setFollowup(null);
//     }

//     // Update index
//     indexRef.current = nextIndex;
//     setIndex(nextIndex);

//     setAnswer("");
//     answerRef.current = "";
//     resetTranscript();
//     setIsProcessing(false);

//     const nextQ = questions[nextIndex]?.question;
//     if (nextQ) {
//       speak(nextQ, () => startListening());
//     }
//   };

//   // ── Guards ────────────────────────────────────────────────
//   if (!browserSupportsSpeechRecognition) {
//     return (
//       <div style={styles.errorWrap}>
//         <p>Your browser does not support Speech Recognition. Please use Chrome.</p>
//       </div>
//     );
//   }

//   if (questions.length === 0) {
//     return (
//       <div style={styles.errorWrap}>
//         <p>No questions found. Please upload your resume first.</p>
//       </div>
//     );
//   }

//   const currentIdx = index;
//   const questionLabel = isFollowup
//     ? `Follow-Up · Q${currentIdx + 1}`
//     : `Question ${currentIdx + 1} of ${questions.length}`;

//   const progress = Math.min(
//     ((currentIdx + (isFollowup ? 0.5 : 0)) / questions.length) * 100,
//     100
//   );

//   return (
//     <div style={styles.page}>
//       <div style={styles.blob1} />
//       <div style={styles.blob2} />

//       <div style={styles.shell}>
//         {/* Header */}
//         <div style={styles.header}>
//           <span style={styles.logo}>InterviewIQ</span>
//           <span style={styles.badge}>
//             {phase === "greeting"
//               ? "🟡 Intro"
//               : phase === "done"
//               ? "✅ Complete"
//               : listening
//               ? "🔴 Recording"
//               : isSpeaking
//               ? "🔵 Speaking"
//               : "⏸ Paused"}
//           </span>
//         </div>

//         {/* Progress */}
//         <div style={styles.progressWrap}>
//           <div style={{ ...styles.progressFill, width: `${progress}%` }} />
//         </div>

//         <div style={styles.main}>
//           {/* ── Left: Avatar ── */}
//           <div style={styles.avatarCol}>
//             <div style={styles.avatarCard}>
//               <div
//                 style={{
//                   ...styles.pulseRing,
//                   animation: isSpeaking ? "pulseRing 1s infinite" : "none",
//                   opacity: isSpeaking ? 1 : 0,
//                 }}
//               />

//               <img
//                 src={interviewer}
//                 alt="AI Interviewer"
//                 style={{
//                   ...styles.avatar,
//                   filter: isSpeaking ? "drop-shadow(0 0 18px #6366f1aa)" : "none",
//                 }}
//               />

//               {/* Mouth dot */}
//               <div style={styles.mouthBubbleWrap}>
//                 <div
//                   style={{
//                     ...styles.mouthDot,
//                     background: isSpeaking ? "#6366f1" : "#cbd5e1",
//                     width: isSpeaking && mouthOpen ? "11px" : "7px",
//                     height: isSpeaking && mouthOpen ? "7px" : "5px",
//                     borderRadius: "50%",
//                   }}
//                 />
//               </div>

//               {/* Speech bubble */}
//               <div
//                 style={{
//                   ...styles.speechBubble,
//                   borderColor: isSpeaking ? "#6366f1" : "rgba(255,255,255,0.12)",
//                 }}
//               >
//                 <div style={styles.speechPointer} />
//                 <p style={styles.speechText}>{interviewMessage}</p>
//               </div>

//               {/* Status pill */}
//               <div
//                 style={{
//                   ...styles.statusPill,
//                   background: isSpeaking
//                     ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
//                     : isListening2
//                     ? "linear-gradient(135deg,#ef4444,#f97316)"
//                     : isProcessing
//                     ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
//                     : "rgba(255,255,255,0.08)",
//                   color: isSpeaking || isListening2 || isProcessing ? "#fff" : "#64748b",
//                 }}
//               >
//                 {isSpeaking
//                   ? "🗣 Speaking…"
//                   : isListening2
//                   ? `🎙 Listening${dots}`
//                   : isProcessing
//                   ? "⚙ Evaluating…"
//                   : "⏸ Idle"}
//               </div>
//             </div>

//             <div style={styles.qLabel}>{questionLabel}</div>
//           </div>

//           {/* ── Right: Transcript + Controls ── */}
//           <div style={styles.rightCol}>
//             {/* Transcript */}
//             <div style={styles.transcriptBox}>
//               <div style={styles.transcriptHeader}>
//                 <span
//                   style={{
//                     width: "8px", height: "8px", borderRadius: "50%",
//                     background: listening ? "#ef4444" : "#475569",
//                     boxShadow: listening ? "0 0 8px #ef4444" : "none",
//                     transition: "all 0.3s", flexShrink: 0,
//                   }}
//                 />
//                 <span style={{ fontWeight: 600, color: "#94a3b8", fontSize: "13px" }}>
//                   {listening ? "Live Transcript" : "Your Answer"}
//                 </span>
//               </div>
//               <div style={styles.transcriptContent}>
//                 {transcript || answer ? (
//                   <p style={styles.transcriptText}>{transcript || answer}</p>
//                 ) : (
//                   <p style={styles.transcriptPlaceholder}>
//                     Your spoken words will appear here…
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Text fallback */}
//             <textarea
//               style={styles.textarea}
//               rows={3}
//               value={answer}
//               onChange={(e) => {
//                 setAnswer(e.target.value);
//                 answerRef.current = e.target.value;
//               }}
//               placeholder="Or type your answer here if needed…"
//               disabled={isProcessing || phase === "done"}
//             />

//             {/* Controls */}
//             <div style={styles.controls}>
//               <button
//                 style={{
//                   ...styles.btn, ...styles.btnRecord,
//                   opacity: isProcessing || isSpeaking || phase === "done" ? 0.4 : 1,
//                   cursor: isProcessing || isSpeaking || phase === "done" ? "not-allowed" : "pointer",
//                 }}
//                 onClick={startListening}
//                 disabled={isProcessing || isSpeaking || phase === "done"}
//               >
//                 🎙 Start Speaking
//               </button>

//               <button
//                 style={{
//                   ...styles.btn, ...styles.btnStop,
//                   opacity: !listening ? 0.4 : 1,
//                   cursor: !listening ? "not-allowed" : "pointer",
//                 }}
//                 onClick={stopListening}
//                 disabled={!listening}
//               >
//                 ⏹ Stop
//               </button>

//               <button
//                 style={{
//                   ...styles.btn, ...styles.btnSubmit,
//                   opacity: isProcessing || !answer.trim() || phase === "done" ? 0.4 : 1,
//                   cursor: isProcessing || !answer.trim() || phase === "done" ? "not-allowed" : "pointer",
//                   marginLeft: "auto",
//                 }}
//                 onClick={submitAnswer}
//                 disabled={isProcessing || !answer.trim() || phase === "done"}
//               >
//                 {isProcessing ? "⚙ Evaluating…" : "✔ Submit Answer"}
//               </button>
//             </div>

//             {phase === "questioning" && !isProcessing && (
//               <div style={styles.tip}>
//                 💡 Click <strong>Start Speaking</strong>, answer the question, then click <strong>Stop</strong> and <strong>Submit Answer</strong>
//               </div>
//             )}

//             {phase === "done" && (
//               <div style={styles.doneBanner}>
//                 🎉 Interview complete! Redirecting to your report…
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes pulseRing {
//           0%   { transform: translate(-50%,-50%) scale(1);    opacity: 0.7; }
//           50%  { transform: translate(-50%,-50%) scale(1.12); opacity: 0.25; }
//           100% { transform: translate(-50%,-50%) scale(1);    opacity: 0.7; }
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
//     padding: "24px 16px",
//     fontFamily: "'Inter','Segoe UI',sans-serif",
//     position: "relative", overflow: "hidden",
//   },
//   blob1: {
//     position: "absolute", top: "-120px", left: "-120px",
//     width: "420px", height: "420px",
//     background: "radial-gradient(circle,#6366f155 0%,transparent 70%)",
//     pointerEvents: "none",
//   },
//   blob2: {
//     position: "absolute", bottom: "-100px", right: "-80px",
//     width: "380px", height: "380px",
//     background: "radial-gradient(circle,#8b5cf655 0%,transparent 70%)",
//     pointerEvents: "none",
//   },
//   shell: {
//     width: "100%", maxWidth: "980px",
//     background: "rgba(255,255,255,0.04)",
//     border: "1px solid rgba(255,255,255,0.1)",
//     borderRadius: "24px",
//     backdropFilter: "blur(18px)",
//     overflow: "hidden",
//     boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
//   },
//   header: {
//     display: "flex", alignItems: "center", justifyContent: "space-between",
//     padding: "16px 28px",
//     borderBottom: "1px solid rgba(255,255,255,0.08)",
//   },
//   logo: {
//     fontWeight: 800, fontSize: "20px", letterSpacing: "-0.5px",
//     background: "linear-gradient(90deg,#818cf8,#c084fc)",
//     WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
//   },
//   badge: {
//     fontSize: "13px", fontWeight: 600, color: "#cbd5e1",
//     padding: "4px 14px",
//     background: "rgba(255,255,255,0.07)",
//     borderRadius: "99px", border: "1px solid rgba(255,255,255,0.1)",
//   },
//   progressWrap: { width: "100%", height: "3px", background: "rgba(255,255,255,0.07)" },
//   progressFill: {
//     height: "100%",
//     background: "linear-gradient(90deg,#6366f1,#a855f7)",
//     transition: "width 0.6s ease",
//   },
//   main: { display: "flex", minHeight: "560px" },
//   avatarCol: {
//     width: "320px", flexShrink: 0,
//     padding: "32px 20px",
//     borderRight: "1px solid rgba(255,255,255,0.07)",
//     display: "flex", flexDirection: "column",
//     alignItems: "center", gap: "16px",
//   },
//   avatarCard: {
//     position: "relative",
//     display: "flex", flexDirection: "column",
//     alignItems: "center", width: "100%",
//   },
//   pulseRing: {
//     position: "absolute", top: "50%", left: "50%",
//     width: "210px", height: "210px",
//     borderRadius: "50%",
//     border: "3px solid #6366f1",
//     pointerEvents: "none", zIndex: 0,
//   },
//   avatar: {
//     width: "180px", height: "180px",
//     borderRadius: "50%", objectFit: "cover",
//     border: "3px solid rgba(99,102,241,0.5)",
//     boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
//     position: "relative", zIndex: 1,
//     transition: "filter 0.3s",
//   },
//   mouthBubbleWrap: {
//     marginTop: "-8px", zIndex: 2,
//     display: "flex", justifyContent: "center",
//   },
//   mouthDot: { transition: "all 0.18s ease" },
//   speechBubble: {
//     position: "relative", marginTop: "16px",
//     background: "rgba(255,255,255,0.05)",
//     border: "1.5px solid rgba(255,255,255,0.12)",
//     borderRadius: "16px", padding: "14px 16px",
//     width: "100%", boxSizing: "border-box",
//     transition: "border-color 0.3s",
//   },
//   speechPointer: {
//     position: "absolute", top: "-9px", left: "50%",
//     transform: "translateX(-50%)",
//     width: 0, height: 0,
//     borderLeft: "9px solid transparent",
//     borderRight: "9px solid transparent",
//     borderBottom: "9px solid rgba(255,255,255,0.05)",
//   },
//   speechText: {
//     margin: 0, fontSize: "13px",
//     lineHeight: "1.65", color: "#e2e8f0", fontStyle: "italic",
//   },
//   statusPill: {
//     marginTop: "14px", padding: "7px 20px",
//     borderRadius: "99px", fontSize: "13px",
//     fontWeight: 600, transition: "all 0.3s",
//     letterSpacing: "0.3px",
//   },
//   qLabel: {
//     fontSize: "11px", fontWeight: 700,
//     letterSpacing: "1px", textTransform: "uppercase",
//     color: "#818cf8", padding: "6px 14px",
//     background: "rgba(99,102,241,0.1)",
//     borderRadius: "99px",
//     border: "1px solid rgba(99,102,241,0.25)",
//   },
//   rightCol: {
//     flex: 1, padding: "28px 28px",
//     display: "flex", flexDirection: "column", gap: "14px",
//   },
//   transcriptBox: {
//     background: "rgba(255,255,255,0.03)",
//     border: "1px solid rgba(255,255,255,0.09)",
//     borderRadius: "14px", overflow: "hidden",
//     flex: 1, minHeight: "150px",
//     display: "flex", flexDirection: "column",
//   },
//   transcriptHeader: {
//     display: "flex", alignItems: "center", gap: "8px",
//     padding: "10px 16px",
//     borderBottom: "1px solid rgba(255,255,255,0.06)",
//     background: "rgba(255,255,255,0.02)",
//   },
//   transcriptContent: { padding: "16px", flex: 1, overflowY: "auto" },
//   transcriptText: { margin: 0, fontSize: "16px", lineHeight: "1.7", color: "#f1f5f9" },
//   transcriptPlaceholder: { margin: 0, fontSize: "15px", color: "#475569", fontStyle: "italic" },
//   textarea: {
//     width: "100%", borderRadius: "12px",
//     border: "1px solid rgba(255,255,255,0.1)",
//     background: "rgba(255,255,255,0.04)",
//     color: "#f1f5f9", fontSize: "15px",
//     padding: "12px 16px", resize: "none",
//     outline: "none", fontFamily: "inherit",
//     boxSizing: "border-box",
//   },
//   controls: { display: "flex", gap: "10px", flexWrap: "wrap" },
//   btn: {
//     padding: "11px 20px", borderRadius: "11px",
//     border: "none", fontWeight: 700, fontSize: "14px",
//     cursor: "pointer", transition: "all 0.2s",
//     fontFamily: "inherit",
//   },
//   btnRecord: {
//     background: "linear-gradient(135deg,#f97316,#ef4444)",
//     color: "#fff", boxShadow: "0 4px 14px rgba(239,68,68,0.3)",
//   },
//   btnStop: {
//     background: "rgba(255,255,255,0.08)",
//     color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.12)",
//   },
//   btnSubmit: {
//     background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
//     color: "#fff", boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
//   },
//   tip: { fontSize: "13px", color: "#475569", textAlign: "center" },
//   doneBanner: {
//     background: "linear-gradient(135deg,#059669,#10b981)",
//     color: "#fff", borderRadius: "12px",
//     padding: "14px 20px", textAlign: "center",
//     fontWeight: 700, fontSize: "15px",
//     boxShadow: "0 4px 20px rgba(16,185,129,0.35)",
//   },
//   errorWrap: {
//     minHeight: "100vh", display: "flex",
//     alignItems: "center", justifyContent: "center",
//     color: "#f1f5f9", fontSize: "18px", background: "#0f172a",
//   },
// };

// export default Interview;


// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";
// import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
// import interviewer from "../assets/interviewer.png";

// const SILENCE_TIMEOUT = 3000; // 3 seconds of silence = auto submit

// function Interview() {
//   const navigate = useNavigate();
//   const questionsRef = useRef(JSON.parse(localStorage.getItem("questions")) || []);
//   const questions = questionsRef.current;

//   const indexRef = useRef(0);
//   const answerRef = useRef("");
//   const resultsRef = useRef([]);
//   const followupRef = useRef(null);
//   const isFollowupRef = useRef(false);
//   const silenceTimer = useRef(null);
//   const isProcessingRef = useRef(false);

//   const [mouthText, setMouthText] = useState("");
//   const [phase, setPhase] = useState("greeting"); // greeting | listening | processing | done
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [mouthOpen, setMouthOpen] = useState(false);
//   const mouthInterval = useRef(null);

//   const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
//     useSpeechRecognition();

//   // Mouth animation while AI speaks
//   useEffect(() => {
//     if (isSpeaking) {
//       mouthInterval.current = setInterval(() => setMouthOpen((o) => !o), 160);
//     } else {
//       clearInterval(mouthInterval.current);
//       setMouthOpen(false);
//     }
//     return () => clearInterval(mouthInterval.current);
//   }, [isSpeaking]);

//   // Auto-submit after silence
//   useEffect(() => {
//     if (phase !== "listening") return;
//     if (!transcript) return;

//     answerRef.current = transcript;

//     // Reset silence timer on every new word
//     clearTimeout(silenceTimer.current);
//     silenceTimer.current = setTimeout(() => {
//       if (answerRef.current.trim() && !isProcessingRef.current) {
//         autoSubmit();
//       }
//     }, SILENCE_TIMEOUT);

//     return () => clearTimeout(silenceTimer.current);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [transcript]);

//   // ── Speak ─────────────────────────────────────────────────
//   const speak = (text, onDone) => {
//     window.speechSynthesis.cancel();
//     setIsSpeaking(true);
//     setMouthText(text);

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.rate = 0.92;
//     utterance.pitch = 1.05;

//     utterance.onend = () => {
//       setIsSpeaking(false);
//       if (onDone) onDone();
//     };
//     utterance.onerror = () => {
//       setIsSpeaking(false);
//       if (onDone) onDone();
//     };

//     window.speechSynthesis.speak(utterance);
//   };

//   // ── Start listening ───────────────────────────────────────
//   const startListening = () => {
//     resetTranscript();
//     answerRef.current = "";
//     setPhase("listening");
//     setMouthText("🎙 I'm listening…");
//     SpeechRecognition.startListening({ continuous: true, language: "en-US" });
//   };

//   // ── Auto submit after silence ─────────────────────────────
//   const autoSubmit = async () => {
//     if (isProcessingRef.current) return;
//     isProcessingRef.current = true;

//     SpeechRecognition.stopListening();
//     clearTimeout(silenceTimer.current);

//     setPhase("processing");
//     setMouthText("⚙ Analyzing your answer…");

//     const currentAnswer = answerRef.current.trim();
//     const currentQuestion = isFollowupRef.current
//       ? followupRef.current?.question
//       : questions[indexRef.current]?.question;

//     if (!currentAnswer || !currentQuestion) {
//       isProcessingRef.current = false;
//       startListening();
//       return;
//     }

//     try {
//       const res = await API.post("/evaluate", {
//         question: currentQuestion,
//         answer: currentAnswer,
//       });

//       if (!res.data || res.data.technical_score === undefined) {
//         throw new Error("Invalid response");
//       }

//       const newResult = {
//         question: currentQuestion,
//         answer: currentAnswer,
//         evaluation: res.data,
//         isFollowup: isFollowupRef.current,
//       };

//       resultsRef.current = [...resultsRef.current, newResult];

//       // Follow-up for low score
//       if (!isFollowupRef.current && res.data.technical_score <= 4) {
//         try {
//           const fRes = await API.post("/followup-question", {
//             topic: questions[indexRef.current]?.topic || "General",
//             score: res.data.technical_score,
//           });
//           if (fRes.data?.question) {
//             followupRef.current = fRes.data;
//             isFollowupRef.current = true;
//             isProcessingRef.current = false;
//             speak(fRes.data.question, () => startListening());
//             return;
//           }
//         } catch (_) {}
//       }

//       advanceInterview();
//     } catch (err) {
//       console.error(err);
//       isProcessingRef.current = false;
//       // Retry listening on error
//       speak("Sorry, I didn't catch that. Please try again.", () => startListening());
//     }
//   };

//   // ── Advance to next question ──────────────────────────────
//   const advanceInterview = () => {
//     const currentIndex = indexRef.current;
//     const isLast = !isFollowupRef.current && currentIndex >= questions.length - 1;
//     const mainAnswered = resultsRef.current.filter((r) => !r.isFollowup).length;

//     if (isLast || mainAnswered >= questions.length) {
//       setPhase("done");
//       localStorage.setItem("interviewResults", JSON.stringify(resultsRef.current));
//       isProcessingRef.current = false;

//       speak(
//         "Thank you so much for your time. That concludes our interview today. You did a great job! Your evaluation report is being prepared now.",
//         () => setTimeout(() => navigate("/report"), 1500)
//       );
//       return;
//     }

//     if (isFollowupRef.current) {
//       isFollowupRef.current = false;
//       followupRef.current = null;
//     }

//     indexRef.current = currentIndex + 1;
//     isProcessingRef.current = false;

//     const nextQ = questions[indexRef.current]?.question;
//     if (nextQ) {
//       speak(nextQ, () => startListening());
//     }
//   };

//   // ── Greeting on mount ─────────────────────────────────────
//   useEffect(() => {
//     if (questions.length === 0) return;

//     const greeting =
//       "Hello! Welcome to InterviewIQ. I am your AI interviewer today. I will ask you a series of questions based on your resume. Please speak your answer clearly, and I will automatically move to the next question after you finish. Let us begin!";

//     speak(greeting, () => {
//       const firstQ = questions[0]?.question;
//       if (firstQ) speak(firstQ, () => startListening());
//     });

//     return () => {
//       window.speechSynthesis.cancel();
//       SpeechRecognition.stopListening();
//       clearTimeout(silenceTimer.current);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ── Guards ────────────────────────────────────────────────
//   if (!browserSupportsSpeechRecognition) {
//     return (
//       <div style={styles.errorWrap}>
//         Browser does not support Speech Recognition. Please use Chrome.
//       </div>
//     );
//   }

//   if (questions.length === 0) {
//     return (
//       <div style={styles.errorWrap}>
//         No questions found. Please upload your resume first.
//       </div>
//     );
//   }

//   const qNum = indexRef.current + 1;

//   return (
//     <div style={styles.page}>
//       <div style={styles.blob1} />
//       <div style={styles.blob2} />

//       {/* Header */}
//       <div style={styles.header}>
//         <span style={styles.logo}>InterviewIQ</span>
//         <span style={{
//           ...styles.statusBadge,
//           background:
//             phase === "listening" ? "rgba(239,68,68,0.15)" :
//             phase === "processing" ? "rgba(99,102,241,0.15)" :
//             phase === "done" ? "rgba(16,185,129,0.15)" :
//             "rgba(255,255,255,0.07)",
//           color:
//             phase === "listening" ? "#f87171" :
//             phase === "processing" ? "#a5b4fc" :
//             phase === "done" ? "#6ee7b7" : "#94a3b8",
//           borderColor:
//             phase === "listening" ? "rgba(239,68,68,0.3)" :
//             phase === "processing" ? "rgba(99,102,241,0.3)" :
//             phase === "done" ? "rgba(16,185,129,0.3)" :
//             "rgba(255,255,255,0.1)",
//         }}>
//           {phase === "greeting" && "🟡 Greeting"}
//           {phase === "listening" && "🔴 Listening"}
//           {phase === "processing" && "🔵 Analyzing"}
//           {phase === "done" && "✅ Complete"}
//         </span>
//       </div>

//       {/* Progress bar */}
//       <div style={styles.progressWrap}>
//         <div style={{
//           ...styles.progressFill,
//           width: `${Math.min((indexRef.current / questions.length) * 100, 100)}%`
//         }} />
//       </div>

//       {/* Main: full-page avatar */}
//       <div style={styles.avatarSection}>

//         {/* Avatar container */}
//         <div style={styles.avatarWrap}>
//           {/* Pulse ring */}
//           <div style={{
//             ...styles.pulseRing,
//             animation: isSpeaking ? "pulseRing 1.1s ease-in-out infinite" : "none",
//             opacity: isSpeaking ? 1 : 0,
//           }} />
//           <div style={{
//             ...styles.pulseRing2,
//             animation: isSpeaking ? "pulseRing 1.1s ease-in-out infinite 0.35s" : "none",
//             opacity: isSpeaking ? 1 : 0,
//           }} />

//           {/* Avatar image */}
//           <img
//             src={interviewer}
//             alt="AI Interviewer"
//             style={{
//               ...styles.avatar,
//               filter: isSpeaking
//                 ? "drop-shadow(0 0 28px rgba(99,102,241,0.7))"
//                 : phase === "listening"
//                 ? "drop-shadow(0 0 20px rgba(239,68,68,0.5))"
//                 : "drop-shadow(0 0 12px rgba(0,0,0,0.5))",
//             }}
//           />

//           {/* Mouth indicator dot */}
//           <div style={styles.mouthWrap}>
//             <div style={{
//               ...styles.mouthDot,
//               width: isSpeaking && mouthOpen ? "14px" : "8px",
//               height: isSpeaking && mouthOpen ? "8px" : "5px",
//               background: isSpeaking ? "#818cf8" :
//                 phase === "listening" ? "#f87171" : "#475569",
//               boxShadow: isSpeaking ? "0 0 10px #6366f1" :
//                 phase === "listening" ? "0 0 10px #ef4444" : "none",
//             }} />
//           </div>
//         </div>

//         {/* Speech bubble — near mouth */}
//         <div style={{
//           ...styles.speechBubble,
//           borderColor: isSpeaking ? "rgba(99,102,241,0.5)"
//             : phase === "listening" ? "rgba(239,68,68,0.4)"
//             : "rgba(255,255,255,0.1)",
//           boxShadow: isSpeaking ? "0 8px 32px rgba(99,102,241,0.2)"
//             : "0 8px 32px rgba(0,0,0,0.3)",
//         }}>
//           <div style={styles.bubblePointer} />
//           <p style={styles.bubbleText}>{mouthText || "Initializing…"}</p>
//         </div>

//         {/* Question counter */}
//         {phase !== "greeting" && phase !== "done" && (
//           <div style={styles.qCounter}>
//             Question {qNum} of {questions.length}
//           </div>
//         )}

//         {/* Listener wave animation */}
//         {phase === "listening" && (
//           <div style={styles.waveWrap}>
//             {[0,1,2,3,4].map(i => (
//               <div key={i} style={{
//                 ...styles.waveBar,
//                 animationDelay: `${i * 0.12}s`,
//               }} />
//             ))}
//           </div>
//         )}

//         {/* Live transcript (small, below wave) */}
//         {phase === "listening" && transcript && (
//           <div style={styles.transcriptPill}>
//             {transcript.slice(-120)}
//           </div>
//         )}

//         {phase === "done" && (
//           <div style={styles.doneBanner}>
//             🎉 Interview Complete! Redirecting to your report…
//           </div>
//         )}
//       </div>

//       <style>{`
//         @keyframes pulseRing {
//           0%   { transform: translate(-50%,-50%) scale(1);     opacity: 0.6; }
//           50%  { transform: translate(-50%,-50%) scale(1.15);  opacity: 0.2; }
//           100% { transform: translate(-50%,-50%) scale(1);     opacity: 0.6; }
//         }
//         @keyframes wave {
//           0%, 100% { height: 8px;  }
//           50%       { height: 36px; }
//         }
//       `}</style>
//     </div>
//   );
// }

// const styles = {
//   page: {
//     minHeight: "100vh",
//     background: "linear-gradient(160deg, #0a0f1e 0%, #0f172a 40%, #1a1040 100%)",
//     display: "flex", flexDirection: "column",
//     alignItems: "center",
//     fontFamily: "'Inter','Segoe UI',sans-serif",
//     position: "relative", overflow: "hidden",
//   },
//   blob1: {
//     position: "absolute", top: "-160px", left: "-160px",
//     width: "500px", height: "500px",
//     background: "radial-gradient(circle,#6366f130 0%,transparent 70%)",
//     pointerEvents: "none",
//   },
//   blob2: {
//     position: "absolute", bottom: "-120px", right: "-100px",
//     width: "440px", height: "440px",
//     background: "radial-gradient(circle,#8b5cf625 0%,transparent 70%)",
//     pointerEvents: "none",
//   },
//   header: {
//     width: "100%", maxWidth: "900px",
//     display: "flex", alignItems: "center", justifyContent: "space-between",
//     padding: "20px 32px",
//     zIndex: 10,
//   },
//   logo: {
//     fontWeight: 800, fontSize: "22px", letterSpacing: "-0.5px",
//     background: "linear-gradient(90deg,#818cf8,#c084fc)",
//     WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
//   },
//   statusBadge: {
//     fontSize: "13px", fontWeight: 600,
//     padding: "5px 16px", borderRadius: "99px",
//     border: "1px solid",
//     transition: "all 0.4s",
//   },
//   progressWrap: {
//     width: "100%", height: "3px",
//     background: "rgba(255,255,255,0.06)",
//     zIndex: 10,
//   },
//   progressFill: {
//     height: "100%",
//     background: "linear-gradient(90deg,#6366f1,#a855f7)",
//     transition: "width 0.8s ease",
//   },
//   avatarSection: {
//     flex: 1, display: "flex", flexDirection: "column",
//     alignItems: "center", justifyContent: "center",
//     padding: "32px 24px", gap: "24px",
//     width: "100%", zIndex: 1,
//   },
//   avatarWrap: {
//     position: "relative",
//     display: "flex", alignItems: "center", justifyContent: "center",
//   },
//   pulseRing: {
//     position: "absolute", top: "50%", left: "50%",
//     width: "300px", height: "300px",
//     borderRadius: "50%",
//     border: "2px solid rgba(99,102,241,0.5)",
//     pointerEvents: "none",
//   },
//   pulseRing2: {
//     position: "absolute", top: "50%", left: "50%",
//     width: "340px", height: "340px",
//     borderRadius: "50%",
//     border: "2px solid rgba(99,102,241,0.25)",
//     pointerEvents: "none",
//   },
//   avatar: {
//     width: "240px", height: "240px",
//     borderRadius: "50%", objectFit: "cover",
//     border: "3px solid rgba(99,102,241,0.4)",
//     boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
//     transition: "filter 0.4s",
//     position: "relative", zIndex: 1,
//   },
//   mouthWrap: {
//     position: "absolute",
//     bottom: "28px", left: "50%",
//     transform: "translateX(-50%)",
//     zIndex: 2,
//   },
//   mouthDot: {
//     borderRadius: "50%",
//     transition: "all 0.16s ease",
//   },
//   speechBubble: {
//     position: "relative",
//     background: "rgba(15,23,42,0.85)",
//     border: "1.5px solid rgba(255,255,255,0.1)",
//     borderRadius: "20px",
//     padding: "16px 24px",
//     maxWidth: "620px", width: "90%",
//     backdropFilter: "blur(12px)",
//     transition: "border-color 0.3s, box-shadow 0.3s",
//   },
//   bubblePointer: {
//     position: "absolute", top: "-9px", left: "50%",
//     transform: "translateX(-50%)",
//     width: 0, height: 0,
//     borderLeft: "9px solid transparent",
//     borderRight: "9px solid transparent",
//     borderBottom: "9px solid rgba(15,23,42,0.85)",
//   },
//   bubbleText: {
//     margin: 0,
//     fontSize: "16px", lineHeight: "1.65",
//     color: "#e2e8f0", textAlign: "center",
//     fontStyle: "italic",
//   },
//   qCounter: {
//     fontSize: "12px", fontWeight: 700,
//     letterSpacing: "1.2px", textTransform: "uppercase",
//     color: "#6366f1", padding: "5px 16px",
//     background: "rgba(99,102,241,0.1)",
//     borderRadius: "99px",
//     border: "1px solid rgba(99,102,241,0.2)",
//   },
//   waveWrap: {
//     display: "flex", alignItems: "center", gap: "5px",
//     height: "44px",
//   },
//   waveBar: {
//     width: "5px", height: "8px",
//     background: "linear-gradient(180deg,#6366f1,#a855f7)",
//     borderRadius: "99px",
//     animation: "wave 0.7s ease-in-out infinite",
//   },
//   transcriptPill: {
//     maxWidth: "580px", width: "90%",
//     background: "rgba(255,255,255,0.04)",
//     border: "1px solid rgba(255,255,255,0.08)",
//     borderRadius: "12px",
//     padding: "10px 18px",
//     fontSize: "14px", color: "#94a3b8",
//     textAlign: "center", lineHeight: "1.5",
//     fontStyle: "italic",
//   },
//   doneBanner: {
//     background: "linear-gradient(135deg,#059669,#10b981)",
//     color: "#fff", borderRadius: "16px",
//     padding: "16px 32px",
//     fontWeight: 700, fontSize: "16px",
//     boxShadow: "0 8px 28px rgba(16,185,129,0.35)",
//     textAlign: "center",
//   },
//   errorWrap: {
//     minHeight: "100vh", display: "flex",
//     alignItems: "center", justifyContent: "center",
//     color: "#f1f5f9", fontSize: "18px",
//     background: "#0a0f1e", textAlign: "center",
//     padding: "24px",
//   },
// };

// export default Interview;










// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";
// import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
// import interviewer from "../assets/interviewer.png";

// const SILENCE_TIMEOUT = 3000; // 3 seconds of silence = auto submit

// function Interview() {
//   const navigate = useNavigate();
//   const questionsRef = useRef(JSON.parse(localStorage.getItem("questions")) || []);
//   const questions = questionsRef.current;

//   const indexRef = useRef(0);
//   const answerRef = useRef("");
//   const resultsRef = useRef([]);
//   const followupRef = useRef(null);
//   const isFollowupRef = useRef(false);
//   const silenceTimer = useRef(null);
//   const isProcessingRef = useRef(false);

//   const [started, setStarted] = useState(false);
//   const [mouthText, setMouthText] = useState("");
//   const [phase, setPhase] = useState("greeting"); // greeting | listening | processing | done
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [mouthOpen, setMouthOpen] = useState(false);
//   const mouthInterval = useRef(null);

//   const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
//     useSpeechRecognition();

//   // Mouth animation while AI speaks
//   useEffect(() => {
//     if (isSpeaking) {
//       mouthInterval.current = setInterval(() => setMouthOpen((o) => !o), 160);
//     } else {
//       clearInterval(mouthInterval.current);
//       setMouthOpen(false);
//     }
//     return () => clearInterval(mouthInterval.current);
//   }, [isSpeaking]);

//   // Auto-submit after silence
//   useEffect(() => {
//     if (phase !== "listening") return;
//     if (!transcript) return;

//     answerRef.current = transcript;

//     // Reset silence timer on every new word
//     clearTimeout(silenceTimer.current);
//     silenceTimer.current = setTimeout(() => {
//       if (answerRef.current.trim() && !isProcessingRef.current) {
//         autoSubmit();
//       }
//     }, SILENCE_TIMEOUT);

//     return () => clearTimeout(silenceTimer.current);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [transcript]);

//   // ── Speak ─────────────────────────────────────────────────
// // ── Speak ─────────────────────────────────────────────────
// const speak = (text, onDone) => {
//   // ADD THIS LINE: Don't speak if interview is done
//   if (phase === "done" || isProcessingRef.current) return;
  
//   window.speechSynthesis.cancel();
//   setIsSpeaking(true);
//   setMouthText(text);

//   const utterance = new SpeechSynthesisUtterance(text);
//   utterance.rate = 0.92;
//   utterance.pitch = 1.05;

//   utterance.onend = () => {
//     setIsSpeaking(false);
//     if (onDone) onDone();
//   };
//   utterance.onerror = () => {
//     setIsSpeaking(false);
//     if (onDone) onDone();
//   };

//   window.speechSynthesis.speak(utterance);
// };

//   // ── Start listening ───────────────────────────────────────
//   const startListening = () => {
//     resetTranscript();
//     answerRef.current = "";
//     setPhase("listening");
//     setMouthText("🎙 I'm listening…");
//     SpeechRecognition.startListening({ continuous: true, language: "en-US" });
//   };

//   // ── End interview manually ────────────────────────────────
// // ── End interview manually ────────────────────────────────
// const endInterview = () => {
//   // Stop everything immediately
//   window.speechSynthesis.cancel();
//   SpeechRecognition.stopListening();
//   clearTimeout(silenceTimer.current);
  
//   // Set processing flag to prevent any ongoing operations
//   isProcessingRef.current = true;
  
//   // Save whatever results we have so far
//   localStorage.setItem("interviewResults", JSON.stringify(resultsRef.current));
  
//   // Immediately redirect to report
//   navigate("/report");
// };

//   // ── Auto submit after silence ─────────────────────────────
//   const autoSubmit = async () => {
//     if (isProcessingRef.current) return;
//     isProcessingRef.current = true;

//     SpeechRecognition.stopListening();
//     clearTimeout(silenceTimer.current);

//     setPhase("processing");
//     setMouthText("⚙ Analyzing your answer…");

//     const currentAnswer = answerRef.current.trim();
//     const currentQuestion = isFollowupRef.current
//       ? followupRef.current?.question
//       : questions[indexRef.current]?.question;

//     if (!currentAnswer || !currentQuestion) {
//       isProcessingRef.current = false;
//       startListening();
//       return;
//     }

//     try {
//       const res = await API.post("/evaluate", {
//         question: currentQuestion,
//         answer: currentAnswer,
//       });

//       if (!res.data || res.data.technical_score === undefined) {
//         throw new Error("Invalid response");
//       }

//       const newResult = {
//         question: currentQuestion,
//         answer: currentAnswer,
//         evaluation: res.data,
//         isFollowup: isFollowupRef.current,
//       };

//       resultsRef.current = [...resultsRef.current, newResult];

//       // Follow-up for low score
//       if (!isFollowupRef.current && res.data.technical_score <= 4) {
//         try {
//           const fRes = await API.post("/followup-question", {
//             topic: questions[indexRef.current]?.topic || "General",
//             score: res.data.technical_score,
//           });
//           if (fRes.data?.question) {
//             followupRef.current = fRes.data;
//             isFollowupRef.current = true;
//             isProcessingRef.current = false;
//             speak(fRes.data.question, () => startListening());
//             return;
//           }
//         } catch (_) {}
//       }

//       advanceInterview();
//     } catch (err) {
//       console.error(err);
//       isProcessingRef.current = false;
//       // Retry listening on error
//       speak("Sorry, I didn't catch that. Please try again.", () => startListening());
//     }
//   };

//   // ── Advance to next question ──────────────────────────────
//   const advanceInterview = () => {
//     const currentIndex = indexRef.current;
//     const isLast = !isFollowupRef.current && currentIndex >= questions.length - 1;
//     const mainAnswered = resultsRef.current.filter((r) => !r.isFollowup).length;

//     if (isLast || mainAnswered >= questions.length) {
//       setPhase("done");
//       localStorage.setItem("interviewResults", JSON.stringify(resultsRef.current));
//       isProcessingRef.current = false;

//       speak(
//         "Thank you so much for your time. That concludes our interview today. You did a great job! Your evaluation report is being prepared now.",
//         () => setTimeout(() => navigate("/report"), 1500)
//       );
//       return;
//     }

//     if (isFollowupRef.current) {
//       isFollowupRef.current = false;
//       followupRef.current = null;
//     }

//     indexRef.current = currentIndex + 1;
//     isProcessingRef.current = false;

//     const nextQ = questions[indexRef.current]?.question;
//     if (nextQ) {
//       speak(nextQ, () => startListening());
//     }
//   };

//   // ── Start interview after clicking "I'm Ready" ─────────────
//   const startInterview = () => {
//     setStarted(true);
    
//     if (questions.length === 0) return;

//     const greeting =
//       "Hello! Welcome to InterviewIQ. I am your AI interviewer today. I will ask you a series of questions based on your resume. Please speak your answer clearly, and I will automatically move to the next question after you finish. Let us begin!";

//     speak(greeting, () => {
//       const firstQ = questions[0]?.question;
//       if (firstQ) speak(firstQ, () => startListening());
//     });
//   };

//   // ── Guards ────────────────────────────────────────────────
//   if (!browserSupportsSpeechRecognition) {
//     return (
//       <div style={styles.errorWrap}>
//         Browser does not support Speech Recognition. Please use Chrome.
//       </div>
//     );
//   }

//   if (questions.length === 0) {
//     return (
//       <div style={styles.errorWrap}>
//         No questions found. Please upload your resume first.
//       </div>
//     );
//   }

//   // Ready screen before interview starts
//   if (!started) {
//     return (
//       <div style={styles.page}>
//         <div style={styles.blob1} />
//         <div style={styles.blob2} />
        
//         <div style={styles.avatarSection}>
//           <div style={styles.avatarWrap}>
//             <img
//               src={interviewer}
//               alt="AI Interviewer"
//               style={{
//                 ...styles.avatar,
//                 filter: "drop-shadow(0 0 20px rgba(99,102,241,0.5))",
//               }}
//             />
//           </div>
          
//           <h2 style={{ color: "#e2e8f0", fontSize: "24px", fontWeight: 700, margin: 0 }}>
//             Are you ready?
//           </h2>
          
//           <p style={{ color: "#94a3b8", fontSize: "14px", textAlign: "center", maxWidth: "400px", margin: 0 }}>
//             The AI will ask you questions based on your resume. Speak clearly and take your time.
//           </p>
          
//           <button
//             onClick={startInterview}
//             style={{
//               padding: "14px 40px",
//               background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
//               color: "#fff",
//               border: "none",
//               borderRadius: "12px",
//               fontSize: "16px",
//               fontWeight: 700,
//               cursor: "pointer",
//               boxShadow: "0 6px 24px rgba(99,102,241,0.4)",
//               fontFamily: "'Inter','Segoe UI',sans-serif",
//             }}
//           >
//             I'm Ready!
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const qNum = indexRef.current + 1;

//   return (
//     <div style={styles.page}>
//       <div style={styles.blob1} />
//       <div style={styles.blob2} />

//       {/* Header */}
//       <div style={styles.header}>
//         <span style={styles.logo}>InterviewIQ</span>
//         <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//           {/* ADDED: End Interview Button */}
//           {phase !== "done" && (
//             <button
//               onClick={endInterview}
//               style={{
//                 padding: "8px 16px",
//                 background: "rgba(239,68,68,0.15)",
//                 color: "#f87171",
//                 border: "1px solid rgba(239,68,68,0.3)",
//                 borderRadius: "8px",
//                 fontSize: "13px",
//                 fontWeight: 600,
//                 cursor: "pointer",
//                 fontFamily: "'Inter','Segoe UI',sans-serif",
//                 transition: "all 0.2s",
//               }}
//               onMouseEnter={(e) => {
//                 e.target.style.background = "rgba(239,68,68,0.25)";
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.background = "rgba(239,68,68,0.15)";
//               }}
//             >
//               End Interview
//             </button>
//           )}
//           <span style={{
//             ...styles.statusBadge,
//             background:
//               phase === "listening" ? "rgba(239,68,68,0.15)" :
//               phase === "processing" ? "rgba(99,102,241,0.15)" :
//               phase === "done" ? "rgba(16,185,129,0.15)" :
//               "rgba(255,255,255,0.07)",
//             color:
//               phase === "listening" ? "#f87171" :
//               phase === "processing" ? "#a5b4fc" :
//               phase === "done" ? "#6ee7b7" : "#94a3b8",
//             borderColor:
//               phase === "listening" ? "rgba(239,68,68,0.3)" :
//               phase === "processing" ? "rgba(99,102,241,0.3)" :
//               phase === "done" ? "rgba(16,185,129,0.3)" :
//               "rgba(255,255,255,0.1)",
//           }}>
//             {phase === "greeting" && "🟡 Greeting"}
//             {phase === "listening" && "🔴 Listening"}
//             {phase === "processing" && "🔵 Analyzing"}
//             {phase === "done" && "✅ Complete"}
//           </span>
//         </div>
//       </div>

//       {/* Progress bar */}
//       <div style={styles.progressWrap}>
//         <div style={{
//           ...styles.progressFill,
//           width: `${Math.min((indexRef.current / questions.length) * 100, 100)}%`
//         }} />
//       </div>

//       {/* Main: full-page avatar */}
//       <div style={styles.avatarSection}>

//         {/* Avatar container */}
//         <div style={styles.avatarWrap}>
//           {/* Pulse ring */}
//           <div style={{
//             ...styles.pulseRing,
//             animation: isSpeaking ? "pulseRing 1.1s ease-in-out infinite" : "none",
//             opacity: isSpeaking ? 1 : 0,
//           }} />
//           <div style={{
//             ...styles.pulseRing2,
//             animation: isSpeaking ? "pulseRing 1.1s ease-in-out infinite 0.35s" : "none",
//             opacity: isSpeaking ? 1 : 0,
//           }} />

//           {/* Avatar image */}
//           <img
//             src={interviewer}
//             alt="AI Interviewer"
//             style={{
//               ...styles.avatar,
//               filter: isSpeaking
//                 ? "drop-shadow(0 0 28px rgba(99,102,241,0.7))"
//                 : phase === "listening"
//                 ? "drop-shadow(0 0 20px rgba(239,68,68,0.5))"
//                 : "drop-shadow(0 0 12px rgba(0,0,0,0.5))",
//             }}
//           />

//           {/* Mouth indicator dot */}
//           <div style={styles.mouthWrap}>
//             <div style={{
//               ...styles.mouthDot,
//               width: isSpeaking && mouthOpen ? "14px" : "8px",
//               height: isSpeaking && mouthOpen ? "8px" : "5px",
//               background: isSpeaking ? "#818cf8" :
//                 phase === "listening" ? "#f87171" : "#475569",
//               boxShadow: isSpeaking ? "0 0 10px #6366f1" :
//                 phase === "listening" ? "0 0 10px #ef4444" : "none",
//             }} />
//           </div>
//         </div>

//         {/* Speech bubble — near mouth */}
//         <div style={{
//           ...styles.speechBubble,
//           borderColor: isSpeaking ? "rgba(99,102,241,0.5)"
//             : phase === "listening" ? "rgba(239,68,68,0.4)"
//             : "rgba(255,255,255,0.1)",
//           boxShadow: isSpeaking ? "0 8px 32px rgba(99,102,241,0.2)"
//             : "0 8px 32px rgba(0,0,0,0.3)",
//         }}>
//           <div style={styles.bubblePointer} />
//           <p style={styles.bubbleText}>{mouthText || "Initializing…"}</p>
//         </div>

//         {/* Question counter */}
//         {phase !== "greeting" && phase !== "done" && (
//           <div style={styles.qCounter}>
//             Question {qNum} of {questions.length}
//           </div>
//         )}

//         {/* Listener wave animation */}
//         {phase === "listening" && (
//           <div style={styles.waveWrap}>
//             {[0,1,2,3,4].map(i => (
//               <div key={i} style={{
//                 ...styles.waveBar,
//                 animationDelay: `${i * 0.12}s`,
//               }} />
//             ))}
//           </div>
//         )}

//         {/* Live transcript (small, below wave) */}
//         {phase === "listening" && transcript && (
//           <div style={styles.transcriptPill}>
//             {transcript.slice(-120)}
//           </div>
//         )}

//         {phase === "done" && (
//           <div style={styles.doneBanner}>
//             🎉 Interview Complete! Redirecting to your report…
//           </div>
//         )}
//       </div>

//       <style>{`
//         @keyframes pulseRing {
//           0%   { transform: translate(-50%,-50%) scale(1);     opacity: 0.6; }
//           50%  { transform: translate(-50%,-50%) scale(1.15);  opacity: 0.2; }
//           100% { transform: translate(-50%,-50%) scale(1);     opacity: 0.6; }
//         }
//         @keyframes wave {
//           0%, 100% { height: 8px;  }
//           50%       { height: 36px; }
//         }
//       `}</style>
//     </div>
//   );
// }

// const styles = {
//   page: {
//     minHeight: "100vh",
//     background: "linear-gradient(160deg, #0a0f1e 0%, #0f172a 40%, #1a1040 100%)",
//     display: "flex", flexDirection: "column",
//     alignItems: "center",
//     fontFamily: "'Inter','Segoe UI',sans-serif",
//     position: "relative", overflow: "hidden",
//   },
//   blob1: {
//     position: "absolute", top: "-160px", left: "-160px",
//     width: "500px", height: "500px",
//     background: "radial-gradient(circle,#6366f130 0%,transparent 70%)",
//     pointerEvents: "none",
//   },
//   blob2: {
//     position: "absolute", bottom: "-120px", right: "-100px",
//     width: "440px", height: "440px",
//     background: "radial-gradient(circle,#8b5cf625 0%,transparent 70%)",
//     pointerEvents: "none",
//   },
//   header: {
//     width: "100%", maxWidth: "900px",
//     display: "flex", alignItems: "center", justifyContent: "space-between",
//     padding: "20px 32px",
//     zIndex: 10,
//   },
//   logo: {
//     fontWeight: 800, fontSize: "22px", letterSpacing: "-0.5px",
//     background: "linear-gradient(90deg,#818cf8,#c084fc)",
//     WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
//   },
//   statusBadge: {
//     fontSize: "13px", fontWeight: 600,
//     padding: "5px 16px", borderRadius: "99px",
//     border: "1px solid",
//     transition: "all 0.4s",
//   },
//   progressWrap: {
//     width: "100%", height: "3px",
//     background: "rgba(255,255,255,0.06)",
//     zIndex: 10,
//   },
//   progressFill: {
//     height: "100%",
//     background: "linear-gradient(90deg,#6366f1,#a855f7)",
//     transition: "width 0.8s ease",
//   },
//   avatarSection: {
//     flex: 1, display: "flex", flexDirection: "column",
//     alignItems: "center", justifyContent: "center",
//     padding: "32px 24px", gap: "24px",
//     width: "100%", zIndex: 1,
//   },
//   avatarWrap: {
//     position: "relative",
//     display: "flex", alignItems: "center", justifyContent: "center",
//   },
//   pulseRing: {
//     position: "absolute", top: "50%", left: "50%",
//     width: "300px", height: "300px",
//     borderRadius: "50%",
//     border: "2px solid rgba(99,102,241,0.5)",
//     pointerEvents: "none",
//   },
//   pulseRing2: {
//     position: "absolute", top: "50%", left: "50%",
//     width: "340px", height: "340px",
//     borderRadius: "50%",
//     border: "2px solid rgba(99,102,241,0.25)",
//     pointerEvents: "none",
//   },
//   avatar: {
//     width: "240px", height: "240px",
//     borderRadius: "50%", objectFit: "cover",
//     border: "3px solid rgba(99,102,241,0.4)",
//     boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
//     transition: "filter 0.4s",
//     position: "relative", zIndex: 1,
//   },
//   mouthWrap: {
//     position: "absolute",
//     bottom: "28px", left: "50%",
//     transform: "translateX(-50%)",
//     zIndex: 2,
//   },
//   mouthDot: {
//     borderRadius: "50%",
//     transition: "all 0.16s ease",
//   },
//   speechBubble: {
//     position: "relative",
//     background: "rgba(15,23,42,0.85)",
//     border: "1.5px solid rgba(255,255,255,0.1)",
//     borderRadius: "20px",
//     padding: "16px 24px",
//     maxWidth: "620px", width: "90%",
//     backdropFilter: "blur(12px)",
//     transition: "border-color 0.3s, box-shadow 0.3s",
//   },
//   bubblePointer: {
//     position: "absolute", top: "-9px", left: "50%",
//     transform: "translateX(-50%)",
//     width: 0, height: 0,
//     borderLeft: "9px solid transparent",
//     borderRight: "9px solid transparent",
//     borderBottom: "9px solid rgba(15,23,42,0.85)",
//   },
//   bubbleText: {
//     margin: 0,
//     fontSize: "16px", lineHeight: "1.65",
//     color: "#e2e8f0", textAlign: "center",
//     fontStyle: "italic",
//   },
//   qCounter: {
//     fontSize: "12px", fontWeight: 700,
//     letterSpacing: "1.2px", textTransform: "uppercase",
//     color: "#6366f1", padding: "5px 16px",
//     background: "rgba(99,102,241,0.1)",
//     borderRadius: "99px",
//     border: "1px solid rgba(99,102,241,0.2)",
//   },
//   waveWrap: {
//     display: "flex", alignItems: "center", gap: "5px",
//     height: "44px",
//   },
//   waveBar: {
//     width: "5px", height: "8px",
//     background: "linear-gradient(180deg,#6366f1,#a855f7)",
//     borderRadius: "99px",
//     animation: "wave 0.7s ease-in-out infinite",
//   },
//   transcriptPill: {
//     maxWidth: "580px", width: "90%",
//     background: "rgba(255,255,255,0.04)",
//     border: "1px solid rgba(255,255,255,0.08)",
//     borderRadius: "12px",
//     padding: "10px 18px",
//     fontSize: "14px", color: "#94a3b8",
//     textAlign: "center", lineHeight: "1.5",
//     fontStyle: "italic",
//   },
//   doneBanner: {
//     background: "linear-gradient(135deg,#059669,#10b981)",
//     color: "#fff", borderRadius: "16px",
//     padding: "16px 32px",
//     fontWeight: 700, fontSize: "16px",
//     boxShadow: "0 8px 28px rgba(16,185,129,0.35)",
//     textAlign: "center",
//   },
//   errorWrap: {
//     minHeight: "100vh", display: "flex",
//     alignItems: "center", justifyContent: "center",
//     color: "#f1f5f9", fontSize: "18px",
//     background: "#0a0f1e", textAlign: "center",
//     padding: "24px",
//   },
// };

// export default Interview;

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import interviewer from "../assets/interviewer.png";

const SILENCE_TIMEOUT = 3000;

function Interview() {
  const navigate = useNavigate();
  const questionsRef = useRef(JSON.parse(localStorage.getItem("questions")) || []);
  const questions = questionsRef.current;

  const indexRef = useRef(0);
  const answerRef = useRef("");
  const resultsRef = useRef([]);
  const silenceTimer = useRef(null);
  const isProcessingRef = useRef(false);

  const mediaRecorderRef = useRef(null);
  const videoChunksRef = useRef([]);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [started, setStarted] = useState(false);
  const [mouthText, setMouthText] = useState("");
  const [phase, setPhase] = useState("greeting");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mouthInterval = useRef(null);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (isSpeaking) {
      mouthInterval.current = setInterval(() => setMouthOpen((o) => !o), 160);
    } else {
      clearInterval(mouthInterval.current);
      setMouthOpen(false);
    }
    return () => clearInterval(mouthInterval.current);
  }, [isSpeaking]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      SpeechRecognition.stopListening();
      clearTimeout(silenceTimer.current);
      if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  useEffect(() => {
    if (phase !== "listening" || !transcript) return;
    answerRef.current = transcript;
    clearTimeout(silenceTimer.current);
    silenceTimer.current = setTimeout(() => {
      if (answerRef.current.trim() && !isProcessingRef.current) autoSubmit();
    }, SILENCE_TIMEOUT);
    return () => clearTimeout(silenceTimer.current);
  }, [transcript]);

  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: true
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8,opus',
        videoBitsPerSecond: 500000
      });
      mediaRecorderRef.current = mediaRecorder;
      videoChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) videoChunksRef.current.push(e.data);
      };
      
      mediaRecorder.start(1000);
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      alert("Please allow camera and microphone access.");
    }
  };

  const stopVideoRecording = () => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.onstop = () => resolve();
        mediaRecorderRef.current.stop();
      } else resolve();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      setIsRecording(false);
    });
  };

  const saveVideoLocally = () => {
    if (videoChunksRef.current.length === 0) return null;
    const blob = new Blob(videoChunksRef.current, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    return { url, blob };
  };

  const uploadVideo = async (blob) => {
    const formData = new FormData();
    const user = JSON.parse(localStorage.getItem('user')) || {};
    formData.append('video', blob, `interview-${Date.now()}.webm`);
    formData.append('userId', user.id || 'anonymous');
    try {
      const res = await API.post('/upload-interview-video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    } catch (err) { return null; }
  };

  const speak = (text, onDone) => {
    if (phase === "done" || isProcessingRef.current) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    setMouthText(text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.onend = () => { setIsSpeaking(false); if (onDone) onDone(); };
    utterance.onerror = () => { setIsSpeaking(false); if (onDone) onDone(); };
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    resetTranscript();
    answerRef.current = "";
    setPhase("listening");
    setMouthText("Listening...");
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });
  };

  const endInterview = async () => {
    window.speechSynthesis.cancel();
    SpeechRecognition.stopListening();
    clearTimeout(silenceTimer.current);
    isProcessingRef.current = true;
    await stopVideoRecording();
    await new Promise(r => setTimeout(r, 500));
    const videoData = saveVideoLocally();
    
    const finalResults = {
      answers: resultsRef.current,
      videoUrl: videoData?.url || null,
      recordedAt: new Date().toISOString()
    };
    localStorage.setItem("interviewResults", JSON.stringify(finalResults));
    if (videoData?.blob) uploadVideo(videoData.blob);
    navigate("/report");
  };

  const autoSubmit = async () => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    SpeechRecognition.stopListening();
    clearTimeout(silenceTimer.current);
    setPhase("processing");
    setMouthText("Analyzing...");

    const answer = answerRef.current.trim();
    const question = questions[indexRef.current]?.question;
    if (!answer || !question) { isProcessingRef.current = false; startListening(); return; }

    try {
      const res = await API.post("/evaluate", { question, answer });
      resultsRef.current = [...resultsRef.current, { question, answer, evaluation: res.data }];

      const score = res.data.technical_score;
      
      let nextDifficulty;
      if (score <= 4) nextDifficulty = "easy";
      else if (score <= 7) nextDifficulty = "medium";
      else nextDifficulty = "hard";

      try {
        const fRes = await API.post("/followup-question", {
          topic: questions[indexRef.current]?.topic || "General",
          score: score,
          difficulty: nextDifficulty
        });
        
        if (fRes.data?.question) {
          indexRef.current = indexRef.current + 1;
          
          questions.splice(indexRef.current, 0, {
            question: fRes.data.question,
            topic: questions[indexRef.current - 1]?.topic || "General",
            difficulty: nextDifficulty
          });
          
          isProcessingRef.current = false;
          
          const difficultyMessage = nextDifficulty === "easy" ? 
            "Let me ask an easier question." :
            nextDifficulty === "hard" ? 
            "Great! Let's try a harder question." :
            "Let's continue with another question.";
            
          speak(difficultyMessage, () => {
            speak(fRes.data.question, () => startListening());
          });
          return;
        }
      } catch (_) {}

      advanceInterview();
    } catch (err) {
      isProcessingRef.current = false;
      speak("Sorry, please try again.", () => startListening());
    }
  };

  const advanceInterview = async () => {
    const idx = indexRef.current;
    const isLast = idx >= questions.length - 1;
    const answered = resultsRef.current.length;

    if (isLast || answered >= 10) {
      setPhase("done");
      await stopVideoRecording();
      await new Promise(r => setTimeout(r, 500));
      const videoData = saveVideoLocally();
      localStorage.setItem("interviewResults", JSON.stringify({
        answers: resultsRef.current,
        videoUrl: videoData?.url || null,
        recordedAt: new Date().toISOString()
      }));
      isProcessingRef.current = false;
      if (videoData?.blob) uploadVideo(videoData.blob);
      speak("Thank you! Your interview is complete.", () => setTimeout(() => navigate("/report"), 1500));
      return;
    }

    indexRef.current = idx + 1;
    isProcessingRef.current = false;
    const nextQ = questions[indexRef.current]?.question;
    if (nextQ) speak(nextQ, () => startListening());
  };

  const startInterview = () => {
    setStarted(true);
    startVideoRecording();
    
    if (questions.length === 0) return;

    const interviewType = localStorage.getItem("interviewType");
    let greeting;
    
    if (interviewType === "resume") {
      greeting = "Hello! Welcome to InterviewIQ. I have analyzed your resume and will ask you personalized questions. Speak clearly and I'll move to the next question automatically. Let's begin!";
    } else {
      const topic = localStorage.getItem("selectedTopic") || questions[0]?.topic || "this technology";
      greeting = `Hello! Welcome to InterviewIQ. I will test your knowledge on ${topic}. Speak clearly and I'll move to the next question automatically. Let's begin!`;
    }

    speak(greeting, () => {
      const firstQ = questions[0]?.question;
      if (firstQ) speak(firstQ, () => startListening());
    });
  };

  if (!browserSupportsSpeechRecognition) return <div style={styles.errorWrap}>Please use Chrome for speech recognition.</div>;
  if (!questions.length) return <div style={styles.errorWrap}>No questions found.</div>;

  if (!started) {
    return (
      <div style={styles.page}>
        <div style={styles.avatarSection}>
          <img src={interviewer} alt="AI" style={styles.avatar} />
          <h2 style={{ color: "#000", fontSize: "22px", margin: 0 }}>Are you ready?</h2>
          <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>Speak clearly and take your time.</p>
          <button onClick={startInterview} style={styles.readyBtn}>I'm Ready!</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <span style={styles.logo}>InterviewIQ</span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {isRecording && <span style={{ color: "#ff0000", fontSize: "12px", fontWeight: 600 }}>● REC</span>}
          {phase !== "done" && <button onClick={endInterview} style={styles.endBtn}>End</button>}
          <span style={styles.badge}>
            {phase === "greeting" ? "Greeting" : phase === "listening" ? "Listening" : phase === "processing" ? "Analyzing" : "Done"}
          </span>
        </div>
      </div>

      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${Math.min((indexRef.current / questions.length) * 100, 100)}%` }} />
      </div>

      <div style={styles.avatarSection}>
        <img src={interviewer} alt="AI" style={styles.avatar} />
        
        <div style={styles.speechBubble}>
          <p style={styles.bubbleText}>{mouthText || "Initializing..."}</p>
        </div>

        {phase !== "greeting" && phase !== "done" && (
          <div style={styles.qCounter}>Q{indexRef.current + 1}</div>
        )}

        {phase === "listening" && transcript && (
          <div style={styles.transcript}>{transcript.slice(-100)}</div>
        )}

        {phase === "done" && (
          <div style={styles.doneMsg}>Interview Complete!</div>
        )}
      </div>

      {isRecording && (
        <div style={styles.videoPreview}>
          <video ref={videoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
          <span style={{ position: "absolute", top: 4, left: 4, background: "rgba(0,0,0,0.6)", color: "#ff0000", fontSize: 10, padding: "2px 6px", borderRadius: 4 }}>LIVE</span>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "'Segoe UI', sans-serif" },
  header: { width: "100%", maxWidth: "800px", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #e0e0e0" },
  logo: { fontSize: "20px", fontWeight: 800, color: "#000" },
  endBtn: { padding: "6px 14px", background: "#fff", color: "#ff0000", border: "1px solid #ff0000", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" },
  badge: { fontSize: "11px", fontWeight: 600, padding: "4px 12px", borderRadius: "99px", border: "1px solid #ccc", color: "#666" },
  progressBar: { width: "100%", height: "3px", background: "#f0f0f0" },
  progressFill: { height: "100%", background: "#000", transition: "width 0.5s" },
  avatarSection: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", padding: "24px" },
  avatar: { width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover", border: "2px solid #e0e0e0" },
  speechBubble: { background: "#f5f5f5", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "16px 20px", maxWidth: "500px", width: "90%", textAlign: "center" },
  bubbleText: { margin: 0, fontSize: "15px", color: "#000", lineHeight: 1.5 },
  qCounter: { fontSize: "12px", fontWeight: 700, color: "#000", background: "#f0f0f0", padding: "4px 14px", borderRadius: "99px", border: "1px solid #ccc" },
  transcript: { maxWidth: "500px", width: "90%", background: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: "8px", padding: "10px 16px", fontSize: "13px", color: "#666", textAlign: "center" },
  doneMsg: { background: "#000", color: "#fff", borderRadius: "8px", padding: "12px 24px", fontWeight: 700, fontSize: "15px" },
  readyBtn: { padding: "12px 32px", background: "#000", color: "#fff", border: "none", borderRadius: "6px", fontSize: "15px", fontWeight: 700, cursor: "pointer", marginTop: "8px" },
  videoPreview: { position: "fixed", bottom: "16px", right: "16px", width: "140px", height: "100px", borderRadius: "8px", overflow: "hidden", border: "2px solid #ccc", background: "#000", zIndex: 100 },
  errorWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontSize: "16px", background: "#fff", textAlign: "center", padding: "24px" },
};

export default Interview;