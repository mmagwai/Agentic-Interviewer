from projecttest.crew import InterviewCrew
from projecttest.utils.file_reader import read_cv_file

def run():
    cv_path = input("Enter path to CV file (PDF/DOCX/TXT):\n").strip()

    cv_text = read_cv_file(cv_path)

    crew = InterviewCrew().crew()
    result = crew.kickoff(inputs={"cv_text": cv_text})

    print("\n=== ANALYSIS RESULT ===")
    print(result)
