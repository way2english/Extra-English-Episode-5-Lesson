import { Question, AdjectiveWord, PartOneEvent, SummaryTF, DictionaryItem } from './types';

export const sofarQuestions: Question[] = [
  {
    id: 'sofar-1',
    text: "1. What is Nick's job?",
    options: [
      { value: 'a', text: "a) He's a waiter." },
      { value: 'b', text: "b) He's an actor." }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'sofar-2',
    text: "2. What is Hector's 'secret'?",
    options: [
      { value: 'a', text: "a) He's very rich." },
      { value: 'b', text: "b) He isn't from Argentina." }
    ],
    correctAnswer: 'a'
  },
  {
    id: 'sofar-3',
    text: "3. What do Hector's family own in Argentina?",
    options: [
      { value: 'a', text: "a) 200 cars." },
      { value: 'b', text: "b) 2 million cows." }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'sofar-4',
    text: "4. What did Hector buy for Annie and Bridget?",
    options: [
      { value: 'a', text: "a) Flowers." },
      { value: 'b', text: "b) New dresses." }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'sofar-5',
    text: "5. What did Bridget do at the end of the last episode?",
    options: [
      { value: 'a', text: "a) She quit her job." },
      { value: 'b', text: "b) She got a new job." }
    ],
    correctAnswer: 'a'
  }
];

export const adjectives: AdjectiveWord[] = [
  { word: 'adorable', cat: 'people' },
  { word: 'delicious', cat: 'food' },
  { word: 'smooth', cat: 'people' },
  { word: 'awful', cat: 'both' },
  { word: 'good-looking', cat: 'people' },
  { word: 'sweet', cat: 'both' },
  { word: 'busy', cat: 'people' },
  { word: 'gorgeous', cat: 'both' },
  { word: 'tired', cat: 'people' },
  { word: 'crazy', cat: 'people' },
  { word: 'hot', cat: 'both' }, // Correctly classified as both (applicable to food and people!)
  { word: 'wonderful', cat: 'both' }
];

export const culturalQuestions: Question[] = [
  {
    id: 'cult-1',
    text: "1. What is the FBI?",
    options: [
      { value: 'a', text: "a) A major business brand in New York." },
      { value: 'b', text: "b) An American crime investigation organisation." }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'cult-2',
    text: "2. Who or what are the Oscars?",
    options: [
      { value: 'a', text: "a) A classic American rock band." },
      { value: 'b', text: "b) Prestigious film industry awards." }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'cult-3',
    text: "3. Who is Stephen Spielberg?",
    options: [
      { value: 'a', text: "a) An extremely successful American film director." },
      { value: 'b', text: "b) A highly famous American film star." }
    ],
    correctAnswer: 'a'
  },
  {
    id: 'cult-4',
    text: "4. Who is Russell Crowe?",
    options: [
      { value: 'a', text: "a) An American television news presenter." },
      { value: 'b', text: "b) An Oscar-winning film actor." }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'cult-5',
    text: "5. What is Warner Brothers?",
    options: [
      { value: 'a', text: "a) One of the world's largest film and television studios." },
      { value: 'b', text: "b) A famous advertising agency in London." }
    ],
    correctAnswer: 'a'
  }
];

export const partOneEvents: PartOneEvent[] = [
  { id: 'ev-1', text: "1. Bridget and Annie are watching TV.", correctAnswer: 'yes' },
  { id: 'ev-2', text: "2. The phone rings. It's a call for someone called Rock Thrust.", correctAnswer: 'yes' },
  { id: 'ev-3', text: "3. Two real members of the FBI come into the flat to arrest the boys.", correctAnswer: 'no' },
  { id: 'ev-4', text: "4. Bridget gets angry and wants to be alone.", correctAnswer: 'yes' },
  { id: 'ev-5', text: "5. Nick reads his email and finds he's got an audition for a part.", correctAnswer: 'yes' },
  { id: 'ev-6', text: "6. Hector and Annie watch adverts on TV.", correctAnswer: 'yes' },
  { id: 'ev-7', text: "7. Nick actually goes to Hollywood and makes a speech after winning an Oscar.", correctAnswer: 'no' },
  { id: 'ev-8', text: "8. Hector makes some popcorn for Annie.", correctAnswer: 'yes' }
];

// Re-ordered to break up any predictable True/False alternating pattern
export const summaryQuestions: SummaryTF[] = [
  { id: 'tf-1', text: "1. Bridget gets angry because the flat is too noisy.", correctAnswer: 'true' },
  { id: 'tf-3', text: "2. Hector pretends to be a Hollywood executive.", correctAnswer: 'true' },
  { id: 'tf-2', text: "3. Nick gets a part in a Russell Crowe film.", correctAnswer: 'false' },
  { id: 'tf-4', text: "4. Annie advertises washing powder and dog food on television.", correctAnswer: 'false' },
  { id: 'tf-5', text: "5. Hector learns how to make chocolate mousse.", correctAnswer: 'true' },
  { id: 'tf-6', text: "6. Nick appears on the TV weather show.", correctAnswer: 'true' },
  { id: 'tf-7', text: "7. Nick does not make any mistakes on television.", correctAnswer: 'false' },
  { id: 'tf-8', text: "8. Women chase Nick home from the TV studio.", correctAnswer: 'true' }
];

export const dictionaryWords: DictionaryItem[] = [
  {
    word: "knock",
    translation: "стукати",
    contextEn: "Hector, you must knock before you enter!",
    contextUa: "Гекторе, ти повинен стукати перед тим як заходити!",
    partOfSpeech: "verb"
  },
  {
    word: "tummy",
    translation: "животик (неформально)",
    contextEn: "My tummy is empty, let's make some food!",
    contextUa: "Мій животик порожній, давай приготуємо щось поїсти!",
    partOfSpeech: "noun"
  },
  {
    word: "frying pan",
    translation: "сковорідка",
    contextEn: "Nick, holding a frying pan: 'Is this hot?'",
    contextUa: "Нік, тримаючи сковорідку: 'Вона гаряча?'",
    partOfSpeech: "noun"
  },
  {
    word: "the part",
    translation: "роль у фільмі",
    contextEn: "I've got an audition for a part!",
    contextUa: "У мене прослуховування на роль!",
    partOfSpeech: "noun"
  },
  {
    word: "dead Centurion",
    translation: "мертвий сотник",
    contextEn: "Nick plays the role of a dead Centurion in the play.",
    contextUa: "Нік грає роль мертвого сотника в п'єсі.",
    partOfSpeech: "noun"
  },
  {
    word: "15 million quid",
    translation: "15 мільйонів фунтів",
    contextEn: "This job on television will pay me 15 million quid!",
    contextUa: "Ця робота на телебаченні принесе мені 15 мільйонів фунтів!",
    partOfSpeech: "phrase"
  },
  {
    word: "yolk",
    translation: "жовток",
    contextEn: "Separate the yolk from the egg white.",
    contextUa: "Відокремте жовток від яєчного білка.",
    partOfSpeech: "noun"
  },
  {
    word: "magic whisk",
    translation: "чарівний віночок",
    contextEn: "You need a magic whisk to mix the chocolate mousse.",
    contextUa: "Тобі потрібен чарівний віночок, щоб змішати шоколадний мус.",
    partOfSpeech: "noun"
  },
  {
    word: "taste of paradise",
    translation: "смак раю",
    contextEn: "Our special recipe has the real taste of paradise!",
    contextUa: "Наш особливий рецепт має справжній смак раю!",
    partOfSpeech: "phrase"
  },
  {
    word: "chase",
    translation: "переслідувати, гнатися",
    contextEn: "A crowd of women chase Nick down the street.",
    contextUa: "Натовп жінок переслідує Ніка по вулиці.",
    partOfSpeech: "verb"
  },
  {
    word: "dustman",
    translation: "сміттяр",
    contextEn: "He was not a Hollywood producer, he was a dustman!",
    contextUa: "Він не був голлівудським продюсером, він був сміттярем!",
    partOfSpeech: "noun"
  },
  {
    word: "pretend to be",
    translation: "вдавати",
    contextEn: "Hector pretends to be a famous movie director.",
    contextUa: "Гектор вдає з себе відомого кінорежисера.",
    partOfSpeech: "verb"
  },
  {
    word: "stain",
    translation: "пляма",
    contextEn: "Look at this stain! This washing powder will get it out.",
    contextUa: "Поглянь на цю пляму! Цей пральний порошок виведе її.",
    partOfSpeech: "noun"
  },
  {
    word: "washing powder",
    translation: "пральний порошок",
    contextEn: "Annie gets a role advertising washing powder on TV.",
    contextUa: "Енні отримує роль у рекламі прального порошку на телебаченні.",
    partOfSpeech: "noun"
  }
];

export interface TeacherTip {
  title: string;
  points: string[];
}

export const teacherTips: Record<string, TeacherTip> = {
  warmup: {
    title: "Warm Up & Cultural Context Guidelines",
    points: [
      "Ask students to summarize what happened in Episode 4 from memory in English.",
      "Briefly discuss what the 'FBI' or the 'Oscars' are before starting. This activates background knowledge.",
      "Encourage students to guess Spielberg's or Russell Crowe's most famous movies."
    ]
  },
  vocabulary: {
    title: "Vocabulary and Adjectives Activities",
    points: [
      "Pronunciation check: Have students repeat adjectives like 'adorable', 'gorgeous', 'wonderful' out loud.",
      "Extension exercise: Ask students to form full sentences combining adjectives from different columns, e.g., 'This delicious cake is very hot!' or 'The gorgeous actor is busy.'",
      "Teacher Prompt: Discuss which adjectives are positive, negative, or neutral."
    ]
  },
  watching: {
    title: "Viewing Task: Watching Active Checkpoints",
    points: [
      "Instruct students to watch the video segment carefully, paying attention to body language and facial expressions.",
      "Check comprehension: Pause after key moments (like Bridget's reaction or the phone ringing) and ask: 'Why is she angry?', 'Who is Rock Thrust?'",
      "Encourage students to note down any additional interesting idioms or phrases they hear."
    ]
  },
  cloze: {
    title: "Dialogue & Grammar Practice Tips",
    points: [
      "Commercial Rehearsal: Have students act out Annie's TV commercial in front of the class, focusing on dramatic intonation and commercial enthusiasm.",
      "Imperatives & Process: Use the chocolate mousse recipe to teach transition signals (First, Second, Then, Finally) and the grammar of command verbs (Melt, Separate, Mix, Add).",
      "Real-life extension: Ask students if they have ever tried chocolate mousse and to name their favorite desserts."
    ]
  },
  review: {
    title: "Summary Review & Group Discussion Tasks",
    points: [
      "Post-watching: Ask students 'Is Nick really a star now? Why/Why not?'",
      "Debrief on television shows/news: Ask students if they would like to be on television or what role they would prefer (weather presenter, actor, etc.).",
      "Consolidation activity: Ask students to write 3 things they liked or found funny about this episode."
    ]
  }
};
