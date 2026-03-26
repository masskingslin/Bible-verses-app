# வேத வசனம் Holy Bible — App Architecture v6.0

## Complete Project Structure

```
holyapp/                                 ← GitHub repository root
│
├── .github/
│   └── workflows/
│       └── build.yml                    ← Auto-builds APK on every push
│
├── android-icons/                       ← YOUR LOGO in all sizes
│   ├── mipmap-mdpi/
│   │   ├── ic_launcher.png              ← 48×48  (normal screens)
│   │   └── ic_launcher_round.png        ← 48×48  (round)
│   ├── mipmap-hdpi/
│   │   ├── ic_launcher.png              ← 72×72
│   │   └── ic_launcher_round.png
│   ├── mipmap-xhdpi/
│   │   ├── ic_launcher.png              ← 96×96
│   │   └── ic_launcher_round.png
│   ├── mipmap-xxhdpi/
│   │   ├── ic_launcher.png              ← 144×144  (most phones)
│   │   └── ic_launcher_round.png
│   ├── mipmap-xxxhdpi/
│   │   ├── ic_launcher.png              ← 192×192  (high-end phones)
│   │   └── ic_launcher_round.png
│   └── playstore_icon.png               ← 512×512 for Play Store upload
│
├── public/                              ← Complete web app (NO build step)
│   ├── index.html                       ← Main app (7 tabs, all features)
│   ├── characters.js                    ← 11 Bible character stories
│   ├── kids_stories.js                  ← 15 children's Bible stories
│   ├── songs.js                         ← 55+ Tamil Christian songs
│   ├── manifest.json                    ← PWA manifest
│   └── data/
│       ├── bd_a.js                      ← Genesis–Ruth       (7,213 verses)
│       ├── bd_b.js                      ← 1Sam–Job           (6,727 verses)
│       ├── bd_c.js                      ← Psalms             (2,461 verses)
│       ├── bd_d.js                      ← Proverbs–Isaiah    (2,546 verses)
│       ├── bd_e.js                      ← Jeremiah–Malachi   (4,198 verses)
│       └── bd_f.js                      ← Matthew–Revelation (7,957 verses)
│                                          TOTAL: 31,102 Tamil + English pairs
│
├── capacitor.config.json                ← App ID, name, webDir
└── package.json                         ← Only Capacitor (no React/build)
```

---

## Build Pipeline

```
You push code to GitHub
        │
        ▼
GitHub Actions runs build.yml
        │
        ├─ npm install          (Capacitor packages only)
        ├─ npx cap add android  (creates Android project)
        ├─ npx cap sync android (copies public/ → Android assets)
        ├─ COPY ICONS           (android-icons/ → mipmap folders)  ← KEY FIX
        └─ ./gradlew assembleDebug
                │
                ▼
        HolyBible-APK-XXX.zip
        (download from Actions tab)
```

---

## Icon Architecture — Why Previous Icon Didn't Fit

```
WRONG (before):  Only one icon file → Android picks wrong size
                 → blurry or wrong on different phones

CORRECT (now):   5 density-specific sizes → Android picks exact right one

Phone type          Density      Icon size   Your file
─────────────────── ──────────── ─────────── ────────────────────────────
Old/Budget phone    mdpi         48 × 48     mipmap-mdpi/ic_launcher.png
Normal phone        hdpi         72 × 72     mipmap-hdpi/ic_launcher.png
Modern phone        xhdpi        96 × 96     mipmap-xhdpi/ic_launcher.png
High-end phone      xxhdpi      144 × 144   mipmap-xxhdpi/ic_launcher.png
Flagship phone      xxxhdpi     192 × 192   mipmap-xxxhdpi/ic_launcher.png
Play Store listing  —           512 × 512   playstore_icon.png
```

---

## App Data Architecture

```
Bible Data Loading (WHY 6 files instead of 1):

  PROBLEM: 16MB single JSON → fetch() fails silently in Android WebView
  SOLUTION: 6 JS files loaded via <script> tags (no fetch, no size limit)

  <script src="data/bd_a.js">  → sets global var BD_A = [ [bi,ch,v,ta,en], ... ]
  <script src="data/bd_b.js">  → sets global var BD_B = [ ... ]
  ...
  <script src="data/bd_f.js">  → sets global var BD_F = [ ... ]

  App startup:
    BD.build() → merges BD_A+BD_B+BD_C+BD_D+BD_E+BD_F
               → builds lookup maps: _map{bi_ch_v → verse}, _bb{bookName → [verses]}
               → result: 31,102 verse objects in memory
```

---

## 7 App Screens

```
HOME (⊞)
  ├── Live clock tile
  ├── Daily verse tile (Tamil + English, with Audio/Read/Chapter buttons)
  └── Quick tiles → AI Search, Characters, Books, Saved

VERSES (☰)
  ├── Language toggle: தமிழ் | English | Both
  ├── Text search (Tamil + English)
  └── Paginated (30 per page across 31,102 verses)

SEARCH (✦)  — AI Verse Finder
  ├── Tamil + English keyword search
  ├── 24 bilingual topic chips
  └── Scores results by relevance

BOOKS (📖)
  ├── 66 books grid (OT / NT filter)
  └── Chapter Reader (TA | EN | BI modes + 🔊 Hear)

STORIES (📚)  — Kids Bible Stories
  ├── 15 stories (OT + NT filter)
  ├── Each story: Key Verse + Full Story + Lessons
  └── 🔊 Hear in Tamil / 🔊 Hear in English

SONGS (🎵)  — Tamil Christian Songs
  ├── Search (Tamil + English)
  ├── 9 categories accordion list
  ├── 55+ songs with lyrics + chorus
  └── 🔊 Hear button (TTS)

SAVED (♥)
  └── All bookmarked verses
```

---

## Audio Engine Architecture

```
Web Speech API (TTS) — Fixed for Android

Problem:  Android WebView won't play TTS until a "warm-up" speak is called
Fix:      _warmUp() called on first AU.open()

Flow:
  User taps 🔊 button
       │
       ▼
  AU.open(verse)
       │
       ├── _warmUp()  ← dummy speak+cancel to initialize Android TTS
       ├── Load voices (retried at 800ms, 2000ms, 4000ms for Android lazy loading)
       ├── Show audio panel
       └── User taps ▶ PLAY
               │
               ├── Tamil: lang='ta-IN', finds ta-IN voice
               └── English: lang='en-US', finds en-US voice

Tamil TTS Requirement:
  Android: Play Store → Google Text-to-Speech → Settings → Add Tamil language
```

---

## State Management

```
localStorage key: 'vv_v9'
Stored:
  - theme: 'dark' | 'light'
  - lang:  'both' | 'ta' | 'en'
  - saved: [verse_id, verse_id, ...]
  - fs:    font size (14–30px)
```

---

## capacitor.config.json

```json
{
  "appId":   "com.vedavachanam.holybible",
  "appName": "வேத வசனம் Bible",
  "webDir":  "public",
  "android": {
    "minWebViewVersion": 60,
    "backgroundColor": "#080810"
  }
}
```

---

## How to Push & Get APK

```bash
# 1. Upload this ZIP to GitHub (unzip first, push all files)
git init
git add .
git commit -m "Holy Bible v6 with icons"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main

# 2. GitHub Actions runs automatically
#    Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/actions

# 3. Click the latest workflow run → scroll down → Artifacts
#    Download: HolyBible-APK-XX.zip → extract → install app-debug.apk

# 4. For Play Store (release build):
#    Add 4 Secrets in GitHub repo Settings → Secrets:
#      KEYSTORE_BASE64  (your keystore file encoded as base64)
#      KEY_ALIAS
#      KEY_PASSWORD
#      STORE_PASSWORD
#    Then run workflow with build_type = "release"
```
