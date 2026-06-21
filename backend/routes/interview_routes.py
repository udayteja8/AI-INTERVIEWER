from flask import Blueprint, request, jsonify
from services.resume_parser import extract_text
import os
from services.skill_extractor import extract_skills

from models.interview_model import interviews_collection


from services.llm_service import (
    analyze_resume,
    generate_resume_questions,
    evaluate_answer,
    generate_final_report,
    generate_followup_question
)


interview_bp = Blueprint(
    "interview",
    __name__
)

UPLOAD_FOLDER = "uploads"

@interview_bp.route(
    "/upload-resume",
    methods=["POST"]
)
def upload_resume():

    pdf = request.files["resume"]

    filepath = os.path.join(
        UPLOAD_FOLDER,
        pdf.filename
    )

    pdf.save(filepath)

    resume_text = extract_text(filepath)

    analysis = analyze_resume(resume_text)

    questions = generate_resume_questions(
        analysis
    )

    return jsonify({
        "analysis": analysis,
        "questions": questions
    })


@interview_bp.route(
    "/generate-questions",
    methods=["POST"]
)
def generate_questions_route():

    file = request.files["resume"]

    filepath = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    file.save(filepath)

    resume_text = extract_text(filepath)

    analysis = analyze_resume(resume_text)

    questions = generate_resume_questions(
        analysis
    )

    return jsonify(questions)

@interview_bp.route(
    "/evaluate",
    methods=["POST"]
)
def evaluate():

    data = request.json

    result = evaluate_answer(
        data["question"],
        data["answer"]
    )

    return jsonify(result)

@interview_bp.route(
    "/final-report",
    methods=["POST"]
)
def final_report():

    data = request.json

    report = generate_final_report(
        data["results"]
    )

    return jsonify(report)

@interview_bp.route(
    "/save-interview",
    methods=["POST"]
)
def save_interview():

    data = request.json

    interview = {
        "user_email": data["user_email"],
        "analysis": data["analysis"],
        "questions": data["questions"],
        "answers": data["answers"],
        "report": data["report"]
    }

    result = interviews_collection.insert_one(
        interview
    )

    return jsonify({
        "message": "Interview saved",
        "id": str(result.inserted_id)
    })

@interview_bp.route(
    "/history/<email>",
    methods=["GET"]
)
def interview_history(email):

    interviews = list(
        interviews_collection.find(
            {"user_email": email},
            {"_id": 0}
        )
    )

    return jsonify(interviews)

@interview_bp.route(
    "/next-question/<session_id>",
    methods=["GET"]
)
def next_question(session_id):

    interview = interviews_collection.find_one(
    {"session_id": session_id}
)

    if not interview:
        return jsonify({
            "error": "Session not found"
        }), 404

    index = interview["current_question"]

    if index >= len(interview["questions"]):
        return jsonify({
            "message": "Interview Completed"
        })

    return jsonify({
        "question": interview["questions"][index]
    })

@interview_bp.route(
    "/submit-answer",
    methods=["POST"]
)
def submit_answer():

    data = request.json

    evaluation = evaluate_answer(
        data["question"],
        data["answer"]
    )

    interviews_collection.update_one(
    {"session_id": data["session_id"]},
    {
        "$push": {
            "answers": {
                "question": data["question"],
                "answer": data["answer"],
                "evaluation": evaluation
            },
            "scores": {
                "technical_score": evaluation["technical_score"],
                "communication_score": evaluation["communication_score"]
            }
        },
        "$inc": {
            "current_question": 1
        }
    }
)

    return jsonify(evaluation)

@interview_bp.route(
    "/start-interview",
    methods=["POST"]
)
def start_interview():

    data = request.json

    session = {
        "session_id": data["session_id"],
        "user_email": data["user_email"],
        "questions": data["questions"],
        "current_question": 0,
        "answers": [],
        "scores": []
    }

    interviews_collection.insert_one(session)

    return jsonify({
        "message": "Interview Started"
    })
@interview_bp.route("/followup-question", methods=["POST"])
def followup_question():
    data = request.json
    result = generate_followup_question(
        data["topic"],
        data["score"],
        data.get("difficulty", None)
    )
    return jsonify(result)

@interview_bp.route(
    "/generate-topic-questions",
    methods=["POST"]
)
def generate_topic_questions():
    try:
        data = request.json
        topic = data.get("topic")
        
        if not topic:
            return jsonify({"error": "Topic is required"}), 400
        
        # Create a minimal analysis object for the topic
        # This matches what generate_resume_questions expects
        topic_analysis = {
            "summary": f"Candidate interested in {topic}",
            "skills": [topic],
            "projects": [f"{topic} related projects"],
            "strengths": [f"{topic} knowledge"],
            "interview_areas": [topic]
        }
        
        # Use the existing function with proper format
        questions = generate_resume_questions(topic_analysis)
        
        return jsonify(questions)
        
    except Exception as e:
        print(f"Error generating topic questions: {e}")
        # Fallback questions if AI fails
        return jsonify({
            "questions": [
                {
                    "question": f"Explain the fundamentals of {topic}",
                    "topic": topic,
                    "difficulty": "Medium",
                    "expected_answer_points": ["Basic understanding", "Key concepts"]
                },
                {
                    "question": f"What are the key features of {topic}?",
                    "topic": topic,
                    "difficulty": "Easy",
                    "expected_answer_points": ["Feature listing", "Use cases"]
                },
                {
                    "question": f"Describe a challenging {topic} project you've worked on",
                    "topic": topic,
                    "difficulty": "Hard",
                    "expected_answer_points": ["Project details", "Challenges", "Solutions"]
                },
                {
                    "question": f"How do you handle errors in {topic}?",
                    "topic": topic,
                    "difficulty": "Medium",
                    "expected_answer_points": ["Error handling", "Debugging approach"]
                },
                {
                    "question": f"Explain best practices in {topic}",
                    "topic": topic,
                    "difficulty": "Medium",
                    "expected_answer_points": ["Best practices", "Industry standards"]
                },
                {
                    "question": f"What are common pitfalls in {topic}?",
                    "topic": topic,
                    "difficulty": "Easy",
                    "expected_answer_points": ["Common mistakes", "Solutions"]
                },
                {
                    "question": f"How do you optimize performance in {topic}?",
                    "topic": topic,
                    "difficulty": "Hard",
                    "expected_answer_points": ["Optimization techniques", "Performance metrics"]
                },
                {
                    "question": f"Compare {topic} with similar technologies",
                    "topic": topic,
                    "difficulty": "Medium",
                    "expected_answer_points": ["Comparison points", "Use cases"]
                },
                {
                    "question": f"What's new in the latest version of {topic}?",
                    "topic": topic,
                    "difficulty": "Easy",
                    "expected_answer_points": ["Latest features", "Updates"]
                },
                {
                    "question": f"How would you explain {topic} to a beginner?",
                    "topic": topic,
                    "difficulty": "Easy",
                    "expected_answer_points": ["Simple explanation", "Teaching ability"]
                }
            ]
        }), 500