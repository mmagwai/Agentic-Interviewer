from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

import shutil
import os
import json
import sys

# allow imports from src/
sys.path.append(os.path.join(os.path.dirname(__file__), "src"))

from projecttest.crew import InterviewCrew
from projecttest.utils.file_reader import read_cv_file


# =====================================================
# CREATE FASTAPI APP
# =====================================================
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],)
# =====================================================
# Helper: safely get task output
# =====================================================
def get_task_output(result, task_name):
    for task in result.tasks_output:
        if task.name == task_name:
            return task.raw.strip()
    return ""


# =====================================================
# ANALYZE CV → send data to React
# =====================================================
@app.post("/analyze-cv")
async def analyze_cv(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"

    # save uploaded file
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # read CV
    cv_text = read_cv_file(temp_path)

    # run crew
    crew = InterviewCrew().crew()
    result = crew.kickoff(
        inputs={
            "cv_text": cv_text,
            "selected_tech": ""  # not needed yet
        }
    )

    analysis = get_task_output(result, "analyze_cv_task")

    print("\n========= RAW ANALYSIS =========")
    print(analysis)
    print("================================\n")

    # -------------------------------------------------
    # SAFETY → React must ALWAYS get valid JSON
    # -------------------------------------------------
    try:
        data = json.loads(analysis)
    except Exception:
        data = {
            "candidate_name": "Unknown",
            "experience_level": "Unknown",
            "tech_stack": []
        }

    # cleanup
    os.remove(temp_path)

    return data
