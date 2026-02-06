from projecttest.crew import InterviewCrew
from projecttest.utils.file_reader import read_cv_file
from crewai import Agent, Task, Crew
import json


def run():
    cv_path = input("Enter path to CV file:\n").strip()
    cv_text = read_cv_file(cv_path)

    while True:
        selected_tech = input("\nEnter technology to be interviewed on:\n").strip()

        crew = InterviewCrew().crew()
        result = crew.kickoff(
            inputs={
                "cv_text": cv_text,
                "selected_tech": selected_tech
            }
        )

        output = result.raw.strip()

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
