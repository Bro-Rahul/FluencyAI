from pydantic import BaseModel, Field


class PronunciationEvaluateRequest(BaseModel):
    expected: str = Field(min_length=1)
    spoken: str = Field(min_length=1)


class PronunciationEvaluateResponse(BaseModel):
    expected: str
    spoken: str
    normalized_expected: str
    normalized_spoken: str
    score: float
    message: str
    feedback: str
