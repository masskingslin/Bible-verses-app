/* ================================================================
   TTS_ENGINE.js  v4.0
   Capacitor Native TTS  (Android/iOS)
   Web Speech API fallback  (Chrome / browser)
   Supports Tamil + English · Settings Panel · Diagnostics
================================================================ */

var TTSEngine = (function () {
  'use strict';

  var _isPlaying  = false;
  var _settings   = {
    lang_ta : 'ta-IN',
    lang_en : 'en-IN',
    rate    : 1.0,
    pitch   : 1.0,
    volume  : 1.0
  };
  var _callbacks  = { onStart: null, onEnd: null, onError: null };

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
      /* Capacitor 5: window.Capacitor.Plugins.TextToSpeech */
      var p = window.Capacitor && window.Capacitor.Plugins;
      if (p && p.TextToSpeech) return p.TextToSpeech;
      /* Some builds expose at window.CapacitorTextToSpeech.TextToSpeech */
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
      if (window.speechSynthesis.onvoiceschanged !== undefined)
        window.speechSynthesis.onvoiceschanged = function () {};
      window.speechSynthesis.getVoices();
    }
    return isSupported();
  }

  /* ── Capacitor speak ────────────────────────────────────────── */
  function _capSpeak (text, lang, onEnd) {
    var tts = _capTTS();
    if (!tts) {
      /* Plugin not ready — try web speech fallback */
      if (_hasSpeechSynth()) { _webSpeak(text, lang, onEnd); return; }
      if (onEnd) onEnd(); return;
    }
    _isPlaying = true;
    if (_callbacks.onStart) _callbacks.onStart();

    var stopProm = (tts.stop && typeof tts.stop === 'function')
      ? tts.stop().catch(function () {})
      : Promise.resolve();

    stopProm.then(function () {
      return tts.speak({
        text   : text,
        lang   : lang || _settings.lang_ta,
        rate   : _settings.rate,
        pitch  : _settings.pitch,
        volume : _settings.volume
      });
    }).then(function () {
      _isPlaying = false;
      if (onEnd) onEnd();
      if (_callbacks.onEnd) _callbacks.onEnd();
    }).catch(function (e) {
      _isPlaying = false;
      console.warn('TTS native error:', e);
      /* Auto-fallback to web speech */
      if (_hasSpeechSynth()) {
        console.log('TTS: falling back to Web Speech');
        _webSpeak(text, lang, onEnd);
      } else {
        if (_callbacks.onError) _callbacks.onError(e);
      }
    });
  }

  /* ── Web Speech speak ───────────────────────────────────────── */
  var _webVoices = [];
  function _loadWebVoices () {
    if (_hasSpeechSynth()) _webVoices = window.speechSynthesis.getVoices() || [];
  }
  function _pickWebVoice (lang) {
    _loadWebVoices();
    var prefix = lang.split('-')[0];
    var exact = null, approx = null;
    for (var i = 0; i < _webVoices.length; i++) {
      if (_webVoices[i].lang === lang) { exact = _webVoices[i]; break; }
      if (!approx && _webVoices[i].lang && _webVoices[i].lang.indexOf(prefix) === 0) approx = _webVoices[i];
    }
    return exact || approx || null;
  }

  function _webSpeak (text, lang, onEnd) {
    if (!_hasSpeechSynth()) { if (onEnd) onEnd(); return; }
    try { window.speechSynthesis.cancel(); } catch (e) {}
    var u = new SpeechSynthesisUtterance(text);
    u.lang   = lang || _settings.lang_ta;
    u.rate   = _settings.rate;
    u.pitch  = _settings.pitch;
    u.volume = _settings.volume;
    var v = _pickWebVoice(u.lang);
    if (v) u.voice = v;
    u.onstart = function () { _isPlaying = true; if (_callbacks.onStart) _callbacks.onStart(); };
    u.onend   = function () { _isPlaying = false; if (onEnd) onEnd(); if (_callbacks.onEnd) _callbacks.onEnd(); };
    u.onerror = function (e) {
      _isPlaying = false;
      console.warn('Web Speech error:', e.error);
      if (_callbacks.onError) _callbacks.onError(e);
    };
    _isPlaying = true;
    window.speechSynthesis.speak(u);
  }

  /* ── Split long text into chunks ────────────────────────────── */
  function _split (text) {
    var raw = text.split(/[.!?\n]+/).filter(function (s) { return s.trim(); });
    var chunks = [], buf = '';
    for (var i = 0; i < raw.length; i++) {
      var s = raw[i].trim();
      if (!s) continue;
      if ((buf + ' ' + s).length > 200 && buf) { chunks.push(buf); buf = s; }
      else { buf = buf ? buf + '. ' + s : s; }
    }
    if (buf) chunks.push(buf);
    return chunks.length ? chunks : [text];
  }

  /* ── Public speak ───────────────────────────────────────────── */
  function speak (text, lang, onEnd) {
    if (!text || !text.trim()) { if (onEnd) onEnd(); return; }
    if (_isCapacitor()) { _capSpeak(text, lang, onEnd); }
    else { _webSpeak(text, lang, onEnd); }
  }

  function speakLong (text, lang, onEnd) {
    if (!text || !text.trim()) { if (onEnd) onEnd(); return; }
    stop();
    /* Capacitor handles long text natively */
    if (_isCapacitor()) { _capSpeak(text, lang, onEnd); return; }
    var chunks = _split(text), idx = 0;
    function next () {
      if (idx >= chunks.length) { if (onEnd) onEnd(); return; }
      _webSpeak(chunks[idx++], lang, next);
    }
    next();
  }

  /* ── Controls ───────────────────────────────────────────── */
  function stop () {
    _isPlaying = false;
    if (_isCapacitor()) {
      var t = _capTTS();
      if (t && typeof t.stop === 'function') t.stop().catch(function () {});
    }
    if (_hasSpeechSynth()) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
  }

  function pause () {
    if (!_isCapacitor() && _hasSpeechSynth()) {
      try { window.speechSynthesis.pause(); } catch (e) {}
    } else { stop(); }
  }

  function resume () {
    if (!_isCapacitor() && _hasSpeechSynth()) {
      try { window.speechSynthesis.resume(); } catch (e) {}
    }
  }

  function isPlaying   () { return _isPlaying; }
  function setRate   (v) { _settings.rate   = parseFloat(v) || 1.0; }
  function setPitch  (v) { _settings.pitch  = parseFloat(v) || 1.0; }
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
    var prefix = lang.split('-')[0], out = [];
    for (var i = 0; i < _webVoices.length; i++) {
      if (_webVoices[i].lang && _webVoices[i].lang.indexOf(prefix) === 0) out.push(_webVoices[i]);
    }
    return out;
  }

  /* ── Diagnostics ────────────────────────────────────────── */
  function getDiagnostics () {
    _loadWebVoices();
    return {
      platform       : _isCapacitor() ? 'Capacitor Native Android' : 'Web Browser',
      nativePlugin   : _isCapacitor() ? !!_capTTS() : false,
      pluginReady    : !!_capTTS(),
      webSpeechAPI   : _hasSpeechSynth(),
      totalWebVoices : _webVoices.length,
      tamilVoices    : getAvailableVoices('ta').map(function (v) { return v.name + ' (' + v.lang + ')'; }),
      settings       : {rate: _settings.rate, pitch: _settings.pitch, volume: _settings.volume},
      browserInfo    : navigator.userAgent.substring(0, 120)
    };
  }

  /* ── Settings Panel ─────────────────────────────────────── */
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
      statusHtml = '<div class="tts-status err">⚠ Native TTS plugin not found · Plugin இல்லை<br><small style="font-size:9px;opacity:.8">APK rebuild with @capacitor-community/text-to-speech@5.0.0 required</small></div>';
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

    var rateEl = document.getElementById('tts-rate');
    var pitchEl = document.getElementById('tts-pitch');
    var volEl = document.getElementById('tts-vol');
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
    init: init, speak: speak, speakLong: speakLong,
    pause: pause, resume: resume, stop: stop,
    isSupported: isSupported, isPlaying: isPlaying,
    setRate: setRate, setPitch: setPitch, setVolume: setVolume, on: on,
    hasTamilVoice: hasTamilVoice, getAvailableVoices: getAvailableVoices,
    getDiagnostics: getDiagnostics, renderSettingsPanel: renderSettingsPanel
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
