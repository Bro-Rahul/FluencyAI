import json
from typing import Dict,Any

schema = {
  "score": 0,
  "ielts_band": 0.0,
  "cefr_level": "",
  "description": "",
  "key_metrics": {
    "grammar_accuracy": 0,
    "fluency": 0,
    "pacing": 0,
    "confidence": 0
  },
  "duration": "HH:MM:SS",
  "avg_pace": 0,
  "filler": {
    "total_count": 0,
    "detected": {}
  },
  "improvement_suggestions": [
    "User-spoken sentence\nImproved version"
  ],
  "grammar_corrections": [
    {
      "user_sentence": "",
      "corrected_sentence": "",
      "why_it_matters": ""
    }
  ],
  "vocabulary_enhancements": [
    {
      "original_word": "",
      "enhanced_word": ""
    }
  ]
}


def get_prompt(data:Dict[str,Any]):

  promp = f"""
  You are a professional English speech coach, linguist, and assessment evaluator.

  You will receive a speech transcript provided as a list of audio chunks.
  These chunks may contain partial sentences, repetition, or disfluencies.

  Your Tasks

  Reconstruct the speaker’s intended speech.

  Analyze spoken English quality objectively.

  Produce a detailed evaluation report following the exact JSON schema below.

  Evaluation Dimensions

  Analyze and score the speech for:

  Grammar accuracy

  Fluency

  Pacing (speech rate & pause control)

  Confidence (assertiveness & clarity)

  Vocabulary quality

  Use spoken English standards (not written English).
  Assume the speaker may be a non-native English speaker.

  Scoring Rules

  Overall score: 1–10

  Key metrics: 0–100 percentages

  IELTS Band: 0–9

  CEFR Level: A1–C2

  Pace measured in Words Per Minute (WPM)

  Duration formatted as HH:MM:SS

  Output Rules (STRICT)

  Return ONLY valid JSON

  No markdown, no comments, no explanations

  Follow the schema exactly

  Use actual user-spoken sentences where required
  REQUIRED JSON OUTPUT
  {json.dumps(schema)}

  Speech Transcript (Audio Chunks)
  {data}
  """

  return promp