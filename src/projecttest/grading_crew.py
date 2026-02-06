from crewai import Agent, Crew, Task
from crewai.project import CrewBase, agent, crew, task


@CrewBase
class GradingCrew:
    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def answer_grader(self) -> Agent:
        return Agent(
            config=self.agents_config["answer_grader"],
            verbose=False
        )

    @task
    def grade_answer_task(self) -> Task:
        return Task(
            config=self.tasks_config["grade_answer_task"]
        )

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=[self.answer_grader()],
            tasks=[self.grade_answer_task()],
            verbose=False
        )
