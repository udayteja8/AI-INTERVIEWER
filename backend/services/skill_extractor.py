SKILLS = [
    "Python",
    "Java",
    "C++",
    "React",
    "Node.js",
    "MongoDB",
    "Flask",
    "Machine Learning",
    "Deep Learning",
    "SQL",
    "DSA",
    "JavaScript"
]

def extract_skills(text):

    found = []

    text = text.lower()

    for skill in SKILLS:

        if skill.lower() in text:
            found.append(skill)

    return found