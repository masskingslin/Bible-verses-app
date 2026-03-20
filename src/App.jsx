import { useState, useEffect, useCallback, useMemo } from "react";

var BIBLE_DATA = [
  { id:1,  book:"Aathiyagamam",   book_en:"Genesis",       ch:1,  v:1,  ta:"Aathiyilae thaevan vaanaththaiyum boomiyaiyum sirushtittaar.", en:"In the beginning God created the heaven and the earth.", tags:["creation","god","beginning"] },
  { id:2,  book:"Psalms Tamil",   book_en:"Psalms",        ch:23, v:1,  ta:"Karthar en maeiparaayirukkiaar; enakku kuraivu undaagaathu.", en:"The Lord is my shepherd; I shall not want.", tags:["shepherd","trust","lord","hope"] },
  { id:3,  book:"Proverbs Tamil", book_en:"Proverbs",      ch:3,  v:5,  ta:"Un sondha vivaegaththinmael saayaamal un muzhuu iruthaiyathodum kartharil nambikkaiyaayiru.", en:"Trust in the Lord with all thine heart; and lean not unto thine own understanding.", tags:["trust","wisdom","heart","lord"] },
  { id:4,  book:"Isaiah Tamil",   book_en:"Isaiah",        ch:40, v:31, ta:"Kartharai nambikkondirukkiravargaalo pudhuppikkappatta pelaththai adaivaaargal.", en:"But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles.", tags:["strength","hope","wait"] },
  { id:5,  book:"Jeremiah Tamil", book_en:"Jeremiah",      ch:29, v:11, ta:"Naan ungalukkaaga ninaikkirtha ninaivugalai naan ariven; avai nannmaikkaedhuvana ninaivugale.", en:"For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil.", tags:["hope","future","plan","peace"] },
  { id:6,  book:"Matthew Tamil",  book_en:"Matthew",       ch:11, v:28, ta:"Varutthapattu paaransumaakkira ellarum ennidaththil vaarungal; naan ungalukku ilaippaarudhal tharuvean.", en:"Come unto me, all ye that labour and are heavy laden, and I will give you rest.", tags:["rest","burden","comfort"] },
  { id:7,  book:"Matthew Tamil",  book_en:"Matthew",       ch:6,  v:33, ta:"Mudhalaavathu thaevanuday raajyaththaiyum avuruday neethiyaiyum thaedungal.", en:"But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.", tags:["seek","kingdom","righteousness"] },
  { id:8,  book:"John Tamil",     book_en:"John",          ch:3,  v:16, ta:"Thaevan thamuday orae paeran kumaaran viswasikkiran evano avan naethiyajeevanai adaiyumbadikku avarai thandharuli.", en:"For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.", tags:["love","salvation","eternal life","god"] },
  { id:9,  book:"John Tamil",     book_en:"John",          ch:14, v:6,  ta:"Yesu avarai nokki: Naanae vazhiyum saththiyamum jeevanumaaayirukkiraen.", en:"Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.", tags:["jesus","truth","life","way"] },
  { id:10, book:"Romans Tamil",   book_en:"Romans",        ch:8,  v:28, ta:"Thaevanidaththil anbu koorndu avaruday theermanathinpadi azaikkappatavargalukku ella vazhigilum nanmaeyae undaagum.", en:"And we know that all things work together for good to them that love God.", tags:["good","love","purpose","faith"] },
  { id:11, book:"Romans Tamil",   book_en:"Romans",        ch:6,  v:23, ta:"Paavathin sambalam maranam; Thaevanudaiya kirupaivaramoe naethiyajeevan.", en:"For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord.", tags:["sin","death","gift","eternal life","salvation"] },
  { id:12, book:"Philippians",    book_en:"Philippians",   ch:4,  v:13, ta:"Ennai balapaduththukira Kiristhuvinalae ellavarraiyum seyyakkudum.", en:"I can do all things through Christ which strengtheneth me.", tags:["strength","christ","power"] },
  { id:13, book:"Philippians",    book_en:"Philippians",   ch:4,  v:6,  ta:"Endha kaaryaththilum kavalaipadaathirungal; ellavarrilum ungal vinnapangalai sthothiraththodae kooda jaepathinalum thaevanukku ariviyngal.", en:"Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.", tags:["prayer","anxiety","peace","thanksgiving"] },
  { id:14, book:"Philippians",    book_en:"Philippians",   ch:4,  v:7,  ta:"Ellaavidha sinthanaikku maelaana thaeva samaadhanam ungal iruthaiyangalaiyum sinthaigalaiyum Kiristhu Yesuvinukul kaakkum.", en:"And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.", tags:["peace","heart","mind","god"] },
  { id:15, book:"Hebrews Tamil",  book_en:"Hebrews",       ch:11, v:1,  ta:"Viswasam enbathu nambappadura vaigalin nisayamum kaanappadaathavaikaiin nirupanamum aaayirukkiarthu.", en:"Now faith is the substance of things hoped for, the evidence of things not seen.", tags:["faith","hope","substance","evidence"] },
  { id:16, book:"1 John Tamil",   book_en:"1 John",        ch:4,  v:8,  ta:"Anbillaathavan thaevanai ariyaan; aenaenil thaevan anbaagavae irukkiaar.", en:"He that loveth not knoweth not God; for God is love.", tags:["love","god","know"] },
  { id:17, book:"Revelation",     book_en:"Revelation",    ch:21, v:4,  ta:"Thaevan thaame avarkaludaiya kanneeranathaiyum thudaippaar; ini maranamumillai thukkamumillai azhukaiyumillai vaedanayumillai.", en:"And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying.", tags:["heaven","comfort","eternal","tears","hope"] },
  { id:18, book:"Psalms Tamil",   book_en:"Psalms",        ch:46, v:1,  ta:"Thaevan namakku adaikkalaum pelanumaaayirukkiaar; ikkattukkalil avar migavum udaviyaaayirukkiaar.", en:"God is our refuge and strength, a very present help in trouble.", tags:["refuge","strength","help","trouble"] },
  { id:19, book:"Psalms Tamil",   book_en:"Psalms",        ch:119,v:105, ta:"Umathu vaarththai en paadangalukku deepamum en paadaiyil velissamumaaayirukkiarthu.", en:"Thy word is a lamp unto my feet, and a light unto my path.", tags:["word","light","path","guidance"] },
  { id:20, book:"Psalms Tamil",   book_en:"Psalms",        ch:23, v:4,  ta:"Naan marana irulin pallathaakkil nadanthaalum theemaikku anjamattaen; thaevareer ennodirukkiraeer.", en:"Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me.", tags:["fear","protection","god","death"] }
];

var TOPIC_MAP = {
  "love":["love","salvation"],"faith":["faith","hope","trust"],"hope":["hope","future","plan"],
  "strength":["strength","power"],"peace":["peace","comfort","rest"],"comfort":["comfort","rest"],
  "rest":["rest","comfort"],"fear":["fear","protection","death"],"anxiety":["anxiety","prayer"],
  "prayer":["prayer","thanksgiving"],"guidance":["guidance","path","word"],"sin":["sin","death"],
  "salvation":["salvation","eternal life","love"],"heaven":["heaven","comfort","eternal","tears"],
  "family":["children","family"],"children":["children","family"],"blessed":["blessed"],
  "death":["death","sin"],"eternal":["eternal life","heaven"],"creation":["creation","god","beginning"],
  "jesus":["jesus","truth","life","way"],"god":["god","creation","love"],"lord":["lord","shepherd","trust"],
  "healing":["comfort","rest","hope"],"marriage":["love","family"],"depression":["comfort","hope","rest"],
  "anger":["peace","prayer"],"forgiveness":["salvation","love"],"wisdom":["wisdom","trust"],
  "truth":["truth","jesus"],"money":["guidance","trust"],"protect":["refuge","strength","protection"]
};

function inbuiltAISearch(query) {
  var q = query.toLowerCase().trim();
  var words = q.split(/\s+/);
  var matchedTags = [];
  words.forEach(function(word) {
    Object.keys(TOPIC_MAP).forEach(function(key) {
      if (word.indexOf(key) !== -1 || key.indexOf(word) !== -1) {
        TOPIC_MAP[key].forEach(function(t) {
          if (matchedTags.indexOf(t) === -1) matchedTags.push(t);
        });
      }
    });
  });
  var scored = BIBLE_DATA.map(function(v) {
    var score = 0;
    var combined = (v.en + " " + v.tags.join(" ")).toLowerCase();
    matchedTags.forEach(function(tag) { if (v.tags.indexOf(tag) !== -1) score += 3; });
    words.forEach(function(word) {
      if (word.length > 2 && combined.indexOf(word) !== -1) score += 2;
    });
    if (v.book_en.toLowerCase().indexOf(q) !== -1) score += 5;
    return Object.assign({}, v, { score: score });
  }).filter(function(v) { return v.score > 0; });
  scored.sort(function(a, b) { return b.score - a.score; });
  return scored.slice(0, 6);
}

var QUICK_TOPICS = [
  { label:"Love",     q:"love" },   { label:"Peace",    q:"peace" },
  { label:"Strength", q:"strength"},{ label:"Hope",     q:"hope" },
  { label:"Prayer",   q:"prayer" }, { label:"Fear",     q:"fear" },
  { label:"Family",   q:"family" }, { label:"Salvation",q:"salvation" },
  { label:"Faith",    q:"faith" },  { label:"Comfort",  q:"comfort" },
  { label:"Guidance", q:"guidance"},{ label:"Jesus",    q:"jesus" }
];

var COLORS = ["#0078D7","#107C10","#E81123","#744DA9","#FF8C00","#008272","#00B4D8","#4C4C4C"];
var BOOK_LIST = ["Genesis","Exodus","Psalms","Proverbs","Isaiah","Jeremiah","Matthew","Mark","Luke","John","Romans","1 Corinthians","Philippians","Hebrews","1 John","Revelation"];
function bookColor(b) {
  var i = BOOK_LIST.indexOf(b);
  return COLORS[(i < 0 ? 0 : i) % COLORS.length];
}

var TTS_OK = typeof window !== "undefined" && "speechSynthesis" in window;

function useAudio() {
  var s1 = useState(false); var speaking = s1[0]; var setSpeaking = s1[1];
  var s2 = useState(false); var paused   = s2[0]; var setPaused   = s2[1];
  var s3 = useState([]);    var voices   = s3[0]; var setVoices   = s3[1];

  useEffect(function() {
    if (!TTS_OK) return;
    function load() { setVoices(window.speechSynthesis.getVoices()); }
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return function() { window.speechSynthesis.cancel(); };
  }, []);

  var speak = useCallback(function(text, lang) {
    if (!TTS_OK) return;
    if (!lang) lang = "en-US";
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = lang; u.rate = 0.85; u.pitch = 1;
    var prefix = lang.split("-")[0];
    for (var i = 0; i < voices.length; i++) {
      if (voices[i].lang.indexOf(prefix) === 0) { u.voice = voices[i]; break; }
    }
    u.onstart = function() { setSpeaking(true);  setPaused(false); };
    u.onend   = function() { setSpeaking(false); setPaused(false); };
    u.onerror = function() { setSpeaking(false); setPaused(false); };
    window.speechSynthesis.speak(u);
  }, [voices]);

  function pause()  { if (TTS_OK) window.speechSynthesis.pause();  setPaused(true);  }
  function resume() { if (TTS_OK) window.speechSynthesis.resume(); setPaused(false); }
  function stop()   { if (TTS_OK) window.speechSynthesis.cancel(); setSpeaking(false); setPaused(false); }

  return { speak: speak, pause: pause, resume: resume, stop: stop, speaking: speaking, paused: paused };
}

function GoogleAd(props) {
  var h = props.format === "rect" ? 180 : 52;
  return (
    <div style={{ background:"#181818", border:"1px solid #2a2a2a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:h, margin:"6px 0" }}>
      <span style={{ fontSize:8, color:"#444" }}>ADVERTISEMENT</span>
      <span style={{ fontSize:9, color:"#333" }}>AdSense Slot: {props.slot}</span>
    </div>
  );
}

function VerseCard(props) {
  var v      = props.verse;
  var favIds = props.favIds;
  var dark   = props.darkMode;
  var cs     = useState(false); var copied = cs[0]; var setCopied = cs[1];
  var color  = bookColor(v.book_en);
  var isFav  = favIds.indexOf(v.id) !== -1;
  var bg     = dark ? "#1a1a1a" : "#fff";
  var fg     = dark ? "#f0e6c8" : "#111";
  var mt     = dark ? "rgba(240,230,200,0.5)" : "rgba(0,0,0,0.45)";

  function doCopy() {
    var text = v.ta + "\n" + v.en + "\n-- " + v.book_en + " " + v.ch + ":" + v.v;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function() {});
    }
    setCopied(true);
    setTimeout(function() { setCopied(false); }, 2000);
  }

  return (
    <div style={{ background:bg, marginBottom:2, borderLeft:"4px solid " + color }}>
      <div style={{ background:color, padding:"7px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ color:"#fff", fontSize:11, fontWeight:700 }}>{v.book_en} {v.ch}:{v.v}</span>
      </div>
      <div style={{ padding:"12px 14px" }}>
        <div style={{ fontSize:13, lineHeight:1.9, color:fg, fontFamily:"serif", marginBottom:8 }}>{v.ta}</div>
        <div style={{ fontSize:12, lineHeight:1.7, color:mt, fontStyle:"italic", fontFamily:"Georgia,serif" }}>"{v.en}"</div>
        <div style={{ display:"flex", gap:2, marginTop:10 }}>
          <button onClick={function() { props.onFav(v.id); }} style={{ flex:1, padding:"6px 2px", border:"none", background:isFav?color:dark?"#2a2a2a":"#f0f0f0", color:isFav?"#fff":mt, fontSize:8, fontWeight:700, cursor:"pointer" }}>{isFav ? "SAVED" : "SAVE"}</button>
          <button onClick={doCopy} style={{ flex:1, padding:"6px 2px", border:"none", background:copied?color:dark?"#2a2a2a":"#f0f0f0", color:copied?"#fff":mt, fontSize:8, fontWeight:700, cursor:"pointer" }}>{copied ? "COPIED" : "COPY"}</button>
          <button onClick={function() { props.onRead(Object.assign({}, v, { color:color })); }} style={{ flex:1, padding:"6px 2px", border:"none", background:dark?"#2a2a2a":"#f0f0f0", color:mt, fontSize:8, fontWeight:700, cursor:"pointer" }}>READ</button>
          <button onClick={function() { props.onAudio(Object.assign({}, v, { color:color })); }} style={{ flex:1, padding:"6px 2px", border:"none", background:dark?"#2a2a2a":"#f0f0f0", color:mt, fontSize:8, fontWeight:700, cursor:"pointer" }}>AUDIO</button>
        </div>
      </div>
    </div>
  );
}

function ReadingMode(props) {
  var verse  = props.verse;
  var dark   = props.darkMode;
  var audio  = props.audio;
  var fs1    = useState(18); var fs = fs1[0]; var setFs = fs1[1];
  var sa1    = useState(false); var showAudio = sa1[0]; var setShowAudio = sa1[1];
  var bg     = dark ? "#0a0a0a" : "#FFFEF7";
  var fg     = dark ? "#f0e6c8" : "#1a1008";
  var fgm    = dark ? "rgba(240,230,200,0.6)" : "rgba(26,16,8,0.6)";

  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, zIndex:500, background:bg, display:"flex", flexDirection:"column" }}>
      <div style={{ background:verse.color, padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={function() { audio.stop(); props.onClose(); }} style={{ background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", width:32, height:32, fontSize:16, cursor:"pointer" }}>{"<"}</button>
          <div>
            <div style={{ color:"#fff", fontSize:12, fontWeight:700 }}>{verse.book_en} {verse.ch}:{verse.v}</div>
            <div style={{ color:"rgba(255,255,255,0.6)", fontSize:9 }}>Reading Mode</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          <button onClick={function() { setShowAudio(function(s) { return !s; }); }} style={{ background:showAudio?"#fff":"rgba(255,255,255,0.2)", border:"none", color:showAudio?verse.color:"#fff", width:32, height:32, fontSize:10, cursor:"pointer", borderRadius:"50%", fontWeight:700 }}>AUD</button>
          <button onClick={function() { setFs(function(f) { return f > 12 ? f - 2 : f; }); }} style={{ background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", width:28, height:28, fontSize:11, cursor:"pointer", fontWeight:700 }}>A-</button>
          <button onClick={function() { setFs(function(f) { return f < 32 ? f + 2 : f; }); }} style={{ background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", width:28, height:28, fontSize:15, cursor:"pointer", fontWeight:700 }}>A+</button>
        </div>
      </div>

      {showAudio && (
        <div style={{ background:"#005a9e", padding:"10px 14px", flexShrink:0 }}>
          {TTS_OK ? (
            <div style={{ display:"flex", gap:6 }}>
              <button onClick={function() { audio.speak(verse.en, "en-US"); }} style={{ flex:1, padding:"8px 4px", border:"none", background:"rgba(255,255,255,0.15)", color:"#fff", fontSize:9, fontWeight:700, cursor:"pointer" }}>English</button>
              <button onClick={function() { audio.speak(verse.ta, "ta-IN"); }} style={{ flex:1, padding:"8px 4px", border:"none", background:"rgba(255,255,255,0.15)", color:"#fff", fontSize:9, fontWeight:700, cursor:"pointer" }}>Tamil</button>
              <button onClick={audio.speaking && !audio.paused ? audio.pause : audio.resume} style={{ flex:1, padding:"8px 4px", border:"none", background:"rgba(255,255,255,0.15)", color:"#fff", fontSize:9, fontWeight:700, cursor:"pointer" }}>{audio.speaking && !audio.paused ? "Pause" : "Resume"}</button>
              <button onClick={audio.stop} style={{ flex:1, padding:"8px 4px", border:"none", background:"rgba(255,255,255,0.15)", color:"#fff", fontSize:9, fontWeight:700, cursor:"pointer" }}>Stop</button>
            </div>
          ) : (
            <div style={{ color:"#aaa", fontSize:10 }}>Audio works on Android app.</div>
          )}
        </div>
      )}

      <div style={{ flex:1, overflowY:"auto", padding:"32px 20px" }}>
        <div style={{ borderLeft:"4px solid " + verse.color, paddingLeft:20, marginBottom:32 }}>
          <div style={{ fontSize:fs + 4, lineHeight:2.0, color:fg, fontFamily:"serif", marginBottom:20 }}>{verse.ta}</div>
          <div style={{ width:32, height:2, background:verse.color, marginBottom:20 }} />
          <div style={{ fontSize:fs, lineHeight:1.9, color:fgm, fontStyle:"italic", fontFamily:"Georgia,serif" }}>"{verse.en}"</div>
        </div>
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <span style={{ background:verse.color, color:"#fff", fontSize:10, padding:"5px 18px", fontWeight:700 }}>{verse.book_en} {verse.ch}:{verse.v}</span>
        </div>
        <GoogleAd slot="READ_AD" format="rect" />
      </div>
    </div>
  );
}

function AudioBar(props) {
  var verse  = props.verse;
  var audio  = props.audio;
  var ls     = useState("en"); var lang = ls[0]; var setLang = ls[1];

  if (!TTS_OK) {
    return (
      <div style={{ position:"fixed", bottom:64, left:0, right:0, zIndex:200, background:"#333", padding:"12px 16px", display:"flex", justifyContent:"space-between" }}>
        <span style={{ color:"#aaa", fontSize:11 }}>Audio works on Android app only.</span>
        <button onClick={props.onClose} style={{ background:"#555", border:"none", color:"#fff", padding:"4px 10px", cursor:"pointer" }}>X</button>
      </div>
    );
  }

  var text = lang === "ta" ? verse.ta : verse.en;
  var lc   = lang === "ta" ? "ta-IN" : "en-US";

  return (
    <div style={{ position:"fixed", bottom:64, left:0, right:0, zIndex:200, background:"#0078D7", padding:"12px 16px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
        <div style={{ color:"#fff", fontSize:11, fontWeight:700 }}>AUDIO - {verse.book_en} {verse.ch}:{verse.v}</div>
        <button onClick={function() { audio.stop(); props.onClose(); }} style={{ background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", width:28, height:28, cursor:"pointer" }}>X</button>
      </div>
      <div style={{ display:"flex", gap:4, marginBottom:8 }}>
        <button onClick={function() { setLang("en"); audio.stop(); }} style={{ flex:1, padding:"5px 0", border:"none", background:lang === "en" ? "#fff" : "rgba(255,255,255,0.15)", color:lang === "en" ? "#0078D7" : "#fff", fontSize:10, fontWeight:700, cursor:"pointer" }}>English</button>
        <button onClick={function() { setLang("ta"); audio.stop(); }} style={{ flex:1, padding:"5px 0", border:"none", background:lang === "ta" ? "#fff" : "rgba(255,255,255,0.15)", color:lang === "ta" ? "#0078D7" : "#fff", fontSize:10, fontWe