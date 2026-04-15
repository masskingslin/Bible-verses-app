/* ================================================================
   SONGS_FULL_LYRICS.js — Full Lyrics via Claude AI
   Extends TAMIL_SONGS data · fetches complete lyrics on demand
   Patch over existing songs.js — load AFTER songs.js
================================================================ */

var SongsLyrics = (function () {
  'use strict';

  /* ── Cache ──────────────────────────────────────────────── */
  var _cache = {};   // key: catId+no → full lyrics string

  /* ── Claude API call ────────────────────────────────────── */
  function _fetchFullLyrics (song, onSuccess, onError) {
    var key   = (song.catId || '') + '_' + song.no + '_' + song.title_ta;
    if (_cache[key]) { onSuccess(_cache[key]); return; }

    var prompt = [
      'You are a Tamil Christian song lyrics expert.',
      'The following song has only a partial preview of its lyrics.',
      '',
      'Song title (Tamil): ' + song.title_ta,
      'Song title (English): ' + song.title_en,
      'Known lyrics (partial):',
      song.lyrics_ta,
      '',
      'Please provide the COMPLETE lyrics of this Tamil Christian song.',
      'Format: verse 1, chorus, verse 2, chorus, verse 3, chorus (if applicable).',
      'Label each section clearly: வசனம் 1:, க்ரஃபை:, வசனம் 2: etc.',
      'Respond ONLY with the Tamil lyrics text — no English translation, no explanation.',
      'If you do not know this exact song, write "UNKNOWN" on the first line.',
    ].join('\n');

    fetch('https://api.anthropic.com/v1/messages', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({
        model      : 'claude-sonnet-4-20250514',
        max_tokens : 1000,
        messages   : [{ role: 'user', content: prompt }]
      })
    })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var text = (data.content || []).map(function (b) { return b.text || ''; }).join('');
      if (!text || text.trim().startsWith('UNKNOWN')) {
        /* fallback: return what we already have */
        onSuccess(song.lyrics_ta);
        return;
      }
      _cache[key] = text.trim();
      onSuccess(_cache[key]);
    })
    .catch(function (err) {
      console.warn('SongsLyrics: fetch failed', err);
      if (onError) onError(err);
      else onSuccess(song.lyrics_ta);  /* graceful fallback */
    });
  }

  /* ── Render lyrics modal ────────────────────────────────── */
  function _ensureModal () {
    if (document.getElementById('slm-overlay')) return;

    var overlay = document.createElement('div');
    overlay.id        = 'slm-overlay';
    overlay.innerHTML = [
      '<div id="slm-box">',
      '  <button id="slm-close">✕</button>',
      '  <div id="slm-tts-bar">',
      '    <button id="slm-play">▶ HEAR</button>',
      '    <button id="slm-stop">⏹</button>',
      '    <span id="slm-tts-status"></span>',
      '  </div>',
      '  <div id="slm-header"></div>',
      '  <div id="slm-body"></div>',
      '</div>'
    ].join('');

    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) _closeModal();
    });
    document.getElementById('slm-close').addEventListener('click', _closeModal);
    document.getElementById('slm-stop').addEventListener('click', function () {
      if (window.TTSEngine) TTSEngine.stop();
    });
  }

  function _closeModal () {
    if (window.TTSEngine) TTSEngine.stop();
    var ov = document.getElementById('slm-overlay');
    if (ov) ov.style.display = 'none';
  }

  function _showModal (song, lyrics) {
    _ensureModal();
    var overlay = document.getElementById('slm-overlay');
    var header  = document.getElementById('slm-header');
    var body    = document.getElementById('slm-body');

    header.innerHTML = [
      '<div class="slm-cat">' + (song.catTitle_ta || '') + '</div>',
      '<div class="slm-title">' + song.title_ta + '</div>',
      '<div class="slm-title-en">' + song.title_en + '</div>',
    ].join('');

    /* Format: bold section headers, newline → <br> */
    var html = lyrics
      .replace(/\r\n/g, '\n')
      .replace(/(வசனம்\s*\d+:|க்ரஃபை:|CHORUS:|VERSE\s*\d+:)/gi, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    body.innerHTML = '<div class="slm-lyrics">' + html + '</div>';

    /* TTS play button */
    document.getElementById('slm-play').onclick = function () {
      if (window.TTSEngine) {
        var statusEl = document.getElementById('slm-tts-status');
        statusEl.textContent = '🔊 Playing…';
        TTSEngine.speakLong(lyrics, 'ta-IN', function () {
          statusEl.textContent = '';
        });
      }
    };

    overlay.style.display = 'flex';
  }

  /* ── Public: open song ──────────────────────────────────── */
  function openSong (song) {
    _ensureModal();
    var body = document.getElementById('slm-body');
    body.innerHTML = '<div class="slm-loading">⏳ Loading full lyrics…</div>';
    document.getElementById('slm-overlay').style.display = 'flex';
    document.getElementById('slm-header').innerHTML = '<div class="slm-title">' + song.title_ta + '</div>';

    _fetchFullLyrics(song, function (lyrics) {
      _showModal(song, lyrics);
    }, function () {
      _showModal(song, song.lyrics_ta);
    });
  }

  /* ── Inject CSS ─────────────────────────────────────────── */
  function _injectCSS () {
    if (document.getElementById('slm-style')) return;
    var s = document.createElement('style');
    s.id = 'slm-style';
    s.textContent = [
      '#slm-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);display:none;',
      'align-items:center;justify-content:center;z-index:9999;padding:16px}',
      '#slm-box{background:#1a1a2e;color:#f0e6d3;border-radius:12px;max-width:520px;',
      'width:100%;max-height:90vh;overflow-y:auto;padding:20px;position:relative}',
      '#slm-close{position:absolute;top:10px;right:14px;background:none;border:none;',
      'color:#f0e6d3;font-size:20px;cursor:pointer}',
      '#slm-tts-bar{display:flex;gap:8px;align-items:center;margin-bottom:12px}',
      '#slm-tts-bar button{padding:6px 14px;border-radius:20px;border:none;cursor:pointer;',
      'font-size:13px;background:#2e4a7a;color:#fff}',
      '#slm-tts-status{font-size:12px;color:#aac}',
      '.slm-cat{font-size:11px;color:#8ab;text-transform:uppercase;letter-spacing:1px}',
      '.slm-title{font-size:20px;font-weight:700;margin:4px 0 2px}',
      '.slm-title-en{font-size:12px;color:#9ab;margin-bottom:12px}',
      '.slm-lyrics{font-size:16px;line-height:1.9;white-space:pre-wrap}',
      '.slm-lyrics strong{color:#f5c842;display:block;margin-top:12px}',
      '.slm-loading{text-align:center;padding:40px;font-size:15px}',
    ].join('');
    document.head.appendChild(s);
  }

  /* ── Attach click handlers to rendered song cards ────────── */
  function attachToCards () {
    var cards = document.querySelectorAll('[data-song-open]');
    cards.forEach(function (el) {
      el.addEventListener('click', function () {
        var catId   = el.dataset.catId   || '';
        var songIdx = parseInt(el.dataset.songIdx, 10);
        var cat = (window.TAMIL_SONGS.categories || []).find(function (c) { return c.id === catId; });
        if (!cat) return;
        var song = cat.songs[songIdx];
        if (!song) return;
        openSong(Object.assign({}, song, {
          catId     : catId,
          catTitle_ta: cat.title_ta,
          catTitle_en: cat.title_en
        }));
      });
    });
  }

  /* ── Init ───────────────────────────────────────────────── */
  function init () {
    _injectCSS();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attachToCards);
    } else {
      attachToCards();
    }
  }

  return { init: init, openSong: openSong, attachToCards: attachToCards };
})();

/* Auto-init */
SongsLyrics.init();
