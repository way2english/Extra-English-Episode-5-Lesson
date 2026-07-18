import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Tv,
  BookOpen,
  Award,
  CheckCircle,
  XCircle,
  RotateCcw,
  Sparkles,
  Users,
  Eye,
  EyeOff,
  Check,
  ChevronRight,
  ChevronLeft,
  ChefHat,
  HelpCircle,
  GraduationCap,
  Volume2,
  Search,
  Book,
  ExternalLink,
  Play
} from 'lucide-react';
import {
  sofarQuestions,
  adjectives,
  culturalQuestions,
  partOneEvents,
  summaryQuestions,
  teacherTips,
  dictionaryWords
} from './lessonData';
import { LessonState } from './types';

export default function App() {
  // App states
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<'EN' | 'UA'>('EN');

  // Dictionary States
  const [dictSearch, setDictSearch] = useState<string>('');
  const [dictFilter, setDictFilter] = useState<string>('all');
  const [dictRevealed, setDictRevealed] = useState<Record<string, boolean>>({});
  const [isTestMode, setIsTestMode] = useState<boolean>(false);

  // Video source select state
  const [videoSource, setVideoSource] = useState<string>('03XBDC2HOw4');
  const [customVideoId, setCustomVideoId] = useState<string>('');

  // Interactive exercises answers
  const [mcAnswers, setMcAnswers] = useState<Record<string, string>>({});
  const [vocabAnswers, setVocabAnswers] = useState<Record<string, 'food' | 'people' | 'both' | ''>>(() => {
    const initial: Record<string, 'food' | 'people' | 'both' | ''> = {};
    adjectives.forEach((item) => {
      initial[item.word] = '';
    });
    return initial;
  });
  const [partOneAnswers, setPartOneAnswers] = useState<Record<string, 'yes' | 'no' | ''>>(() => {
    const initial: Record<string, 'yes' | 'no' | ''> = {};
    partOneEvents.forEach((item) => {
      initial[item.id] = '';
    });
    return initial;
  });
  const [clozeAnswers, setClozeAnswers] = useState<Record<string, string>>({
    'cloze-gap1': '',
    'cloze-gap2': '',
    'cloze-gap3': '',
    'cloze-gap4': '',
    'cloze-gap5': '',
    'cloze-gap6': '',
    'cloze-gap7': '',
  });
  const [recipeAnswers, setRecipeAnswers] = useState<Record<string, string>>({
    'recipe-r1': '',
    'recipe-r2': '',
    'recipe-r3': '',
    'recipe-r4': '',
    'recipe-r5': '',
  });
  const [summaryAnswers, setSummaryAnswers] = useState<Record<string, 'true' | 'false' | ''>>(() => {
    const initial: Record<string, 'true' | 'false' | ''> = {};
    summaryQuestions.forEach((item) => {
      initial[item.id] = '';
    });
    return initial;
  });

  // Track checked state per panel (for highlighting answers)
  const [checkedPanels, setCheckedPanels] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
  });

  // Score stats state
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [scoreBreakdown, setScoreBreakdown] = useState<Record<string, { score: number; max: number }> | null>(null);

  // Tabs labels
  const tabLabels = [
    { en: '1. Warm Up', ua: '1. Розминка' },
    { en: '2. Vocabulary', ua: '2. Лексика' },
    { en: '3. Watch Episode 5', ua: '3. Перегляд Серії 5' },
    { en: '4. Cloze Checks', ua: '4. Заповнення пропусків' },
    { en: '5. Review & Score', ua: '5. Підсумки та Оцінка' },
  ];

  // Auto scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Handle MC Answer choice selection
  const handleSelectMC = (questionId: string, choiceValue: string) => {
    if (checkedPanels[activeTab]) return; // locked after checking
    setMcAnswers((prev) => ({ ...prev, [questionId]: choiceValue }));
  };

  // Handle vocab click assignment
  const handleSelectVocab = (word: string, category: 'food' | 'people' | 'both') => {
    if (checkedPanels[activeTab]) return;
    setVocabAnswers((prev) => ({ ...prev, [word]: category }));
  };

  // Handle Yes/No Part 1 events
  const handleSelectPartOne = (id: string, value: 'yes' | 'no') => {
    if (checkedPanels[activeTab]) return;
    setPartOneAnswers((prev) => ({ ...prev, [id]: value }));
  };

  // Handle Cloze Select
  const handleClozeChange = (gapId: string, value: string) => {
    if (checkedPanels[activeTab]) return;
    setClozeAnswers((prev) => ({ ...prev, [gapId]: value }));
  };

  // Handle Recipe select
  const handleRecipeChange = (gapId: string, value: string) => {
    if (checkedPanels[activeTab]) return;
    setRecipeAnswers((prev) => ({ ...prev, [gapId]: value }));
  };

  // Handle T/F Summary
  const handleSelectSummary = (id: string, value: 'true' | 'false') => {
    if (checkedPanels[activeTab]) return;
    setSummaryAnswers((prev) => ({ ...prev, [id]: value }));
  };

  // Evaluate current tab score
  const evaluateTabScore = (tabIndex: number) => {
    let tabScore = 0;
    let tabMax = 0;

    if (tabIndex === 0) {
      // Warm up: 5 questions
      sofarQuestions.forEach((q) => {
        if (mcAnswers[q.id] === q.correctAnswer) tabScore++;
      });
      tabMax = sofarQuestions.length;
    } else if (tabIndex === 1) {
      // Adjectives (12) + Cultural terms (5)
      adjectives.forEach((item) => {
        if (vocabAnswers[item.word] === item.cat) tabScore++;
      });
      culturalQuestions.forEach((q) => {
        if (mcAnswers[q.id] === q.correctAnswer) tabScore++;
      });
      tabMax = adjectives.length + culturalQuestions.length;
    } else if (tabIndex === 2) {
      // Part 1 events (8)
      partOneEvents.forEach((ev) => {
        if (partOneAnswers[ev.id] === ev.correctAnswer) tabScore++;
      });
      tabMax = partOneEvents.length;
    } else if (tabIndex === 3) {
      // Rehearsal cloze (7) + Recipe (5)
      const correctCloze: Record<string, string> = {
        'cloze-gap1': 'mother',
        'cloze-gap2': 'stains',
        'cloze-gap3': 'help',
        'cloze-gap4': 'shirt',
        'cloze-gap5': 'shirt',
        'cloze-gap6': 'normal',
        'cloze-gap7': 'dirty',
      };
      Object.entries(correctCloze).forEach(([key, val]) => {
        if (clozeAnswers[key] === val) tabScore++;
      });

      const correctRecipe: Record<string, string> = {
        'recipe-r1': 'melt',
        'recipe-r2': 'separate',
        'recipe-r3': 'mix',
        'recipe-r4': 'add',
        'recipe-r5': 'add',
      };
      Object.entries(correctRecipe).forEach(([key, val]) => {
        if (recipeAnswers[key] === val) tabScore++;
      });

      tabMax = Object.keys(correctCloze).length + Object.keys(correctRecipe).length;
    } else if (tabIndex === 4) {
      // Summary questions T/F (8)
      summaryQuestions.forEach((q) => {
        if (summaryAnswers[q.id] === q.correctAnswer) tabScore++;
      });
      tabMax = summaryQuestions.length;
    }

    return { score: tabScore, max: tabMax };
  };

  // Trigger self-check for a tab
  const handleCheckSection = (tabIndex: number) => {
    setCheckedPanels((prev) => ({ ...prev, [tabIndex]: true }));
  };

  // Calculate full final grade and breakdown
  const handleCalculateTotalScore = () => {
    // Check all panels to show visual correct/incorrect guides
    setCheckedPanels({
      0: true,
      1: true,
      2: true,
      3: true,
      4: true,
    });

    const s0 = evaluateTabScore(0);
    const s1 = evaluateTabScore(1);
    const s2 = evaluateTabScore(2);
    const s3 = evaluateTabScore(3);
    const s4 = evaluateTabScore(4);

    const grandTotal = s0.score + s1.score + s2.score + s3.score + s4.score;
    const maxTotal = 50;

    setTotalScore(grandTotal);
    setScoreBreakdown({
      warmup: s0,
      vocab: s1,
      watching: s2,
      cloze: s3,
      review: s4,
    });
  };

  // Reset all student answers
  const handleResetAll = () => {
    setMcAnswers({});
    setVocabAnswers(() => {
      const initial: Record<string, 'food' | 'people' | 'both' | ''> = {};
      adjectives.forEach((item) => {
        initial[item.word] = '';
      });
      return initial;
    });
    setPartOneAnswers(() => {
      const initial: Record<string, 'yes' | 'no' | ''> = {};
      partOneEvents.forEach((item) => {
        initial[item.id] = '';
      });
      return initial;
    });
    setClozeAnswers({
      'cloze-gap1': '',
      'cloze-gap2': '',
      'cloze-gap3': '',
      'cloze-gap4': '',
      'cloze-gap5': '',
      'cloze-gap6': '',
      'cloze-gap7': '',
    });
    setRecipeAnswers({
      'recipe-r1': '',
      'recipe-r2': '',
      'recipe-r3': '',
      'recipe-r4': '',
      'recipe-r5': '',
    });
    setSummaryAnswers(() => {
      const initial: Record<string, 'true' | 'false' | ''> = {};
      summaryQuestions.forEach((item) => {
        initial[item.id] = '';
      });
      return initial;
    });
    setCheckedPanels({
      0: false,
      1: false,
      2: false,
      3: false,
      4: false,
    });
    setTotalScore(null);
    setScoreBreakdown(null);
    setActiveTab(0);
  };

  // Dynamic feedback and score calculations
  const totalPercent = totalScore !== null ? Math.round((totalScore / 50) * 100) : 0;

  const getEncouragement = () => {
    if (totalPercent >= 90) {
      return language === 'EN'
        ? "Amazing! You are a true extr@ English superstar! 🌟"
        : "Неймовірно! Ви справжня зірка англійської мови! 🌟";
    } else if (totalPercent >= 70) {
      return language === 'EN'
        ? "Well done! Great performance, you understand this episode very well. 🎬"
        : "Чудово! Хороший результат, ви дуже добре зрозуміли цю серію. 🎬";
    } else if (totalPercent >= 50) {
      return language === 'EN'
        ? "Good effort! Go over the incorrect answers and try watching parts of the episode again. 📺"
        : "Хороша спроба! Перегляньте помилки і спробуйте подивитися уривки відео ще раз. 📺";
    } else {
      return language === 'EN'
        ? "Keep practicing! Review the vocabulary lists and re-watch the episode to improve. 💪"
        : "Продовжуйте тренуватися! Повторіть лексику та перегляньте відео ще раз для кращого результату. 💪";
    }
  };

  const getSectionScoreText = (key: string) => {
    if (!scoreBreakdown) return '';
    const details = scoreBreakdown[key];
    return `${details.score} / ${details.max}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans flex flex-col justify-between pb-12">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-amber-400 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative background stars */}
        <div className="absolute top-4 left-4 text-orange-200/20 select-none animate-pulse pointer-events-none">
          <Sparkles size={120} />
        </div>
        <div className="absolute bottom-[-10px] right-12 text-amber-200/30 select-none pointer-events-none">
          <Tv size={160} />
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-amber-100 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-2">
                <Sparkles size={14} className="animate-spin-slow text-amber-200" />
                <span>ESL Video Companion</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                extr@ English
              </h1>
              <p className="text-lg text-amber-50 font-medium mt-1">
                {language === 'EN'
                  ? 'Episode 5: A Star is Born (Interactive Student Companion)'
                  : 'Серія 5: Народилася зірка (Інтерактивний урок для учня)'}
              </p>
            </div>

            {/* QUICK CONTROLS: LANG & TEACHER MODE */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Language Switcher */}
              <button
                id="btn-lang-toggle"
                onClick={() => setLanguage((l) => (l === 'EN' ? 'UA' : 'EN'))}
                className="bg-white/10 hover:bg-white/25 active:bg-white/35 text-white font-bold px-3 py-1.5 rounded-lg text-sm transition-colors border border-white/20 flex items-center gap-1.5"
                title="Toggle Language / Змінити мову"
              >
                <span>🌐 {language === 'EN' ? 'Українська' : 'English'}</span>
              </button>

              {/* Teacher View Switcher */}
              <button
                id="btn-teacher-mode-toggle"
                onClick={() => setIsTeacherMode(!isTeacherMode)}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold border flex items-center gap-2 transition-all ${
                  isTeacherMode
                    ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-sm'
                    : 'bg-white/10 hover:bg-white/25 border-white/20 text-white'
                }`}
              >
                <GraduationCap size={16} />
                <span>
                  {language === 'EN'
                    ? isTeacherMode
                      ? 'Teacher: ON'
                      : 'Teacher Mode'
                    : isTeacherMode
                    ? 'Вчитель: ТАК'
                    : 'Режим вчителя'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING SCORE STATS (IF ANY SCORES HAVE BEEN RECORDED) */}
      <div className="max-w-4xl mx-auto w-full px-4 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
              <Award size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {language === 'EN' ? 'Self-Check Tracker' : 'Показник самоперевірки'}
              </p>
              <h3 className="text-sm font-bold text-slate-700">
                {language === 'EN'
                  ? 'Track your progress section by section'
                  : 'Перевіряйте свій прогрес крок за кроком'}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-semibold text-slate-600">
            {tabLabels.map((_, idx) => {
              const checked = checkedPanels[idx];
              const scoreData = checked ? evaluateTabScore(idx) : null;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all ${
                    checked
                      ? scoreData?.score === scoreData?.max
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span>
                    Tab {idx + 1}:{' '}
                    {checked && scoreData
                      ? `${scoreData.score}/${scoreData.max}`
                      : language === 'EN'
                      ? 'Quiz'
                      : 'Тест'}
                  </span>
                  {checked &&
                    (scoreData?.score === scoreData?.max ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <span className="text-[10px] opacity-75">📝</span>
                    ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TEACHER INSTRUCTIONS GENERAL BANNER */}
      {isTeacherMode && (
        <div className="max-w-4xl mx-auto w-full px-4 mt-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5">
                <GraduationCap size={18} />
              </div>
              <div>
                <h4 className="font-bold text-amber-800 text-sm">
                  {language === 'EN'
                    ? "Teacher Guidelines Active 🧑‍🏫"
                    : "Рекомендації для вчителя активовані 🧑‍🏫"}
                </h4>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  {language === 'EN'
                    ? "You will now see yellow teaching suggestions, prompt hints, and highlighting for correct answers in each section. These correspond directly to the extr@ English Teacher's Book recommendations for Lesson 5. Share the screen during video playback or assign this link for self-guided study."
                    : "Тепер ви бачитимете жовті вказівки для викладача, підказки для обговорень та виділені правильні відповіді у кожному розділі. Вони відповідають рекомендаціям з Книги для вчителя до серії extr@ English (Урок 5). Поділіться екраном під час показу або надішліть посилання учням для самостійної роботи."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* MAIN LAYOUT */}
      <main className="max-w-4xl mx-auto w-full px-4 mt-6 flex-grow">
        {/* TABS COMPONENT */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 overflow-x-auto scrollbar-none gap-1 mb-6">
          {tabLabels.map((label, idx) => (
            <button
              key={idx}
              id={`tab-${idx}`}
              onClick={() => setActiveTab(idx)}
              className={`flex-1 min-w-[120px] text-center py-2.5 px-3 rounded-lg font-bold text-sm transition-all relative ${
                activeTab === idx
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-orange-500 hover:bg-slate-50'
              }`}
            >
              {language === 'EN' ? label.en : label.ua}
              {activeTab === idx && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-full mt-1 hidden md:block"
                />
              )}
            </button>
          ))}
        </div>

        {/* CURRENT TAB PANEL */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            {/* PANEL 1: WARM UP */}
            {activeTab === 0 && (
              <motion.div
                key="tab-0"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Section Teacher Tips Box */}
                {isTeacherMode && (
                  <div className="mb-6 bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
                    <h5 className="font-bold flex items-center gap-1.5 text-amber-900 mb-1.5">
                      <Users size={14} />
                      {teacherTips.warmup.title}
                    </h5>
                    <ul className="list-disc pl-4 space-y-1">
                      {teacherTips.warmup.points.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-xl md:text-2xl font-extrabold text-orange-600 flex items-center gap-2">
                    <BookOpen size={22} />
                    <span>{language === 'EN' ? 'So far in extr@...' : 'Раніше в extr@...'}</span>
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    {language === 'EN'
                      ? 'How much can you remember from previous episodes? Choose the correct options.'
                      : 'Скільки ви пам’ятаєте з попередніх серій? Оберіть правильні варіанти відповіді.'}
                  </p>
                </div>

                {/* Questions list */}
                <div className="space-y-6">
                  {sofarQuestions.map((q) => {
                    const studentAns = mcAnswers[q.id] || '';
                    const isChecked = checkedPanels[0];
                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isChecked
                            ? studentAns === q.correctAnswer
                              ? 'bg-emerald-50/50 border-emerald-200'
                              : studentAns
                              ? 'bg-rose-50/50 border-rose-200'
                              : 'bg-slate-50 border-slate-200'
                            : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <p className="font-bold text-slate-800 text-sm md:text-base">
                          {q.text}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                          {q.options.map((opt) => {
                            const isSelected = studentAns === opt.value;
                            const isCorrect = opt.value === q.correctAnswer;
                            const showCorrectHighlight = isTeacherMode || (isChecked && isCorrect);
                            const showWrongHighlight = isChecked && isSelected && !isCorrect;

                            return (
                              <button
                                key={opt.value}
                                onClick={() => handleSelectMC(q.id, opt.value)}
                                className={`text-left p-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between border ${
                                  isSelected
                                    ? 'bg-orange-50 border-orange-500 text-orange-950 font-semibold shadow-xs'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                } ${
                                  showCorrectHighlight
                                    ? '!bg-emerald-500 !border-emerald-600 !text-white'
                                    : ''
                                } ${
                                  showWrongHighlight
                                    ? '!bg-rose-500 !border-rose-600 !text-white'
                                    : ''
                                }`}
                              >
                                <span>{opt.text}</span>
                                {showCorrectHighlight && <CheckCircle size={16} className="text-white shrink-0" />}
                                {showWrongHighlight && <XCircle size={16} className="text-white shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Section Check Button */}
                <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button
                    onClick={() => handleCheckSection(0)}
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    <span>{language === 'EN' ? 'Check Section Answers' : 'Перевірити відповіді'}</span>
                  </button>

                  {checkedPanels[0] && (
                    <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 border border-slate-200">
                      <span>{language === 'EN' ? 'Score:' : 'Бал:'}</span>
                      <span className="text-orange-600 text-base">
                        {evaluateTabScore(0).score} / {evaluateTabScore(0).max}
                      </span>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="mt-12 pt-6 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setActiveTab(1)}
                    className="bg-slate-800 hover:bg-slate-700 active:bg-slate-950 text-white font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2"
                  >
                    <span>{language === 'EN' ? 'Next: Vocabulary' : 'Далі: Лексика'}</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* PANEL 2: VOCABULARY */}
            {activeTab === 1 && (
              <motion.div
                key="tab-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {isTeacherMode && (
                  <div className="mb-6 bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
                    <h5 className="font-bold flex items-center gap-1.5 text-amber-900 mb-1.5">
                      <Users size={14} />
                      {teacherTips.vocabulary.title}
                    </h5>
                    <ul className="list-disc pl-4 space-y-1">
                      {teacherTips.vocabulary.points.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 1. STUDENT VOCABULARY DICTIONARY (Bilingual & Interactive) */}
                <div className="mb-10 bg-white p-5 md:p-6 rounded-2xl border border-slate-200/60 shadow-xs">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl md:text-2xl font-extrabold text-orange-600 flex items-center gap-2">
                        <Book size={24} />
                        <span>{language === 'EN' ? 'Student Vocabulary Dictionary' : 'Словничок для учня'}</span>
                      </h2>
                      <p className="text-slate-500 text-sm mt-1">
                        {language === 'EN'
                          ? 'Study key words and phrases from Episode 5. Click the speaker 🔊 to hear native pronunciation!'
                          : 'Вивчайте ключові слова та фрази з 5-ї серії. Натисніть на динамік 🔊, щоб почути правильну вимову!'}
                      </p>
                    </div>

                    {/* Self-Test Mode Toggle */}
                    <button
                      onClick={() => setIsTestMode(!isTestMode)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 self-start md:self-auto ${
                        isTestMode
                          ? 'bg-orange-50 text-orange-700 border-orange-200 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>🧠 {language === 'EN' ? (isTestMode ? 'Test Mode: ON' : 'Self-Test Mode') : (isTestMode ? 'Режим тесту: ТАК' : 'Самоперевірка')}</span>
                    </button>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        placeholder={language === 'EN' ? "Search words or translation..." : "Пошук слова чи перекладу..."}
                        value={dictSearch}
                        onChange={(e) => setDictSearch(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:bg-white focus:border-orange-500 outline-none transition-all"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {(['all', 'noun', 'verb', 'phrase'] as const).map((filterOpt) => {
                        const isActive = dictFilter === filterOpt;
                        return (
                          <button
                            key={filterOpt}
                            onClick={() => setDictFilter(filterOpt)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all border ${
                              isActive
                                ? 'bg-slate-800 text-white border-slate-900 shadow-xs'
                                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {filterOpt === 'all'
                              ? (language === 'EN' ? 'All' : 'Всі')
                              : filterOpt === 'noun'
                              ? (language === 'EN' ? 'Nouns' : 'Іменники')
                              : filterOpt === 'verb'
                              ? (language === 'EN' ? 'Verbs' : 'Дієслова')
                              : (language === 'EN' ? 'Phrases' : 'Фрази')}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Word List Card Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dictionaryWords
                      .filter((item) => {
                        const matchesSearch = item.word.toLowerCase().includes(dictSearch.toLowerCase()) ||
                          item.translation.toLowerCase().includes(dictSearch.toLowerCase());
                        const matchesFilter = dictFilter === 'all' || item.partOfSpeech === dictFilter;
                        return matchesSearch && matchesFilter;
                      })
                      .map((item) => {
                        const isRevealed = !isTestMode || dictRevealed[item.word];
                        const speakWord = (text: string) => {
                          if ('speechSynthesis' in window) {
                            window.speechSynthesis.cancel();
                            const utterance = new SpeechSynthesisUtterance(text);
                            utterance.lang = 'en-US';
                            window.speechSynthesis.speak(utterance);
                          }
                        };

                        return (
                          <div
                            key={item.word}
                            className="bg-slate-50/40 p-4 rounded-xl border border-slate-200/50 flex flex-col justify-between transition-all hover:bg-slate-50 hover:border-slate-300 shadow-xs"
                          >
                            <div>
                              <div className="flex justify-between items-start gap-2 mb-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-extrabold text-slate-800 text-sm md:text-base font-mono tracking-tight">
                                    {item.word}
                                  </span>
                                  <span className="bg-slate-200/60 text-slate-500 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                                    {item.partOfSpeech === 'phrase' ? 'phrase' : item.partOfSpeech}
                                  </span>
                                </div>

                                <button
                                  onClick={() => speakWord(item.word)}
                                  className="p-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors flex items-center justify-center shrink-0"
                                  title="Listen pronunciation"
                                >
                                  <Volume2 size={13} />
                                </button>
                              </div>

                              {/* Translation text / hide button */}
                              <div className="min-h-[28px] mb-3">
                                {isRevealed ? (
                                  <span className="text-sm font-semibold text-slate-700">
                                    {item.translation}
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => setDictRevealed(prev => ({ ...prev, [item.word]: true }))}
                                    className="text-xs text-orange-500 font-bold hover:underline flex items-center gap-1"
                                  >
                                    <span>{language === 'EN' ? 'Reveal Translation 👁️' : 'Показати переклад 👁️'}</span>
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Sentence Context */}
                            <div className="border-t border-slate-200/60 pt-2 text-xs">
                              <p className="text-slate-600 font-medium italic">
                                "{item.contextEn}"
                              </p>
                              {isRevealed && (
                                <p className="text-slate-400 italic mt-0.5">
                                  "{item.contextUa}"
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* 2. ADJECTIVES CLASSIFICATION */}
                <div className="mb-10 pt-6 border-t border-slate-100">
                  <div className="mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
                      <GraduationCap className="text-orange-500" size={20} />
                      <span>{language === 'EN' ? 'Check the Meaning' : 'Перевірка значення слів'}</span>
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                      {language === 'EN'
                        ? 'What do these adjectives describe in this episode? Assign them to "Food", "People", or "Both".'
                        : 'Що саме описують ці прикметники у цій серії? Розподіліть їх між "Їжа" (Food), "Люди" (People) або "Обидва" (Both).'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                    {adjectives.map((item) => {
                      const studentChoice = vocabAnswers[item.word];
                      const isChecked = checkedPanels[1];
                      const isCorrect = studentChoice === item.cat;

                      return (
                        <div
                          key={item.word}
                          className={`bg-slate-50 p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                            isChecked
                              ? isCorrect
                                ? 'bg-emerald-50/50 border-emerald-300'
                                : 'bg-rose-50/50 border-rose-200'
                              : 'border-slate-100 hover:border-slate-200'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-slate-800 text-base capitalize">
                              {item.word}
                            </span>

                            {/* Correct indicator for student */}
                            {isChecked && (
                              <span>
                                {isCorrect ? (
                                  <span className="text-emerald-600 text-xs font-bold bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Check size={10} /> Correct
                                  </span>
                                ) : (
                                  <span className="text-rose-600 text-[10px] font-bold bg-rose-100 px-2 py-0.5 rounded-full">
                                    Correct: {item.cat}
                                  </span>
                                )}
                              </span>
                            )}

                            {/* Teacher Mode Answer Label */}
                            {!isChecked && isTeacherMode && (
                              <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                                {item.cat}
                              </span>
                            )}
                          </div>

                          {/* Interactive Click-to-Assign Categories */}
                          <div className="grid grid-cols-3 gap-1">
                            {(['food', 'people', 'both'] as const).map((catOption) => {
                              const isChosen = studentChoice === catOption;
                              let styleClass = 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200';

                              if (isChosen) {
                                if (catOption === 'food') {
                                  styleClass = 'bg-emerald-500 text-white border-emerald-600 font-bold';
                                } else if (catOption === 'people') {
                                  styleClass = 'bg-sky-500 text-white border-sky-600 font-bold';
                                } else if (catOption === 'both') {
                                  styleClass = 'bg-amber-500 text-white border-amber-600 font-bold';
                                }
                              }

                              return (
                                <button
                                  key={catOption}
                                  disabled={isChecked}
                                  onClick={() => handleSelectVocab(item.word, catOption)}
                                  className={`text-center py-1.5 px-1 text-xs rounded-lg transition-all border ${styleClass}`}
                                >
                                  {catOption === 'food' ? (
                                    language === 'EN' ? 'Food' : 'Їжа'
                                  ) : catOption === 'people' ? (
                                    language === 'EN' ? 'People' : 'Люди'
                                  ) : (
                                    language === 'EN' ? 'Both' : 'Обидва'
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. CULTURAL KNOWLEDGE MATCHING */}
                <div className="mb-6 pt-6 border-t border-slate-100">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="text-amber-500" size={18} />
                    <span>{language === 'EN' ? 'Before You Watch (Cultural Background)' : 'Перед переглядом (Культурний контекст)'}</span>
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">
                    {language === 'EN'
                      ? 'Match these cultural names and abbreviations mentioned in Episode 5 with their descriptions.'
                      : 'Узгодьте культурні назви та абревіатури, згадані у 5-й серії, з їхніми описами.'}
                  </p>
                </div>

                <div className="space-y-4">
                  {culturalQuestions.map((q) => {
                    const studentAns = mcAnswers[q.id] || '';
                    const isChecked = checkedPanels[1];
                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isChecked
                            ? studentAns === q.correctAnswer
                              ? 'bg-emerald-50/50 border-emerald-200'
                              : studentAns
                              ? 'bg-rose-50/50 border-rose-200'
                              : 'bg-slate-50 border-slate-200'
                            : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <p className="font-bold text-slate-800 text-sm md:text-base">
                          {q.text}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                          {q.options.map((opt) => {
                            const isSelected = studentAns === opt.value;
                            const isCorrect = opt.value === q.correctAnswer;
                            const showCorrectHighlight = isTeacherMode || (isChecked && isCorrect);
                            const showWrongHighlight = isChecked && isSelected && !isCorrect;

                            return (
                              <button
                                key={opt.value}
                                disabled={isChecked}
                                onClick={() => handleSelectMC(q.id, opt.value)}
                                className={`text-left p-3 rounded-lg text-xs md:text-sm font-medium transition-all flex items-center justify-between border ${
                                  isSelected
                                    ? 'bg-orange-50 border-orange-500 text-orange-950 font-semibold shadow-xs'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                } ${
                                  showCorrectHighlight
                                    ? '!bg-emerald-500 !border-emerald-600 !text-white'
                                    : ''
                                } ${
                                  showWrongHighlight
                                    ? '!bg-rose-500 !border-rose-600 !text-white'
                                    : ''
                                }`}
                              >
                                <span>{opt.text}</span>
                                {showCorrectHighlight && <CheckCircle size={14} className="text-white shrink-0" />}
                                {showWrongHighlight && <XCircle size={14} className="text-white shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Section Check Button */}
                <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button
                    onClick={() => handleCheckSection(1)}
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    <span>{language === 'EN' ? 'Check Section Answers' : 'Перевірити відповіді'}</span>
                  </button>

                  {checkedPanels[1] && (
                    <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 border border-slate-200">
                      <span>{language === 'EN' ? 'Score:' : 'Бал:'}</span>
                      <span className="text-orange-600 text-base">
                        {evaluateTabScore(1).score} / {evaluateTabScore(1).max}
                      </span>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="mt-12 pt-6 border-t border-slate-100 flex justify-between">
                  <button
                    onClick={() => setActiveTab(0)}
                    className="bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2"
                  >
                    <ChevronLeft size={16} />
                    <span>{language === 'EN' ? 'Back' : 'Назад'}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab(2)}
                    className="bg-slate-800 hover:bg-slate-700 active:bg-slate-950 text-white font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2"
                  >
                    <span>{language === 'EN' ? 'Next: Watch Video' : 'Далі: Дивитись відео'}</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* PANEL 3: PART ONE */}
            {activeTab === 2 && (
              <motion.div
                key="tab-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {isTeacherMode && (
                  <div className="mb-6 bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
                    <h5 className="font-bold flex items-center gap-1.5 text-amber-900 mb-1.5">
                      <Users size={14} />
                      {teacherTips.watching.title}
                    </h5>
                    <ul className="list-disc pl-4 space-y-1">
                      {teacherTips.watching.points.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-xl md:text-2xl font-extrabold text-orange-600 flex items-center gap-2">
                    <Tv size={22} />
                    <span>{language === 'EN' ? 'Watch Episode 5 & Check' : 'Перегляд Серії 5 та завдання'}</span>
                  </h2>
                  <p className="text-slate-500 text-sm mt-1 text-justify">
                    {language === 'EN'
                      ? 'Watch the full Episode 5 "A Star is Born" below. It contains three parts separated by "extr@!" screens. Then complete the key events checklist.'
                      : 'Перегляньте 5-ту серію "Народилася зірка" повністю нижче. Вона містить три частини, розділені заставками "extr@!". Далі виконайте завдання за сюжетом серії.'}
                  </p>
                </div>

                {/* YouTube Video Player Wrapper with Mirror Toggles */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200/60 mb-8 shadow-xs">
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-950">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${customVideoId.trim() || videoSource}`}
                      title="extr@ English Episode 5"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  {/* Video Source Switcher */}
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Sparkles size={12} className="text-orange-500 animate-pulse" />
                      {language === 'EN' ? '📺 Video Sources (Default is prepared)' : '📺 Джерела відео (Готово до перегляду)'}
                    </p>
                    <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { id: '03XBDC2HOw4', label: language === 'EN' ? 'Source 1 (Standard)' : 'Джерело 1 (Без субтитрів)' },
                          { id: 'T-nOhblp-xI', label: language === 'EN' ? 'Source 2 (Subtitles)' : 'Джерело 2 (З субтитрами)' },
                        ].map((src) => (
                          <button
                            key={src.id}
                            onClick={() => {
                              setVideoSource(src.id);
                              setCustomVideoId('');
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                              videoSource === src.id && !customVideoId
                                ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {src.label}
                          </button>
                        ))}
                      </div>

                      {/* Fallback Direct Link Helper */}
                      <a
                        href={`https://www.youtube.com/watch?v=${customVideoId.trim() || videoSource}`}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="text-xs font-bold text-orange-600 hover:text-orange-700 underline flex items-center gap-1 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100 transition-colors"
                      >
                        <ExternalLink size={12} />
                        <span>{language === 'EN' ? 'Open directly on YouTube' : 'Відкрити напряму на YouTube'}</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Yes/No Interactive Checklist */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {partOneEvents.map((ev) => {
                    const studentAns = partOneAnswers[ev.id];
                    const isChecked = checkedPanels[2];
                    const isCorrect = studentAns === ev.correctAnswer;

                    return (
                      <div
                        key={ev.id}
                        className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-all ${
                          isChecked
                            ? isCorrect
                              ? 'bg-emerald-50/50 border-emerald-200'
                              : 'bg-rose-50/50 border-rose-200'
                            : 'bg-white border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <span className="font-semibold text-slate-800 text-sm md:text-base">
                          {ev.text}
                        </span>

                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          {/* Teacher Answer label */}
                          {!isChecked && isTeacherMode && (
                            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded font-bold uppercase mr-2">
                              {ev.correctAnswer === 'yes' ? 'Yes' : 'No'}
                            </span>
                          )}

                          {/* YES BUTTON */}
                          <button
                            disabled={isChecked}
                            onClick={() => handleSelectPartOne(ev.id, 'yes')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                              studentAns === 'yes'
                                ? isChecked
                                  ? ev.correctAnswer === 'yes'
                                    ? 'bg-emerald-500 text-white border-emerald-600'
                                    : 'bg-rose-500 text-white border-rose-600'
                                  : 'bg-orange-500 text-white border-orange-600'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            } ${
                              isChecked && ev.correctAnswer === 'yes' && studentAns !== 'yes'
                                ? 'ring-2 ring-emerald-500 ring-offset-2'
                                : ''
                            }`}
                          >
                            {language === 'EN' ? 'Yes' : 'Так'}
                          </button>

                          {/* NO BUTTON */}
                          <button
                            disabled={isChecked}
                            onClick={() => handleSelectPartOne(ev.id, 'no')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                              studentAns === 'no'
                                ? isChecked
                                  ? ev.correctAnswer === 'no'
                                    ? 'bg-emerald-500 text-white border-emerald-600'
                                    : 'bg-rose-500 text-white border-rose-600'
                                  : 'bg-orange-500 text-white border-orange-600'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            } ${
                              isChecked && ev.correctAnswer === 'no' && studentAns !== 'no'
                                ? 'ring-2 ring-emerald-500 ring-offset-2'
                                : ''
                            }`}
                          >
                            {language === 'EN' ? 'No' : 'Ні'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Section Check Button */}
                <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button
                    onClick={() => handleCheckSection(2)}
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    <span>{language === 'EN' ? 'Check Section Answers' : 'Перевірити відповіді'}</span>
                  </button>

                  {checkedPanels[2] && (
                    <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 border border-slate-200">
                      <span>{language === 'EN' ? 'Score:' : 'Бал:'}</span>
                      <span className="text-orange-600 text-base">
                        {evaluateTabScore(2).score} / {evaluateTabScore(2).max}
                      </span>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="mt-12 pt-6 border-t border-slate-100 flex justify-between">
                  <button
                    onClick={() => setActiveTab(1)}
                    className="bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2"
                  >
                    <ChevronLeft size={16} />
                    <span>{language === 'EN' ? 'Back' : 'Назад'}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab(3)}
                    className="bg-slate-800 hover:bg-slate-700 active:bg-slate-950 text-white font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2"
                  >
                    <span>{language === 'EN' ? 'Next: Cloze Exercises' : 'Далі: Заповнення пропусків'}</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* PANEL 4: CLOZE CHECKS */}
            {activeTab === 3 && (
              <motion.div
                key="tab-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {isTeacherMode && (
                  <div className="mb-6 bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
                    <h5 className="font-bold flex items-center gap-1.5 text-amber-900 mb-1.5">
                      <Users size={14} />
                      {teacherTips.cloze.title}
                    </h5>
                    <ul className="list-disc pl-4 space-y-1">
                      {teacherTips.cloze.points.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-xl md:text-2xl font-extrabold text-orange-600 flex items-center gap-2">
                    <BookOpen size={22} />
                    <span>{language === 'EN' ? "Dialogue & Recipe Checks" : "Перевірка діалогів та рецептів"}</span>
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    {language === 'EN'
                      ? "Complete the script from Annie's commercial rehearsal, and Hector's Chocolate Mousse recipe instructions."
                      : "Заповніть пропуски у тексті репетиції реклами Енні та в інструкціях до рецепту шоколадного мусу Гектора."}
                  </p>
                </div>

                {/* Sub-Section 1: Annie's TV Rehearsal */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-3">
                    <Tv size={18} className="text-orange-500" />
                    <span>{language === 'EN' ? "Part Two: Annie's TV Ad Rehearsal" : "Частина 2: Репетиція телереклами Енні"}</span>
                  </h3>

                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 leading-loose text-slate-700 md:text-lg">
                    "Hello there. As a{' '}
                    <select
                      id="cloze-gap1"
                      value={clozeAnswers['cloze-gap1']}
                      onChange={(e) => handleClozeChange('cloze-gap1', e.target.value)}
                      disabled={checkedPanels[3]}
                      className={`font-semibold bg-white border px-2 py-1 rounded-lg text-sm md:text-base inline-block outline-none cursor-pointer transition-all ${
                        checkedPanels[3]
                          ? clozeAnswers['cloze-gap1'] === 'mother'
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                            : 'bg-rose-100 border-rose-300 text-rose-800'
                          : 'border-orange-200 text-orange-800 focus:border-orange-500'
                      }`}
                    >
                      <option value="">--choose--</option>
                      <option value="mother">mother</option>
                      <option value="brother">brother</option>
                    </select>{' '}
                    {isTeacherMode && <span className="text-xs text-amber-600 font-bold">(mother)</span>}
                    , I must fight different{' '}
                    <select
                      id="cloze-gap2"
                      value={clozeAnswers['cloze-gap2']}
                      onChange={(e) => handleClozeChange('cloze-gap2', e.target.value)}
                      disabled={checkedPanels[3]}
                      className={`font-semibold bg-white border px-2 py-1 rounded-lg text-sm md:text-base inline-block outline-none cursor-pointer transition-all ${
                        checkedPanels[3]
                          ? clozeAnswers['cloze-gap2'] === 'stains'
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                            : 'bg-rose-100 border-rose-300 text-rose-800'
                          : 'border-orange-200 text-orange-800 focus:border-orange-500'
                      }`}
                    >
                      <option value="">--choose--</option>
                      <option value="stains">stains</option>
                      <option value="trains">trains</option>
                    </select>{' '}
                    {isTeacherMode && <span className="text-xs text-amber-600 font-bold">(stains)</span>}
                    every day. Tomato ketchup. Chocolate – huh! Gravy. And egg. But{' '}
                    <select
                      id="cloze-gap3"
                      value={clozeAnswers['cloze-gap3']}
                      onChange={(e) => handleClozeChange('cloze-gap3', e.target.value)}
                      disabled={checkedPanels[3]}
                      className={`font-semibold bg-white border px-2 py-1 rounded-lg text-sm md:text-base inline-block outline-none cursor-pointer transition-all ${
                        checkedPanels[3]
                          ? clozeAnswers['cloze-gap3'] === 'help'
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                            : 'bg-rose-100 border-rose-300 text-rose-800'
                          : 'border-orange-200 text-orange-800 focus:border-orange-500'
                      }`}
                    >
                      <option value="">--choose--</option>
                      <option value="help">help</option>
                      <option value="hell">hell</option>
                    </select>{' '}
                    {isTeacherMode && <span className="text-xs text-amber-600 font-bold">(help)</span>}
                    is here! I will wash one{' '}
                    <select
                      id="cloze-gap4"
                      value={clozeAnswers['cloze-gap4']}
                      onChange={(e) => handleClozeChange('cloze-gap4', e.target.value)}
                      disabled={checkedPanels[3]}
                      className={`font-semibold bg-white border px-2 py-1 rounded-lg text-sm md:text-base inline-block outline-none cursor-pointer transition-all ${
                        checkedPanels[3]
                          ? clozeAnswers['cloze-gap4'] === 'shirt'
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                            : 'bg-rose-100 border-rose-300 text-rose-800'
                          : 'border-orange-200 text-orange-800 focus:border-orange-500'
                      }`}
                    >
                      <option value="">--choose--</option>
                      <option value="skirt">skirt</option>
                      <option value="shirt">shirt</option>
                    </select>{' '}
                    {isTeacherMode && <span className="text-xs text-amber-600 font-bold">(shirt)</span>}
                    in ordinary washing powder and the other in new Zap! So, the{' '}
                    <select
                      id="cloze-gap5"
                      value={clozeAnswers['cloze-gap5']}
                      onChange={(e) => handleClozeChange('cloze-gap5', e.target.value)}
                      disabled={checkedPanels[3]}
                      className={`font-semibold bg-white border px-2 py-1 rounded-lg text-sm md:text-base inline-block outline-none cursor-pointer transition-all ${
                        checkedPanels[3]
                          ? clozeAnswers['cloze-gap5'] === 'shirt'
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                            : 'bg-rose-100 border-rose-300 text-rose-800'
                          : 'border-orange-200 text-orange-800 focus:border-orange-500'
                      }`}
                    >
                      <option value="">--choose--</option>
                      <option value="skirt">skirt</option>
                      <option value="shirt">shirt</option>
                    </select>{' '}
                    {isTeacherMode && <span className="text-xs text-amber-600 font-bold">(shirt)</span>}
                    washed in{' '}
                    <select
                      id="cloze-gap6"
                      value={clozeAnswers['cloze-gap6']}
                      onChange={(e) => handleClozeChange('cloze-gap6', e.target.value)}
                      disabled={checkedPanels[3]}
                      className={`font-semibold bg-white border px-2 py-1 rounded-lg text-sm md:text-base inline-block outline-none cursor-pointer transition-all ${
                        checkedPanels[3]
                          ? clozeAnswers['cloze-gap6'] === 'normal'
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                            : 'bg-rose-100 border-rose-300 text-rose-800'
                          : 'border-orange-200 text-orange-800 focus:border-orange-500'
                      }`}
                    >
                      <option value="">--choose--</option>
                      <option value="normal">normal</option>
                      <option value="horrible">horrible</option>
                    </select>{' '}
                    {isTeacherMode && <span className="text-xs text-amber-600 font-bold">(normal)</span>}
                    washing powder is – oh! – still{' '}
                    <select
                      id="cloze-gap7"
                      value={clozeAnswers['cloze-gap7']}
                      onChange={(e) => handleClozeChange('cloze-gap7', e.target.value)}
                      disabled={checkedPanels[3]}
                      className={`font-semibold bg-white border px-2 py-1 rounded-lg text-sm md:text-base inline-block outline-none cursor-pointer transition-all ${
                        checkedPanels[3]
                          ? clozeAnswers['cloze-gap7'] === 'dirty'
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                            : 'bg-rose-100 border-rose-300 text-rose-800'
                          : 'border-orange-200 text-orange-800 focus:border-orange-500'
                      }`}
                    >
                      <option value="">--choose--</option>
                      <option value="dirty">dirty</option>
                      <option value="thirsty">thirsty</option>
                    </select>{' '}
                    {isTeacherMode && <span className="text-xs text-amber-600 font-bold">(dirty)</span>}
                    , but the shirt washed in new Zap is...\"
                  </div>
                </div>

                {/* Sub-Section 2: Chocolate Mousse Recipe */}
                <div className="mb-6 pt-6 border-t border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-3">
                    <ChefHat size={18} className="text-orange-500" />
                    <span>{language === 'EN' ? "Part Three: Chocolate Mousse Recipe" : "Частина 3: Рецепт шоколадного мусу"}</span>
                  </h3>

                  <div className="bg-amber-50/40 rounded-2xl border border-amber-100 p-6 space-y-4 md:text-lg">
                    <div>
                      1. First, take some chocolate.{' '}
                      <select
                        id="recipe-r1"
                        value={recipeAnswers['recipe-r1']}
                        onChange={(e) => handleRecipeChange('recipe-r1', e.target.value)}
                        disabled={checkedPanels[3]}
                        className={`font-semibold bg-white border px-2 py-1 rounded-lg text-sm outline-none cursor-pointer transition-all ${
                          checkedPanels[3]
                            ? recipeAnswers['recipe-r1'] === 'melt'
                              ? 'bg-emerald-100 border-emerald-400 text-emerald-800 font-bold'
                              : 'bg-rose-100 border-rose-300 text-rose-800'
                            : 'border-amber-300 focus:border-amber-500'
                        }`}
                      >
                        <option value="">--choose--</option>
                        <option value="melt">Melt</option>
                        <option value="mix">Mix</option>
                      </select>{' '}
                      {isTeacherMode && <span className="text-xs text-amber-600 font-bold">(Melt)</span>} it over hot water.
                    </div>

                    <div>
                      2.{' '}
                      <select
                        id="recipe-r2"
                        value={recipeAnswers['recipe-r2']}
                        onChange={(e) => handleRecipeChange('recipe-r2', e.target.value)}
                        disabled={checkedPanels[3]}
                        className={`font-semibold bg-white border px-2 py-1 rounded-lg text-sm outline-none cursor-pointer transition-all ${
                          checkedPanels[3]
                            ? recipeAnswers['recipe-r2'] === 'separate'
                              ? 'bg-emerald-100 border-emerald-400 text-emerald-800 font-bold'
                              : 'bg-rose-100 border-rose-300 text-rose-800'
                            : 'border-amber-300 focus:border-amber-500'
                        }`}
                      >
                        <option value="">--choose--</option>
                        <option value="separate">Separate</option>
                        <option value="add">Add</option>
                      </select>{' '}
                      {isTeacherMode && <span className="text-xs text-amber-600 font-bold">(Separate)</span>} the yolk of the egg from the white.
                    </div>

                    <div>
                      3.{' '}
                      <select
                        id="recipe-r3"
                        value={recipeAnswers['recipe-r3']}
                        onChange={(e) => handleRecipeChange('recipe-r3', e.target.value)}
                        disabled={checkedPanels[3]}
                        className={`font-semibold bg-white border px-2 py-1 rounded-lg text-sm outline-none cursor-pointer transition-all ${
                          checkedPanels[3]
                            ? recipeAnswers['recipe-r3'] === 'mix'
                              ? 'bg-emerald-100 border-emerald-400 text-emerald-800 font-bold'
                              : 'bg-rose-100 border-rose-300 text-rose-800'
                            : 'border-amber-300 focus:border-amber-500'
                        }`}
                      >
                        <option value="">--choose--</option>
                        <option value="add">Add</option>
                        <option value="mix">Mix</option>
                      </select>{' '}
                      {isTeacherMode && <span className="text-xs text-amber-600 font-bold">(Mix)</span>} the egg yolk and the chocolate.
                    </div>

                    <div>
                      4.{' '}
                      <select
                        id="recipe-r4"
                        value={recipeAnswers['recipe-r4']}
                        onChange={(e) => handleRecipeChange('recipe-r4', e.target.value)}
                        disabled={checkedPanels[3]}
                        className={`font-semibold bg-white border px-2 py-1 rounded-lg text-sm outline-none cursor-pointer transition-all ${
                          checkedPanels[3]
                            ? recipeAnswers['recipe-r4'] === 'add'
                              ? 'bg-emerald-100 border-emerald-400 text-emerald-800 font-bold'
                              : 'bg-rose-100 border-rose-300 text-rose-800'
                            : 'border-amber-300 focus:border-amber-500'
                        }`}
                      >
                        <option value="">--choose--</option>
                        <option value="add">Add</option>
                        <option value="separate">Separate</option>
                      </select>{' '}
                      {isTeacherMode && <span className="text-xs text-amber-600 font-bold">(Add)</span>} the butter.
                    </div>

                    <div>
                      5.{' '}
                      <select
                        id="recipe-r5"
                        value={recipeAnswers['recipe-r5']}
                        onChange={(e) => handleRecipeChange('recipe-r5', e.target.value)}
                        disabled={checkedPanels[3]}
                        className={`font-semibold bg-white border px-2 py-1 rounded-lg text-sm outline-none cursor-pointer transition-all ${
                          checkedPanels[3]
                            ? recipeAnswers['recipe-r5'] === 'add'
                              ? 'bg-emerald-100 border-emerald-400 text-emerald-800 font-bold'
                              : 'bg-rose-100 border-rose-300 text-rose-800'
                            : 'border-amber-300 focus:border-amber-500'
                        }`}
                      >
                        <option value="">--choose--</option>
                        <option value="add">Add</option>
                        <option value="melt">Melt</option>
                      </select>{' '}
                      {isTeacherMode && <span className="text-xs text-amber-600 font-bold">(Add)</span>} the whites to the chocolate and put it in the fridge.
                    </div>
                  </div>
                </div>

                {/* Section Check Button */}
                <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button
                    onClick={() => handleCheckSection(3)}
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    <span>{language === 'EN' ? 'Check Section Answers' : 'Перевірити відповіді'}</span>
                  </button>

                  {checkedPanels[3] && (
                    <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 border border-slate-200">
                      <span>{language === 'EN' ? 'Score:' : 'Бал:'}</span>
                      <span className="text-orange-600 text-base">
                        {evaluateTabScore(3).score} / {evaluateTabScore(3).max}
                      </span>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="mt-12 pt-6 border-t border-slate-100 flex justify-between">
                  <button
                    onClick={() => setActiveTab(2)}
                    className="bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2"
                  >
                    <ChevronLeft size={16} />
                    <span>{language === 'EN' ? 'Back' : 'Назад'}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab(4)}
                    className="bg-slate-800 hover:bg-slate-700 active:bg-slate-950 text-white font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2"
                  >
                    <span>{language === 'EN' ? 'Next: Review & Score' : 'Далі: Підсумки та Оцінка'}</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* PANEL 5: REVIEW & SCORE */}
            {activeTab === 4 && (
              <motion.div
                key="tab-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {isTeacherMode && (
                  <div className="mb-6 bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
                    <h5 className="font-bold flex items-center gap-1.5 text-amber-900 mb-1.5">
                      <Users size={14} />
                      {teacherTips.review.title}
                    </h5>
                    <ul className="list-disc pl-4 space-y-1">
                      {teacherTips.review.points.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-xl md:text-2xl font-extrabold text-orange-600 flex items-center gap-2">
                    <Award size={22} />
                    <span>{language === 'EN' ? 'Episode Summary Check' : 'Перевірка знання сюжету серії'}</span>
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    {language === 'EN'
                      ? 'Read the statements about Episode 5. Select "True" or "False".'
                      : 'Прочитайте твердження про 5-ту серію. Оберіть "True" (Правда) чи "False" (Неправда).'}
                  </p>
                </div>

                {/* True/False Statements Checklist */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {summaryQuestions.map((q) => {
                    const studentAns = summaryAnswers[q.id];
                    const isChecked = checkedPanels[4];
                    const isCorrect = studentAns === q.correctAnswer;

                    return (
                      <div
                        key={q.id}
                        className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-all ${
                          isChecked
                            ? isCorrect
                              ? 'bg-emerald-50/50 border-emerald-200'
                              : 'bg-rose-50/50 border-rose-200'
                            : 'bg-white border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <span className="font-semibold text-slate-800 text-sm md:text-base">
                          {q.text}
                        </span>

                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          {/* Teacher Mode Hint */}
                          {!isChecked && isTeacherMode && (
                            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded font-bold uppercase mr-2">
                              {q.correctAnswer === 'true' ? 'True' : 'False'}
                            </span>
                          )}

                          {/* TRUE BUTTON */}
                          <button
                            onClick={() => handleSelectSummary(q.id, 'true')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                              studentAns === 'true'
                                ? isChecked
                                  ? q.correctAnswer === 'true'
                                    ? 'bg-emerald-500 text-white border-emerald-600'
                                    : 'bg-rose-500 text-white border-rose-600'
                                  : 'bg-orange-500 text-white border-orange-600'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            } ${
                              isChecked && q.correctAnswer === 'true' && studentAns !== 'true'
                                ? 'ring-2 ring-emerald-500 ring-offset-2'
                                : ''
                            }`}
                          >
                            True
                          </button>

                          {/* FALSE BUTTON */}
                          <button
                            onClick={() => handleSelectSummary(q.id, 'false')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                              studentAns === 'false'
                                ? isChecked
                                  ? q.correctAnswer === 'false'
                                    ? 'bg-emerald-500 text-white border-emerald-600'
                                    : 'bg-rose-500 text-white border-rose-600'
                                  : 'bg-orange-500 text-white border-orange-600'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            } ${
                              isChecked && q.correctAnswer === 'false' && studentAns !== 'false'
                                ? 'ring-2 ring-emerald-500 ring-offset-2'
                                : ''
                            }`}
                          >
                            False
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Check Button for Section */}
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button
                    onClick={() => handleCheckSection(4)}
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    <span>{language === 'EN' ? 'Check Section Answers' : 'Перевірити відповіді'}</span>
                  </button>

                  {checkedPanels[4] && (
                    <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 border border-slate-200">
                      <span>{language === 'EN' ? 'Score:' : 'Бал:'}</span>
                      <span className="text-orange-600 text-base">
                        {evaluateTabScore(4).score} / {evaluateTabScore(4).max}
                      </span>
                    </div>
                  )}
                </div>

                {/* DIVIDER */}
                <hr className="my-10 border-slate-200" />

                {/* GLOBAL SCORE REPORT GAUGE */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-center shadow-inner max-w-lg mx-auto">
                  <h3 className="text-xl font-bold text-slate-800">
                    {language === 'EN' ? 'Calculate Your Performance Grade' : 'Дізнатися фінальну оцінку'}
                  </h3>
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mt-1">
                    {language === 'EN' ? 'Checks all 5 sections simultaneously' : 'Оцінює всі 5 розділів одночасно'}
                  </p>

                  <button
                    onClick={handleCalculateTotalScore}
                    className="mt-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold px-8 py-4 rounded-2xl transition-all shadow-md hover:shadow-lg transform active:scale-[0.98] flex items-center gap-2.5 mx-auto text-base"
                  >
                    <Award size={20} />
                    <span>{language === 'EN' ? 'Get Final Results Score' : 'Порахувати загальний результат'}</span>
                  </button>

                  {totalScore !== null && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', damping: 12 }}
                      className="mt-6"
                    >
                      <div className="text-5xl md:text-6xl font-black text-orange-600 tracking-tight my-2">
                        {totalScore} <span className="text-slate-300 text-3xl font-bold">/ 50</span>
                      </div>

                      <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden mt-3 shadow-xs">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${totalPercent}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="bg-gradient-to-r from-orange-500 to-emerald-500 h-full rounded-full"
                        />
                      </div>

                      <p className="text-xs text-slate-400 font-bold text-right mt-1.5">
                        {totalPercent}% {language === 'EN' ? 'Completed' : 'Виконано'}
                      </p>

                      {/* Grade Badge */}
                      <div className="mt-4 inline-block px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-xs">
                        <p className="text-lg font-bold text-slate-800 italic leading-snug">
                          {getEncouragement()}
                        </p>
                      </div>

                      {/* SECTION BREAKDOWNS LIST */}
                      <div className="mt-6 pt-5 border-t border-slate-200/60 text-left text-xs text-slate-600 space-y-2">
                        <h4 className="font-bold text-slate-700 text-sm mb-3 text-center">
                          {language === 'EN' ? 'Points Breakdown:' : 'Деталізація балів за розділами:'}
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between bg-white p-2.5 rounded-xl border border-slate-100">
                            <span className="font-medium">1. Warm Up:</span>
                            <span className="font-bold text-orange-600">{getSectionScoreText('warmup')}</span>
                          </div>
                          <div className="flex justify-between bg-white p-2.5 rounded-xl border border-slate-100">
                            <span className="font-medium">2. Vocabulary:</span>
                            <span className="font-bold text-orange-600">{getSectionScoreText('vocab')}</span>
                          </div>
                          <div className="flex justify-between bg-white p-2.5 rounded-xl border border-slate-100">
                            <span className="font-medium">3. Part One watch:</span>
                            <span className="font-bold text-orange-600">{getSectionScoreText('watching')}</span>
                          </div>
                          <div className="flex justify-between bg-white p-2.5 rounded-xl border border-slate-100">
                            <span className="font-medium">4. Cloze checks:</span>
                            <span className="font-bold text-orange-600">{getSectionScoreText('cloze')}</span>
                          </div>
                          <div className="col-span-2 flex justify-between bg-white p-2.5 rounded-xl border border-slate-100">
                            <span className="font-medium">5. Summary T/F:</span>
                            <span className="font-bold text-orange-600">{getSectionScoreText('review')}</span>
                          </div>
                        </div>

                        {/* Restart Button */}
                        <button
                          onClick={handleResetAll}
                          className="w-full mt-6 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold py-2.5 rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <RotateCcw size={14} />
                          <span>{language === 'EN' ? 'Reset Lesson & Start Over' : 'Очистити результати та почати заново'}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Navigation */}
                <div className="mt-12 pt-6 border-t border-slate-100 flex justify-between">
                  <button
                    onClick={() => setActiveTab(3)}
                    className="bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2"
                  >
                    <ChevronLeft size={16} />
                    <span>{language === 'EN' ? 'Back' : 'Назад'}</span>
                  </button>

                  <div></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="max-w-4xl mx-auto w-full px-4 mt-12 text-center text-xs text-slate-400">
        <p>
          extr@ English ESL Interactive Learning Companion • Episode 5: A Star is Born.
        </p>
        <p className="mt-1">
          Developed in full compliance with the Teacher's Guide recommendations. Fully free, no registration required, accessible offline & on touch devices.
        </p>
      </footer>
    </div>
  );
}
