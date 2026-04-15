/* ================================================================
   KIDS_STORIES_AUDIO.js — Full Story Reader
   Reads complete story from KIDS_STORIES data using Web Speech API
   Tamil + English · Chapter-by-chapter highlighting
   Requires: tts_engine.js  +  kids_stories.js
================================================================ */

var KidsStoriesAudio = (function () {
  'use strict';

  /* ── State ──────────────────────────────────────────────── */
  var _currentStory = null;
  var _currentLang  = 'ta';   // 'ta' | 'en'
  var _hlTimer      = null;

  /* ── Helpers ────────────────────────────────────────────── */
  function _getStory (id) {
    return (window.KIDS_STORIES || []).find(function (s) { return s.id === id; }) || null;
  }

  function _storyText (story, lang) {
    return lang === 'en' ? (story.story_en || '') : (story.story_ta || '');
  }

  /* ── Modal shell ────────────────────────────────────────── */
  function _ensureModal () {
    if (document.getElementById('ksa-overlay')) return;
    var ov = document.createElement('div');
    ov.id = 'ksa-overlay';
    ov.innerHTML = [
      '<div id="ksa-box">',
      '  <button id="ksa-close">✕</button>',

      '  <div id="ksa-header">',
      '    <div id="ksa-icon"></div>',
      '    <div id="ksa-titles">',
      '      <div id="ksa-title-ta"></div>',
      '      <div id="ksa-title-en"></div>',
      '    </div>',
      '  </div>',

      '  <div id="ksa-verse-bar">',
      '    <span id="ksa-verse-ref"></span>',
      '    <span id="ksa-verse-text"></span>',
      '  </div>',

      '  <div id="ksa-lang-tabs">',
      '    <button class="ksa-tab active" data-lang="ta">🇮🇳 தமிழ்</button>',
      '    <button class="ksa-tab" data-lang="en">🇬🇧 English</button>',
      '  </div>',

      '  <div id="ksa-audio-bar">',
      '    <button id="ksa-play">▶ PLAY</button>',
      '    <button id="ksa-pause">⏸</button>',
      '    <button id="ksa-stop">⏹</button>',
      '    <span id="ksa-audio-status"></span>',
      '  </div>',

      '  <div id="ksa-story-text"></div>',

      '  <div id="ksa-lessons">',
      '    <div id="ksa-lessons-title">💡 Lessons · படிப்பினைகள்</div>',
      '    <ul id="ksa-lessons-list"></ul>',
      '  </div>',

      '</div>'
    ].join('');
    document.body.appendChild(ov);

    ov.addEventListener('click', function (e) { if (e.target === ov) _closeModal(); });
    document.getElementById('ksa-close').addEventListener('click', _closeModal);

    /* lang tabs */
    document.querySelectorAll('.ksa-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.ksa-tab').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        _currentLang = btn.dataset.lang;
        _renderStoryText(_currentStory, _currentLang);
      });
    });

    /* audio buttons */
    document.getElementById('ksa-play').addEventListener('click', _playStory);
    document.getElementById('ksa-pause').addEventListener('click', function () {
      if (window.TTSEngine) TTSEngine.pause();
    });
    document.getElementById('ksa-stop').addEventListener('click', function () {
      if (window.TTSEngine) TTSEngine.stop();
      _setStatus('');
    });
  }

  function _closeModal () {
    if (window.TTSEngine) TTSEngine.stop();
    clearTimeout(_hlTimer);
    var ov = document.getElementById('ksa-overlay');
    if (ov) ov.style.display = 'none';
    _currentStory = null;
  }

  /* ── Render ─────────────────────────────────────────────── */
  function _renderStory (story) {
    _ensureModal();

    document.getElementById('ksa-icon').textContent       = story.icon || '📖';
    document.getElementById('ksa-title-ta').textContent   = story.title_ta;
    document.getElementById('ksa-title-en').textContent   = story.title_en;
    document.getElementById('ksa-verse-ref').textContent  = story.verse_ref + ' — ';
    document.getElementById('ksa-verse-text').textContent =
      (_currentLang === 'en' ? story.verse_en : story.verse_ta) || '';

    _renderStoryText(story, _currentLang);

    /* lessons */
    var lessons = _currentLang === 'en' ? (story.lessons || []) : (story.lessons_ta || []);
    var ul = document.getElementById('ksa-lessons-list');
    ul.innerHTML = lessons.map(function (l) { return '<li>' + l + '</li>'; }).join('');

    /* colour header */
    var box = document.getElementById('ksa-box');
    if (story.color) box.style.setProperty('--story-color', story.color);

    document.getElementById('ksa-overlay').style.display = 'flex';
  }

  function _renderStoryText (story, lang) {
    if (!story) return;
    var text = _storyText(story, lang);
    /* split into paragraphs for reading highlight */
    var paras = text.split(/\n\n+/).filter(Boolean);
    if (paras.length === 0) paras = [text];
    var html = paras.map(function (p, i) {
      return '<p class="ksa-para" id="ksa-p' + i + '">' + _esc(p) + '</p>';
    }).join('');
    document.getElementById('ksa-story-text').innerHTML = html;
  }

  function _esc (s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  /* ── Audio ──────────────────────────────────────────────── */
  function _setStatus (msg) {
    var el = document.getElementById('ksa-audio-status');
    if (el) el.textContent = msg;
  }

  function _playStory () {
    if (!window.TTSEngine) { _setStatus('⚠ TTS not available'); return; }
    if (!_currentStory) return;

    var text = _storyText(_currentStory, _currentLang);
    var lang = _currentLang === 'en' ? 'en-IN' : 'ta-IN';

    TTSEngine.stop();
    _setStatus('🔊 Playing…');

    /* Highlight paragraphs as story progresses */
    var paras  = document.querySelectorAll('.ksa-para');
    var sentences = _splitParas(text);
    var paraIdx   = 0;

    function highlightNext () {
      document.querySelectorAll('.ksa-para').forEach(function (p) { p.classList.remove('ksa-active'); });
      if (paras[paraIdx]) {
        paras[paraIdx].classList.add('ksa-active');
        paras[paraIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        paraIdx++;
      }
    }

    /* Speak paragraph by paragraph for progressive highlight */
    var pTexts = text.split(/\n\n+/).filter(Boolean);
    if (pTexts.length === 0) pTexts = [text];

    var idx = 0;
    function speakNext () {
      if (idx >= pTexts.length) {
        _setStatus('✅ Done');
        document.querySelectorAll('.ksa-para').forEach(function (p) { p.classList.remove('ksa-active'); });
        return;
      }
      document.querySelectorAll('.ksa-para').forEach(function (p) { p.classList.remove('ksa-active'); });
      var el = document.getElementById('ksa-p' + idx);
      if (el) {
        el.classList.add('ksa-active');
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      TTSEngine.speakLong(pTexts[idx], lang, function () {
        idx++;
        speakNext();
      });
    }
    speakNext();
  }

  function _splitParas (text) {
    return text.split(/\n\n+/).filter(Boolean);
  }

  /* ── CSS ────────────────────────────────────────────────── */
  function _injectCSS () {
    if (document.getElementById('ksa-style')) return;
    var s   = document.createElement('style');
    s.id = 'ksa-style';
    s.textContent = [
      '#ksa-overlay{position:fixed;inset:0;background:rgba(0,0,0,.8);display:none;',
      'align-items:center;justify-content:center;z-index:9998;padding:12px}',

      '#ksa-box{--story-color:#1a3a6a;background:#0d1b2a;color:#e8dcc8;',
      'border-radius:14px;max-width:560px;width:100%;max-height:92vh;',
      'overflow-y:auto;padding:20px;position:relative;',
      'border-top:4px solid var(--story-color)}',

      '#ksa-close{position:absolute;top:10px;right:14px;background:none;',
      'border:none;color:#e8dcc8;font-size:22px;cursor:pointer;line-height:1}',

      '#ksa-header{display:flex;gap:12px;align-items:center;margin-bottom:12px}',
      '#ksa-icon{font-size:40px;flex-shrink:0}',
      '#ksa-title-ta{font-size:20px;font-weight:700}',
      '#ksa-title-en{font-size:12px;color:#8ab;margin-top:2px}',

      '#ksa-verse-bar{background:var(--story-color);border-radius:8px;',
      'padding:8px 12px;font-size:13px;margin-bottom:12px;line-height:1.5}',
      '#ksa-verse-ref{font-weight:700;margin-right:4px;color:#f5c842}',

      '#ksa-lang-tabs{display:flex;gap:8px;margin-bottom:10px}',
      '.ksa-tab{padding:6px 14px;border-radius:20px;border:1px solid #345;',
      'background:none;color:#9ab;cursor:pointer;font-size:13px}',
      '.ksa-tab.active{background:var(--story-color);color:#fff;border-color:transparent}',

      '#ksa-audio-bar{display:flex;gap:8px;align-items:center;margin-bottom:14px}',
      '#ksa-audio-bar button{padding:7px 16px;border-radius:20px;border:none;',
      'cursor:pointer;font-size:13px;background:#2e4a7a;color:#fff;font-weight:600}',
      '#ksa-audio-status{font-size:12px;color:#8ab}',

      '#ksa-story-text{font-size:15px;line-height:1.85;margin-bottom:16px}',
      '.ksa-para{padding:6px 8px;border-radius:6px;transition:background .3s}',
      '.ksa-active{background:rgba(245,200,66,.12);border-left:3px solid #f5c842;',
      'padding-left:10px}',

      '#ksa-lessons{background:#0a1520;border-radius:8px;padding:12px 14px}',
      '#ksa-lessons-title{font-weight:700;color:#f5c842;margin-bottom:8px;font-size:13px}',
      '#ksa-lessons-list{margin:0;padding-left:18px;font-size:13px;line-height:1.8}',
    ].join('');
    document.head.appendChild(s);
  }

  /* ── Public: open story ─────────────────────────────────── */
  function openStory (idOrStory, lang) {
    _injectCSS();
    var story = (typeof idOrStory === 'string') ? _getStory(idOrStory) : idOrStory;
    if (!story) { console.warn('KidsStoriesAudio: story not found', idOrStory); return; }
    _currentStory = story;
    _currentLang  = lang || 'ta';
    /* sync tab UI */
    document.querySelectorAll('.ksa-tab').forEach(function (b) {
      b.classList.toggle('active', b.dataset.lang === _currentLang);
    });
    _renderStory(story);
  }

  /* ── Attach to story cards ──────────────────────────────── */
  function attachToCards () {
    _injectCSS();
    var cards = document.querySelectorAll('[data-story-id]');
    cards.forEach(function (el) {
      el.addEventListener('click', function () {
        var id   = el.dataset.storyId;
        var lang = el.dataset.lang || 'ta';
        openStory(id, lang);
      });
    });
  }

  function init () {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attachToCards);
    } else {
      attachToCards();
    }
  }

  return { init: init, openStory: openStory, attachToCards: attachToCards };
})();

KidsStoriesAudio.init();
