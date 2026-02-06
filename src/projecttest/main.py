from projecttest.crew import InterviewCrew
from projecttest.utils.file_reader import read_cv_file


def run():
    # ---------------- Step 1: Read CV ----------------
    cv_path = input("Enter path to CV file (PDF/DOCX/TXT):\n").strip()
    cv_text = read_cv_file(cv_path)

    # ---------------- Step 2: Ask user what tech they want ----------------
    selected_tech = input(
        "\nEnter the technology you want to be interviewed on (e.g. Python, React, Java):\n"
    ).strip()

    if not selected_tech:
        print("No technology selected. Exiting.")
        return

    # ---------------- Step 3: Run Crew ONCE ----------------
    crew = InterviewCrew().crew()

    result = crew.kickoff(
        inputs={
            "cv_text": cv_text,
            "selected_tech": selected_tech
        }
    )

    # ---------------- Step 4: Output ----------------
    print("\n=== CREW OUTPUT ===\n")
    print(result.raw)


if __name__ == "__main__":
    run()
