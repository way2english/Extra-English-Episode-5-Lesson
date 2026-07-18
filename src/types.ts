export interface Question {
  id: string;
  text: string;
  options: {
    value: string;
    text: string;
  }[];
  correctAnswer: string;
}

export interface AdjectiveWord {
  word: string;
  cat: 'food' | 'people' | 'both';
}

export interface PartOneEvent {
  id: string;
  text: string;
  correctAnswer: 'yes' | 'no';
}

export interface SummaryTF {
  id: string;
  text: string;
  correctAnswer: 'true' | 'false';
}

export interface DictionaryItem {
  word: string;
  translation: string;
  contextEn: string;
  contextUa: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'phrase';
}

export interface LessonState {
  currentTab: number;
  mcAnswers: Record<string, string>; // e.g. 'sofar-1': 'b'
  vocabAnswers: Record<string, 'food' | 'people' | 'both' | ''>;
  partOneAnswers: Record<string, 'yes' | 'no' | ''>;
  clozeAnswers: Record<string, string>; // 'cloze-gap1' -> value
  recipeAnswers: Record<string, string>; // 'recipe-r1' -> value
  summaryAnswers: Record<string, 'true' | 'false' | ''>;
  showFeedback: Record<string, boolean>; // active section feedback
}
