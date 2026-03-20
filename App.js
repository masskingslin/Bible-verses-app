var React = require('react');

// ── Bible Data ────────────────────────────────────────────────────
var VERSES = [
  { id:1,  ref:"John 3:16",       en:"For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",       ta:"Thaevan thamuday oru magan pillai viswasikkiran evano avan naethiya jeevanai adaiyumbadikku avarai thandharuli.",   color:"#0078D7", tags:["love","god","salvation","eternal"] },
  { id:2,  ref:"Psalm 23:1",      en:"The Lord is my shepherd; I shall not want.",                                                                                                          ta:"Karthar en maeiparaayirukkiaar; enakku kuraivu undaagaathu.",                                                         color:"#107C10", tags:["shepherd","trust","lord"] },
  { id:3,  ref:"Phil 4:13",       en:"I can do all things through Christ which strengtheneth me.",                                                                                         ta:"Ennai balapaduththukira Kiristhuvinalae ellavarraiyum seyyakkudum.",                                                   color:"#E81123", tags:["strength","christ","power"] },
  { id:4,  ref:"Jeremiah 29:11",  en:"For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil, to give you an expected end.",                 ta:"Naan ungalukkaaga ninaikkirtha ninaivugalai naan ariven; avai nannmaikkaedhuvana ninaivugale.",                       color:"#744DA9", tags:["hope","future","plan","peace"] },
  { id:5,  ref:"Matthew 11:28",   en:"Come unto me, all ye that labour and are heavy laden, and I will give you rest.",                                                                    ta:"Varutthapattu paaransumaakkira ellarum ennidaththil vaarungal; naan ungalukku ilaippaarudhal tharuvean.",               color:"#FF8C00", tags:["rest","comfort","burden"] },
  { id:6,  ref:"Proverbs 3:5",    en:"Trust in the Lord with all thine heart; and lean not unto thine own understanding.",                                                                 ta:"Un sondha vivaegaththinmael saayaamal un muzhuu iruthaiyathodum kartharil nambikkaiyaayiru.",                         color:"#008272", tags:["trust","wisdom","heart","lord"] },
  { id:7,  ref:"Romans 8:28",     en:"And we know that all things work together for good to them that love God.",                                                                          ta:"Thaevanidaththil anbu koorndu avarkaludaiya theermanathinpadi azaikkappatavargalukku ella valigilum nanmaeyae.",       color:"#00B4D8", tags:["good","love","purpose","faith"] },
  { id:8,  ref:"Isaiah 40:31",    en:"But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles.",                                             ta:"Kartharai nambikkondirukkiravargaalo pudhuppikkappatta pelaththai adaivaaargal.",                                     color:"#4C4C4C", tags:["strength","hope","wait"] },
  { id:9,  ref:"John 14:6",       en:"Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.",                                            ta:"Yesu avarai nokki naanae vazhiyum saththiyamum jeevanumaaayirukkiraen.",                                              color:"#0078D7", tags:["jesus","truth","life","way"] },
  { id:10, ref:"Psalm 46:1",      en:"God is our refuge and strength, a very present help in trouble.",                                                                                   ta:"Thaevan namakku adaikkalaum pelanumaaayirukkiaar; ikkattukkalil avar migavum udaviyaaayirukkiaar.",                   color:"#107C10", tags:["refuge","strength","help","trouble"] },
  { id:11, ref:"Romans 6:23",     en:"For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord.",                                                  ta:"Paavathin sambalam maranam; Thaevanudaiya kirupaivaramoe naethiyajeevan.",                                            color:"#E81123", tags:["sin","death","gift","eternal","salvation"] },
  { id:12, ref:"Hebrews 11:1",    en:"Now faith is the substance of things hoped for, the evidence of things not seen.",                                                                   ta:"Viswasam enbathu nambappadura vaigalin nisayamum kaanappadaathavaikaiin nirupanamum.",                                color:"#744DA9", tags:["faith","hope","evidence"] },
  { id:13, ref:"Phil 4:6",        en:"Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.",                  ta:"Endha kaaryaththilum kavalaipadaathirungal; ellavarrilum ungal vinnapangalai sthothiraththodae jaepathinalum tharuvean.", color:"#FF8C00", tags:["prayer","anxiety","peace","thanksgiving"] },
  { id:14, ref:"Phil 4:7",        en:"And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",                                       ta:"Ellaavidha sinthanaikku maelaana thaeva samaadhanam ungal iruthaiyangalaiyum sinthaigalaiyum kaarum.",                color:"#008272", tags:["peace","heart","mind","god"] },
  { id:15, ref:"1 John 4:8",      en:"He that loveth not knoweth not God; for God is love.",                                                                                               ta:"Anbillaathavan thaevanai ariyaan; aenaenil thaevan anbaagavae irukkiaar.",                                            color:"#00B4D8", tags:["love","god","know"] },
  { id:16, ref:"Matthew 6:33",    en:"But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.",                                         ta:"Mudhalaavathu thaevanuday raajyaththaiyum avuruday neethiyaiyum thaedungal.",                                         color:"#4C4C4C", tags:["seek","kingdom","righteousness"] },
  { id:17, ref:"Psalm 119:105",   en:"Thy word is a lamp unto my feet, and a light unto my path.",                                                                                        ta:"Umathu vaarththai en paadangalukku deepamum en paadaiyil velissamumaaayirukkiarthu.",                                 color:"#0078D7", tags:["word","light","path","guidance"] },
  { id:18, ref:"Revelation 21:4", en:"And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying.",                                   ta:"Thaevan thaame avarkaludaiya kanneeranathaiyum thudaippaar; ini maranamumillai.",                                     color:"#107C10", tags:["heaven","comfort","eternal","tears","hope"] },
  { id:19, ref:"Matthew 5:9",     en:"Blessed are the peacemakers: for they shall be called the children of God.",                                                                         ta:"Samaadhanam pannuvargal paakkiyavankal; avargal thaevanudaiya pudhalvar ennappaduvaaral.",                            color:"#E81123", tags:["peace","blessed","peacemaker"] },
  { id:20, ref:"Romans 10:9",     en:"That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved.", ta:"Yesuvaai aandavar enru un vaayinaal arikaiyiddu iratchikkappadvai.",                                                color:"#744DA9", tags:["salvation","confession","believe","jesus"] }
];

var TOPIC_MAP = {
  "love":["love","god"],"faith":["faith","hope","trust"],"hope":["hope","future","plan"],
  "strength":["strength","power","wait"],"peace":["peace","comfort","rest","heart"],
  "comfort":["comfort","rest","tears"],"rest":["rest","comfort"],"fear":["refuge","protection"],
  "anxiety":["prayer","anxiety","peace"],"prayer":["prayer","thanksgiving"],
  "guidance":["guidance","path","word"],"sin":["sin","death"],"salvation":["salvation","eternal","love"],
  "heaven":["heaven","comfort","eternal","tears"],"family":["family","children"],
  "blessed":["blessed","peace"],"death":["death","sin"],"eternal":["eternal","salvation"],
  "creation":["god"],"jesus":["jesus","truth","life","way","salvation"],
  "god":["god","love","creation"],"lord":["lord","shepherd","trust"],
  "healing":["comfort","rest","hope"],"marriage":["love","family"],
  "depression":["comfort","hope","rest","peace"],"anger":["peace","prayer"],
  "forgiveness":["salvation","love"],"wisdom":["wisdom","trust"],
  "truth":["truth","jesus"],"protection":["refuge","strength"]
};

function searchVerses(query) {
  var q = query.toLowerCase().trim();
  if (!q) return [];
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
  var scored = VERSES.map(function(v) {
    var score = 0;
    var combined = (v.en + " " + v.ta + " " + v.ref + " " + v.tags.join(" ")).toLowerCase();
    matchedTags.forEach(function(tag) { if (v.tags.indexOf(tag) !== -1) score += 3; });
    words.forEach(function(word) { if (word.length > 2 && combined.indexOf(word) !== -1) score += 2; });
    return Object.assign({}, v, { score: score });
  }).filter(function(v) { return v.score > 0; });
  scored.sort(function(a, b) { return b.score - a.score; });
  return scored.slice(0, 8);
}

var TTS_OK = typeof window !== "undefined" && "speechSynthesis" in window;

// ── Styles helper ─────────────────────────────────────────────────
var S = {
  // Layout
  page:    function(dark) { return { background: dark ? "#111" : "#f0f0f0", minHeight:"100vh", paddingBottom:80 }; },
  card:    function(dark) { return { background: dark ? "#1a1a1a" : "#ffffff", marginBottom:2 }; },
  // Text
  white:   { color:"#ffffff" },
  muted:   function(dark) { return { color: dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }; },
  bodyFg:  function(dark) { return { color: dark ? "#f0e6c8" : "#111111" }; },
  // Inputs
  input:   function(dark, accent) { return { width:"100%", background: dark ? "#2a2a2a" : "#f5f5f5", border:"2px solid " + accent, padding:"12px 14px", color: dark ? "#fff" : "#111", fontSize:13, outline:"none", boxSizing:"border-box" }; }
};

// ── Ad Placeholder ────────────────────────────────────────────────
function Ad(props) {
  var h = props.rect ? 180 : 50;
  return React.createElement("div", {
    style:{ background:"#181818", border:"1px solid #2a2a2a", height:h, margin:"6px 0", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3 }
  },
    React.createElement("span", { style:{ fontSize:8, color:"#444", letterSpacing:2 } }, "ADVERTISEMENT"),
    React.createElement("span", { style:{ fontSize:9, color:"#333" } }, "Google AdSense Slot")
  );
}

// ── Verse Card ────────────────────────────────────────────────────
function VerseCard(props) {
  var v = props.verse; var dark = props.dark; var favIds = props.favIds;
  var copied = React.useState(false); var setCopied = copied[1]; copied = copied[0];
  var isFav  = favIds.indexOf(v.id) !== -1;
  var fg = dark ? "#f0e6c8" : "#111";
  var mt = dark ? "rgba(240,230,200,0.5)" : "rgba(0,0,0,0.45)";
  var btnBg = dark ? "#2a2a2a" : "#f0f0f0";

  function copy() {
    var t = v.ta + "\n" + v.en + "\n-- " + v.ref;
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(t).catch(function(){}); }
    setCopied(true); setTimeout(function(){ setCopied(false); }, 2000);
  }

  return React.createElement("div", { style:{ background: dark ? "#1a1a1a" : "#fff", marginBottom:2, borderLeft:"4px solid " + v.color } },
    React.createElement("div", { style:{ background:v.color, padding:"7px 12px", display:"flex", justifyContent:"space-between" } },
      React.createElement("span", { style:{ color:"#fff", fontSize:11, fontWeight:700 } }, v.ref)
    ),
    React.createElement("div", { style:{ padding:"12px 14px" } },
      React.createElement("div", { style:{ fontSize:13, lineHeight:1.9, color:fg, fontFamily:"serif", marginBottom:8 } }, v.ta),
      React.createElement("div", { style:{ fontSize:12, lineHeight:1.7, color:mt, fontStyle:"italic" } }, '"' + v.en + '"'),
      React.createElement("div", { style:{ display:"flex", gap:2, marginTop:10 } },
        React.createElement("button", { onClick:function(){ props.onFav(v.id); }, style:{ flex:1, padding:"6px 2px", border:"none", background:isFav?v.color:btnBg, color:isFav?"#fff":mt, fontSize:8, fontWeight:700, cursor:"pointer" } }, isFav ? "SAVED" : "SAVE"),
        React.createElement("button", { onClick:copy, style:{ flex:1, padding:"6px 2px", border:"none", background:copied?v.color:btnBg, color:copied?"#fff":mt, fontSize:8, fontWeight:700, cursor:"pointer" } }, copied ? "COPIED" : "COPY"),
        React.createElement("button", { onClick:function(){ props.onRead(v); }, style:{ flex:1, padding:"6px 2px", border:"none", background:btnBg, color:mt, fontSize:8, fontWeight:700, cursor:"pointer" } }, "READ"),
        React.createElement("button", { onClick:function(){ props.onAudio(v); }, style:{ flex:1, padding:"6px 2px", border:"none", background:btnBg, color:mt, fontSize:8, fontWeight:700, cursor:"pointer" } }, "AUDIO")
      )
    )
  );
}

// ── Reading Mode ──────────────────────────────────────────────────
function ReadingMode(props) {
  var v = props.verse; var dark = props.dark; var audio = props.audio;
  var fs = React.useState(18); var setFs = fs[1]; fs = fs[0];
  var sa = React.useState(false); var setSa = sa[1]; sa = sa[0];
  var bg = dark ? "#0a0a0a" : "#FFFEF7";
  var fg = dark ? "#f0e6c8" : "#1a1008";
  var fm = dark ? "rgba(240,230,200,0.6)" : "rgba(26,16,8,0.6)";

  return React.createElement("div", { style:{ position:"fixed", top:0, left:0, right:0, bottom:0, zIndex:500, background:bg, display:"flex", flexDirection:"column" } },
    // Top bar
    React.createElement("div", { style:{ background:v.color, padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 } },
      React.createElement("div", { style:{ display:"flex", alignItems:"center", gap:10 } },
        React.createElement("button", { onClick:function(){ audio.stop(); props.onClose(); }, style:{ background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", width:32, height:32, fontSize:14, cursor:"pointer" } }, "< "),
        React.createElement("div", null,
          React.createElement("div", { style:{ color:"#fff", fontSize:12, fontWeight:700 } }, v.ref),
          React.createElement("div", { style:{ color:"rgba(255,255,255,0.6)", fontSize:9 } }, "Reading Mode")
        )
      ),
      React.createElement("div", { style:{ display:"flex", gap:6 } },
        React.createElement("button", { onClick:function(){ setSa(function(s){ return !s; }); }, style:{ background:sa?"#fff":"rgba(255,255,255,0.2)", border:"none", color:sa?v.color:"#fff", width:32, height:32, fontSize:9, cursor:"pointer", borderRadius:"50%", fontWeight:700 } }, "AUD"),
        React.createElement("button", { onClick:function(){ setFs(function(f){ return f > 12 ? f-2 : f; }); }, style:{ background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", width:28, height:28, fontSize:11, cursor:"pointer", fontWeight:700 } }, "A-"),
        React.createElement("button", { onClick:function(){ setFs(function(f){ return f < 32 ? f+2 : f; }); }, style:{ background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", width:28, height:28, fontSize:14, cursor:"pointer", fontWeight:700 } }, "A+")
      )
    ),
    // Audio panel
    sa ? React.createElement("div", { style:{ background:"#005a9e", padding:"10px 14px", flexShrink:0 } },
      TTS_OK
        ? React.createElement("div", { style:{ display:"flex", gap:6 } },
            React.createElement("button", { onClick:function(){ audio.speak(v.en,"en-US"); }, style:{ flex:1, padding:"8px 4px", border:"none", background:"rgba(255,255,255,0.15)", color:"#fff", fontSize:9, fontWeight:700, cursor:"pointer" } }, "English"),
            React.createElement("button", { onClick:function(){ audio.speak(v.ta,"ta-IN"); }, style:{ flex:1, padding:"8px 4px", border:"none", background:"rgba(255,255,255,0.15)", color:"#fff", fontSize:9, fontWeight:700, cursor:"pointer" } }, "Tamil"),
            React.createElement("button", { onClick: audio.speaking && !audio.paused ? audio.pause : audio.resume, style:{ flex:1, padding:"8px 4px", border:"none", background:"rgba(255,255,255,0.15)", color:"#fff", fontSize:9, fontWeight:700, cursor:"pointer" } }, audio.speaking && !audio.paused ? "Pause" : "Resume"),
            React.createElement("button", { onClick:audio.stop, style:{ flex:1, padding:"8px 4px", border:"none", background:"rgba(255,255,255,0.15)", color:"#fff", fontSize:9, fontWeight:700, cursor:"pointer" } }, "Stop")
          )
        : React.createElement("div", { style:{ color:"#aaa", fontSize:10 } }, "Audio works on Android app.")
    ) : null,
    // Content
    React.createElement("div", { style:{ flex:1, overflowY:"auto", padding:"32px 20px" } },
      React.createElement("div", { style:{ borderLeft:"4px solid "+v.color, paddingLeft:20, marginBottom:32 } },
        React.createElement("div", { style:{ fontSize:fs+4, lineHeight:2.0, color:fg, fontFamily:"serif", marginBottom:20 } }, v.ta),
        React.createElement("div", { style:{ width:32, height:2, background:v.color, marginBottom:20 } }),
        React.createElement("div", { style:{ fontSize:fs, lineHeight:1.9, color:fm, fontStyle:"italic" } }, '"' + v.en + '"')
      ),
      React.createElement("div", { style:{ textAlign:"center", marginBottom:20 } },
        React.createElement("span", { style:{ background:v.color, color:"#fff", fontSize:10, padding:"5px 18px", fontWeight:700 } }, v.ref)
      ),
      React.createElement(Ad, { rect:true })
    )
  );
}

// ── Audio Bar ─────────────────────────────────────────────────────
function AudioBar(props) {
  var v = props.verse; var audio = props.audio;
  var ls = React.useState("en"); var setLang = ls[1]; var lang = ls[0];

  if (!TTS_OK) {
    return React.createElement("div", { style:{ position:"fixed", bottom:64, left:0, right:0, zIndex:200, background:"#333", padding:"12px 16px", display:"flex", justifyContent:"space-between" } },
      React.createElement("span", { style:{ color:"#aaa", fontSize:11 } }, "Audio works on Android app."),
      React.createElement("button", { onClick:props.onClose, style:{ background:"#555", border:"none", color:"#fff", padding:"4px 10px", cursor:"pointer" } }, "X")
    );
  }

  var text = lang === "ta" ? v.ta : v.en;
  var lc   = lang === "ta" ? "ta-IN" : "en-US";

  return React.createElement("div", { style:{ position:"fixed", bottom:64, left:0, right:0, zIndex:200, background:"#0078D7", padding:"12px 16px" } },
    React.createElement("div", { style:{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 } },
      React.createElement("div", { style:{ color:"#fff", fontSize:11, fontWeight:700 } }, "AUDIO - " + v.ref),
      React.createElement("button", { onClick:function(){ audio.stop(); props.onClose(); }, style:{ background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", width:28, height:28, cursor:"pointer" } }, "X")
    ),
    React.createElement("div", { style:{ display:"flex", gap:4, marginBottom:8 } },
      React.createElement("button", { onClick:function(){ setLang("en"); audio.stop(); }, style:{ flex:1, padding:"5px 0", border:"none", background:lang==="en"?"#fff":"rgba(255,255,255,0.15)", color:lang==="en"?"#0078D7":"#fff", fontSize:10, fontWeight:700, cursor:"pointer" } }, "English"),
      React.createElement("button", { onClick:function(){ setLang("ta"); audio.stop(); }, style:{ flex:1, padding:"5px 0", border:"none", background:lang==="ta"?"#fff":"rgba(255,255,255,0.15)", color:lang==="ta"?"#0078D7":"#fff", fontSize:10, fontWeight:700, cursor:"pointer" } }, "Tamil")
    ),
    React.createElement("div", { style:{ display:"flex", gap:6 } },
      React.createElement("button", { onClick:function(){ audio.speak(text,lc); }, style:{ flex:2, padding:"10px 0", border:"none", background:audio.speaking&&!audio.paused?"rgba(255,255,255,0.2)":"#fff", color:audio.speaking&&!audio.paused?"#fff":"#0078D7", fontSize:11, fontWeight:700, cursor:"pointer" } },
        audio.speaking && !audio.paused ? "PLAYING..." : "PLAY"
      ),
      audio.speaking && !audio.paused ? React.createElement("button", { onClick:audio.pause,  style:{ flex:1, padding:"10px 0", background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer" } }, "PAUSE")  : null,
      audio.speaking &&  audio.paused  ? React.createElement("button", { onClick:audio.resume, style:{ flex:1, padding:"10px 0", background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer" } }, "RESUME") : null,
      React.createElement("button", { onClick:audio.stop, style:{ flex:1, padding:"10px 0", background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", fontSize:11, cursor:"pointer" } }, "STOP")
    )
  );
}

// ── Home ──────────────────────────────────────────────────────────
function HomeView(props) {
  var dark = props.dark; var favIds = props.favIds;
  var ts = React.useState(new Date()); var setTime = ts[1]; var time = ts[0];
  React.useEffect(function() {
    var t = setInterval(function(){ setTime(new Date()); }, 1000);
    return function(){ clearInterval(t); };
  }, []);

  var daily  = VERSES[new Date().getDay() % VERSES.length];
  var bg     = dark ? "#111" : "#f0f0f0";
  var tStr   = time.toLocaleTimeString("en", { hour:"2-digit", minute:"2-digit", hour12:true });
  var dStr   = time.toLocaleDateString("en", { weekday:"long", day:"numeric", month:"long" });
  var tiles  = [
    { label:"AI Search",   sub:"Offline Verse Finder",    color:"#744DA9", tab:"ai" },
    { label:"Books",       sub:"Bible Books",             color:"#107C10", tab:"books" },
    { label:"Saved",       sub:favIds.length+" saved",    color:"#E81123", tab:"fav" },
    { label:"All Verses",  sub:VERSES.length+" verses",   color:"#FF8C00", tab:"verses" }
  ];

  return React.createElement("div", { style:{ background:bg, minHeight:"100vh", paddingBottom:80 } },
    React.createElement(Ad, null),
    React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2, padding:2 } },
      // Clock
      React.createElement("div", { style:{ gridColumn:"1/3", background:"#0078D7", padding:"16px 20px", minHeight:110 } },
        React.createElement("div", { style:{ fontSize:40, fontWeight:100, color:"#fff", lineHeight:1 } }, tStr),
        React.createElement("div", { style:{ fontSize:11, color:"rgba(255,255,255,0.75)", marginTop:6 } }, dStr)
      ),
      // Daily verse
      React.createElement("div", { onClick:function(){ props.onRead(daily); }, style:{ gridColumn:"1/3", background:daily.color, padding:16, cursor:"pointer", minHeight:130 } },
        React.createElement("div", { style:{ color:"rgba(255,255,255,0.6)", fontSize:8, letterSpacing:3, marginBottom:8 } }, "TODAY - Daily Verse"),
        React.createElement("div", { style:{ fontSize:14, color:"#fff", lineHeight:1.85, fontFamily:"serif", marginBottom:8 } }, daily.ta.length > 100 ? daily.ta.slice(0,100)+"..." : daily.ta),
        React.createElement("div", { style:{ fontSize:9, color:"rgba(255,255,255,0.7)", fontWeight:700 } }, daily.ref),
        React.createElement("div", { style:{ display:"flex", gap:4, marginTop:10 } },
          React.createElement("button", { onClick:function(e){ e.stopPropagation(); props.onAudio(daily); }, style:{ background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", padding:"4px 12px", fontSize:9, fontWeight:700, cursor:"pointer" } }, "AUDIO"),
          React.createElement("button", { onClick:function(e){ e.stopPropagation(); props.onRead(daily);  }, style:{ background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", padding:"4px 12px", fontSize:9, fontWeight:700, cursor:"pointer" } }, "READ")
        )
      ),
      // Quick tiles
      tiles.map(function(t, i) {
        return React.createElement("div", { key:i, onClick:function(){ props.onNav(t.tab); }, style:{ background:t.color, padding:"16px 14px", cursor:"pointer", minHeight:90, display:"flex", flexDirection:"column", justifyContent:"space-between" } },
          React.createElement("div", { style:{ fontSize:12, color:"#fff", fontWeight:700 } }, t.label),
          React.createElement("div", { style:{ fontSize:9,  color:"rgba(255,255,255,0.55)" } }, t.sub)
        );
      })
    ),
    React.createElement(Ad, null),
    VERSES.slice(0, 5).map(function(v, i) {
      return React.createElement(VerseCard, { key:i, verse:v, dark:dark, favIds:favIds, onFav:props.onFav, onRead:props.onRead, onAudio:props.onAudio });
    })
  );
}

// ── AI Search ─────────────────────────────────────────────────────
function SearchView(props) {
  var dark = props.dark; var favIds = props.favIds;
  var qs = React.useState(""); var q = qs[0]; var setQ = qs[1];
  var rs = React.useState([]); var results = rs[0]; var setResults = rs[1];
  var ss = React.useState(false); var searched = ss[0]; var setSearched = ss[1];
  var bg = dark ? "#111" : "#f0f0f0";
  var fg = dark ? "#fff" : "#111";
  var TOPICS = ["love","peace","strength","hope","prayer","fear","family","salvation","faith","comfort","guidance","jesus","god","wisdom","healing","depression"];

  function doSearch(query) {
    var q2 = query || q;
    if (!q2.trim()) return;
    setQ(q2); setResults(searchVerses(q2)); setSearched(true);
  }

  return React.createElement("div", { style:{ background:bg, minHeight:"100vh", paddingBottom:90 } },
    React.createElement(Ad, null),
    React.createElement("div", { style:{ background:"#744DA9", padding:"14px 16px", marginBottom:2 } },
      React.createElement("div", { style:{ color:"#fff", fontSize:13, fontWeight:700, letterSpacing:2 } }, "AI VERSE FINDER"),
      React.createElement("div", { style:{ color:"rgba(255,255,255,0.65)", fontSize:9 } }, "100% Offline - No Internet Required")
    ),
    React.createElement("div", { style:{ background:dark?"#1a1a1a":"#fff", padding:14 } },
      React.createElement("div", { style:{ position:"relative" } },
        React.createElement("input", {
          value:q, placeholder:"Search: love, peace, fear, hope, jesus...",
          onChange:function(e){ setQ(e.target.value); },
          onKeyDown:function(e){ if(e.key==="Enter") doSearch(); },
          style:{ width:"100%", background:dark?"#2a2a2a":"#f5f5f5", border:"2px solid #744DA9", padding:"12px 48px 12px 14px", color:fg, fontSize:13, outline:"none", boxSizing:"border-box" }
        }),
        React.createElement("button", { onClick:function(){ doSearch(); }, style:{ position:"absolute", right:0, top:0, bottom:0, width:44, background:"#744DA9", border:"none", color:"#fff", fontSize:16, cursor:"pointer" } }, "?")
      )
    ),
    React.createElement("div", { style:{ overflowX:"auto", display:"flex", gap:4, padding:"8px 14px" } },
      TOPICS.map(function(t, i) {
        return React.createElement("button", { key:i, onClick:function(){ doSearch(t); }, style:{ background:"#744DA9", border:"none", color:"#fff", padding:"6px 12px", whiteSpace:"nowrap", fontSize:10, cursor:"pointer" } }, t);
      })
    ),
    searched
      ? React.createElement("div", null,
          React.createElement("div", { style:{ background:"#744DA9", padding:"8px 14px", marginBottom:2 } },
            React.createElement("span", { style:{ color:"#fff", fontSize:10, fontWeight:700 } }, results.length > 0 ? results.length + " VERSES FOUND" : "NO RESULTS - Try another keyword")
          ),
          results.map(function(v, i) {
            return React.createElement("div", { key:i },
              React.createElement(VerseCard, { verse:v, dark:dark, favIds:favIds, onFav:props.onFav, onRead:props.onRead, onAudio:props.onAudio }),
              i === 2 ? React.createElement(Ad, null) : null
            );
          })
        )
      : React.createElement("div", { style:{ padding:"40px 20px", textAlign:"center", color:dark?"rgba(255,255,255,0.3)":"rgba(0,0,0,0.3)", fontSize:11, letterSpacing:2 } }, "SEARCH BY TOPIC OR KEYWORD"),
    React.createElement(Ad, null)
  );
}

// ── Books ─────────────────────────────────────────────────────────
var BOOKS = [
  {en:"Genesis",ch:50,t:"OT"},{en:"Exodus",ch:40,t:"OT"},{en:"Psalms",ch:150,t:"OT"},
  {en:"Proverbs",ch:31,t:"OT"},{en:"Isaiah",ch:66,t:"OT"},{en:"Jeremiah",ch:52,t:"OT"},
  {en:"Matthew",ch:28,t:"NT"},{en:"Mark",ch:16,t:"NT"},{en:"Luke",ch:24,t:"NT"},
  {en:"John",ch:21,t:"NT"},{en:"Acts",ch:28,t:"NT"},{en:"Romans",ch:16,t:"NT"},
  {en:"1 Corinthians",ch:16,t:"NT"},{en:"Philippians",ch:4,t:"NT"},
  {en:"Hebrews",ch:13,t:"NT"},{en:"Revelation",ch:22,t:"NT"}
];
var COLORS = ["#0078D7","#107C10","#E81123","#744DA9","#FF8C00","#008272","#00B4D8","#4C4C4C"];

function BooksView(props) {
  var dark = props.dark;
  var fs = React.useState("ALL"); var filter = fs[0]; var setFilter = fs[1];
  var bg = dark ? "#111" : "#f0f0f0";
  var shown = filter === "ALL" ? BOOKS : BOOKS.filter(function(b){ return b.t === filter; });

  return React.createElement("div", { style:{ background:bg, minHeight:"100vh", paddingBottom:80 } },
    React.createElement(Ad, null),
    React.createElement("div", { style:{ background:"#107C10", padding:"12px 16px", marginBottom:2 } },
      React.createElement("div", { style:{ color:"#fff", fontSize:13, fontWeight:700, letterSpacing:2 } }, "BIBLE BOOKS")
    ),
    React.createElement("div", { style:{ display:"flex", gap:2, padding:2, marginBottom:2 } },
      [["ALL","All Books"],["OT","Old Testament"],["NT","New Testament"]].map(function(item) {
        return React.createElement("button", { key:item[0], onClick:function(){ setFilter(item[0]); }, style:{ flex:1, padding:"8px 0", border:"none", background:filter===item[0]?"#107C10":dark?"#2a2a2a":"#ddd", color:filter===item[0]?"#fff":dark?"rgba(255,255,255,0.5)":"rgba(0,0,0,0.5)", fontSize:9, fontWeight:700, cursor:"pointer" } }, item[1]);
      })
    ),
    React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2, padding:2 } },
      shown.map(function(b, i) {
        var col = COLORS[i % COLORS.length];
        var verse = null;
        for (var j = 0; j < VERSES.length; j++) { if (VERSES[j].ref.toLowerCase().indexOf(b.en.toLowerCase()) !== -1) { verse = VERSES[j]; break; } }
        return React.createElement("div", { key:i, style:{ background:col, padding:"14px 12px", minHeight:90, display:"flex", flexDirection:"column", justifyContent:"space-between" } },
          React.createElement("div", null,
            React.createElement("div", { style:{ fontSize:12, color:"#fff", fontWeight:700, lineHeight:1.3 } }, b.en),
            React.createElement("div", { style:{ fontSize:9, color:"rgba(255,255,255,0.6)" } }, b.ch + " chapters")
          ),
          verse ? React.createElement("div", { style:{ display:"flex", gap:3, marginTop:8 } },
            React.createElement("button", { onClick:function(){ props.onRead(verse); },  style:{ flex:1, background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", padding:"4px 0", fontSize:8, fontWeight:700, cursor:"pointer" } }, "READ"),
            React.createElement("button", { onClick:function(){ props.onAudio(verse); }, style:{ flex:1, background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", padding:"4px 0", fontSize:8, fontWeight:700, cursor:"pointer" } }, "AUDIO")
          ) : null
        );
      })
    )
  );
}

// ── All Verses ────────────────────────────────────────────────────
function VersesView(props) {
  var dark = props.dark; var favIds = props.favIds;
  var qs = React.useState(""); var q = qs[0]; var setQ = qs[1];
  var bg = dark ? "#111" : "#f0f0f0";
  var fg = dark ? "#fff" : "#111";
  var shown = q.trim()
    ? VERSES.filter(function(v){ return v.en.toLowerCase().indexOf(q.toLowerCase()) !== -1 || v.ref.toLowerCase().indexOf(q.toLowerCase()) !== -1; })
    : VERSES;

  return React.createElement("div", { style:{ background:bg, minHeight:"100vh", paddingBottom:80 } },
    React.createElement(Ad, null),
    React.createElement("div", { style:{ background:"#FF8C00", padding:"12px 16px", marginBottom:2 } },
      React.createElement("div", { style:{ color:"#fff", fontSize:13, fontWeight:700, letterSpacing:2 } }, "ALL VERSES - " + VERSES.length + " total")
    ),
    React.createElement("input", { value:q, onChange:function(e){ setQ(e.target.value); }, placeholder:"Search...", style:{ width:"100%", background:dark?"#2a2a2a":"#fff", border:"none", borderBottom:"2px solid #FF8C00", padding:"12px 16px", color:fg, fontSize:13, outline:"none", boxSizing:"border-box" } }),
    shown.map(function(v, i) {
      return React.createElement("div", { key:i },
        React.createElement(VerseCard, { verse:v, dark:dark, favIds:favIds, onFav:props.onFav, onRead:props.onRead, onAudio:props.onAudio }),
        i === 3 ? React.createElement(Ad, null) : null
      );
    })
  );
}

// ── Saved ─────────────────────────────────────────────────────────
function SavedView(props) {
  var dark = props.dark; var favIds = props.favIds;
  var saved = VERSES.filter(function(v){ return favIds.indexOf(v.id) !== -1; });
  var bg = dark ? "#111" : "#f0f0f0";

  return React.createElement("div", { style:{ background:bg, minHeight:"100vh", paddingBottom:80 } },
    React.createElement("div", { style:{ background:"#E81123", padding:"12px 16px", marginBottom:2 } },
      React.createElement("div", { style:{ color:"#fff", fontSize:13, fontWeight:700, letterSpacing:2 } }, "SAVED VERSES - " + saved.length)
    ),
    saved.length === 0
      ? React.createElement("div", { style:{ textAlign:"center", padding:"60px 20px", color:dark?"rgba(255,255,255,0.25)":"rgba(0,0,0,0.25)", fontSize:11 } }, "No saved verses yet. Tap SAVE on any verse.")
      : saved.map(function(v, i) { return React.createElement(VerseCard, { key:i, verse:v, dark:dark, favIds:favIds, onFav:props.onFav, onRead:props.onRead, onAudio:props.onAudio }); }),
    React.createElement(Ad, null)
  );
}

// ── useAudio hook ─────────────────────────────────────────────────
function useAudio() {
  var s1 = React.useState(false); var speaking = s1[0]; var setSpeaking = s1[1];
  var s2 = React.useState(false); var paused   = s2[0]; var setPaused   = s2[1];
  var s3 = React.useState([]);    var voices   = s3[0]; var setVoices   = s3[1];

  React.useEffect(function() {
    if (!TTS_OK) return;
    function load() { setVoices(window.speechSynthesis.getVoices()); }
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return function() { window.speechSynthesis.cancel(); };
  }, []);

  var speak = React.useCallback(function(text, lang) {
    if (!TTS_OK) return;
    if (!lang) lang = "en-US";
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = lang; u.rate = 0.85; u.pitch = 1;
    var px = lang.split("-")[0];
    for (var i = 0; i < voices.length; i++) { if (voices[i].lang.indexOf(px) === 0) { u.voice = voices[i]; break; } }
    u.onstart = function() { setSpeaking(true);  setPaused(false); };
    u.onend   = function() { setSpeaking(false); setPaused(false); };
    u.onerror = function() { setSpeaking(false); setPaused(false); };
    window.speechSynthesis.speak(u);
  }, [voices]);

  function pause()  { if (TTS_OK) window.speechSynthesis.pause();  setPaused(true);  }
  function resume() { if (TTS_OK) window.speechSynthesis.resume(); setPaused(false); }
  function stop()   { if (TTS_OK) window.speechSynthesis.cancel(); setSpeaking(false); setPaused(false); }

  return { speak:speak, pause:pause, resume:resume, stop:stop, speaking:speaking, paused:paused };
}

// ════════════════════════════════════════════════════════════════════
//  MAIN APP — default export at bottom so React can find it
// ════════════════════════════════════════════════════════════════════
function App() {
  var t1 = React.useState("home"); var tab        = t1[0]; var setTab        = t1[1];
  var t2 = React.useState(true);  var dark        = t2[0]; var setDark        = t2[1];
  var t3 = React.useState(null);  var readVerse   = t3[0]; var setReadVerse   = t3[1];
  var t4 = React.useState(null);  var audioVerse  = t4[0]; var setAudioVerse  = t4[1];
  var t5 = React.useState([]);    var favIds      = t5[0]; var setFavIds      = t5[1];

  var audio = useAudio();

  function toggleFav(id) {
    setFavIds(function(p) {
      return p.indexOf(id) !== -1 ? p.filter(function(x){ return x !== id; }) : p.concat([id]);
    });
  }
  function openRead(v)  { setReadVerse(v);  setAudioVerse(null); }
  function openAudio(v) { setAudioVerse(v); setReadVerse(null);  }

  var NAV = [
    { id:"home",   label:"Home"   },
    { id:"verses", label:"Verses" },
    { id:"ai",     label:"Search" },
    { id:"books",  label:"Books"  },
    { id:"fav",    label:"Saved"  }
  ];

  return React.createElement("div", { style:{ background: dark ? "#111" : "#f0f0f0", minHeight:"100vh" } },
    React.createElement("style", null, "* { box-sizing:border-box; margin:0; padding:0; } ::-webkit-scrollbar { display:none; } input::placeholder { opacity:0.35; } button:active { opacity:0.75; }"),

    // Reading Mode overlay
    readVerse ? React.createElement(ReadingMode, { verse:readVerse, dark:dark, audio:audio, onClose:function(){ setReadVerse(null); } }) : null,

    // Audio bar overlay
    audioVerse && !readVerse ? React.createElement(AudioBar, { verse:audioVerse, audio:audio, onClose:function(){ audio.stop(); setAudioVerse(null); } }) : null,

    // Header
    React.createElement("div", { style:{ background:"#000", padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, borderBottom:"2px solid #0078D7" } },
      React.createElement("div", { style:{ display:"flex", alignItems:"center", gap:10 } },
        React.createElement("div", { style:{ width:32, height:32, background:"#0078D7", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:16 } }, "+"),
        React.createElement("div", null,
          React.createElement("div", { style:{ color:"#fff", fontSize:12, letterSpacing:2, fontWeight:700 } }, "VEDA VACHANAM"),
          React.createElement("div", { style:{ color:"rgba(255,255,255,0.35)", fontSize:8, letterSpacing:2 } }, "OFFLINE BIBLE - AUDIO - AI SEARCH")
        )
      ),
      React.createElement("button", { onClick:function(){ setDark(function(d){ return !d; }); }, style:{ background:"#0078D7", border:"none", color:"#fff", padding:"5px 10px", fontSize:10, cursor:"pointer", fontWeight:700 } },
        dark ? "LIGHT" : "DARK"
      )
    ),

    // Screen content
    React.createElement("div", { key:tab },
      tab === "home"   ? React.createElement(HomeView,   { dark:dark, favIds:favIds, onFav:toggleFav, onRead:openRead, onAudio:openAudio, onNav:setTab }) : null,
      tab === "verses" ? React.createElement(VersesView, { dark:dark, favIds:favIds, onFav:toggleFav, onRead:openRead, onAudio:openAudio }) : null,
      tab === "ai"     ? React.createElement(SearchView, { dark:dark, favIds:favIds, onFav:toggleFav, onRead:openRead, onAudio:openAudio }) : null,
      tab === "books"  ? React.createElement(BooksView,  { dark:dark, onRead:openRead, onAudio:openAudio }) : null,
      tab === "fav"    ? React.createElement(SavedView,  { dark:dark, favIds:favIds, onFav:toggleFav, onRead:openRead, onAudio:openAudio }) : null
    ),

    // Bottom nav
    React.createElement("div", { style:{ position:"fixed", bottom:0, left:0, right:0, background: dark ? "#000" : "#fff", borderTop:"2px solid #0078D7", display:"flex", zIndex:100 } },
      NAV.map(function(n) {
        return React.createElement("button", { key:n.id, onClick:function(){ setTab(n.id); }, style:{ flex:1, border:"none", background: tab === n.id ? "#0078D7" : "transparent", color: tab === n.id ? "#fff" : dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", padding:"10px 4px", cursor:"pointer" } },
          React.createElement("span", { style:{ fontSize:8, fontWeight:700, letterSpacing:0.5 } }, n.label)
        );
      })
    )
  );
}

// ── THIS LINE IS CRITICAL — must be last line of file ─────────────
module.exports = App;
module.exports.default = App;
export default App;
