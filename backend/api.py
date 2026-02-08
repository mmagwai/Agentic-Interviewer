from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import json
import sys

# allow imports from src
sys.path.append(os.path.join(os.path.dirname(__file__), "src"))

from projecttest.analysis_crew import CVAnalysisCrew
from projecttest.question_crew import QuestionCrew
from projecttest.utils.file_reader import read_cv_file
from projecttest.evaluation_crew import EvaluationCrew
from projecttest.grading_crew import GradingCrew
from projecttest.challenge_crew import ChallengeCrew



# =====================================================
# APP
# =====================================================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev mode
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# HELPER → Extract task output
# =====================================================
def get_task_output(result, task_name: str):
    for task in result.tasks_output:
        if task.name == task_name:
            return task.raw.strip()
    return ""


# =====================================================
# 1️⃣ ANALYZE CV
# =====================================================
@app.post("/analyze-cv")
async def analyze_cv(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"

    try:
        # save file
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # read text
        cv_text = read_cv_file(temp_path)

        # run crew
        crew = CVAnalysisCrew().crew()
        result = crew.kickoff(inputs={"cv_text": cv_text})

        raw = get_task_output(result, "analyze_cv_task")

        # parse JSON safely
        try:
            data = json.loads(raw)
        except Exception:
            data = {
                "candidate_name": "Unknown",
                "experience_level": "Unknown",
                "tech_stack": [],
            }

        return data

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


# =====================================================
# 2️⃣ GENERATE INTERVIEW QUESTIONS
# =====================================================
@app.post("/questions")
async def generate_questions(
    file: UploadFile = File(...),
    selected_tech: str = Form(...),
):
    temp_path = f"temp_{file.filename}"

    try:
        # save file
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # read CV
        cv_text = read_cv_file(temp_path)

        # run crew
        crew = QuestionCrew().crew()
        result = crew.kickoff(
            inputs={
                "cv_text": cv_text,
                "selected_tech": selected_tech,
            }
        )

        raw = get_task_output(result, "generate_interview_questions")

        # ===============================
        # If tech not found
        # ===============================
        if "not found" in raw.lower():
            return {
                "questions": [],
                "message": "Selected technology not found in CV.",
            }

        # ===============================
        # Clean numbering
        # ===============================
        cleaned = []
        for line in raw.split("\n"):
            line = line.strip()

            # remove numbering: 1.  2)  - etc
            line = line.lstrip("0123456789.-) ")

            if line:
                cleaned.append(line)

        return {
            "questions": cleaned,
            "total": len(cleaned),
        }

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/evaluate-answer")
async def evaluate_answer(
    question: str = Form(...),
    answer: str = Form(...)
):
    crew = EvaluationCrew().crew()

    result = crew.kickoff(
        inputs={
            "question": question,
            "answer": answer
        }
    )

    raw = get_task_output(result, "evaluate_answer")

    try:
        data = json.loads(raw)
    except:
        data = {
            "score": 0,
            "feedback": "Could not evaluate answer",
            "correct": False
        }

    return data

# =====================================================
# 3️⃣ GENERATE CODING CHALLENGE
# =====================================================
@app.post("/coding-challenge")
async def coding_challenge(
    file: UploadFile = File(...),
    selected_tech: str = Form(...),
    experience_level: str = Form(...)

):
    temp_path = f"temp_{file.filename}"

    try:
        # save file
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # read CV
        cv_text = read_cv_file(temp_path)

        # run crew
        crew = ChallengeCrew().crew()

        result = crew.kickoff(
            inputs={
                "selected_tech": selected_tech,
                "cv_text": cv_text,
                 "experience_level": experience_level,
            }
        )

        raw = get_task_output(result, "generate_coding_challenge")

        if "no coding challenge" in raw.lower():
            return {"challenge": ""}

        return {"challenge": raw}

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)



# =====================================================
# 4️⃣ GRADE CODE SUBMISSION
# =====================================================
@app.post("/grade-code")
async def grade_code(
    problem: str = Form(...),
    file: UploadFile = File(...)
):
    temp_path = f"temp_{file.filename}"

    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        with open(temp_path, "r", encoding="utf-8", errors="ignore") as f:
            candidate_code = f.read()

        crew = GradingCrew().crew()

        result = crew.kickoff(
            inputs={
                "problem": problem,
                "candidate_code": candidate_code
            }
        )

        raw = get_task_output(result, "grade_coding_solution")

        try:
            data = json.loads(raw)
        except:
            data = {
                "score": 0,
                "verdict": "fail",
                "feedback": "Could not evaluate code"
            }

        return data

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


