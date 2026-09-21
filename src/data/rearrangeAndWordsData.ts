import { RearrangeItem, ChangingWordItem, TranslationItem } from '../types/englishCare';

export const BOOSTER_REARRANGEMENTS: RearrangeItem[] = [
  {
    id: 're_1',
    number: 1,
    scrambled: 'a diamond is piece of education',
    tokens: ['Education', 'is', 'a', 'piece', 'of', 'diamond.'],
    correctSentence: 'Education is a piece of diamond.'
  },
  {
    id: 're_2',
    number: 2,
    scrambled: 'aim life in have everybody an should',
    tokens: ['Everybody', 'should', 'have', 'an', 'aim', 'in', 'life.'],
    correctSentence: 'Everybody should have an aim in life.'
  },
  {
    id: 're_3',
    number: 3,
    scrambled: 'and frugal was he industrious life in his',
    tokens: ['He', 'was', 'industrious', 'and', 'frugal', 'in', 'his', 'life.'],
    correctSentence: 'He was industrious and frugal in his life.'
  },
  {
    id: 're_4',
    number: 4,
    scrambled: 'are I who know you',
    tokens: ['I', 'know', 'who', 'you', 'are.'],
    correctSentence: 'I know who you are.'
  },
  {
    id: 're_5',
    number: 5,
    scrambled: 'as people king consider him',
    tokens: ['People', 'consider', 'him', 'as', 'king.'],
    correctSentence: 'People consider him as king.'
  },
  {
    id: 're_6',
    number: 6,
    scrambled: 'aunt lived with she her',
    tokens: ['She', 'lived', 'with', 'her', 'aunt.'],
    correctSentence: 'She lived with her aunt.'
  },
  {
    id: 're_7',
    number: 7,
    scrambled: 'barking seldom bites a dog',
    tokens: ['A', 'barking', 'dog', 'seldom', 'bites.'],
    correctSentence: 'A barking dog seldom bites.'
  },
  {
    id: 're_8',
    number: 8,
    scrambled: 'company a multinational in he works',
    tokens: ['He', 'works', 'in', 'a', 'multinational', 'company.'],
    correctSentence: 'He works in a multinational company.'
  },
  {
    id: 're_9',
    number: 9,
    scrambled: 'dancing away the went girl',
    tokens: ['The', 'girl', 'went', 'away', 'dancing.'],
    correctSentence: 'The girl went away dancing.'
  },
  {
    id: 're_10',
    number: 10,
    scrambled: 'digital country our make to have we',
    tokens: ['We', 'have', 'to', 'make', 'our', 'country', 'digital.'],
    correctSentence: 'We have to make our country digital.'
  },
  {
    id: 're_11',
    number: 11,
    scrambled: 'do he accordingly should duty his',
    tokens: ['He', 'should', 'do', 'his', 'duty', 'accordingly.'],
    correctSentence: 'He should do his duty accordingly.'
  },
  {
    id: 're_12',
    number: 12,
    scrambled: 'duties not we neglect should our',
    tokens: ['We', 'should', 'not', 'neglect', 'our', 'duties.'],
    correctSentence: 'We should not neglect our duties.'
  },
  {
    id: 're_13',
    number: 13,
    scrambled: 'fair is foul is foul fair',
    tokens: ['Fair', 'is', 'foul,', 'foul', 'is', 'fair.'],
    correctSentence: 'Fair is foul, foul is fair.'
  },
  {
    id: 're_14',
    number: 14,
    scrambled: 'fish a good rivers source also are of',
    tokens: ['Rivers', 'are', 'also', 'a', 'good', 'source', 'of', 'fish.'],
    correctSentence: 'Rivers are also a good source of fish.'
  },
  {
    id: 're_15',
    number: 15,
    scrambled: 'going he my insisted on to Sylhet',
    tokens: ['He', 'insisted', 'on', 'my', 'going', 'to', 'Sylhet.'],
    correctSentence: 'He insisted on my going to Sylhet.'
  },
  {
    id: 're_16',
    number: 16,
    scrambled: 'gold not is all glitters that',
    tokens: ['All', 'that', 'glitters', 'is', 'not', 'gold.'],
    correctSentence: 'All that glitters is not gold.'
  },
  {
    id: 're_17',
    number: 17,
    scrambled: 'golden Bangladesh is called of jute the fiber',
    tokens: ['Jute', 'is', 'called', 'the', 'golden', 'fiber', 'of', 'Bangladesh.'],
    correctSentence: 'Jute is called the golden fiber of Bangladesh.'
  },
  {
    id: 're_18',
    number: 18,
    scrambled: 'good vegetables for green are health',
    tokens: ['Green', 'vegetables', 'are', 'good', 'for', 'health.'],
    correctSentence: 'Green vegetables are good for health.'
  },
  {
    id: 're_19',
    number: 19,
    scrambled: 'got 1971 Bangladesh in her independence',
    tokens: ['Bangladesh', 'got', 'her', 'independence', 'in', '1971.'],
    correctSentence: 'Bangladesh got her independence in 1971.'
  },
  {
    id: 're_20',
    number: 20,
    scrambled: 'him everybody satisfied with was',
    tokens: ['Everybody', 'was', 'satisfied', 'with', 'him.'],
    correctSentence: 'Everybody was satisfied with him.'
  },
  {
    id: 're_21',
    number: 21,
    scrambled: 'is Bangladesh land a rivers of',
    tokens: ['Bangladesh', 'is', 'a', 'land', 'of', 'rivers.'],
    correctSentence: 'Bangladesh is a land of rivers.'
  },
  {
    id: 're_22',
    number: 22,
    scrambled: 'is for famous Rajshahi what',
    tokens: ['What', 'is', 'Rajshahi', 'famous', 'for?'],
    correctSentence: 'What is Rajshahi famous for?'
  },
  {
    id: 're_23',
    number: 23,
    scrambled: 'is habit excellent reading an books',
    tokens: ['Reading', 'books', 'is', 'an', 'excellent', 'habit.'],
    correctSentence: 'Reading books is an excellent habit.'
  },
  {
    id: 're_24',
    number: 24,
    scrambled: 'is key success the to industry',
    tokens: ['Industry', 'is', 'the', 'key', 'to', 'success.'],
    correctSentence: 'Industry is the key to success.'
  },
  {
    id: 're_25',
    number: 25,
    scrambled: 'life is his the man of architect own',
    tokens: ['Man', 'is', 'the', 'architect', 'of', 'his', 'own', 'life.'],
    correctSentence: 'Man is the architect of his own life.'
  },
  {
    id: 're_26',
    number: 26,
    scrambled: 'mother every her child loves',
    tokens: ['Every', 'mother', 'loves', 'her', 'child.'],
    correctSentence: 'Every mother loves her child.'
  },
  {
    id: 're_27',
    number: 27,
    scrambled: 'our of country hot climate is the',
    tokens: ['The', 'climate', 'of', 'our', 'country', 'is', 'hot.'],
    correctSentence: 'The climate of our country is hot.'
  },
  {
    id: 're_28',
    number: 28,
    scrambled: 'the fortune brave favours',
    tokens: ['Fortune', 'favours', 'the', 'brave.'],
    correctSentence: 'Fortune favours the brave.'
  },
  {
    id: 're_29',
    number: 29,
    scrambled: 'stay until here come I',
    tokens: ['Stay', 'here', 'until', 'I', 'come.'],
    correctSentence: 'Stay here until I come.'
  },
  {
    id: 're_30',
    number: 30,
    scrambled: 'understand to not English difficult is',
    tokens: ['English', 'is', 'not', 'difficult', 'to', 'understand.'],
    correctSentence: 'English is not difficult to understand.'
  }
];

export const CHANGING_WORDS_LIST: ChangingWordItem[] = [
  { id: 'cw_1', givenWord: 'quicken', targetPos: 'adj', changedWord: 'quick', sentence: 'Mr. X is a quick person.', stars: 2 },
  { id: 'cw_2', givenWord: 'thorough', targetPos: 'adv', changedWord: 'thoroughly', sentence: 'Read the appointment letter thoroughly.', stars: 2 },
  { id: 'cw_3', givenWord: 'sign', targetPos: 'noun', changedWord: 'signature', sentence: 'He left behind his signature in his works.', stars: 3 },
  { id: 'cw_4', givenWord: 'dear', targetPos: 'verb', changedWord: 'endear', sentence: 'My new friend endeared me.', stars: 2 },
  { id: 'cw_5', givenWord: 'mother', targetPos: 'adj', changedWord: 'motherly', sentence: 'Her motherly affection saved the baby.', stars: 3 },
  { id: 'cw_6', givenWord: 'beauty', targetPos: 'verb', changedWord: 'beautify', sentence: 'We should beautify our society.', stars: 3 },
  { id: 'cw_7', givenWord: 'friend', targetPos: 'adj', changedWord: 'friendly', sentence: 'Mr. X is a friendly man.', stars: 3 },
  { id: 'cw_8', givenWord: 'know', targetPos: 'noun', changedWord: 'knowledge', sentence: 'Knowledge is power.', stars: 3 },
  { id: 'cw_9', givenWord: 'courage', targetPos: 'verb', changedWord: 'encourage', sentence: 'We should encourage tree plantation.', stars: 3 },
  { id: 'cw_10', givenWord: 'achieve', targetPos: 'noun', changedWord: 'achievement', sentence: 'Our achievement was very remarkable.', stars: 2 },
  { id: 'cw_11', givenWord: 'development', targetPos: 'verb', changedWord: 'develop', sentence: 'We must develop our country.', stars: 2 },
  { id: 'cw_12', givenWord: 'mental', targetPos: 'adv', changedWord: 'mentally', sentence: 'He is not mentally well.', stars: 2 },
  { id: 'cw_13', givenWord: 'ignorance', targetPos: 'verb', changedWord: 'ignore', sentence: 'He ignored me.', stars: 2 },
  { id: 'cw_14', givenWord: 'depend', targetPos: 'adj', changedWord: 'dependable', sentence: 'Mr. X is a dependable person.', stars: 2 },
  { id: 'cw_15', givenWord: 'strength', targetPos: 'adj', changedWord: 'strong', sentence: 'Mr. X is a strong person.', stars: 3 },
  { id: 'cw_16', givenWord: 'education', targetPos: 'verb', changedWord: 'educate', sentence: 'We should educate our women folk.', stars: 2 },
  { id: 'cw_17', givenWord: 'explanation', targetPos: 'verb', changedWord: 'explain', sentence: 'He explained the problems.', stars: 3 },
  { id: 'cw_18', givenWord: 'health', targetPos: 'adj', changedWord: 'healthy', sentence: 'We should eat healthy food.', stars: 2 },
  { id: 'cw_19', givenWord: 'die', targetPos: 'noun', changedWord: 'death', sentence: 'Death is common to all.', stars: 3 },
  { id: 'cw_20', givenWord: 'duty', targetPos: 'adj', changedWord: 'dutiful', sentence: 'My elder brother is very dutiful.', stars: 2 },
  { id: 'cw_21', givenWord: 'free', targetPos: 'noun', changedWord: 'freedom', sentence: 'Freedom is the birth right of a man.', stars: 3 },
  { id: 'cw_22', givenWord: 'glory', targetPos: 'verb', changedWord: 'glorify', sentence: 'The poet glorified the beauty of nature.', stars: 2 },
  { id: 'cw_23', givenWord: 'nature', targetPos: 'adj', changedWord: 'natural', sentence: 'Bangladesh is blessed with natural resources.', stars: 3 },
  { id: 'cw_24', givenWord: 'noble', targetPos: 'verb', changedWord: 'ennoble', sentence: 'Education ennobles our mind.', stars: 3 },
  { id: 'cw_25', givenWord: 'poor', targetPos: 'noun', changedWord: 'poverty', sentence: 'Poverty is the main obstacle to his career.', stars: 2 },
  { id: 'cw_26', givenWord: 'sure', targetPos: 'verb', changedWord: 'ensure', sentence: 'A student must ensure his study first.', stars: 3 },
  { id: 'cw_27', givenWord: 'wise', targetPos: 'noun', changedWord: 'wisdom', sentence: 'Without wisdom, knowledge is valueless.', stars: 3 },
  { id: 'cw_28', givenWord: 'wisdom', targetPos: 'adv', changedWord: 'wisely', sentence: 'My father speaks wisely.', stars: 2 }
];

export const TOP_TRANSLATIONS: TranslationItem[] = [
  {
    id: 'trans_1',
    nuYear: 'Honours - 2008',
    banglaText: 'ঢাকা বাংলাদেশের রাজধানী শহর। এটা পৃথিবীর জনবহুল রাজধানী শহরগুলোর একটা। যানজট নিয়মিত সমস্যা। বিদ্যুৎ সরবরাহে বিঘ্ন ঘটা একটা স্বাভাবিক ব্যাপার। এমনকি বিশুদ্ধ পানির একটা সমস্যাও একটা সাধারণ বিষয়।',
    englishTranslation: 'Dhaka is the capital city of Bangladesh. It is one of the most populous capital cities of the world. Traffic jam is a regular problem. Interruption in electricity supply is a natural matter. Even the problem of pure water is a common phenomenon.',
    keyVocabulary: [
      { bn: 'জনবহুল', en: 'populous' },
      { bn: 'বিঘ্ন', en: 'interruption' },
      { bn: 'স্বাভাবিক ব্যাপার', en: 'natural matter' },
      { bn: 'সাধারণ বিষয়', en: 'common phenomenon' }
    ]
  },
  {
    id: 'trans_2',
    nuYear: 'Honours - 2012',
    banglaText: 'সততা একটি মহৎ গুণ। এই গুণসম্পন্ন ব্যক্তি সৌভাগ্যবান। সবাই তাঁকে সম্মান করে। কেউ তাঁকে ঘৃণা করে না। এমনকি একজন অসৎ লোকও তাঁকে সম্মান না করে পারে না। পরিচ্ছন্ন বিবেকসম্পন্ন হওয়াতে তিনি মনের শান্তি উপভোগ করেন।',
    englishTranslation: 'Honesty is a great virtue. A man having this virtue is fortunate. Everybody respects him. None hates him. Even a dishonest man cannot respect him. He enjoys the peace of mind because of having clear conscience.',
    keyVocabulary: [
      { bn: 'মহৎ গুণ', en: 'great virtue' },
      { bn: 'সৌভাগ্যবান', en: 'fortunate' },
      { bn: 'পরিচ্ছন্ন বিবেক', en: 'clear conscience' },
      { bn: 'মনের শান্তি', en: 'peace of mind' }
    ]
  },
  {
    id: 'trans_3',
    nuYear: 'Honours - 2020',
    banglaText: 'মানুষ চিরদিন বাঁচে না। একদিন মৃত্যু আসবেই। কিন্তু যারা ভাল কাজ করেন, তাঁরা জগতে অমর। মৃত্যুর পরেও লোক তাঁদের স্মরণ করে। তাই, সকলের ভাল পথে চলা উচিত।',
    englishTranslation: 'Man does not live forever. One day death must come. But those who do good deeds are immortal on earth. People remember them even after their death. So, all should go on the good path.',
    keyVocabulary: [
      { bn: 'চিরদিন', en: 'forever' },
      { bn: 'ভাল কাজ', en: 'good deeds' },
      { bn: 'অমর', en: 'immortal' },
      { bn: 'স্মরণ করা', en: 'remember' }
    ]
  },
  {
    id: 'trans_4',
    nuYear: 'Honours - 2022',
    banglaText: 'যে দেশকে ভালোবাসে সে দেশপ্রেমিক। একজন দেশপ্রেমিক নিজের জীবনের চেয়ে দেশকে বেশি ভালোবাসে। দেশের মঙ্গলের জন্য সে নিজের জীবন দিতেও ইচ্ছুক। তাঁকে সবাই সম্মান করে। মৃত্যুর পরও সে বেঁচে থাকে।',
    englishTranslation: 'He who loves his country is a patriot. A patriot loves his country more than his own life. He is ready even to sacrifice his own life for the welfare of his country. Everybody respects him. He lives even after death.',
    keyVocabulary: [
      { bn: 'দেশপ্রেমিক', en: 'patriot' },
      { bn: 'উৎসর্গ করা', en: 'sacrifice' },
      { bn: 'কল্যাণ / মঙ্গল', en: 'welfare' }
    ]
  },
  {
    id: 'trans_5',
    nuYear: 'Honours - 2023',
    banglaText: 'পিপঁড়া খুব পরিশ্রমী। ক্ষুদ্র প্রাণী হলেও তারা সহনশীল ও সতর্ক। সারাদিন তারা খাবার খুঁজে বেড়ায়। দুর্দিনের জন্য তারা খাদ্য থেকে সঞ্চয় করে। তাদের জীবন থেকে আমাদের অনেক কিছু শেখার আছে।',
    englishTranslation: 'Ant is very industrious. Despite being small creatures, they are patient and vigilant. They search for food all day long. They store food for their rainy days. We have a lot of things to learn from them.',
    keyVocabulary: [
      { bn: 'পরিশ্রমী', en: 'industrious' },
      { bn: 'ক্ষুদ্র প্রাণী', en: 'small creature' },
      { bn: 'সহনশীল', en: 'patient' },
      { bn: 'সতর্ক', en: 'vigilant' },
      { bn: 'দুর্দিনের জন্য', en: 'for rainy days' }
    ]
  },
  {
    id: 'trans_6',
    nuYear: 'Test Paper - Reading Books',
    banglaText: 'বই পড়া একটি চমৎকার অভ্যাস। এর কোনো বিকল্প নেই। জ্ঞান অর্জন করতে হলে বই পড়তে হবে। অনেকে বই পড়ে না। আজকাল ছাত্রছাত্রীরাও বইয়ের প্রতি আগ্রহ দেখায় না।',
    englishTranslation: 'Reading books is an excellent habit. There is no alternative to it. One has to read books to acquire knowledge. There are many who do not read books. Nowadays, students do not show interest in books either.',
    keyVocabulary: [
      { bn: 'বিকল্প', en: 'alternative' },
      { bn: 'জ্ঞান অর্জন করা', en: 'acquire knowledge' }
    ]
  },
  {
    id: 'trans_7',
    nuYear: 'Test Paper - Freedom and Liberty',
    banglaText: 'স্বাধীনতা কোনো জাতির নিকট নেমে আসে না। একটা জাতিকে এটা অর্জন করতে হয়। স্বাধীনতা শুধু পতাকার পরিবর্তন নয়। অর্থনৈতিক মুক্তি ছাড়া রাজনৈতিক স্বাধীনতা অর্থহীন।',
    englishTranslation: 'Freedom does not descend upon a nation. It has to be achieved by a nation. Independence is not merely the change of a flag. Without economic emancipation, political independence is meaningless.',
    keyVocabulary: [
      { bn: 'নেমে আসা', en: 'descend upon' },
      { bn: 'অর্থনৈতিক মুক্তি', en: 'economic emancipation' },
      { bn: 'অর্থহীন', en: 'meaningless' }
    ]
  },
  {
    id: 'trans_8',
    nuYear: 'Test Paper - Road Accidents',
    banglaText: 'প্রতিদিন সড়ক দুর্ঘটনা বেড়ে চলেছে। অনেক লোকের মৃত্যু হচ্ছে। যানবাহন চালকদের আরও সতর্ক হতে হবে। পথচারীরাও এ দায় থেকে মুক্ত নয়। মানুষের জীবন অনেক দামী।',
    englishTranslation: 'Road accidents are increasing everyday. Many people are being killed. The drivers of the vehicles have to be more careful. The pedestrians are also not free from this liability. The lives of the people are very valuable.',
    keyVocabulary: [
      { bn: 'পথচারী', en: 'pedestrian' },
      { bn: 'দায়', en: 'liability' },
      { bn: 'মূল্যবান', en: 'valuable' }
    ]
  }
];
