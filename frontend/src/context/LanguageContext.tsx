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
    'footer.copyright': '© 2026 Adwa AI Assistant · Celebrating 130 Years of Victory · March 1, 1896',
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
    'features.eyebrow':   'The Assistant',
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
    'story.page_title': 'Interactive Chronicle',
    'story.page_desc':  'Step into the past. Ask questions to explore the historical facts, timelines, and battle strategies that shaped the victory at Adwa.',
    'story.title':     'The Storyteller',
    'story.subtitle':  'Historical AI Narrator',
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
    'nav.chat':       'ከጀግኖች ጋር ውይይት',
    'nav.strategy':   'ስልት',
    'nav.timeline':   'የጊዜ መስመር',
    'nav.quiz':       'ፈተና',
    'nav.cta':        'ታሪኩን ጀምር',

    // Footer
    'footer.tagline': 'የኢትዮጵያን ታሪክ በብልህነት እና ታሪክ አገላለጽ ሕያው ማድረግ።',
    'footer.explore': 'ያስሱ',
    'footer.history': 'ታሪክ',
    'footer.about':   'ስለ እኛ',
    'footer.mission': 'ተልዕኳችን',
    'footer.share':   'ታሪክዎን ያካፍሉ',
    'footer.resources': 'የትምህርት ግብዓቶች',
    'footer.feedback': 'አስተያየት',
    'footer.copyright': '© 2026 የዓድዋ AI ረዳት · 130ኛውን የድል በዓል ማክበር · የካቲት 23 ቀን 1888 ዓ.ም',
    'footer.context': 'ታሪካዊ ሁኔታ',
    'footer.leaders': 'መሪዎቹ',
    'footer.victory': 'ድሉ',
    'footer.legacy':  'ውርሱ',

    // Home hero
    'home.badge':     'ታሪክ ከብልህነት ጋር ይገናኛል',
    'home.title1':    'ዓድዋ፡ ጦርነቱ',
    'home.title2':    'ዳግም ትዝታ',
    'home.subtitle':  'የዓድዋን ጦርነት ከዚህ በፊት ታይቶ በማይታወቅ መልኩ ይለማመዱ — ከታሪካዊ ጀግኖች ጋር ይወያዩ፣ ዘዴያዊ ስልቶችን ያስሱ እና በሰው ሰራሽ አስተውሎት አማካኝነት በትምህርታዊ መንገድ ይማሩ።',
    'home.cta1':      'ታሪኩን ጀምር',
    'home.cta2':      'ከጀግኖች ጋር ይወያዩ',
    'home.cta3':      'ፈተናውን ይውሰዱ',
    'home.cta4':      'የጦርነት ስልቶችን ያስሱ',
    'home.cta5':      'የዓድዋ የጊዜ መስመር',

    // Home stats
    'stats.warriors':     'የኢትዮጵያ ተዋጊዎች',
    'stats.year':         'የድል ዓመት',
    'stats.experiences':  'AI ተሞክሮዎች',
    'stats.years':        'የመነሳሳት ዓመታት',

    // Home features section
    'features.eyebrow':   'ረዳቱ',
    'features.title':     'ዓድዋን የሚለማመዱባቸው አምስት መንገዶች',
    'features.subtitle':  'በጥለቅ የ AI ትረካዎች፣ ከታሪካዊ ታዋቂ ሰዎች ጋር በቅጽበት በሚደረጉ ውይይቶች ወይም በስትራቴጂካዊ ጥልቅ ጥናቶች — እያንዳንዱ መንገድ ስለ ኢትዮጵያ ታላቅ ድል የተሻለ ግንዛቤን ያስገኛል።',
    'features.explore':   'ያስሱ',

    // Feature cards
    'feature.story.title':    'AI ታሪክ ሁነታ',
    'feature.story.sub':      'ጥልቅ ትረካ',
    'feature.story.desc':     'ወደ 1888 ኢትዮጵያ ይግቡ። ለምርጫዎችዎ እና ለጉጉትዎ ምላሽ በሚሰጥ ተለዋዋጭ የ AI ትረካ አማካኝነት የዓድዋን ጦርነት ይለማመዱ።',
    'feature.story.badge':    'በጣም ተወዳጅ',
    'feature.chat.title':     'ከጀግኖች ጋር ውይይት',
    'feature.chat.sub':       'ሕያው ታሪክ',
    'feature.chat.desc':      'በ AI አማካኝነት ሕያው ከሆኑት ዳግማዊ አፄ ምኒልክ፣ እቴጌ ጣይቱ ብጡል እና ራስ አሉላ ጋር ውይይቶችን ያድርጉ።',
    'feature.chat.badge':     'አሳታፊ የታሪክ ጉዞ',
    'feature.strategy.title': 'የጦርነት ስልቶች',
    'feature.strategy.sub':   'ዘዴያዊ ብልህነት',
    'feature.strategy.desc':  'ለኢትዮጵያ ታይቶ የማይታወቅ የአፍሪካ ድል ያስገኙትን ድንቅ ወታደራዊ አሰላለፎች፣ መልክዓ ምድራዊ ጥቅሞች እና ስትራቴጂካዊ ውሳኔዎችን ያስሱ።',
    'feature.strategy.badge': 'ምስላዊ',
    'feature.timeline.title': 'የጊዜ መስመር',
    'feature.timeline.sub':   'የዘመን ጉዞ',
    'feature.timeline.desc':  'ከቅኝ ግዛት ሙከራዎች እስከ የመጨረሻው ታላቅ ድል ድረስ ያሉ ዋና ዋና ክስተቶችን በጥሩ ሁኔታ በተሰራ ምስላዊ የጊዜ መስመር ውስጥ ያስሱ።',
    'feature.timeline.badge': 'ያስሱ',
    'feature.quiz.title':     'የዓድዋ ፈተና',
    'feature.quiz.sub':       'እውቀትዎን ይፈትሹ',
    'feature.quiz.desc':      'ስለ ዓድዋ ጦርነት በ AI በሚደገፉ ጥያቄዎች እራስዎን ይፈትሹ። ግላዊ ማብራሪያዎችን ያግኙ እና ግንዛቤዎን ያሳድጉ።',
    'feature.quiz.badge':     'ተግዳሮት',

    // Heroes section
    'heroes.eyebrow':   'ታዋቂ ሰዎችን ያግኙ',
    'heroes.title':     'የዓድዋ ጀግኖች',
    'heroes.subtitle':  'በእኛ AI ስርዓት አማካኝነት ከነዚህ ታሪካዊ ሰዎች ጋር በቀጥታ ይወያዩ። ስለ ጦርነቱ፣ ስለ ተነሳሽነታቸው እና ስለ ኢትዮጵያ ቅርስ ይጠይቋቸው።',
    'heroes.chat_btn':  'ውይይት ጀምር',
    'heroes.all_btn':   'ከሁሉም ጀግኖች ጋር ይወያዩ',
    'hero.menelik.name':  'ዳግማዊ አፄ ምኒልክ',
    'hero.menelik.role':  'ጠቅላይ አዛዥ',
    'hero.menelik.desc':  'የኢትዮጵያን ኃይሎች በቅኝ ገዥዋ ኢጣሊያ ላይ አንድ ያደረጉት ባለራዕዩ ንጉሠ ነገሥት።',
    'hero.taytu.name':    'እቴጌ ጣይቱ ብጡል',
    'hero.taytu.role':    'ስትራቴጂካዊ አርክቴክት',
    'hero.taytu.desc':    "ከኢትዮጵያ ዲፕሎማሲያዊ እና ወታደራዊ ስልት በስተጀርባ ዋና አእምሮ የነበሩት እቴጌ።",
    'hero.alula.name':    'ራስ አሉላ',
    'hero.alula.desc':    "በዓድዋ ላይ ወታደራዊ ስልቶችን የቀረጹት የኢትዮጵያ ታላቅ ወታደራዊ አእምሮ።",
    'hero.mengesha.name': 'ራስ መንገሻ ዮሐንስ',
    'hero.mengesha.role': 'የትግራይ ገዥ',
    'hero.mengesha.desc': 'የኢትዮጵያን ሉዓላዊነት ለማስጠበቅ ከዳግማዊ ምኒልክ ጎን ተሰልፈው የተዋጉት ታማኙ የትግራይ መሪ።',
    'hero.mikael.name':   'የወሎው ራስ ሚካኤል',
    'hero.mikael.role':   'የወሎ ጦር አዛዥ',
    'hero.mikael.desc':   'በዓድዋ ጦርነት ወቅት ብርቱውን የወሎ ፈረሰኛ ጦር የመሩት ወሳኝ ወታደራዊ መሪ።',
    'hero.habtegiyorgis.name': 'ፊታውራሪ ሀብተ ጊዮርጊስ',
    'hero.habtegiyorgis.role': 'የጦር ሚኒስትር',
    'hero.habtegiyorgis.desc': 'በብልህነታቸው "አባ መላ" ተብለው የሚታወቁት ዝነኛ ወታደራዊ አዛዥ እና ስትራቴጂስት።',

    // Mission section
    'mission.eyebrow':  'ተልዕኳችን',
    'mission.title':    'ታሪክ ሕያው የሚሆንበት',
    'mission.p1':       'የካቲት 23 ቀን 1888 ዓ.ም የተካሄደው የዓድዋ ጦርነት አፍሪካ በቅኝ ግዛት ላይ ያስመዘገበችው ትልቁ ወታደራዊ ድል ነበር። በዳግማዊ አፄ ምኒልክ መሪነት የተገኘው የኢትዮጵያ ድል ለመላው አህጉር እና ከዚያም በላይ የነፃነት ፋና ሆነ።',
    'mission.p2':       'የእኛ መድረክ ይህንን የታሪክ ወሳኝ ምዕራፍ ተደራሽ፣ ጥልቅ እና አስተማሪ ለማድረግ ዘመናዊ AI ይጠቀማል — የዓድዋን ተዋጊዎች፣ መሪዎች እና ውርስ ለትውልድ እያከበረ።',
    'mission.ai':       'በ AI የሚደገፍ ትምህርት',
    'mission.ai_desc':  'እያንዳንዱን የትምህርት ጉዞ ከእርስዎ ፍጥነት እና ፍላጎት ጋር የሚያዛምድ ተለዋዋጭ AI።',
    'mission.accurate': 'ታሪካዊ ትክክለኛነት',
    'mission.accurate_desc': 'ሁሉም ይዘቶች በጥንቃቄ የተጠኑ እና ከታሪካዊ ምንጮች ጋር የተረጋገጡ።',
    'mission.pan':      'ፓን-አፍሪካዊ ቅርስ',
    'mission.pan_desc': 'ዓድዋን የአፍሪካ ኩራት፣ ሉዓላዊነት እና ፅናት ምልክት አድርጎ ማክበር።',
    'mission.award':    'ተሸላሚ ንድፍ',
    'mission.award_desc': 'ለማነሳሳት እና ለማስተማር የተነደፈ የሙዚየም ጥራት ያለው ዲጂታል ተሞክሮ።',

    // Final CTA
    'cta.title':    "በኢትዮጵያ ታላቅ ጦርነት ውስጥ ጉዞዎን ይጀምሩ",
    'cta.subtitle': 'በሰው ሰራሽ አስተውሎት አማካኝነት የዓድዋን ጦርነት አስቀድመው የተገነዘቡ በሺዎች የሚቆጠሩ ተማሪዎችን ይቀላቀሉ።',

    // Story page
    'story.page_title': 'ትረካ',
    'story.page_desc':  'ወደ ቀድሞው ታሪክ ይመለሱ። በዓድዋ ድል የታዩትን የታሪክ እውነታዎች፣ የቀኖች ቅደም ተከተል እና የወታደራዊ ስልቶችን ለማሰስ ጥያቄዎችን ይጠይቁ።',
    'story.title':     'ተራኪው',
    'story.subtitle':  'ታሪካዊ የ AI ተራኪ',
    'story.chapter':   'ምዕራፍ',
    'story.complete':  '% ተጠናቋል',
    'story.prev':      'ቀዳሚ',
    'story.next':      'ቀጣይ ምዕራፍ',
    'story.insight_title': 'የ AI ታሪካዊ ግንዛቤ',
    'story.perspective': 'አመለካከት',
    'story.perspective_q': 'የአካባቢው አለቃ ቢሆኑ ኖሮ ለውጫሌ ውል ምን ዓይነት ምላሽ ይሰጡ ነበር?',
    'story.ask_ai':    'የ AI ገጸ ባህሪን ይጠይቁ',  

    // Heroes Chat page
    'chat.title':           'መሪዎቹን አማክሩ',
    'chat.subtitle':        'ውይይት ለመጀመር ታሪካዊ ሰውን ይምረጡ። ስለ ዝግጅታቸው፣ ስለገጠሟቸው ፈተናዎች ወይም ስለ ኢትዮጵያ ስላላቸው ራዕይ ይጠይቋቸው።',
    'chat.placeholder':     'ጥያቄ ይጠይቁ…',
    'chat.start_hint':      'ውይይትዎን በዚህ ይጀምሩ',
    'chat.back':            'ተመለስ',
    'chat.send':            'ላክ',
    'chat.menelik.role':    'ንጉሠ ነገሥት',
    'chat.menelik.desc':    'የኢትዮጵያ አንድነት እና ዘመናዊነት ባለቤት።',
    'chat.taytu.role':      'ስትራቴጂካዊ አማካሪ',
    'chat.taytu.desc':      'ብርቱዋ ዲፕሎማት እና ድንቅ ስትራቴጂካዊ አማካሪ።',
    'chat.alula.desc':      'የሰሜኑ አንበሳ ተብለው የሚታወቁት ዝነኛ ጄኔራል ።',
    'chat.mengesha.role':   'ተዋጊ እና መሪ',
    'chat.mengesha.desc':   'ለዘውዱ የማይወለክ አንድነት ያሳዩ የትግራይ ቁልፍ መሪ።',
    'chat.mikael.role':     'የፈረሰኛ ጦር አዛዥ',
    'chat.mikael.desc':     'የኢጣሊያን መስመር የሰባበረው ዝነኛው የወሎ ኦሮሞ ፈረሰኛ ጦር መሪ።',
    'chat.habtegiyorgis.role': 'የፊት አውራሪ ጦር አዛዥ',
    'chat.habtegiyorgis.desc': 'በዓድዋ ግንባር ቀደም ሆኖ የመራው ድንቅ የጦር አዛዥ።',

    // Strategy page
    'strategy.title':       'የጦርነት ስልት ማብራሪያ',
    'strategy.subtitle':    'የአንድን ሀገር እጣ ፈንታ የወሰኑትን ወታደራዊ ብልህነት እና ስህተቶች ይተንትኑ።',
    'strategy.tab_eth':     'የኢትዮጵያ ስልት',
    'strategy.tab_ita':     'የኢጣሊያ ስልት',
    'strategy.tab_geo':     'መልክዓ ምድር',
    'strategy.quote':       '"ተራሮቹ ግንቦቻችን ነበሩ፣ አንድነት ደግሞ መሣሪያችን።"',
    'strategy.did_you_know': 'ይህንን ያውቁ ነበር?',
    'strategy.fun_fact':    'የኢትዮጵያ ጦር ዘመናዊ ጠመንጃ የታጠቀ የመጀመሪያው የአፍሪካ ጦር አንዱ ነበር።',
    'strategy.eth_title': 'የኢትዮጵያ ስትራቴጂካዊ ብልህነት',
    'strategy.ita_title': 'የኢጣሊያ የተሳሳቱ ስሌቶች',
    'strategy.geo_title': 'የዓድዋ መልክዓ ምድር',

    // Quiz page
    'quiz.title':     'የዓድዋ እውቀት መፈተሻ',
    'quiz.question_of': 'ጥያቄ',
    'quiz.of':        'ከ',
    'quiz.complete':  'ፈተናው ተጠናቋል!',
    'quiz.score':     'ውጤትዎ፡',
    'quiz.try_again': 'እንደገና ይሞክሩ',
    'quiz.back_home': 'ወደ መነሻ ገጽ',
    'quiz.ai_insight': 'የ AI ግንዛቤ፡',
    'quiz.next':      'ቀጣይ ጥያቄ',
    'quiz.results':   'ውጤቶችን ይመልከቱ',

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
