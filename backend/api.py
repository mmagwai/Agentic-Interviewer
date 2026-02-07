from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import json
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), "src"))

from projecttest.analysis_crew import CVAnalysisCrew
from projecttest.question_crew import QuestionCrew



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# helper
def get_task_output(result, task_name):
    for task in result.tasks_output:
        if task.name == task_name:
            return task.raw.strip()
    return ""


# =====================================================
# 1️ ANALYZE CV
# =====================================================
@app.post("/analyze-cv")
async def analyze_cv(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    from projecttest.utils.file_reader import read_cv_file
    cv_text = read_cv_file(temp_path)

    crew = CVAnalysisCrew().crew()
    result = crew.kickoff(inputs={"cv_text": cv_text})

    analysis = get_task_output(result, "analyze_cv_task")

    try:
        data = json.loads(analysis)
    except:
        data = {
            "candidate_name": "Unknown",
            "experience_level": "Unknown",
            "tech_stack": []
        }

    os.remove(temp_path)
    return data


# =====================================================
# 2️ GENERATE QUESTIONS
# =====================================================
@app.post("/questions")
async def questions(
    file: UploadFile = File(...),
    selected_tech: str = Form(...)
):
    temp_path = f"temp_{file.filename}"

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    from projecttest.utils.file_reader import read_cv_file
    cv_text = read_cv_file(temp_path)

    crew = QuestionCrew().crew()
    result = crew.kickoff(
        inputs={
            "cv_text": cv_text,
            "selected_tech": selected_tech
        }
    )

    raw = get_task_output(result, "generate_interview_questions")
    questions = [q for q in raw.split("\n") if q.strip()]

    os.remove(temp_path)
    return {"questions": questions}
