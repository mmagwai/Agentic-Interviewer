from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List
from crewai_tools import SerperDevTool
# If you want to run a snippet of code before or after the crew starts,
# you can use the @before_kickoff and @after_kickoff decorators
# https://docs.crewai.com/concepts/crews#example-crew-class-with-decorators

@CrewBase
class InterviewCrew:
    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def cv_analyzer(self) -> Agent:
        return Agent(
            config=self.agents_config["cv_analyzer"],
            verbose=True
        )

    @task
    def analyze_cv_task(self) -> Task:
        return Task(
            config=self.tasks_config["analyze_cv_task"]
        )

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=[self.cv_analyzer()],
            tasks=[self.analyze_cv_task()],
            verbose=True
        )