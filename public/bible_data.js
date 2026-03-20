/* =============================================================
   BIBLE DATA v4 — Auto-downloads full KJV Bible on first launch
   
   HOW IT WORKS:
   1. App starts instantly with 100 built-in Tamil+English verses
   2. First time with internet → downloads all 31,102 KJV verses
   3. Saves to device (IndexedDB) → works fully offline forever
   4. All future launches use cached full Bible automatically
   
   NO manual file download. NO extra steps. It just works.
   ============================================================= */

var BIBLE_DATA = (function () {

  var BOOKS = [
    {id:1,  name:"Genesis",         ta:"ஆதியாகமம்",        ch:50,  t:"OT", color:"#0078D7"},
    {id:2,  name:"Exodus",          ta:"யாத்திராகமம்",      ch:40,  t:"OT", color:"#107C10"},
    {id:3,  name:"Leviticus",       ta:"லேவியராகமம்",       ch:27,  t:"OT", color:"#E81123"},
    {id:4,  name:"Numbers",         ta:"எண்ணாகமம்",         ch:36,  t:"OT", color:"#744DA9"},
    {id:5,  name:"Deuteronomy",     ta:"உபாகமம்",           ch:34,  t:"OT", color:"#FF8C00"},
    {id:6,  name:"Joshua",          ta:"யோசுவா",            ch:24,  t:"OT", color:"#008272"},
    {id:7,  name:"Judges",          ta:"நியாயாதிபதிகள்",    ch:21,  t:"OT", color:"#00B4D8"},
    {id:8,  name:"Ruth",            ta:"ரூத்",              ch:4,   t:"OT", color:"#4C4C4C"},
    {id:9,  name:"1 Samuel",        ta:"1 சாமுவேல்",        ch:31,  t:"OT", color:"#0078D7"},
    {id:10, name:"2 Samuel",        ta:"2 சாமுவேல்",        ch:24,  t:"OT", color:"#107C10"},
    {id:11, name:"1 Kings",         ta:"1 இராஜாக்கள்",      ch:22,  t:"OT", color:"#E81123"},
    {id:12, name:"2 Kings",         ta:"2 இராஜாக்கள்",      ch:25,  t:"OT", color:"#744DA9"},
    {id:13, name:"1 Chronicles",    ta:"1 நாளாகமம்",        ch:29,  t:"OT", color:"#FF8C00"},
    {id:14, name:"2 Chronicles",    ta:"2 நாளாகமம்",        ch:36,  t:"OT", color:"#008272"},
    {id:15, name:"Ezra",            ta:"எஸ்றா",             ch:10,  t:"OT", color:"#00B4D8"},
    {id:16, name:"Nehemiah",        ta:"நெகேமியா",           ch:13,  t:"OT", color:"#4C4C4C"},
    {id:17, name:"Esther",          ta:"எஸ்தர்",            ch:10,  t:"OT", color:"#0078D7"},
    {id:18, name:"Job",             ta:"யோபு",              ch:42,  t:"OT", color:"#107C10"},
    {id:19, name:"Psalms",          ta:"சங்கீதம்",           ch:150, t:"OT", color:"#E81123"},
    {id:20, name:"Proverbs",        ta:"நீதிமொழிகள்",       ch:31,  t:"OT", color:"#744DA9"},
    {id:21, name:"Ecclesiastes",    ta:"பிரசங்கி",           ch:12,  t:"OT", color:"#FF8C00"},
    {id:22, name:"Song of Solomon", ta:"உன்னத பாட்டு",      ch:8,   t:"OT", color:"#008272"},
    {id:23, name:"Isaiah",          ta:"ஏசாயா",             ch:66,  t:"OT", color:"#00B4D8"},
    {id:24, name:"Jeremiah",        ta:"எரேமியா",            ch:52,  t:"OT", color:"#4C4C4C"},
    {id:25, name:"Lamentations",    ta:"புலம்பல்",           ch:5,   t:"OT", color:"#0078D7"},
    {id:26, name:"Ezekiel",         ta:"எசேக்கியேல்",        ch:48,  t:"OT", color:"#107C10"},
    {id:27, name:"Daniel",          ta:"தானியேல்",           ch:12,  t:"OT", color:"#E81123"},
    {id:28, name:"Hosea",           ta:"ஓசியா",             ch:14,  t:"OT", color:"#744DA9"},
    {id:29, name:"Joel",            ta:"யோவேல்",            ch:3,   t:"OT", color:"#FF8C00"},
    {id:30, name:"Amos",            ta:"ஆமோஸ்",             ch:9,   t:"OT", color:"#008272"},
    {id:31, name:"Obadiah",         ta:"ஒபதியா",            ch:1,   t:"OT", color:"#00B4D8"},
    {id:32, name:"Jonah",           ta:"யோனா",              ch:4,   t:"OT", color:"#4C4C4C"},
    {id:33, name:"Micah",           ta:"மீகா",              ch:7,   t:"OT", color:"#0078D7"},
    {id:34, name:"Nahum",           ta:"நாகூம்",             ch:3,   t:"OT", color:"#107C10"},
    {id:35, name:"Habakkuk",        ta:"அபகூக்",            ch:3,   t:"OT", color:"#E81123"},
    {id:36, name:"Zephaniah",       ta:"செப்பனியா",          ch:3,   t:"OT", color:"#744DA9"},
    {id:37, name:"Haggai",          ta:"ஆகாய்",             ch:2,   t:"OT", color:"#FF8C00"},
    {id:38, name:"Zechariah",       ta:"சகரியா",            ch:14,  t:"OT", color:"#008272"},
    {id:39, name:"Malachi",         ta:"மல்கியா",            ch:4,   t:"OT", color:"#00B4D8"},
    {id:40, name:"Matthew",         ta:"மத்தேயு",            ch:28,  t:"NT", color:"#0078D7"},
    {id:41, name:"Mark",            ta:"மாற்கு",             ch:16,  t:"NT", color:"#107C10"},
    {id:42, name:"Luke",            ta:"லூக்கா",             ch:24,  t:"NT", color:"#E81123"},
    {id:43, name:"John",            ta:"யோவான்",             ch:21,  t:"NT", color:"#744DA9"},
    {id:44, name:"Acts",            ta:"அப்போஸ்தலர்",        ch:28,  t:"NT", color:"#FF8C00"},
    {id:45, name:"Romans",          ta:"உரோமர்",             ch:16,  t:"NT", color:"#008272"},
    {id:46, name:"1 Corinthians",   ta:"1 கொரிந்தியர்",      ch:16,  t:"NT", color:"#00B4D8"},
    {id:47, name:"2 Corinthians",   ta:"2 கொரிந்தியர்",      ch:13,  t:"NT", color:"#4C4C4C"},
    {id:48, name:"Galatians",       ta:"கலாத்தியர்",         ch:6,   t:"NT", color:"#0078D7"},
    {id:49, name:"Ephesians",       ta:"எபேசியர்",            ch:6,   t:"NT", color:"#107C10"},
    {id:50, name:"Philippians",     ta:"பிலிப்பியர்",         ch:4,   t:"NT", color:"#E81123"},
    {id:51, name:"Colossians",      ta:"கொலோசெயர்",          ch:4,   t:"NT", color:"#744DA9"},
    {id:52, name:"1 Thessalonians", ta:"1 தெசலோனிக்கேயர்",   ch:5,   t:"NT", color:"#FF8C00"},
    {id:53, name:"2 Thessalonians", ta:"2 தெசலோனிக்கேயர்",   ch:3,   t:"NT", color:"#008272"},
    {id:54, name:"1 Timothy",       ta:"1 தீமோத்தேயு",       ch:6,   t:"NT", color:"#00B4D8"},
    {id:55, name:"2 Timothy",       ta:"2 தீமோத்தேயு",       ch:4,   t:"NT", color:"#4C4C4C"},
    {id:56, name:"Titus",           ta:"தீத்து",             ch:3,   t:"NT", color:"#0078D7"},
    {id:57, name:"Philemon",        ta:"பிலேமோன்",           ch:1,   t:"NT", color:"#107C10"},
    {id:58, name:"Hebrews",         ta:"எபிரேயர்",            ch:13,  t:"NT", color:"#E81123"},
    {id:59, name:"James",           ta:"யாக்கோபு",            ch:5,   t:"NT", color:"#744DA9"},
    {id:60, name:"1 Peter",         ta:"1 பேதுரு",            ch:5,   t:"NT", color:"#FF8C00"},
    {id:61, name:"2 Peter",         ta:"2 பேதுரு",            ch:3,   t:"NT", color:"#008272"},
    {id:62, name:"1 John",          ta:"1 யோவான்",            ch:5,   t:"NT", color:"#00B4D8"},
    {id:63, name:"2 John",          ta:"2 யோவான்",            ch:1,   t:"NT", color:"#4C4C4C"},
    {id:64, name:"3 John",          ta:"3 யோவான்",            ch:1,   t:"NT", color:"#0078D7"},
    {id:65, name:"Jude",            ta:"யூதா",               ch:1,   t:"NT", color:"#107C10"},
    {id:66, name:"Revelation",      ta:"வெளிப்படுத்தல்",      ch:22,  t:"NT", color:"#E81123"}
  ];

  var BUILTIN = [
    {id:1,   book:"Genesis",ch:1,v:1,    ta:"ஆதியிலே தேவன் வானத்தையும் பூமியையும் சிருஷ்டித்தார்.",en:"In the beginning God created the heaven and the earth.",tags:["creation","god","beginning"]},
    {id:2,   book:"Exodus",ch:14,v:14,   ta:"கர்த்தர் உங்களுக்காக யுத்தம் செய்வார்; நீங்கள் சும்மாயிருங்கள்.",en:"The LORD shall fight for you, and ye shall hold your peace.",tags:["protection","trust","peace"]},
    {id:3,   book:"Joshua",ch:1,v:9,     ta:"நான் உனக்குக் கட்டளையிடவில்லையா? நீ திடமனதாயும் தைரியமாயும் இரு; மருளாதே கலங்காதே.",en:"Be strong and of a good courage; be not afraid, neither be thou dismayed.",tags:["courage","strength","fear","god"]},
    {id:4,   book:"Psalms",ch:23,v:1,    ta:"கர்த்தர் என் மேய்ப்பராயிருக்கிறார்; எனக்குக் குறைவு உண்டாகாது.",en:"The Lord is my shepherd; I shall not want.",tags:["shepherd","trust","provision","lord"]},
    {id:5,   book:"Psalms",ch:46,v:1,    ta:"தேவன் நமக்கு அடைக்கலமும் பெலனுமாயிருக்கிறார்; இக்கட்டுகளில் அவர் மிகவும் உதவியாயிருக்கிறார்.",en:"God is our refuge and strength, a very present help in trouble.",tags:["refuge","strength","help","trouble"]},
    {id:6,   book:"Psalms",ch:119,v:105, ta:"உமது வார்த்தை என் பாதங்களுக்கு தீபமும் என் பாதையில் வெளிச்சமுமாயிருக்கிறது.",en:"Thy word is a lamp unto my feet, and a light unto my path.",tags:["word","light","guidance","bible"]},
    {id:7,   book:"Psalms",ch:34,v:18,   ta:"இருதயம் நொறுங்குண்டவர்களுக்கு கர்த்தர் சமீபமாயிருக்கிறார்.",en:"The LORD is nigh unto them that are of a broken heart.",tags:["comfort","healing","broken","lord","near"]},
    {id:8,   book:"Proverbs",ch:3,v:5,   ta:"உன் சொந்த விவேகத்தின்மேல் சாயாமல், உன் முழு இருதயத்தோடும் கர்த்தரில் நம்பிக்கையாயிரு.",en:"Trust in the Lord with all thine heart; and lean not unto thine own understanding.",tags:["trust","wisdom","heart","lord","faith"]},
    {id:9,   book:"Proverbs",ch:3,v:6,   ta:"உன் எல்லா வழிகளிலும் அவரை நினைத்துக்கொள், அவர் உன் பாதைகளை செவ்வைப்படுத்துவார்.",en:"In all thy ways acknowledge him, and he shall direct thy paths.",tags:["guidance","direction","wisdom","lord"]},
    {id:10,  book:"Isaiah",ch:40,v:31,   ta:"கர்த்தரை நம்பிக்கொண்டிருக்கிறவர்களோ புதுப்பிக்கப்பட்ட பெலத்தை அடைவார்கள்; கழுகுகளைப்போல செட்டைகளை அடித்து எழும்புவார்கள்.",en:"But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles.",tags:["strength","hope","wait","renew","perseverance"]},
    {id:11,  book:"Isaiah",ch:41,v:10,   ta:"நீ மருளாதே, நான் உன் தேவன்; நான் உன்னைத் திடப்படுத்துவேன், உனக்கு உதவிசெய்வேன்.",en:"Fear thou not; for I am with thee: be not dismayed; for I am thy God.",tags:["fear","strength","god","help","courage"]},
    {id:12,  book:"Jeremiah",ch:29,v:11, ta:"நான் உங்களுக்காக நினைக்கிற நினைவுகளை நான் அறிவேன்; அவை தீமைக்கல்ல நன்மைக்கேதுவான நினைவுகளே.",en:"For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil.",tags:["hope","future","plan","peace","promise"]},
    {id:13,  book:"Matthew",ch:5,v:3,    ta:"ஆவியில் எளிமையுள்ளவர்கள் பாக்கியவான்கள்; பரலோகராஜ்யம் அவர்களுடையது.",en:"Blessed are the poor in spirit: for theirs is the kingdom of heaven.",tags:["blessed","kingdom","heaven","humility"]},
    {id:14,  book:"Matthew",ch:6,v:33,   ta:"முதலாவது தேவனுடைய ராஜ்யத்தையும் அவருடைய நீதியையும் தேடுங்கள்.",en:"But seek ye first the kingdom of God, and his righteousness.",tags:["seek","kingdom","righteousness","priority"]},
    {id:15,  book:"Matthew",ch:11,v:28,  ta:"வருத்தப்பட்டுப் பாரஞ்சுமக்கிற எல்லாரும் என்னிடத்தில் வாருங்கள்; நான் உங்களுக்கு இளைப்பாறுதல் தருவேன்.",en:"Come unto me, all ye that labour and are heavy laden, and I will give you rest.",tags:["rest","burden","comfort","peace"]},
    {id:16,  book:"John",ch:3,v:16,      ta:"தேவன், தம்முடைய ஒரே பேறான குமாரனை விசுவாசிக்கிறவன் எவனோ அவன் கெட்டுப்போகாமல் நித்தியஜீவனை அடையும்படிக்கு, அவரை தந்தருளி இவ்வளவாய் உலகத்தில் அன்பாயிருந்தார்.",en:"For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",tags:["love","salvation","eternal","god","jesus","gospel"]},
    {id:17,  book:"John",ch:14,v:6,      ta:"இயேசு அவனை நோக்கி: நானே வழியும் சத்தியமும் ஜீவனுமாயிருக்கிறேன்.",en:"Jesus saith unto him, I am the way, the truth, and the life.",tags:["jesus","truth","life","way","salvation"]},
    {id:18,  book:"Romans",ch:8,v:28,    ta:"தேவனிடத்தில் அன்பு கூர்ந்து அவருடைய தீர்மானத்தின்படி அழைக்கப்பட்டவர்களுக்கு எல்லாவற்றிலும் நன்மையே உண்டாகும்.",en:"And we know that all things work together for good to them that love God.",tags:["purpose","love","good","promise","faith"]},
    {id:19,  book:"Philippians",ch:4,v:6,ta:"எந்த காரியத்திலும் கவலைப்படாதிருங்கள்; எல்லாவற்றிலும் உங்கள் விண்ணப்பங்களை ஸ்தோத்திரத்தோடே கூடிய ஜெபத்தினாலும் தேவனுக்கு அறிவியுங்கள்.",en:"Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.",tags:["prayer","anxiety","thanksgiving","peace","worry"]},
    {id:20,  book:"Philippians",ch:4,v:13,ta:"என்னைப் பலப்படுத்துகிற கிறிஸ்துவினாலே எல்லாவற்றையும் செய்யக்கூடும்.",en:"I can do all things through Christ which strengtheneth me.",tags:["strength","christ","power","ability"]},
    {id:21,  book:"Hebrews",ch:11,v:1,   ta:"விசுவாசம் என்பது நம்பப்படுகிறவைகளின் நிச்சயமும் காணப்படாதவைகளின் நிரூபணமுமாயிருக்கிறது.",en:"Now faith is the substance of things hoped for, the evidence of things not seen.",tags:["faith","hope","substance","evidence","believe"]},
    {id:22,  book:"1 John",ch:4,v:8,     ta:"அன்பில்லாதவன் தேவனை அறியான்; ஏனெனில் தேவன் அன்பாகவே இருக்கிறார்.",en:"He that loveth not knoweth not God; for God is love.",tags:["love","god","nature","divine"]},
    {id:23,  book:"Revelation",ch:21,v:4,ta:"தேவன் தாமே அவர்களுடைய கண்களிலிருந்து கண்ணீரனைத்தையும் துடைப்பார்; இனி மரணமுமில்லை துக்கமுமில்லை.",en:"And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow.",tags:["heaven","comfort","eternal","tears","hope","promise"]},
    {id:24,  book:"Romans",ch:6,v:23,    ta:"பாவத்தின் சம்பளம் மரணம்; தேவனுடைய கிருபைவரமோ நம்முடைய கர்த்தராகிய இயேசுகிறிஸ்துவினால் உண்டான நித்தியஜீவன்.",en:"For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord.",tags:["sin","death","eternal","salvation","grace","gift"]},
    {id:25,  book:"Galatians",ch:5,v:22, ta:"ஆவியின் கனியோ, அன்பு, சந்தோஷம், சமாதானம், நீடிய பொறுமை, தயவு, நன்மை, விசுவாசம், சாந்தம், தன்னடக்கம்.",en:"But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance.",tags:["fruit","spirit","love","joy","peace","holy spirit"]},
    {id:26,  book:"Ephesians",ch:2,v:8,  ta:"கிருபையினாலே விசுவாசத்தைக்கொண்டு இரட்சிக்கப்பட்டீர்கள்; இது தேவனுடைய வரம்.",en:"For by grace are ye saved through faith; and that not of yourselves: it is the gift of God.",tags:["grace","salvation","faith","gift","gospel"]},
    {id:27,  book:"1 Corinthians",ch:13,v:4,ta:"அன்பு நீடிய பொறுமையுள்ளது; அன்பு தயவுள்ளது; அன்பு பொறாமைப்படாது.",en:"Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself.",tags:["love","patience","kindness","charity","marriage"]},
    {id:28,  book:"James",ch:1,v:5,      ta:"உங்களில் ஒருவனுக்கு ஞானம் குறைவாயிருந்தால் தாராளமாய் கொடுக்கிற தேவனிடத்தில் கேட்கட்டும்.",en:"If any of you lack wisdom, let him ask of God, that giveth to all men liberally.",tags:["wisdom","ask","god","prayer","guidance"]},
    {id:29,  book:"1 Peter",ch:5,v:7,    ta:"அவர் உங்களை விசாரிக்கிறபடியால், உங்கள் கவலைகளையெல்லாம் அவர்மேல் போட்டுவிடுங்கள்.",en:"Casting all your care upon him; for he careth for you.",tags:["care","anxiety","worry","god","trust","peace"]},
    {id:30,  book:"1 John",ch:1,v:9,     ta:"நாம் நம்முடைய பாவங்களை அறிக்கையிட்டால் அவர் நம்முடைய பாவங்களை மன்னித்து நம்மைச் சுத்திகரிப்பார்.",en:"If we confess our sins, he is faithful and just to forgive us our sins.",tags:["forgiveness","confession","faithful","cleanse","mercy"]}
  ];

  // Add ref field to built-in verses
  BUILTIN.forEach(function(v){ v.ref = v.book + ' ' + v.ch + ':' + v.v; });

  var _verses = BUILTIN.slice();
  var _fullLoaded = false;
  var _loading = false;

  var TOPICS = {
    "love":["love","charity","devotion","sacrifice","selfless","marriage"],
    "faith":["faith","believe","trust","evidence","assurance"],
    "hope":["hope","promise","future","plan","eternal"],
    "peace":["peace","rest","comfort","peacemaker","mind"],
    "strength":["strength","power","courage","renew","ability","perseverance"],
    "prayer":["prayer","thanksgiving","ask","ceasing","devotion"],
    "fear":["fear","courage","protection","trust","deliverance"],
    "salvation":["salvation","gospel","eternal","grace","gift","redemption"],
    "jesus":["jesus","christ","lord","way","truth","life","messiah"],
    "god":["god","creation","lord","divine","power"],
    "guidance":["guidance","direction","wisdom","path","word"],
    "wisdom":["wisdom","understanding","ask","teaching","study"],
    "healing":["healing","broken","comfort","mercy"],
    "comfort":["comfort","broken","near","tears","mercy"],
    "praise":["praise","worship","thanksgiving","joy","rejoice"],
    "heaven":["heaven","kingdom","eternal","glory","promise"],
    "sin":["sin","confession","forgiveness","cleanse","repentance"],
    "forgiveness":["forgiveness","mercy","cleanse","confession","grace"],
    "holy spirit":["holy spirit","spirit","fruit","power"],
    "family":["family","children","parenting","loyalty"],
    "anxiety":["anxiety","worry","prayer","peace","trust","care"],
    "bible":["scripture","word","light","inspiration","teaching"]
  };

  // IndexedDB helpers
  var DB_NAME = 'VedaVachanam4', STORE_NAME = 'bible', CACHE_KEY = 'kjv';
  var KJV_URL = 'https://raw.githubusercontent.com/scrollmapper/bible_databases/master/json/t_kjv.json';

  function openDB(cb){
    if(!window.indexedDB){cb(null);return;}
    var r=indexedDB.open(DB_NAME,1);
    r.onupgradeneeded=function(e){e.target.result.createObjectStore(STORE_NAME);};
    r.onsuccess=function(e){cb(e.target.result);};
    r.onerror=function(){cb(null);};
  }
  function dbGet(db,key,cb){
    try{var r=db.transaction(STORE_NAME,'readonly').objectStore(STORE_NAME).get(key);r.onsuccess=function(e){cb(e.target.result);};r.onerror=function(){cb(null);};}
    catch(e){cb(null);}
  }
  function dbPut(db,key,val){
    try{db.transaction(STORE_NAME,'readwrite').objectStore(STORE_NAME).put(val,key);}catch(e){}
  }

  function buildRef(v){return v.ref||(v.book+' '+v.ch+':'+v.v);}

  function convertKJV(raw){
    // scrollmapper format: array of {b,c,v,t}
    var arr=raw.verses||raw||[];
    var result=[];
    // Build Tamil lookup from BUILTIN
    var tamilMap={};
    BUILTIN.forEach(function(bv){ tamilMap[bv.book+'_'+bv.ch+'_'+bv.v]=bv; });
    arr.forEach(function(r){
      var bookObj=BOOKS[r.b-1];
      if(!bookObj)return;
      var k=bookObj.name+'_'+r.c+'_'+r.v;
      var bv=tamilMap[k];
      result.push({
        id:  r.b*100000+r.c*1000+r.v,
        book:bookObj.name,
        ch:  r.c,
        v:   r.v,
        ref: bookObj.name+' '+r.c+':'+r.v,
        en:  r.t,
        ta:  bv?bv.ta:r.t,
        tags:bv?bv.tags:[]
      });
    });
    return result;
  }

  function loadFullBible(onProgress,onDone){
    if(_fullLoaded||_loading)return;
    _loading=true;
    openDB(function(db){
      if(!db){_loading=false;onDone&&onDone(false,'No IndexedDB');return;}
      dbGet(db,CACHE_KEY,function(cached){
        if(cached&&cached.length>10000){
          _verses=cached;_fullLoaded=true;_loading=false;
          onProgress&&onProgress(100,cached.length);
          onDone&&onDone(true,cached.length);
          return;
        }
        onProgress&&onProgress(5,0);
        fetch(KJV_URL).then(function(r){
          if(!r.ok)throw new Error('HTTP '+r.status);
          onProgress&&onProgress(40,0);
          return r.json();
        }).then(function(raw){
          onProgress&&onProgress(80,0);
          var converted=convertKJV(raw);
          _verses=converted;_fullLoaded=true;_loading=false;
          dbPut(db,CACHE_KEY,converted);
          onProgress&&onProgress(100,converted.length);
          onDone&&onDone(true,converted.length);
        }).catch(function(err){
          _loading=false;
          onDone&&onDone(false,err.message);
        });
      });
    });
  }

  function bookOf(n){return BOOKS.find(function(b){return b.name===n;})||{};}
  function colorOf(n){return(bookOf(n)).color||'#0078D7';}
  function byId(id){return _verses.find(function(v){return v.id===id;});}
  function byBook(n){return _verses.filter(function(v){return v.book===n;});}
  function byBookCh(n,c){return _verses.filter(function(v){return v.book===n&&v.ch===c;});}
  function daily(){
    var d=new Date(),n=Math.floor((d-new Date(d.getFullYear(),0,0))/86400000);
    return _verses[n%_verses.length];
  }
  function search(query){
    if(!query||!query.trim())return[];
    var q=query.toLowerCase().trim(),words=q.split(/\s+/),tagSet={};
    words.forEach(function(w){
      Object.keys(TOPICS).forEach(function(k){
        if(w.indexOf(k)!==-1||k.indexOf(w)!==-1)TOPICS[k].forEach(function(t){tagSet[t]=true;});
      });
    });
    var scored=_verses.map(function(v){
      var score=0,hay=(v.en+' '+(v.ta||'')+' '+buildRef(v)+' '+(v.tags||[]).join(' ')).toLowerCase();
      (v.tags||[]).forEach(function(t){if(tagSet[t])score+=4;});
      words.forEach(function(w){if(w.length>2&&hay.indexOf(w)!==-1)score+=2;});
      if(v.book&&v.book.toLowerCase().indexOf(q)!==-1)score+=6;
      if(buildRef(v).toLowerCase().indexOf(q)!==-1)score+=5;
      return{v:v,score:score};
    }).filter(function(x){return x.score>0;});
    scored.sort(function(a,b){return b.score-a.score;});
    return scored.slice(0,12).map(function(x){return x.v;});
  }

  return{
    books:BOOKS,bookOf:bookOf,colorOf:colorOf,buildRef:buildRef,
    byId:byId,byBook:byBook,byBookCh:byBookCh,daily:daily,
    search:search,
    allVerses:function(){return _verses;},
    isFullLoaded:function(){return _fullLoaded;},
    verseCount:function(){return _verses.length;},
    topicList:function(){return Object.keys(TOPICS);},
    loadFullBible:loadFullBible
  };
})();
