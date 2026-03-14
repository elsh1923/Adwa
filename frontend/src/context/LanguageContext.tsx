import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type Language = 'en' | 'am';

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// ─── All static UI translations ───────────────────────────────────────────────
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    'nav.home':       'Home',
    'nav.story':      'Story',
    'nav.chat':       'Heroes Chat',
    'nav.strategy':   'Strategy',
    'nav.timeline':   'Timeline',
    'nav.quiz':       'Quiz',
    'nav.cta':        'Start the Story',

    // Footer
    'footer.tagline': 'Bringing Ethiopian history to life through intelligence and interactive storytelling.',
    'footer.explore': 'Explore',
    'footer.history': 'History',
    'footer.about':   'About',
    'footer.mission': 'Our Mission',
    'footer.share':   'Share Your Story',
    'footer.resources': 'Educational Resources',
    'footer.feedback': 'Feedback',
    'footer.copyright': '© 2026 Adwa AI Learning Hub · Celebrating 130 Years of Victory · March 1, 1896',
    'footer.context': 'Historical Context',
    'footer.leaders': 'The Leaders',
    'footer.victory': 'The Victory',
    'footer.legacy':  'The Legacy',

    // Home hero
    'home.badge':     'History Meets Intelligence',
    'home.title1':    'Adwa: The Battle',
    'home.title2':    'Reimagined',
    'home.subtitle':  'Experience the Battle of Adwa like never before — chat with historical heroes, explore tactical strategies, and learn interactively through the power of artificial intelligence.',
    'home.cta1':      'Start the Story',
    'home.cta2':      'Chat with Heroes',
    'home.cta3':      'Take the Quiz',
    'home.cta4':      'Explore Battle Strategies',
    'home.cta5':      'Timeline of Adwa',

    // Home stats
    'stats.warriors':     'Ethiopian Warriors',
    'stats.year':         'Year of Victory',
    'stats.experiences':  'AI Experiences',
    'stats.years':        'Years of Inspiration',

    // Home features section
    'features.eyebrow':   'The Learning Hub',
    'features.title':     'Five Ways to Experience Adwa',
    'features.subtitle':  'Whether through immersive AI narratives, real-time conversations with historical icons, or strategic deep-dives — every path leads to a richer understanding of Ethiopia\'s greatest victory.',
    'features.explore':   'Explore',

    // Feature cards
    'feature.story.title':    'AI Story Mode',
    'feature.story.sub':      'Immersive Narrative',
    'feature.story.desc':     'Step into 1896 Ethiopia. Experience the Battle of Adwa through an adaptive AI narrative that responds to your choices and curiosity.',
    'feature.story.badge':    'Most Popular',
    'feature.chat.title':     'Chat with Heroes',
    'feature.chat.sub':       'Living History',
    'feature.chat.desc':      'Hold conversations with Emperor Menelik II, Empress Taytu Betul, and Ras Alula — historical figures brought to life by AI.',
    'feature.chat.badge':     'Interactive',
    'feature.strategy.title': 'Battle Strategies',
    'feature.strategy.sub':   'Tactical Intelligence',
    'feature.strategy.desc':  'Explore the genius military formations, geographic advantages, and strategic decisions that led Ethiopia to an unprecedented African victory.',
    'feature.strategy.badge': 'Visual',
    'feature.timeline.title': 'Interactive Timeline',
    'feature.timeline.sub':   'Chronological Journey',
    'feature.timeline.desc':  'Navigate through key events from colonization attempts to the final glorious victory in a beautifully crafted visual timeline.',
    'feature.timeline.badge': 'Explore',
    'feature.quiz.title':     'Adwa Quiz',
    'feature.quiz.sub':       'Test Your Knowledge',
    'feature.quiz.desc':      'Challenge yourself with AI-powered questions about the Battle of Adwa. Get personalized explanations and deepen your understanding.',
    'feature.quiz.badge':     'Challenge',

    // Heroes section
    'heroes.eyebrow':   'Meet the Legends',
    'heroes.title':     'The Heroes of Adwa',
    'heroes.subtitle':  'Chat directly with these historical figures through our AI system. Ask them about the battle, their motivations, and Ethiopia\'s legacy.',
    'heroes.chat_btn':  'Start Conversation',
    'heroes.all_btn':   'Chat with All Heroes',
    'hero.menelik.name':  'Emperor Menelik II',
    'hero.menelik.role':  'Commander-in-Chief',
    'hero.menelik.desc':  'The visionary emperor who united Ethiopian forces against colonial Italy.',
    'hero.taytu.name':    'Empress Taytu Betul',
    'hero.taytu.role':    'Strategic Architect',
    'hero.taytu.desc':    "The empress who was the mastermind behind Ethiopia's diplomatic and military strategy.",
    'hero.alula.name':    'Ras Alula',
    'hero.alula.desc':    "Ethiopia's greatest military mind, who designed the tactical formations at Adwa.",
    'hero.mengesha.name': 'Ras Mengesha Yohannes',
    'hero.mengesha.role': 'Governor of Tigray',
    'hero.mengesha.desc': 'The loyal leader from Tigray who fought alongside Menelik II to defend Ethiopian sovereignty.',
    'hero.mikael.name':   'Ras Mikael of Wollo',
    'hero.mikael.role':   'Commander of Wollo Force',
    'hero.mikael.desc':   'A crucial military leader who led the powerful Wollo cavalry at the Battle of Adwa.',
    'hero.habtegiyorgis.name': 'Fitawrari Habte Giyorgis',
    'hero.habtegiyorgis.role': 'War Minister',
    'hero.habtegiyorgis.desc': 'A legendary military commander and strategist known as "Abba Mala" for his wisdom.',

    // Mission section
    'mission.eyebrow':  'Our Mission',
    'mission.title':    'Where History Comes Alive',
    'mission.p1':       'The Battle of Adwa on March 1, 1896 was Africa\'s most significant military victory against colonialism. Ethiopia\'s triumph under Emperor Menelik II became a beacon of freedom for the entire continent and beyond.',
    'mission.p2':       'Our platform uses cutting-edge AI to make this pivotal moment in history accessible, immersive, and deeply educational — honoring the warriors, leaders, and legacy of Adwa for generations to come.',
    'mission.ai':       'AI-Powered Learning',
    'mission.ai_desc':  'Adaptive AI that personalizes each learning journey to your pace and interests.',
    'mission.accurate': 'Historically Accurate',
    'mission.accurate_desc': 'All content meticulously researched and verified against historical sources.',
    'mission.pan':      'Pan-African Heritage',
    'mission.pan_desc': 'Celebrating Adwa as a symbol of African pride, sovereignty, and resilience.',
    'mission.award':    'Award-Winning Design',
    'mission.award_desc': 'Museum-quality digital experience designed to inspire and educate.',

    // Final CTA
    'cta.title':    "Begin Your Journey Through Ethiopia's Greatest Battle",
    'cta.subtitle': 'Join thousands of learners who have already explored the Battle of Adwa through the lens of artificial intelligence.',

    // Story page
    'story.chapter':   'Chapter',
    'story.complete':  '% Complete',
    'story.prev':      'Previous',
    'story.next':      'Next Chapter',
    'story.insight_title': 'AI Historical Insight',
    'story.perspective': 'Perspective',
    'story.perspective_q': 'How would you have reacted to the Treaty of Wuchale if you were a local chief?',
    'story.ask_ai':    'Ask AI Character',  

    // Heroes Chat page
    'chat.title':           'Consult the Leaders',
    'chat.subtitle':        'Choose a historical figure to begin a dialogue. Ask them about their preparations, the challenges they faced, or their vision for Ethiopia.',
    'chat.placeholder':     'Ask a question…',
    'chat.start_hint':      'Start your conversation with',
    'chat.back':            'Back',
    'chat.send':            'Send',
    'chat.menelik.role':    'King of Kings',
    'chat.menelik.desc':    'The mastermind of Ethiopian unity and modernization.',
    'chat.taytu.role':      'Strategic Advisor',
    'chat.taytu.desc':      'The fierce diplomat and brilliant tactical advisor.',
    'chat.alula.desc':      'The legendary general known as the lion of the north.',
    'chat.mengesha.role':   'Fighter & Leader',
    'chat.mengesha.desc':   'A key leader from Tigray who demonstrated unwavering unity for the crown.',
    'chat.mikael.role':     'Cavalry Commander',
    'chat.mikael.desc':     'Leader of the legendary Wollo Oromo cavalry that shattered Italian lines.',
    'chat.habtegiyorgis.role': 'Commander of the Vanguard',
    'chat.habtegiyorgis.desc': 'The brilliant field commander who led from the front at Adwa.',

    // Strategy page
    'strategy.title':       'Battle Strategy Explainer',
    'strategy.subtitle':    'Deconstruct the military brilliance and the fatal errors that decided the fate of a nation.',
    'strategy.tab_eth':     'Ethiopian Strategy',
    'strategy.tab_ita':     'Italian Strategy',
    'strategy.tab_geo':     'Geography',
    'strategy.quote':       '"The mountains were our walls, and unity was our weapon."',
    'strategy.did_you_know': 'Did You Know?',
    'strategy.fun_fact':    'The Ethiopian army was one of the first in Africa to be equipped with modern rifles and artillery, much of it acquired through clever diplomacy before the war began.',
    'strategy.eth_title': 'Ethiopian Strategic Brilliance',
    'strategy.ita_title': 'Italian Miscalculations',
    'strategy.geo_title': 'Terrain of Adwa',

    // Quiz page
    'quiz.title':     'Adwa Knowledge Test',
    'quiz.question_of': 'Question',
    'quiz.of':        'of',
    'quiz.complete':  'Quiz Complete!',
    'quiz.score':     'Your Score:',
    'quiz.try_again': 'Try Again',
    'quiz.back_home': 'Back Home',
    'quiz.ai_insight': 'AI Insight:',
    'quiz.next':      'Next Question',
    'quiz.results':   'See Results',

    // Language switcher
    'lang.en': 'English',
    'lang.am': 'አማርኛ',
  },

  am: {
    // Nav
    'nav.home':       'መነሻ',
    'nav.story':      'ታሪክ',
    'nav.chat':       'ከጀግኖች ጋር ቆይ',
    'nav.strategy':   'ስትራቴጂ',
    'nav.timeline':   'የጊዜ ሰሌዳ',
    'nav.quiz':       'ፈተና',
    'nav.cta':        'ታሪኩን ጀምር',

    // Footer
    'footer.tagline': 'የኢትዮጵያን ታሪክ ወደ ህይወት ማምጣት — በብልሃት እና በፈጠራ ትምህርት።',
    'footer.explore': 'አስሰሰ',
    'footer.history': 'ታሪክ',
    'footer.about':   'ስለ እኛ',
    'footer.mission': 'ዓላማችን',
    'footer.share':   'ታሪክዎን ያጋሩ',
    'footer.resources': 'የትምህርት ምንጮች',
    'footer.feedback': 'አስተያየት',
    'footer.copyright': '© 2026 የዓድዋ AI ትምህርት ማዕከል · ፩፻፴ ዓመታት ድሎ · መጋቢት ፳፫ ቀን ፲፰፻፹፰ ዓ.ም',
    'footer.context': 'ታሪካዊ ዳራ',
    'footer.leaders': 'መሪዎቹ',
    'footer.victory': 'ድሎ',
    'footer.legacy':  'ትሩፋት',

    // Home hero
    'home.badge':     'ታሪክ ከብልሃት ጋር ይገናኛል',
    'home.title1':    'ዓድዋ',
    'home.title2':    '',
    'home.subtitle':  'እንደቀድሞው ያልነበረ የዓድዋ ውጊያ ተሞክሮ — ከታሪካዊ ጀግኖች ጋር ቆይ፣ ስልቶችን አሰሰ፣ እና ሰው ሰራሽ ብልሃት በሚጎናጸፍ ዘዴ ተማር።',
    'home.cta1':      'ታሪኩን ጀምር',
    'home.cta2':      'ከጀግኖች ጋር ቆይ',
    'home.cta3':      'ፈተናውን ሞክር',
    'home.cta4':      'የውጊያ ስልቶችን አስሰስ',
    'home.cta5':      'የዓድዋ የጊዜ ሰሌዳ',

    // Home stats
    'stats.warriors':     'የኢትዮጵያ ተዋጊዎች',
    'stats.year':         'የድሎ ዓመት',
    'stats.experiences':  'የ AI ልምዶች',
    'stats.years':        'ዓመታት መነቃቃት',

    // Home features section
    'features.eyebrow':   'የትምህርት ማዕከሉ',
    'features.title':     'ዓድዋን ለመለማመድ አምስት መንገዶች',
    'features.subtitle':  'ይዘዋወሩ — ታሪካዊ ትረካ፣ ከምስሎች ጋር ውይይት፣ ወይም ስትራቴጂ — እያንዳንዱ መንገድ ወደ ጥልቅ ሀኔታ ያስወስዳል።',
    'features.explore':   'አስሰስ',

    // Feature cards
    'feature.story.title':    'AI ታሪክ ሁነታ',
    'feature.story.sub':      'ሰምጦ ትረካ',
    'feature.story.desc':     'ወደ ፲፰፻፹፰ ዓ.ም ኢትዮጵያ ግቡ። AI ትረካ ወደ ሚስጥራዊ የዓድዋ ውጊያ ያመጣዎታል።',
    'feature.story.badge':    'ቀዳሚ አዝናኝ',
    'feature.chat.title':     'ከጀግኖች ጋር ቆይ',
    'feature.chat.sub':       'ሕያው ታሪክ',
    'feature.chat.desc':      'ከ ዳግማዊ ምኒልክ፣ ከ እቴጌ ጣይቱ ብጡል እና ከ ራስ አሉላ ጋር ይነጋገሩ — AI ሕያው ያደረጋቸው የታሪክ ምስሎች።',
    'feature.chat.badge':     'ተሳታፊ',
    'feature.strategy.title': 'የውጊያ ስልቶች',
    'feature.strategy.sub':   'ወታደራዊ ብልሃት',
    'feature.strategy.desc':  'ኢትዮጵያ ወደ ማሸነፊያ ያደረሳቸውን ወታደራዊ ስልቶችን፣ ጂኦግራፊያዊ ጠቀሜታ፣ እና ወሳኝ ውሳኔዎችን አስሰሰ።',
    'feature.strategy.badge': 'ምስላዊ',
    'feature.timeline.title': 'ተኮናኳኝ የጊዜ ሰሌዳ',
    'feature.timeline.sub':   'ዘወርዋሪ ጉዞ',
    'feature.timeline.desc':  'ከቅኝ ግዛት ሙከራ እስከ ዓድዋ ድሎ ድረስ ያሉ ወሳኝ ክስተቶችን አስሰሰ።',
    'feature.timeline.badge': 'አስሰስ',
    'feature.quiz.title':     'የዓድዋ ፈተና',
    'feature.quiz.sub':       'ዕውቀትህን ፈትሽ',
    'feature.quiz.desc':      'AI-ን ስለ ዓድዋ ውጊያ ጠይቁ። ግላዊ ማብራሪያ ያግኙ እና ዕውቀትዎን ያሳድጉ።',
    'feature.quiz.badge':     'ፈተና',

    // Heroes section
    'heroes.eyebrow':   'ጀግኖቹን ይጋበዙ',
    'heroes.title':     'የዓድዋ ጀግኖች',
    'heroes.subtitle':  'AI ስርዓቱን ተጠቅሞ ከነዚህ ታሪካዊ ሰዎች ጋር ቀጥታ ይነጋገሩ።',
    'heroes.chat_btn':  'ውይይት ጀምር',
    'heroes.all_btn':   'ከሁሉ ጀግኖች ጋር ቆይ',
    'hero.menelik.name':  'ዳግማዊ ዓፄ ምኒልክ',
    'hero.menelik.role':  'ዋና አዛዥ',
    'hero.menelik.desc':  'የኢትዮጵያ ኃይሎችን ባንድ አሰልፎ ቅኝ ገዥ ኢጣሊያን ለቦ ውጊያ የጣለ ሃያ ነፍሰ ሙሉ።',
    'hero.taytu.name':    'እቴጌ ጣይቱ ብጡል',
    'hero.taytu.role':    'ስትራቴጂ አዋቂ',
    'hero.taytu.desc':    'የኢትዮጵያ ዲፕሎማሲያዊ እና ወታደራዊ ስትራቴጂ ደናቂ አንጋፋ እቴጌ።',
    'hero.alula.name':    'ራስ አሉላ',
    'hero.alula.desc':    'በዓድዋ ወታደራዊ ሥልቶችን ቀርጾ የነደፈ፣ "የሰሜኑ አንበሳ" ተብሎ የሚጠራ የኢትዮጵያ ቀዳሚ ጄኔራል።',
    'hero.mengesha.name': 'ራስ መንገሻ ዮሐንስ',
    'hero.mengesha.role': 'የትግራይ ገዢ',
    'hero.mengesha.desc': 'ለኢትዮጵያ ሉዓላዊነት ሲሉ ከዳግማዊ ምኒልክ ጋር በመሆን የተዋጉ የትግራይ ተዋጊ።',
    'hero.mikael.name':   'ራስ ሚካኤል (ወሎ)',
    'hero.mikael.role':   'የወሎ ጦር አዛዥ',
    'hero.mikael.desc':   'በዓድዋ ውጊያ ታሪካዊውን የወሎ ፈረሰኛ ጦር የገነቡና የመሩ ታላቅ መሪ።',
    'hero.habtegiyorgis.name': 'ፊታውራሪ ሀብተ ጊዮርጊስ',
    'hero.habtegiyorgis.role': 'የጦር ሚኒስትር',
    'hero.habtegiyorgis.desc': 'በብልሃታቸው "አባ መላ" ተብለው የሚጠሩት ታዋቂው ወታደራዊ አዛዥ እና ስትራቴጂስት።',

    // Mission section
    'mission.eyebrow':  'ዓላማችን',
    'mission.title':    'ታሪክ ሕይወት ያልቀ',
    'mission.p1':       'የዓድዋ ውጊያ — መጋቢት ፳፫ ቀን ፲፰፻፹፰ ዓ.ም — በቅኝ አስተዳደር ላይ የተቀዳጀው አሸናፊ ድሎ የአፍሪካ ታሪካዊ ምልክት ሆኗል። ዳግማዊ ዓፄ ምኒልክ ይምሯት የተቀዳጀው ድሎ ለጠቅላላ አህጉሩ የነጻነት ምሳሌ ሆኗል።',
    'mission.p2':       'ያቋቋምነው ስርዓት ዘርፉን ቀጣይ ትምህርት ሊያቀርብ እና ሊያኖር ዓይኑን ያለ AI ቴክኖሎጂ ይጠቀማል — ለዘሮቹ ዓድዋን ያቆዩ ተዋጊዎችን፣ መሪዎችን እና ትሩፋትን ሁሌ ሊያሳስቡ።',
    'mission.ai':       'AI-ተጎናጸፊ ትምህርት',
    'mission.ai_desc':  'እያንዳንዱ ተማሪ ዕቅሙ ላይ ተሰርቶ የሚሠራ ሰምጦ AI።',
    'mission.accurate': 'ታሪካዊ ትክክለኛነት',
    'mission.accurate_desc': 'ሁሉም ይዘቶች ጥልቅ ጥናትና ምዘናን ያለፉ ናቸው።',
    'mission.pan':      'የፓን-አፍሪካ ትሩፋት',
    'mission.pan_desc': 'ዓድዋ — የአፍሪካ ኩራት፣ ሉዓላዊነት እና ጽናት ምሳሌ — ይውደሳ።',
    'mission.award':    'ምርጥ ዲዛይን',
    'mission.award_desc': 'ሙዚየምን ደረጃ የሚጠጋ ዲጂታል ልምድ።',

    // Final CTA
    'cta.title':    'ወደ ኢትዮጵያ ታላቁ ውጊያ ጉዞ ጀምር',
    'cta.subtitle': 'AI ዓይን ዓድዋን ቀድሞ የሞከሩ ሺዎች ሰዎች ተቀላቅሏቸው።',

    // Story page
    'story.chapter':   'ምዕራፍ',
    'story.complete':  '% ተጠናቀቀ',
    'story.prev':      'ወደ ኋላ',
    'story.next':      'ቀጣይ ምዕራፍ',
    'story.insight_title': 'AI ታሪካዊ ትንታኔ',
    'story.perspective': 'አስተያየት',
    'story.perspective_q': 'የዉቻሌ ሁዋላ ስምምነት ካደዳሁ እደ ሀገር አዛዥ ሆኜ ምን ባደርግ ነበር?',
    'story.ask_ai':    'AI ምስሉን ጠይቅ',

    // Heroes Chat page
    'chat.title':           'ካቴጎሪ መሪ ጠይቅ',
    'chat.subtitle':        'ታሪካዊ ሰዉን ምረጥ ቆይ። ስለ ዝግጅታቸው፣ ስለ ፈታኛ ሁኔታዎቻቸው ወይም ስለ ኢትዮጵያ ህልማቸው ጠይቃቸው።',
    'chat.placeholder':     'ጥያቄ ጠይቅ…',
    'chat.start_hint':      'ከዚህ ጋር ቆይ',
    'chat.back':            'ወደ ኋላ',
    'chat.send':            'ላክ',
    'chat.menelik.role':    'ንጉሠ ነገሥት',
    'chat.menelik.desc':    'የኢትዮጵያ አንድነት እና ዘመናዊነት መስርት።',
    'chat.taytu.role':      'ስልት አዋቂ',
    'chat.taytu.desc':      'ኃይለኛ ዲፕሎማት እና ብልህ ወታደራዊ አዋቂ።',
    'chat.alula.desc':      '"የሰሜኑ አንበሳ" InputStream ዝነኛ ጄኔራል።',
    'chat.mengesha.role':   'ተዋጊ እና መሪ',
    'chat.mengesha.desc':   'ለኢትዮጵያ አንድነት ሲሉ ከምኒልክ ጋር የተሰለፉ የትግራይ መሪ።',
    'chat.mikael.role':     'የፈረሰኛ ጦር አዛዥ',
    'chat.mikael.desc':     'የኢጣሊያን ጦር መስመር የሰባበረው ዝነኛ የወሎ ፈረሰኛ ጦር መሪ።',
    'chat.habtegiyorgis.role': 'የፊት አውራሪ',
    'chat.habtegiyorgis.desc': 'በዓድዋ ውጊያ ግንባር ቀደም ጦር ያዘመቱት ታላቅ ወታደራዊ መሪ።',

    // Strategy page
    'strategy.title':       'የውጊያ ስልት ማብራሪያ',
    'strategy.subtitle':    'ዕጣ ፈንታዉን የወሰኑ ወታደራዊ ብልሃቶችና ካልሆኑ ነገሮች ያስሰሰ።',
    'strategy.tab_eth':     'የኢትዮጵያ ስልት',
    'strategy.tab_ita':     'የኢጣሊያ ስልት',
    'strategy.tab_geo':     'ጂኦግራፊ',
    'strategy.quote':       '"ተራሮቹ ቅጥሮቻቸን ነበሩ፣ ኅብረት ደግሞ መሳሪያቸን።"',
    'strategy.did_you_know': 'ሳታውቅ ቀርተሃ?',
    'strategy.fun_fact':    'የኢትዮጵያ ጦር ዘመናዊ ጠመንጃ እና መድፍ ካለ ቅቅ ይዞ ወደ ዓድዋ ወርዶ ነበር — ቀድሞ ዲፕሎማሲ ያስቀረ።',
    'strategy.eth_title': 'የኢትዮጵያ ወታደራዊ ብልሃት',
    'strategy.ita_title': 'የኢጣሊያ ስህተቶች',
    'strategy.geo_title': 'የዓድዋ ጂኦግራፊ',

    // Quiz page
    'quiz.title':     'የዓድዋ ዕውቀት ፈተና',
    'quiz.question_of': 'ጥያቄ',
    'quiz.of':        'ከ',
    'quiz.complete':  'ፈተና ተጠናቋል!',
    'quiz.score':     'ውጤትዎ:',
    'quiz.try_again': 'እንደገና ሞክር',
    'quiz.back_home': 'ወደ ዋናው ተመለስ',
    'quiz.ai_insight': 'AI ትንታኔ:',
    'quiz.next':      'ቀጣይ ጥያቄ',
    'quiz.results':   'ውጤቱን እዩ',

    // Language switcher
    'lang.en': 'English',
    'lang.am': 'አማርኛ',
  },
};

// ─── Provider ────────────────────────────────────────────────────────────────
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[lang][key] ?? translations['en'][key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// ─── Hook ────────────────────────────────────────────────────────────────────
export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
