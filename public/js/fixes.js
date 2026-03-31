// fixes.js — All App Fixes
// Bookmarks, Font Size, Dark/Light Mode, Offline Fallback,
// Daily Verse Notification, Ads on open only
// Place in: www/js/fixes.js

// ════════════════════════════════════════════════════════════
// 1. BOOKMARKS — Save & load verse bookmarks
// ════════════════════════════════════════════════════════════
const Bookmarks = (() => {
  const KEY = 'holybible_bookmarks';

  function getAll() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch { return []; }
  }

  function save(verse) {
    // verse = { ref, text_en, text_ta, book, chapter, verse_num }
    const all = getAll();
    const exists = all.find(b => b.ref === verse.ref);
    if (exists) return false; // already saved
    all.unshift({ ...verse, savedAt: new Date().toISOString() });
    localStorage.setItem(KEY, JSON.stringify(all.slice(0, 200))); // max 200
    return true;
  }

  function remove(ref) {
    const all = getAll().filter(b => b.ref !== ref);
    localStorage.setItem(KEY, JSON.stringify(all));
  }

  function isBookmarked(ref) {
    return getAll().some(b => b.ref === ref);
  }

  function clear() {
    localStorage.removeItem(KEY);
  }

  function renderScreen() {
    const bookmarks = getAll();
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="screen">
        <div class="songs-header">
          <button class="back-btn" onclick="showHome()">&#8249;</button>
          <h2 class="header-title">🔖 Bookmarks</h2>
          ${bookmarks.length > 0 ? `<button class="clear-btn" onclick="Bookmarks.clearAll()">Clear All</button>` : ''}
        </div>
        <div class="bookmarks-list">
          ${bookmarks.length === 0
            ? `<div class="empty-state">
                <div style="font-size:3rem">🔖</div>
                <p>No bookmarks yet.</p>
                <p style="opacity:.6">Tap the 🔖 icon on any verse to save it here.</p>
               </div>`
            : bookmarks.map(b => `
                <div class="bookmark-card">
                  <div class="bookmark-ref">${b.ref}</div>
                  <div class="bookmark-ta">${b.text_ta}</div>
                  <div class="bookmark-en">${b.text_en}</div>
                  <div class="bookmark-actions">
                    <button class="bm-btn" onclick="Bookmarks.share('${b.ref}', \`${b.text_en.replace(/`/g,"'")}\`)">📤 Share</button>
                    <button class="bm-btn danger" onclick="Bookmarks.remove('${b.ref}'); Bookmarks.renderScreen()">🗑 Remove</button>
                  </div>
                </div>
              `).join('')
          }
        </div>
      </div>
    `;
  }

  function clearAll() {
    if (confirm('Clear all bookmarks?')) {
      clear();
      renderScreen();
    }
  }

  async function share(ref, text) {
    if (navigator.share) {
      await navigator.share({ title: ref, text: `${ref}\n\n${text}\n\n— Holy Bible App` });
    } else {
      await navigator.clipboard.writeText(`${ref}\n${text}`);
      showToast('📋 Copied to clipboard!');
    }
  }

  return { getAll, save, remove, isBookmarked, clear, renderScreen, clearAll, share };
})();


// ════════════════════════════════════════════════════════════
// 2. FONT SIZE — Adjustable font for all Bible text
// ════════════════════════════════════════════════════════════
const FontSize = (() => {
  const KEY = 'holybible_fontsize';
  const MIN = 13, MAX = 26, DEFAULT = 16;
  let current = DEFAULT;

  function init() {
    current = parseInt(localStorage.getItem(KEY) || DEFAULT);
    apply();
  }

  function apply() {
    document.documentElement.style.setProperty('--verse-font-size', current + 'px');
    document.documentElement.style.setProperty('--verse-ta-font-size', (current + 2) + 'px');
  }

  function increase() {
    if (current < MAX) { current++; save(); apply(); updateDisplay(); }
  }

  function decrease() {
    if (current > MIN) { current--; save(); apply(); updateDisplay(); }
  }

  function reset() {
    current = DEFAULT;
    save();
    apply();
    updateDisplay();
  }

  function save() {
    localStorage.setItem(KEY, current);
  }

  function updateDisplay() {
    const el = document.getElementById('fontSizeDisplay');
    if (el) el.textContent = current + 'px';
  }

  function renderControl() {
    return `
      <div class="settings-row">
        <span class="settings-label">📝 Font Size</span>
        <div class="font-size-controls">
          <button class="fs-btn" onclick="FontSize.decrease()">A−</button>
          <span id="fontSizeDisplay" class="fs-display">${current}px</span>
          <button class="fs-btn" onclick="FontSize.increase()">A+</button>
          <button class="fs-btn fs-reset" onclick="FontSize.reset()">Reset</button>
        </div>
      </div>
    `;
  }

  return { init, increase, decrease, reset, renderControl };
})();


// ════════════════════════════════════════════════════════════
// 3. DARK / LIGHT MODE
// ════════════════════════════════════════════════════════════
const ThemeManager = (() => {
  const KEY = 'holybible_theme';
  let isDark = true; // default dark

  function init() {
    isDark = (localStorage.getItem(KEY) || 'dark') === 'dark';
    apply();
  }

  function apply() {
    document.body.classList.toggle('light-mode', !isDark);
    document.body.classList.toggle('dark-mode', isDark);
    const btn = document.getElementById('themeToggleBtn');
    if (btn) btn.innerHTML = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  }

  function toggle() {
    isDark = !isDark;
    localStorage.setItem(KEY, isDark ? 'dark' : 'light');
    apply();
    showToast(isDark ? '🌙 Dark mode ON' : '☀️ Light mode ON');
  }

  function renderToggle() {
    return `
      <div class="settings-row">
        <span class="settings-label">🎨 Theme</span>
        <button id="themeToggleBtn" class="theme-toggle-btn" onclick="ThemeManager.toggle()">
          ${isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    `;
  }

  return { init, toggle, renderToggle };
})();


// ════════════════════════════════════════════════════════════
// 4. OFFLINE FALLBACK — Use bundled data if API unavailable
// ════════════════════════════════════════════════════════════
const OfflineFallback = (() => {
  let isOnline = true;
  const CACHE_KEY_PREFIX = 'hb_cache_';

  async function checkServer(url) {
    try {
      const res = await fetch(url + '/', { signal: AbortSignal.timeout(4000) });
      isOnline = res.ok;
    } catch {
      isOnline = false;
    }
    updateStatusBar();
    return isOnline;
  }

  function updateStatusBar() {
    const bar = document.getElementById('offlineBar');
    if (bar) {
      bar.style.display = isOnline ? 'none' : 'flex';
    }
  }

  // Cache API responses for offline
  async function fetchWithCache(url) {
    const cacheKey = CACHE_KEY_PREFIX + btoa(url).slice(0, 50);
    if (isOnline) {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
        const data = await res.json();
        try { localStorage.setItem(cacheKey, JSON.stringify({ data, ts: Date.now() })); } catch {}
        return { data, source: 'network' };
      } catch {
        isOnline = false;
        updateStatusBar();
      }
    }
    // Try cache
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey));
      if (cached) return { data: cached.data, source: 'cache' };
    } catch {}
    // Try bundled data
    return { data: getBundledFallback(url), source: 'bundled' };
  }

  // Minimal bundled fallback — key verses
  function getBundledFallback(url) {
    const FALLBACK_VERSES = [
      { verse_num: 16, text_en: "For God so loved the world...", text_ta: "தேவன் உலகத்தில் அவ்வளவு அன்பாயிருந்தார்..." },
      { verse_num: 28, text_en: "Come to me, all you who are weary...", text_ta: "ப수்மையடைந்தவர்களே என்னிடத்தில் வாருங்கள்..." },
    ];
    return { verses: FALLBACK_VERSES, source: 'bundled' };
  }

  function renderOfflineBar() {
    return `
      <div class="offline-bar" id="offlineBar" style="display:none">
        <span>📶 Offline mode — showing cached data</span>
        <button onclick="OfflineFallback.retry()">Retry</button>
      </div>
    `;
  }

  async function retry() {
    showToast('🔄 Reconnecting...');
    const alive = await checkServer(window.BIBLE_API_URL || 'http://localhost:5050');
    showToast(alive ? '✅ Connected!' : '❌ Still offline');
  }

  return { checkServer, fetchWithCache, renderOfflineBar, retry };
})();


// ════════════════════════════════════════════════════════════
// 5. DAILY VERSE NOTIFICATION
// ════════════════════════════════════════════════════════════
const DailyNotification = (() => {
  const KEY = 'holybible_notif';

  async function requestPermission() {
    if (!('Notification' in window)) {
      showToast('❌ Notifications not supported');
      return false;
    }
    const result = await Notification.requestPermission();
    if (result === 'granted') {
      localStorage.setItem(KEY, 'enabled');
      scheduleDailyVerse();
      showToast('✅ Daily verse notifications enabled!');
      return true;
    }
    showToast('❌ Permission denied');
    return false;
  }

  function scheduleDailyVerse() {
    // Check every hour — notify at 7 AM
    const check = () => {
      const now = new Date();
      const lastNotif = localStorage.getItem('hb_last_notif');
      const today = now.toDateString();
      if (now.getHours() >= 7 && lastNotif !== today) {
        sendDailyVerseNotification();
        localStorage.setItem('hb_last_notif', today);
      }
    };
    check(); // check on load
    setInterval(check, 3600000); // every hour
  }

  async function sendDailyVerseNotification() {
    try {
      // Get today's verse from API or use fallback
      const DAILY_VERSES = [
        { ref: "John 3:16", text: "For God so loved the world...", ta: "தேவன் உலகத்தில் அவ்வளவு அன்பாயிருந்தார்..." },
        { ref: "Phil 4:13", text: "I can do all things through Christ...", ta: "என்னை பலப்படுத்துகிற கிறிஸ்துவினால் எல்லாவற்றையும் செய்யக்கூடும்." },
        { ref: "Psalm 23:1", text: "The Lord is my shepherd...", ta: "கர்த்தர் என் மேய்ப்பர், எனக்கு குறைவில்லை." },
        { ref: "Isaiah 40:31", text: "But those who hope in the Lord will renew their strength.", ta: "கர்த்தரை நம்பிக்கொண்டிருப்பவர்களுக்கோ புதிய பலன் உண்டாகும்." },
        { ref: "Rom 8:28", text: "All things work together for good...", ta: "தேவனிடத்தில் அன்பாயிருக்கிறவர்களுக்கு எல்லாம் நன்மைக்கு ஏதுவாக நடக்கும்." },
      ];
      const verse = DAILY_VERSES[new Date().getDay() % DAILY_VERSES.length];

      if (Notification.permission === 'granted') {
        new Notification('📖 Holy Bible — Daily Verse', {
          body: `${verse.ref}\n${verse.text}`,
          icon: 'icons/icon-192.png',
          badge: 'icons/icon-72.png',
          tag: 'daily-verse',
          renotify: false
        });
      }
    } catch (e) { console.log('Notification error:', e); }
  }

  function isEnabled() {
    return localStorage.getItem(KEY) === 'enabled';
  }

  function disable() {
    localStorage.removeItem(KEY);
    showToast('🔕 Daily verse notifications disabled');
  }

  function renderToggle() {
    const enabled = isEnabled();
    return `
      <div class="settings-row">
        <span class="settings-label">🔔 Daily Verse Notification</span>
        <label class="toggle-switch">
          <input type="checkbox" ${enabled ? 'checked' : ''}
            onchange="DailyNotification.${enabled ? 'disable' : 'requestPermission'}()"/>
          <span class="toggle-slider"></span>
        </label>
      </div>
    `;
  }

  return { requestPermission, scheduleDailyVerse, isEnabled, disable, renderToggle };
})();


// ════════════════════════════════════════════════════════════
// 6. ADS — Show only on app open, not during reading
// ════════════════════════════════════════════════════════════
const AdsManager = (() => {
  const AD_UNIT = 'ca-app-pub-9057426786910647/4989165114';
  let hasShownOpenAd = false;

  async function showAppOpenAd() {
    if (hasShownOpenAd) return; // only once per session
    hasShownOpenAd = true;
    try {
      if (window.admob) {
        // Capacitor AdMob - Interstitial on app open only
        const { AdMob, InterstitialAdPluginEvents } = await import('@capacitor-community/admob');
        await AdMob.prepareInterstitial({ adId: AD_UNIT });
        await AdMob.showInterstitial();
      }
    } catch (e) {
      console.log('Ad not shown:', e.message);
    }
  }

  // Banner only on home screen
  async function showBannerOnHome() {
    try {
      if (window.admob) {
        const { AdMob, BannerAdSize, BannerAdPosition } = await import('@capacitor-community/admob');
        await AdMob.showBanner({
          adId: AD_UNIT,
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
        });
      }
    } catch (e) { }
  }

  async function hideBanner() {
    try {
      if (window.admob) {
        const { AdMob } = await import('@capacitor-community/admob');
        await AdMob.hideBanner();
      }
    } catch (e) { }
  }

  return { showAppOpenAd, showBannerOnHome, hideBanner };
})();


// ════════════════════════════════════════════════════════════
// 7. SETTINGS SCREEN — All controls in one place
// ════════════════════════════════════════════════════════════
function showSettings() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="screen settings-screen">
      <div class="songs-header">
        <button class="back-btn" onclick="showHome()">&#8249;</button>
        <h2 class="header-title">⚙️ Settings</h2>
      </div>
      <div class="settings-body">

        <div class="settings-section-label">DISPLAY</div>
        ${FontSize.renderControl()}
        ${ThemeManager.renderToggle()}

        <div class="settings-section-label">NOTIFICATIONS</div>
        ${DailyNotification.renderToggle()}

        <div class="settings-section-label">LANGUAGE</div>
        <div class="settings-row">
          <span class="settings-label">🌐 Bible Language</span>
          <select class="settings-select" onchange="AppSettings.setLang(this.value)">
            <option value="both" ${AppSettings.getLang()==='both'?'selected':''}>Tamil + English</option>
            <option value="ta" ${AppSettings.getLang()==='ta'?'selected':''}>Tamil Only</option>
            <option value="en" ${AppSettings.getLang()==='en'?'selected':''}>English Only</option>
          </select>
        </div>

        <div class="settings-section-label">ABOUT</div>
        <div class="settings-row" onclick="showAbout()">
          <span class="settings-label">📖 Holy Bible App</span>
          <span class="settings-arrow">›</span>
        </div>
        <div class="settings-row">
          <span class="settings-label">🔖 Bookmarks</span>
          <span class="settings-val">${Bookmarks.getAll().length} saved</span>
        </div>
      </div>
    </div>
  `;
}

// ════════════════════════════════════════════════════════════
// 8. APP SETTINGS store
// ════════════════════════════════════════════════════════════
const AppSettings = (() => {
  const KEY = 'holybible_settings';
  let settings = { lang: 'both' };

  function load() {
    try { settings = { ...settings, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
    catch {}
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(settings));
  }

  function setLang(val) {
    settings.lang = val;
    save();
    showToast(`✅ Language set to ${val === 'both' ? 'Tamil + English' : val === 'ta' ? 'Tamil' : 'English'}`);
  }

  function getLang() { return settings.lang; }

  return { load, setLang, getLang };
})();


// ════════════════════════════════════════════════════════════
// 9. TOAST helper
// ════════════════════════════════════════════════════════════
function showToast(msg, duration = 2500) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'global-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('toast-show');
  setTimeout(() => toast.classList.remove('toast-show'), duration);
}


// ════════════════════════════════════════════════════════════
// 10. INIT — Call on app start in index.html
// ════════════════════════════════════════════════════════════
function initAllFixes() {
  AppSettings.load();
  FontSize.init();
  ThemeManager.init();

  // Show app-open ad (once only)
  AdsManager.showAppOpenAd();

  // Schedule daily verse notification if enabled
  if (DailyNotification.isEnabled()) {
    DailyNotification.scheduleDailyVerse();
  }

  // Check server availability
  const API = window.BIBLE_API_URL || 'http://localhost:5050';
  OfflineFallback.checkServer(API);

  console.log('✅ Holy Bible — All fixes initialized');
}
