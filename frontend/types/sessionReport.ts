export interface TranscriptionSchema {
    start: number;
    end: number;
    time: number;
    text: string;
}


export interface VocabularyEnhancement {
    original_word: string;
    enhanced_word: string;
}

export interface GrammarCorrection {
    user_sentence: string;
    corrected_sentence: string;
    why_it_matters: string;
}

export interface FillerStats {
    total_count: number;
    detected: Record<string, number>;
}


export interface KeyMetric {
    grammar_accuracy: number;
    fluency: number;
    pacing: number;
    confidence: number;
}


export interface SessionReport {
    score: number;
    ielts_band: number;
    cefr_level: string;
    description: string;

    key_metrics: KeyMetric;

    duration: string; // "HH:MM:SS"
    avg_pace: number;

    filler: FillerStats;

    improvement_suggestions: string[];

    grammar_corrections: GrammarCorrection[];

    vocabulary_enhancements: VocabularyEnhancement[];
}


export interface SessionReportSchema {
    id: number;
    session_id: number;
    created_at: string;
    report: SessionReport;
    transcriptions: TranscriptionSchema[];
    audio_file: string,
    duration: number
}
