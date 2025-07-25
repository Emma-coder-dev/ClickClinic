if (!window.chatInitialized) {
  window.chatInitialized = true;

  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");
  if (!token || !userData) {
    alert("Please log in first.");
    window.location.href = "login.html";
  }

  const user = JSON.parse(userData);

  // 🚫 Redirect doctors to chat-doctor.html
if (user.role === "doctor") {
  alert("You are a doctor. Redirecting to doctor chat...");
  window.location.href = "chat-doctor.html";
}

  const doctorSelect = document.getElementById("doctorSelect");
  const chatWindow = document.getElementById("chatWindow");
  const chatTitle = document.getElementById("chatTitle");
  const chatForm = document.getElementById("chatForm");
  const messageInput = document.getElementById("messageInput");

  let selectedDoctorId = null;

  // ✅ Fetch doctors
  fetch("https://quickclinic-backend.onrender.com/api/users/doctors")
    .then(res => res.json())
    .then(doctors => {
      doctors.forEach(doc => {
        const option = document.createElement("option");
        option.value = doc._id;
        option.textContent = doc.name;
        doctorSelect.appendChild(option);
      });
    })
    .catch(err => {
      console.error("Failed to load doctors:", err);
      alert("Error loading doctors.");
    });

  // 🔄 When doctor is selected
  doctorSelect.addEventListener("change", () => {
    selectedDoctorId = doctorSelect.value;
    const doctorName = doctorSelect.options[doctorSelect.selectedIndex].text;
    chatTitle.textContent = `Chat with ${doctorName}`;
    if (selectedDoctorId) loadMessages();
  });

  // 📨 Load chat history
  function loadMessages() {
    fetch(`https://quickclinic-backend.onrender.com/api/chat/${selectedDoctorId}`, {
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

  // 📤 Send message
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = messageInput.value.trim();
    if (!message || !selectedDoctorId) {
      alert("Please select a doctor and type your message.");
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
          receiver: selectedDoctorId,
          message
        })
      });

      if (res.ok) {
        messageInput.value = "";
        loadMessages(); // ✅ refresh chat
      } else {
        const data = await res.json();
        alert(data.error || "❌ Message failed to send.");
      }

    } catch (err) {
      console.error("Failed to send message:", err);
      alert("❌ Server error. Try again later.");
    }
  });
}
