document.addEventListener("DOMContentLoaded", () => {
  // Set page title
  const fullFileName = decodeURIComponent(window.location.pathname.split("/").pop());
  const pageName = fullFileName.split(".")[0] || "home";
  document.title = `Enigmatic Website – ${pageName}`;
  document.querySelectorAll(".page-name").forEach(el => el.textContent = pageName);

  // Dropdown click buttons
  document.querySelectorAll(".dropdown-btn").forEach(btn => {
    const arrow = btn.querySelector(".arrow");
    const content = btn.nextElementSibling;
    btn.addEventListener("click", () => {
      const isOpen = content.classList.contains("show");
      content.classList.toggle("show");
      if (arrow) arrow.textContent = isOpen ? "▼" : "▲";
    });
  });

  // Dropdown hover logic
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

  // Last modified display
  const display = document.getElementById("last-modified");
  if (display) display.textContent = `Last updated: ${document.lastModified}`;

  // Back to top button
  const mybutton = document.getElementById("myBtn");
  window.onscroll = function () {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      mybutton.classList.add("show");
    } else {
      mybutton.classList.remove("show");
    }
  };

  // Sidebar toggle
  const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
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

  // Music setup
  const musicFile = window.pageMusicFile || null;
  if (!musicFile) {
    console.warn("No music file specified for this page.");
    return;
  }

  const storageKey = `music-position-${musicFile}`;
  const audio = new Audio(`/Enigmatic Website/MEDIA/${musicFile}`);
  audio.loop = true;
  audio.volume = 0.3;

  const storedMuted = localStorage.getItem("musicMuted");
audio.muted = storedMuted !== "false";


  const savedPosition = parseFloat(localStorage.getItem(storageKey));
  if (!isNaN(savedPosition)) {
    audio.currentTime = savedPosition;
  }

  audio.play().catch(() => {
    // Wait for user interaction
  });

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

  // One-time unmute on user interaction
  function unmuteOnce() {
    if (!audio.muted) return;
    audio.muted = false;
    localStorage.setItem("musicMuted", "false");
    audio.play().catch(e => {
      console.warn("Audio still blocked:", e);
    });
  }
  document.addEventListener("click", unmuteOnce, { once: true });
  document.addEventListener("keydown", unmuteOnce, { once: true });

  // Toggle music button
  const toggleMusicBtn = document.getElementById("toggleMusicBtn");
  if (toggleMusicBtn) {
    toggleMusicBtn.textContent = audio.muted ? "🔇" : "🔊";
    toggleMusicBtn.addEventListener("click", () => {
      audio.muted = !audio.muted;
      toggleMusicBtn.textContent = audio.muted ? "🔇" : "🔊";
      localStorage.setItem("musicMuted", audio.muted);
    });
  }

  // Audio guide popup
  const dismissed = localStorage.getItem("audioGuideDismissed");
  const modal = document.getElementById("audioGuideModal");
  if (!dismissed && modal) {
    modal.style.display = "flex";
  }
  let audioStarted = false;

function startAudio() {
  if (audioStarted) return;
  audioStarted = true;

  audio.play().catch(e => {
    console.warn("Playback failed even after interaction:", e);
  });
}

document.addEventListener("click", startAudio, { once: true });
document.addEventListener("keydown", startAudio, { once: true });

const darkModeBtn = document.getElementById("toggleDarkModeBtn");
const content = document.querySelector(".content");

if (localStorage.getItem("contentDarkMode") === "true") {
  content?.classList.add("dark-mode");
}

if (darkModeBtn && content) {
  darkModeBtn.textContent = content.classList.contains("dark-mode") ? "🌙" : "☀️";

  darkModeBtn.addEventListener("click", () => {
    content.classList.toggle("dark-mode");
    const isDark = content.classList.contains("dark-mode");
    localStorage.setItem("contentDarkMode", isDark);
    darkModeBtn.textContent = isDark ? "🌙" : "☀️";
  });
}


});

// Audio guide close logic
function dismissAudioGuide(dontAskAgain) {
  const modal = document.getElementById("audioGuideModal");
  if (modal) modal.style.display = "none";
  if (dontAskAgain) {
    localStorage.setItem("audioGuideDismissed", "true");
  }
}

// Scroll to top
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
