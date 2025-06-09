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
  function fadeVolume(targetVolume, duration = 100, onComplete) {
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
        fadeVolume(0, 100, () => audio.pause());
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
 

// Resume AudioContext on user interaction
document.addEventListener("click", () => {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}, { once: true });

function createCircularVisualizer({ elementId, audio, barCount = 64, intensity = 1 }) {
  const container = document.getElementById(elementId);
  if (!container) {
    console.warn(`Element with id '${elementId}' not found`);
    return;
  }

  // Create canvas inside container
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  container.innerHTML = ''; // Clear container
  container.appendChild(canvas);

  // Set canvas size to container size
  const resize = () => {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  // Setup Web Audio API analyser
  const audioCtx = audio.context || new AudioContext();
  let source;
  if (audio instanceof AudioNode) {
    source = audio;
  } else if (audio instanceof HTMLAudioElement) {
    source = audioCtx.createMediaElementSource(audio);
  } else {
    console.error('Unsupported audio input');
    return;
  }
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function draw() {
    requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) * 0.6;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(centerX, centerY);

    const sliceAngle = (Math.PI * 2) / barCount;

    for (let i = 0; i < barCount; i++) {
      const freqIndex = Math.floor((i / barCount) * bufferLength);
      const value = dataArray[freqIndex];
      const barHeight = value * intensity;

      const angle = sliceAngle * i;

      // Calculate bar start and end points
      const xStart = Math.cos(angle) * radius;
      const yStart = Math.sin(angle) * radius;

      const xEnd = Math.cos(angle) * (radius + barHeight);
      const yEnd = Math.sin(angle) * (radius + barHeight);

      // Draw bar line
      ctx.strokeStyle = `hsl(${(i / barCount) * 360}, 100%, 50%)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xStart, yStart);
      ctx.lineTo(xEnd, yEnd);
      ctx.stroke();
    }

    ctx.restore();
  }

  draw();
}

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
