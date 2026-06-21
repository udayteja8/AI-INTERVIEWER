import React, { useState, useEffect } from "react";
import interviewer from "../assets/interviewer.png";

function AIInterview() {
  const [message, setMessage] = useState(
    "Hello! Welcome to InterviewIQ. I will be conducting your interview today."
  );

  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  return (
    <div className="container py-5">
      <div className="card shadow-lg p-4">

        <div className="text-center">
          <img
            src={interviewer}
            alt="AI Interviewer"
            style={{
              width: "250px",
              height: "250px",
              objectFit: "cover",
              borderRadius: "50%"
            }}
          />

          <div
            className="mt-3 p-3 bg-light border rounded"
            style={{
              maxWidth: "600px",
              margin: "auto"
            }}
          >
            {message}
          </div>
        </div>

        <div className="mt-5">
          <h4>Question</h4>

          <div className="alert alert-primary">
            {currentQuestion}
          </div>

          <textarea
            className="form-control"
            rows="5"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
          />

          <button
            className="btn btn-success mt-3"
          >
            Submit Answer
          </button>
        </div>

      </div>
    </div>
  );
}

export default AIInterview;