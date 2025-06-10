document.addEventListener("DOMContentLoaded", () => {
  // --- Title and Page Name ---
  const fullFileName = decodeURIComponent(window.location.pathname.split("/").pop()); 
  const pageName = fullFileName.split(".")[0] || "home";
  document.title = `Enigmatic Website – ${pageName}`;
  document.querySelectorAll(".page-name").forEach(el => el.textContent = pageName);

  // --- Dropdown Click ---
  document.querySelectorAll(".dropdown-btn").forEach(btn => {
    const arrow = btn.querySelector(".arrow");
    const content = btn.nextElementSibling;
    btn.addEventListener("click", () => {
      const isOpen = content.classList.contains("show");
      content.classList.toggle("show");
      if (arrow) arrow.textContent = isOpen ? "▼" : "▲";
    });
  });

  // --- Dropdown Hover ---
  const sidebar = document.querySelector(".sidebar");
  document.querySelectorAll(".dropdown-h").forEach(dropdownH => {
    const contentH = dropdownH.querySelector(".dropdown-content");
    const btnH = dropdownH.querySelector(".dropdown-btn-h");
    const originalTextH = btnH ? btnH.textContent.replace(/[▲▼]$/, '').trim() : '';
    if (btnH) btnH.textContent = originalTextH + " ▼";

    dropdownH.addEventListener("mouseenter", () => {
      if (contentH) {
        contentH.classList.add("show");
        if (btnH) btnH.textContent = originalTextH + " ▲";
      }
    });

    if (sidebar) {
      sidebar.addEventListener("mouseleave", () => {
        if (contentH) contentH.classList.remove("show");
        if (btnH) btnH.textContent = originalTextH + " ▼";
      });
    }
  });

  // --- Last Modified Display ---
  const display = document.getElementById("last-modified");
  if (display) display.textContent = `Last updated: ${document.lastModified}`;

  // --- Back to Top Button ---
  const mybutton = document.getElementById("myBtn");
  window.onscroll = () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      mybutton?.classList.add("show");
    } else {
      mybutton?.classList.remove("show");
    }
  };

  // --- Sidebar Toggle ---
  const toggleSidebarBtn = document.getElementById("toggleSidebarBtn");
  const headerText = document.querySelector('.header h2');
  const footerText = document.querySelector('.footer *');
  if (toggleSidebarBtn && sidebar) {
    toggleSidebarBtn.addEventListener('click', () => {
      const sidebarIsHidden = sidebar.classList.toggle('hidden');
      document.body.classList.toggle('sidebar-hidden');
      [headerText, footerText].forEach(el => {
        if (!el) return;
        el.classList.remove('animate-indent', 'animate-indent-back');
        void el.offsetWidth;
        el.classList.add(sidebarIsHidden ? 'animate-indent-back' : 'animate-indent');
      });
    });
  }

  // --- Music Setup ---
  const musicFile = window.pageMusicFile || null;
  if (!musicFile) {
    console.warn("No music file specified for this page.");
    return;
  }

  const audio = new Audio(`../../Enigmatic-Website/MEDIA/${musicFile}`);
  const toggleMusicBtn = document.getElementById("toggleMusicBtn");
  const storageKey = `audioPos:${pageName}`;
  let isMuted = localStorage.getItem("musicMuted") === "true";

  audio.loop = true;
  audio.volume = isMuted ? 0 : 0.3;
  audio.muted = false;

  const savedPosition = parseFloat(localStorage.getItem(storageKey));
  if (!isNaN(savedPosition)) {
    audio.currentTime = savedPosition;
  }

  if (!isMuted) {
    audio.play().catch(() => {});
  }

  audio.addEventListener("timeupdate", () => {
    const now = Date.now();
    if (!audio._lastSaved || now - audio._lastSaved > 1000) {
      localStorage.setItem(storageKey, audio.currentTime);
      audio._lastSaved = now;
    }
  });

  window.addEventListener("beforeunload", () => {
    localStorage.setItem(storageKey, audio.currentTime);
  });

  // --- Music Toggle Button ---
  function fadeVolume(targetVolume, duration = 400, onComplete) {
    const stepTime = 50;
    const steps = duration / stepTime;
    const volumeDiff = targetVolume - audio.volume;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      currentStep++;
      audio.volume = Math.max(0, Math.min(1, audio.volume + volumeDiff / steps));
      if (currentStep >= steps) {
        clearInterval(fadeInterval);
        audio.volume = targetVolume;
        if (onComplete) onComplete();
      }
    }, stepTime);
  }

  if (toggleMusicBtn) {
    toggleMusicBtn.textContent = isMuted ? "🔇" : "🔊";
    toggleMusicBtn.addEventListener("click", () => {
      isMuted = !isMuted;
      localStorage.setItem("musicMuted", isMuted);
      toggleMusicBtn.textContent = isMuted ? "🔇" : "🔊";

      if (isMuted) {
        fadeVolume(0, 400, () => audio.pause());
      } else {
        audio.play().then(() => fadeVolume(0.3));
      }
    });
  }

  // --- Audio Guide Modal ---
  const modal = document.getElementById("audioGuideModal");
  if (!localStorage.getItem("audioGuideDismissed") && modal) {
    modal.style.display = "flex";
  }

  let audioStarted = false;
  function startAudio() {
    if (audioStarted || isMuted) return;
    audioStarted = true;
    audio.play().catch(e => console.warn("Playback failed after interaction:", e));
  }
  document.addEventListener("click", startAudio, { once: true });
  document.addEventListener("keydown", startAudio, { once: true });

  // --- Dark Mode ---
  const darkModeBtn = document.getElementById("toggleDarkModeBtn");
  const content = document.querySelector(".content");
  const bg = document.querySelector(".background");

  function applyDarkMode(isDark) {
    content?.classList.toggle("dark-mode", isDark);
    bg?.classList.toggle("dark-mode", isDark);
    localStorage.setItem("contentDarkMode", isDark);
    if (darkModeBtn) darkModeBtn.textContent = isDark ? "🌙" : "☀️";
  }

  const isDarkInitial = localStorage.getItem("contentDarkMode") === "true";
  applyDarkMode(isDarkInitial);

  if (darkModeBtn) {
    darkModeBtn.addEventListener("click", () => {
      applyDarkMode(!content?.classList.contains("dark-mode"));
    });
  }
  w
};
});

// --- Audio Guide Dismiss ---
function dismissAudioGuide(dontAskAgain) {
  const modal = document.getElementById("audioGuideModal");
  if (modal) modal.style.display = "none";
  if (dontAskAgain) {
    localStorage.setItem("audioGuideDismissed", "true");
  }
}

// --- Scroll to Top ---
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
indow.onload = function() {
  
  var file = audio
  
  Visualizer.prototype.draw = function() {

    var r = this.radius,
        t = this.barWidth * this.barScale * Math.PI / 180,
        s = 0;

    analyser.getByteFrequencyData(frequencyData);

    for (var i = 0; i < 15; i++) {
        s += frequencyData[i] / 255;
    }
    s /= 15;
    r += s * r * 2;
    s = (s > 1 / 3) ? ((s < 2 / 5) ? s : 2 / 5) : 1 / 3;

    canvasCtx.clearRect(-150 - r, -150 - r, 300 + r * 2, 300 + r * 2);
    canvasCtx.save();
    for (var i = 0; i < bufferLength; i++) {

        var h = frequencyData[i];

        var red = parseInt(h + 100 + i / 15);
        var green = parseInt(h);
        var blue = 0;
        var grad = canvasCtx.createLinearGradient(0, r, 0, r + h * s * this.freqScale);
        grad.addColorStop(0.00, 'rgba(' + red + ',' + green + ',' + blue + ',0)');
        grad.addColorStop(0.15, 'rgba(' + red + ',' + green + ',' + blue + ',1)');
        grad.addColorStop(0.75, 'rgba(' + red + ',' + green + ',' + blue + ',1)');
        grad.addColorStop(1.00, 'rgba(0,0,0,0)');
        canvasCtx.fillStyle = grad;

        canvasCtx.fillRect(0, r, this.barWidth * 5, h * s * this.freqScale + r);

        canvasCtx.transform(-Math.cos(t), -Math.sin(t), Math.sin(t), -Math.cos(t), 0, 0);
    }
    canvasCtx.restore();
    canvasCtx.rotate(s * this.rotation * Math.PI / 180);
}

function createAudio() {
    audio = document.querySelector('audio');
    audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    source = audioCtx.createMediaElementSource(audio);
    compressor = audioCtx.createDynamicsCompressor();
    analyser = audioCtx.createAnalyser();
    bufferLength = analyser.frequencyBinCount;
    frequencyData = new Uint8Array(bufferLength);
    
    source.connect(analyser);
    
    analyser.getByteTimeDomainData(frequencyData);
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.83;
    analyser.minDecibels = -90;
    analyser.maxDecibels = 0;
    audio.volume = 0.3;
    analyser.connect(audioCtx.destination);
}

function createGui() {
    gui = new dat.GUI();
    gui.remember(visual);
    var gen = gui.addFolder('General');
    var freq = gui.addFolder('Frequency scaling');
    gen.add(visual, 'radius').min(10).max(200).step(5);
    gen.add(visual, 'barWidth').min(0.1).max(5).step(0.1);
    gen.add(visual, 'barScale').min(0.1).max(10).step(0.1);
    gen.add(visual, 'rotation').min(-10).max(10).step(0.1);
    freq.add(visual, 'freqScale').min(1).max(10).step(0.1);
    gen.open();
    freq.open();
}

function createCanvas() {
    canvas = document.getElementById('canvas');
    canvasCtx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasCtx.translate((canvas.width / 2), (canvas.height / 2));
    visual = new Visualizer();
}

function createStats() {
    stats = new Stats();
    stats.setMode(0);
    document.body.appendChild(stats.domElement);
}

function createFile() {
    document.querySelector('#file-input').onchange = function(e) {
        var file = e.target.files[0];
        var url = URL.createObjectURL(file);
        audio.src = url;
        audio.play();
    }
}

function update() {
    requestAnimationFrame(update);
    visual.draw();
    stats.update();
};

function init() {
    createAudio();
    createCanvas();
    createFile();
    update();
}

window.onload = init();