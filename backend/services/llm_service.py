import os
import json
import re
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODELS = [
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768",
    "gemma2-9b-it",
]

def _call(prompt):
    for model in MODELS:
        try:
            print(f"Trying model: {model}")
            response = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=1000,
                timeout=45,
                response_format={"type": "json_object"}
            )
            content = response.choices[0].message.content
            content = content.replace("```json", "").replace("```", "").strip()
            match = re.search(r'\{.*\}', content, re.DOTALL)
            if match:
                content = match.group()
            try:
                json.loads(content)
                print(f"Success with model: {model}")
                return content
            except:
                continue
        except Exception as e:
            print(f"Model {model} failed: {e}")
            continue
    print("All models failed!")
    return "{}"


def analyze_resume(resume_text):
    prompt = f"""
Analyze the following resume carefully.

Resume:
{resume_text}

Extract ONLY what is explicitly mentioned. Do NOT add anything not present.

Return ONLY valid JSON:
{{
    "summary": "Brief professional summary from resume",
    "skills": ["Only skills listed in resume"],
    "projects": ["Only projects mentioned in resume"],
    "strengths": ["Strengths based on resume content"],
    "interview_areas": ["Topics to ask about based on resume"]
}}

STRICT RULES:
- Do NOT add any skill not present in the resume
- Do NOT add any project not mentioned
- Do NOT assume technologies
- If something is not clear, skip it
"""
    content = _call(prompt)
    try:
        return json.loads(content)
    except:
        return {"summary": "", "skills": [], "projects": [], "strengths": [], "interview_areas": []}


def generate_resume_questions(analysis):
    is_topic = isinstance(analysis, dict) and len(analysis.get("skills", [])) == 1 and len(analysis.get("projects", [])) <= 1

    BAD_KEYWORDS = [
        "__future__", "metaclass", "cyclic reference", "memory allocator",
        "descriptor", "ast", "bytecode", "frame object", "traceback internals",
        "python c api", "coroutine internals", "generator internals",
        "context parameter", "abstract syntax tree", "code objects"
    ]

    if is_topic:
        topic = analysis["skills"][0]
        prompt = f"""
You are a technical interviewer for FRESHER/STUDENT candidates.

Topic: {topic}

Generate exactly 10 UNIQUE interview questions covering DIFFERENT subtopics.

COVERAGE RULES - Each subtopic max 1-2 questions:
- Basic definition and purpose of {topic}
- Core syntax and structure
- Variables and data types
- Control flow (loops, conditions)
- Functions/methods
- Object-oriented concepts (if applicable)
- Error handling
- Common libraries/frameworks (if applicable)
- Best practices
- ONE advanced concept only (question 10)

CRITICAL:
- NEVER repeat the same concept
- 6 Easy, 3 Medium, 1 Hard (Hard = question 10 only)
- Easy = absolute fundamentals a fresher should know
- Medium = practical application
- Hard = ONE advanced question at the end
- Theory only - NO coding
- Fresher campus placement interview style

Return ONLY valid JSON:
{{
    "questions":[
        {{"question":"", "topic":"{topic}", "difficulty":"Easy", "subtopic":""}}
    ]
}}
"""
    else:
        skills = analysis.get("skills", [])
        projects = analysis.get("projects", [])
        
        prompt = f"""
You are a technical interviewer for FRESHER candidates.

Skills: {json.dumps(skills)}
Projects: {json.dumps(projects)}

Generate exactly 10 UNIQUE interview questions.

RULES:
1. 6 Easy: Basic concepts from listed skills, simple project questions
2. 3 Medium: Practical understanding, project implementation
3. 1 Hard: ONE advanced question only
4. Ask about DIFFERENT skills/projects - don't repeat same topic
5. Mention project names in questions
6. Theory only - NO coding
7. Fresher-friendly - campus placement style
8. Each skill/project covered max 2 times

Return ONLY valid JSON:
{{
    "questions":[
        {{"question":"", "topic":"", "difficulty":"Easy", "subtopic":""}}
    ]
}}
"""

    content = _call(prompt)

    try:
        result = json.loads(content)
        questions = result.get("questions", [])

        final_questions = []
        seen_texts = set()
        topic_count = {}

        for q in questions:
            question_text = q.get("question", "").strip()
            if not question_text:
                continue

            lower_q = question_text.lower()

            # Filter bad keywords
            if any(keyword.lower() in lower_q for keyword in BAD_KEYWORDS):
                print(f"Filtered bad keyword: {question_text}")
                continue

            # Check duplicates
            normalized = re.sub(r"[^a-z0-9 ]", "", lower_q)
            words = normalized.split()
            start3 = " ".join(words[:3])
            start5 = " ".join(words[:5])

            if normalized in seen_texts or start3 in seen_texts or start5 in seen_texts:
                print(f"Filtered duplicate: {question_text}")
                continue

            # Check topic frequency - max 2 per subtopic
            subtopic = q.get("subtopic", q.get("topic", "general")).lower()
            current_count = topic_count.get(subtopic, 0)
            if current_count >= 2:
                print(f"Filtered - too many from '{subtopic}': {question_text}")
                continue

            seen_texts.add(normalized)
            seen_texts.add(start3)
            seen_texts.add(start5)
            topic_count[subtopic] = current_count + 1
            final_questions.append(q)

        print(f"Topic distribution: {topic_count}")

        # If not enough, add fallbacks
        if len(final_questions) < 10 and is_topic:
            topic = analysis["skills"][0]
            fallbacks = [
                f"What is {topic} and what is it used for?",
                f"What are the key features of {topic}?",
                f"Explain basic syntax of {topic}",
                f"What are variables in {topic}?",
                f"Explain data types in {topic}",
                f"What are functions in {topic}?",
                f"How do loops work in {topic}?",
                f"Explain error handling in {topic}",
                f"What are best practices in {topic}?",
                f"What are common use cases of {topic}?"
            ]
            for fb in fallbacks:
                if len(final_questions) >= 10:
                    break
                normalized = re.sub(r"[^a-z0-9 ]", "", fb.lower())
                if normalized not in seen_texts:
                    final_questions.append({"question": fb, "topic": topic, "difficulty": "Easy", "subtopic": "basics"})
                    seen_texts.add(normalized)

        return {"questions": final_questions[:10]}
    except:
        return {"questions": [], "error": "Failed to parse AI response"}


def evaluate_answer(question, answer, topic=""):
    normalized = answer.strip().lower()

    no_attempt_answers = ["", "i don't know", "i dont know", "dont know", "don't know", "no idea", "skip", "pass", "not sure", "idk"]

    if normalized in no_attempt_answers:
        return {
            "technical_score": 0, "communication_score": 0,
            "strengths": [], "weaknesses": ["Did not attempt the question"],
            "correct_answer": "", "improvement_tips": ["Try answering even if unsure."],
            "should_ask_easier": True
        }

    prompt = f"""
You are a SENIOR TECHNICAL INTERVIEWER.

Topic: {topic}
Question: {question}
Candidate's Spoken Answer: {answer}

This is a SPOKEN answer - grammar imperfections are acceptable.

SCORING:
Technical Score:
0-2: No answer, nonsense, completely incorrect
3-4: Very limited, mentions one small concept
5-6: Partial understanding, some correct concepts
7-8: Good understanding, mostly correct
9-10: Excellent, clear, comprehensive

Communication Score:
0-2: No meaningful explanation
3-4: Very unclear, fragmented
5-6: Understandable but incomplete
7-8: Clear and reasonably structured
9-10: Very clear, confident explanation

RULES:
- Reward concepts, not exact wording
- Give partial credit where deserved
- Empty strengths if none exist
- Never invent strengths
- Correct answers MUST be technically accurate
- Do NOT invent explanations - use textbook definitions if unsure

Return ONLY valid JSON:
{{
    "technical_score": 0, "communication_score": 0,
    "strengths": [], "weaknesses": [],
    "correct_answer": "", "improvement_tips": []
}}
"""
    content = _call(prompt)
    try:
        result = json.loads(content)
        result.setdefault("technical_score", 0)
        result.setdefault("communication_score", 0)
        result.setdefault("strengths", [])
        result.setdefault("weaknesses", [])
        result.setdefault("correct_answer", "")
        result.setdefault("improvement_tips", [])
        result.setdefault("should_ask_easier", False)
        result["technical_score"] = max(0, min(10, int(result["technical_score"])))
        result["communication_score"] = max(0, min(10, int(result["communication_score"])))
        return result
    except:
        return {"technical_score": 0, "communication_score": 0, "strengths": [], "weaknesses": ["Failed to parse"], "correct_answer": "", "improvement_tips": [], "should_ask_easier": True}


def generate_final_report(interview_results):
    prompt = f"""
Analyze these interview results.

Interview Results:
{json.dumps(interview_results, indent=2)}

RULES:
- overall_score = average technical score x 10
- technical_average = average technical score
- communication_average = average communication score
- strengths: Topics where score >= 7 (no duplicates)
- weak_topics: Topics where score < 5 (no duplicates)
- recommended_topics: DIFFERENT topics to study (not same as weak_topics)
- interview_readiness: overall_score as percentage like "72%"
- recommended_role: Based on strengths, suggest job roles
- confidence_level: "High" if >70, "Medium" if 40-70, "Low" if <40
- summary: 2-3 sentences

Return ONLY valid JSON:
{{
    "overall_score": 0, "technical_average": 0, "communication_average": 0,
    "strengths": [], "weak_topics": [], "recommended_topics": [],
    "interview_readiness": "0%", "recommended_role": [], "confidence_level": "Low",
    "summary": ""
}}
"""
    content = _call(prompt)
    try:
        result = json.loads(content)
        # Deduplicate
        if "strengths" in result:
            result["strengths"] = list(set(result["strengths"]))
        if "weak_topics" in result:
            result["weak_topics"] = list(set(result["weak_topics"]))
        if "recommended_topics" in result:
            result["recommended_topics"] = list(set(result["recommended_topics"]))
        result.setdefault("interview_readiness", f"{result.get('overall_score', 0)}%")
        result.setdefault("recommended_role", [])
        result.setdefault("confidence_level", "Medium")
        return result
    except:
        scores = [r.get("evaluation", {}).get("technical_score", 0) for r in interview_results]
        avg_tech = sum(scores) / len(scores) if scores else 0
        overall = round(avg_tech * 10)
        return {
            "overall_score": overall, "technical_average": round(avg_tech, 1),
            "communication_average": 5, "strengths": [], "weak_topics": [],
            "recommended_topics": [], "interview_readiness": f"{overall}%",
            "recommended_role": [], "confidence_level": "Medium", "summary": "Interview completed."
        }


def generate_followup_question(topic, score, difficulty=None):
    if difficulty:
        final_difficulty = difficulty
    elif score <= 4:
        final_difficulty = "Easy"
    elif score <= 7:
        final_difficulty = "Medium"
    else:
        final_difficulty = "Hard"

    prompt = f"""
Generate ONE {final_difficulty.lower()} theory question about {topic}.

Topic: {topic}
Score: {score}/10
Difficulty: {final_difficulty}

RULES:
- EASY: Basic definition or simple "what is" question
- MEDIUM: Application or comparison question
- HARD: Advanced concept or architecture question
- Question MUST be about {topic} only
- Theory only - NO coding
- Be specific, not generic
- Ask about a DIFFERENT aspect than typical questions

Return ONLY valid JSON:
{{"question": "", "topic": "{topic}", "difficulty": "{final_difficulty}"}}
"""
    content = _call(prompt)
    try:
        return json.loads(content)
    except:
        return {"question": f"Can you explain more about {topic}?", "topic": topic, "difficulty": final_difficulty}