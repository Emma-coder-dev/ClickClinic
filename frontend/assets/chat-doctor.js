const token = localStorage.getItem("token");
const userData = localStorage.getItem("user");

if (!token || !userData) {
  alert("Please log in first.");
  window.location.href = "login.html";
}

const user = JSON.parse(userData);
if (user.role !== "doctor") {
  alert("Access denied. Doctors only.");
  window.location.href = "dashboard.html";
}

const patientSelect = document.getElementById("patientSelect");
const chatWindow = document.getElementById("chatWindow");
const chatTitle = document.getElementById("chatTitle");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");

let selectedPatientId = null;

// 🔄 Fetch patients (needs /api/users/patients endpoint)
fetch("https://quickclinic-backend.onrender.com/api/users/patients", {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(patients => {
    patients.forEach(patient => {
      const option = document.createElement("option");
      option.value = patient._id;
      option.textContent = patient.name;
      patientSelect.appendChild(option);
    });
  })
  .catch(err => {
    console.error("Error loading patients:", err);
    alert("Failed to load patient list.");
  });

// 🧑‍⚕️ On patient select
patientSelect.addEventListener("change", () => {
  selectedPatientId = patientSelect.value;
  const name = patientSelect.options[patientSelect.selectedIndex].text;
  chatTitle.textContent = `Chat with ${name}`;
  if (selectedPatientId) loadMessages();
});

// 📩 Load messages
function loadMessages() {
  fetch(`https://quickclinic-backend.onrender.com/api/chat/${selectedPatientId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => renderMessages(data))
    .catch(err => {
      console.error("Error fetching messages:", err);
      chatWindow.innerHTML = `<p style="color:red;">Failed to load messages</p>`;
    });
}

// 💬 Render messages
function renderMessages(messages) {
  chatWindow.innerHTML = "";
  messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = "chat-message " + (msg.sender === user.id ? "you" : "other");
    div.textContent = msg.message;
    chatWindow.appendChild(div);
  });
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// 📤 Send reply
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = messageInput.value.trim();
  if (!message || !selectedPatientId) {
    alert("Please select a patient and type your reply.");
    return;
  }

  try {
    const res = await fetch("https://quickclinic-backend.onrender.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        receiver: selectedPatientId,
        message
      })
    });

    if (res.ok) {
      messageInput.value = "";
      loadMessages();
    } else {
      const data = await res.json();
      alert(data.error || "Failed to send reply.");
    }

  } catch (err) {
    console.error("Error sending reply:", err);
    alert("Server error.");
  }
});
