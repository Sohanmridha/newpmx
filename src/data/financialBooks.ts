export interface BookCard {
  id: string;
  titleBn: string;
  titleEn: string;
  chapterBn: string;
  chapterEn: string;
  quoteBn: string;
  quoteEn: string;
  wisdomBn: string;
  wisdomEn: string;
  actionPlanBn: string;
  actionPlanEn: string;
  trapBn: string;
  trapEn: string;
  tags: string[];
}

export interface FinancialBook {
  id: string;
  titleBn: string;
  titleEn: string;
  authorBn: string;
  authorEn: string;
  color: string;
  descriptionBn: string;
  descriptionEn: string;
  cards: BookCard[];
}

export const FINANCIAL_BOOKS_DATA: FinancialBook[] = [
  {
    id: 'psychology_of_money',
    titleBn: '🧠 দ্য সাইকোলজি অফ মানি',
    titleEn: 'The Psychology of Money',
    authorBn: 'মরগান হাউসেল (Morgan Housel)',
    authorEn: 'Morgan Housel',
    color: 'from-emerald-500 to-teal-500',
    descriptionBn: 'টাকা জমানো বা ধনী হওয়া কোনো প্রযুক্তিগত স্কিল নয়, এটি পুরোপুরি মানুষের আচরণ ও মানসিকতার খেলা।',
    descriptionEn: 'Doing well with money isn\'t about what you know. It\'s about how you behave.',
    cards: [
      {
        id: 'pom-1',
        chapterBn: 'অধ্যায় ১: সম্পদ হলো যা আপনি চোখে দেখেন না',
        chapterEn: 'Chapter 1: Wealth is what you don\'t see',
        titleBn: 'দামী গাড়ি-বাড়ির পেছনে লুকানো অবচেতন ধ্বংস',
        titleEn: 'The Invisible Nature of True Wealth',
        quoteBn: '"একটি ১ কোটি টাকার গাড়ি কেনা মানে হলো আপনার কাছে গাড়ি কেনার পর ১ কোটি টাকা কম আছে, যার দ্বারা আপনি আরো ধনী হতে পারতেন।"',
        quoteEn: '"Wealth is the nice cars not purchased. The diamonds not bought. The watches not worn. Wealth is financial assets that haven\'t yet been converted into the stuff you see."',
        wisdomBn: 'যখন আমরা কাউকে একটি দামী গাড়ি চালাতে দেখি, তখন আমরা কেবল দেখতে পাই যে সে একটি দামী গাড়ি চালাচ্ছে। আমরা দেখতে পাই না যে তার ব্যাংক ব্যালেন্স থেকে কত টাকা মাইনাস হয়েছে বা সে কত টাকার ঋণের জালে ফেঁসে আছে। মানুষের সামনে ধনী দেখানোর জন্য মানুষ যখন অঢেল খরচ করে, তখন তার প্রকৃত ধনী হওয়ার সুযোগ চিরতরে নষ্ট হয়ে যায়। সত্যিকারের সম্পদ হলো আপনার অবিক্রীত বা অব্যাক্ত ফিন্যান্সিয়াল সিকিউরিটি, যা আপনাকে স্বাধীনতা দেয়।',
        wisdomEn: 'We tend to judge wealth by what we see, because that\'s the information we have in front of us. But true wealth is what you don\'t see. It is the options not yet exercised, the freedom to wake up in the morning and do whatever you want.',
        trapBn: 'শো-অফ ট্র্যাপ (Ego spending): অন্যের সামনে নিজেকে সচ্ছল বা সফল প্রমাণ করার অবচেতন তাগিদ যা আমাদের ক্রমাগত অপ্রয়োজনীয় লাক্সারি পণ্য কিনতে প্ররোচিত করে।',
        trapEn: 'The Status Trap: The unconscious urge to signal success to strangers, which keeps your bank account completely dry.',
        actionPlanBn: '১. কোনো দামী ডিভাইস বা কাপড় কেনার আগে ভাবুন: "আমি কি এটা নিজের উপযোগিতার জন্য কিনছি, নাকি মানুষকে দেখানোর জন্য?"\n২. আপনার মাসের আয়ের একটি অংশ সরাসরি ইনভেস্টমেন্ট ফান্ডে চালান করে দিন, যাতে তা চোখের সামনে খরচের জন্য প্রস্তুত না থাকে।',
        actionPlanEn: '1. Delay major non-essential electronics purchases by 7 days and ask: "Am I buying this for me, or for their reaction?"\n2. Automate a fixed fraction of your earnings out of sight before you start planning your monthly mess budget.',
        tags: ['Ego', 'Wealth Definition', 'Morgan Housel']
      },
      {
        id: 'pom-2',
        chapterBn: 'অধ্যায় ২: স্বাধীনতাই হলো আসল লভ্যাংশ',
        chapterEn: 'Chapter 2: Freedom is the Highest Dividend',
        titleBn: 'টাকা জমানোর সবচেয়ে বড় প্রাপ্তি হলো নিজের সময়ের ওপর নিয়ন্ত্রণ',
        titleEn: 'Controlling Your Time is the Ultimate Wealth',
        quoteBn: '"আপনার ইচ্ছে অনুযায়ী, আপনার ইচ্ছেমত সময়ে, আপনার প্রিয় মানুষের সাথে যা খুশি করার ক্ষমতাই হলো পৃথিবীর সবচেয়ে বড় ফিন্যান্সিয়াল ডিভিডেন্ড।"',
        quoteEn: '"The highest form of wealth is the ability to wake up every morning and say, \'I can do whatever I want today.\'"',
        wisdomBn: 'মানুষের আনন্দের সবচেয়ে বড় নিয়ন্ত্রক হলো তার স্বায়ত্তশাসন বা আত্মনিয়ন্ত্রণ। আপনি যত দামী ব্র্যান্ডেরই জিনিস ব্যবহার করুন না কেন, যদি আপনার নিজের ২৪ ঘণ্টার ওপর কোনো নিয়ন্ত্রণ না থাকে, তবে আপনি সুখী হতে পারবেন না। ব্যাংক অ্যাকাউন্টে কিছু জমানো টাকা থাকা মানে হলো আপনার চাকরি চলে গেলেও আপনি ২-৩ মাস শান্তিতে থাকতে পারবেন, বা কোনো বাজে কাজের অফার বুক ফুলিয়ে প্রত্যাখ্যান করতে পারবেন। সঞ্চয় আপনাকে সেই "না" বলার স্বাধীনতা কিনে দেয়।',
        wisdomEn: 'Money\'s greatest intrinsic value is its ability to give you control over your time. Having a small emergency fund means you can wait for a great job rather than settling for a miserable one. It gives you career leverage and peace.',
        trapBn: 'লাইফস্টাইল ট্রেডমিল (Lifestyle Inflation): বেশি আয়ের সাথে সাথে নিজের ফ্যামিলি ও মেস লাইফের স্ট্যান্ডার্ড বাড়িয়ে নিজের স্বাধীনতাকে বন্ধক রাখা।',
        trapEn: 'The Golden Handcuffs: Increasing your overhead and bills as soon as your income rises, effectively trapping yourself in endless wage-slavery.',
        actionPlanBn: '১. "ইমার্জেন্সি সেভিংস" নামে একটি ওয়ালেট চালু করুন। এটি আপনার ব্যাংকের অ্যাপ বা ক্যাশে থাকতে পারে যা আপনি কখনো ছুয়েও দেখবেন না।\n২. অন্তত ৩ মাসের মেস ভাড়ার সমপরিমাণ টাকা আলাদা সিকিউরড ফান্ডে জমানোর মিশন আজই শুরু করুন।',
        actionPlanEn: '1. Create a "Freedom Vault" in your savings portfolio representing 3-6 months of absolute basic survival costs.\n2. Dedicate any tutoring/freelancing bonuses entirely to this vault instead of spending on a celebrate-party.',
        tags: ['Freedom', 'Time Control', 'Emergency Fund']
      },
      {
        id: 'pom-3',
        chapterBn: 'অধ্যায় ৩: কখনোই যথেষ্ট নয়',
        chapterEn: 'Chapter 3: Never Enough',
        titleBn: 'সোশ্যাল কম্পারিজন বা সামাজিক তুলনার মরণফাঁদ',
        titleEn: 'Knowing When to Stop Moving the Goalposts',
        quoteBn: '"এমন কিছুর জন্য নিজের মূল্যবান স্বাধীনতা ও মানসিক শান্তি বাজি ধরবেন না যা আপনার প্রয়োজন নেই, কেবল এমন কিছুর জন্য যা আপনি সাময়িক চান।"',
        quoteEn: '"There is no reason to risk what you have and need for what you don\'t have and don\'t need. Managing greed is the ultimate financial filter."',
        wisdomBn: 'আধুনিক যুগের সবচেয়ে বড় ট্র্যাজেডি হলো ফিন্যান্সিয়াল গোলপোস্ট অনবরত দূরে সরে যাওয়া। যখন আপনার আয় বা টিউশনি ৫,০০০ টাকা থেকে ১০,০০০ টাকা হয়, তখন আপনার আকাঙ্ক্ষা ১৫,০০০ টাকার দিকে চলে যায়। আপনি কখনোই তৃপ্ত হতে পারেন না কারণ আপনি অনবরত আপনার চেয়ে ধনী কোনো সহপাঠী বা আত্মীয়ের সাথে তুলনা করছেন। সামাজিক তুলনা হলো একটি অতল গহ্বর, যেখানে কোনো শেষ নেই। আপনার কতটুকু প্রয়োজন তা জানা এবং সেখানেই সীমা টানা শিখতে হবে।',
        wisdomEn: 'The hardest financial skill is getting the goalpost to stop moving. Comparing yourself to others is the root of all financial misery. Reputation and freedom are invaluable; do not risk them for transient additions.',
        trapBn: 'তুলনার অবচেতন ফাঁদ (Social Comparison): ফেসবুকের ফিড বা বন্ধুদের দামী গ্যাজেট, বাইক বা ট্যুরের ছবি দেখে নিজের মনে অপ্রাপ্তিবোধ তৈরি করা এবং ধার করে হলেও সেই ট্র্যাভেল বা কেনাকাটায় জড়িয়ে পড়া।',
        trapEn: 'Peer comparison: The subconscious compulsion to match your friend\'s high-end vacations or dining, leading to credit defaults.',
        actionPlanBn: '১. সোশ্যাল মিডিয়ায় চোখ ধাঁধানো প্রোডাক্ট রিভিউ বা শপিং নোটিফিকেশন এড়িয়ে চলুন।\n২. ডায়েরিতে লিখুন আপনার জীবনের ৩টি সেরা মুহূর্তের কথা - খেয়াল করুন সেগুলোর জন্য কিন্তু লাখ টাকা খরচের প্রয়োজন ছিল না।',
        actionPlanEn: '1. Unfollow premium lifestyle influencers or gadget review channels that trigger immediate shopping desires.\n2. Write down your "Sufficient Income Baseline" – the exact amount of money you actually need to be fully functional, healthy, and happy.',
        tags: ['Comparison', 'Greed Control', 'Mindset']
      },
      {
        id: 'pom-4',
        chapterBn: 'অধ্যায় ৪: জমানোর জন্য কোনো অযুহাতের প্রয়োজন নেই',
        chapterEn: 'Chapter 4: You Don\'t Need a Reason to Save',
        titleBn: 'ইনভেস্টমেন্ট বা বড় কেনার লক্ষ্য ছাড়াই টাকা জমানোর মহিমা',
        titleEn: 'Saving as a Hedge Against Life\'s Volatility',
        quoteBn: '"আপনি কেবল কোনো বাড়ি বা গাড়ি কেনার লক্ষ্য ছাড়াই সঞ্চয় করতে পারেন। সঞ্চয় হলো ভবিষ্যৎ অনিশ্চয়তার বিরুদ্ধে আপনার সবচেয়ে বড় আত্মরক্ষা।"',
        quoteEn: '"Savings can be created by spending less. You can save by spending less if you desire less. And you will desire less if you care less about what others think of you."',
        wisdomBn: 'অনেকেই বলেন, "আমার সামনে তো এখন কোনো বড় খরচ নেই, তাহলে কেন জমাবো?" এটি একটি ভুল ধারণা। সঞ্চয় করার জন্য কোনো সুনির্দিষ্ট লক্ষ্যের প্রয়োজন নেই। পৃথিবী অত্যন্ত অনিশ্চিত। আকস্মিক অসুস্থতা, ফ্যামিলির ক্রাইসিস, মেস বদলানো বা কোনো নতুন সুযোগের জন্য ইনস্ট্যান্ট ক্যাশ থাকা অপরিহার্য। লক্ষ্যহীন সঞ্চয় আপনাকে জীবনের অপ্রত্যাশিত ধাক্কা সামলানোর এবং অসাধারণ কোনো অপরচুনিটি লুফে নেওয়ার ক্ষমতা দেয়।',
        wisdomEn: 'Saving doesn\'t require an end goal. It acts as an insurance policy against the unpredictable events of life. It gives you the option to take a career pivot or a learning break without going bankrupt.',
        trapBn: 'নিশ্চিন্ততার অলীক কল্পনা (Optimism Bias): "আমার তো এখন টিউশনি আছেই, সামনের মাসেও থাকবে" এই ভেবে আজকের পুরো টাকা উড়িয়ে দেওয়া।',
        trapEn: 'Optimism bias: Believing that your current income stream (tuitions, gig) will last forever without interruptions, keeping your cash balance zero.',
        actionPlanBn: '১. প্রতি মাসে আয়ের অন্তত ১৫% কোনো অযুহাত ছাড়াই "অজানা ভবিষ্যৎ" ফোল্ডারে জমিয়ে রাখুন।\n২. টাকা জমানোকে আপনার অহংকার কমানোর একটি পরীক্ষা হিসেবে বিবেচনা করুন।',
        actionPlanEn: '1. Set up an automatic transfer of 15% of your earnings to a completely hidden digital vault on pay-day.\n2. Understand that savings is just the difference between your ego and your income.',
        tags: ['Savings', 'Humility', 'Discipline']
      }
    ]
  },
  {
    id: 'your_money_or_your_life',
    titleBn: '⏳ ইয়োর মানি অর ইয়োর লাইফ',
    titleEn: 'Your Money or Your Life',
    authorBn: 'ভিকি রবিন ও জো ডোমিঙ্গুয়েজ (Vicki Robin)',
    authorEn: 'Vicki Robin & Joe Dominguez',
    color: 'from-amber-500 to-red-500',
    descriptionBn: 'টাকা কেবল কোনো কাগজের টুকরো নয়, এটি মূলত আপনার জীবনের মূল্যবান সময় ও শক্তির একটি রূপান্তরিত রূপ।',
    descriptionEn: 'Money is something you trade your life energy for. Learn to maximize fulfillment per unit of energy.',
    cards: [
      {
        id: 'ymyl-1',
        chapterBn: 'অধ্যায় ১: লাইফ এনার্জি বা জীবন শক্তি',
        chapterEn: 'Chapter 1: Life Energy',
        titleBn: 'টাকার প্রকৃত মূল্য পরিমাপ করুন আপনার জীবন শক্তি দিয়ে',
        titleEn: 'The Real Cost of Everything is Your Time',
        quoteBn: '"আপনি যখন ১,০০০ টাকা খরচ করেন, তখন আসলে আপনি এক হাজার টাকা খরচ করছেন না; বরং আপনার জীবনের কয়েকটি মূল্যবান ঘণ্টা বিক্রি করছেন যা আর কখনো ফিরে আসবে না।"',
        quoteEn: '"Money is something we choose to trade our life energy for. Your life energy is your allocation of time here on Earth, the precious limit of your breath."',
        wisdomBn: 'ধরুন আপনি টিউশনি বা ফ্রিল্যান্সিং করে ঘণ্টায় ২০০ টাকা আয় করেন। এখন আপনি যদি একটা ব্র্যান্ডের ৪,০০০ টাকার জুতো কিনতে চান, তবে তার প্রকৃত দাম ৪,০০০ টাকা নয়, বরং আপনার জীবনের ২০ ঘণ্টার কঠিন পরিশ্রম! ২০ ঘণ্টা আপনাকে মাথার ঘাম পায়ে ফেলে কাজ করতে হয়েছে ওই জুতোর জন্য। কোনো কিছু কেনার আগে টাকাটিকে সর্বদা আপনার "কাজের ঘণ্টায়" রূপান্তর করে ভাবুন। এটি আপনার মেমোরিতে খরচের অনুভূতিকে তীব্র করবে এবং অবচেতন অপচয়কে একদম শুন্যে নামিয়ে আনবে।',
        wisdomEn: 'When you calculate your real hourly wage (subtracting commute costs, work clothes, taxes), you see the true trade-off. Before buying a 3,000 BDT gadget, ask: "Is this worth 15 hours of my life energy spent tutoring?"',
        trapBn: 'অর্থের অসাড়তা (Frictionless Spending): নগদ টাকার বদলে বিকাশ বা কার্ড ব্যবহার করার ফলে পকেট থেকে টাকা যাওয়ার কষ্ট উধাও হওয়া, যা অবচেতন খরচকে ৩০% বাড়িয়ে দেয়।',
        trapEn: 'The cashless illusion: Swiping cards or using modern digital apps removes the tactile pain of spending, causing massive leakage.',
        actionPlanBn: '১. আপনার বাস্তব নেট আওয়ারলি ওয়েজ (প্রকৃত ঘণ্টার আয়) হিসাব করে রাখুন।\n২. আজ থেকে প্রতিটি বড় খরচের পাশে ব্র্যাকেটে লিখে রাখুন: "এটি কিনতে আমার জীবনের [X] ঘণ্টা লেগেছে।"',
        actionPlanEn: '1. Calculate your "Real Hourly Wage" by dividing net monthly earnings by total hours invested (including prep and commutes).\n2. Write down this hourly wage rate on your table as a permanent budgeting reminder.',
        tags: ['Life Energy', 'Real Cost', 'Time-Money']
      },
      {
        id: 'ymyl-2',
        chapterBn: 'অধ্যায় ২: পরিতৃপ্তির বক্ররেখা বা ফুলফিলমেন্ট কার্ভ',
        chapterEn: 'Chapter 2: The Fulfillment Curve',
        titleBn: 'যত বেশি খরচ তত বেশি আনন্দ? একটি বৈজ্ঞানিক ভুল ধারণা',
        titleEn: 'The Saturation Point of Consuming Stuff',
        quoteBn: '"একটি নির্দিষ্ট সীমার পর প্রতিটি বাড়তি টাকা আপনার জীবনে সুখ আনে না, বরং রক্ষণাবেক্ষণের দুশ্চিন্তা ও অপ্রয়োজনীয় জটলা তৈরি করে।"',
        quoteEn: '"Survival leads to Comforts, which lead to Luxuries, which lead to Clutter. Clutter is the point where more stuff decreases your happiness."',
        wisdomBn: 'বৈজ্ঞানিক গবেষণায় দেখা গেছে, টাকা খরচের মাধ্যমে তৃপ্তি পাওয়ার ৪টি ধাপ আছে: ১. সারভাইভাল (অন্ন, বস্ত্র, মেস ভাড়া), ২. কমফোর্ট (ফ্যান, ভালো বালিশ, ভালো লাইব্রেরী), ৩. লাক্সারি (দামী রেস্টুরেন্ট, প্রিমিয়াম ডিভাইস) এবং ৪. জটলা বা ক্লাটার (অপ্রয়োজনীয় গ্যাজেটস, ব্র্যান্ডের কাপড় যা আলমারিতে পড়ে থাকে)। আমরা ভাবি যত বেশি কিনবো তত ভালো লাগবে, কিন্তু আসলে লাক্সারির পর অতিরিক্ত জিনিস আমাদের জীবনে জটিলতা ও মেইনটেন্যান্স খরচ বাড়ায়। তৃপ্তির সর্বোচ্চ চূড়ায় পৌঁছানোর পর নিজেকে থামানোই হলো ফিন্যান্সিয়াল মাস্টারি।',
        wisdomEn: 'The Fulfillment Curve shows that spending increases happiness up to the point of Comfort. Past that point, buying more items leads to clutter, higher maintenance bills, and mental anxiety. Identify your personal "Enough" point.',
        trapBn: 'দরিদ্র মানসিকতা (Overconsumption Loop): মন খারাপ থাকলে বা বোরিং লাগলে নতুন কোনো গ্যাজেট বা জামা কিনে সাময়িক ডোপামিন হরমোন বাড়ানোর চেষ্টা করা।',
        trapEn: 'Retail therapy: Chasing a temporary dopamine spike by checking out web-carts when bored or emotionally depleted.',
        actionPlanBn: '১. আপনার মেস ও পড়ার ঘরের সমস্ত অপ্রয়োজনীয় জিনিসপত্র সরিয়ে ফেলুন।\n২. আগামী ১ সপ্তাহ নতুন কোনো গ্যাজেট বা পোশাক না কেনার চ্যালেঞ্জ নিন এবং খেয়াল করুন আপনার শান্তিতে কোনো ঘাটতি হচ্ছে কিনা।',
        actionPlanEn: '1. Declutter your workspace. Throw away or sell broken gadgets, old clothes, and duplicate stationary.\n2. Realize that every single item you own demands a micro-fraction of your attention and space.',
        tags: ['Fulfillment', 'Minimalism', 'Enough']
      }
    ]
  },
  {
    id: 'richest_man_in_babylon',
    titleBn: '🏺 দ্য রিচেস্ট ম্যান ইন ব্যাবিলন',
    titleEn: 'The Richest Man in Babylon',
    authorBn: 'জর্জ এস ক্ল্যাসন (George S. Clason)',
    authorEn: 'George S. Clason',
    color: 'from-amber-600 to-yellow-500',
    descriptionBn: 'প্রাচীন ব্যাবিলন শহরের ধনী ব্যক্তিদের ব্যবহৃত ৪,০০০ বছরের পুরনো ৭টি বৈশ্বিক ফিন্যান্সিয়াল সিক্রেট ও সঞ্চয়ের মূল ভিত্তি।',
    descriptionEn: 'Timeless principles of wealth creation, accumulation, and protection originating from ancient Babylon.',
    cards: [
      {
        id: 'rmb-1',
        chapterBn: 'অধ্যায় ১: আপনার পার্স বা ওয়ালেট মোটা করার প্রথম নিয়ম',
        chapterEn: 'Chapter 1: Start Thy Purse to Fattening',
        titleBn: 'আয়ের অন্তত ১০% নিজের জন্য রেখে দিন',
        titleEn: 'Pay Yourself First (The 10% Gold Standard)',
        quoteBn: '"আপনি যা আয় করেন তার একটি সুনির্দিষ্ট অংশ আপনার নিজের কাছে রেখে দেওয়ার অধিকার আপনার আছে। এটি যেন কোনোভাবেই ১০% এর কম না হয়।"',
        quoteEn: '"A part of all I earn is mine to keep. It should be not less than one-tenth no matter how small thy earnings are."',
        wisdomBn: 'আমরা যখন আয় করি, তখন সবার আগে বাড়িওয়ালাকে মেস ভাড়া দিই, বুয়াকে বিল দিই, ইন্টারনেটের টাকা দিই, মুদি দোকানদারকে দিই। মাসের শেষে আমরা সবাইকে টাকা পরিশোধ করি কেবল একজন বাদে - সে হলেন আপনি নিজে! যে মানুষটি দিনরাত পরিশ্রম করে টিউশনি বা ফ্রিল্যান্সিং করলো, তাকে আমরা এক টাকাও দিই না। নিজের জন্য ১০% টাকা শুরুতেই আলাদা করে জমিয়ে রাখুন। বাকি ৯০% টাকা দিয়ে আপনার সমস্ত খরচ চালান। এটি অত্যন্ত ম্যাজিকাল একটি নিয়ম।',
        wisdomEn: 'Most people earn, pay all their bills, and save whatever is left. Babylonians did the opposite: they saved 10% first, and forced their lifestyle to adapt to the remaining 90%. Over time, this 10% forms the seed of capital.',
        trapBn: 'আগে খরচ পরে সঞ্চয় (Savings as an Afterthought): "মাসের শেষে যদি কোনো টাকা বাঁচে তবে জমাবো" এই ভ্রান্ত ধারণা যা নিশ্চিতভাবে শূন্য সঞ্চয় নিয়ে আসে।',
        trapEn: 'The leftovers trap: Planning to save whatever is left at the end of the month. Your expenses will always expand to consume your full income.',
        actionPlanBn: '১. মাসের ১ তারিখে টিউশনির টাকা পাওয়া মাত্র ১,০০০ বা ৫০০ টাকা সরাসরি মাটির ব্যাংক বা আলাদা সঞ্চয় অ্যাকাউন্টে লুকিয়ে ফেলুন।\n২. নিজেকে বলুন, "আমার এই মাসের বাজেট কেবল ৯০% টাকা দিয়ে তৈরি হবে।"',
        actionPlanEn: '1. Instantly route 10% of any income source to an untouchable vault the moment it hits your account.\n2. Budget your meals, transit, and mobile costs strictly using only the remaining 90%.',
        tags: ['Pay Yourself First', '10% Rule', 'Babylon']
      },
      {
        id: 'rmb-2',
        chapterBn: 'অধ্যায় ২: খরচ নিয়ন্ত্রণ করার দ্বিতীয় নিয়ম',
        chapterEn: 'Chapter 2: Control Thy Expenditures',
        titleBn: 'প্রয়োজন বনাম সাময়িক শখ এর কঠিন দেয়াল',
        titleEn: 'Differentiating Necessary Costs from Casual Desires',
        quoteBn: '"যাকে আমরা আমাদের সাধারণ প্রয়োজনীয় খরচ বলি, তা আমাদের অজান্তেই অনবরত বাড়তে থাকে যদি না আমরা তার টুঁটি চেপে ধরি।"',
        quoteEn: '"Confuse not necessary expenses with thy desires. For, all men are burdened with more desires than they can gratify."',
        wisdomBn: 'মানুষের আকাঙ্ক্ষা অসীম। আমাদের সবারই অনেক কিছু পেতে মন চায়। কিন্তু বাস্তব সত্য হলো, আমাদের বেঁচে থাকার ও সুস্থভাবে পড়াশোনা করার জন্য খুব সামান্য জিনিসের প্রয়োজন। দামী রেস্টুরেন্টে ডিনার করা বা ব্র্যান্ডের জুতো পরা আপনার "শখ" হতে পারে, কিন্তু "প্রয়োজন" নয়। আপনার সমস্ত ইচ্ছাকে একটি পাতায় লিখে ফেলুন এবং কেবল সেগুলোকে সিলেক্ট করুন যা আপনার বেঁচে থাকার ও স্টুডেন্ট ক্যারিয়ারের জন্য ১০০% জরুরি। বাকিগুলোকে কঠোরভাবে ছেঁটে ফেলুন।',
        wisdomEn: 'Every human has unlimited desires, but limited income. If you do not actively boundary your spending, your "necessary expenses" will naturally inflate to match your salary. Audit and prune your desires routinely.',
        trapBn: 'ইচ্ছেকে প্রয়োজন মনে করা (Want vs Need Confusion): "এই দামী হেডফোনটি না থাকলে আমার পড়াশোনাই হবে না" - এরকম অবচেতন অজুহাত বানিয়ে অপ্রয়োজনীয় কেনাকাটা জাস্টিফাই করা।',
        trapEn: 'Rationalizing luxury: Convincing yourself that a luxury gadget or premium subscription is an absolute academic necessity to study better.',
        actionPlanBn: '১. একটি পাতায় দুইটি কলাম করুন - "প্রয়োজন" ও "শখ"। আপনার বিগত মাসের খরচের লিস্টটি এই দুই ভাগে ভাগ করুন।\n২. শখের কলামের অন্তত ৩টি জিনিস আজই চিরতরে ডিলিট করুন।',
        actionPlanEn: '1. Create a checklist of all subscriptions and tools. Classify them into "Oxygen" (Absolute Need) and "Perfume" (Luxury Want).\n2. Instantly cancel at least one "Perfume" subscription to build mental friction against spending.',
        tags: ['Wants vs Needs', 'Desire Control', 'Frugality']
      },
      {
        id: 'rmb-3',
        chapterBn: 'অধ্যায় ৩: আয়ের যোগ্যতা বৃদ্ধি করুন',
        chapterEn: 'Chapter 3: Increase Thy Ability to Earn',
        titleBn: 'জ্ঞান ও দক্ষতাই হলো সবচেয়ে বড় সম্পদ উৎপাদনকারী',
        titleEn: 'Investing in Your Own Professional Wisdom',
        quoteBn: '"একজন মানুষের সবচেয়ে বড় সম্পদ হলো তার নিজের ভেতরের প্রজ্ঞা ও কর্মদক্ষতা। আপনি নিজে যত বেশি জানবেন, তত বেশি উপার্জন করার যোগ্যতা অর্জন করবেন।"',
        quoteEn: '"The more wisdom we know, the more we may earn. That man who seeketh to learn more of his craft shall be richly rewarded."',
        wisdomBn: 'ব্যাবিলনের সবচেয়ে ধনী ব্যক্তি আরকাদ তার উপার্জনের একটি বড় অংশ নতুন দক্ষতা শেখার পেছনে ব্যয় করতেন। আপনি যদি কেবল খরচ বাঁচানোর পেছনে পুরো শক্তি ক্ষয় করেন, তবে আপনার আয়ের লিমিট কখনো বাড়বে না। কারণ খরচ বাঁচিয়ে আপনি সর্বোচ্চ আপনার আয়ের সমপরিমাণ টাকা সঞ্চয় করতে পারেন, কিন্তু নিজের দক্ষতা বাড়িয়ে আপনি আয়ের সীমাহীন বৃদ্ধি ঘটাতে পারেন। প্রতিদিন অন্তত ১ ঘণ্টা সময় নতুন কোনো হাই-পেয়িং স্কিল শিখতে ব্যয় করুন।',
        wisdomEn: 'Frugality has a floor; you can only cut expenses to zero. But income has no ceiling. The best investment you can make is in your own mind. Master modern skills like React, Python, UI/UX, or writing to accelerate your hourly rate.',
        trapBn: 'অলসতা ও স্থবিরতা (Fixed Skill Trap): "আমি তো টিউশনি করেই চলছি, নতুন কিছু শেখার দরকার কী" ভেবে নিজের মূল দক্ষতাকে ব্যাকডেটেড রেখে দেওয়া।',
        trapEn: 'The comfort trap: Settling for low-paying mechanical tasks and refusing to spend uncomfortable hours learning complex technology.',
        actionPlanBn: '১. প্রতিদিন সকাল বা রাতে ১ ঘণ্টা নিরবচ্ছিন্ন সময় রাখুন নতুন কোনো ফিন্যান্সিয়াল বা টেকনিক্যাল স্কিল শেখার জন্য।\n২. কোনো ফালতু আড্ডায় সময় নষ্ট না করে আপনার সিনিয়র বা মেন্টরদের সাথে স্কিল নিয়ে কথা বলুন।',
        actionPlanEn: '1. Block 45 minutes daily for high-value technical learning (coding, copywriting, or language skills).\n2. Treat your brain as your most valuable financial asset and feed it clean, educational content.',
        tags: ['Self Investment', 'Skill Growth', 'Earning Capacity']
      }
    ]
  },
  {
    id: 'atomic_habits_finance',
    titleBn: '⚡ অ্যাটমিক হ্যাবিটস (আর্থিক সংস্করণ)',
    titleEn: 'Atomic Habits for Finance',
    authorBn: 'জেমস ক্লিয়ার (James Clear - Applied)',
    authorEn: 'James Clear (Principles Applied)',
    color: 'from-purple-500 to-indigo-500',
    descriptionBn: 'ক্ষুদ্র ১% অভ্যাস পরিবর্তনের জাদুকরী ক্ষমতা কীভাবে আপনার পকেটকে প্রতিনিয়ত সমৃদ্ধ করবে।',
    descriptionEn: 'How tiny 1% micro-actions in your daily spending routine compound into huge savings over months.',
    cards: [
      {
        id: 'ahf-1',
        chapterBn: 'অধ্যায় ১: ক্ষুদ্র অভ্যাসের চক্রবৃদ্ধি শক্তি',
        chapterEn: 'Chapter 1: The Power of 1% Daily Improvements',
        titleBn: 'মাত্র ৫০ টাকা জমানোর জাদুকরী ম্যাজিক',
        titleEn: 'The Compounding Magic of Tiny micro-savings',
        quoteBn: '"প্রতিদিন মাত্র ১% উন্নতি বা সাশ্রয় করা যদি আপনার কাছে তুচ্ছ মনে হয়, তবে মনে রাখবেন বছরের শেষে আপনি আগের চেয়ে ৩৭ গুণ এগিয়ে থাকবেন।"',
        quoteEn: '"Habits are the compound interest of self-improvement. The same way money multiplies through compound interest, the effects of your habits multiply as you repeat them."',
        wisdomBn: 'আমরা ভাবি, "আজকে মাত্র ৫০ টাকা বাঁচিয়ে কী লাভ? এটা দিয়ে কি বাড়ি হবে?" এটি অবচেতন মস্তিষ্কের একটি বিশাল ভুল লজিক। আপনি যখন প্রতিদিন ৫০ টাকা বাঁচানোর সিদ্ধান্ত নেন, তখন আপনি কেবল ৫০ টাকা বাচাচ্ছেন না, বরং আপনি আপনার অবচেতন মস্তিষ্ককে "আর্থিক শৃঙ্খলা ও আত্মনিয়ন্ত্রণ" নামক পেশীটিকে শক্ত করতে শেখাচ্ছেন। এই ক্ষুদ্র অভ্যাসটি যখন ১ বছর, ৩ বছর বা ৫ বছর ধরে চর্চা করা হয়, তখন এটি আপনার লাইফস্টাইলের ডিফল্ট মোড হয়ে যায় এবং হাজার হাজার টাকার অপচয় প্রতিরোধ করে।',
        wisdomEn: 'Saving 100 BDT a day seems insignificant, but over a year it becomes 36,500 BDT. More importantly, it rewires your neural pathways to seek value rather than instant dopamine. Small habits build automatic empires.',
        trapBn: 'তুচ্ছতা অনুধাবন ট্র্যাপ (The Scale Illusion): "অল্প টাকায় কিছু আসে যায় না" ভেবে প্রতিদিন ছোট ছোট ক্যাফে বিল, রিকশা ভাড়া বা চিপস-কোকে ১০০-২০০ টাকা উড়িয়ে দেওয়া, যা মাস শেষে ৪,০০০-৫,০০০ টাকার গর্ত তৈরি করে।',
        trapEn: 'The micro-spending leak: Dismissing small daily purchases as trivial. Tiny daily holes can completely sink a massive financial ship.',
        actionPlanBn: '১. প্রতিদিন একটি নির্দিষ্ট খামে বা ডিজিটাল পকেটে মাত্র ৫০ টাকা হলেও আলাদা রাখুন। মাসের শেষে হিসাবটি দেখে চমকে যাবেন।\n২. প্রতি সপ্তাহে একটি "নো-স্পেন্ড ডে" (টাকা খরচবিহীন দিন) পালনের ছোট খেলা খেলুন।',
        actionPlanEn: '1. Commit to saving a tiny, static amount (e.g. 50 BDT) every single day without exception.\n2. Track your daily saves in this app to see your compounding score grow visually.',
        tags: ['Compounding', 'Micro Savings', 'James Clear']
      },
      {
        id: 'ahf-2',
        chapterBn: 'অধ্যায় ২: পরিবেশের নকশা বা এনভায়রনমেন্ট ডিজাইন',
        chapterEn: 'Chapter 2: Design Your Financial Space',
        titleBn: 'খরচ করাকে কঠিন করুন এবং সঞ্চয় করাকে সহজ করুন',
        titleEn: 'Make Saving Easy and Spending Friction-Heavy',
        quoteBn: '"যদি আপনি কোনো খারাপ অভ্যাস ত্যাগ করতে চান, তবে সেটিকে করার পথটিকে অত্যন্ত কঠিন ও জটিল করে তুলুন।"',
        quoteEn: '"The most successful people don\'t have infinite willpower. They simply design an environment that requires less willpower to make the right choice."',
        wisdomBn: 'আপনার ফোনে যদি শপিং অ্যাপস (Daraz, Foodpanda) ইনস্টল করা থাকে এবং কার্ডে টাকা লোড করা থাকে, তবে বোরিং লাগলেই আপনি অর্ডার করে বসবেন। এটি খুবই স্বাভাবিক কারণ খরচ করার প্রক্রিয়াটি এখন অত্যন্ত সহজ (১-ক্লিক)। যদি আপনি আপনার ফোন থেকে সব কার্ডের ডাটা ডিলিট করে দেন এবং অ্যাপ আনইনস্টল করে দেন, তবে কিছু কিনতে গেলে আপনাকে আবার সব টাইপ করতে হবে। এই সামান্য বাধা বা "ফ্রিকশন" আপনার অবচেতন আবেগ থামিয়ে দেবে। অন্যদিকে, সঞ্চয়ের খামটি আপনার টেবিলের ঠিক সামনে রাখুন যাতে প্রতিদিন সেখানে টাকা রাখা সহজ হয়।',
        wisdomEn: 'If buying a snack takes 1 tap, you will overeat. If you delete food-delivery apps and keep no junk food in your mess room, the friction prevents impulsive eating. Design your digital space to save your money.',
        trapBn: 'সহজ খরচের সুবিধা (Frictionless Buying): ওটিপি পাসওয়ার্ড বা সেভ করা পেমেন্ট মেথড যা আপনার ব্রেনকে চিন্তা করার আগেই টাকা কেটে নেওয়ার সুযোগ দেয়।',
        trapEn: 'Frictionless checkouts: Keeping credit cards or mobile banking credentials pre-saved in browsers, bypassing your rational filter.',
        actionPlanBn: '১. আজই আপনার ফোন থেকে ফুডপান্ডা, দারাজ বা অন্যান্য শপিং অ্যাপস আনইনস্টল করুন।\n২. বিকাশ বা রকেট অ্যাপে আঙ্গুলের ছাপ (Fingerprint/FaceID) লগইন বন্ধ রাখুন, যাতে প্রতিবার পাসওয়ার্ড টাইপ করার কষ্ট আপনাকে কেনার আগে সচেতন করতে পারে।',
        actionPlanEn: '1. Delete pre-saved card credentials from your chrome browser or digital shopping wallets.\n2. Put your physical savings piggy bank in the most visible location on your study desk.',
        tags: ['Environment Design', 'Friction', 'Willpower']
      }
    ]
  },
  {
    id: 'millionaire_next_door',
    titleBn: '🏘️ দ্য মিলিওনেয়ার নেক্সট ডোর',
    titleEn: 'The Millionaire Next Door',
    authorBn: 'টমাস জে. স্ট্যানলি (Thomas J. Stanley)',
    authorEn: 'Thomas J. Stanley',
    color: 'from-blue-600 to-indigo-600',
    descriptionBn: 'বাস্তব মিলিওনেয়াররা দামী সুট বা স্পোর্টস কার চড়ে ঘুরে বেড়ান না, তারা আপনার পাশের সাধারণ বাড়িতেই খুব সাদাসিধে জীবনযাপন করেন।',
    descriptionEn: 'The shocking truth about real wealth: most millionaires live far below their means and hate flashy displays.',
    cards: [
      {
        id: 'mnd-1',
        chapterBn: 'অধ্যায় ১: হাইপার-বাজেটার এবং রক্ষণশীল লাইফস্টাইল',
        chapterEn: 'Chapter 1: Defense Wins the Wealth Game',
        titleBn: 'আসল মিলিওনেয়াররা অত্যন্ত কঠোর ডিফেন্স খেলেন',
        titleEn: 'Frugality as a Primary Tool of Wealth Accumulation',
        quoteBn: '"অধিকাংশ মিলিওনেয়ার দামী ব্র্যান্ডের কাপড় পরেন না, সস্তা সাধারণ গাড়ি চালান এবং মাসের প্রতিটি খরচের জন্য কঠোর বাজেট মেনে চলেন।"',
        quoteEn: '"Many people who live in expensive homes and drive luxury cars do not actually have much wealth. Wealth is what you accumulate, not what you spend."',
        wisdomBn: 'লেখক শত শত বাস্তব মিলিওনেয়ারদের সাক্ষাৎকার নিয়ে আবিষ্কার করেছেন যে, তারা কখনোই বাইরে থেকে নিজেদের ধনী দেখানোর চেষ্টা করেন না। তারা অত্যন্ত হিসেবি এবং বাজেট সচেতন। যারা বাইরে দামী গাড়ি বা কাপড় পরে দেখনদারি করেন, তারা আসলে আয়ের পুরোটাই খরচ করে ফেলছেন, তাদের সঞ্চিত সম্পদ বলতে কিছুই নেই। ধনী হওয়ার মূল চাবিকাঠি হলো "ইনকাম" নয়, বরং "সঞ্চয় ও বাজেট বজায় রাখা" (Great Defense)। আপনি কত আয় করছেন তা কোনো কাজে আসবে না যদি না আপনি ডিফেন্স ভালো খেলতে পারেন।',
        wisdomEn: 'Wealth is not the same as income. If you make a lot of money and spend it all, you aren\'t getting wealthier; you are just living high. Real millionaires are fanatical budgeters who track and audit their bills continuously.',
        trapBn: 'আভিজাত্যের মরীচিকা (The Income-Wealth Illusion): "আমি বেশি আয় করছি মানেই আমি ধনী" - এই ভ্রান্ত ধারণা যা মানুষকে বড় অঙ্কের আয়ের বিপরীতে তার চেয়েও বড় ধার বা খরচ করতে উৎসাহিত করে।',
        trapEn: 'The high-earner trap: Confusing a high paycheck with being wealthy, leading to zero asset-accumulation and lifestyle-slavery.',
        actionPlanBn: '১. আপনার আয় বাড়লেও মেস লাইফস্টাইল বা খাবারের কোয়ালিটি অতিরিক্ত বাড়াবেন না। সাধারণ জীবনযাপনেই গৌরব খুঁজুন।\n২. এই MridhaX অ্যাপের লেজার ফিচারে আপনার প্রতি সপ্তাহের খরচের রেশিও বিশ্লেষণ করুন।',
        actionPlanEn: '1. Live strictly below your means. When tutoring income expands, save 90% of the delta, rather than shifting to a premium room.\n2. Keep a simple, unbranded, high-quality phone instead of upgrading to the latest model on loan.',
        tags: ['Defense', 'Frugality', 'Real Wealth']
      }
    ]
  },
  {
    id: 'rich_dad_poor_dad',
    titleBn: '👨‍👦 রিচ ড্যাড পুওর ড্যাড',
    titleEn: 'Rich Dad Poor Dad',
    authorBn: 'রবার্ট কিয়োসাকি (Robert Kiyosaki)',
    authorEn: 'Robert Kiyosaki',
    color: 'from-cyan-600 to-blue-500',
    descriptionBn: 'অ্যাসেট বনাম লায়াবিলিটির মূল তফাৎ এবং স্কুলের বাইরে বাস্তব জীবনের ফিন্যান্সিয়াল লিটারেসি ও প্রজ্ঞা।',
    descriptionEn: 'The fundamental definition of assets and liabilities, and the essential financial education schools never teach.',
    cards: [
      {
        id: 'rdpd-1',
        chapterBn: 'অধ্যায় ১: অ্যাসেট বনাম লায়াবিলিটি',
        chapterEn: 'Chapter 1: Assets vs Liabilities',
        titleBn: 'যা পকেটে টাকা ঢোকায় বনাম যা টাকা বের করে নেয়',
        titleEn: 'Understand the Difference to Build Real Freedom',
        quoteBn: '"ধনীরা অ্যাসেট বা সম্পদ কেনে, আর দরিদ্র ও মধ্যবিত্তরা লায়াবিলিটি বা দায় কেনে কিন্তু সেগুলোকে ভুল করে সম্পদ মনে করে।"',
        quoteEn: '"An asset puts money in my pocket. A liability takes money out of my pocket. This is all you need to know. If you want to be rich, simply spend your life buying assets."',
        wisdomBn: 'কিয়োসাকির মতে, ফিন্যান্সের সবচেয়ে বড় সূত্র হলো এই সাধারণ সংজ্ঞাটি। অনেকে ভাবেন নিজের বসবাসের বাড়ি বা একটি দামী বাইক হলো তার অ্যাসেট। কিন্তু আসলে তা লায়াবিলিটি, কারণ সেগুলো রক্ষণাবেক্ষণ, জ্বালানি ও ট্যাক্সের জন্য আপনার পকেট থেকে অনবরত টাকা বের করে নিচ্ছে। অন্যদিকে একটি রেন্টাল প্রোপার্টি, স্টক, বা নিজের একটি আয়ের সোর্স হলো অ্যাসেট, কারণ তা আপনার ঘুমন্ত অবস্থাতেও পকেটে টাকা এনে দেয়। স্টুডেন্ট লাইফে আপনার ল্যাপটপটি একটি "অ্যাসেট" হতে পারে যদি আপনি তা দিয়ে ফ্রিল্যান্সিং বা কোডিং শেখেন। কিন্তু কেবল গেম খেলে বা সিনেমা দেখে সময় নষ্ট করলে তা আপনার মূল্যবান সময়ের বড় লায়াবিলিটি।',
        wisdomEn: 'Rich people focus on acquiring income-producing assets (stocks, websites, skills) while poor people acquire liabilities (fancy gadgets, subscriptions, credit-dues) that they think are assets. Assess your belongings.',
        trapBn: 'ভুল সম্পদ চেনা (Asset Illusion): একটি অত্যন্ত দামী ফ্ল্যাগশিপ স্মার্টফোন কিনে নিজেকে সান্ত্বনা দেওয়া যে "এটি আমার কাজের গতি বাড়াবে", অথচ বাস্তবে তা কেবল স্ক্রলিংয়ের সময় অপচয় এবং ব্যাটারি ড্রেইনের কারণ হচ্ছে।',
        trapEn: 'The pseudo-asset trap: Purchasing luxury gadgets or subscription bundles under the self-justification that they are tools for personal productivity.',
        actionPlanBn: '১. আপনার ব্যক্তিগত জীবনের ৩টি প্রধান অ্যাসেট এবং ৩টি প্রধান লায়াবিলিটির তালিকা তৈরি করুন।\n২. আজ থেকে আপনার সমস্ত বাড়তি টাকা এমন কোনো স্কিল বা সফটওয়্যারে ব্যয় করুন যা আপনার দীর্ঘমেয়াদী আয় বাড়াবে।',
        actionPlanEn: '1. Classify your subscription services. If a tool doesn\'t generate income or severe learning, mark it as a liability.\n2. Invest in learning high-value skills or acquiring actual books that expand your cognitive output.',
        tags: ['Assets', 'Liabilities', 'Kiyosaki']
      }
    ]
  },
  {
    id: 'mess_optimization',
    titleBn: '🏢 মেস লাইফ ও লাইফস্টাইল অপ্টিমাইজেশন',
    titleEn: 'Mess & Lifestyle Optimization Masterclass',
    authorBn: 'মৃধাএক্স রিসার্চ টিম (MridhaX Research)',
    authorEn: 'MridhaX Research Lab',
    color: 'from-amber-500 to-orange-500',
    descriptionBn: 'মেস জীবন, স্টুডেন্ট ক্যারিয়ার ও হোস্টেল লাইফের খরচ সাশ্রয় ও অপ্টিমাইজেশনের বাস্তব ও বৈজ্ঞানিক সমাধান বুক।',
    descriptionEn: 'The ultimate survival manual for optimizing hostel costs, shared utility bills, and student budgets.',
    cards: [
      {
        id: 'mo-1',
        chapterBn: 'অধ্যায় ১: মেস মিল ও কিচেন ইকোনমিক্স',
        chapterEn: 'Chapter 1: Mess Meal Mathematics',
        titleBn: 'মেস বাজারের নিখুঁত গণিত ও অপচয় রোধ',
        titleEn: 'How to Prevent Shrinkage and Save on Pantry Bills',
        quoteBn: '"একটি মেসে ২৫% খাবার অপচয় হয় কেবল সঠিক তদারকি, বাজার করার টাইমিং এবং মিল চালুর হিসাবের অভাবে।"',
        quoteEn: '"Bulk purchasing at wholesale hours combined with sharp monitoring of pantry stock reduces student mess bills by up to 25% instantly."',
        wisdomBn: 'মেসে খাবার খরচের একটি বড় অংশ নষ্ট হয় খুচরো বাজারে এবং শেষ মুহূর্তে কাঁচা বাজার করার কারণে। সবসময় চেষ্টা করুন সপ্তাহে ১ দিন সকালে পাইকারি কাঁচা বাজারে গিয়ে বড় লটে বাজার করতে। আলু, পেঁয়াজ, ডাল, তেল এগুলো সরাসরি বাল্ক বা বস্তা হিসেবে কিনুন। মেসের ম্যানেজার প্রতি সপ্তাহে পরিবর্তন না করে এমন কাউকে দায়িত্ব দিন যে ফিন্যান্সিয়ালি সচেতন। মিল অফ করার নিয়ম কঠোর করুন যাতে কেউ না খেয়ে থাকলেও তার মিল চার্জ মেসের ওপর লোড না হয়।',
        wisdomEn: 'Pantry costs escalate when mess members buy groceries in small daily quantities from retail corner shops. Always pool and buy dry supplies (rice, oil, lentils, soap) in bulk from wholesale hubs on early weekend mornings.',
        trapBn: 'শেষ মুহূর্তের বাজারের ফাঁদ (Retail Squeeze): অলসতার কারণে সকালের পাইকারি বাজার না করে রাতের শেষ মুহূর্তে গলির মোড়ের দোকান থেকে অতিরিক্ত দামে প্রয়োজনীয় মসলা বা ডাল কেনা।',
        trapEn: 'The convenience penalty: Buying minor quantities of ingredients from nearby high-priced convenience stores due to lack of planning.',
        actionPlanBn: '১. মেসের জন্য একটি "ডিজিটাল স্টক বুক" রাখুন (খাতা বা অ্যাপ)।\n২. কোনো ছুটির দিনে পুরো মেসের সদস্যরা মিলে পাইকারি বড় বাজারে গিয়ে পুরো মাসের ডাল, তেল ও চাল কিনে ফেলুন।',
        actionPlanEn: '1. Schedule a monthly wholesale shopping run with a fellow mess member to secure standard non-perishables.\n2. Keep a physical ledger sheet in the kitchen to log precisely how many eggs/lentils are cooked per meal.',
        tags: ['Mess Life', 'Food Cost', 'Bulk Buying']
      },
      {
        id: 'mo-2',
        chapterBn: 'অধ্যায় ২: ওয়াইফাই ও প্রযুক্তি শেয়ারিং',
        chapterEn: 'Chapter 2: Shared Tech & Utility Pooling',
        titleBn: 'ডিজিটাল রিসোর্স শেয়ারিংয়ের মাধ্যমে পকেট বাঁচানো',
        titleEn: 'Pooling Subscriptions and Bandwidth to Cut Tech Surcharges',
        quoteBn: '"আলাদা আলাদা ৪টি ইন্টারনেট কানেকশন বা ওটিটি সাবস্ক্রিপশন ব্যবহার করার চেয়ে মেসের সবাই মিলে ১টি শেয়ারড কানেকশন ব্যবহার করা ৮০% সাশ্রয়ী।"',
        quoteEn: '"Do not pay multiple single bills for the same ambient resource. Pool internet bandwidth and family streaming plans to divide overhead costs."',
        wisdomBn: 'অনেকেই রুমে আলাদাভাবে ডাবল ব্র্যান্ডউইথ বা ওটিটি সাবস্ক্রিপশন ব্যবহার করেন। মেসে শেয়ার্ড হাই-স্পিড ওয়াইফাই রাউটার বসান এবং ভালো মানের রিপিটার বা ক্যাবল ব্যবহার করুন যাতে প্রতিটি রুমে সমান স্পিড পাওয়া যায়। সাবস্ক্রিপশন সার্ভিস যেমন ক্যানভা, স্পটিফাই, নেটফ্লিক্স বা ইউটিউব প্রিমিয়াম সবসময় বন্ধুদের সাথে "ফ্যামিলি প্যাক" হিসেবে শেয়ার করুন। একা পুরো ফি দেওয়া একটি ফিন্যান্সিয়াল বোকামি, যা অনায়াসে এড়ানো সম্ভব।',
        wisdomEn: 'Tech bills are recurring liabilities that quietly drain student wallets. Run a high-quality shared Wi-Fi router for the entire apartment floor and split the monthly broadband bill. Share multi-user software licenses.',
        trapBn: 'ব্যক্তিগত অহংকারের অবচেতন ফাঁদ (Single-user Pride): "আমি কারো সাথে শেয়ার করবো না, নিজেরটা নিজেই চালাবো" - এই ইগো ফিন্যান্সিয়াল সাশ্রয়কে ব্যাহত করে।',
        trapEn: 'Ego billing: Refusing to pool resources with flatmates due to temporary convenience or pride, paying 5x more in the process.',
        actionPlanBn: '১. আপনার ফ্ল্যাট বা রুমমেটদের সাথে বসুন এবং তাদের জিজ্ঞেস করুন কার কার কোন সাবস্ক্রিপশন বা সার্ভিস রয়েছে।\n২. সেগুলোকে মার্জ করে ফ্যামিলি প্যাকে রূপান্তর করুন এবং বিল সমানভাগে ভাগ করে নিন।',
        actionPlanEn: '1. Audit the apartment floor. Convert separate individual broadband setups into a single premium shared optical line.\n2. Split Netflix/Youtube Premium accounts strictly among trusted students.',
        tags: ['Tech Sharing', 'Utility Slashes', 'Cooperation']
      },
      {
        id: 'mo-3',
        chapterBn: 'অধ্যায় ৩: আড্ডার ডোপামিন হ্যাক ও ক্যাফে খরচ',
        chapterEn: 'Chapter 3: Chatting Dopamine & Cafe Spending',
        titleBn: 'দামী ক্যাফে এড়িয়ে জিরো-কস্ট বিনোদনের অভ্যাস',
        titleEn: 'Socializing Without Spending: The Rooftop Alternative',
        quoteBn: '"বন্ধুদের সাথে আড্ডা দেওয়া বা গল্প করার উদ্দেশ্য হলো মানসিক প্রশান্তি ও সামাজিক সংযোগ। এর জন্য প্রতিবার ৩০০ টাকার প্রিমিয়াম কফি বা বার্গার কেনার কোনো যৌক্তিকতা নেই।"',
        quoteEn: '"The value of friendship is in mutual exchange, deep conversations, and shared laughter—not in the luxury of the dining table where you meet."',
        wisdomBn: 'আমরা বন্ধুদের সাথে দেখা করার জন্য প্রায়ই দামী ডেকোরেশনের কফি শপ বা ফাস্টফুডের দোকানে যাই। সেখানে আড্ডার চেয়ে খাবারের অতিরিক্ত বিলই প্রধান আলোচনার বিষয় হয়ে দাঁড়ায়। আড্ডার বিকল্প ও শূন্য খরচের অপশনগুলো খুঁজুন। মেসের ছাদ, স্থানীয় কোনো পার্ক, লেক বা খেলার মাঠ আড্ডার জন্য সবচেয়ে চমৎকার জায়গা। এতে আপনার স্বাস্থ্যও ভালো থাকবে এবং পকেটে কোনো কুপ্রভাব পড়বে না।',
        wisdomEn: 'Visual cafes are engineered to extract heavy bills for aesthetic seating. Shift your weekend group huddles to open parks, calm lake shores, or the apartment rooftop. Bring your own flask of home-brewed tea.',
        trapBn: 'আড্ডার বাহ্যিকতা (Visual Cafe Trap): সোশ্যাল মিডিয়ায় বা ইন্সটাগ্রামে দামী ক্যাফের কফি কাপের ছবি আপলোড করার প্রলোভন, যা সাময়িক প্রশংসা আনলেও দীর্ঘমেয়াদে আপনার মানিব্যাগ শুন্য করে দেয়।',
        trapEn: 'The Aesthetic Squeeze: Hanging out in photogenic cafes purely to capture social media stories, sacrificing your weekly tutoring wage in one hour.',
        actionPlanBn: '১. বন্ধুদের সাথে আড্ডার স্থান নির্ধারণ করার সময় খোলা উদ্যান, পার্ক বা মেসের ছাদ সাজেস্ট করুন।\n২. মেস বা রুমে চা বানিয়ে ফ্লাস্কে করে সাথে নিয়ে পার্কে যান। এটি অনেক বেশি আনন্দদায়ক এবং ৮০% সাশ্রয়ী।',
        actionPlanEn: '1. Pitch outdoor natural locations (parks, fields) or campus stairs as primary meeting spots for weekend study groups.\n2. Carry home-brewed milk tea in a flask. It is cooler, healthier, and extremely cheap.',
        tags: ['Social Budgeting', 'Zero Cost Fun', 'Health']
      }
    ]
  }
];
