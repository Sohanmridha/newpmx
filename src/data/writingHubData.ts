import { PosterTemplate, NoticeTemplate, ParagraphItem, ApplicationItem, LetterItem, AdvertisementItem } from '../types/englishCare';

export const POSTER_TEMPLATES: PosterTemplate[] = [
  {
    id: 'poster_social_problem',
    title: 'Social Problems (সামাজিক সমস্যা দূরীকরণ)',
    category: 'social_problem',
    box1_top_left: 'Be Aware!',
    box2_top_right: 'Stop It Now!',
    box3_headline: 'STAND UNITED AGAINST [TOPIC]!',
    box4_bullets: [
      '[TOPIC] is a serious social curse and barrier to national development.',
      'It creates deep unrest, ruins families, and destroys our youth.',
      'It violates human rights and causes immense psychological trauma.',
      'Government laws alone cannot stop it without collective civic action.'
    ],
    box5_call_to_action: 'So, it is high time we resisted [TOPIC] with iron hands and reported offenders!',
    box6_circulated_by: 'Circulated by: The Conscious Citizens\' Association & Student Forum',
    applicableTopics: [
      'Eve-teasing',
      'Corruption',
      'Drug Addiction',
      'Dowry System',
      'Deforestation',
      'Price Hike',
      'Child Labour',
      'Early Marriage',
      'Environmental Pollution'
    ]
  },
  {
    id: 'poster_disease',
    title: 'Health & Disease Prevention (ডেঙ্গু / কোভিড ইত্যাদি)',
    category: 'disease',
    box1_top_left: 'Stay Alert!',
    box2_top_right: 'Save Lives!',
    box3_headline: 'PREVENT THE SPREAD OF [TOPIC]!',
    box4_bullets: [
      '[TOPIC] is a dangerous threat to public health and family peace.',
      'Clean stagnant water from pots, tyres, and rooftops regularly.',
      'Use mosquito nets even during daytime sleep and apply repellents.',
      'Consult a doctor immediately upon high fever or severe symptoms.'
    ],
    box5_call_to_action: 'Remember: Prevention is always better than cure! Keep your surroundings neat and clean!',
    box6_circulated_by: 'Circulated by: Public Health Awareness Committee & Red Crescent Youth',
    applicableTopics: [
      'Dengue Fever',
      'COVID-19 Pandemic',
      'Cholera & Water-borne Diseases',
      'Food Adulteration Hazards'
    ]
  },
  {
    id: 'poster_importance',
    title: 'Positive Habit / National Importance (বৃক্ষরোপণ / বইপড়া)',
    category: 'importance',
    box1_top_left: 'Think Green!',
    box2_top_right: 'Act Today!',
    box3_headline: 'UNDERSTAND THE IMPORTANCE OF [TOPIC]!',
    box4_bullets: [
      '[TOPIC] is indispensable for the survival and intellectual growth of our nation.',
      'It preserves ecological balance and guarantees a green future.',
      'It ennobles our minds, dispels darkness, and fosters wisdom.',
      'Plant at least three saplings (fruit, timber, herbal) in every open space.'
    ],
    box5_call_to_action: 'Plant trees, save the earth! Embrace books, enrich your soul!',
    box6_circulated_by: 'Circulated by: Green Earth Society & National Book Club',
    applicableTopics: [
      'Tree Plantation',
      'Reading Books',
      'Female Education',
      'Digital Bangladesh & IT Skills',
      'Physical Exercise'
    ]
  },
  {
    id: 'poster_road_safety',
    title: 'Road Safety & Traffic Discipline (সড়ক নিরাপত্তা)',
    category: 'road_safety',
    box1_top_left: 'Drive Safe!',
    box2_top_right: 'Obey Rules!',
    box3_headline: 'ENSURE ROAD SAFETY - PREVENT ACCIDENTS!',
    box4_bullets: [
      'Reckless driving and overtaking take thousands of precious lives every year.',
      'Always wear helmets while riding motorbikes and fasten seatbelts.',
      'Never use mobile phones or drive under influence of fatigue.',
      'Use foot-over bridges, zebra crossings, and obey traffic signals strictly.'
    ],
    box5_call_to_action: 'Better late than never! Speed thrills but kills!',
    box6_circulated_by: 'Circulated by: Nirapad Sarak Chai & Road Transport Authority',
    applicableTopics: [
      'Road Accidents',
      'Reckless Driving',
      'Traffic Jam Control'
    ]
  },
  {
    id: 'poster_exam_copying',
    title: 'Say No to Copying in Exams (পরীক্ষায় নকল বর্জন)',
    category: 'exam_copying',
    box1_top_left: 'Be Honest!',
    box2_top_right: 'Save Merit!',
    box3_headline: 'STOP UNFAIR MEANS IN EXAMINATIONS!',
    box4_bullets: [
      'Copying in examination destroys self-confidence and moral integrity.',
      'It produces hollow degree holders unable to compete in global arenas.',
      'Adopting unfair means leads to permanent expulsion from the University.',
      'Honest hard work is the sole golden key to lifelong dignity and success.'
    ],
    box5_call_to_action: 'Study hard and pass with pride! Say absolute NO to copying!',
    box6_circulated_by: 'Circulated by: Examination Discipline Committee & NU Students\' Guild',
    applicableTopics: [
      'Copying in Exam',
      'Question Paper Leakage',
      'Academic Dishonesty'
    ]
  }
];

export const NOTICE_TEMPLATES: NoticeTemplate[] = [
  {
    id: 'notice_closure',
    title: 'College Closure Notice (ছুটির নোটিশ)',
    category: 'closure',
    collegeName: 'DHAKA IMPERIAL DEGREE COLLEGE',
    department: 'Office of the Principal',
    noticeNumber: 'DID/ADM/2026/104',
    date: '25 March, 2026',
    subjectOrHeadline: 'Closure of College on Account of [TOPIC]',
    bodyText: 'This is hereby notified for the information of all teachers, staff, and students that the college will remain closed from [START_DATE] to [END_DATE] on the occasion of [TOPIC]. All academic and extra-curricular classes will remain suspended during this vacation period. The college office and library will reopen as usual on [REOPEN_DATE] at 9:00 AM.',
    signatory: {
      name: 'Professor Dr. A. K. Rahman',
      designation: 'Principal',
      institution: 'Dhaka Imperial Degree College',
      location: 'Dhaka - 1205'
    },
    applicableTopics: [
      'Summer Vacation',
      'Winter Vacation',
      'Holy Ramadan & Eid-ul-Fitr',
      'Durga Puja',
      'Independence Day',
      'National Mourning Day'
    ]
  },
  {
    id: 'notice_ceremonial',
    title: 'Ceremony / Function Notice (অনুষ্ঠান আয়োজন)',
    category: 'ceremonial',
    collegeName: 'GOVT. COMMERCE COLLEGE, CHATTOGRAM',
    department: 'Office of the Principal & Cultural Sub-Committee',
    noticeNumber: 'GCC/CULT/2026/89',
    date: '10 February, 2026',
    subjectOrHeadline: 'Observance of [TOPIC]',
    bodyText: 'All the respected teachers and dear students are cordially informed that our college will celebrate [TOPIC] with due pomp and solemnity on [EVENT_DATE] at the college auditorium. A discussion session followed by a colorful cultural programme will take place at 10:00 AM. Honorable Education Minister has consented to grace the occasion as the Chief Guest. All students are advised to take their seats by 9:30 AM.',
    signatory: {
      name: 'Professor M. S. Chowdhury',
      designation: 'Principal & President of Cultural Committee',
      institution: 'Govt. Commerce College',
      location: 'Agrabad, Chattogram'
    },
    applicableTopics: [
      'Annual Sports Day',
      'International Mother Language Day',
      'Independence & National Day',
      'Victory Day Observance',
      'Fresher\'s Reception & Farewell',
      'College Golden Jubilee'
    ]
  },
  {
    id: 'notice_exam',
    title: 'Examination Schedule Notice (পরীক্ষার নোটিশ)',
    category: 'academic',
    collegeName: 'RAJSHAHI CITY DEGREE COLLEGE',
    department: 'Examination Controller Section',
    noticeNumber: 'RCDC/EXAM/2026/412',
    date: '15 April, 2026',
    subjectOrHeadline: 'Test Examination Schedule for Honours 2nd Year - 2026',
    bodyText: 'This is for the information of all Honours 2nd Year regular and irregular students that the compulsory Test Examination will commence from 2nd May 2026. The detailed routine has been published on the notice board and college web portal. Students are directed to collect their Admit Cards from the accounts department after clearing all outstanding college dues by 28th April 2026.',
    signatory: {
      name: 'Md. Shafiqul Islam',
      designation: 'Convener, Examination Sub-Committee',
      institution: 'Rajshahi City Degree College',
      location: 'Rajshahi'
    },
    applicableTopics: [
      'Honours 2nd Year Test Exam',
      'Form Fill-up Notice',
      'Mid-Term Assessment'
    ]
  }
];

export const PARAGRAPH_COLLECTION: ParagraphItem[] = [
  {
    id: 'para_climate_change',
    title: 'Climate Change (জলবায়ু পরিবর্তন)',
    category: 'board_common',
    boardExamTags: 'Honours 2023, 2020, 2018 (V.V.I.)',
    topicSentence: 'Climate change is the most alarming existential crisis facing humankind today.',
    englishText: 'Climate change is the most alarming existential crisis facing humankind today. It refers to long-term shifts in temperatures and weather patterns mainly caused by human activities. The indiscriminate burning of fossil fuels such as coal, oil, and gas releases immense amounts of carbon dioxide and other greenhouse gases into the atmosphere. This creates a greenhouse effect, trapping solar heat and raising the global average temperature. Consequently, polar ice caps and glaciers are melting at an unprecedented rate, causing sea levels to rise rapidly. As a low-lying coastal country, Bangladesh is among the worst victims of climate change despite contributing negligible emissions. Floods, cyclones, tidal surges, droughts, and salinity intrusion have become frequent and severe, displacing millions of environmental refugees. To combat this impending catastrophe, global leaders must honor climate treaties, slash greenhouse emissions, and transition toward renewable energy. In addition, massive afforestation and sustainable living practices are indispensable to safeguard our fragile planet.',
    banglaTranslation: 'জলবায়ু পরিবর্তন বর্তমান মানবজাতির সবচেয়ে উদ্বেগজনক অস্তিত্বের সংকট। এটি মূলত মানবসৃষ্ট কর্মকাণ্ডের কারণে তাপমাত্রা এবং আবহাওয়ার দীর্ঘমেয়াদী পরিবর্তনকে নির্দেশ করে। কয়লা, তেল এবং গ্যাসের মতো জীবাশ্ম জ্বালানির নির্বিচার পোড়ানোর ফলে বায়ুমণ্ডলে বিপুল পরিমাণ কার্বন ডাই অক্সাইড ও গ্রিনহাউস গ্যাস নির্গত হচ্ছে। ফলে একটি গ্রিনহাউস প্রভাব তৈরি হয়ে পৃথিবীর তাপমাত্রা বৃদ্ধি পাচ্ছে এবং মেরু অঞ্চলের বরফ দ্রুত গলে সমুদ্রপৃষ্ঠের উচ্চতা বৃদ্ধি করছে। বাংলাদেশ নিম্নভূমি উপকূলীয় দেশ হিসেবে সামান্য দূষণ করেও চরম ক্ষতিগ্রস্ত শিকার হচ্ছে। বন্যা, ঘূর্ণিঝড়, অনাবৃষ্টি ও লবণাক্ততার কারণে লাখ লাখ মানুষ বাস্তুচ্যুত হচ্ছে। এই দুর্যোগ মোকাবেলায় কার্বন নির্গমন হ্রাস এবং নবায়নযোগ্য জ্বালানির ব্যবহার বাড়ানো অত্যন্ত জরুরি।',
    vocabulary: [
      { en: 'existential', bn: 'অস্তিত্বমূলক' },
      { en: 'indiscriminate', bn: 'নির্বিচার' },
      { en: 'unprecedented', bn: 'অভূতপূর্ব' },
      { en: 'salinity intrusion', bn: 'লবণাক্ততার অনুপ্রবেশ' },
      { en: 'afforestation', bn: 'বন সৃজন / বৃক্ষরোপণ' }
    ]
  },
  {
    id: 'para_drug_addiction',
    title: 'Drug Addiction (মাদকাসক্তি)',
    category: 'board_common',
    boardExamTags: 'Honours 2022, 2019, 2015',
    topicSentence: 'Drug addiction means an uncontrollable dependence on narcotics that paralyzes individual potential.',
    englishText: 'Drug addiction means an uncontrollable dependence on narcotics that paralyzes individual potential and poisons society. It has assumed epidemic proportions among the educated and uneducated youth alike. Heroin, Yaba, Phensedyl, cocaine, and marijuana are some common lethal drugs. Frustration, unemployment, peer pressure, lack of family affection, and curiosity are the primary roots driving young souls toward this fatal abyss. Initially, an addict starts taking drugs for curiosity or momentary pleasure, but soon becomes totally enslaved by the craving. Drug addiction causes severe brain damage, respiratory failure, kidney disease, and depression. When addicts run out of money, they inevitably resort to theft, robbery, extortion, and even murder, breaking peace in families. To rescue our youth from this doom, strict border vigil must be enforced against drug cartels. Mass awareness, social rehabilitation centers, and parental warmth are pivotal to stamping out this menace.',
    banglaTranslation: 'মাদকাসক্তি বলতে মাদকের ওপর এমন এক অনিয়ন্ত্রিত নির্ভরতাকে বোঝায় যা মানুষের সম্ভাবনাকে পঙ্গু করে এবং সমাজকে বিষাক্ত করে তোলে। হতাশা, বেকারত্ব, বন্ধুদের কুপ্ররোচনা এবং পারিবারিক স্নেহের অভাব তরুণদের মাদকের দিকে ঠেলে দেয়। মাদকাসক্তির কারণে মস্তিষ্ক ও কিডনি ধ্বংস হয় এবং অর্থ জোগাড় করতে গিয়ে অপরাধমূলক কর্মকাণ্ড ঘটে। যুবসমাজকে বাঁচাতে সীমান্তে কড়া নজরদারি, পুনর্বাসন এবং সামাজিক সচেতনতা বৃদ্ধি করতে হবে।',
    vocabulary: [
      { en: 'narcotics', bn: 'মাদকদ্রব্য' },
      { en: 'paralyzes', bn: 'পঙ্গু করে' },
      { en: 'abyss', bn: 'গভীর খাদ / অন্ধকার গহ্বর' },
      { en: 'rehabilitation', bn: 'পুনর্বাসন' },
      { en: 'menace', bn: 'বিপদ / সামাজিক অভিশাপ' }
    ]
  },
  {
    id: 'para_july_movement',
    title: 'July Mass Uprising 2024 (জুলাই গণঅভ্যুত্থান ২০২৪)',
    category: 'board_common',
    boardExamTags: 'Top Guess for Honours 2024-2026',
    topicSentence: 'The July Mass Uprising 2024 stands as a monumental milestone in the democratic journey of Bangladesh.',
    englishText: 'The July Mass Uprising 2024 stands as a monumental milestone in the democratic journey of Bangladesh. What initially started in June as a peaceful student-led quota reform movement transformed into a nationwide historic revolution demanding justice, democracy, and good governance. Braving severe repression, internet blackouts, and curfew, brave students and ordinary citizens took to the streets under the banner of the Anti-Discrimination Student Movement. The supreme sacrifice of martyrs like Abu Sayed and countless young patriots ignited an unyielding fire of public resistance. On 5th August 2024, the autocratic regime collapsed in the face of the unstoppable \'March to Dhaka\', ushering in a new dawn of freedom. This historic uprising proved that the spirit of freedom and unity among our youth can overthrow any oppression. It has rekindled our hope for a corruption-free, equitable, and democratic Bangladesh.',
    banglaTranslation: 'জুলাই ২০২৪-এর গণঅভ্যুত্থান বাংলাদেশের গণতান্ত্রিক ইতিহাসে এক অবিস্মরণীয় মাইলফলক। সরকারি চাকরিতে কোটা সংস্কারের দাবিতে শুরু হওয়া অহিংস ছাত্র আন্দোলন শেষ পর্যন্ত ন্যায়বিচার ও গণতন্ত্র প্রতিষ্ঠার ঐতিহাসিক বিপ্লবে রূপ নেয়। শহীদ আবু সাঈদসহ বহু বীর সন্তানের আত্মত্যাগ জনগণের মধ্যে অপ্রতিরোধ্য প্রতিরোধের স্ফুলিঙ্গ জ্বালিয়ে দেয়। ৫ই আগস্ট ছাত্র-জনতার গণজোয়ারে স্বৈরাচারের পতন ঘটে এবং দেশে এক নতুন মুক্ত অধ্যায়ের সূচনা হয়।',
    vocabulary: [
      { en: 'monumental', bn: 'যুগান্তকারী / ঐতিহাসিক' },
      { en: 'uprising', bn: 'গণঅভ্যুত্থান' },
      { en: 'anti-discrimination', bn: 'বৈষম্যবিরোধী' },
      { en: 'unyielding', bn: 'অনমনীয়' },
      { en: 'autocratic', bn: 'স্বৈরাচারী' }
    ]
  },
  {
    id: 'para_universal_bad',
    title: 'Universal Formula for Social Problems (যেকোনো সামাজিক সমস্যা)',
    category: 'universal_shortcut',
    boardExamTags: 'Master Formula for 20+ Topics',
    topicSentence: 'There are various social problems in our country, and [TOPIC] is undoubtedly the most alarming.',
    englishText: 'There are many critical problems in our country, and [TOPIC] is undoubtedly one of the most alarming. It has become a severe hindrance to our socio-economic development, peace, and prosperity. It is caused by greed, lack of moral education, poverty, and administrative negligence. The consequences of [TOPIC] are disastrous; it ruins families, frustrates meritorious citizens, and brings immense suffering to the innocent masses. The government alone cannot solve this deep-rooted curse. Law enforcement agencies must be made transparent and stringent punishments should be inflicted on wrongdoers. Alongside legal steps, widespread media campaigns and civic participation are essential. If we can eradicate [TOPIC], our beloved homeland will surely march toward prosperity and lasting peace.',
    banglaTranslation: 'যেকোনো ক্ষতিকর বা নেতিবাচক বিষয় (যেমন: Corruption, Eve-teasing, Dowry, Food Adulteration, Price Hike, Load shedding, Deforestation) আসলে শুধু [TOPIC] এর জায়গায় বিষয়টির নাম বসিয়ে দিলেই একটি স্বয়ংসম্পূর্ণ প্যারাগ্রাফ তৈরি হয়ে যাবে।',
    vocabulary: [
      { en: 'hindrance', bn: 'প্রতিবন্ধকতা' },
      { en: 'disastrous', bn: 'ভয়াবহ' },
      { en: 'stringent', bn: 'কঠোর' },
      { en: 'eradicate', bn: 'নির্মূল করা' }
    ]
  }
];

export const APPLICATION_CV_COLLECTION: ApplicationItem[] = [
  {
    id: 'app_job_cv',
    title: 'Formal Job Application with Formatted CV / Resume',
    type: 'job_application_cv',
    subject: 'Application for the post of Senior Lecturer / Executive Officer',
    coverLetter: `25 April 2026

The Managing Director / Chairman
Apex International Group Ltd.
Gulshan Avenue, Dhaka-1212

Subject: Application for the post of Senior Officer / Lecturer in English

Dear Sir,
In response to your advertisement published in "The Daily Star" on 18 April 2026, I would like to offer myself as a candidate for the above-mentioned post. 

Having completed my Honours and Masters degree with academic distinction and having developed sound communication and analytical skills, I am confident in my ability to fulfill the responsibilities of your prestigious institution. My curriculum vitae, academic transcripts, and passport photos are enclosed herewith for your kind evaluation.

I therefore pray and hope that you would kindly grant me an interview so that I may demonstrate my fitness for the role.

Yours faithfully,
Sohan Mridha
Mobile: 017XXXXXXXX
Email: sohan.mridha@example.com`,
    cvData: {
      name: 'Sohan Mridha',
      fatherName: 'Md. Delwar Hossain Mridha',
      motherName: 'Rokeya Begum',
      dob: '12 January 1999',
      address: 'House #14, Road #05, Sector #03, Uttara, Dhaka',
      phone: '01712-XXXXXX',
      education: [
        { exam: 'M.A in English', year: '2023', result: 'CGPA 3.65 (1st Class)', subject: 'English Literature', board: 'National University' },
        { exam: 'B.A (Honours)', year: '2022', result: 'CGPA 3.58 (1st Class)', subject: 'English', board: 'National University' },
        { exam: 'H.S.C', year: '2017', result: 'GPA 5.00', subject: 'Humanities', board: 'Dhaka Board' },
        { exam: 'S.S.C', year: '2015', result: 'GPA 5.00', subject: 'Humanities', board: 'Dhaka Board' }
      ],
      experience: '2 years of practical experience as Assistant English Teacher at Ideal Model College.'
    }
  },
  {
    id: 'app_study_tour',
    title: 'Application for Permission & Financial Aid for Study Tour',
    type: 'college_request',
    subject: 'Prayer for permission and financial assistance to go on a study tour',
    bodyText: `12 March 2026

The Principal
Govt. Victoria College, Cumilla

Subject: Application for permission to go on a study tour

Sir,
We, the students of B.A. (Honours) 2nd Year of your reputed college, beg most respectfully to state that we are keen on organizing an educational study tour to Paharpur and Mahasthangarh. A study tour expands our mental horizons and supplements theoretical knowledge with direct historical observation. About fifty students accompanied by three respected faculty members will participate. We have collected a major portion of funds from our contributions, but we require college approval and financial sanction of Tk. 40,000 to cover transport and lodging costs.

We therefore pray and hope that your honor would be kind enough to grant us permission and sanction the required financial aid for the tour.

Yours obediently,
Students of Honours 2nd Year
Govt. Victoria College`
  }
];

export const LETTER_COLLECTION: LetterItem[] = [
  {
    id: 'letter_prep_exam',
    title: 'Letter to Father / Friend About Preparation for the Final Exam',
    salutation: 'My dear Father / Friend,',
    body: `I received your loving letter yesterday and was overjoyed to learn that everyone at home is in sound health. In your letter, you asked about my preparation for the ensuing Honours 2nd Year Final Examination.

You will be happy to hear that my preparation is quite satisfactory. I have already revised the entire syllabus twice according to a daily routine. Compulsory English was initially tough for me, but with consistent practice in Grammar and Writing shortcuts, I now feel confident of securing an 'A+'. Our teachers have also solved model test papers with us. Please pray for my sound health and good result.

Convey my warmest regards to mother and love to the younger ones.`,
    applicableTopics: ['Exam preparation', 'Honours exam readiness']
  }
];

export const ADVERTISEMENT_COLLECTION: AdvertisementItem[] = [
  {
    id: 'ad_flat_sale',
    title: 'Flat for Sale (ফ্ল্যাট বিক্রয় বিজ্ঞাপন)',
    category: 'sale',
    headline: 'LUXURIOUS SOUTH-FACING FLAT FOR SALE',
    features: [
      'Size: 1450 sq ft with 3 spacious bedrooms, 3 verandas, 3 attached baths.',
      'Modern kitchen with tiled fittings and spacious dining and drawing area.',
      'Amenities: Lift, 24/7 generator backup, Titas Gas connection, CCTV security, car parking.',
      'Location: Prime residential spot at Sector 11, Uttara, Dhaka (near Metro Station).'
    ],
    contactInfo: 'Interested buyers, please contact: Mobile 018XXXXXXXX or email flat.uttara@gmail.com'
  },
  {
    id: 'ad_job_vacancy',
    title: 'Job Vacancy Notice (নিয়োগ বিজ্ঞপ্তি)',
    category: 'wanted',
    headline: 'URGENTLY WANTED: JUNIOR ACCOUNTS EXECUTIVE',
    features: [
      'Minimum Qualification: BBA / B.Com (Honours) with sound computing skills in Tally.',
      'Experience: 1-2 years preferred, fresh graduates with high drive are encouraged.',
      'Attractive salary, festival bonus, and provident fund benefits provided.'
    ],
    contactInfo: 'Send CV with recent photo to hr@abccorporation.com by 30 April 2026.'
  }
];
