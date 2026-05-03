/* ================================================================
   TTS_ENGINE.js  v3.0
   Capacitor Native TTS  (Android/iOS)
   Web Speech API fallback  (Chrome / browser preview)
   Supports Tamil + English · Settings Panel · Diagnostics
================================================================ */

var TTSEngine = (function () {
  'use strict';

  /* ── State ─────────────────────────────────────────────── */
  var _isPlaying  = false;
  var _settings   = {
    lang_ta : 'ta-IN',
    lang_en : 'en-IN',
    rate    : 1.0,
    pitch   : 1.0,
    volume  : 1.0
  };
  var _callbacks  = { onStart: null, onEnd: null, onError: null };

  /* ── Platform detection ─────────────────────────────────── */
  function _isCapacitor () {
    return typeof window.Capacitor !== 'undefined' &&
           window.Capacitor.isNativePlatform &&
           window.Capacitor.isNativePlatform();
  }

  function _capTTS () {
    if (!_isCapacitor()) return null;
    var p = window.Capacitor.Plugins;
    return (p && p.TextToSpeech) ? p.TextToSpeech : null;
  }

  function _hasSpeechSynth () {
    return typeof window.speechSynthesis !== 'undefined';
  }

  function isSupported () {
    return _isCapacitor() ? !!_capTTS() : _hasSpeechSynth();
  }

  /* ── Init ───────────────────────────────────────────────── */
  function init (opts) {
    if (opts) {
      if (opts.rate   !== undefined) _settings.rate   = parseFloat(opts.rate)   || 1.0;
      if (opts.pitch  !== undefined) _settings.pitch  = parseFloat(opts.pitch)  || 1.0;
      if (opts.volume !== undefined) _settings.volume = parseFloat(opts.volume) || 1.0;
      if (opts.lang_ta) _settings.lang_ta = opts.lang_ta;
      if (opts.lang_en) _settings.lang_en = opts.lang_en;
    }
    /* Web Speech: load voices */
    if (!_isCapacitor() && _hasSpeechSynth()) {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = function () {};
      }
      window.speechSynthesis.getVoices();
    }
    return isSupported();
  }

  /* ── Capacitor speak ────────────────────────────────────── */
  function _capSpeak (text, lang, onEnd) {
    var tts = _capTTS();
    if (!tts) { if (onEnd) onEnd(); return; }
    _isPlaying = true;
    if (_callbacks.onStart) _callbacks.onStart();

    /* Stop any current speech first */
    tts.stop().catch(function () {}).then(function () {
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
      console.warn('TTS error:', e);
      if (_callbacks.onError) _callbacks.onError(e);
    });
  }

  /* ── Web Speech speak ───────────────────────────────────── */
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
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang   = lang || _settings.lang_ta;
    u.rate   = _settings.rate;
    u.pitch  = _settings.pitch;
    u.volume = _settings.volume;
    var v = _pickWebVoice(u.lang);
    if (v) u.voice = v;
    u.onstart = function () { _isPlaying = true; if (_callbacks.onStart) _callbacks.onStart(); };
    u.onend   = function () { _isPlaying = false; if (onEnd) onEnd(); if (_callbacks.onEnd) _callbacks.onEnd(); };
    u.onerror = function (e) { _isPlaying = false; if (_callbacks.onError) _callbacks.onError(e); };
    _isPlaying = true;
    window.speechSynthesis.speak(u);
  }

  /* ── Public speak ───────────────────────────────────────── */
  function speak (text, lang, onEnd) {
    if (!text || !text.trim()) { if (onEnd) onEnd(); return; }
    if (_isCapacitor()) { _capSpeak(text, lang, onEnd); }
    else { _webSpeak(text, lang, onEnd); }
  }

  /* Sentence-split for long texts — keep chunks ≤ 200 chars */
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

  function speakLong (text, lang, onEnd) {
    if (!text || !text.trim()) { if (onEnd) onEnd(); return; }
    stop();
    /* Capacitor TTS handles long text natively — send whole text */
    if (_isCapacitor()) {
      _capSpeak(text, lang, onEnd);
      return;
    }
    /* Web Speech: chunk it to avoid 15-second browser cut-off */
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
      var t = _capTTS(); if (t) t.stop().catch(function () {});
    } else if (_hasSpeechSynth()) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
  }

  function pause () {
    if (!_isCapacitor() && _hasSpeechSynth()) {
      try { window.speechSynthesis.pause(); } catch (e) {}
    }
    /* Capacitor TTS has no pause — just stop */
    else { stop(); }
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
    if (_isCapacitor()) return true; /* Assume device has Tamil installed */
    return !!_pickWebVoice(_settings.lang_ta);
  }

  function getAvailableVoices (lang) {
    if (_isCapacitor()) return [];
    _loadWebVoices();
    if (!lang) return _webVoices.slice();
    var prefix = lang.split('-')[0];
    var out = [];
    for (var i = 0; i < _webVoices.length; i++) {
      if (_webVoices[i].lang && _webVoices[i].lang.indexOf(prefix) === 0) out.push(_webVoices[i]);
    }
    return out;
  }

  /* ── Diagnostics ────────────────────────────────────────── */
  function getDiagnostics () {
    _loadWebVoices();
    return {
      platform       : _isCapacitor() ? 'Capacitor (Native Android/iOS TTS)' : 'Web Browser',
      supported      : isSupported(),
      nativePlugin   : _isCapacitor() ? !!_capTTS() : false,
      webSpeechAPI   : _hasSpeechSynth(),
      totalWebVoices : _webVoices.length,
      tamilVoices    : getAvailableVoices('ta').map(function (v) { return v.name + ' (' + v.lang + ')'; }),
      englishVoices  : getAvailableVoices('en').map(function (v) { return v.name + ' (' + v.lang + ')'; }),
      settings       : {rate: _settings.rate, pitch: _settings.pitch, volume: _settings.volume,
                        lang_ta: _settings.lang_ta, lang_en: _settings.lang_en},
      browserInfo    : navigator.userAgent.substring(0, 100)
    };
  }

  /* ── Settings Panel ─────────────────────────────────────── */
  function renderSettingsPanel (containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var diag = getDiagnostics();
    var isCap = _isCapacitor();
    var supported = isSupported();

    var statusHtml = supported
      ? (isCap
          ? '<div class="tts-status ok">✅ Native Android TTS · அண்ட்ராய்டு ஒலி இயந்திரம் செயல்படுகிறது</div>'
          : '<div class="tts-status ok">✅ Web Speech API · ' + _webVoices.length + ' voices</div>')
      : '<div class="tts-status err">❌ TTS not available on this device</div>';

    var voiceHtml = '';
    if (isCap) {
      voiceHtml = '<div class="tts-row"><label>🇮🇳 Tamil Voice</label>'+
        '<div style="flex:1;font-size:11px;color:var(--txt);padding:6px 8px;background:var(--bg3);border:1px solid var(--brd)">'+
        'Android Native TTS (ta-IN)</div></div>'+
        '<div class="tts-row"><label>🇬🇧 English Voice</label>'+
        '<div style="flex:1;font-size:11px;color:var(--txt);padding:6px 8px;background:var(--bg3);border:1px solid var(--brd)">'+
        'Android Native TTS (en-IN)</div></div>'+
        '<div class="tts-row" style="background:rgba(0,60,0,.3);border:1px solid rgba(0,200,0,.2);padding:10px 14px">'+
        '<span style="font-size:11px;color:#5afa5a;font-family:var(--sans)">'+
        '💡 Tamil voice requires: Settings → General Management → Language → Text-to-Speech → '+
        'Google TTS → Install Tamil language data</span></div>';
    } else {
      var taVoices = getAvailableVoices('ta');
      var taOpts = taVoices.length
        ? taVoices.map(function (v) { return '<option value="'+v.lang+'">'+v.name+' ('+v.lang+')</option>'; }).join('')
        : '<option value="">— No Tamil voice found —</option>';
      voiceHtml = '<div class="tts-row"><label>🇮🇳 Tamil Voice</label>'+
        '<select id="tts-ta-voice" style="flex:1;background:var(--bg3);border:1px solid var(--brd);color:var(--txt);padding:5px;font-size:10px">'+
        taOpts+'</select></div>';
    }

    container.innerHTML = [
      '<div class="tts-panel">',
      '<h3>⚙ TTS SETTINGS · ஒலி அமைப்புகள்</h3>',
      statusHtml,
      voiceHtml,
      '<div class="tts-row"><label>⏩ Speed</label>',
        '<input type="range" id="tts-rate" min="0.5" max="1.5" step="0.05" value="'+_settings.rate+'">',
        '<span id="tts-rate-val">'+_settings.rate+'</span></div>',
      '<div class="tts-row"><label>🎵 Pitch</label>',
        '<input type="range" id="tts-pitch" min="0.5" max="2.0" step="0.1" value="'+_settings.pitch+'">',
        '<span id="tts-pitch-val">'+_settings.pitch+'</span></div>',
      '<div class="tts-row"><label>🔊 Volume</label>',
        '<input type="range" id="tts-vol" min="0.1" max="1" step="0.05" value="'+_settings.volume+'">',
        '<span id="tts-vol-val">'+_settings.volume+'</span></div>',
      '<div class="tts-test">',
        '<button id="tts-test-ta">🇮🇳 Test Tamil</button>',
        '<button id="tts-test-en">🇬🇧 Test English</button>',
        '<button id="tts-stop-btn">⏹ Stop</button>',
      '</div>',
      '<div id="tts-test-result" class="tts-test-result"></div>',
      isCap ? [
        '<div class="tts-row" style="flex-direction:column;gap:6px;padding:12px 14px">',
        '<div style="font-size:9px;letter-spacing:2px;color:var(--txt3);font-family:var(--sans);margin-bottom:6px">INSTALL TAMIL VOICE</div>',
        '<button id="tts-install" style="width:100%;padding:12px;background:linear-gradient(135deg,#0a3a6a,#1a5aa0);border:none;color:#fff;font-size:11px;font-weight:700;font-family:var(--sans);cursor:pointer">',
        '📥 Open TTS Install Page',
        '</button></div>'
      ].join('') : '',
      '<details class="tts-diag"><summary>🔍 Diagnostics</summary>',
        '<pre style="font-size:9px;color:var(--txt2);white-space:pre-wrap;padding:8px">',
        JSON.stringify(diag, null, 2),
        '</pre></details>',
      '</div>'
    ].join('');

    /* Bind sliders */
    var rateEl  = document.getElementById('tts-rate');
    var pitchEl = document.getElementById('tts-pitch');
    var volEl   = document.getElementById('tts-vol');
    if (rateEl)  rateEl.oninput  = function () { setRate(this.value);   document.getElementById('tts-rate-val').textContent  = this.value; };
    if (pitchEl) pitchEl.oninput = function () { setPitch(this.value);  document.getElementById('tts-pitch-val').textContent = this.value; };
    if (volEl)   volEl.oninput   = function () { setVolume(this.value); document.getElementById('tts-vol-val').textContent   = this.value; };

    /* Test Tamil */
    document.getElementById('tts-test-ta').onclick = function () {
      var res = document.getElementById('tts-test-result');
      res.textContent = '🔊 தமிழில் பேசுகிறது…';
      speak('யேசு என்னை நேசிக்கிறார். ஆண்டவர் நல்லவர். அவர் என்றும் உண்மையுள்ளவர்.', 'ta-IN', function () {
        res.textContent = '✅ Tamil audio working! · தமிழ் ஒலி செயல்படுகிறது';
      });
    };

    /* Test English */
    document.getElementById('tts-test-en').onclick = function () {
      var res = document.getElementById('tts-test-result');
      res.textContent = '🔊 Speaking English…';
      speak('Jesus loves me, this I know. For the Bible tells me so. God is good all the time.', 'en-IN', function () {
        res.textContent = '✅ English audio working!';
      });
    };

    document.getElementById('tts-stop-btn').onclick = stop;

    /* Install button (Capacitor only) */
    var instBtn = document.getElementById('tts-install');
    if (instBtn) {
      instBtn.onclick = function () {
        var t = _capTTS();
        if (t && t.openInstall) {
          t.openInstall().catch(function () {});
        } else {
          var res = document.getElementById('tts-test-result');
          if (res) res.textContent = 'Go to: Settings → General Management → Language → Text-to-Speech';
        }
      };
    }
  }

  /* ── Public API ─────────────────────────────────────────── */
  return {
    init               : init,
    speak              : speak,
    speakLong          : speakLong,
    pause              : pause,
    resume             : resume,
    stop               : stop,
    isSupported        : isSupported,
    isPlaying          : isPlaying,
    setRate            : setRate,
    setPitch           : setPitch,
    setVolume          : setVolume,
    on                 : on,
    hasTamilVoice      : hasTamilVoice,
    getAvailableVoices : getAvailableVoices,
    getDiagnostics     : getDiagnostics,
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
