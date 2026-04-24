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
  ],
  "comprehensive_report_md": "# Overall Report\n... (detailed analysis string) ..."
}

def get_prompt(data: Dict[str, Any]):
  prompt = f"""
  You are a professional English speech coach and linguist.
  
  Analyze the provided speech transcript and return a detailed evaluation.
  
  TASKS:
  1. Fill out all technical fields in the schema (scores, metrics, corrections).
  2. Generate a `comprehensive_report_md`. This should be a full-length, formatted Markdown string that summarizes:
    - Overall performance & "vibe."
    - Overall score: 1–10
    - Key metrics: 0–100 percentages
    - CEFR Level: A1–C2
    - Strengths and specific weaknesses.
    - A combined table of grammar and vocabulary improvements.
    - A final "Path to Success" coaching paragraph.

  OUTPUT RULES (STRICT):
  - Return ONLY valid JSON.
  - No markdown blocks outside the JSON.
  - The `comprehensive_report_md` field must contain the entire formatted report as a single string.
  - Follow this schema exactly:
  
  {json.dumps(schema, indent=2)}

  Speech Transcript (Audio Chunks):
  {data}
  """
  return prompt