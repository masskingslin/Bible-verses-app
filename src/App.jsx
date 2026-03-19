import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ════════════════════════════════════════════════════════════════════
//  FULL OFFLINE BIBLE DATA  (KJV + Tamil — expandable via JSON file)
//  Architecture: import fullBible from './data/bible.json'
//  Source: github.com/scrollmapper/bible_databases (MIT License)
// ════════════════════════════════════════════════════════════════════
const BIBLE_DATA = [
  // ── OLD TESTAMENT ──────────────────────────────────────────────
  { id:1,  book:"ஆதியாகமம்", book_en:"Genesis",     ch:1,  v:1,
    ta:"ஆதியிலே தேவன் வானத்தையும் பூமியையும் சிருஷ்டித்தார்.",
    en:"In the beginning God created the heaven and the earth.",
    tags:["creation","god","beginning","படைப்பு","தேவன்"]},
  { id:2,  book:"ஆதியாகமம்", book_en:"Genesis",     ch:1,  v:3,
    ta:"தேவன்: வெளிச்சம் உண்டாகக்கடவது என்றார்; வெளிச்சம் உண்டாயிற்று.",
    en:"And God said, Let there be light: and there was light.",
    tags:["light","creation","god","வெளிச்சம்","படைப்பு"]},
  { id:3,  book:"யாத்திராகமம்", book_en:"Exodus",   ch:20, v:3,
    ta:"என்னையன்றி உனக்கு வேறே தேவர்கள் இருக்கலாகாது.",
    en:"Thou shalt have no other gods before me.",
    tags:["commandment","god","worship","கட்டளை","வழிபாடு"]},
  { id:4,  book:"சங்கீதம்",  book_en:"Psalms",      ch:1,  v:1,
    ta:"பாக்கியவான் அந்த மனுஷன்; அவன் துன்மார்க்கரின் ஆலோசனையில் நடவாமலும், பாவிகளின் வழியில் நிற்காமலும், பரியாசக்காரர் உட்காரும் இடத்தில் உட்காராமலும் இருக்கிறான்.",
    en:"Blessed is the man that walketh not in the counsel of the ungodly, nor standeth in the way of sinners, nor sitteth in the seat of the scornful.",
    tags:["blessed","wisdom","righteous","ஆசீர்வாதம்","நீதி"]},
  { id:5,  book:"சங்கீதம்",  book_en:"Psalms",      ch:23, v:1,
    ta:"கர்த்தர் என் மேய்ப்பராயிருக்கிறார்; எனக்குக் குறைவு உண்டாகாது.",
    en:"The Lord is my shepherd; I shall not want.",
    tags:["shepherd","trust","lord","மேய்ப்பர்","நம்பிக்கை","ஆண்டவர்"]},
  { id:6,  book:"சங்கீதம்",  book_en:"Psalms",      ch:23, v:4,
    ta:"நான் மரண இருளின் பள்ளத்தாக்கிலே நடந்தாலும் தீமைக்கு அஞ்சமாட்டேன்; தேவரீர் என்னோடிருக்கிறீர்.",
    en:"Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me.",
    tags:["fear","protection","god","death","அச்சம்","பாதுகாப்பு","மரணம்"]},
  { id:7,  book:"சங்கீதம்",  book_en:"Psalms",      ch:46, v:1,
    ta:"தேவன் நமக்கு அடைக்கலமும் பெலனுமாயிருக்கிறார்; இக்கட்டுகளில் அவர் மிகவும் உதவியாயிருக்கிறார்.",
    en:"God is our refuge and strength, a very present help in trouble.",
    tags:["refuge","strength","help","trouble","அடைக்கலம்","பெலன்","உதவி"]},
  { id:8,  book:"சங்கீதம்",  book_en:"Psalms",      ch:119,v:105,
    ta:"உமது வார்த்தை என் பாதங்களுக்கு தீபமும் என் பாதையில் வெளிச்சமுமாயிருக்கிறது.",
    en:"Thy word is a lamp unto my feet, and a light unto my path.",
    tags:["word","light","path","guidance","வார்த்தை","வெளிச்சம்","வழி","வழிகாட்டுதல்"]},
  { id:9,  book:"நீதிமொழிகள்",book_en:"Proverbs",   ch:3,  v:5,
    ta:"உன் சொந்த விவேகத்தின்மேல் சாயாமல், உன் முழு இருதயத்தோடும் கர்த்தரில் நம்பிக்கையாயிரு.",
    en:"Trust in the Lord with all thine heart; and lean not unto thine own understanding.",
    tags:["trust","wisdom","heart","lord","நம்பிக்கை","விவேகம்","இருதயம்"]},
  { id:10, book:"நீதிமொழிகள்",book_en:"Proverbs",   ch:3,  v:6,
    ta:"உன் எல்லா வழிகளிலும் அவரை நினைத்துக்கொள், அவர் உன் பாதைகளை செவ்வைப்படுத்துவார்.",
    en:"In all thy ways acknowledge him, and he shall direct thy paths.",
    tags:["guidance","path","lord","direction","வழி","வழிகாட்டுதல்","நினைவு"]},
  { id:11, book:"நீதிமொழிகள்",book_en:"Proverbs",   ch:22, v:6,
    ta:"பிள்ளையானவன் போகவேண்டிய வழியிலே அவனை நடத்து; அவன் முதிர்வயதிலும் அதை விடான்.",
    en:"Train up a child in the way he should go: and when he is old, he will not depart from it.",
    tags:["children","family","upbringing","பிள்ளை","குடும்பம்","வழி"]},
  { id:12, book:"ஏசாயா",     book_en:"Isaiah",      ch:40, v:31,
    ta:"கர்த்தரை நம்பிக்கொண்டிருக்கிறவர்களோ புதுப்பிக்கப்பட்ட பெலத்தை அடைவார்கள்; கழுகுகளைப்போல செட்டைகளை அடித்து எழும்புவார்கள்.",
    en:"But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles.",
    tags:["strength","hope","wait","eagle","வலிமை","நம்பிக்கை","கழுகு"]},
  { id:13, book:"எரேமியா",   book_en:"Jeremiah",    ch:29, v:11,
    ta:"நான் உங்களுக்காக நினைக்கிற நினைவுகளை நான் அறிவேன்; அவை தீமைக்கல்ல நன்மைக்கேதுவான நினைவுகளே; உங்களுக்கு நல்நம்பிக்கையான முன்னும் பின்னும் கொடுக்கவே என்று கர்த்தர் சொல்லுகிறார்.",
    en:"For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil, to give you an expected end.",
    tags:["hope","future","plan","peace","நம்பிக்கை","எதிர்காலம்","சமாதானம்","திட்டம்"]},

  // ── NEW TESTAMENT ──────────────────────────────────────────────
  { id:14, book:"மத்தேயு",   book_en:"Matthew",     ch:5,  v:3,
    ta:"ஆவியில் எளிமையுள்ளவர்கள் பாக்கியவான்கள்; பரலோகராஜ்யம் அவர்களுடையது.",
    en:"Blessed are the poor in spirit: for theirs is the kingdom of heaven.",
    tags:["blessed","kingdom","heaven","beatitudes","ஆசீர்வாதம்","பரலோகம்"]},
  { id:15, book:"மத்தேயு",   book_en:"Matthew",     ch:5,  v:9,
    ta:"சமாதானம்பண்ணுகிறவர்கள் பாக்கியவான்கள்; அவர்கள் தேவனுடைய புத்திரர் என்னப்படுவார்கள்.",
    en:"Blessed are the peacemakers: for they shall be called the children of God.",
    tags:["peace","blessed","peacemaker","சமாதானம்","ஆசீர்வாதம்"]},
  { id:16, book:"மத்தேயு",   book_en:"Matthew",     ch:6,  v:33,
    ta:"முதலாவது தேவனுடைய ராஜ்யத்தையும் அவருடைய நீதியையும் தேடுங்கள்; அப்பொழுது இவைகளெல்லாம் உங்களுக்குக் கூடக் கொடுக்கப்படும்.",
    en:"But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.",
    tags:["seek","kingdom","righteousness","priority","தேடுங்கள்","ராஜ்யம்","நீதி"]},
  { id:17, book:"மத்தேயு",   book_en:"Matthew",     ch:11, v:28,
    ta:"வருத்தப்பட்டுப் பாரஞ்சுமக்கிற எல்லாரும் என்னிடத்தில் வாருங்கள்; நான் உங்களுக்கு இளைப்பாறுதல் தருவேன்.",
    en:"Come unto me, all ye that labour and are heavy laden, and I will give you rest.",
    tags:["rest","burden","comfort","invitation","இளைப்பாறுதல்","சுமை","ஆறுதல்"]},
  { id:18, book:"யோவான்",    book_en:"John",        ch:3,  v:16,
    ta:"தேவன், தம்முடைய ஒரே பேறான குமாரனை விசுவாசிக்கிறவன் எவனோ அவன் கெட்டுப்போகாமல் நித்தியஜீவனை அடையும்படிக்கு, அவரை தந்தருளி இவ்வளவாய் உலகத்தில் அன்பாயிருந்தார்.",
    en:"For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    tags:["love","salvation","eternal life","god","அன்பு","இரட்சிப்பு","நித்தியஜீவன்","தேவன்"]},
  { id:19, book:"யோவான்",    book_en:"John",        ch:14, v:6,
    ta:"இயேசு அவனை நோக்கி: நானே வழியும் சத்தியமும் ஜீவனுமாயிருக்கிறேன்; என்னாலேயன்றி ஒருவனும் பிதாவினிடத்தில் வரான் என்றார்.",
    en:"Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.",
    tags:["jesus","truth","life","way","இயேசு","சத்தியம்","ஜீவன்","வழி"]},
  { id:20, book:"யோவான்",    book_en:"John",        ch:15, v:13,
    ta:"ஒருவன் தன் சிநேகிதருக்காக தன் ஜீவனைக் கொடுப்பதிலும் அதிகமான அன்பு ஒருவனிடத்திலும் இல்லை.",
    en:"Greater love hath no man than this, that a man lay down his life for his friends.",
    tags:["love","sacrifice","friendship","அன்பு","தியாகம்","நட்பு"]},
  { id:21, book:"உரோமர்",    book_en:"Romans",      ch:3,  v:23,
    ta:"எல்லாரும் பாவஞ்செய்து தேவமகிமையற்றவர்களாகி இருக்கிறார்கள்.",
    en:"For all have sinned, and come short of the glory of God.",
    tags:["sin","glory","god","all","பாவம்","மகிமை","தேவன்"]},
  { id:22, book:"உரோமர்",    book_en:"Romans",      ch:6,  v:23,
    ta:"பாவத்தின் சம்பளம் மரணம்; தேவனுடைய கிருபைவரமோ நம்முடைய கர்த்தராகிய இயேசுகிறிஸ்துவினால் உண்டான நித்தியஜீவன்.",
    en:"For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord.",
    tags:["sin","death","gift","eternal life","salvation","பாவம்","மரணம்","கிருபை","இரட்சிப்பு"]},
  { id:23, book:"உரோமர்",    book_en:"Romans",      ch:8,  v:28,
    ta:"தேவனிடத்தில் அன்பு கூர்ந்து, அவருடைய தீர்மானத்தின்படி அழைக்கப்பட்டவர்களுக்கு எல்லாவற்றிலும் நன்மையே உண்டாகும்.",
    en:"And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
    tags:["good","love","purpose","faith","நன்மை","அன்பு","நோக்கம்","விசுவாசம்"]},
  { id:24, book:"உரோமர்",    book_en:"Romans",      ch:10, v:9,
    ta:"இயேசுவை ஆண்டவர் என்று உன் வாயினால் அறிக்கையிட்டு, தேவன் அவரை மரித்தோரிலிருந்து எழுப்பினார் என்று உன் இருதயத்தில் விசுவாசித்தால் இரட்சிக்கப்படுவாய்.",
    en:"That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved.",
    tags:["salvation","confession","believe","jesus","இரட்சிப்பு","விசுவாசம்","இயேசு"]},
  { id:25, book:"1 கொரிந்தியர்",book_en:"1 Corinthians",ch:13,v:4,
    ta:"அன்பு நீடிய பொறுமையுள்ளது; அன்பு தயவுள்ளது; அன்பு பொறாமைப்படாது; அன்பு தன்னை மேன்மைப்படுத்தாது; செருக்காது.",
    en:"Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up.",
    tags:["love","patience","kindness","அன்பு","பொறுமை","தயவு"]},
  { id:26, book:"1 கொரிந்தியர்",book_en:"1 Corinthians",ch:13,v:13,
    ta:"இப்பொழுதும் விசுவாசம், நம்பிக்கை, அன்பு இம்மூன்றும் நிலைத்திருக்கும்; இவைகளில் அன்பே சிறந்தது.",
    en:"And now abideth faith, hope, charity, these three; but the greatest of these is charity.",
    tags:["faith","hope","love","greatest","விசுவாசம்","நம்பிக்கை","அன்பு"]},
  { id:27, book:"பிலிப்பியர்", book_en:"Philippians",ch:4, v:6,
    ta:"எந்த காரியத்திலும் கவலைப்படாதிருங்கள்; எல்லாவற்றிலும் உங்கள் விண்ணப்பங்களை ஸ்தோத்திரத்தோடே கூடிய ஜெபத்தினாலும் வேண்டுதலினாலும் தேவனுக்கு அறிவியுங்கள்.",
    en:"Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.",
    tags:["prayer","anxiety","peace","thanksgiving","ஜெபம்","கவலை","சமாதானம்","நன்றி"]},
  { id:28, book:"பிலிப்பியர்", book_en:"Philippians",ch:4, v:7,
    ta:"அப்பொழுது எல்லாவித சிந்தனைக்கும் மேலான தேவசமாதானம் உங்கள் இருதயங்களையும் சிந்தைகளையும் கிறிஸ்து இயேசுவுக்குள் காக்கும்.",
    en:"And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",
    tags:["peace","heart","mind","god","சமாதானம்","இருதயம்","சிந்தை"]},
  { id:29, book:"பிலிப்பியர்", book_en:"Philippians",ch:4, v:13,
    ta:"என்னைப் பலப்படுத்துகிற கிறிஸ்துவினாலே எல்லாவற்றையும் செய்யக்கூடும்.",
    en:"I can do all things through Christ which strengtheneth me.",
    tags:["strength","christ","power","all things","வலிமை","கிறிஸ்து","பெலன்"]},
  { id:30, book:"எபிரேயர்",   book_en:"Hebrews",    ch:11, v:1,
    ta:"விசுவாசம் என்பது நம்பப்படுகிறவைகளின் நிச்சயமும் காணப்படாதவைகளின் நிரூபணமுமாயிருக்கிறது.",
    en:"Now faith is the substance of things hoped for, the evidence of things not seen.",
    tags:["faith","hope","substance","evidence","விசுவாசம்","நம்பிக்கை","நிச்சயம்"]},
  { id:31, book:"1 யோவான்",   book_en:"1 John",     ch:4,  v:8,
    ta:"அன்பில்லாதவன் தேவனை அறியான்; ஏனெனில் தேவன் அன்பாகவே இருக்கிறார்.",
    en:"He that loveth not knoweth not God; for God is love.",
    tags:["love","god","know","அன்பு","தேவன்"]},
  { id:32, book:"வெளிப்படுத்தல்",book_en:"Revelation",ch:21,v:4,
    ta:"தேவன் தாமே அவர்களோடிருந்து அவர்களுடைய தேவனாயிருப்பார்; அவர் அவர்களுடைய கண்களிலிருந்து கண்ணீரனைத்தையும் துடைப்பார்.",
    en:"And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain.",
    tags:["heaven","comfort","eternal","tears","hope","பரலோகம்","ஆறுதல்","கண்ணீர்","நம்பிக்கை"]},
];

// ═══════════════════════════════════════════════════════════════════
//  INBUILT AI VERSE FINDER — 100% OFFLINE SEARCH ENGINE
//  No API keys · No internet required · No Claude/Gemini/GPT
// ═══════════════════════════════════════════════════════════════════
const TOPIC_MAP = {
  // Tamil keywords → tags
  "அன்பு":["love","அன்பு"],"அன்பான":["love"],"நேசிக்கிறேன்":["love"],
  "நம்பிக்கை":["hope","faith","trust","நம்பிக்கை"],"விசுவாசம்":["faith","விசுவாசம்"],
  "வலிமை":["strength","power","வலிமை"],"பெலன்":["strength","வலிமை"],
  "சமாதானம்":["peace","சமாதானம்"],"அமைதி":["peace"],
  "ஆறுதல்":["comfort","rest","ஆறுதல்"],"இளைப்பாறுதல்":["rest","comfort"],
  "பயம்":["fear","அச்சம்"],"அச்சம்":["fear"],"கவலை":["anxiety","prayer"],
  "ஜெபம்":["prayer","ஜெபம்"],"ஜெபிக்க":["prayer"],
  "வழி":["path","way","guidance","வழி"],"வழிகாட்டுதல்":["guidance"],
  "பாவம்":["sin","பாவம்"],"மன்னிப்பு":["forgiveness","salvation"],
  "இரட்சிப்பு":["salvation","இரட்சிப்பு"],"இரட்சிக்கப்பட":["salvation"],
  "பரலோகம்":["heaven","kingdom","பரலோகம்"],"ராஜ்யம்":["kingdom"],
  "குடும்பம்":["family","children","குடும்பம்"],"பிள்ளை":["children"],
  "சந்தோஷம்":["joy","blessed"],"ஆசீர்வாதம்":["blessed","ஆசீர்வாதம்"],
  "மரணம்":["death","eternal life","மரணம்"],"நித்தியம்":["eternal life"],
  "படைப்பு":["creation","படைப்பு"],"இயேசு":["jesus","இயேசு"],
  "தேவன்":["god","தேவன்"],"கர்த்தர்":["lord","shepherd"],
  // English keywords → tags
  "love":["love","அன்பு"],"faith":["faith","விசுவாசம்"],"hope":["hope","நம்பிக்கை"],
  "strength":["strength","வலிமை"],"peace":["peace","சமாதானம்"],
  "comfort":["comfort","rest","ஆறுதல்"],"rest":["rest","comfort"],
  "fear":["fear","அச்சம்"],"anxiety":["anxiety","prayer"],
  "prayer":["prayer","ஜெபம்"],"guidance":["guidance","வழி"],
  "sin":["sin","பாவம்"],"salvation":["salvation","இரட்சிப்பு"],
  "heaven":["heaven","பரலோகம்"],"family":["family","children"],
  "joy":["joy","blessed"],"blessed":["blessed","ஆசீர்வாதம்"],
  "death":["death","மரணம்"],"eternal":["eternal life"],
  "creation":["creation","படைப்பு"],"jesus":["jesus","இயேசு"],
  "god":["god","தேவன்"],"lord":["lord","shepherd"],
  "healing":["comfort","rest","hope"],"money":["guidance","trust"],
  "marriage":["love","family"],"children":["children","family"],
  "depression":["comfort","hope","rest"],"anger":["peace","prayer"],
  "forgiveness":["forgiveness","salvation","love"],
  "protection":["refuge","protection","fear"],
  "wisdom":["wisdom","guidance"],"truth":["truth","jesus"],
};

function inbuiltAISearch(query) {
  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/);
  const matchedTags = new Set();

  // Collect tags from all matched keywords
  words.forEach(word => {
    Object.keys(TOPIC_MAP).forEach(key => {
      if (word.includes(key) || key.includes(word)) {
        TOPIC_MAP[key].forEach(t => matchedTags.add(t));
      }
    });
  });

  // Score every verse
  const scored = BIBLE_DATA.map(v => {
    let score = 0;
    const combinedText = (v.ta + " " + v.en + " " + v.tags.join(" ")).toLowerCase();

    // Tag match score
    matchedTags.forEach(tag => {
      if (v.tags.includes(tag)) score += 3;
    });

    // Direct text match score
    words.forEach(word => {
      if (word.length > 2) {
        if (combinedText.includes(word)) score += 2;
        if (v.ta.includes(word)) score += 2;
      }
    });

    // Book name match
    if (v.book.toLowerCase().includes(q) || v.book_en.toLowerCase().includes(q)) score += 5;

    return { ...v, score };
  }).filter(v => v.score > 0).sort((a,b) => b.score - a.score);

  return scored.slice(0, 6);
}

// Topic suggestions with Tamil+English labels
const QUICK_TOPICS = [
  {ta:"அன்பு",en:"Love",q:"love அன்பு"},
  {ta:"சமாதானம்",en:"Peace",q:"peace சமாதானம்"},
  {ta:"வலிமை",en:"Strength",q:"strength வலிமை"},
  {ta:"நம்பிக்கை",en:"Hope",q:"hope நம்பிக்கை"},
  {ta:"ஜெபம்",en:"Prayer",q:"prayer ஜெபம்"},
  {ta:"பயம்",en:"Fear",q:"fear பயம்"},
  {ta:"குடும்பம்",en:"Family",q:"family குடும்பம்"},
  {ta:"இரட்சிப்பு",en:"Salvation",q:"salvation இரட்சிப்பு"},
  {ta:"விசுவாசம்",en:"Faith",q:"faith விசுவாசம்"},
  {ta:"ஆறுதல்",en:"Comfort",q:"comfort ஆறுதல்"},
  {ta:"வழிகாட்டுதல்",en:"Guidance",q:"guidance வழி"},
  {ta:"இயேசு",en:"Jesus",q:"jesus இயேசு"},
];

// ═══════════════════════════════════════════════════════════════════
//  AUDIO / TEXT-TO-SPEECH ENGINE (Web Speech API — 100% offline)
// ═══════════════════════════════════════════════════════════════════
function useAudio() {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const utterRef = useRef(null);

  useEffect(() => {
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => window.speechSynthesis.cancel();
  }, []);

  const speak = useCallback((text, lang = "en-US") => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 0.85;
    utter.pitch = 1;
    // Prefer native voice for language
    const match = voices.find(v => v.lang.startsWith(lang.split("-")[0]));
    if (match) utter.voice = match;
    utter.onstart = () => { setSpeaking(true); setPaused(false); };
    utter.onend = () => { setSpeaking(false); setPaused(false); };
    utter.onerror = () => { setSpeaking(false); setPaused(false); };
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
  }, [voices]);

  const pause = () => { window.speechSynthesis.pause(); setPaused(true); };
  const resume = () => { window.speechSynthesis.resume(); setPaused(false); };
  const stop = () => { window.speechSynthesis.cancel(); setSpeaking(false); setPaused(false); };

  return { speak, pause, resume, stop, speaking, paused, voices };
}

// ═══════════════════════════════════════════════════════════════════
//  AD PLACEHOLDER (replace with real AdSense/AdMob ins tags)
// ═══════════════════════════════════════════════════════════════════
const GoogleAd = ({ slot = "", format = "banner" }) => (
  <div style={{
    background: "#181818",
    border: "1px solid #2a2a2a",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: 3,
    height: format === "rect" ? 180 : 56, margin: "8px 0"
  }}>
    <span style={{ fontSize: 8, color: "#444", letterSpacing: 2 }}>ADVERTISEMENT · விளம்பரம்</span>
    <span style={{ fontSize: 9, color: "#333" }}>AdSense Slot: {slot}</span>
    {/* REAL ADS — uncomment after AdSense approval:
    <ins className="adsbygoogle" style={{display:"block"}}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
      data-ad-slot={slot} data-ad-format="auto"
      data-full-width-responsive="true" />
    */}
  </div>
);

// ═══════════════════════════════════════════════════════════════════
//  AUDIO PLAYER BAR
// ═══════════════════════════════════════════════════════════════════
const AudioBar = ({ verse, onClose, audio }) => {
  const [audioLang, setAudioLang] = useState("en");
  const { speak, pause, resume, stop, speaking, paused } = audio;
  const text = audioLang === "ta" ? verse.ta : verse.en;
  const langCode = audioLang === "ta" ? "ta-IN" : "en-US";

  return (
    <div style={{
      position: "fixed", bottom: 64, left: 0, right: 0, zIndex: 200,
      background: "linear-gradient(135deg,#0078D7,#005a9e)",
      padding: "12px 16px", boxShadow: "0 -4px 20px rgba(0,120,215,0.4)"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div>
          <div style={{ color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>🔊 AUDIO MODE · ஒலி வாசிப்பு</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 9 }}>{verse.book} {verse.ch}:{verse.v} · {verse.book_en}</div>
        </div>
        <button onClick={() => { stop(); onClose(); }} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: 28, height: 28, fontSize: 13, cursor: "pointer" }}>✕</button>
      </div>

      {/* Language select */}
      <div style={{ display: "flex", gap: 4, m