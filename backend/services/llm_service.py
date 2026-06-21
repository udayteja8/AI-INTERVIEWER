# # from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
# # from langchain_core.messages import HumanMessage
# # from dotenv import load_dotenv
# # import re

# # load_dotenv()

# # llm = HuggingFaceEndpoint(
# #     repo_id="meta-llama/Llama-3.1-8B-Instruct",
# #     task="text-generation",
# #     max_new_tokens=500,
# #     temperature=0.5
# # )

# # model = ChatHuggingFace(llm=llm)

# # def analyze_resume(resume_text):

# #     msg = HumanMessage(
# #         content=f"""
# # Analyze the following resume carefully.

# # Resume:
# # {resume_text}

# # Extract only the candidate's projects and technical skills.

# # Return ONLY in this format:

# # Projects:
# # - Project 1
# # - Project 2
# # - Project 3

# # Skills:
# # - Skill 1
# # - Skill 2
# # - Skill 3

# # Do not add explanations.
# # Do not add extra text.
# # """
# #     )

# #     response = model.invoke([msg])

# #     return response.content

# # def generate_resume_questions(projects, skills, difficulty):

# #     msg = HumanMessage(
# #         content=f"""
# # You are a Senior Software Engineer conducting a real technical interview.

# # Candidate Projects:
# # {projects}

# # Candidate Skills:
# # {skills}

# # Interview Difficulty:
# # {difficulty}

# # IMPORTANT INSTRUCTIONS:

# # 1. Generate EXACTLY 5 interview questions.

# # 2. Question 1 and Question 2 MUST be based on the candidate's projects.

# # 3. Question 3 and Question 4 MUST be based on the candidate's skills.

# # 4. Question 5 MUST be a behavioral or experience-based question.

# # 5. Ask questions as if you have actually read the candidate's resume.

# # 6. Mention project names whenever possible.

# # 7. Do NOT generate generic questions like:
# #    - What is Python?
# #    - What is MongoDB?
# #    - What is React?

# # 8. Instead ask personalized questions such as:
# #    - How did you implement recommendation logic in the Music Recommendation System?
# #    - What challenges did you face while building the AI Travel Guide?
# #    - Why did you choose Flask instead of Django for your Job Portal?

# # 9. Do NOT ask coding problems.

# # 10. Do NOT ask MCQs.

# # 11. Do NOT ask implementation assignments.

# # 12. The candidate should be able to answer verbally.

# # OUTPUT FORMAT:

# # 1. Question
# # 2. Question
# # 3. Question
# # 4. Question
# # 5. Question

# # Return ONLY the questions.
# # """
# #     )

# #     response = model.invoke([msg])

# #     return response.content


# # def generate_questions(skills, difficulty):

# #     prompt = HumanMessage(
# #         content=f"""
# # You are conducting a technical interview.

# # Candidate Skills:
# # {', '.join(skills)}

# # Difficulty:
# # {difficulty}

# # Generate EXACTLY 5 interview questions.

# # Rules:
# # - Ask conceptual questions only.
# # - Do not ask coding questions.
# # - Do not ask implementation tasks.
# # - Do not ask project assignments.
# # - Number the questions from 1 to 5.

# # Example:

# # 1. What is a Python decorator?
# # 2. How does Flask routing work?

# # Generate only the questions.
# # """
# #     )

# #     response = model.invoke([prompt])

# #     text = response.content

# #     questions = re.findall(
# #         r'\d+\.\s*(.*?)(?=\n\d+\.|\Z)',
# #         text,
# #         re.DOTALL
# #     )

# #     questions = [q.strip() for q in questions]

# #     return questions


# # def evaluate_answer(question, answer):

# #     prompt = HumanMessage(
# #         content=f"""
# # You are a senior technical interviewer.

# # Question:
# # {question}

# # Candidate Answer:
# # {answer}

# # Evaluate the answer.

# # Return in exactly this format:

# # Technical Score: X/10

# # English Score: X/10

# # Strengths:
# # - point1
# # - point2

# # Weaknesses:
# # - point1
# # - point2

# # Correct Answer:
# # (correct explanation)

# # Suggestions:
# # - point1
# # - point2
# # """
# #     )

# #     response = model.invoke([prompt])

# #     return response.content


# import os
# import json
# from groq import Groq

# client = Groq(
#     api_key=os.getenv("GROQ_API_KEY")
# )

# def analyze_resume(resume_text):

#     prompt = f"""
#     Analyze the following resume.

#     Resume:
#     {resume_text}

#     Extract:
#     1. Professional Summary
#     2. Technical Skills
#     3. Projects
#     4. Strengths
#     5. Suggested Interview Areas

#     Return ONLY valid JSON.

#     Format:

#     {{
#         "summary": "",
#         "skills": [],
#         "projects": [],
#         "strengths": [],
#         "interview_areas": []
#     }}
#     """

#     response = client.chat.completions.create(
#         model="llama-3.3-70b-versatile",
#         messages=[
#             {
#                 "role": "user",
#                 "content": prompt
#             }
#         ]
#     )

#     content = response.choices[0].message.content

#     content = (
#         content.replace("```json", "")
#         .replace("```", "")
#         .strip()
#     )

#     try:
#         return json.loads(content)

#     except json.JSONDecodeError:
#         return {
#             "summary": "",
#             "skills": [],
#             "projects": [],
#             "strengths": [],
#             "interview_areas": [],
#             "error": "Failed to parse AI response"
#         }

# def generate_resume_questions(analysis):

#     prompt = f"""
# Resume Analysis:

# {json.dumps(analysis, indent=2)}

# You are a technical interviewer.

# Generate exactly 10 interview questions.

# STRICT RULES:

# 1. Use ONLY the projects listed.
# 2. Use ONLY the skills listed.
# 3. NEVER assume features not explicitly mentioned.
# 4. NEVER invent authentication, deployment, cloud, visualization, APIs, or ML techniques unless present.
# 5. Ask questions only about:
#    - listed projects
#    - listed technologies
#    - listed skills
# 6. Return ONLY valid JSON.

# Format:

# {{
#     "questions":[
#         {{
#             "question":"",
#             "topic":"",
#             "difficulty":"",
#             "expected_answer_points":[]
#         }}
#     ]
# }}
# """

#     response = client.chat.completions.create(
#         model="llama-3.3-70b-versatile",
#         messages=[
#             {
#                 "role": "user",
#                 "content": prompt
#             }
#         ]
#     )

#     content = response.choices[0].message.content

#     content = (
#         content.replace("```json", "")
#         .replace("```", "")
#         .strip()
#     )

#     try:
#         return json.loads(content)

#     except json.JSONDecodeError:
#         return {
#             "questions": [],
#             "error": "Failed to parse AI response",
#             "raw_response": content
#         }
    
# def evaluate_answer(question, answer):

#     prompt = f"""
# You are an experienced technical interviewer.

# Question:
# {question}

# Candidate Answer:
# {answer}

# Evaluation Rules:

# 1. Be fair and realistic.
# 2. Do NOT expect a textbook-perfect answer.
# 3. Give partial credit for correct concepts.
# 4. Reward understanding even if details are missing.
# 5. A partially correct answer should receive 5-7/10.
# 6. A correct concise answer should receive 7-9/10.
# 7. Only give 0-3/10 if the answer is mostly incorrect.

# Return ONLY valid JSON.

# Format:

# {{
#     "technical_score": 0,
#     "communication_score": 0,
#     "strengths": [],
#     "weaknesses": [],
#     "correct_answer": "",
#     "improvement_tips": []
# }}
# """

#     response = client.chat.completions.create(
#         model="llama-3.3-70b-versatile",
#         messages=[
#             {
#                 "role": "user",
#                 "content": prompt
#             }
#         ]
#     )

#     content = response.choices[0].message.content

#     content = (
#         content.replace("```json", "")
#         .replace("```", "")
#         .strip()
#     )

#     try:
#         return json.loads(content)

#     except json.JSONDecodeError:
#         return {
#             "technical_score": 0,
#             "communication_score": 0,
#             "strengths": [],
#             "weaknesses": [
#                 "Failed to parse AI response"
#             ],
#             "correct_answer": "",
#             "improvement_tips": []
#         }

# def generate_final_report(interview_results):

#     prompt = f"""
#     You are an expert technical interviewer.

#     Interview Results:

#     {json.dumps(interview_results, indent=2)}

#     Analyze all interview results and return ONLY valid JSON.

#     Do not include markdown.
#     Do not include explanations.
#     Do not wrap in ```json.

#     Format:

#     {{
#         "overall_score": 0,
#         "technical_average": 0,
#         "communication_average": 0,
#         "strengths": [],
#         "weak_topics": [],
#         "recommended_topics": [],
#         "summary": ""
#     }}

#     Rules:
#     - overall_score should be out of 100.
#     - strengths should mention strong areas.
#     - weak_topics should mention topics needing improvement.
#     - recommended_topics should suggest what to study next.
#     - summary should be 2-3 lines.
#     """

#     response = client.chat.completions.create(
#         model="llama-3.3-70b-versatile",
#         messages=[
#             {
#                 "role": "user",
#                 "content": prompt
#             }
#         ]
#     )

#     content = response.choices[0].message.content

#     content = (
#         content.replace("```json", "")
#         .replace("```", "")
#         .strip()
#     )

#     try:
#         return json.loads(content)

#     except json.JSONDecodeError:
#         return {
#             "overall_score": 0,
#             "technical_average": 0,
#             "communication_average": 0,
#             "strengths": [],
#             "weak_topics": [],
#             "recommended_topics": [],
#             "summary": "Unable to generate report."
#         }
    

# def generate_followup_question(topic, score):

#     if score <= 4:
#         difficulty = "Easy"
#     elif score <= 7:
#         difficulty = "Medium"
#     else:
#         difficulty = "Hard"

#     prompt = f"""
#     You are conducting an adaptive technical interview.

#     Topic: {topic}

#     Previous Score: {score}/10

#     Rules:
#     1. Stay on the same topic.
#     2. If score <= 4 ask an easier question.
#     3. If score 5-7 ask a similar difficulty question.
#     4. If score >= 8 ask a harder question.
#     5. Return ONLY valid JSON.
#     6. Do not return markdown.

#     Format:

#     {{
#         "question":"",
#         "difficulty":"{difficulty}",
#         "expected_answer_points":[]
#     }}
#     """

#     response = client.chat.completions.create(
#         model="llama-3.3-70b-versatile",
#         messages=[
#             {
#                 "role": "user",
#                 "content": prompt
#             }
#         ]
#     )

#     content = response.choices[0].message.content

#     content = (
#         content.replace("```json", "")
#         .replace("```", "")
#         .strip()
#     )

#     try:
#         return json.loads(content)

#     except json.JSONDecodeError:
#         return {
#             "question": "",
#             "difficulty": difficulty,
#             "expected_answer_points": [],
#             "error": "Failed to parse AI response"
#         }

import os
import json
import re
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def _call(prompt):
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )
    content = response.choices[0].message.content
    content = (
        content.replace("```json", "")
        .replace("```", "")
        .strip()
    )
    match = re.search(r'\{.*\}', content, re.DOTALL)
    if match:
        content = match.group()
    return content


def analyze_resume(resume_text):
    prompt = f"""
Analyze the following resume carefully.

Resume:
{resume_text}

Extract ONLY what is explicitly mentioned:
1. Professional Summary
2. Technical Skills (only listed ones)
3. Projects (only mentioned ones)
4. Strengths
5. Suggested Interview Areas

STRICT RULES:
- Do NOT add any skill or project not present in the resume
- Do NOT make assumptions
- Return ONLY valid JSON, no extra text

Format:
{{
    "summary": "",
    "skills": [],
    "projects": [],
    "strengths": [],
    "interview_areas": []
}}
"""
    content = _call(prompt)
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {
            "summary": "", "skills": [], "projects": [],
            "strengths": [], "interview_areas": [],
            "error": "Failed to parse AI response"
        }


def generate_resume_questions(analysis):
    prompt = f"""
Resume Analysis:
{json.dumps(analysis, indent=2)}

You are a technical interviewer conducting a THEORY-ONLY interview.

Generate exactly 10 theory-based interview questions.

STRICT RULES:
1. Ask ONLY theoretical/conceptual questions
2. Questions MUST be answerable verbally in 1-2 minutes
3. Base questions ONLY on listed projects and skills
4. NEVER ask coding problems, write code, or implement anything
5. NEVER ask MCQs
6. NEVER invent skills or projects not listed
7. Ask questions like:
   - "Explain how..." 
   - "What is the difference between..."
   - "Why did you choose..."
   - "Describe the architecture of..."
   - "What challenges did you face with..."
8. Return ONLY valid JSON, no extra text

Format:
{{
    "questions":[
        {{
            "question":"",
            "topic":"",
            "difficulty":"Medium"
        }}
    ]
}}
"""
    content = _call(prompt)
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {
            "questions": [],
            "error": "Failed to parse AI response",
            "raw_response": content
        }


def evaluate_answer(question, answer):
    prompt = f"""
You are an experienced technical interviewer evaluating a VERBAL answer.

Question:
{question}

Candidate's Verbal Answer:
{answer}

Evaluation Rules:
1. This is a SPOKEN answer - expect informal language, pauses, imperfections
2. Do NOT expect textbook-perfect written answers
3. Give partial credit for correct concepts even if incomplete
4. Reward practical understanding over memorized definitions
5. Score 0-3: Mostly incorrect or irrelevant
6. Score 4-6: Partially correct, some gaps
7. Score 7-8: Good understanding, minor gaps
8. Score 9-10: Excellent, clear, comprehensive
9. Keep feedback concise and constructive

Return ONLY valid JSON, no extra text:
{{
    "technical_score": 0,
    "communication_score": 0,
    "strengths": [],
    "weaknesses": [],
    "correct_answer": "",
    "improvement_tips": []
}}
"""
    content = _call(prompt)
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {
            "technical_score": 0,
            "communication_score": 0,
            "strengths": [],
            "weaknesses": ["Failed to parse AI response"],
            "correct_answer": "",
            "improvement_tips": []
        }


def generate_final_report(interview_results):
    prompt = f"""
You are an expert technical interviewer analyzing interview results.

Interview Results:
{json.dumps(interview_results, indent=2)}

Analyze and return ONLY valid JSON, no extra text:
{{
    "overall_score": 0,
    "technical_average": 0,
    "communication_average": 0,
    "strengths": [],
    "weak_topics": [],
    "recommended_topics": [],
    "summary": ""
}}

Rules:
- overall_score: Average of all technical scores converted to 100 scale
- technical_average: Average of all technical scores
- communication_average: Average of all communication scores
- strengths: Topics where candidate scored 7+
- weak_topics: Topics where candidate scored below 5
- recommended_topics: 3-5 topics to study based on weaknesses
- summary: 2-3 sentences about overall performance
"""
    content = _call(prompt)
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {
            "overall_score": 0,
            "technical_average": 0,
            "communication_average": 0,
            "strengths": [],
            "weak_topics": [],
            "recommended_topics": [],
            "summary": "Unable to generate report."
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
You are conducting an adaptive technical interview. Ask THEORY-ONLY questions.

Topic: {topic}
Previous Score: {score}/10
Required Difficulty: {final_difficulty}

Generate ONE {final_difficulty.lower()} THEORY question about {topic}.

STRICT RULES BY DIFFICULTY:
- EASY: Basic definitions, fundamentals, simple "what is" questions
  Example: "What is a React component?"
  Example: "Explain what JSX means in simple terms"

- MEDIUM: Application, comparison, practical understanding
  Example: "Compare functional vs class components in React"
  Example: "When would you use useState vs useReducer?"

- HARD: Advanced concepts, architecture, trade-offs
  Example: "Explain React Fiber reconciliation in depth"
  Example: "How would you optimize re-renders in a large React app?"

RULES:
1. Ask ONLY theory/conceptual questions
2. NO coding, NO implementation, NO "write a function"
3. Question must be answerable verbally in 1-2 minutes
4. Stay strictly on the topic: {topic}
5. Return ONLY valid JSON, no extra text

Return:
{{
    "question": "",
    "topic": "{topic}",
    "difficulty": "{final_difficulty}"
}}
"""
    content = _call(prompt)
    try:
        return json.loads(content)
    except:
        return {
            "question": f"Explain the key concepts of {topic}",
            "topic": topic,
            "difficulty": final_difficulty
        }