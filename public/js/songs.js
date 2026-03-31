// songs.js — Complete Songs Screen with Inbuilt Audio Player
// Place in: www/js/songs.js

const SongsScreen = (() => {

  // ── State ────────────────────────────────────────────────
  let currentSong = null;
  let currentCategoryIndex = null;
  let currentSongIndex = 0;
  let isPlaying = false;
  let audio = new Audio();
  let progressTimer = null;
  let expandedCategory = null;

  // ── Build Main Songs Screen ──────────────────────────────
  function render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="screen songs-screen" id="songsScreen">

        <!-- Header -->
        <div class="songs-header">
          <button class="back-btn" onclick="showHome()">&#8249;</button>
          <span class="header-grid-btn" onclick="toggleSongsView()">&#8942;</span>
          <h2 class="header-title">பாடல்கள்</h2>
        </div>

        <!-- Search Bar -->
        <div class="song-search-wrap">
          <input type="text" id="songSearchInput"
            placeholder="பாடல் தேடுங்கள் / Search songs..."
            oninput="SongsScreen.searchSongs(this.value)"
            class="song-search-input"/>
          <span class="search-icon">🔍</span>
        </div>

        <!-- Category List -->
        <div class="songs-list-wrap" id="songsListWrap">
          ${SONG_CATEGORIES.map((cat, i) => renderCategory(cat, i)).join('')}
        </div>

        <!-- Mini Player (shows when song selected) -->
        <div class="mini-player" id="miniPlayer" style="display:none">
          <div class="mini-player-info" onclick="SongsScreen.openFullPlayer()">
            <div class="mini-song-emoji">🎵</div>
            <div class="mini-song-text">
              <div class="mini-song-title" id="miniTitle">—</div>
              <div class="mini-song-sub" id="miniSub">—</div>
            </div>
          </div>
          <div class="mini-controls">
            <button class="mini-btn" onclick="SongsScreen.prevSong()">⏮</button>
            <button class="mini-play-btn" id="miniPlayBtn" onclick="SongsScreen.togglePlay()">▶</button>
            <button class="mini-btn" onclick="SongsScreen.nextSong()">⏭</button>
          </div>
        </div>

        <!-- Full Player Modal -->
        <div class="full-player-overlay" id="fullPlayerOverlay" style="display:none">
          ${renderFullPlayer()}
        </div>

      </div>
    `;
    setupAudioEvents();
  }

  // ── Category Row ─────────────────────────────────────────
  function renderCategory(cat, index) {
    const label = cat.label ? `<span class="cat-badge">${cat.label}</span>` : '';
    const partLabel = cat.part > 0 ? ` - ${cat.part}` : '';
    const displayTitle = (cat.tamil !== cat.english)
      ? `<strong>${cat.tamil}</strong> <span class="cat-en">- ${cat.english}${partLabel}</span>`
      : `<span class="cat-en">${cat.english}</span>`;

    return `
      <div class="cat-row" onclick="SongsScreen.toggleCategory(${index})">
        <div class="cat-row-left">
          <span class="cat-emoji">${cat.emoji}</span>
          <div class="cat-title">${displayTitle}${label}</div>
        </div>
        <span class="cat-arrow" id="arrow_${index}">&#8250;</span>
      </div>
      <div class="songs-collapse" id="collapse_${index}" style="display:none">
        ${cat.songs.map((song, si) => renderSongRow(song, index, si, cat.color)).join('')}
      </div>
    `;
  }

  // ── Song Row ──────────────────────────────────────────────
  function renderSongRow(song, catIdx, songIdx, color) {
    return `
      <div class="song-row" id="songrow_${song.id}"
           onclick="SongsScreen.playSong(${catIdx}, ${songIdx})"
           style="--cat-color: ${color}">
        <div class="song-num">${songIdx + 1}</div>
        <div class="song-info">
          <div class="song-title-ta">${song.title_ta}</div>
          <div class="song-title-en">${song.title_en}</div>
        </div>
        <div class="song-right">
          <span class="song-duration">${song.duration}</span>
          <span class="song-play-icon" id="icon_${song.id}">▶</span>
        </div>
      </div>
    `;
  }

  // ── Full Player UI ────────────────────────────────────────
  function renderFullPlayer() {
    return `
      <div class="full-player">
        <button class="fp-close" onclick="SongsScreen.closeFullPlayer()">✕</button>
        <div class="fp-art">🎵</div>
        <div class="fp-title" id="fpTitle">—</div>
        <div class="fp-subtitle" id="fpSubtitle">—</div>
        <div class="fp-category" id="fpCategory">—</div>

        <!-- Progress Bar -->
        <div class="fp-progress-wrap">
          <span class="fp-time" id="fpCurrent">0:00</span>
          <input type="range" class="fp-progress" id="fpProgressBar"
            min="0" max="100" value="0"
            oninput="SongsScreen.seekTo(this.value)"/>
          <span class="fp-time" id="fpDuration">0:00</span>
        </div>

        <!-- Controls -->
        <div class="fp-controls">
          <button class="fp-btn-sm" onclick="SongsScreen.toggleShuffle()" id="shuffleBtn" title="Shuffle">🔀</button>
          <button class="fp-btn" onclick="SongsScreen.prevSong()">⏮</button>
          <button class="fp-play-btn" id="fpPlayBtn" onclick="SongsScreen.togglePlay()">▶</button>
          <button class="fp-btn" onclick="SongsScreen.nextSong()">⏭</button>
          <button class="fp-btn-sm" onclick="SongsScreen.toggleRepeat()" id="repeatBtn" title="Repeat">🔁</button>
        </div>

        <!-- Volume -->
        <div class="fp-volume-wrap">
          <span>🔈</span>
          <input type="range" class="fp-volume" id="fpVolume"
            min="0" max="1" step="0.05" value="1"
            oninput="SongsScreen.setVolume(this.value)"/>
          <span>🔊</span>
        </div>

        <!-- Queue -->
        <div class="fp-queue-label">▶ Now Playing Queue</div>
        <div class="fp-queue" id="fpQueue"></div>
      </div>
    `;
  }

  // ── Toggle Category ───────────────────────────────────────
  function toggleCategory(index) {
    const collapse = document.getElementById(`collapse_${index}`);
    const arrow = document.getElementById(`arrow_${index}`);

    if (expandedCategory !== null && expandedCategory !== index) {
      const prev = document.getElementById(`collapse_${expandedCategory}`);
      const prevArrow = document.getElementById(`arrow_${expandedCategory}`);
      if (prev) { prev.style.display = 'none'; prevArrow.innerHTML = '&#8250;'; }
    }

    if (collapse.style.display === 'none') {
      collapse.style.display = 'block';
      arrow.innerHTML = '&#8964;';
      expandedCategory = index;
    } else {
      collapse.style.display = 'none';
      arrow.innerHTML = '&#8250;';
      expandedCategory = null;
    }
  }

  // ── Play Song ─────────────────────────────────────────────
  function playSong(catIdx, songIdx) {
    const cat = SONG_CATEGORIES[catIdx];
    const song = cat.songs[songIdx];

    // Clear previous active
    if (currentSong) {
      const prevIcon = document.getElementById(`icon_${currentSong.id}`);
      const prevRow = document.getElementById(`songrow_${currentSong.id}`);
      if (prevIcon) prevIcon.innerHTML = '▶';
      if (prevRow) prevRow.classList.remove('song-active');
    }

    currentSong = song;
    currentCategoryIndex = catIdx;
    currentSongIndex = songIdx;

    // Mark active
    const row = document.getElementById(`songrow_${song.id}`);
    if (row) row.classList.add('song-active');
    const icon = document.getElementById(`icon_${song.id}`);
    if (icon) icon.innerHTML = '⏸';

    // Audio source — use real path if file exists, else show demo mode
    audio.src = song.audio;
    audio.load();
    audio.play().catch(() => {
      // File not found — show demo mode
      console.log('Audio file not found:', song.audio, '— Demo mode');
    });

    isPlaying = true;
    updateMiniPlayer(song, cat);
    updateFullPlayer(song, cat);
    updatePlayButtons(true);

    // Show mini player
    document.getElementById('miniPlayer').style.display = 'flex';
  }

  // ── Audio Controls ────────────────────────────────────────
  function togglePlay() {
    if (!currentSong) return;
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      updatePlayButtons(false);
      const icon = document.getElementById(`icon_${currentSong.id}`);
      if (icon) icon.innerHTML = '▶';
    } else {
      audio.play();
      isPlaying = true;
      updatePlayButtons(true);
      const icon = document.getElementById(`icon_${currentSong.id}`);
      if (icon) icon.innerHTML = '⏸';
    }
  }

  let _shuffle = false, _repeat = false;

  function nextSong() {
    if (currentCategoryIndex === null) return;
    const cat = SONG_CATEGORIES[currentCategoryIndex];
    let next = _shuffle
      ? Math.floor(Math.random() * cat.songs.length)
      : (currentSongIndex + 1) % cat.songs.length;
    playSong(currentCategoryIndex, next);
  }

  function prevSong() {
    if (currentCategoryIndex === null) return;
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    const cat = SONG_CATEGORIES[currentCategoryIndex];
    let prev = (currentSongIndex - 1 + cat.songs.length) % cat.songs.length;
    playSong(currentCategoryIndex, prev);
  }

  function seekTo(val) {
    if (audio.duration) audio.currentTime = (val / 100) * audio.duration;
  }

  function setVolume(val) {
    audio.volume = parseFloat(val);
  }

  function toggleShuffle() {
    _shuffle = !_shuffle;
    const btn = document.getElementById('shuffleBtn');
    if (btn) btn.style.opacity = _shuffle ? '1' : '0.4';
  }

  function toggleRepeat() {
    _repeat = !_repeat;
    audio.loop = _repeat;
    const btn = document.getElementById('repeatBtn');
    if (btn) btn.style.opacity = _repeat ? '1' : '0.4';
  }

  // ── Update UI ─────────────────────────────────────────────
  function updatePlayButtons(playing) {
    const miniBtn = document.getElementById('miniPlayBtn');
    const fpBtn = document.getElementById('fpPlayBtn');
    const sym = playing ? '⏸' : '▶';
    if (miniBtn) miniBtn.innerHTML = sym;
    if (fpBtn) fpBtn.innerHTML = sym;
  }

  function updateMiniPlayer(song, cat) {
    const t = document.getElementById('miniTitle');
    const s = document.getElementById('miniSub');
    if (t) t.textContent = song.title_ta;
    if (s) s.textContent = `${cat.tamil} ${cat.part > 0 ? '- ' + cat.part : ''}`;
  }

  function updateFullPlayer(song, cat) {
    const title = document.getElementById('fpTitle');
    const sub = document.getElementById('fpSubtitle');
    const catEl = document.getElementById('fpCategory');
    if (title) title.textContent = song.title_ta;
    if (sub) sub.textContent = song.title_en;
    if (catEl) catEl.textContent = `${cat.emoji} ${cat.tamil} ${cat.part > 0 ? '- ' + cat.part : ''}`;

    // Queue — show current category songs
    const queue = document.getElementById('fpQueue');
    if (queue) {
      queue.innerHTML = cat.songs.map((s, i) => `
        <div class="queue-item ${i === currentSongIndex ? 'queue-active' : ''}"
             onclick="SongsScreen.playSong(${currentCategoryIndex}, ${i})">
          <span class="queue-num">${i + 1}</span>
          <span class="queue-title">${s.title_ta}</span>
          <span class="queue-dur">${s.duration}</span>
        </div>
      `).join('');
    }
  }

  // ── Audio Events ──────────────────────────────────────────
  function setupAudioEvents() {
    audio.ontimeupdate = () => {
      const bar = document.getElementById('fpProgressBar');
      const cur = document.getElementById('fpCurrent');
      if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        if (bar) bar.value = pct;
        if (cur) cur.textContent = formatTime(audio.currentTime);
      }
    };
    audio.onloadedmetadata = () => {
      const dur = document.getElementById('fpDuration');
      if (dur) dur.textContent = formatTime(audio.duration);
    };
    audio.onended = () => {
      if (!_repeat) nextSong();
    };
    audio.onerror = () => {
      // Demo mode — simulate progress
      simulateDemoMode();
    };
  }

  function simulateDemoMode() {
    // Fake playback animation for demo when audio file not found
    let t = 0;
    clearInterval(progressTimer);
    progressTimer = setInterval(() => {
      t += 0.5;
      const bar = document.getElementById('fpProgressBar');
      const cur = document.getElementById('fpCurrent');
      const dur = document.getElementById('fpDuration');
      if (bar) bar.value = (t / 240) * 100;
      if (cur) cur.textContent = formatTime(t);
      if (dur) dur.textContent = '4:00';
      if (t >= 240) { clearInterval(progressTimer); nextSong(); }
    }, 500);
  }

  function formatTime(sec) {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // ── Full Player Open/Close ────────────────────────────────
  function openFullPlayer() {
    document.getElementById('fullPlayerOverlay').style.display = 'flex';
    if (currentSong && currentCategoryIndex !== null) {
      updateFullPlayer(currentSong, SONG_CATEGORIES[currentCategoryIndex]);
    }
  }

  function closeFullPlayer() {
    document.getElementById('fullPlayerOverlay').style.display = 'none';
  }

  // ── Search ────────────────────────────────────────────────
  function searchSongs(query) {
    const wrap = document.getElementById('songsListWrap');
    if (!query.trim()) { render(); return; }
    const q = query.toLowerCase();
    const results = [];
    SONG_CATEGORIES.forEach((cat, ci) => {
      cat.songs.forEach((song, si) => {
        if (song.title_ta.includes(query) || song.title_en.toLowerCase().includes(q)) {
          results.push({ song, catIdx: ci, songIdx: si, cat });
        }
      });
    });

    wrap.innerHTML = results.length === 0
      ? `<div class="no-results">🔍 No songs found for "${query}"</div>`
      : results.map(r =>
          `<div class="song-row search-result"
                onclick="SongsScreen.playSong(${r.catIdx}, ${r.songIdx})"
                style="--cat-color: ${r.cat.color}">
            <div class="song-num">${r.songIdx + 1}</div>
            <div class="song-info">
              <div class="song-title-ta">${r.song.title_ta}</div>
              <div class="song-title-en">${r.song.title_en} · <em>${r.cat.tamil}</em></div>
            </div>
            <span class="song-play-icon">▶</span>
          </div>`
        ).join('');
  }

  return { render, toggleCategory, playSong, togglePlay, nextSong, prevSong,
           seekTo, setVolume, toggleShuffle, toggleRepeat, openFullPlayer,
           closeFullPlayer, searchSongs };

})();
