/* ================================================================
   TTS_ENGINE.js  v4.5 (Enhanced - Unlimited Text & Robust Queue)
   Capacitor Native TTS  (Android/iOS)
   Web Speech API fallback  (Chrome / WebView / Browser)
   Supports Tamil + English · Seamless Long Text · Diagnostics
================================================================ */

var TTSEngine = (function () {
  'use strict';

  var _isPlaying       = false;
  var _isPaused        = false;
  var _activeUtterance = null;  // Prevents JS garbage collection mid-speech
  var _resumeInterval  = null;  // Fixes Chrome/WebView 15-sec timeout bug
  var _currentSessionId = 0;    // Cancels stale queue callbacks on new speak/stop

  var _settings = {
    lang_ta : 'ta-IN',
    lang_en : 'en-IN',
    rate    : 1.0,
    pitch   : 1.0,
    volume  : 1.0
  };

  var _callbacks = { onStart: null, onEnd: null, onError: null };

  /* ── Platform detection ─────────────────────────────────────── */
  function _isCapacitor () {
    try {
      return typeof window.Capacitor !== 'undefined' &&
             typeof window.Capacitor.isNativePlatform === 'function' &&
             window.Capacitor.isNativePlatform();
    } catch (e) { return false; }
  }

  function _capTTS () {
    try {
      var p = window.Capacitor && window.Capacitor.Plugins;
      if (p && p.TextToSpeech) return p.TextToSpeech;
      if (window.CapacitorTextToSpeech && window.CapacitorTextToSpeech.TextToSpeech)
        return window.CapacitorTextToSpeech.TextToSpeech;
      return null;
    } catch (e) { return null; }
  }

  function _hasSpeechSynth () {
    return typeof window.speechSynthesis !== 'undefined';
  }

  function isSupported () {
    if (_isCapacitor()) return !!_capTTS();
    return _hasSpeechSynth();
  }

  /* ── Text Sanitization for Bible / General Text ─────────────── */
  function _sanitizeText (text) {
    if (!text) return '';
    return text
      // Remove verse reference markers like "1:16" or "12:1-3"
      .replace(/\b\d+:\d+(?:-\d+)?\b/g, '')
      // Remove standalone bracketed numbering like, (12)
      .replace(/[\[\(]\s*\d+\s*[\]\)]/g, '')
      // Replace em-dashes, en-dashes, and special symbols with natural pause
      .replace(/[—–_~*#|]/g, ', ')
      // Normalize multiple spaces/newlines
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* ── Deep Text Chunking (No Character Limit) ────────────────── */
  function _splitIntoChunks (text, maxLen) {
    maxLen = maxLen || 180; // Safe threshold for smooth cadence across all engines
    var clean = _sanitizeText(text);
    if (!clean) return [];

    // Split by major sentence terminators (including Tamil/Indic punctuation)
    var sentences = clean.split(/([.!?\n\r]+|[\u0964\u0965]+)/).filter(Boolean);
    var fullSentences = [];

    for (var i = 0; i < sentences.length; i += 2) {
      var s = (sentences[i] || '') + (sentences[i + 1] || '');
      s = s.trim();
      if (s) fullSentences.push(s);
    }
    if (!fullSentences.length) fullSentences = [clean];

    var chunks = [];

    fullSentences.forEach(function (sentence) {
      if (sentence.length <= maxLen) {
        chunks.push(sentence);
        return;
      }

      // If sentence is too long, split by clause boundaries (commas, semicolons, colons)
      var clauses = sentence.split(/([,;:]+)/).filter(Boolean);
      var currentChunk = '';

      for (var j = 0; j < clauses.length; j++) {
        var clause = clauses[j].trim();
        if (!clause) continue;

        if ((currentChunk + ' ' + clause).trim().length <= maxLen) {
          currentChunk = currentChunk ? (currentChunk + ' ' + clause) : clause;
        } else {
          if (currentChunk) chunks.push(currentChunk);

          // If a single clause is still too long, split by words
          if (clause.length > maxLen) {
            var words = clause.split(/\s+/);
            var wordChunk = '';
            words.forEach(function (w) {
              if ((wordChunk + ' ' + w).trim().length <= maxLen) {
                wordChunk = wordChunk ? (wordChunk + ' ' + w) : w;
              } else {
                if (wordChunk) chunks.push(wordChunk);
                wordChunk = w;
              }
            });
            if (wordChunk) currentChunk = wordChunk;
            else currentChunk = '';
          } else {
            currentChunk = clause;
          }
        }
      }
      if (currentChunk) chunks.push(currentChunk);
    });

    return chunks.length ? chunks : [clean];
  }

  /* ── Keep-Alive for Chrome / WebView SpeechSynthesis ────────── */
  function _startKeepAlive () {
    _stopKeepAlive();
    if (!_hasSpeechSynth()) return;
    _resumeInterval = setInterval(function () {
      if (_isPlaying && !_isPaused && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);
  }

  function _stopKeepAlive () {
    if (_resumeInterval) {
      clearInterval(_resumeInterval);
      _resumeInterval = null;
    }
  }

  /* ── Init ───────────────────────────────────────────────────── */
  function init (opts) {
    if (opts) {
      if (opts.rate   !== undefined) _settings.rate   = parseFloat(opts.rate)   || 1.0;
      if (opts.pitch  !== undefined) _settings.pitch  = parseFloat(opts.pitch)  || 1.0;
      if (opts.volume !== undefined) _settings.volume = parseFloat(opts.volume) || 1.0;
      if (opts.lang_ta) _settings.lang_ta = opts.lang_ta;
      if (opts.lang_en) _settings.lang_en = opts.lang_en;
    }
    if (!_isCapacitor() && _hasSpeechSynth()) {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = _loadWebVoices;
      }
      _loadWebVoices();
    }
    return isSupported();
  }

  /* ── Capacitor Native Speak (Sequential Chunk Queue) ────────── */
  function _capSpeakQueue (chunks, lang, sessionId, onEnd) {
    var tts = _capTTS();
    if (!tts) {
      if (_hasSpeechSynth()) {
        _webSpeakQueue(chunks, lang, sessionId, onEnd);
      } else if (onEnd) {
        onEnd();
      }
      return;
    }

    var idx = 0;

    function playNext () {
      if (sessionId !== _currentSessionId) return; // Discard canceled session
      if (idx >= chunks.length) {
        _isPlaying = false;
        _isPaused = false;
        if (onEnd) onEnd();
        if (_callbacks.onEnd) _callbacks.onEnd();
        return;
      }

      var textChunk = chunks[idx++];
      tts.speak({
        text   : textChunk,
        lang   : lang || _settings.lang_ta,
        rate   : _settings.rate,
        pitch  : _settings.pitch,
        volume : _settings.volume
      }).then(function () {
        if (sessionId === _currentSessionId) {
          playNext();
        }
      }).catch(function (err) {
        if (sessionId !== _currentSessionId) return;
        console.warn('Native TTS Chunk Error:', err);
        // Fallback to web speech if plugin fails
        if (_hasSpeechSynth()) {
          _webSpeakQueue(chunks.slice(idx - 1), lang, sessionId, onEnd);
        } else {
          _isPlaying = false;
          _isPaused = false;
          if (_callbacks.onError) _callbacks.onError(err);
          if (onEnd) onEnd();
        }
      });
    }

    var stopProm = (tts.stop && typeof tts.stop === 'function')
      ? tts.stop().catch(function () {})
      : Promise.resolve();

    stopProm.then(function () {
      if (sessionId === _currentSessionId) {
        playNext();
      }
    });
  }

  /* ── Web Speech Voices ──────────────────────────────────────── */
  var _webVoices = [];
  function _loadWebVoices () {
    if (_hasSpeechSynth()) {
      _webVoices = window.speechSynthesis.getVoices() || [];
    }
  }

  function _pickWebVoice (lang) {
    _loadWebVoices();
    var prefix = (lang || '').split('-')[0].toLowerCase();
    var exact = null, approx = null;

    for (var i = 0; i < _webVoices.length; i++) {
      var vLang = (_webVoices[i].lang || '').toLowerCase();
      if (vLang === (lang || '').toLowerCase()) {
        exact = _webVoices[i];
        break;
      }
      if (!approx && vLang.indexOf(prefix) === 0) {
        approx = _webVoices[i];
      }
    }
    return exact || approx || null;
  }

  /* ── Web Speech Speak (Sequential Chunk Queue) ──────────────── */
  function _webSpeakQueue (chunks, lang, sessionId, onEnd) {
    if (!_hasSpeechSynth()) {
      _isPlaying = false;
      if (onEnd) onEnd();
      return;
    }

    try { window.speechSynthesis.cancel(); } catch (e) {}

    var idx = 0;
    _startKeepAlive();

    function playNext () {
      if (sessionId !== _currentSessionId) {
        _stopKeepAlive();
        return;
      }

      if (idx >= chunks.length) {
        _isPlaying = false;
        _isPaused = false;
        _activeUtterance = null;
        _stopKeepAlive();
        if (onEnd) onEnd();
        if (_callbacks.onEnd) _callbacks.onEnd();
        return;
      }

      var textChunk = chunks[idx++];
      var u = new SpeechSynthesisUtterance(textChunk);
      _activeUtterance = u; // Retain reference to prevent Garbage Collection bug

      u.lang   = lang || _settings.lang_ta;
      u.rate   = _settings.rate;
      u.pitch  = _settings.pitch;
      u.volume = _settings.volume;

      var v = _pickWebVoice(u.lang);
      if (v) u.voice = v;

      u.onend = function () {
        if (sessionId === _currentSessionId) {
          playNext();
        }
      };

      u.onerror = function (e) {
        if (sessionId !== _currentSessionId) return;
        console.warn('Web Speech Chunk Error:', e);
        _isPlaying = false;
        _isPaused = false;
        _activeUtterance = null;
        _stopKeepAlive();
        if (_callbacks.onError) _callbacks.onError(e);
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(u);
    }

    playNext();
  }

  /* ── Public Speak Methods ───────────────────────────────────── */
  function speak (text, lang, onEnd) {
    if (!text || !text.trim()) {
      if (onEnd) onEnd();
      return;
    }

    // Stop any currently running speech
    stop();

    var chunks = _splitIntoChunks(text, 180);
    if (!chunks.length) {
      if (onEnd) onEnd();
      return;
    }

    var sessionId = ++_currentSessionId;
    _isPlaying = true;
    _isPaused = false;

    if (_callbacks.onStart) _callbacks.onStart();

    if (_isCapacitor() && _capTTS()) {
      _capSpeakQueue(chunks, lang, sessionId, onEnd);
    } else {
      _webSpeakQueue(chunks, lang, sessionId, onEnd);
    }
  }

  function speakLong (text, lang, onEnd) {
    // Both speak and speakLong now safely handle unlimited text
    speak(text, lang, onEnd);
  }

  /* ── Controls ───────────────────────────────────────────────── */
  function stop () {
    _currentSessionId++; // Invalidate all pending chunk callbacks
    _isPlaying = false;
    _isPaused = false;
    _activeUtterance = null;
    _stopKeepAlive();

    if (_isCapacitor()) {
      var t = _capTTS();
      if (t && typeof t.stop === 'function') {
        t.stop().catch(function () {});
      }
    }
    if (_hasSpeechSynth()) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
  }

  function pause () {
    if (!_isPlaying || _isPaused) return;
    _isPaused = true;

    if (!_isCapacitor() && _hasSpeechSynth()) {
      try { window.speechSynthesis.pause(); } catch (e) {}
    } else {
      stop();
    }
  }

  function resume () {
    if (!_isPlaying || !_isPaused) return;
    _isPaused = false;

    if (!_isCapacitor() && _hasSpeechSynth()) {
      try { window.speechSynthesis.resume(); } catch (e) {}
    }
  }

  function isPlaying () { return _isPlaying; }
  function isPaused ()  { return _isPaused; }
  function setRate (v)   { _settings.rate   = parseFloat(v) || 1.0; }
  function setPitch (v)  { _settings.pitch  = parseFloat(v) || 1.0; }
  function setVolume (v) { _settings.volume = parseFloat(v) || 1.0; }
  function on (evt, fn)  { _callbacks[evt] = fn; }

  function hasTamilVoice () {
    if (_isCapacitor()) return true;
    return !!_pickWebVoice(_settings.lang_ta);
  }

  function getAvailableVoices (lang) {
    if (_isCapacitor()) return [];
    _loadWebVoices();
    if (!lang) return _webVoices.slice();
    var prefix = lang.split('-')[0].toLowerCase(), out = [];
    for (var i = 0; i < _webVoices.length; i++) {
      var vLang = (_webVoices[i].lang || '').toLowerCase();
      if (vLang.indexOf(prefix) === 0) out.push(_webVoices[i]);
    }
    return out;
  }

  /* ── Diagnostics ────────────────────────────────────────────── */
  function getDiagnostics () {
    _loadWebVoices();
    return {
      platform       : _isCapacitor() ? 'Capacitor Native Android' : 'Web Browser',
      nativePlugin   : _isCapacitor() ? !!_capTTS() : false,
      pluginReady    : !!_capTTS(),
      webSpeechAPI   : _hasSpeechSynth(),
      totalWebVoices : _webVoices.length,
      tamilVoices    : getAvailableVoices('ta').map(function (v) { return v.name + ' (' + v.lang + ')'; }),
      settings       : { rate: _settings.rate, pitch: _settings.pitch, volume: _settings.volume },
      browserInfo    : navigator.userAgent.substring(0, 120)
    };
  }

  /* ── Settings Panel ─────────────────────────────────────────── */
  function renderSettingsPanel (containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    var diag = getDiagnostics();
    var isCap = _isCapacitor();
    var pluginReady = !!_capTTS();
    var webOk = _hasSpeechSynth();

    var statusHtml;
    if (isCap && pluginReady) {
      statusHtml = '<div class="tts-status ok">✅ Native Android TTS Ready · அண்ட்ராய்டு ஒலி இயந்திரம் செயல்படுகிறது</div>';
    } else if (isCap && !pluginReady) {
      statusHtml = '<div class="tts-status err">⚠ Native TTS plugin not found · Plugin இல்லை<br><small style="font-size:9px;opacity:.8">APK rebuild with @capacitor-community/text-to-speech required</small></div>';
    } else if (webOk) {
      statusHtml = '<div class="tts-status ok">✅ Web Speech API · ' + _webVoices.length + ' voices available</div>';
    } else {
      statusHtml = '<div class="tts-status err">❌ TTS not available · ஒலி ஆதரவு இல்லை</div>';
    }

    var voiceHtml = isCap
      ? '<div class="tts-row"><label>🇮🇳 Tamil Voice</label><div style="flex:1;font-size:11px;color:var(--txt);padding:6px 8px;background:var(--bg3);border:1px solid var(--brd)">Android Native TTS (ta-IN)</div></div>'
        + '<div class="tts-row" style="background:rgba(0,60,0,.2);padding:10px 14px"><span style="font-size:10px;color:#7afc7a;font-family:var(--sans)">💡 To install Tamil voice: Settings → General Management → Language → Text-to-Speech → Google TTS → Install Tamil</span></div>'
      : (function () {
          var taV = getAvailableVoices('ta');
          return '<div class="tts-row"><label>🇮🇳 Tamil Voice</label><select id="tts-ta-voice" style="flex:1;background:var(--bg3);border:1px solid var(--brd);color:var(--txt);padding:5px;font-size:10px">'
            + (taV.length ? taV.map(function (v) { return '<option value="' + v.lang + '">' + v.name + ' (' + v.lang + ')</option>'; }).join('') : '<option>— No Tamil voice found —</option>')
            + '</select></div>';
        })();

    container.innerHTML = [
      '<div class="tts-panel">',
      '<h3>⚙ TTS SETTINGS · ஒலி அமைப்புகள்</h3>',
      statusHtml, voiceHtml,
      '<div class="tts-row"><label>⏩ Speed</label><input type="range" id="tts-rate" min="0.5" max="1.5" step="0.05" value="' + _settings.rate + '"><span id="tts-rate-val">' + _settings.rate + '</span></div>',
      '<div class="tts-row"><label>🎵 Pitch</label><input type="range" id="tts-pitch" min="0.5" max="2.0" step="0.1" value="' + _settings.pitch + '"><span id="tts-pitch-val">' + _settings.pitch + '</span></div>',
      '<div class="tts-row"><label>🔊 Volume</label><input type="range" id="tts-vol" min="0.1" max="1" step="0.05" value="' + _settings.volume + '"><span id="tts-vol-val">' + _settings.volume + '</span></div>',
      '<div class="tts-test">',
      '<button id="tts-test-ta">🇮🇳 Test Tamil</button>',
      '<button id="tts-test-en">🇬🇧 Test English</button>',
      '<button id="tts-stop-btn">⏹ Stop</button>',
      '</div>',
      '<div id="tts-test-result" class="tts-test-result"></div>',
      '<details class="tts-diag"><summary>🔍 Diagnostics</summary><pre style="font-size:9px;color:var(--txt2);white-space:pre-wrap;padding:8px">' + JSON.stringify(diag, null, 2) + '</pre></details>',
      '</div>'
    ].join('');

    var rateEl  = document.getElementById('tts-rate');
    var pitchEl = document.getElementById('tts-pitch');
    var volEl   = document.getElementById('tts-vol');
    if (rateEl)  rateEl.oninput  = function () { setRate(this.value);   document.getElementById('tts-rate-val').textContent  = this.value; };
    if (pitchEl) pitchEl.oninput = function () { setPitch(this.value);  document.getElementById('tts-pitch-val').textContent = this.value; };
    if (volEl)   volEl.oninput   = function () { setVolume(this.value); document.getElementById('tts-vol-val').textContent   = this.value; };

    document.getElementById('tts-test-ta').onclick = function () {
      var res = document.getElementById('tts-test-result');
      res.textContent = '🔊 தமிழில் பேசுகிறது…';
      speak('யேசு என்னை நேசிக்கிறார். ஆண்டவர் நல்லவர். அவர் என்றும் உண்மையுள்ளவர்.', 'ta-IN', function () {
        res.textContent = '✅ Tamil audio working! · தமிழ் ஒலி செயல்படுகிறது';
      });
    };
    document.getElementById('tts-test-en').onclick = function () {
      var res = document.getElementById('tts-test-result');
      res.textContent = '🔊 Speaking English…';
      speak('Jesus loves me, this I know. God is good all the time.', 'en-IN', function () {
        res.textContent = '✅ English audio working!';
      });
    };
    document.getElementById('tts-stop-btn').onclick = stop;
  }

  /* ── Public API ─────────────────────────────────────────── */
  return {
    init: init,
    speak: speak,
    speakLong: speakLong,
    pause: pause,
    resume: resume,
    stop: stop,
    isSupported: isSupported,
    isPlaying: isPlaying,
    isPaused: isPaused,
    setRate: setRate,
    setPitch: setPitch,
    setVolume: setVolume,
    on: on,
    hasTamilVoice: hasTamilVoice,
    getAvailableVoices: getAvailableVoices,
    getDiagnostics: getDiagnostics,
    renderSettingsPanel: renderSettingsPanel
  };
})();

/* ── Auto-init ──────────────────────────────────────────── */
(function () {
  function tryInit () {
    TTSEngine.init();
    var c = document.getElementById('tts-settings-container');
    if (c) TTSEngine.renderSettingsPanel('tts-settings-container');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInit);
  } else {
    tryInit();
  }
})();
