/* ================================================================
   TTS_ENGINE.js — Web Speech API Audio Engine
   Replaces broken inbuilt TTS for web version
   Supports Tamil + English · Diagnostics & Test Panel
================================================================ */

var TTSEngine = (function () {
  'use strict';

  /* ── State ─────────────────────────────────────────────── */
  var _synth       = window.speechSynthesis || null;
  var _voices      = [];
  var _currentUtter = null;
  var _queue       = [];
  var _isPlaying   = false;
  var _settings    = {
    lang_ta : 'ta-IN',
    lang_en : 'en-IN',
    rate    : 0.85,
    pitch   : 1.0,
    volume  : 1.0,
    prefer  : 'ta'   // 'ta' | 'en' | 'bi'
  };
  var _callbacks   = { onStart: null, onEnd: null, onError: null, onBoundary: null };

  /* ── Init ───────────────────────────────────────────────── */
  function init (opts) {
    if (!_synth) { console.warn('TTS: speechSynthesis not supported'); return false; }
    if (opts) Object.assign(_settings, opts);
    _loadVoices();
    if (_synth.onvoiceschanged !== undefined) {
      _synth.onvoiceschanged = _loadVoices;
    }
    return true;
  }

  function _loadVoices () {
    _voices = _synth ? _synth.getVoices() : [];
  }

  /* ── Voice helpers ──────────────────────────────────────── */
  function _pickVoice (lang) {
    if (!_voices.length) _loadVoices();
    // exact match
    var v = _voices.find(function (x) { return x.lang === lang; });
    if (v) return v;
    // prefix match  e.g. "ta" in "ta-IN"
    var prefix = lang.split('-')[0];
    v = _voices.find(function (x) { return x.lang.startsWith(prefix); });
    return v || null;
  }

  function getAvailableVoices (lang) {
    if (!_voices.length) _loadVoices();
    var prefix = lang ? lang.split('-')[0] : '';
    return prefix
      ? _voices.filter(function (v) { return v.lang.startsWith(prefix); })
      : _voices.slice();
  }

  function hasTamilVoice () {
    return !!_pickVoice(_settings.lang_ta);
  }

  /* ── Speak ──────────────────────────────────────────────── */
  function speak (text, lang, onEnd) {
    if (!_synth) return;
    stop();
    if (!text || !text.trim()) return;

    var utter = new SpeechSynthesisUtterance(text);
    utter.lang   = lang || _settings.lang_ta;
    utter.rate   = _settings.rate;
    utter.pitch  = _settings.pitch;
    utter.volume = _settings.volume;

    var voice = _pickVoice(utter.lang);
    if (voice) utter.voice = voice;

    utter.onstart = function () {
      _isPlaying = true;
      if (_callbacks.onStart) _callbacks.onStart();
    };
    utter.onend = function () {
      _isPlaying = false;
      _currentUtter = null;
      if (onEnd) onEnd();
      if (_callbacks.onEnd) _callbacks.onEnd();
    };
    utter.onerror = function (e) {
      _isPlaying = false;
      _currentUtter = null;
      if (_callbacks.onError) _callbacks.onError(e);
    };
    if (_callbacks.onBoundary) {
      utter.onboundary = _callbacks.onBoundary;
    }

    _currentUtter = utter;
    _synth.speak(utter);
  }

  /* Split long text into sentence-sized chunks to avoid browser cut-off */
  function speakLong (text, lang, onEnd) {
    if (!_synth) return;
    stop();
    var sentences = _splitSentences(text);
    var idx = 0;
    function next () {
      if (idx >= sentences.length) { if (onEnd) onEnd(); return; }
      speak(sentences[idx++], lang, next);
    }
    next();
  }

  function _splitSentences (text) {
    // split on . ! ? and newlines; keep chunks ≤ 200 chars
    var raw = text.split(/(?<=[.!?\n])\s+|[\n]+/).filter(function (s) { return s.trim(); });
    var chunks = [];
    raw.forEach(function (s) {
      if (s.length <= 200) { chunks.push(s); return; }
      // break at commas if too long
      var sub = s.split(/,\s*/);
      var buf = '';
      sub.forEach(function (p) {
        if ((buf + p).length > 200 && buf) { chunks.push(buf.trim()); buf = ''; }
        buf += (buf ? ', ' : '') + p;
      });
      if (buf) chunks.push(buf.trim());
    });
    return chunks;
  }

  /* ── Controls ───────────────────────────────────────────── */
  function pause  () { if (_synth && _isPlaying) _synth.pause();  }
  function resume () { if (_synth) _synth.resume(); }
  function stop   () { if (_synth) { _synth.cancel(); _isPlaying = false; _currentUtter = null; } }

  function isSupported () { return !!_synth; }
  function isPlaying   () { return _isPlaying; }

  function setRate   (v) { _settings.rate   = parseFloat(v) || 0.85; }
  function setPitch  (v) { _settings.pitch  = parseFloat(v) || 1.0;  }
  function setVolume (v) { _settings.volume = parseFloat(v) || 1.0;  }
  function on (evt, fn) { _callbacks[evt] = fn; }

  /* ── Diagnostics ────────────────────────────────────────── */
  function getDiagnostics () {
    _loadVoices();
    var taVoices = getAvailableVoices('ta');
    var enVoices = getAvailableVoices('en');
    return {
      supported      : !!_synth,
      totalVoices    : _voices.length,
      tamilVoices    : taVoices.map(function (v) { return v.name + ' (' + v.lang + ')'; }),
      englishVoices  : enVoices.map(function (v) { return v.name + ' (' + v.lang + ')'; }),
      hasTamil       : taVoices.length > 0,
      settings       : Object.assign({}, _settings),
      browserInfo    : navigator.userAgent.substring(0, 80)
    };
  }

  /* ── Settings Panel (injects into DOM) ──────────────────── */
  function renderSettingsPanel (containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    _loadVoices();

    var taVoices = getAvailableVoices('ta');
    var enVoices = getAvailableVoices('en');
    var diag = getDiagnostics();

    var taOptions = taVoices.length
      ? taVoices.map(function (v) { return '<option value="' + v.lang + '">' + v.name + ' (' + v.lang + ')</option>'; }).join('')
      : '<option value="">— No Tamil voice found —</option>';

    container.innerHTML = [
      '<div class="tts-panel">',
      '<h3>⚙ TTS SETTINGS · ஒலி அமைப்புகள்</h3>',

      '<div class="tts-status ' + (diag.supported ? 'ok' : 'err') + '">',
      diag.supported
        ? '✅ Web Speech API supported · ' + diag.totalVoices + ' voices available'
        : '❌ Web Speech API not supported in this browser',
      '</div>',

      '<div class="tts-row">',
      '<label>🇮🇳 Tamil Voice</label>',
      '<select id="tts-ta-voice">', taOptions, '</select>',
      '</div>',

      '<div class="tts-row">',
      '<label>⏩ Speed (rate)</label>',
      '<input type="range" id="tts-rate" min="0.5" max="1.5" step="0.05" value="' + _settings.rate + '">',
      '<span id="tts-rate-val">' + _settings.rate + '</span>',
      '</div>',

      '<div class="tts-row">',
      '<label>🎵 Pitch</label>',
      '<input type="range" id="tts-pitch" min="0.5" max="2.0" step="0.1" value="' + _settings.pitch + '">',
      '<span id="tts-pitch-val">' + _settings.pitch + '</span>',
      '</div>',

      '<div class="tts-row">',
      '<label>🔊 Volume</label>',
      '<input type="range" id="tts-vol" min="0" max="1" step="0.05" value="' + _settings.volume + '">',
      '<span id="tts-vol-val">' + _settings.volume + '</span>',
      '</div>',

      '<div class="tts-test">',
      '<button id="tts-test-ta">▶ Test Tamil</button>',
      '<button id="tts-test-en">▶ Test English</button>',
      '<button id="tts-stop-btn">⏹ Stop</button>',
      '</div>',

      '<div id="tts-test-result" class="tts-test-result"></div>',

      '<details class="tts-diag">',
      '<summary>🔍 Diagnostics</summary>',
      '<pre>' + JSON.stringify(diag, null, 2) + '</pre>',
      '</details>',

      '</div>'
    ].join('');

    /* bind events */
    var rateEl  = document.getElementById('tts-rate');
    var pitchEl = document.getElementById('tts-pitch');
    var volEl   = document.getElementById('tts-vol');

    rateEl.oninput  = function () { setRate(this.value);   document.getElementById('tts-rate-val').textContent  = this.value; };
    pitchEl.oninput = function () { setPitch(this.value);  document.getElementById('tts-pitch-val').textContent = this.value; };
    volEl.oninput   = function () { setVolume(this.value); document.getElementById('tts-vol-val').textContent   = this.value; };

    document.getElementById('tts-test-ta').onclick = function () {
      var res = document.getElementById('tts-test-result');
      res.textContent = '🔊 Speaking Tamil…';
      speak('யேசு என்னை நேசிக்கிறார். ஆண்டவர் நல்லவர்.', 'ta-IN', function () {
        res.textContent = hasTamilVoice() ? '✅ Tamil TTS working!' : '⚠ Used fallback voice — no native Tamil voice installed.';
      });
    };

    document.getElementById('tts-test-en').onclick = function () {
      var res = document.getElementById('tts-test-result');
      res.textContent = '🔊 Speaking English…';
      speak('Jesus loves me, this I know. God is good all the time.', 'en-IN', function () {
        res.textContent = '✅ English TTS working!';
      });
    };

    document.getElementById('tts-stop-btn').onclick = stop;
  }

  /* ── Public API ─────────────────────────────────────────── */
  return {
    init              : init,
    speak             : speak,
    speakLong         : speakLong,
    pause             : pause,
    resume            : resume,
    stop              : stop,
    isSupported       : isSupported,
    isPlaying         : isPlaying,
    setRate           : setRate,
    setPitch          : setPitch,
    setVolume         : setVolume,
    on                : on,
    hasTamilVoice     : hasTamilVoice,
    getAvailableVoices: getAvailableVoices,
    getDiagnostics    : getDiagnostics,
    renderSettingsPanel: renderSettingsPanel
  };
})();

/* ── Auto-init on load ──────────────────────────────────── */
(function () {
  function tryInit () {
    TTSEngine.init();
    /* render settings panel if container exists */
    if (document.getElementById('tts-settings-container')) {
      TTSEngine.renderSettingsPanel('tts-settings-container');
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInit);
  } else {
    tryInit();
  }
})();
