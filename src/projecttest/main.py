from projecttest.crew import InterviewCrew
from projecttest.utils.file_reader import read_cv_file


def run():
    # ---------------- Step 1: Read CV ----------------
    cv_path = input("Enter path to CV file (PDF/DOCX/TXT):\n").strip()
    cv_text = read_cv_file(cv_path)

    crew = InterviewCrew().crew()

    while True:
        # ---------------- Step 2: Ask user what tech they want ----------------
        selected_tech = input(
            "\nEnter the technology you want to be interviewed on (e.g. Python, React, Java):\n"
        ).strip()

        if not selected_tech:
            print("No technology selected. Try again.")
            continue

        # ---------------- Step 3: Run Crew ----------------
        result = crew.kickoff(
            inputs={
                "cv_text": cv_text,
                "selected_tech": selected_tech
            }
        )

        output = result.raw.strip()

        # ---------------- Step 4: Guardrail handling ----------------
        if output == "Selected technology not found in CV.":
            print("\n That technology does not appear in your CV.")
            print("Please choose a technology that exists in your CV.\n")
            continue

        # ---------------- Step 5: Success ----------------
        print("\n=== INTERVIEW QUESTIONS ===\n")
        print(output)
        break


if __name__ == "__main__":
    run()
