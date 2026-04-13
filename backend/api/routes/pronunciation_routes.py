import re

from fastapi import APIRouter

from api.schema.pronunciation_schema import (
    PronunciationEvaluateRequest,
    PronunciationEvaluateResponse,
)


router = APIRouter(prefix="/pronunciation")


def normalize_pronunciation_text(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9\s]", "", value)
    value = re.sub(r"\s+", " ", value)

    substitutions = {
        "entrepreneurship": "entrepreneurship",
        "entrepreneur": "entrepreneur",
    }

    return substitutions.get(value, value)


def levenshtein_distance(a: str, b: str) -> int:
    matrix = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]

    for i in range(len(a) + 1):
        matrix[i][0] = i
    for j in range(len(b) + 1):
        matrix[0][j] = j

    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            cost = 0 if a[i - 1] == b[j - 1] else 1
            matrix[i][j] = min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost,
            )

    return matrix[-1][-1]


def calculate_similarity(expected: str, spoken: str) -> float:
    max_length = max(len(expected), len(spoken), 1)
    return max(0.0, 1 - (levenshtein_distance(expected, spoken) / max_length))


def build_feedback(score: float, expected: str, spoken: str) -> tuple[str, str]:
    if score >= 0.9:
        return (
            "Perfect Pronunciation!",
            f'Great job. "{spoken}" closely matches "{expected}".',
        )

    if score >= 0.75:
        return (
            "Almost Correct!",
            f'Close attempt. Try saying "{expected}" a bit more clearly.',
        )

    return (
        "Try Again!",
        f'We heard "{spoken}". Listen once more and repeat "{expected}".',
    )


@router.post("/evaluate/", response_model=PronunciationEvaluateResponse)
def evaluate_pronunciation(payload: PronunciationEvaluateRequest):
    normalized_expected = normalize_pronunciation_text(payload.expected)
    normalized_spoken = normalize_pronunciation_text(payload.spoken)
    score = calculate_similarity(normalized_expected, normalized_spoken)
    message, feedback = build_feedback(score, payload.expected, payload.spoken)

    return PronunciationEvaluateResponse(
        expected=payload.expected,
        spoken=payload.spoken,
        normalized_expected=normalized_expected,
        normalized_spoken=normalized_spoken,
        score=round(score, 4),
        message=message,
        feedback=feedback,
    )
