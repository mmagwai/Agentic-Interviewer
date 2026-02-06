from pydantic import BaseModel
from typing import List

class CVAnalysis(BaseModel):
    years_of_experience: int
    experience_level: str
    tech_stack: List[str]
