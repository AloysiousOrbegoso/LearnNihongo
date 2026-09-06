export type SentenceTier = 'simple' | 'compound' | 'complex';

export type SlotCategory = 'noun' | 'adjective';

export interface SlotTemplate {
  id: string;
  correctCategories: readonly SlotCategory[];
  needsFlavor: boolean;
  jp: string;
  en: string;
}

export const SLOT_TEMPLATES: readonly SlotTemplate[] = [
  {
    id: 'wa-desu',
    correctCategories: ['noun', 'adjective'],
    needsFlavor: true,
    jp: '{flavor}は{choice}です。',
    en: '{flavor} is {choice}.',
  },
  {
    id: 'ga-suki',
    correctCategories: ['noun'],
    needsFlavor: false,
    jp: '{choice}が好きです。',
    en: 'I like {choice}.',
  },
];

export type ConnectorId =
  | 'te'
  | 'shi'
  | 'kedo'
  | 'kara'
  | 'node'
  | 'toki'
  | 'ba'
  | 'tara'
  | 'nara'
  | 'noni';

export interface ConnectorLesson {
  id: ConnectorId;
  label: string;
  tier: 'compound' | 'complex';
  explanation: string;
  example: string;
  exampleEnglish: string;
}

export interface ConnectorExercise {
  id: string;
  tier: 'compound' | 'complex';
  connector: ConnectorId;
  english: string;
  correct: string;
  decoys: string[];
}

export const CONNECTOR_LESSONS: readonly ConnectorLesson[] = [
  {
    id: 'te',
    label: 'て',
    tier: 'compound',
    explanation:
      'Links two actions in sequence, or shows how something is done. Casual and versatile — the most common way to connect verbs.',
    example: '朝ご飯を食べて、学校に行きます。',
    exampleEnglish: "I'll eat breakfast and go to school.",
  },
  {
    id: 'shi',
    label: 'し',
    tier: 'compound',
    explanation:
      "Lists multiple reasons or facts, implying \"and there's more.\" Often strung together before a conclusion.",
    example: '天気もいいし、暇だし、散歩しましょう。',
    exampleEnglish: "The weather is nice, and I'm free, so let's take a walk.",
  },
  {
    id: 'kedo',
    label: 'けど',
    tier: 'compound',
    explanation:
      'Connects two contrasting ideas, like "but." Casual and extremely common in spoken Japanese (が is the more formal equivalent).',
    example: '高いけど、買います。',
    exampleEnglish: "It's expensive, but I'll buy it.",
  },
  {
    id: 'kara',
    label: 'から',
    tier: 'complex',
    explanation:
      "Gives a reason from the speaker's own subjective point of view. Common when explaining a personal decision.",
    example: '疲れたから、休みます。',
    exampleEnglish: "I'm tired, so I'm going to rest.",
  },
  {
    id: 'node',
    label: 'ので',
    tier: 'complex',
    explanation:
      'Gives a reason more objectively and politely than から. Common in formal speech, or when the reason is a shared fact rather than just your opinion.',
    example: '今日は休みなので、店が閉まっています。',
    exampleEnglish: "Since it's a holiday today, the store is closed.",
  },
  {
    id: 'toki',
    label: 'とき',
    tier: 'complex',
    explanation: "Means \"when\" — marks a specific time or situation during which the main clause happens.",
    example: '子供のとき、大阪に住んでいました。',
    exampleEnglish: 'When I was a child, I lived in Osaka.',
  },
  {
    id: 'ba',
    label: 'ば',
    tier: 'complex',
    explanation:
      'A general or hypothetical "if" — focuses on the condition itself, often used for general truths or advice.',
    example: 'まっすぐ行けば、駅があります。',
    exampleEnglish: "If you go straight, you'll find the station.",
  },
  {
    id: 'tara',
    label: 'たら',
    tier: 'complex',
    explanation:
      'The most flexible "if/when" — works for hypothetical conditions and for sequential events ("once X happens, then Y").',
    example: '着いたら、電話します。',
    exampleEnglish: "Once I arrive, I'll call you.",
  },
  {
    id: 'nara',
    label: 'なら',
    tier: 'complex',
    explanation:
      'Means "if that\'s the case" — responds to something already mentioned or assumed, often used for suggestions.',
    example: '日本に行くなら、日本語を勉強したほうがいいです。',
    exampleEnglish: "If you're going to Japan, you should learn Japanese.",
  },
  {
    id: 'noni',
    label: 'のに',
    tier: 'complex',
    explanation:
      'Means "even though" or "despite that" — signals surprise, disappointment, or something contrary to expectation.',
    example: '一生懸命勉強したのに、落ちました。',
    exampleEnglish: 'Even though I studied hard, I failed.',
  },
];

export const CONNECTOR_EXERCISES: readonly ConnectorExercise[] = [
  // て
  {
    id: 'te-1',
    tier: 'compound',
    connector: 'te',
    english: "I'll eat breakfast and go to school.",
    correct: '朝ご飯を食べて、学校に行きます。',
    decoys: ['朝ご飯を食べるし、学校に行きます。', '朝ご飯を食べるけど、学校に行きます。', '朝ご飯を食べるなら、学校に行きます。'],
  },
  {
    id: 'te-2',
    tier: 'compound',
    connector: 'te',
    english: 'I woke up and brushed my teeth.',
    correct: '起きて、歯を磨きました。',
    decoys: ['起きたので、歯を磨きました。', '起きたから、歯を磨きました。', '起きたけど、歯を磨きました。'],
  },
  {
    id: 'te-3',
    tier: 'compound',
    connector: 'te',
    english: 'Please turn left and go straight.',
    correct: '左に曲がって、まっすぐ行ってください。',
    decoys: ['左に曲がるので、まっすぐ行ってください。', '左に曲がるし、まっすぐ行ってください。', '左に曲がったら、まっすぐ行ってください。'],
  },
  // し
  {
    id: 'shi-1',
    tier: 'compound',
    connector: 'shi',
    english: "The weather is nice, and I'm free, so let's take a walk.",
    correct: '天気もいいし、暇だし、散歩しましょう。',
    decoys: ['天気もいいけど、暇だし、散歩しましょう。', '天気もいいから、暇だし、散歩しましょう。', '天気もいいので、暇だし、散歩しましょう。'],
  },
  {
    id: 'shi-2',
    tier: 'compound',
    connector: 'shi',
    english: "This restaurant is cheap and delicious, so it's popular.",
    correct: 'この店は安いし、おいしいし、人気があります。',
    decoys: ['この店は安いから、おいしいし、人気があります。', 'この店は安いけど、おいしいし、人気があります。', 'この店は安いので、おいしいし、人気があります。'],
  },
  {
    id: 'shi-3',
    tier: 'compound',
    connector: 'shi',
    english: 'He is smart, and he is also kind.',
    correct: '彼は頭がいいし、優しいです。',
    decoys: ['彼は頭がいいから、優しいです。', '彼は頭がいいけど、優しいです。', '彼は頭がいいので、優しいです。'],
  },
  // けど
  {
    id: 'kedo-1',
    tier: 'compound',
    connector: 'kedo',
    english: "It's expensive, but I'll buy it.",
    correct: '高いけど、買います。',
    decoys: ['高いし、買います。', '高いから、買います。', '高いので、買います。'],
  },
  {
    id: 'kedo-2',
    tier: 'compound',
    connector: 'kedo',
    english: 'I studied hard, but I failed the test.',
    correct: '一生懸命勉強したけど、試験に落ちました。',
    decoys: ['一生懸命勉強したし、試験に落ちました。', '一生懸命勉強したから、試験に落ちました。', '一生懸命勉強したので、試験に落ちました。'],
  },
  {
    id: 'kedo-3',
    tier: 'compound',
    connector: 'kedo',
    english: "I want to go, but I don't have time.",
    correct: '行きたいけど、時間がありません。',
    decoys: ['行きたいし、時間がありません。', '行きたいから、時間がありません。', '行きたいので、時間がありません。'],
  },
  // から
  {
    id: 'kara-1',
    tier: 'complex',
    connector: 'kara',
    english: "I'm tired, so I'm going to rest.",
    correct: '疲れたから、休みます。',
    decoys: ['疲れたので、休みます。', '疲れたとき、休みます。', '疲れたら、休みます。'],
  },
  {
    id: 'kara-2',
    tier: 'complex',
    connector: 'kara',
    english: "Because it's raining, I won't go out.",
    correct: '雨が降っているから、出かけません。',
    decoys: ['雨が降っているので、出かけません。', '雨が降っているとき、出かけません。', '雨が降ったら、出かけません。'],
  },
  {
    id: 'kara-3',
    tier: 'complex',
    connector: 'kara',
    english: 'I like Japan, so I want to live here.',
    correct: '日本が好きだから、ここに住みたいです。',
    decoys: ['日本が好きなので、ここに住みたいです。', '日本が好きなら、ここに住みたいです。', '日本が好きだけど、ここに住みたいです。'],
  },
  // ので
  {
    id: 'node-1',
    tier: 'complex',
    connector: 'node',
    english: "Since it's a holiday today, the store is closed.",
    correct: '今日は休みなので、店が閉まっています。',
    decoys: ['今日は休みだから、店が閉まっています。', '今日は休みのとき、店が閉まっています。', '今日は休みなら、店が閉まっています。'],
  },
  {
    id: 'node-2',
    tier: 'complex',
    connector: 'node',
    english: 'Because I have a test tomorrow, I need to study.',
    correct: '明日試験があるので、勉強しなければなりません。',
    decoys: ['明日試験があるから、勉強しなければなりません。', '明日試験があるとき、勉強しなければなりません。', '明日試験があったら、勉強しなければなりません。'],
  },
  {
    id: 'node-3',
    tier: 'complex',
    connector: 'node',
    english: "Since he is busy, he can't come.",
    correct: '彼は忙しいので、来られません。',
    decoys: ['彼は忙しいから、来られません。', '彼は忙しいとき、来られません。', '彼は忙しいけど、来られません。'],
  },
  // とき
  {
    id: 'toki-1',
    tier: 'complex',
    connector: 'toki',
    english: 'When I was a child, I lived in Osaka.',
    correct: '子供のとき、大阪に住んでいました。',
    decoys: ['子供だから、大阪に住んでいました。', '子供なら、大阪に住んでいました。', '子供だけど、大阪に住んでいました。'],
  },
  {
    id: 'toki-2',
    tier: 'complex',
    connector: 'toki',
    english: 'When it rains, I stay home.',
    correct: '雨が降るとき、家にいます。',
    decoys: ['雨が降るから、家にいます。', '雨が降ったら、家にいます。', '雨が降るので、家にいます。'],
  },
  {
    id: 'toki-3',
    tier: 'complex',
    connector: 'toki',
    english: "When I'm free, I read books.",
    correct: '暇なとき、本を読みます。',
    decoys: ['暇だから、本を読みます。', '暇なら、本を読みます。', '暇だし、本を読みます。'],
  },
  // ば
  {
    id: 'ba-1',
    tier: 'complex',
    connector: 'ba',
    english: "If you go straight, you'll find the station.",
    correct: 'まっすぐ行けば、駅があります。',
    decoys: ['まっすぐ行ったら、駅があります。', 'まっすぐ行くなら、駅があります。', 'まっすぐ行くとき、駅があります。'],
  },
  {
    id: 'ba-2',
    tier: 'complex',
    connector: 'ba',
    english: "If it's cheap, I'll buy it.",
    correct: '安ければ、買います。',
    decoys: ['安かったら、買います。', '安いなら、買います。', '安いとき、買います。'],
  },
  {
    id: 'ba-3',
    tier: 'complex',
    connector: 'ba',
    english: "If you study, you'll pass.",
    correct: '勉強すれば、合格します。',
    decoys: ['勉強したら、合格します。', '勉強するなら、合格します。', '勉強するとき、合格します。'],
  },
  // たら
  {
    id: 'tara-1',
    tier: 'complex',
    connector: 'tara',
    english: "Once I arrive, I'll call you.",
    correct: '着いたら、電話します。',
    decoys: ['着けば、電話します。', '着くなら、電話します。', '着くとき、電話します。'],
  },
  {
    id: 'tara-2',
    tier: 'complex',
    connector: 'tara',
    english: 'Once it becomes summer, it gets hot.',
    correct: '夏になったら、暑くなります。',
    decoys: ['夏になれば、暑くなります。', '夏になるなら、暑くなります。', '夏になるとき、暑くなります。'],
  },
  {
    id: 'tara-3',
    tier: 'complex',
    connector: 'tara',
    english: 'If you have time, please come.',
    correct: '時間があったら、来てください。',
    decoys: ['時間があれば、来てください。', '時間があるなら、来てください。', '時間があるとき、来てください。'],
  },
  // なら
  {
    id: 'nara-1',
    tier: 'complex',
    connector: 'nara',
    english: "If you're going to Japan, you should learn Japanese.",
    correct: '日本に行くなら、日本語を勉強したほうがいいです。',
    decoys: [
      '日本に行けば、日本語を勉強したほうがいいです。',
      '日本に行ったら、日本語を勉強したほうがいいです。',
      '日本に行くとき、日本語を勉強したほうがいいです。',
    ],
  },
  {
    id: 'nara-2',
    tier: 'complex',
    connector: 'nara',
    english: 'If you like sushi, this restaurant is good.',
    correct: '寿司が好きなら、この店がいいです。',
    decoys: ['寿司が好きだから、この店がいいです。', '寿司が好きなので、この店がいいです。', '寿司が好きだけど、この店がいいです。'],
  },
  {
    id: 'nara-3',
    tier: 'complex',
    connector: 'nara',
    english: "If that's the case, I'll buy two.",
    correct: '安いなら、二つ買います。',
    decoys: ['安ければ、二つ買います。', '安かったら、二つ買います。', '安いので、二つ買います。'],
  },
  // のに
  {
    id: 'noni-1',
    tier: 'complex',
    connector: 'noni',
    english: 'Even though I studied hard, I failed.',
    correct: '一生懸命勉強したのに、落ちました。',
    decoys: ['一生懸命勉強したから、落ちました。', '一生懸命勉強したので、落ちました。', '一生懸命勉強したけど、落ちました。'],
  },
  {
    id: 'noni-2',
    tier: 'complex',
    connector: 'noni',
    english: "Even though it's expensive, it's not good quality.",
    correct: '高いのに、質がよくないです。',
    decoys: ['高いから、質がよくないです。', '高いので、質がよくないです。', '高いけど、質がよくないです。'],
  },
  {
    id: 'noni-3',
    tier: 'complex',
    connector: 'noni',
    english: 'Even though he is young, he is very wise.',
    correct: '彼は若いのに、とても賢いです。',
    decoys: ['彼は若いから、とても賢いです。', '彼は若いので、とても賢いです。', '彼は若いけど、とても賢いです。'],
  },
];

export function getConnectorLesson(id: ConnectorId): ConnectorLesson {
  const lesson = CONNECTOR_LESSONS.find((l) => l.id === id);
  if (!lesson) throw new Error(`Unknown connector: ${id}`);
  return lesson;
}

export function getConnectorsForTier(tier: 'compound' | 'complex'): readonly ConnectorLesson[] {
  return CONNECTOR_LESSONS.filter((l) => l.tier === tier);
}

export const SIMPLE_POINT_KEY = 'word-order';

export function pointKeysForTier(tier: SentenceTier): string[] {
  if (tier === 'simple') return [SIMPLE_POINT_KEY];
  return getConnectorsForTier(tier).map((l) => l.id);
}
