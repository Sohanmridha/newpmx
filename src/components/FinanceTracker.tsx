import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  Coins, 
  TrendingDown, 
  Scale, 
  FileQuestion, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  TrendingUp, 
  BookOpen, 
  Sparkles, 
  Search, 
  ChevronRight, 
  ChevronLeft,
  Bookmark,
  Info,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
  Award,
  Smartphone,
  Compass,
  Target,
  X,
  Handshake,
  Calendar,
  User,
  CheckCircle,
  MessageSquare,
  Clock,
  AlertCircle
} from 'lucide-react';
import { FINANCIAL_BOOKS_DATA, FinancialBook, BookCard } from '../data/financialBooks';
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { AppState, FinanceTransaction, DebtItem } from '../types';

interface FinanceTrackerProps {
  state: AppState;
  saveState: (newState: AppState) => void;
}

// 200+ Money Saving Ideas grouped into 10 core categories
const FINANCE_IDEAS_CATEGORIES = [
  {
    id: 'food',
    titleBn: '🍔 মেস ও খাবার খরচ কমানো (Food & Mess Optimization)',
    titleEn: '🍔 Food & Mess Optimization',
    icon: Coins,
    color: 'from-amber-500 to-orange-500',
    ideas: [
      { id: 'f-1', textBn: 'মিল বন্ধ করার সময় হিসাব রাখুন, বাইরে খাওয়ার চেয়ে মেসের খাবার নিয়মিত খান।', textEn: 'Keep track of your mess meals. Turn off meals on time and avoid waste.' },
      { id: 'f-2', textBn: 'বাইরে খাওয়ার অভ্যাস সপ্তাহে ১ বারে নামিয়ে আনুন, এতে অন্তত ২০% খরচ বাঁচবে।', textEn: 'Limit eating out to once a week. This saves at least 20% of your budget.' },
      { id: 'f-3', textBn: 'মেসের জন্য পাইকারি বাজার করুন (ডাল, তেল, আলু, পেঁয়াজ), খুচরা ক্রয়ে দাম বেশি পড়ে।', textEn: 'Buy pantry essentials (oil, rice, potatoes) in bulk. Retail costs are always higher.' },
      { id: 'f-4', textBn: 'অপ্রয়োজনে দামী কফি বা কোমল পানীয় এড়িয়ে চলুন, সাধারণ পানি সবচেয়ে সাশ্রয়ী ও স্বাস্থ্যকর।', textEn: 'Avoid overpriced coffees and sugary sodas. Water is healthier and free.' },
      { id: 'f-5', textBn: 'বিকেলের নাস্তায় ফাস্টফুডের বদলে ঘরে তৈরি মুড়ি-ছোলা বা কলা-ডিম বেছে নিন।', textEn: 'Choose homemade snacks like boiled eggs or bananas over deep-fried fast food.' },
      { id: 'f-6', textBn: 'রেস্টুরেন্টে বিল শেয়ারিং বা ডাচ সিস্টেমে বিল দিন, একা পুরো বিল দেওয়ার আবেগ পরিহার করুন।', textEn: 'Always split restaurant bills evenly. Avoid the emotional urge to pay for everyone.' },
      { id: 'f-7', textBn: 'ফ্রিজে খাবার সংরক্ষণে সতর্ক থাকুন যাতে নষ্ট না হয়, নষ্ট খাবার মানেই নষ্ট টাকা।', textEn: 'Store leftover food properly in the fridge. Wasted food is wasted money.' },
      { id: 'f-8', textBn: 'বাইরে যাওয়ার সময় সাথে একটি পানির বোতল রাখুন, প্রতিবার ২৫ টাকা দিয়ে বোতল কেনা বন্ধ হবে।', textEn: 'Always carry a reusable water bottle. Stop spending money on plastic water bottles.' },
      { id: 'f-9', textBn: 'টংয়ের দোকানে প্রতিদিন অতিরিক্ত চা-সিগারেট বা আড্ডার খরচ মাস শেষে বড় আকার নেয়।', textEn: 'Daily tea and snacks at local stalls add up to a huge hidden expense.' },
      { id: 'f-10', textBn: 'রান্নায় অতিরিক্ত তেল-মশলার ব্যবহার কমান, এতে গ্যাস ও মসলার খরচ কমবে এবং লিভার ভালো থাকবে।', textEn: 'Reduce excess cooking oil and spices. It saves fuel costs and boosts your health.' },
      { id: 'f-11', textBn: 'টিফিন বা লাঞ্চ বক্সে খাবার বহন করার অভ্যাস গড়ুন, এটি একটি সম্মানজনক ও সাশ্রয়ী লাইফস্টাইল।', textEn: 'Pack your lunch for classes or work. It is a highly respected, cost-effective habit.' },
      { id: 'f-12', textBn: 'ক্ষুধার্ত অবস্থায় সুপারশপ বা বাজারে যাবেন না, ক্ষুধার চোটে বেশি ও অপ্রয়োজনীয় খাবার কেনা হয়।', textEn: 'Never go grocery shopping when hungry. You will buy 30% more junk food.' },
      { id: 'f-13', textBn: 'মাছ-মাংসের পাশাপাশি ডিম ও ডাল জাতীয় প্রোটিন বেশি রাখুন, যা পুষ্টিকর এবং বাজেট-বান্ধব।', textEn: 'Balance proteins with eggs and lentils. Highly nutritious and incredibly cheap.' },
      { id: 'f-14', textBn: 'খাবারের অপচয় কমাতে থালায় ততটুকুই নিন যতটুকু খেতে পারবেন।', textEn: 'Take only what you can finish. Respect food and avoid wasting hard-earned money.' },
      { id: 'f-15', textBn: 'আশেপাশের সস্তা ও স্বাস্থ্যকর মেস বা হোটেলের তালিকা তৈরি করে রাখুন।', textEn: 'Keep a mental list of local budget-friendly and clean eateries.' },
      { id: 'f-16', textBn: 'খাদ্য সামগ্রী কেনার সময় এক্সপায়ারি ডেট চেক করুন, মেয়াদ্দোত্তীর্ণ খাবার বড় অপচয়।', textEn: 'Check food expiration dates before purchasing to avoid throwing expired goods away.' },
      { id: 'f-17', textBn: 'গ্রুপ স্টাডির সময় চিপস-কোকের বদলে সাধারণ বাদাম বা ছোলা রাখুন, যা মস্তিষ্কের জন্যও ভালো।', textEn: 'Swap chips and sodas with nuts or chickpeas during study group sessions.' },
      { id: 'f-18', textBn: 'সিজনাল ফল ও সবজি কিনুন, অমৌসুমী ফলের দাম অতিরিক্ত এবং প্রিজারভেটিভযুক্ত থাকে।', textEn: 'Buy seasonal fruits and vegetables. Off-season items are costly and less fresh.' },
      { id: 'f-19', textBn: 'মেসে খাবার চুরির হাত থেকে বাঁচতে এবং অপচয় রোধে কিচেনের সঠিক তদারকি রাখুন।', textEn: 'Ensure smooth kitchen monitoring in the mess to avoid ingredient shrinkage.' },
      { id: 'f-20', textBn: 'খাবারের একটি সাপ্তাহিক রুটিন মেনে চলুন, এতে প্রতিদিন কী রান্না হবে তা নিয়ে বাড়তি খরচ হবে না।', textEn: 'Design a weekly menu. It reduces impulsive shopping for fast alternatives.' },
      { id: 'f-21', textBn: 'বাইরের ফ্রোজেন ফুডের বদলে তাজা খাবার রান্না করে খান, ফ্রোজেন ফুডের দাম বেশি।', textEn: 'Cook fresh meals instead of buying expensive pre-packaged frozen items.' },
      { id: 'f-22', textBn: 'অনুষ্ঠান বা পার্টিতে দাওয়াত থাকলে সেই বেলার মেসের মিল আগে থেকেই অফ রাখুন।', textEn: 'Cancel your mess meals if you are invited to a party or feast.' },
      { id: 'f-23', textBn: 'চা তৈরির সময় বাড়তি চিনি ও দুধের সাশ্রয় করতে মাঝে মাঝে রঙ চা বা গ্রিন টি খান।', textEn: 'Drink black tea or green tea occasionally to save on milk and sugar.' },
      { id: 'f-24', textBn: 'খাবারের মূল্যের চেয়ে পুষ্টিমানের ওপর জোর দিন, দামী খাবার মানেই পুষ্টিকর নয়।', textEn: 'Focus on nutritional value rather than price. Cheap food can be highly healthy.' },
      { id: 'f-25', textBn: 'বন্ধুদের সাথে আড্ডার সময় দামী ক্যাফের বদলে মেসের ছাদে বা পার্কে সময় কাটান।', textEn: 'Hang out on your rooftop or a park instead of expensive visual cafes.' }
    ]
  },
  {
    id: 'studies',
    titleBn: '📚 পড়াশোনা ও বইপত্র খরচ (Academic Cost Optimization)',
    titleEn: '📚 Academic Cost Optimization',
    icon: BookOpen,
    color: 'from-blue-500 to-indigo-500',
    ideas: [
      { id: 's-1', textBn: 'নতুন বই কেনার আগে নীলক্ষেত বা পুরোনো বইয়ের দোকান থেকে সেকেন্ড হ্যান্ড বই খুঁজুন।', textEn: 'Always check second-hand bookstores first before buying brand-new textbooks.' },
      { id: 's-2', textBn: 'লাইব্রেরী মেম্বারশিপ নিন এবং বই না কিনে লাইব্রেরী থেকে নিয়ে পড়ার অভ্যাস করুন।', textEn: 'Get a library card. Borrowing books instead of buying them saves thousands.' },
      { id: 's-3', textBn: 'বন্ধুদের সাথে একই বই শেয়ার করে পড়ুন অথবা বইয়ের সফট কপি (PDF) ব্যবহার করুন।', textEn: 'Share reference books with friends, or use electronic PDF versions.' },
      { id: 's-4', textBn: 'অপ্রয়োজনে কালার প্রিন্ট বা লেমিনেটিং করা বন্ধ করুন, সাধারণ প্রিন্টই ক্লাসের জন্য যথেষ্ট।', textEn: 'Avoid fancy color printing or laminating. Standard duplex black and white is enough.' },
      { id: 's-5', textBn: 'খাতা বা নোটপ্যাডের দুই পৃষ্ঠা সম্পূর্ণ ব্যবহার করুন, পেপার অপচয় করা বন্ধ করুন।', textEn: 'Utilize both sides of writing papers. Stop leaving pages half-written.' },
      { id: 's-6', textBn: 'দামী কোনো কোচিং সেন্টারে ভর্তি হওয়ার আগে ইউটিউব বা ফ্রি অনলাইন লেকচারগুলো দেখুন।', textEn: 'Search for quality YouTube crash courses before enrolling in expensive offline coachings.' },
      { id: 's-7', textBn: 'গ্রুপ স্টাডি করুন, এতে একজনের কেনা রেফারেন্স বই থেকে সবাই নোট নিতে পারবেন।', textEn: 'Participate in group study. Sharing and discussing saves individual materials cost.' },
      { id: 's-8', textBn: 'স্টাডি মেটেরিয়াল গুছিয়ে রাখুন, যাতে এক জিনিস পুনরায় প্রিন্ট বা ফটোকপি করতে না হয়।', textEn: 'Organize study files neatly. Prevents photocopying the same syllabus twice.' },
      { id: 's-9', textBn: 'অপ্রয়োজনীয় পেইড অনলাইন কোর্সের সাবস্ক্রিপশন এড়িয়ে চলুন, ফ্রীতেই চমৎকার রিসোর্স পাওয়া যায়।', textEn: 'Cancel unused online course subscriptions. Massive free resources exist everywhere.' },
      { id: 's-10', textBn: 'পরীক্ষার পর নিজের সিলেবাসের বই জুনিয়রদের কাছে বিক্রি করে কিছু ফান্ড সংগ্রহ করতে পারেন।', textEn: 'Sell your finished semester books to juniors to unlock cash flow.' },
      { id: 's-11', textBn: 'অ্যাসাইনমেন্ট বা থিসিসের জন্য সস্তা বাল্ক প্রিন্টিং শপগুলো চিনে রাখুন।', textEn: 'Locate local discount print shops for bulk printing projects.' },
      { id: 's-12', textBn: 'দামী বৈজ্ঞানিক ক্যালকুলেটর সেকেন্ড হ্যান্ড কিনুন অথবা নির্ভরযোগ্য সাইট থেকে ধার নিন।', textEn: 'Buy scientific calculators second-hand or borrow them from seniors.' },
      { id: 's-13', textBn: 'অনলাইন ডকুমেন্টস পড়তে ল্যাপটপ বা ফোনের নাইট শিফট মোড অন করে ই-রিডার অ্যাপ ব্যবহার করুন।', textEn: 'Use night mode on e-readers to study PDFs without buying printed copies.' },
      { id: 's-14', textBn: 'ক্লাসের লেকচার ডায়েরিতে সুন্দর করে লিখে রাখুন যাতে বাড়তি গাইড বই কিনতে না হয়।', textEn: 'Take premium classroom notes to bypass purchasing external solved guides.' },
      { id: 's-15', textBn: 'অনলাইন লাইব্রেরী বা ওপেন-সোর্স রিসার্চ পোর্টালগুলো (যেমন Google Scholar) ব্যবহার করুন।', textEn: 'Utilize open-source research portals like Google Scholar to save subscription fees.' },
      { id: 's-16', textBn: 'ইউটিউব একাডেমীর ফ্রি প্লেলিস্ট ব্যবহার করে নিজে নিজে কঠিন টপিকগুলো শিখুন।', textEn: 'Master complex academic topics by watching free structured YouTube playlists.' },
      { id: 's-17', textBn: 'বন্ধুদের সাথে খাতা বা স্টেশনারি জিনিসপত্র হোলসেল বা পাইকারি মূল্যে একসাথে কিনুন।', textEn: 'Group-buy stationary items from wholesale markets to save up to 40%.' },
      { id: 's-18', textBn: 'পরীক্ষার ফি শেষ সময়ের জরিমানার হাত থেকে বাঁচতে সময়মতো পরিশোধ করুন।', textEn: 'Pay exam registration fees on time to avoid late fines.' },
      { id: 's-19', textBn: 'পড়ালেখার জন্য নিজস্ব রুটিন তৈরি করুন, অপ্রয়োজনীয় প্রাইভেট টিউটর রাখার দরকার হবে না।', textEn: 'Self-study rigorously; you will save heavily on private tutors.' },
      { id: 's-20', textBn: 'বিগত বছরের প্রশ্নগুলো ডিজিটাল ফরম্যাটে ফোনে বা ল্যাপটপে সংরক্ষণ করুন।', textEn: 'Maintain a digital archive of previous exam questions instead of printing.' }
    ]
  },
  {
    id: 'devices',
    titleBn: '⚡ ডিভাইস, ইন্টারনেট ও রিচার্জ (Tech & Telecommunication)',
    titleEn: '⚡ Tech & Telecommunication',
    icon: Smartphone,
    color: 'from-sky-500 to-cyan-500',
    ideas: [
      { id: 'd-1', textBn: 'মোবাইল রিচার্জে ছোট ছোট অফার না কিনে মান্থলি বড় প্যাক কিনুন, এতে জিবি প্রতি খরচ কম হয়।', textEn: 'Buy monthly bulk internet packs. Small daily micro-packs cost 3x more per GB.' },
      { id: 'd-2', textBn: 'মেস বা হোস্টেলে শেয়ার্ড ওয়াইফাই ব্যবহার করুন, মোবাইল ডাটার পেছনে ডাবল খরচ কমবে।', textEn: 'Utilize shared high-speed mess Wi-Fi. Mobile data drains money rapidly.' },
      { id: 'd-3', textBn: 'অপ্রয়োজনীয় অ্যাপ মেম্বারশিপ বা ক্লাউড স্টোরেজ সাবস্ক্রিপশন বাতিল করুন।', textEn: 'Prune unused app subscriptions or unnecessary premium cloud storages.' },
      { id: 'd-4', textBn: 'ফোন বা ল্যাপটপের ব্যাটারি লাইফ ভালো রাখতে সঠিক চার্জিং নিয়ম মেনে চলুন, আয়ু বাড়বে।', textEn: 'Maintain 20%-80% battery limits to extend device lifespans and avoid replacements.' },
      { id: 'd-5', textBn: 'নতুন ট্রেন্ডি ফোন বাজারে এলেই কেনার জন্য অস্থির হবেন না, বর্তমান ফোনটি অন্তত ৩ বছর চালান।', textEn: 'Resist buying new phone releases. Aim to run your current device for 3+ years.' },
      { id: 'd-6', textBn: 'ফ্রী ওয়াইফাই জোনে থাকার সময় প্রয়োজনীয় বড় ভিডিও বা বইগুলো অফলাইনে ডাউনলোড করে রাখুন।', textEn: 'Download lectures or reference PDFs when connected to free institutional Wi-Fi.' },
      { id: 'd-7', textBn: 'ডিভাইস বা ল্যাপটপের সামান্য ত্রুটি নিজে ইউটিউব দেখে ফিক্স করা শিখুন, সার্ভিসিং চার্জ বাঁচবে।', textEn: 'Learn minor software diagnostic skills on YouTube to bypass servicing fees.' },
      { id: 'd-8', textBn: 'মোবাইলে অপ্রয়োজনীয় মেসেজ প্যাক বা কলার টিউন সার্ভিস বন্ধ করে রাখুন।', textEn: 'Disable value-added services, caller tunes, and SMS alerts on your SIM.' },
      { id: 'd-9', textBn: 'ল্যাপটপে এন্টিভাইরাস কিনতে হবে না, উইন্ডোজের ডিফল্ট ডিফেন্ডারই সুরক্ষার জন্য যথেষ্ট।', textEn: 'Avoid commercial antivirus suites. Windows Defender provides top-tier security.' },
      { id: 'd-10', textBn: 'মোবাইল বা ল্যাপটপের জন্য ভালো মানের প্রটেক্টিভ কেস ও গ্লাস ব্যবহার করুন যাতে হাত থেকে পড়লে বড় ক্ষতি না হয়।', textEn: 'Invest in a rugged case and tempered glass to safeguard devices from expensive screen breaks.' },
      { id: 'd-11', textBn: 'ব্যক্তিগত কাজে ওপেন সোর্স ও ফ্রি সফটওয়্যার ব্যবহার করুন (যেমন LibreOffice)।', textEn: 'Use open-source software like LibreOffice or Google Docs to save license fees.' },
      { id: 'd-12', textBn: 'নেটফ্লিক্স, স্পটিফাই বা ইউটিউব প্রিমিয়াম ফ্যামিলি প্ল্যানে বন্ধুদের সাথে শেয়ার করে নিন।', textEn: 'Share family subscription plans with friends to cut premium costs to a fraction.' },
      { id: 'd-13', textBn: 'ঘুমানোর সময় রাউটার বা অতিরিক্ত ইলেকট্রনিক্স বন্ধ রাখুন, বিদ্যুৎ বিল বাঁচবে।', textEn: 'Turn off heavy chargers and Wi-Fi routers at night to save on utility bills.' },
      { id: 'd-14', textBn: 'বিনা কারণে ডাটা অন রাখবেন না, ব্যাকগ্রাউন্ড ডাটা ইউজ হয়ে দ্রুত মেগাবাইট শেষ হয়ে যায়।', textEn: 'Disable mobile data when not in use. Background syncs quietly eat up GBs.' },
      { id: 'd-15', textBn: 'অপ্রয়োজনীয় গ্যাজেটস (যেমন একাধিক ইয়ারফোন, গেমপ্যাড) কেনা থেকে নিজেকে বিরত রাখুন।', textEn: 'Stop buying impulse tech accessories like multiple earphones or stylish gaming controllers.' },
      { id: 'd-16', textBn: 'মোবাইল ব্যালেন্স চেক করে রাখুন, অনেক সময় ট্র্যাকিং ছাড়া টাকা কেটে নেওয়া সার্ভিস সচল থাকে।', textEn: 'Periodically monitor your mobile balance to verify auto-renew services.' },
      { id: 'd-17', textBn: 'একটি নির্ভরযোগ্য পাওয়ার ব্যাংক রাখুন, বাইরে থাকলে ফোন বন্ধ হওয়া বা ক্যাফেতে চার্জ দেওয়ার ঝামেলা এড়ানো যাবে।', textEn: 'Carry a reliable power bank to avoid paid charging slots or emergency phone lockouts.' },
      { id: 'd-18', textBn: 'ল্যাপটপের র‍্যাম বা এসএসডি নিজে আপগ্রেড করতে শিখুন, মেকানিকের কাছে যাওয়ার প্রয়োজন নেই।', textEn: 'Learn to swap RAM or SSDs yourself. It is extremely simple and saves money.' },
      { id: 'd-19', textBn: 'অপ্রয়োজনীয় নোটিফিকেশন বন্ধ রাখুন, স্ক্রিন অন হওয়া কমলে চার্জ বেশিক্ষণ থাকবে।', textEn: 'Disable notification spam to preserve battery health and decrease electricity cycles.' },
      { id: 'd-20', textBn: 'অপারেটরদের ক্যাশব্যাক অফার বা রিচার্জ ডিলগুলো ব্যবহার করুন সাশ্রয়ের জন্য।', textEn: 'Leverage cashback rewards or digital wallet recharge campaigns.' }
    ]
  },
  {
    id: 'commute',
    titleBn: '🚶 ಯಾತಾಯಾತ ও ভ্রমণ (Commute & Micro-Savings)',
    titleEn: '🚶 Commute & Micro-Savings',
    icon: Compass,
    color: 'from-emerald-500 to-teal-500',
    ideas: [
      { id: 'c-1', textBn: '১ কিলোমিটারের কম দূরত্বের জন্য রিকশা না নিয়ে হেঁটে যান, শরীরও ভালো থাকবে টাকাও বাঁচবে।', textEn: 'Walk short distances under 1km. It benefits your cardio fitness and saves money.' },
      { id: 'c-2', textBn: 'লোকাল বাস বা ভার্সিটির বাসে যাতায়াত করুন, রাইড শেয়ারিং বা সিএনজি এড়িয়ে চলুন।', textEn: 'Use institutional shuttles or public transit instead of expensive Uber rides.' },
      { id: 'c-3', textBn: 'বন্ধুদের সাথে কোথাও গেলে রিকশা বা রাইডের ভাড়া সমানভাগে ভাগ করে নিন।', textEn: 'Always pool and split taxi/rickshaw fares when traveling with friends.' },
      { id: 'c-4', textBn: 'যাতায়াতের জন্য একটি সাইকেল কিনে নিতে পারেন, এটি দীর্ঘমেয়াদে ১০০% সাশ্রয়ী।', textEn: 'Invest in a bicycle. It is a one-time purchase that eliminates fuel or transit fees.' },
      { id: 'c-5', textBn: 'তাড়াহুড়ো এড়াতে ১০ মিনিট আগে বের হন, এতে অতিরিক্ত ভাড়া দিয়ে ইমার্জেন্সি রাইড নিতে হবে না।', textEn: 'Leave 15 minutes early to avoid paying premium surge pricing for rushed commutes.' },
      { id: 'c-6', textBn: 'যাতায়াতের মান্থলি রুট পাস বা মেট্রোরেল কার্ড থাকলে তা ব্যবহার করুন, ছাড় পাবেন।', textEn: 'Purchase transit passes or Metro/bus cards to unlock travel discounts.' },
      { id: 'c-7', textBn: 'দূরের যাত্রায় ট্রেনের টিকিট আগে থেকে কেটে রাখুন, শেষ মুহূর্তে বাসের ডাবল ভাড়া বাঁচবে।', textEn: 'Book train tickets in advance. Avoid last-minute expensive sleeper buses.' },
      { id: 'c-8', textBn: 'বাসে বা যাতায়াতকালে পকেটমার সম্পর্কে সতর্ক থাকুন, অসাবধানতায় বড় লোকসান হতে পারে।', textEn: 'Be highly vigilant of pickpockets on public transit to avoid catastrophic losses.' },
      { id: 'c-9', textBn: 'ভ্রমণের সময় হালকা ব্যাকপ্যাক ব্যবহার করুন, অতিরিক্ত লাগেজ বা কুলির চার্জ বাঁচবে।', textEn: 'Travel light with a single backpack. Avoid extra luggage or helper fees.' },
      { id: 'c-10', textBn: 'আশেপাশের দর্শনীয় স্থানে ঘুরুন, অনেক দূরে দামী ট্যুর দেওয়ার চেয়ে বাজেট ট্রাভেল অনেক ভালো।', textEn: 'Explore local historical spots. Budget day-trips are as fulfilling as luxury stays.' },
      { id: 'c-11', textBn: 'হাঁটার সময় জিপিএস ট্র্যাকার ব্যবহার করে ছোট রাস্তাগুলো খুঁজে বের করুন।', textEn: 'Map out shorter pedestrian shortcuts in your town to save walking time.' },
      { id: 'c-12', textBn: 'যাতায়াতের সময় হেডফোনে লার্নিং পডকাস্ট শুনুন, এতে ট্রাফিক জ্যামের সময়ও মূল্যবান জ্ঞান পাবেন।', textEn: 'Listen to educational podcasts during commutes to turn transit time into wealth.' },
      { id: 'c-13', textBn: 'গ্রুপ ট্যুরের সময় বড় টিম নিয়ে মাইক্রোবাস বা নৌকা ভাড়া করুন, শেয়ারিংয়ে খরচ অনেক কমে।', textEn: 'Rent shared vehicles in large groups to minimize individual travel rates.' },
      { id: 'c-14', textBn: 'রেলওয়ে বা স্টেশনের অতিরিক্ত মূল্যের স্ন্যাক্স না কিনে বাড়ি থেকে কিছু খাবার সাথে নিন।', textEn: 'Carry light travel snacks from your mess instead of buying overpriced food at stations.' },
      { id: 'c-15', textBn: 'রিকশায় ওঠার আগে ভাড়া ফিক্সড করে নিন, গন্তব্যে গিয়ে অতিরিক্ত বাগবিতণ্ডা ও বাড়তি ভাড়া এড়ানো যাবে।', textEn: 'Always negotiate rickshaw fares before climbing in to prevent inflated fees.' },
      { id: 'c-16', textBn: 'বৃষ্টির সময় বা প্রতিকূল আবহাওয়ায় রাইড শেয়ারিংয়ের ভাড়া বাড়ে, একটু সময় নিয়ে অপেক্ষা করুন।', textEn: 'Wait out high rain surge pricing instead of ordering rides immediately.' },
      { id: 'c-17', textBn: 'ভ্রমণের জন্য স্টুডেন্ট ডিসকাউন্ট ব্যবহারের সুযোগ থাকলে সবসময় নিজের আইডি কার্ড সাথে রাখুন।', textEn: 'Always carry your student ID card to avail student travel and ticket discounts.' },
      { id: 'c-18', textBn: 'অনুকূল আবহাওয়া থাকলে রোদের মধ্যে ছাতা ব্যবহার করে হেঁটে যান, রিকশার প্রয়োজন নেই।', textEn: 'Use an umbrella in hot sun or light rain to comfortably walk to your destination.' },
      { id: 'c-19', textBn: 'যাতায়াতের খরচ একটি ডায়েরিতে ট্র্যাক করুন, হিসাব রাখলে অবচেতন অপচয় কমে যায়।', textEn: 'Log your monthly transport costs. Awareness instantly drops wasteful travels.' },
      { id: 'c-20', textBn: 'লিফট ব্যবহারের চেয়ে সিঁড়ি দিয়ে ওঠানামা করুন, বিদ্যুৎ সাশ্রয় ছাড়াও এটি চমৎকার শরীরচর্চা।', textEn: 'Take the stairs instead of the elevator. Great for fitness and lowers peak power demand.' }
    ]
  },
  {
    id: 'psychology',
    titleBn: '🧠 অবচেতন খরচের মানসিক ফাঁদ (Psychological Spending Traps)',
    titleEn: '🧠 Psychological Spending Traps',
    icon: Target,
    color: 'from-pink-500 to-rose-500',
    ideas: [
      { id: 'p-1', textBn: '৩০ দিনের নিয়ম মেনে চলুন: দামী কিছু পছন্দ হলে সাথে সাথে না কিনে ৩০ দিন অপেক্ষা করুন।', textEn: 'Practice the 30-Day Rule. Delay non-essential purchases for 30 days.' },
      { id: 'p-2', textBn: 'ডিসকাউন্ট ফাঁদ পরিহার করুন: ৫০% ছাড় দেখে অপ্রয়োজনীয় জিনিস কিনবেন না, আপনার ৫০% খরচই হলো।', textEn: 'Be smart about discount traps. Buying unneeded things on 50% sale is still spending 50%.' },
      { id: 'p-3', textBn: 'অন্যের লাইফস্টাইল দেখে দেখানোর জন্য নিজেকে ঋণের জালে জড়াবেন না, সাদাসিধে জীবনই প্রিমিয়াম।', textEn: 'Never go into debt to impress others. High-density minimalist living is true luxury.' },
      { id: 'p-4', textBn: 'ডিজিটাল ওয়ালেটে টাকা থাকলে সহজে খরচ হয়, তাই কিছু ক্যাশ টাকা আলাদা পকেটে রাখুন।', textEn: 'Digital money is frictionless to spend. Keep physical paper notes to feel the pain of paying.' },
      { id: 'p-5', textBn: 'খারাপ মন মেজাজ ভালো করতে শপিং করা (Retail Therapy) পরিহার করুন, পার্কে হাঁটুন।', textEn: 'Avoid retail therapy. Shopping to boost your mood is a highly destructive trap.' },
      { id: 'p-6', textBn: 'ব্র্যান্ডের লোগো দেখে অতিরিক্ত মূল্য দেওয়া বন্ধ করুন, লোগো ছাড়াই কোয়ালিটি পণ্য খুঁজুন।', textEn: 'Look for core product quality rather than fancy commercial brand logos.' },
      { id: 'p-7', textBn: 'ফ্রী ট্রায়াল নেওয়ার পর ক্যালেন্ডারে রিমাইন্ডার রাখুন, চার্জ কাটার আগেই সাবস্ক্রিপশন বাতিল করুন।', textEn: 'Set a calendar alarm to cancel free trials before they auto-bill your wallet.' },
      { id: 'p-8', textBn: 'অপ্রয়োজনীয় শপিং অ্যাপস ফোন থেকে আনইনস্টল করে দিন, নোটিফিকেশন দেখে কেনার ইচ্ছে জাগবে না।', textEn: 'Uninstall shopping apps. Out of sight, out of mind (cuts impulsive purchases by 60%).' },
      { id: 'p-9', textBn: 'একটি বড় ড্রিম গোল সেট করুন (যেমন ল্যাপটপ বা কোর্স), এতে খুচরো আজেবাজে খরচ করার স্পৃহা কমবে।', textEn: 'Anchor your brain with a big target goal. It automatically halts micro-spending.' },
      { id: 'p-10', textBn: 'বিজ্ঞাপনের প্রভাব থেকে দূরে থাকুন, সোশ্যাল মিডিয়ার প্রোডাক্ট ট্র্যাকিং কুকিজ ডিলিট করুন।', textEn: 'Clear your web cookies. It blocks target-marketing ads engineered to exploit your desires.' },
      { id: 'p-11', textBn: 'বন্ধুদের দামী আইটেম কেনা দেখে হিংসা করবেন না, আপনার সময়ের মূল্য তাদের চেয়ে বেশি হতে পারে।', textEn: 'Don\'t envy friend\'s gadgets. Focus on building high-value skills instead.' },
      { id: 'p-12', textBn: 'যেকোনো জিনিস কেনার আগে ভাবুন: এটি কি সত্যিই আপনার প্রয়োজন (Need) নাকি সাময়িক ইচ্ছা (Want)?', textEn: 'Ask before buying: Is this a core Survival Need or a temporary luxury Want?' },
      { id: 'p-13', textBn: 'মাসে অন্তত ১ দিন "নো-স্পেন্ড ডে" (কোনো টাকা খরচ না করার দিন) পালন করার চ্যালেঞ্জ নিন।', textEn: 'Challenge yourself to do 2 "No-Spend Days" a month to reset your dopamine.' },
      { id: 'p-14', textBn: 'পণ্য কেনার সময় তার মূল্যের সমপরিমাণ সময় আপনি কত ঘণ্টা কাজ করে আয় করেছেন তা হিসাব করুন।', textEn: 'Convert item prices into your hourly wages. Is that jacket worth 20 hours of hard tutoring?' },
      { id: 'p-15', textBn: 'সস্তা জিনিস বারবার কেনা বন্ধ করুন, একটি ভালো কোয়ালিটির পণ্য দীর্ঘস্থায়ী হয়।', textEn: 'Stop buying ultra-cheap goods that break instantly. Buy long-lasting quality.' },
      { id: 'p-16', textBn: 'শপিং মলে যাওয়ার আগে একটি নির্দিষ্ট বাজেট করা লিস্ট তৈরি করুন এবং লিস্টের বাইরে কিছু কিনবেন না।', textEn: 'Carry a strict shopping list to the mall. Never touch items not on your paper.' },
      { id: 'p-17', textBn: 'কোনো কেনাকাটা চূড়ান্ত করার আগে অন্তত ২৪ ঘণ্টা সময় নিয়ে শান্ত মনে ভাবুন।', textEn: 'Implement a 24-Hour cooling-off period before completing online checkouts.' },
      { id: 'p-18', textBn: 'ক্রেডিট কার্ড বা ঋণের টাকায় লাক্সারি পণ্য কেনা সম্পূর্ণ নিষিদ্ধ করুন।', textEn: 'Absolutely ban buying lifestyle or cosmetic goods using credit cards or borrowed cash.' },
      { id: 'p-19', textBn: 'আপনার আর্থিক লক্ষ্যগুলো চোখের সামনে ঝুলিয়ে রাখুন যাতে লক্ষ্যচ্যুত না হন।', textEn: 'Post your saving targets on your desk. Visual feedback maintains discipline.' },
      { id: 'p-20', textBn: 'টাকা জমানোকে একটি খেলা হিসেবে নিন এবং প্রতি সপ্তাহের ছোট মাইলস্টোন সেলিব্রেট করুন।', textEn: 'Gamify your budget. Treat leftover cash as your high-score in life.' }
    ]
  },
  {
    id: 'formulas',
    titleBn: '📊 বৈজ্ঞানিক বাজেট ফর্মুলা ও শিক্ষা (Scientific Budgeting)',
    titleEn: '📊 Scientific Budgeting',
    icon: Scale,
    color: 'from-purple-500 to-fuchsia-500',
    ideas: [
      { id: 'b-1', textBn: '৫০/৩০/২০ নিয়ম ব্যবহার করুন: ৫০% প্রয়োজনীয় খরচ, ৩০% শখ এবং ২০% সরাসরি সঞ্চয় করুন।', textEn: 'Apply the 50/30/20 Rule: 50% Needs, 30% Wants, and 20% Savings.' },
      { id: 'b-2', textBn: 'খাম পদ্ধতি (Envelope Method): মাসের শুরুতেই খরচগুলোকে আলাদা খামে নগদ বন্টন করে রাখুন।', textEn: 'Use the Envelope Method: Segment monthly cash physically to avoid cross-spending.' },
      { id: 'b-3', textBn: 'জিরো-বেসড বাজেট: আয়ের প্রতিটি টাকার একটি সুনির্দিষ্ট গন্তব্য আগে থেকেই লিখে রাখুন।', textEn: 'Practice Zero-Based Budgeting: Give every single dollar a job before the month starts.' },
      { id: 'b-4', textBn: 'জরুরি তহবিল (Emergency Fund): অন্তত ৩ মাসের মেস খরচের সমান টাকা আলাদা একটি অ্যাকাউন্টে জমান।', textEn: 'Build an Emergency Fund. Keep at least 3 months of survival expenses in a separate account.' },
      { id: 'b-5', textBn: 'আগে নিজেকে পে করুন (Pay Yourself First): আয়ের টাকা হাতে পেলেই আগে সঞ্চয়ের অংশ সরিয়ে রাখুন।', textEn: 'Pay Yourself First: Save first, then build your lifestyle around what remains.' },
      { id: 'b-6', textBn: 'সাপ্তাহিক ট্র্যাকিং: প্রতি সপ্তাহের রবিবার রাতে বিগত সপ্তাহের আয়-ব্যয়ের হিসাব রিভিউ করুন।', textEn: 'Weekly Audits: Review your transactions every Sunday night to spot leakages.' },
      { id: 'b-7', textBn: 'খরচের লাইফস্টাইল ইনফ্লেশন প্রতিরোধ করুন: টিউশন বা আয় বাড়লেও খরচ হুট করে বাড়িয়ে দেবেন না।', textEn: 'Fight Lifestyle Inflation: Keep your spending flat even when your tuition income grows.' },
      { id: 'b-8', textBn: 'সঞ্চয়ের জন্য আলাদা ব্যাংক অ্যাকাউন্ট রাখুন যার ডেবিট কার্ড আপনি সাথে বহন করবেন না।', textEn: 'Maintain a secondary savings bank account without carrying its debit card.' },
      { id: 'b-9', textBn: 'ক্ষুদ্র সঞ্চয়ের শক্তি (Compound Interest): প্রতিদিন মাত্র ৫০ টাকা জমানো বছর শেষে ১৮,২৫০ টাকা হয়! ', textEn: 'Micro-savings power: Saving just 50 BDT a day compounds to 18,250 BDT in a year!' },
      { id: 'b-10', textBn: 'আপনার বার্ষিক বড় খরচের হিসাব করুন (যেমন সেমিস্টার ফি) এবং প্রতি মাসে তার ১/১২ অংশ জমিয়ে রাখুন।', textEn: 'Calculate annual big fees (Semester, Exam) and accrue 1/12th of it every month.' },
      { id: 'b-11', textBn: 'একটি নির্ভরযোগ্য ট্র্যাকিং অ্যাপে (যেমন MridhaX) প্রতিটি ট্রানজেকশন ইনস্ট্যান্ট রেকর্ড করুন।', textEn: 'Record transactions instantly in your MridhaX app. Real-time data keeps you alert.' },
      { id: 'b-12', textBn: 'মাসের শেষের দিনগুলোতে জোরপূর্বক বাজেট ক্র্যাশ করুন যাতে সঞ্চয় অক্ষত থাকে।', textEn: 'Trigger a voluntary spending freeze on the last week of the month.' },
      { id: 'b-13', textBn: 'নগদ টাকা খরচের মানসিক কষ্ট কার্ড বা ওয়ালেটের চেয়ে বেশি, তাই ট্র্যাকিং বাড়ান।', textEn: 'Understand the Psychology of Cash. Card swiping hurts less, leading to 25% higher bills.' },
      { id: 'b-14', textBn: 'আপনার স্থায়ী আয়ের সাথে অস্থায়ী বা অনিয়মিত বোনাস কখনো বাজেটে যোগ করবেন না।', textEn: 'Never integrate seasonal bonuses or irregular gifts into your core survival budget.' },
      { id: 'b-15', textBn: 'বাজেট অপ্টিমাইজ করতে প্রতি ৩ মাসে খরচের ক্যাটাগরিগুলো গভীরভাবে বিশ্লেষণ করুন।', textEn: 'Perform a deep diagnostic review of your cost charts once every quarter.' },
      { id: 'b-16', textBn: 'ঋণ করার আগে সুদের হার এবং পরিশোধের মেয়াদের ভয়াবহতা নিয়ে পড়াশোনা করুন।', textEn: 'Study the catastrophic weight of interest rates before seeking personal loans.' },
      { id: 'b-17', textBn: 'আপনার ফিন্যান্সিয়াল গোলগুলো সুনির্দিষ্ট, পরিমাপযোগ্য ও অর্জনযোগ্য (SMART) করুন।', textEn: 'Define SMART financial targets: Specific, Measurable, Actionable, Relevant, Time-bound.' },
      { id: 'b-18', textBn: 'টাকা জমানোর সুফলগুলো প্রতিদিন স্মরণ করুন, এটি আপনাকে স্বাধীনভাবে সিদ্ধান্ত নিতে সাহায্য করবে।', textEn: 'Remind yourself of financial peace of mind. Savings buy future choices and freedom.' },
      { id: 'b-19', textBn: 'সব খরচকে "অবশ্যই প্রয়োজনীয়" ও "না হলেও চলবে" এই দুই ভাগে ভাগ করুন।', textEn: 'Strictly label all expenditures as either absolute Needs or luxury Wants.' },
      { id: 'b-20', textBn: 'প্রতি মাসে একটি নির্দিষ্ট সঞ্চয়ের টার্গেট রাখুন এবং সেটি পূরণ হলে নিজেকে পুরস্কৃত করুন।', textEn: 'Gamify monthly saving targets and reward your progress with free, healthy options.' }
    ]
  },
  {
    id: 'career',
    titleBn: '🎓 ক্যারিয়ার ফোকাস ও আয় বৃদ্ধি (Income & Skill Engineering)',
    titleEn: '🎓 Income & Skill Engineering',
    icon: Award,
    color: 'from-violet-500 to-purple-500',
    ideas: [
      { id: 'ca-1', textBn: 'খরচ বাঁচানোর চেয়ে নতুন স্কিল শিখে আয় বাড়ানোর দিকে মনোযোগ দিন, আয়ের কোনো উচ্চসীমা নেই।', textEn: 'Focus more on expanding income than just cutting costs. Earnings have no ceiling.' },
      { id: 'ca-2', textBn: 'ভালো মানের টিউশনি বা পার্ট-টাইম কাজ পেতে কমিউনিকেশন ও প্রেজেন্টেশন স্কিল বাড়ান।', textEn: 'Elevate public speaking and presentation skills to unlock premium tutoring roles.' },
      { id: 'ca-3', textBn: 'ফ্রি-ল্যান্সিং শুরু করতে একটি নির্দিষ্ট হাই-ভ্যালু স্কিল (যেমন React, UI/UX, AI) আয়ত্ত করুন।', textEn: 'Master one highly technical skill (React, Python, UI/UX) to initiate remote freelance work.' },
      { id: 'ca-4', textBn: 'অপ্রয়োজনীয় ফেসবুক স্ক্রলিংয়ের সময়কে লার্নিং আওয়ারে রূপান্তর করুন, এটিই আপনার ভবিষ্যৎ ক্যাপিটাল।', textEn: 'Repurpose reels and social scrolling into coding or design practice. Build your equity.' },
      { id: 'ca-5', textBn: 'নিজের একটি পোর্টফোলিও ওয়েবসাইট তৈরি করুন, যা ক্লায়েন্ট বা চাকরি পেতে সাহায্য করবে।', textEn: 'Build a premium portfolio website. It acts as an automatic credential builder.' },
      { id: 'ca-6', textBn: 'লিঙ্কডইন (LinkedIn) প্রোফাইল অপ্টিমাইজ করুন এবং প্রফেশনাল মানুষের সাথে নেটওয়ার্কিং গড়ে তুলুন।', textEn: 'Optimize your LinkedIn. Connect with industry experts and build professional trust.' },
      { id: 'ca-7', textBn: 'যেকোনো কাজ বা ফ্রিল্যান্সিংয়ে ডেডলাইন মেনে চলুন, ক্লায়েন্ট রিটেনশন অনেক সস্তা ও লাভজনক।', textEn: 'Respect deadlines. Client retention is 5x cheaper than hunting new leads.' },
      { id: 'ca-8', textBn: 'নিজের কাজের গুণগত মান বাড়ান, সস্তার বদলে প্রিমিয়াম চার্জ করার যোগ্যতা অর্জন করুন।', textEn: 'Improve work density. Shift from low-cost hourly gigs to high-ticket deliverables.' },
      { id: 'ca-9', textBn: 'শিক্ষার্থীদের জন্য ইন্টার্নশিপের সুযোগগুলো খুঁজুন, যা বাস্তব অভিজ্ঞতা দেবে।', textEn: 'Apply for competitive internships. Practical industry exposure pays massive dividends.' },
      { id: 'ca-10', textBn: 'আইটি বা স্কিল ডেভেলপমেন্ট প্রতিযোগিতায় অংশ নিন, প্রাইজমানি এবং পরিচিতি দুই-ই বাড়বে।', textEn: 'Participate in local hackathons and tech contests for prize funds and high-end networking.' },
      { id: 'ca-11', textBn: 'সহপাঠী বা বন্ধুদের সাথে পার্টনারশিপে ছোট কোনো ডিজিটাল সার্ভিস বা এজেন্সি শুরু করতে পারেন।', textEn: 'Partner with classmates to launch minor digital services (design, copy, web support).' },
      { id: 'ca-12', textBn: 'কাজের পারফরম্যান্স বাড়াতে প্রতিদিন কমপক্ষে ৭ ঘণ্টা গভীর ঘুম ও স্বাস্থ্যকর খাবার নিশ্চিত করুন।', textEn: 'Sleep 7+ hours. Highly recharged brains output 3x cleaner code and logic.' },
      { id: 'ca-13', textBn: 'ইংরেজি কমিউনিকেশন ও ইমেইল রাইটিং স্কিল উন্নত করুন, যা বিদেশি ক্লায়েন্ট ডিলের মূল চাবিকাঠি।', textEn: 'Master professional English emailing and negotiation. Key to international clients.' },
      { id: 'ca-14', textBn: 'বিনামূল্যে নিজের মেধা ও দক্ষতা শেয়ার করুন (যেমন ব্লগ লেখা), যা আপনার অথরিটি প্রতিষ্ঠা করবে।', textEn: 'Write technical blogs or tutorials. Establishing online authority draws incoming offers.' },
      { id: 'ca-15', textBn: 'কঠোর পরিশ্রমের পাশাপাশি স্মার্ট ওয়ার্ক এবং এআই টুলের সঠিক ব্যবহার শিখুন।', textEn: 'Leverage modern AI tools to accelerate your workflow. Double output in half the hours.' },
      { id: 'ca-16', textBn: 'আপনার অর্জিত অর্থের একটি অংশ নিজের সেলফ-এডুকেশন বা কোর্সে পুনঃবিনিয়োগ করুন।', textEn: 'Reinvest 10% of your earnings back into learning materials, books, and expert courses.' },
      { id: 'ca-17', textBn: 'কাজে লেগে থাকুন, যেকোনো স্কিল মাস্টার হতে অন্তত ৬-১২ মাস গভীর মনোযোগ প্রয়োজন।', textEn: 'Be patient. Mastering high-end skills takes 6 to 12 months of daily focused effort.' },
      { id: 'ca-18', textBn: 'বড় ভাই ও প্রফেশনাল মেন্টরদের সাথে সুসম্পর্ক রাখুন, তাদের রেফারেল আপনাকে এগিয়ে দেবে।', textEn: 'Build respect-based relationships with university seniors for corporate referrals.' },
      { id: 'ca-19', textBn: 'সকাল বেলার সময়টিকে সবচেয়ে কঠিন এবং গুরুত্বপূর্ণ কাজগুলো শেখার জন্য বরাদ্দ রাখুন।', textEn: 'Dedicate peak morning cognitive hours to learning the absolute hardest subjects.' },
      { id: 'ca-20', textBn: 'আপনার স্বপ্নগুলোকে অনেক বড় রাখুন এবং প্রতিদিন ছোট ছোট পদক্ষেপে সেদিকে ধাবিত হোন।', textEn: 'Keep your ambitions extremely high and build daily small routines toward them.' }
    ]
  }
];

// Combine all into a flat list for searching & random pick (200+ master database)
const ALL_FINANCE_IDEAS = FINANCE_IDEAS_CATEGORIES.flatMap(c => c.ideas.map(i => ({
  ...i,
  categoryTitleBn: c.titleBn,
  categoryTitleEn: c.titleEn,
  color: c.color
})));

export function FinanceTracker({ state, saveState }: FinanceTrackerProps) {
  // Local state managers
  const [subTab, setSubTab] = useState<'dashboard' | 'transactions' | 'education' | 'debt'>('dashboard');
  const [activeIdeaCategory, setActiveIdeaCategory] = useState<string>('food');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Debt inputs state
  const [showDebtForm, setShowDebtForm] = useState(false);
  const [debtType, setDebtType] = useState<'borrowed' | 'lent'>('borrowed');
  const [debtPerson, setDebtPerson] = useState('');
  const [debtAmount, setDebtAmount] = useState('');
  const [debtDate, setDebtDate] = useState(new Date().toISOString().split('T')[0]);
  const [debtDueDate, setDebtDueDate] = useState('');
  const [debtDesc, setDebtDesc] = useState('');
  const [debtSearch, setDebtSearch] = useState('');
  const [debtStatusFilter, setDebtStatusFilter] = useState<'all' | 'pending' | 'paid'>('all');

  // Transaction inputs
  const [showAddForm, setShowAddForm] = useState(false);
  const [txType, setTxType] = useState<'income' | 'expense'>('expense');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('Food');
  const [txDescription, setTxDescription] = useState('');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);

  // Income sources inputs
  const [incomeSource, setIncomeSource] = useState(state.monthlyIncomeSource || 'Tution / Freelancing');
  const [incomeAmount, setIncomeAmount] = useState(state.monthlyIncomeAmount?.toString() || '12000');
  const [fromHome, setFromHome] = useState(state.cashFromHome?.toString() || '3000');
  const [warningLimit, setWarningLimit] = useState(state.budgetWarningLimit?.toString() || '8000');
  const [isEditingSources, setIsEditingSources] = useState(false);

  // Dynamic dynamic random idea selection
  const [currentRandomIndex, setCurrentRandomIndex] = useState(() => Math.floor(Math.random() * ALL_FINANCE_IDEAS.length));
  
  const currentRandomIdea = ALL_FINANCE_IDEAS[currentRandomIndex] || ALL_FINANCE_IDEAS[0];

  const rollNewIdea = () => {
    let nextIdx = Math.floor(Math.random() * ALL_FINANCE_IDEAS.length);
    if (nextIdx === currentRandomIndex) nextIdx = (nextIdx + 1) % ALL_FINANCE_IDEAS.length;
    setCurrentRandomIndex(nextIdx);
  };

  // Master Book Card Deck State
  const [selectedBookId, setSelectedBookId] = useState<string>('psychology_of_money');
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [bookmarkedCardIds, setBookmarkedCardIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mridhax_bookmarked_finance_cards');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });
  const [cardSectionTab, setCardSectionTab] = useState<'wisdom' | 'action' | 'trap'>('wisdom');
  const [onlyShowBookmarked, setOnlyShowBookmarked] = useState<boolean>(false);

  const toggleBookmark = (cardId: string) => {
    const updated = bookmarkedCardIds.includes(cardId)
      ? bookmarkedCardIds.filter(id => id !== cardId)
      : [...bookmarkedCardIds, cardId];
    setBookmarkedCardIds(updated);
    try {
      localStorage.setItem('mridhax_bookmarked_finance_cards', JSON.stringify(updated));
    } catch (_) {}
  };

  const handleReadAloud = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const hasBengali = /[\u0980-\u09FF]/.test(text);
      utterance.lang = hasBengali ? 'bn-BD' : 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Finance Transactions Helper arrays
  const transactions: FinanceTransaction[] = state.financeTransactions || [];
  
  // Calculations
  const monthlyIncAmt = parseFloat(incomeAmount) || 0;
  const cashFromHomeAmt = parseFloat(fromHome) || 0;
  const warningLimitAmt = parseFloat(warningLimit) || 0;

  // Total Other Incomes added manually
  const totalOtherIncome = useMemo(() => {
    return transactions
      .filter(t => t.type === 'income' && t.category !== 'Home')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Total Home Incomes added manually
  const totalManualHomeIncome = useMemo(() => {
    return transactions
      .filter(t => t.type === 'income' && t.category === 'Home')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Total cash pool = Monthly Income + Cash from Home (directly input) + Other Incomes
  const totalCashPool = useMemo(() => {
    // Treat directly-input Cash from Home + manually logged Home incomes carefully
    return monthlyIncAmt + cashFromHomeAmt + totalOtherIncome + totalManualHomeIncome;
  }, [monthlyIncAmt, cashFromHomeAmt, totalOtherIncome, totalManualHomeIncome]);

  // Total manual expenses logged
  const totalExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Current net balance
  const currentBalance = totalCashPool - totalExpenses;

  // Save changes to income settings
  const handleSaveSources = () => {
    saveState({
      ...state,
      monthlyIncomeSource: incomeSource,
      monthlyIncomeAmount: monthlyIncAmt,
      cashFromHome: cashFromHomeAmt,
      budgetWarningLimit: warningLimitAmt
    });
    setIsEditingSources(false);
  };

  // Add Transaction
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(txAmount);
    if (!amt || amt <= 0) return;

    const newTx: FinanceTransaction = {
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: txType,
      amount: amt,
      category: txCategory,
      description: txDescription || (state.language === 'bn' ? 'সাধারণ এন্ট্রি' : 'General Entry'),
      date: txDate
    };

    const updatedTransactions = [newTx, ...transactions];

    saveState({
      ...state,
      financeTransactions: updatedTransactions
    });

    // Reset fields
    setTxAmount('');
    setTxDescription('');
    setShowAddForm(false);
  };

  // Delete Transaction
  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    saveState({
      ...state,
      financeTransactions: updated
    });
  };

  // Debt Actions and Helpers
  const debts: DebtItem[] = state.debts || [];

  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(debtAmount);
    if (!debtPerson.trim() || !amt || amt <= 0) return;

    const newDebt: DebtItem = {
      id: `debt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: debtType,
      personName: debtPerson,
      amount: amt,
      date: debtDate,
      dueDate: debtDueDate || undefined,
      status: 'pending',
      paidAmount: 0,
      description: debtDesc || undefined
    };

    const updatedDebts = [newDebt, ...debts];

    saveState({
      ...state,
      debts: updatedDebts
    });

    // Reset fields
    setDebtPerson('');
    setDebtAmount('');
    setDebtDueDate('');
    setDebtDesc('');
    setShowDebtForm(false);
  };

  const handleToggleDebtStatus = (id: string) => {
    const updated = debts.map(d => {
      if (d.id === id) {
        const nextStatus: 'pending' | 'paid' = d.status === 'pending' ? 'paid' : 'pending';
        return {
          ...d,
          status: nextStatus,
          paidAmount: nextStatus === 'paid' ? d.amount : 0
        };
      }
      return d;
    });
    saveState({
      ...state,
      debts: updated
    });
  };

  const handleDeleteDebt = (id: string) => {
    const updated = debts.filter(d => d.id !== id);
    saveState({
      ...state,
      debts: updated
    });
  };

  const totalBorrowedPending = useMemo(() => {
    return debts
      .filter(d => d.type === 'borrowed' && d.status === 'pending')
      .reduce((sum, d) => sum + d.amount, 0);
  }, [debts]);

  const totalLentPending = useMemo(() => {
    return debts
      .filter(d => d.type === 'lent' && d.status === 'pending')
      .reduce((sum, d) => sum + d.amount, 0);
  }, [debts]);

  // Categorized expenses for Pie Chart
  const categoryData = useMemo(() => {
    const expensesMap: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const cat = t.category;
        expensesMap[cat] = (expensesMap[cat] || 0) + t.amount;
      });

    return Object.entries(expensesMap).map(([name, value]) => ({
      name: state.language === 'bn' ? getCategoryNameBn(name) : name,
      value
    }));
  }, [transactions, state.language]);

  // Visual Digital Transactions Trend Data (Last 7 days aggregated)
  const chartData = useMemo(() => {
    const days: Record<string, { date: string; income: number; expense: number }> = {};
    
    // Seed last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const displayStr = state.language === 'bn' 
        ? d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })
        : d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      days[dateStr] = { date: displayStr, income: 0, expense: 0 };
    }

    transactions.forEach(t => {
      const dStr = t.date;
      if (days[dStr]) {
        if (t.type === 'income') {
          days[dStr].income += t.amount;
        } else {
          days[dStr].expense += t.amount;
        }
      }
    });

    return Object.values(days);
  }, [transactions, state.language]);

  // Helper translations for categories
  function getCategoryNameBn(cat: string) {
    const map: Record<string, string> = {
      'Food': 'খাবার ও মেস',
      'Study': 'পড়াশোনা ও বই',
      'Rent': 'মেস ভাড়া ও সিট',
      'Transport': 'যাতায়াত ভাড়া',
      'Entertainment': 'বিনোদন ও ট্রাভেল',
      'Home': 'বাড়ি থেকে আনা',
      'Salary': 'পার্ট-টাইম আয়',
      'Tuition': 'টিউশনি সম্মানী',
      'Freelancing': 'ফ্রিল্যান্সিং',
      'Others': 'অন্যান্য খরচ'
    };
    return map[cat] || cat;
  }

  // Find where spending is highest
  const highestSpendingCategory = useMemo(() => {
    if (categoryData.length === 0) return null;
    return [...categoryData].sort((a, b) => b.value - a.value)[0];
  }, [categoryData]);

  // Warning thresholds
  const isOverBudget = totalExpenses > warningLimitAmt;
  const isEmergencyReserveCritical = currentBalance < (totalCashPool * 0.15);

  // Search filter for 200+ Ideas
  const filteredIdeas = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const lower = searchQuery.toLowerCase();
    return ALL_FINANCE_IDEAS.filter(i => 
      i.textBn.toLowerCase().includes(lower) || 
      i.textEn.toLowerCase().includes(lower) || 
      i.categoryTitleBn.toLowerCase().includes(lower) || 
      i.categoryTitleEn.toLowerCase().includes(lower)
    );
  }, [searchQuery]);

  // Active Category ideas (when browsing Master list)
  const currentCategoryObj = FINANCE_IDEAS_CATEGORIES.find(c => c.id === activeIdeaCategory) || FINANCE_IDEAS_CATEGORIES[0];

  // Dynamic Bengali numbers helper
  const num = (n: number) => {
    if (state.language === 'bn') {
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return n.toLocaleString('bn-BD').split('').map(digit => {
        const parsed = parseInt(digit, 10);
        return isNaN(parsed) ? digit : bnDigits[parsed];
      }).join('');
    }
    return n.toLocaleString('en-US');
  };

  const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#06b6d4'];

  return (
    <div className="space-y-6">
      {/* 1. CINEMATIC SUB TAB NAVIGATION */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-950/55 p-1.5 rounded-2xl border border-slate-900 backdrop-blur-md">
        <button
          onClick={() => setSubTab('dashboard')}
          className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-center transition-all duration-300 cursor-pointer ${
            subTab === 'dashboard'
              ? 'bg-gradient-to-r from-emerald-950/50 to-teal-950/50 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] font-bold'
              : 'bg-transparent border border-transparent text-slate-450 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span className="text-[10px] sm:text-xs tracking-wide uppercase font-black">
            {state.language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
          </span>
        </button>

        <button
          onClick={() => setSubTab('transactions')}
          className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-center transition-all duration-300 cursor-pointer ${
            subTab === 'transactions'
              ? 'bg-gradient-to-r from-blue-950/50 to-indigo-950/50 border border-blue-500/40 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)] font-bold'
              : 'bg-transparent border border-transparent text-slate-450 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span className="text-[10px] sm:text-xs tracking-wide uppercase font-black">
            {state.language === 'bn' ? 'লেনদেন হিসাব' : 'Ledger Book'}
          </span>
        </button>

        <button
          onClick={() => setSubTab('education')}
          className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-center transition-all duration-300 cursor-pointer ${
            subTab === 'education'
              ? 'bg-gradient-to-r from-purple-950/50 to-fuchsia-950/50 border border-purple-500/40 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)] font-bold'
              : 'bg-transparent border border-transparent text-slate-450 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span className="text-[10px] sm:text-xs tracking-wide uppercase font-black">
            {state.language === 'bn' ? 'সংরক্ষণ কৌশল' : 'Saving Hacks'}
          </span>
        </button>

        <button
          onClick={() => setSubTab('debt')}
          className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-center transition-all duration-300 cursor-pointer ${
            subTab === 'debt'
              ? 'bg-gradient-to-r from-amber-950/50 to-orange-950/50 border border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)] font-bold'
              : 'bg-transparent border border-transparent text-slate-450 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Handshake className="w-4 h-4" />
          <span className="text-[10px] sm:text-xs tracking-wide uppercase font-black">
            {state.language === 'bn' ? 'দেনা পাওনা' : 'Debt Ledger'}
          </span>
        </button>
      </div>

      {/* WARNING NOTIFICATIONS ZONE */}
      <AnimatePresence>
        {isOverBudget && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-red-950/80 to-rose-950/80 border border-red-500/40 text-red-300 flex items-start gap-3.5 shadow-[0_0_25px_rgba(239,68,68,0.15)]"
          >
            <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 animate-bounce mt-0.5" />
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide">
                {state.language === 'bn' ? '🚨 বাজেট অতিক্রম সতর্কতা (Limit Exceeded!)' : '🚨 Spending Over-Limit Warning'}
              </h4>
              <p className="text-xs text-red-200/90 leading-relaxed mt-1">
                {state.language === 'bn' 
                  ? `আপনার মোট ব্যয় (${num(totalExpenses)} BDT) আপনার সুনির্দিষ্ট বাজেট সীমা (${num(warningLimitAmt)} BDT) অতিক্রম করেছে! আজই অপ্রয়োজনীয় খরচ অবিলম্বে বন্ধ করুন এবং সেভিং হ্যাক্স ফলো করুন!`
                  : `Your current expenses (${num(totalExpenses)} BDT) have exceeded your target budget limit (${num(warningLimitAmt)} BDT). Switch immediately to essential spending!`}
              </p>
            </div>
          </motion.div>
        )}

        {!isOverBudget && isEmergencyReserveCritical && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 to-yellow-950/80 border border-amber-500/40 text-amber-300 flex items-start gap-3.5 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
          >
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 animate-pulse mt-0.5" />
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide">
                {state.language === 'bn' ? '⚠️ সংকটকালীন তহবিল হ্রাস সতর্কতা' : '⚠️ Low Balance Warning'}
              </h4>
              <p className="text-xs text-amber-200/90 leading-relaxed mt-1">
                {state.language === 'bn' 
                  ? `সতর্কতা! আপনার বর্তমান ব্যালেন্স (${num(currentBalance)} BDT) মোট ফান্ডের ১৫% এর নিচে চলে এসেছে। আগামী কয়েকদিন খরচ সর্বোচ্চ নিয়ন্ত্রণে রাখুন!`
                  : `Warning! Your current available balance (${num(currentBalance)} BDT) is less than 15% of your total initial fund pool. Spend very carefully.`}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW A: DASHBOARD VIEW */}
      {subTab === 'dashboard' && (
        <div className="space-y-6">
          {/* NET LIQUID TELEMETRY RING CARD */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-6 rounded-3xl bg-slate-950/65 border border-slate-900/80 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl animate-pulse" />
              
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block font-mono">
                    {state.language === 'bn' ? 'মোট অবশিষ্ট ব্যালেন্স' : 'Current Net Assets'}
                  </span>
                  <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 mt-1 font-mono tracking-tight">
                    {num(currentBalance)} <span className="text-lg text-slate-400 font-sans">BDT</span>
                  </h2>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-emerald-400 animate-pulse" />
                </div>
              </div>

              {/* STATS POOLS GRID */}
              <div className="relative z-10 grid grid-cols-3 gap-3.5 mt-8 border-t border-slate-900/80 pt-5">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-black block tracking-widest">
                    {state.language === 'bn' ? 'মোট তহবিল পুল' : 'Total Cash Pool'}
                  </span>
                  <span className="text-sm font-bold text-slate-200 font-mono block mt-1">
                    {num(totalCashPool)} BDT
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-black block tracking-widest text-rose-500/80">
                    {state.language === 'bn' ? 'মোট খরচ' : 'Total Expenses'}
                  </span>
                  <span className="text-sm font-bold text-rose-400 font-mono block mt-1">
                    {num(totalExpenses)} BDT
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-black block tracking-widest">
                    {state.language === 'bn' ? 'বাজেট সীমা' : 'Warning Limit'}
                  </span>
                  <span className="text-sm font-bold text-slate-400 font-mono block mt-1">
                    {num(warningLimitAmt)} BDT
                  </span>
                </div>
              </div>
            </div>

            {/* INCOME SOURCES CONFIG CARD */}
            <div className="p-6 rounded-3xl bg-slate-950/65 border border-slate-900/80 backdrop-blur-xl relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block font-mono">
                    {state.language === 'bn' ? 'তহবিলের উৎস সমূহ' : 'Monthly Pool Setup'}
                  </span>
                  {!isEditingSources && (
                    <button 
                      onClick={() => setIsEditingSources(true)}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                    >
                      {state.language === 'bn' ? 'সম্পাদনা' : 'Configure'}
                    </button>
                  )}
                </div>

                {isEditingSources ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] uppercase font-bold text-slate-500 block">মাসিক আয়ের বিবরণ / উৎস</label>
                      <input 
                        type="text" 
                        value={incomeSource}
                        onChange={(e) => setIncomeSource(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] uppercase font-bold text-slate-500 block">আয়ের পরিমাণ</label>
                        <input 
                          type="number" 
                          value={incomeAmount}
                          onChange={(e) => setIncomeAmount(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 mt-1 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-bold text-slate-500 block">বাসা থেকে পাঠানো</label>
                        <input 
                          type="number" 
                          value={fromHome}
                          onChange={(e) => setFromHome(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 mt-1 font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-bold text-slate-500 block">বাজেট সতর্কতার সীমা</label>
                      <input 
                        type="number" 
                        value={warningLimit}
                        onChange={(e) => setWarningLimit(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 mt-1 font-mono"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button 
                        onClick={handleSaveSources}
                        className="flex-1 py-1 px-3 bg-indigo-600 hover:bg-indigo-500 text-[10px] font-black uppercase text-white rounded-lg transition"
                      >
                        {state.language === 'bn' ? 'সেভ করুন' : 'Save'}
                      </button>
                      <button 
                        onClick={() => setIsEditingSources(false)}
                        className="py-1 px-3 border border-slate-800 hover:bg-slate-900 text-[10px] text-slate-400 rounded-lg"
                      >
                        {state.language === 'bn' ? 'বাতিল' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 border border-slate-900">
                      <div>
                        <span className="text-slate-450 text-[10px] block">মাসিক মূল ইনকাম ({state.monthlyIncomeSource || 'Tution'})</span>
                        <span className="font-bold text-slate-200 mt-0.5 block font-mono">{num(monthlyIncAmt)} BDT</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 border border-slate-900">
                      <div>
                        <span className="text-slate-450 text-[10px] block">বাসা থেকে আনা টাকা (Home Cash)</span>
                        <span className="font-bold text-slate-200 mt-0.5 block font-mono">{num(cashFromHomeAmt)} BDT</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 border border-slate-900">
                      <div>
                        <span className="text-slate-450 text-[10px] block">অন্যান্য উৎস থেকে আয়</span>
                        <span className="font-bold text-slate-200 mt-0.5 block font-mono">{num(totalOtherIncome)} BDT</span>
                      </div>
                      <Coins className="w-4 h-4 text-amber-400" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DYNAMIC CINEMATIC SAVING MOTIVATIONAL CARD */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-950/20 via-slate-950/45 to-fuchsia-950/20 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.05)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:scale-125 transition duration-500" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5 text-purple-400 animate-pulse" />
                </div>
                <div>
                  <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest block font-mono">
                    {state.language === 'bn' ? 'দৈনিক খরচ নিয়ন্ত্রণ গাইড ও প্রেরণা' : 'Daily Financial Wisdom'}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1.5 font-sans italic max-w-2xl">
                    &ldquo;{state.language === 'bn' ? currentRandomIdea.textBn : currentRandomIdea.textEn}&rdquo;
                  </p>
                  <span className="text-[10px] text-purple-400/80 font-bold block mt-2">
                    🏷️ {state.language === 'bn' ? currentRandomIdea.categoryTitleBn : currentRandomIdea.categoryTitleEn}
                  </span>
                </div>
              </div>
              <button
                onClick={rollNewIdea}
                className="py-1.5 px-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-[10px] font-black uppercase text-white rounded-xl transition shadow-[0_0_12px_rgba(168,85,247,0.25)] select-none cursor-pointer shrink-0 self-end sm:self-auto"
              >
                {state.language === 'bn' ? 'নতুন আইডিয়া' : 'Next Tip'}
              </button>
            </div>
          </div>

          {/* TWO COLUMN GRAPHICAL ANALYTICS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* COLUMN 1: TRANSACTIONS COMPOSED CHART */}
            <div className="p-6 rounded-3xl bg-slate-950/65 border border-slate-900/80 backdrop-blur-xl space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>{state.language === 'bn' ? 'সাম্প্রতিক লেনদেন ট্রেন্ড (৭ দিন)' : 'Recent Transaction Flow'}</span>
                </h3>
                <p className="text-[10px] text-slate-500 mt-1">
                  {state.language === 'bn' ? 'বিগত এক সপ্তাহের আয় বনাম ব্যয় ট্র্যাকিং' : 'Daily comparison of inflows and outflows'}
                </p>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px' }}
                      labelStyle={{ color: '#94a3b8', fontWeight: 'bold', fontSize: '11px' }}
                      itemStyle={{ fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Bar name={state.language === 'bn' ? 'আয়' : 'Inflow'} dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar name={state.language === 'bn' ? 'ব্যয়' : 'Outflow'} dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* COLUMN 2: EXPENSE CATEGORIES PIE CHART & HIGHEST SPENT WARNING */}
            <div className="p-6 rounded-3xl bg-slate-950/65 border border-slate-900/80 backdrop-blur-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-amber-400" />
                    <span>{state.language === 'bn' ? 'ব্যয়ের খাতভিত্তিক বন্টন' : 'Expense Category Share'}</span>
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {state.language === 'bn' ? 'কোন খাতে সবচেয়ে বেশি টাকা ব্যয় হচ্ছে তার পাই চার্ট' : 'Pie chart breakdown of category-wise expenditures'}
                  </p>
                </div>

                {categoryData.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px' }}
                            itemStyle={{ fontSize: '11px', color: '#e2e8f0' }}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="space-y-2 text-xs">
                      {categoryData.map((item, index) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-slate-400">{item.name}</span>
                          </div>
                          <span className="font-bold text-slate-200 font-mono">{num(item.value)} BDT</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-44 flex flex-col items-center justify-center text-center border border-dashed border-slate-800 rounded-2xl">
                    <Coins className="w-8 h-8 text-slate-600 animate-pulse mb-2" />
                    <span className="text-xs text-slate-500">
                      {state.language === 'bn' ? 'কোনো ব্যয়ের হিসাব পাওয়া যায়নি।' : 'No expenditures logged yet.'}
                    </span>
                  </div>
                )}
              </div>

              {highestSpendingCategory && (
                <div className="mt-4 pt-4 border-t border-slate-900/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {state.language === 'bn' ? 'সর্বোচ্চ ব্যয়ের খাত:' : 'Highest Expense Area:'}
                  </span>
                  <span className="font-black text-rose-400 flex items-center gap-1 font-sans">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {highestSpendingCategory.name} ({num(highestSpendingCategory.value)} BDT)
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* VIEW B: LEDGER BOOK / LIST OF TRANSACTIONS */}
      {subTab === 'transactions' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-950/65 border border-slate-900/80 backdrop-blur-xl space-y-4">
            
            {/* LEDGER HEADER BAR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-sans flex items-center gap-1.5">
                  <Coins className="w-5 h-5 text-indigo-400 animate-pulse" />
                  <span>{state.language === 'bn' ? 'দৈনিক খতিয়ান ও হিসাব খাতা' : 'Personal Daily Ledger Book'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {state.language === 'bn' ? 'প্রতিটি আয় এবং ব্যয়ের পুঙ্খানুপুঙ্খ বিবরণ' : 'List and manage daily cash flow items'}
                </p>
              </div>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 cursor-pointer transition select-none self-start sm:self-auto"
              >
                {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{state.language === 'bn' ? 'নতুন এন্ট্রি যোগ করুন' : 'Add Ledger Entry'}</span>
              </button>
            </div>

            {/* INLINE ADD TRANSACTION FORM */}
            <AnimatePresence>
              {showAddForm && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleAddTransaction}
                  className="p-5 rounded-2xl bg-slate-900/50 border border-slate-850 space-y-4 overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    
                    {/* TYPE */}
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">লেনদেনের ধরণ / Type</label>
                      <div className="grid grid-cols-2 gap-1 mt-1.5">
                        <button
                          type="button"
                          onClick={() => { setTxType('expense'); setTxCategory('Food'); }}
                          className={`py-1.5 rounded-lg text-xs font-black uppercase transition cursor-pointer ${
                            txType === 'expense'
                              ? 'bg-rose-500/10 border border-rose-500/40 text-rose-400 font-bold'
                              : 'bg-transparent border border-slate-800 text-slate-400 hover:bg-slate-900'
                          }`}
                        >
                          {state.language === 'bn' ? 'ব্যয়' : 'Expense'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setTxType('income'); setTxCategory('Tuition'); }}
                          className={`py-1.5 rounded-lg text-xs font-black uppercase transition cursor-pointer ${
                            txType === 'income'
                              ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-bold'
                              : 'bg-transparent border border-slate-800 text-slate-400 hover:bg-slate-900'
                          }`}
                        >
                          {state.language === 'bn' ? 'আয়' : 'Income'}
                        </button>
                      </div>
                    </div>

                    {/* AMOUNT */}
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">টাকার পরিমাণ (BDT)</label>
                      <input 
                        type="number"
                        required
                        value={txAmount}
                        onChange={(e) => setTxAmount(e.target.value)}
                        placeholder="e.g. 500"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 mt-1 font-mono"
                      />
                    </div>

                    {/* CATEGORY */}
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">লেনদেনের খাত / Category</label>
                      <select
                        value={txCategory}
                        onChange={(e) => setTxCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 mt-1 font-sans cursor-pointer"
                      >
                        {txType === 'expense' ? (
                          <>
                            <option value="Food">{state.language === 'bn' ? 'খাবার ও মেস খরচ' : 'Food & Groceries'}</option>
                            <option value="Study">{state.language === 'bn' ? 'পড়াশোনা ও বইপত্র' : 'Studies & Education'}</option>
                            <option value="Rent">{state.language === 'bn' ? 'মেস সিট ভাড়া' : 'Rent & Seat'}</option>
                            <option value="Transport">{state.language === 'bn' ? 'যাতায়াত ও ভ্রমণ ভাড়া' : 'Transport & Travel'}</option>
                            <option value="Entertainment">{state.language === 'bn' ? 'বিনোদন ও আড্ডা' : 'Entertainment & Hangout'}</option>
                            <option value="Others">{state.language === 'bn' ? 'অন্যান্য আনুষঙ্গিক খরচ' : 'Others'}</option>
                          </>
                        ) : (
                          <>
                            <option value="Tuition">{state.language === 'bn' ? 'টিউশনি সম্মানী' : 'Tuition Salary'}</option>
                            <option value="Home">{state.language === 'bn' ? 'বাড়ি থেকে পাঠানো টাকা' : 'Cash from Home'}</option>
                            <option value="Freelancing">{state.language === 'bn' ? 'ফ্রিল্যান্সিং আয়' : 'Freelancing Outsource'}</option>
                            <option value="Salary">{state.language === 'bn' ? 'পার্ট-টাইম চাকুরী' : 'Part-time Job'}</option>
                            <option value="Others">{state.language === 'bn' ? 'অন্যান্য অপ্রত্যাশিত প্রাপ্তি' : 'Other Inflows'}</option>
                          </>
                        )}
                      </select>
                    </div>

                    {/* DATE */}
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">তারিখ / Date</label>
                      <input 
                        type="date"
                        required
                        value={txDate}
                        onChange={(e) => setTxDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 mt-1 font-mono cursor-pointer"
                      />
                    </div>

                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">সংক্ষিপ্ত বিবরণ / Description</label>
                    <input 
                      type="text"
                      value={txDescription}
                      onChange={(e) => setTxDescription(e.target.value)}
                      placeholder={state.language === 'bn' ? 'যেমন: দুপুরের মেস বাজার' : 'e.g. Lunch ingredients purchase'}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 mt-1"
                    />
                  </div>

                  {/* FORM ACTIONS */}
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="py-1.5 px-4 rounded-xl border border-slate-800 hover:bg-slate-900 text-xs text-slate-400 transition"
                    >
                      {state.language === 'bn' ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="py-1.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition shadow-[0_0_12px_rgba(16,185,129,0.25)] cursor-pointer"
                    >
                      {state.language === 'bn' ? 'নিশ্চিত করুন' : 'Confirm'}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* TRANSACTIONS LEDGER TABLE/LIST */}
            {transactions.length > 0 ? (
              <div className="space-y-2.5 overflow-y-auto max-h-[450px] pr-1">
                {transactions.map((tx) => (
                  <div 
                    key={tx.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/35 border border-slate-900 hover:border-slate-800 transition"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* TYPE INDICATOR */}
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                        tx.type === 'income' 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      }`}>
                        {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200">
                            {tx.description}
                          </span>
                          <span className="text-[9px] uppercase px-1.5 py-0.5 bg-slate-950/80 border border-slate-850 rounded-md text-slate-400 font-mono">
                            {state.language === 'bn' ? getCategoryNameBn(tx.category) : tx.category}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                          {tx.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-bold font-mono ${
                        tx.type === 'income' ? 'text-emerald-400' : 'text-slate-300'
                      }`}>
                        {tx.type === 'income' ? '+' : '-'}{num(tx.amount)} BDT
                      </span>

                      <button
                        onClick={() => handleDeleteTransaction(tx.id)}
                        title={state.language === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                        className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 border border-dashed border-slate-900 rounded-3xl text-center space-y-3">
                <Coins className="w-12 h-12 text-slate-700 animate-pulse mx-auto" />
                <h4 className="text-xs font-bold text-slate-400">
                  {state.language === 'bn' ? 'কোনো লেনদেন রেকর্ড পাওয়া যায়নি!' : 'No entries logged yet'}
                </h4>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  {state.language === 'bn' 
                    ? 'উপরের "নতুন এন্ট্রি যোগ করুন" বাটনে ক্লিক করে আপনার দৈনন্দিন খরচ ও আয়ের হিসাব এখনই রাখা শুরু করুন।'
                    : 'Click "Add Ledger Entry" to start recording your day-to-day transaction records.'}
                </p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* VIEW C: MOTIVATIONS & 200+ SAVING IDEAS EXPLORER */}
      {subTab === 'education' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-950/65 border border-slate-900/80 backdrop-blur-xl space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-sans flex items-center gap-1.5">
                <Lightbulb className="w-5 h-5 text-amber-400 animate-bounce" />
                <span>{state.language === 'bn' ? 'খরচ বাঁচানোর বৈজ্ঞানিক উপায় ও ২০০+ বাস্তব আইডিয়া' : 'Scientific Budgeting & 200+ Saving Hacks'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {state.language === 'bn' 
                  ? 'অবচেতন খরচের মানসিক ফাঁদ এড়াতে এবং মেস ও লাইফস্টাইল অপ্টিমাইজ করার মাস্টার বুক' 
                  : 'Master catalog of financial psychology and micro-savings strategies.'}
              </p>
            </div>

            {/* MASTER BOOK CARD READER SECTION */}
            <div className="p-0.5 border border-slate-900 rounded-3xl bg-slate-950/45 overflow-hidden">
              <div className="p-5 border-b border-slate-900/80 bg-gradient-to-r from-slate-950 to-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-500 font-mono flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>{state.language === 'bn' ? '📚 বিশ্বখ্যাত বইয়ের জ্ঞানভাণ্ডার ও ফিনান্সিয়াল মাস্টার বুক' : 'Financial Master Book Card Deck'}</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {state.language === 'bn' 
                      ? 'বিশ্বের জনপ্রিয় ফিন্যান্সিয়াল বইগুলোর প্রজ্ঞা ও বাস্তব প্রয়োগ সংক্ষেপ (কার্ড আকারে নিচে একটার পর একটা আসবে)' 
                      : 'Interactive summary and dynamic implementation guidelines from global finance best-sellers.'}
                  </p>
                </div>

                {/* Book select pills */}
                <div className="flex flex-wrap gap-2">
                  {FINANCIAL_BOOKS_DATA.map((bk) => (
                    <button
                      key={bk.id}
                      onClick={() => {
                        setSelectedBookId(bk.id);
                        setCurrentCardIndex(0);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition select-none cursor-pointer border ${
                        selectedBookId === bk.id
                          ? 'bg-amber-500/15 border-amber-500/35 text-amber-400'
                          : 'bg-slate-950/80 border-slate-900 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {state.language === 'bn' ? bk.titleBn : bk.titleEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deck Controller Header */}
              <div className="p-4 bg-slate-950/80 flex items-center justify-between gap-4 border-b border-slate-900">
                {/* Bookmark Filter Switch */}
                <button
                  onClick={() => {
                    setOnlyShowBookmarked(!onlyShowBookmarked);
                    setCurrentCardIndex(0);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-[10px] font-bold tracking-wide transition flex items-center gap-1.5 cursor-pointer select-none border ${
                    onlyShowBookmarked
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-500 font-black'
                      : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${onlyShowBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                  <span>
                    {state.language === 'bn' 
                      ? (onlyShowBookmarked ? '⭐ শুধু বুকমার্ক করা কার্ডস' : '⭐ সব কার্ডস দেখুন') 
                      : (onlyShowBookmarked ? 'Show Starred Only' : 'Show All Cards')}
                  </span>
                </button>

                <div className="text-[10px] text-slate-500 font-mono">
                  {state.language === 'bn' ? 'ফোকাসড সেলফ-লার্নিং ডেক' : 'Focused Self-Learning Desk'}
                </div>
              </div>

              {/* The active card body */}
              {(() => {
                const activeBook = FINANCIAL_BOOKS_DATA.find(b => b.id === selectedBookId) || FINANCIAL_BOOKS_DATA[0];
                const cardsToDisplay = onlyShowBookmarked
                  ? activeBook.cards.filter(c => bookmarkedCardIds.includes(c.id))
                  : activeBook.cards;

                if (cardsToDisplay.length === 0) {
                  return (
                    <div className="p-12 text-center space-y-4">
                      <Bookmark className="w-10 h-10 text-slate-850 mx-auto animate-pulse" />
                      <div className="space-y-1">
                        <h5 className="text-xs font-bold text-slate-400">
                          {state.language === 'bn' ? 'কোনো বুকমার্ক করা কার্ড পাওয়া যায়নি!' : 'No bookmarked cards in this book!'}
                        </h5>
                        <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed font-sans mx-auto">
                          {state.language === 'bn'
                            ? 'আপনার প্রিয় সঞ্চয় কৌশলগুলো বুকমার্ক করতে সাধারণ মোডে কার্ডের বুকমার্ক আইকনে ক্লিক করুন।'
                            : 'Bookmark your favorite savings lessons so they show up here immediately.'}
                        </p>
                      </div>
                    </div>
                  );
                }

                // Bound index safely
                const safeIdx = Math.min(Math.max(0, currentCardIndex), cardsToDisplay.length - 1);
                const card = cardsToDisplay[safeIdx];
                const isBookmarked = bookmarkedCardIds.includes(card.id);

                return (
                  <div className="p-6 space-y-5 bg-gradient-to-b from-slate-950/90 to-slate-950 relative min-h-[420px] flex flex-col justify-between">
                    
                    {/* Chapter & Title Header */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[9px] font-black uppercase text-amber-600 tracking-wider font-mono bg-amber-500/5 px-2.5 py-0.5 rounded-full border border-amber-500/10">
                          {state.language === 'bn' ? card.chapterBn : card.chapterEn}
                        </span>
                        
                        {/* Bookmark Trigger Button */}
                        <button
                          type="button"
                          onClick={() => toggleBookmark(card.id)}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-amber-500 transition-colors cursor-pointer"
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                        </button>
                      </div>

                      <h3 className="text-sm font-black text-slate-100 tracking-tight leading-snug">
                        {state.language === 'bn' ? card.titleBn : card.titleEn}
                      </h3>
                    </div>

                    {/* Book Quote - styled beautifully */}
                    <div className="p-4 rounded-2xl bg-amber-950/15 border border-amber-900/25 relative overflow-hidden italic text-slate-300 text-xs leading-relaxed font-serif pl-8 shadow-sm">
                      <span className="absolute left-3 top-2 text-3xl font-black text-amber-500/35 font-serif select-none">“</span>
                      {state.language === 'bn' ? card.quoteBn : card.quoteEn}
                    </div>

                    {/* Wisdom text */}
                    <div className="space-y-1">
                      <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest font-mono">
                        {state.language === 'bn' ? '🔑 অন্তর্নিহিত মূল প্রজ্ঞা' : '🔑 Core Wisdom Summary'}
                      </h5>
                      <p className="text-[11.5px] text-slate-400 leading-relaxed font-sans">
                        {state.language === 'bn' ? card.wisdomBn : card.wisdomEn}
                      </p>
                    </div>

                    {/* Trap zone */}
                    <div className="p-3.5 rounded-xl bg-rose-950/10 border border-rose-950/60 flex items-start gap-3">
                      <div className="p-1.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/10 shrink-0">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-0.5">
                        <h6 className="text-[9px] font-black uppercase text-rose-400 tracking-wider font-mono">
                          {state.language === 'bn' ? '🚨 অবচেতন খরচের মানসিক ফাঁদ (Trap)' : '🚨 Unconscious Spending Trap'}
                        </h6>
                        <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                          {state.language === 'bn' ? card.trapBn : card.trapEn}
                        </p>
                      </div>
                    </div>

                    {/* Action Plan */}
                    <div className="p-4 rounded-xl bg-emerald-950/10 border border-emerald-950/60 space-y-1">
                      <h6 className="text-[9px] font-black uppercase text-emerald-400 tracking-wider font-mono">
                        {state.language === 'bn' ? '🎯 বাস্তবমুখী সঞ্চয় অ্যাকশন প্ল্যান' : '🎯 Actionable Savings Roadmap'}
                      </h6>
                      <p className="text-[11px] text-slate-400 leading-relaxed whitespace-pre-line font-sans">
                        {state.language === 'bn' ? card.actionPlanBn : card.actionPlanEn}
                      </p>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="pt-4 border-t border-slate-900/60 flex items-center justify-between gap-4 mt-2">
                      <span className="text-[10px] text-slate-500 font-mono">
                        {state.language === 'bn' 
                          ? `পৃষ্ঠা: ${num(safeIdx + 1)} / ${num(cardsToDisplay.length)}` 
                          : `Card: ${safeIdx + 1} of ${cardsToDisplay.length}`}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={safeIdx === 0}
                          onClick={() => setCurrentCardIndex(safeIdx - 1)}
                          className="py-1.5 px-3 rounded-lg bg-slate-900 border border-slate-850 text-slate-400 hover:text-slate-200 transition disabled:opacity-40 disabled:cursor-not-allowed text-[10px] font-black font-mono select-none cursor-pointer"
                        >
                          {state.language === 'bn' ? '◀️ পূর্ববর্তী' : '◀️ Previous'}
                        </button>
                        <button
                          type="button"
                          disabled={safeIdx === cardsToDisplay.length - 1}
                          onClick={() => setCurrentCardIndex(safeIdx + 1)}
                          className="py-1.5 px-3 rounded-lg bg-slate-900 border border-slate-850 text-slate-400 hover:text-slate-200 transition disabled:opacity-40 disabled:cursor-not-allowed text-[10px] font-black font-mono select-none cursor-pointer"
                        >
                          {state.language === 'bn' ? 'পরবর্তী ▶️' : 'Next ▶️'}
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })()}
            </div>

          </div>
        </div>
      )}

      {/* VIEW D: CINEMATIC DEBT & LOAN LEDGER (দেনা পাওনা খাতা) */}
      {subTab === 'debt' && (() => {
        // Compute cinematic statistics
        const totalBorrowedAll = debts.filter(d => d.type === 'borrowed').reduce((sum, d) => sum + d.amount, 0);
        const settledBorrowed = debts.filter(d => d.type === 'borrowed' && d.status === 'paid').reduce((sum, d) => sum + d.amount, 0);
        const totalLentAll = debts.filter(d => d.type === 'lent').reduce((sum, d) => sum + d.amount, 0);
        const settledLent = debts.filter(d => d.type === 'lent' && d.status === 'paid').reduce((sum, d) => sum + d.amount, 0);
        
        const borrowedPercent = totalBorrowedAll > 0 ? Math.round((settledBorrowed / totalBorrowedAll) * 100) : 0;
        const lentPercent = totalLentAll > 0 ? Math.round((settledLent / totalLentAll) * 100) : 0;

        const netBalance = totalLentPending - totalBorrowedPending;
        const isOwedNet = netBalance >= 0;
        const absNet = Math.abs(netBalance);

        // Filter debts based on search and status tabs
        const filteredDebts = debts.filter(d => {
          // Status filter
          if (debtStatusFilter === 'pending' && d.status !== 'pending') return false;
          if (debtStatusFilter === 'paid' && d.status !== 'paid') return false;

          // Search filter
          if (!debtSearch.trim()) return true;
          const matchName = d.personName.toLowerCase().includes(debtSearch.toLowerCase());
          const matchDesc = d.description?.toLowerCase().includes(debtSearch.toLowerCase()) || false;
          return matchName || matchDesc;
        });

        return (
          <div className="space-y-6">
            
            {/* DYNAMIC CINEMATIC DEBT OVERVIEW HUB */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* CARD 1: WHAT I OWE (মোট দেনা) */}
              <div className="p-6 rounded-3xl bg-slate-950/65 border border-rose-950/40 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between min-h-[180px] shadow-[0_0_30px_rgba(239,68,68,0.015)] group hover:border-rose-900/60 transition-all duration-300">
                {/* Glow ring */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-colors" />
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-rose-600 to-transparent" />
                
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-450 uppercase tracking-widest block font-mono">
                      {state.language === 'bn' ? '🔴 মোট দেনা (Owed)' : 'Total Debt (What I Owe)'}
                    </span>
                    <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-mono">
                      {state.language === 'bn' ? 'পরিশোধ করতে হবে' : 'To Pay'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    {state.language === 'bn' ? 'অন্যদের কাছ থেকে হাওলাদ আনা বকেয়া পরিশোধযোগ্য অর্থ।' : 'Active borrowed cash that you need to pay back.'}
                  </p>
                </div>

                <div className="mt-4">
                  <h3 className="text-3xl font-black text-rose-450 font-mono tracking-tight flex items-baseline gap-1">
                    {num(totalBorrowedPending)} <span className="text-xs text-slate-400 font-sans">BDT</span>
                  </h3>
                  
                  {/* Progress bar info */}
                  <div className="mt-3.5 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-450">
                      <span>{state.language === 'bn' ? `পরিশোধিত: ${num(settledBorrowed)} BDT` : `Settled: ${settledBorrowed} BDT`}</span>
                      <span className="font-mono">{borrowedPercent}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-950/80 overflow-hidden border border-slate-900">
                      <div 
                        className="h-full bg-gradient-to-r from-red-600 to-rose-400 rounded-full transition-all duration-500"
                        style={{ width: `${borrowedPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: WHAT I AM OWED (মোট পাওনা) */}
              <div className="p-6 rounded-3xl bg-slate-950/65 border border-blue-950/40 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between min-h-[180px] shadow-[0_0_30px_rgba(59,130,246,0.015)] group hover:border-blue-900/60 transition-all duration-300">
                <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-blue-600 to-transparent" />
                
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block font-mono">
                      {state.language === 'bn' ? '🟢 মোট পাওনা (Owed to Me)' : 'Total Receivables (Lent)'}
                    </span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono">
                      {state.language === 'bn' ? 'আদায়যোগ্য ধার' : 'Receivables'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    {state.language === 'bn' ? 'অন্য বন্ধুদের ধার দেওয়া অর্থ যা এখনও উদ্ধার করা বাকি।' : 'Active cash you lent to friends/others.'}
                  </p>
                </div>

                <div className="mt-4">
                  <h3 className="text-3xl font-black text-blue-400 font-mono tracking-tight flex items-baseline gap-1">
                    {num(totalLentPending)} <span className="text-xs text-slate-400 font-sans">BDT</span>
                  </h3>
                  
                  {/* Progress bar info */}
                  <div className="mt-3.5 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-450">
                      <span>{state.language === 'bn' ? `উদ্ধারকৃত: ${num(settledLent)} BDT` : `Recovered: ${settledLent} BDT`}</span>
                      <span className="font-mono">{lentPercent}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-950/80 overflow-hidden border border-slate-900">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${lentPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 3: NET DEBT STATUS RING */}
              <div className={`p-6 rounded-3xl bg-slate-950/65 border backdrop-blur-xl relative overflow-hidden flex flex-col justify-between min-h-[180px] transition-all duration-300 group ${
                isOwedNet 
                  ? 'border-emerald-950/60 hover:border-emerald-900 shadow-[0_0_30px_rgba(16,185,129,0.03)]' 
                  : 'border-amber-950/80 hover:border-amber-900/60 shadow-[0_0_30px_rgba(245,158,11,0.03)]'
              }`}>
                <div className={`absolute top-0 right-0 w-36 h-36 rounded-full blur-2xl group-hover:opacity-80 transition-opacity ${isOwedNet ? 'bg-emerald-500/5' : 'bg-amber-500/5'}`} />
                <div className={`absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b ${isOwedNet ? 'from-emerald-600' : 'from-amber-600'} to-transparent`} />
                
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-widest block font-mono ${isOwedNet ? 'text-emerald-450' : 'text-amber-500'}`}>
                      {state.language === 'bn' ? '⚖️ নেট সমতা (Net Position)' : 'Net Debt Ledger Balance'}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono border ${
                      isOwedNet 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                    }`}>
                      {state.language === 'bn' 
                        ? (isOwedNet ? 'সারপ্লাস' : 'ঘাটতি দায়')
                        : (isOwedNet ? 'Surplus' : 'Deficit')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-550 mt-1.5 leading-relaxed">
                    {state.language === 'bn' 
                      ? (isOwedNet ? 'সব দেনা পরিশোধ হলেও আপনার কাছে অতিরিক্ত উদ্বৃত্ত থাকবে।' : 'সকল ধার উসুলের পরেও আপনার এই টাকা ঘাটতি থাকবে পরিশোধে।')
                      : (isOwedNet ? 'Your net surplus after paying off all outstanding debts.' : 'Your net total liability after retrieving all lent funds.')}
                  </p>
                </div>

                <div className="mt-4 flex items-baseline justify-between gap-2">
                  <h3 className={`text-3xl font-black font-mono tracking-tight ${isOwedNet ? 'text-emerald-450' : 'text-amber-500'}`}>
                    {isOwedNet ? '+' : '-'}{num(absNet)} <span className="text-xs text-slate-450 font-sans">BDT</span>
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {state.language === 'bn' ? 'মোট লেজার ব্যালেন্স' : 'Net Ledger Balance'}
                  </span>
                </div>
              </div>

            </div>

            {/* MRIDHAX AI SMART EXECUTIVE ADVICE */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900/60 to-slate-950 border border-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.015)] relative overflow-hidden">
              <div className="absolute top-1/2 -translate-y-1/2 right-12 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-550 shrink-0">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold tracking-widest text-amber-550 uppercase font-mono">
                    {state.language === 'bn' ? '🤖 MridhaX AI পরামর্শ ও আর্থিক নিরীক্ষা' : '🤖 MridhaX AI Executive Audit'}
                  </h4>
                  <p className="text-[11px] text-slate-350 leading-relaxed">
                    {(() => {
                      if (debts.length === 0) {
                        return state.language === 'bn' 
                          ? 'আপনার দেনা-পাওনা খাতা একদম পরিষ্কার। কোনো রেকর্ড নেই। আর্থিক শৃঙ্খলা বজায় রাখতে লেনদেন হলে তা এন্ট্রি করে রাখুন।'
                          : 'Your debt ledger is currently pristine. Log transactions as they occur to keep a reliable audit trail.';
                      }
                      
                      if (totalBorrowedPending === 0 && totalLentPending === 0) {
                        return state.language === 'bn'
                          ? 'অসাধারণ! আপনার সব বকেয়া ও পাওনা আদায় সম্পন্ন হয়েছে। আপনার কোনো সক্রিয় ধারদেনা নেই! একটি আদর্শ মুক্ত বাজেট বজায় রাখছেন।'
                          : 'Outstanding financial discipline! All outstanding accounts have been cleared. You are debt-free.';
                      }

                      if (isOwedNet && netBalance > 0) {
                        return state.language === 'bn'
                          ? `ইতিবাচক অবস্থান! আপনার দেনার চেয়ে পাওনা অর্থ ${num(absNet)} BDT বেশি। বন্ধুদের দেওয়া ধারগুলো সময়মতো উসুল করতে আমাদের "WhatsApp Reminder" বাটনটি ব্যবহার করে ভদ্রভাবে মনে করিয়ে দিন।`
                          : `Positive stance! Your receivables exceed your debts by ${absNet} BDT. Gently request payback from your friends using our polite "WhatsApp Reminder" helper.`;
                      } else if (!isOwedNet && absNet > 0) {
                        return state.language === 'bn'
                          ? `সচেতনতা প্রয়োজন! আপনার পাওনার চেয়ে দেনা ${num(absNet)} BDT বেশি রয়েছে। বকেয়া পরিশোধে একটি সঞ্চয় বাজেট তৈরি করুন যাতে কোনো জরিমানা বা সম্পর্কে দূরত্ব না তৈরি হয়।`
                          : `Attention needed! Your current liabilities exceed your receivables by ${absNet} BDT. Allocate some funds from your budget to clear off these debts as soon as possible.`;
                      } else {
                        return state.language === 'bn'
                          ? 'আপনার দেনা এবং পাওনা সমান অবস্থানে রয়েছে। দেনা শোধ করতে পাওনা টাকা তুলতে আজই তাগিদ দিন!'
                          : 'Your receivables and liabilities are balanced. Try retrieving your lent money to clear your debts.';
                      }
                    })()}
                  </p>
                </div>
              </div>
            </div>

            {/* DYNAMIC ACTION TRIGGER & SEARCH CRITERIA */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-950/40 p-4 rounded-3xl border border-slate-900/60">
              
              {/* STATUS FILTER PILLS */}
              <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-850 w-full md:w-auto self-stretch md:self-auto">
                <button
                  onClick={() => setDebtStatusFilter('all')}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition select-none cursor-pointer flex items-center justify-center gap-1.5 ${
                    debtStatusFilter === 'all'
                      ? 'bg-slate-900 border border-slate-800 text-amber-500 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{state.language === 'bn' ? 'সব রেকর্ড' : 'All'}</span>
                </button>
                <button
                  onClick={() => setDebtStatusFilter('pending')}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition select-none cursor-pointer flex items-center justify-center gap-1.5 ${
                    debtStatusFilter === 'pending'
                      ? 'bg-amber-950/40 border border-amber-900/30 text-amber-500 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{state.language === 'bn' ? 'চলমান' : 'Pending'}</span>
                </button>
                <button
                  onClick={() => setDebtStatusFilter('paid')}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition select-none cursor-pointer flex items-center justify-center gap-1.5 ${
                    debtStatusFilter === 'paid'
                      ? 'bg-emerald-950/40 border border-emerald-900/30 text-emerald-450 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{state.language === 'bn' ? 'পরিশোধিত' : 'Cleared'}</span>
                </button>
              </div>

              {/* SEARCH & ADD BTN */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto self-stretch md:self-auto">
                {/* SEARCH */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={debtSearch}
                    onChange={(e) => setDebtSearch(e.target.value)}
                    placeholder={state.language === 'bn' ? 'বন্ধুর নাম বা বিবরণ দিয়ে খুঁজুন...' : 'Search by name or description...'}
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-950 border border-slate-850 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition font-sans"
                  />
                  {debtSearch && (
                    <button 
                      onClick={() => setDebtSearch('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-550 hover:text-slate-200"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* BUTTON TO TOGGLE FORM */}
                <button
                  onClick={() => setShowDebtForm(!showDebtForm)}
                  className={`w-full sm:w-auto py-2.5 px-5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer select-none border ${
                    showDebtForm
                      ? 'bg-slate-950 border-slate-850 text-slate-350 hover:text-white'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] border-amber-600/25'
                  }`}
                >
                  {showDebtForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>
                    {showDebtForm 
                      ? (state.language === 'bn' ? 'ফরম বন্ধ করুন' : 'Close Console') 
                      : (state.language === 'bn' ? 'নতুন দেনা-পাওনা যোগ' : 'Add Debt/Loan')}
                  </span>
                </button>
              </div>

            </div>

            {/* COLLAPSIBLE CINEMATIC FORM PANEL */}
            <AnimatePresence>
              {showDebtForm && (
                <motion.div
                  initial={{ opacity: 0, y: -15, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -15, height: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                  className="overflow-hidden"
                >
                  <form 
                    onSubmit={handleAddDebt}
                    className="p-6 rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-950/98 to-slate-950 border border-slate-850 shadow-2xl relative"
                  >
                    {/* Corner decorative light */}
                    <div className={`absolute top-0 right-12 w-32 h-1 bg-gradient-to-r ${debtType === 'borrowed' ? 'from-rose-500' : 'from-blue-500'} to-transparent`} />
                    
                    <div className="flex items-center justify-between border-b border-slate-900 pb-3.5">
                      <h4 className="text-xs font-black uppercase tracking-wider text-amber-500 font-mono flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                        <span>{state.language === 'bn' ? 'নতুন দেনা-পাওনা লেজার এন্ট্রি' : 'New Debt/Loan Ledger Entry'}</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowDebtForm(false)}
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-850 text-slate-500 hover:text-slate-300 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
                      {/* TYPE FIELD */}
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5 font-mono">
                          {state.language === 'bn' ? '১. লেনদেনের ধরন' : '1. Ledger Type'}
                        </label>
                        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-850">
                          <button
                            type="button"
                            onClick={() => setDebtType('borrowed')}
                            className={`py-2 px-1 rounded-lg text-[10px] font-bold text-center transition cursor-pointer select-none flex items-center justify-center gap-1 ${
                              debtType === 'borrowed'
                                ? 'bg-rose-950/60 text-rose-400 shadow-sm border border-rose-500/20 font-black'
                                : 'text-slate-500 hover:text-slate-350'
                            }`}
                          >
                            <span>🔴 {state.language === 'bn' ? 'হাওলাদ এনেছি' : 'Borrowed'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDebtType('lent')}
                            className={`py-2 px-1 rounded-lg text-[10px] font-bold text-center transition cursor-pointer select-none flex items-center justify-center gap-1 ${
                              debtType === 'lent'
                                ? 'bg-blue-950/60 text-blue-400 shadow-sm border border-blue-500/20 font-black'
                                : 'text-slate-500 hover:text-slate-350'
                            }`}
                          >
                            <span>🔵 {state.language === 'bn' ? 'অন্যকে দিয়েছি' : 'Lent'}</span>
                          </button>
                        </div>
                      </div>

                      {/* PERSON NAME */}
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5 font-mono">
                          {state.language === 'bn' ? '২. কার সাথে লেনদেন (নাম)' : '2. Person Name'}
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            required
                            placeholder={state.language === 'bn' ? 'যেমন: সোহান, রায়হান' : 'e.g. Sohan, Rayhan'}
                            value={debtPerson}
                            onChange={(e) => setDebtPerson(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-850 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition font-sans"
                          />
                        </div>
                      </div>

                      {/* AMOUNT */}
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5 font-mono">
                          {state.language === 'bn' ? '৩. টাকার পরিমাণ (BDT)' : '3. Amount (BDT)'}
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="number"
                            required
                            min="1"
                            placeholder={state.language === 'bn' ? 'যেমন: ১৫০০' : 'e.g. 1500'}
                            value={debtAmount}
                            onChange={(e) => setDebtAmount(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-850 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                      {/* DATES */}
                      <div className="grid grid-cols-2 gap-3.5">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5 font-mono">
                            {state.language === 'bn' ? '৪. লেনদেনের তারিখ' : '4. Transaction Date'}
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                            <input
                              type="date"
                              required
                              value={debtDate}
                              onChange={(e) => setDebtDate(e.target.value)}
                              className="w-full pl-8.5 pr-2 py-2.5 rounded-xl bg-slate-950 border border-slate-850 text-xs text-white focus:outline-none focus:border-amber-500 transition font-mono"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5 font-mono">
                            {state.language === 'bn' ? '৫. সম্ভাব্য ফেরত ডেট' : '5. Expected Return Date'}
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                            <input
                              type="date"
                              value={debtDueDate}
                              onChange={(e) => setDebtDueDate(e.target.value)}
                              className="w-full pl-8.5 pr-2 py-2.5 rounded-xl bg-slate-950 border border-slate-850 text-xs text-white focus:outline-none focus:border-amber-500 transition font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* DESCRIPTION */}
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5 font-mono">
                          {state.language === 'bn' ? '৬. সংক্ষিপ্ত বিবরণ বা নোট (ঐচ্ছিক)' : '6. Brief Note (Optional)'}
                        </label>
                        <div className="relative">
                          <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            placeholder={state.language === 'bn' ? 'যেমন: মেসের বুয়ার বেতন দিতে ধার নিসি' : 'e.g. For mess helper payment'}
                            value={debtDesc}
                            onChange={(e) => setDebtDesc(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-850 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-amber-500 transition font-sans"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-5 border-t border-slate-900/60 mt-5 flex justify-end">
                      <button
                        type="submit"
                        className={`py-2.5 px-6 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer font-mono flex items-center gap-1.5 shadow-lg ${
                          debtType === 'borrowed'
                            ? 'bg-rose-500 hover:bg-rose-600 text-slate-950 shadow-rose-950/20'
                            : 'bg-blue-500 hover:bg-blue-600 text-slate-950 shadow-blue-950/20'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>
                          {state.language === 'bn' 
                            ? (debtType === 'borrowed' ? '✅ দেনা খাতার হিসাব সংরক্ষণ' : '✅ পাওনা খাতার হিসাব সংরক্ষণ') 
                            : 'Save Ledger Entry'}
                        </span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* DEBT REGISTRY TABLE & CARDS */}
            <div className="space-y-4">
              
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900/40 border border-slate-900/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                  <span className="text-[10px] font-black uppercase text-slate-350 tracking-wider font-mono">
                    📋 {state.language === 'bn' ? 'হাওলাদ ও দেনা-পাওনা খাতার রেকর্ড' : 'Debt & Loan History Ledger'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded font-mono border border-slate-900">
                  {state.language === 'bn' ? `মোট খুঁজে পাওয়া গেছে: ${num(filteredDebts.length)}` : `Filtered Record Count: ${filteredDebts.length}`}
                </span>
              </div>

              {filteredDebts.length === 0 ? (
                <div className="p-14 border border-dashed border-slate-900 rounded-3xl text-center space-y-4 flex flex-col items-center justify-center">
                  <div className="p-4 rounded-full bg-slate-950 border border-slate-900 text-slate-700">
                    <Handshake className="w-10 h-10 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-slate-400">
                      {state.language === 'bn' ? 'দেনা-পাওনার খাতায় কোনো তথ্য নেই!' : 'No matching entries found!'}
                    </h5>
                    <p className="text-[11px] text-slate-550 max-w-sm leading-relaxed font-sans mx-auto">
                      {state.language === 'bn' 
                        ? 'আপনার হাওলাদ আনা বা ধার দেওয়ার রেকর্ডগুলো সিনেমাটিক স্টাইলে দেখতে উপরে নতুন এন্ট্রি করুন বা অন্য ফিল্টার ট্রাই করুন।'
                        : 'Your debt history is clear. Click the button above to log borrowing or lending activities.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredDebts.map((item) => {
                    const isBorrowed = item.type === 'borrowed';
                    const isPending = item.status === 'pending';
                    
                    // Generate polite WhatsApp message URL for pending Lent items
                    let waUrl = '';
                    if (isPending && !isBorrowed) {
                      const waText = state.language === 'bn'
                        ? `সালাম ${item.personName} ভাই, আশা করি ভালো আছেন। একটি বন্ধুত্বপূর্ণ মনে করিয়ে দেওয়া, গত ${item.date} তারিখে আপনাকে দেওয়া ${item.amount} BDT ধারটি সময় সুযোগ মতো ফেরত দিলে উপকার হতো। ধন্যবাদ!`
                        : `Hi ${item.personName}, hope you are doing well! Just a gentle reminder regarding the loan of ${item.amount} BDT on ${item.date}. Whenever convenient, please clear the outstanding amount. Thank you!`;
                      waUrl = `https://wa.me/?text=${encodeURIComponent(waText)}`;
                    }

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ y: -3, transition: { duration: 0.15 } }}
                        className={`p-5 rounded-3xl bg-slate-950/70 border relative overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl ${
                          !isPending
                            ? 'border-slate-900/60 opacity-60 bg-slate-950/30'
                            : isBorrowed
                              ? 'border-rose-950/80 shadow-[0_0_20px_rgba(239,68,68,0.015)] hover:border-rose-900/80'
                              : 'border-blue-950/80 shadow-[0_0_20px_rgba(59,130,246,0.015)] hover:border-blue-900/80'
                        }`}
                      >
                        {/* GLOW DECORATIVE SIDEBAR */}
                        <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                          !isPending 
                            ? 'bg-slate-800' 
                            : isBorrowed 
                              ? 'bg-gradient-to-b from-rose-500 to-red-600' 
                              : 'bg-gradient-to-b from-blue-500 to-cyan-600'
                        }`} />

                        {/* CARD CONTENT HEADER */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* TYPE BADGE */}
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono border ${
                                !isPending
                                  ? 'bg-slate-900 border-slate-850 text-slate-400'
                                  : isBorrowed
                                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                    : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                              }`}>
                                {state.language === 'bn' 
                                  ? (isBorrowed ? '🔴 হাওলাদ এনেছি' : '🔵 অন্যকে দিয়েছি')
                                  : (isBorrowed ? 'Borrowed' : 'Lent Money')}
                              </span>

                              {/* DATE */}
                              <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                                📅 {item.date}
                              </span>
                            </div>

                            {/* PERSON NAME WITH MINI ICON */}
                            <h4 className="text-sm font-black text-slate-100 tracking-tight flex items-center gap-1.5">
                              <span className="p-1 rounded bg-slate-900/60 text-slate-400"><User className="w-3 h-3" /></span>
                              <span>{item.personName}</span>
                            </h4>

                            {/* MEMO DESCRIPTION */}
                            {item.description && (
                              <p className="text-[11px] text-slate-450 italic font-sans leading-relaxed pl-1.5 border-l border-slate-900">
                                "{item.description}"
                              </p>
                            )}
                          </div>

                          {/* AMOUNT IN COLD DESIGN */}
                          <div className="text-right">
                            <span className="text-[9px] font-bold text-slate-500 block uppercase tracking-widest font-mono">
                              {state.language === 'bn' ? 'টাকার পরিমাণ' : 'Amount'}
                            </span>
                            <span className={`text-lg font-black font-mono block mt-0.5 ${
                              !isPending
                                ? 'text-slate-500 line-through'
                                : isBorrowed
                                  ? 'text-rose-400'
                                  : 'text-blue-400'
                            }`}>
                              {num(item.amount)} BDT
                            </span>
                          </div>
                        </div>

                        {/* DUE DATE ALERT ZONE */}
                        {item.dueDate && isPending && (
                          <div className="mt-4 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[10px] text-amber-400/90 font-mono flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>
                              {state.language === 'bn' 
                                ? `ফেরত দেওয়ার সম্ভাব্য ডেট: ${item.dueDate}` 
                                : `Expected payback date: ${item.dueDate}`}
                            </span>
                          </div>
                        )}

                        {/* CARD ACTION BUTTONS */}
                        <div className="flex items-center justify-between gap-3 mt-4 pt-3.5 border-t border-slate-900/60">
                          
                          {/* STATUS TOGGLE */}
                          <button
                            onClick={() => handleToggleDebtStatus(item.id)}
                            className={`py-1.5 px-3.5 rounded-xl text-[10px] font-bold transition flex items-center gap-1.5 select-none cursor-pointer border ${
                              !isPending
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/15'
                                : 'bg-slate-900 hover:bg-slate-850 border-slate-850 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <span>{!isPending ? '✅ Settled & Closed' : '⏳ Pending'}</span>
                          </button>

                          {/* ACTION PANEL */}
                          <div className="flex items-center gap-2">
                            {/* WHATSAPP REMINDER BUTTON */}
                            {isPending && !isBorrowed && waUrl && (
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-1.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition border border-emerald-500/25 select-none"
                                title="WhatsApp Friendly Reminder"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>{state.language === 'bn' ? 'তাগিদ দিন' : 'Remind'}</span>
                              </a>
                            )}

                            {/* MARK CLEAR DIRECT LINK */}
                            {isPending && (
                              <button
                                onClick={() => handleToggleDebtStatus(item.id)}
                                className="text-[10px] font-bold text-amber-500 hover:text-amber-400 underline transition cursor-pointer select-none font-mono"
                              >
                                {state.language === 'bn' ? 'পরিশোধ চিহ্নিত করুন' : 'Mark Paid'}
                              </button>
                            )}

                            {/* DELETE BUTTON */}
                            <button
                              onClick={() => {
                                if (confirm(state.language === 'bn' ? 'আপনি কি সত্যিই এই দেনা-পাওনার রেকর্ডটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this ledger entry?')) {
                                  handleDeleteDebt(item.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 text-slate-500 hover:text-red-400 transition cursor-pointer select-none border border-slate-900"
                              title="Delete entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        );
      })()}

    </div>
  );
}
