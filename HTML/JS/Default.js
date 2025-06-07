document.addEventListener("DOMContentLoaded", () => {
  const fullFileName = decodeURIComponent(window.location.pathname.split("/").pop());
  const pageName = fullFileName.split(".")[0] || "home";

  document.title = `Enigmatic Website – ${pageName}`;

  document.querySelectorAll(".page-name").forEach(el => {
    el.textContent = pageName;
  });

  document.querySelectorAll(".dropdown-btn").forEach(btn => {
    const arrow = btn.querySelector(".arrow");
    const content = btn.nextElementSibling;
    btn.addEventListener("click", () => {
      const isOpen = content.style.display === "block";
      content.style.display = isOpen ? "none" : "block";
      if (arrow) arrow.textContent = isOpen ? "▼" : "▲";
    });
  });
});
const toggleBtn = document.getElementById('toggleSidebarBtn');
  const sidebar = document.querySelector('.sidebar');

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
  });
