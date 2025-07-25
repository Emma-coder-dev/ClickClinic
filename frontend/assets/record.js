// Load user
let userData = localStorage.getItem("user");
if (!userData) window.location.href = "login.html";

const user = JSON.parse(userData);

// Fake uploaded files (replace with fetch from backend later)
let uploaded = [];

document.getElementById("recordForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("file");
  const desc = document.getElementById("desc").value.trim();

  if (!fileInput.files.length) return alert("Please choose a file.");

  const file = fileInput.files[0];

  // Simulate upload
  uploaded.push({
    filename: file.name,
    description: desc,
    url: "#"
  });

  renderFiles();

  fileInput.value = '';
  document.getElementById("desc").value = '';
});

function renderFiles() {
  const list = document.getElementById("filesUl");
  list.innerHTML = '';

  if (uploaded.length === 0) {
    list.innerHTML = '<li>No files uploaded yet.</li>';
    return;
  }

  uploaded.forEach((file) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${file.filename} — <em>${file.description}</em></span>
      <a href="${file.url}" download>Download</a>
    `;
    list.appendChild(li);
  });
}
