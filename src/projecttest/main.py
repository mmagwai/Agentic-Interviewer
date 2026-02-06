#!/usr/bin/env python
import sys
import warnings

from datetime import datetime


warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

from projecttest.crew import InterviewCrew

def run():
    cv_text = input("Paste candidate CV text:\n")

    crew = InterviewCrew().crew()
    result = crew.kickoff(
        inputs={"cv_text": cv_text}
    )

    print("\n=== FINAL OUTPUT ===\n")
    print(result)


if __name__ == "__main__":
    run()
