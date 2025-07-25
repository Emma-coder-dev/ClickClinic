(function() {
  // ✅ Load user from localStorage
  let userData = localStorage.getItem("user");
  if (!userData) {
    window.location.href = "login.html";
  }
  
  let user;
  try {
    user = JSON.parse(userData);
  } catch (e) {
    localStorage.clear();
    window.location.href = "login.html";
  }
  
  // ✅ Set name if element exists
  const userName = document.getElementById("userName");
  if (userName) {
    userName.textContent = user.name;
  }
  
  const userEmail = document.getElementById("userEmail");
  if (userEmail) {
    userEmail.textContent = user.email;
  }
  
  const userRole = document.getElementById("userRole");
  if (userRole) {
    userRole.textContent = user.role;
  }
  
  // ✅ Show admin link only if the element exists
  const adminLink = document.getElementById("adminLink");
  if (adminLink && user.role === "admin") {
    adminLink.style.display = "block";
  }
  
  // ✅ Logout function
  window.logout = function() {
    localStorage.clear();
    window.location.href = "login.html";
  };
  
  // Add sidebar overlay if not present
  if (!document.querySelector('.sidebar-overlay')) {
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }
  const sidebar = document.querySelector('.sidebar-fixed');
  const overlay = document.querySelector('.sidebar-overlay');
  const toggleBtn = document.querySelector('.sidebar-toggle');
  
  function openSidebar() {
    if (sidebar) sidebar.classList.add('active');
    if (overlay) overlay.classList.add('active');
  }
  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
  }
  function toggleSidebar() {
    if (sidebar.classList.contains('active')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
  
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleSidebar);
  }
  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }
  // Close sidebar when clicking a link (mobile only)
  if (sidebar) {
    sidebar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 769) closeSidebar();
      });
    });
  }
  // Optional: close sidebar on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 769) closeSidebar();
  });
  })();
  