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
  audio.loop = true;
  audio.volume = localStorage.getItem("musicMuted") === "true" ? 0 : 0.3;

  // Create AudioContext and source here (once)
  const audioCtx = new AudioContext();
  const sourceNode = audioCtx.createMediaElementSource(audio);

  // Setup analyser node outside visualizer function
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  sourceNode.connect(analyser);
  analyser.connect(audioCtx.destination);

  // Play audio (handle saved position etc.) as before
  // ...

  // Resume audio context on user interaction
  document.addEventListener("click", () => {
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }, { once: true });

  // Now call your visualizer function, passing analyser and audioCtx
  createCircularVisualizer({
    elementId: 'music-visualizer',
    analyser: analyser,
    barCount: 64,
    intensity: 2,
  });

  // Modified visualizer function (use passed analyser):
  function createCircularVisualizer({ elementId, analyser, barCount = 64, intensity = 1 }) {
    const container = document.getElementById(elementId);
    if (!container) {
      console.warn(`Element with id '${elementId}' not found`);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    container.innerHTML = '';
    container.appendChild(canvas);

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

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

        const xStart = Math.cos(angle) * radius;
        const yStart = Math.sin(angle) * radius;

        const xEnd = Math.cos(angle) * (radius + barHeight);
        const yEnd = Math.sin(angle) * (radius + barHeight);

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
