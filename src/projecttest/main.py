from projecttest.crew import InterviewCrew
from projecttest.utils.file_reader import read_cv_file
from crewai import Agent, Task, Crew
from projecttest.grading_crew import GradingCrew

import json

def get_task_output(result, task_name):
    for task in result.tasks_output:
        if task.name == task_name:
            return task.raw.strip()
    return ""


def run():
    cv_path = input("Enter path to CV file:\n").strip()
    cv_text = read_cv_file(cv_path)

    # =====================================================
    # ================= INTERVIEW =========================
    # =====================================================

    while True:
        selected_tech = input("\nEnter technology to be interviewed on:\n").strip()

        crew = InterviewCrew().crew()
        result = crew.kickoff(
            inputs={
                "cv_text": cv_text,
                "selected_tech": selected_tech
            }
        )

        # ✅ explicitly get questions
        output = get_task_output(result, "generate_interview_questions")


        if output == "Selected technology not found in CV.":
            print("Technology not found. Try again.")
            continue
        else:
            break

    questions = [q for q in output.split("\n") if q.strip()]

    score = 0

    for idx, question in enumerate(questions, start=1):
        print(f"\nQuestion {idx}: {question}")
        answer = input("Your answer: ")

        if evaluate_answer(question, answer):
            print("Acceptable answer")
            score += 1
        else:
            print("Incorrect answer")

    print(f"\nFinal Score: {score}/{len(questions)}")

    # =====================================================
    # ================ CODING CHALLENGE ===================
    # =====================================================

    print("\n\n=== CODING CHALLENGE ===\n")

    challenge = get_task_output(result, "generate_coding_challenge")


    if challenge == "No coding challenge for this technology.":
        print(challenge)
        return

    print(challenge)

    # Ask candidate for solution file
    solution_path = input("\nEnter path to your solution file:\n").strip()

    try:
        with open(solution_path, "r", encoding="utf-8") as f:
            candidate_code = f.read()
    except Exception:
        print("Could not read file.")
        return

    # =====================================================
    # ================== CODE GRADING =====================
    # =====================================================

    grading_crew = GradingCrew().crew()

    grading_result = grading_crew.kickoff(
        inputs={
            "candidate_code": candidate_code,
            "problem": challenge
        }
    )

    print("\n=== CODE EVALUATION ===\n")
    print(grading_result.raw)


def evaluate_answer(question, answer):
    """
    LLM-based grading.
    Returns True if answer is acceptable, else False.
    """

    grader_agent = Agent(
        role="Technical Interview Grader",
        goal="Evaluate if a candidate's answer is acceptable",
        backstory=(
            "You are a senior technical interviewer. "
            "You judge answers leniently but require core concepts to be correct."
        ),
        verbose=False
    )

    grading_task = Task(
        description=f"""
        Interview Question:
        {question}

        Candidate Answer:
        {answer}

        Decide if the answer is ACCEPTABLE for an interview.
        Be lenient and accept partial explanations if main idea is present.

        Respond ONLY in valid JSON:
        {{
          "acceptable": true | false
        }}
        """,
        agent=grader_agent,
        expected_output="JSON with acceptable=true or false"
    )

    grading_crew = Crew(
        agents=[grader_agent],
        tasks=[grading_task],
        verbose=False
    )

    result = grading_crew.kickoff()

    try:
        verdict = json.loads(result.raw)
        return verdict.get("acceptable", False)
    except json.JSONDecodeError:
        return False


if __name__ == "__main__":

    run()
