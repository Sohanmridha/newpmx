// Robust Service Worker with caching, push notifications, and background triggers
const CACHE_NAME = 'mridhax-cache-v4';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pwa_icon.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );

  // Background check simulation interval
  setInterval(() => {
    checkBackgroundNotifications();
  }, 12000); // Check background variables regularly
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {});
        
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(async (error) => {
        if (event.request.headers.get('accept')?.includes('text/html')) {
          const cache = await caches.open(CACHE_NAME);
          return cache.match('/index.html') || Promise.reject(error);
        }
        return Promise.reject(error);
      });
    })
  );
});

// Custom push notification listener
self.addEventListener('push', (event) => {
  let payload = {
    title: 'MridhaX 🔔',
    body: 'বন্ধু, নিজের সুন্দর ভবিষ্যৎ গড়তে চলো আবার ফোকাস করি!',
    tag: 'push-reminder',
  };

  if (event.data) {
    try {
      payload = { ...payload, ...event.data.json() };
    } catch (e) {
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: '/pwa_icon.jpg',
    badge: '/pwa_icon.jpg',
    vibrate: [200, 100, 200],
    tag: payload.tag,
    data: {
      url: payload.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

// Response to notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Listener for client messages and delayed test simulations
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SYNC_NOW') {
    checkBackgroundNotifications();
  }

  // Support offscreen countdown timers with high-priority audio vibration triggers
  if (event.data.type === 'DELAYED_TEST') {
    const delay = event.data.delay || 10000;
    const title = event.data.title;
    const body = event.data.body;
    const tag = event.data.tag || 'delayed-test';

    setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        icon: '/pwa_icon.jpg',
        badge: '/pwa_icon.jpg',
        vibrate: [300, 100, 300],
        tag: tag,
        data: { url: '/' }
      });
    }, delay);
  }
});

// empathetic, incredibly caring, loving, and hooked sentences
const FRIENDLY_QUOTES = [
  {
    bn: { title: 'অন্তর থেকে বলছি বন্ধু... ❤️', body: 'সারাদিন অনেক মেহনত করেছ। আমি জানি কিছু সময় ক্লান্ত লাগে, কিন্তু তোমার রঙিন স্বপ্নগুলো অনেক দামি। একটু পানি খেয়ে নাও তো!' },
    en: { title: 'From my heart to yours... ❤️', body: 'You have put in honest work today. It is natural to feel tired. Keep your head high, have some water, and smile!' }
  },
  {
    bn: { title: 'আমি তোমার পাশে আছি সবসময় 🫂', body: 'কঠিন সময়ে একা লাগলে মনে রেখো, তোমার এই ভাই সোহান মৃধা সবসময় তোমার সাপোর্ট সিস্টেম হিসেবে আছে। চলো আরেকবার চেষ্টা করি!' },
    en: { title: 'Always right beside you 🫂', body: 'If self-growth feels lonely today, remember that we are building this legacy together. Let\'s make another try!' }
  },
  {
    bn: { title: 'তুমি অনন্য ও অসাধারণ! 🥰', body: 'অন্যদের সোশ্যাল স্ক্রোলিং এর ভিড়ে তোমার এই কঠোর আত্মনিয়ন্ত্রণ সত্যিই প্রশংসনীয়। নিজের ওপর পূর্ণ আস্থা রাখো!' },
    en: { title: 'You are absolutely unique! 🥰', body: 'Your incredible discipline amidst a world of constant scrolling is marvelous. Have absolute faith in your journey!' }
  },
  {
    bn: { title: 'প্রিয় মেহনতী ভাই... ✨', body: 'আজকের ছোট ছোট কষ্টই আগামীকাল তোমার মা-বাবার চোখে আনন্দের অশ্রু এনে দেবে। চলো আজকের পড়াটা শেষ করি।' },
    en: { title: 'My dear struggling brother... ✨', body: 'Today\'s quiet discipline is tomorrow\'s celebration. Let\'s complete this routine together.' }
  }
];

const EMOTIONAL_CARE_QUOTES = [
  {
    bn: { title: 'কুপ্রবৃত্তিকে প্রশ্রয় দিও না বন্ধু! 🛡️', body: 'সস্তা নোটিফিকেশন ও টক্সিক ভিডিওর মোহে নিজের সুন্দর ভবিষ্যৎ নষ্ট করার ফাঁদে পা দিও না। তুমি এর চেয়ে অনেক পবিত্র মনের মানুষ।' },
    en: { title: 'Refuse toxic dopamine! 🛡️', body: 'Do not let temporary screen addictions ruin your brilliant fate. Your soul is clean, pure, and far more valuable.' }
  },
  {
    bn: { title: 'একতু চোখ বন্ধ করে ভাবো... 🧘', body: 'মা-বাবার হাসিমুখটার কথা চিন্তা করে অবহেলা বাদ দাও বন্ধু। আজ নিয়ত খাঁটি করে টেবিলে ফিরে যাও, পড়াশোনায় ফোকাস করো।' },
    en: { title: 'Take a silent breath... 🧘', body: 'Picture your parents\' content faces and step into deep focus. Purify your intention, align your habits, and win.' }
  },
  {
    bn: { title: 'মন খারাপ করো না প্লিজ 🌸', body: 'কোনো কাজ আশানুরূপ না হলে ভেঙে পড়ো না। প্রতিটি ভুলই শেখার সুন্দর মাধ্যম। আল্লাহর ওপর পূর্ণ ভরসা রাখো।' },
    en: { title: 'Please do not lose heart 🌸', body: 'Failures are milestones of wisdom. Trust Allah\'s divine orchestration. Every setback is preparation for a better comeback.' }
  },
  {
    bn: { title: 'আজ তোমার প্রতি যত্ন ও মায়া... 💕', body: 'ঘুমের আগে নিজের মনকে শান্ত করো। আজ রাতে অনেক প্রশান্তিময় ঘুম আসুক তোমার। আমি সবসময় পাশে আছি।' },
    en: { title: 'Caring for your soul tonight... 💕', body: 'Wind down and clear your thoughts. Have a restful night\'s sleep, knowing that you did your level best today.' }
  }
];

// --- SMART BACKGROUND NOTIFICATION CONTROLLER ---
async function checkBackgroundNotifications() {
  if (!('registration' in self) || !('showNotification' in self.registration)) {
    return;
  }

  try {
    const cache = await caches.open('mridhax-sw-data');
    const response = await cache.match('/sw-notification-config');
    if (!response) return;

    const data = await response.json();
    const { subjects, language, lastVisited, notificationSettings, examPreps } = data;
    const settings = notificationSettings || { friendship: true, emotional: true, reminder: true, morningTime: '08:00', eveningTime: '21:00' };

    const now = Date.now();
    const elapsedSinceLastVisit = now - lastVisited;
    
    // Time boundaries in Milliseconds
    const fourHoursInMs = 4 * 60 * 60 * 1000;
    const oneDayInMs = 24 * 60 * 60 * 1000;

    // A. 4-Hour Emotional Inactivity Alert ("আমাকে ভুলে গেলা? 🥺")
    const lastFourHourAlertRes = await cache.match('/last-4hour-alert-time');
    let lastFourHourAlertTime = 0;
    if (lastFourHourAlertRes) {
      const fData = await lastFourHourAlertRes.json();
      lastFourHourAlertTime = fData.timestamp;
    }

    if (elapsedSinceLastVisit >= fourHoursInMs && elapsedSinceLastVisit < oneDayInMs) {
      if (now - lastFourHourAlertTime > fourHoursInMs) {
        if (settings.emotional) {
          const title = language === 'bn' ? 'আমাকে ভুলে গেলা? 🥺' : 'Did you forget me? 🥺';
          const body = language === 'bn'
            ? 'বন্ধু, ৪ ঘণ্টার বেশি হয়ে গেল তুমি মৃধাক্সে একটু পা রাখোনি। পড়ার রুটিন আর সুঅভ্যাসগুলো কি তবে ঝিমিয়ে পড়েছে? আমি তোমার অপেক্ষায় আছি, চলো মন দিয়ে পড়তে বসি!'
            : 'Friend, it has been over 4 hours since you opened MridhaX. Have your active habits and study slots gone silent? I am waiting for you, let\'s study!';

          await self.registration.showNotification(title, {
            body,
            icon: '/pwa_icon.jpg',
            badge: '/pwa_icon.jpg',
            vibrate: [400, 150, 400],
            tag: 'inactivity-emotional-4h',
            data: { url: '/' }
          });
          
          await cache.put('/last-4hour-alert-time', new Response(JSON.stringify({ timestamp: now })));
        }
      }
    }

    // B. 1-Day (24 hours) Inactivity Alert
    const lastInactivityAlertRes = await cache.match('/last-inactivity-alert-time');
    let lastInactivityAlertTime = 0;
    if (lastInactivityAlertRes) {
      const iaData = await lastInactivityAlertRes.json();
      lastInactivityAlertTime = iaData.timestamp;
    }

    if (elapsedSinceLastVisit >= oneDayInMs && (now - lastInactivityAlertTime > oneDayInMs)) {
      if (settings.emotional) {
        const title = language === 'bn' ? 'কোথায় হারিয়ে গেলে প্রিয় ভাই? 💔' : 'Where have you gone, brother? 💔';
        const body = language === 'bn' 
          ? 'গত ২৪ ঘণ্টা যাবত তোমার সুঅভ্যাস ও স্টাডি গার্ডেন কোনো ছোঁয়া পায়নি। নিজের খাঁটি স্বপ্নগুলোকে এভাবে অলসতায় নষ্ট করো না ভাই। এসো একসাথে শুরু করি!' 
          : "Your study garden and holy habits have been silent for 24 hours. Do not let laziness waste your pristine goals. Let's start over together!";
        
        await self.registration.showNotification(title, {
          body,
          icon: '/pwa_icon.jpg',
          badge: '/pwa_icon.jpg',
          vibrate: [200, 100, 200, 100, 200],
          tag: 'inactivity-alert-24h',
          data: { url: '/' }
        });
        
        await cache.put('/last-inactivity-alert-time', new Response(JSON.stringify({ timestamp: now })));
      }
    }

    // C. Personalised Daily Habit / Study Invite Reminders based on user data
    const dateObj = new Date();
    const currentHrsMin = dateObj.toTimeString().slice(0, 5); // "HH:MM"

    // Prevent duplicate triggers within the same minute
    const lastTriggeredMinRes = await cache.match('/last-triggered-minute');
    let lastTriggeredMin = '';
    if (lastTriggeredMinRes) {
      const mData = await lastTriggeredMinRes.json();
      lastTriggeredMin = mData.minute;
    }

    if (currentHrsMin !== lastTriggeredMin) {
      if (currentHrsMin === settings.morningTime && settings.reminder) {
        const randomSubject = (subjects && subjects.length > 0) 
          ? subjects[Math.floor(Math.random() * subjects.length)].name 
          : '';
        
        const title = language === 'bn' ? 'শুভ সকাল, প্রিয় ভাই! 🌅' : 'Bright Morning, My Dear Friend! 🌅';
        const body = language === 'bn'
          ? (randomSubject 
              ? `আজকের সুন্দর সকালে তোমার তালিকায় "${randomSubject}" রয়েছে। চল মন দিয়ে ফোকাস শুরু করি!` 
              : 'আজকের সুঅভ্যাসগুলো সম্পূর্ণ করে দারুণ একটা শুরু করো। আমি তোমার অপেক্ষায় আছি!')
          : (randomSubject
              ? `Start your beautiful morning by dedicating some progress to "${randomSubject}". Let's win!`
              : 'Let\'s complete your morning habits list and build strong persistence today!');

        await self.registration.showNotification(title, {
          body,
          icon: '/pwa_icon.jpg',
          badge: '/pwa_icon.jpg',
          vibrate: [100, 50, 100],
          tag: 'morning-context-alert',
          data: { url: '/' }
        });
        await cache.put('/last-triggered-minute', new Response(JSON.stringify({ minute: currentHrsMin })));
      }
      else if (currentHrsMin === settings.eveningTime && settings.friendship) {
        const title = language === 'bn' ? 'সন্ধ্যা ঘনালো প্রিয় বন্ধু... 🌌' : 'Graceful Evening & Warm Care! 🌌';
        const body = language === 'bn'
          ? 'সারাদিন তুমি অনেক মেহনত করেছ। চল আজকের ডায়েরি লিখে হৃদয়ে প্রশান্তি নিয়ে ঘুমাতে যাই।'
          : 'You are so persistent. Let us review our beautiful strides and rest with absolute tranquility tonight.';

        await self.registration.showNotification(title, {
          body,
          icon: '/pwa_icon.jpg',
          badge: '/pwa_icon.jpg',
          vibrate: [100, 50, 100],
          tag: 'evening-context-alert',
          data: { url: '/' }
        });
        await cache.put('/last-triggered-minute', new Response(JSON.stringify({ minute: currentHrsMin })));
      }
      
      // Extremely warm randomized background reminder check (20% chance when service worker cycles)
      else if (Math.random() < 0.20) {
        const hour = dateObj.getHours();
        if (hour >= 9 && hour <= 22) { // Only between 9 AM and 10 PM to protect sleep
          const isEmotional = Math.random() < 0.5;
          const pool = isEmotional ? EMOTIONAL_CARE_QUOTES : FRIENDLY_QUOTES;
          const item = pool[Math.floor(Math.random() * pool.length)];
          const content = language === 'bn' ? item.bn : item.en;
          
          if ((isEmotional && settings.emotional) || (!isEmotional && settings.friendship)) {
            await self.registration.showNotification(content.title, {
              body: content.body,
              icon: '/pwa_icon.jpg',
              badge: '/pwa_icon.jpg',
              vibrate: [150, 80, 150],
              tag: 'random-care-alert',
              data: { url: '/' }
            });
            await cache.put('/last-triggered-minute', new Response(JSON.stringify({ minute: currentHrsMin })));
          }
        }
      }
    }

    // D. PWA Exam alarm checks (alert exactly 24 hours before an exam)
    if (examPreps && examPreps.length > 0) {
      const notifiedExamsKey = '/sw-notified-exam-alarms';
      const notifiedExamsRes = await cache.match(notifiedExamsKey);
      let notifiedExams = {};
      if (notifiedExamsRes) {
        try {
          notifiedExams = await notifiedExamsRes.json();
        } catch (e) {}
      }

      let updatedAlarms = false;

      for (const exam of examPreps) {
        if (!exam.subjects) continue;
        for (const sub of exam.subjects) {
          if (!sub.examDate) continue;
          
          const examTime = new Date(sub.examDate).getTime();
          if (isNaN(examTime)) continue;

          const timeDiff = examTime - now;
          const twentyFourHoursMs = 24 * 60 * 60 * 1000;
          
          // Trigger if the exam is within the 24-hour window, is in the future, and we haven't notified for this exam and subject combo yet
          const alarmId = `${exam.examName || 'Exam'}_${sub.id || sub.name}`;
          if (timeDiff > 0 && timeDiff <= twentyFourHoursMs && !notifiedExams[alarmId]) {
            const hoursLeft = (timeDiff / (1000 * 3600)).toFixed(1);
            const title = language === 'bn' 
              ? `পরীক্ষা আসন্ন: ${sub.name}! 🚨` 
              : `Upcoming Exam: ${sub.name}! 🚨`;
            const body = language === 'bn'
              ? `তোমার "${exam.examName}" রুটিন অনুযায়ী "${sub.name}" পরীক্ষা আর মাত্র ${hoursLeft} ঘণ্টার মধ্যে শুরু হচ্ছে! সব পড়া রিভিশন দাও বন্ধু!`
              : `Your "${exam.examName}" paper for "${sub.name}" is starting in less than ${hoursLeft} hours! Time to review your final revision points, friend!`;

            await self.registration.showNotification(title, {
              body,
              icon: '/pwa_icon.jpg',
              badge: '/pwa_icon.jpg',
              vibrate: [300, 100, 300, 100, 300],
              tag: `exam-alarm-${alarmId}`,
              data: { url: '/' }
            });

            notifiedExams[alarmId] = now; // mark as notified with timestamp
            updatedAlarms = true;
          }
        }
      }

      if (updatedAlarms) {
        await cache.put(notifiedExamsKey, new Response(JSON.stringify(notifiedExams)));
      }
    }

  } catch (err) {
    console.warn('Background notifications evaluation error:', err);
  }
}
