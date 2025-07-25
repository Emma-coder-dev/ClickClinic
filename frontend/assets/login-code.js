const sendCodeForm = document.getElementById("sendCodeForm");
const loginCodeForm = document.getElementById("loginCodeForm");

const emailInput = document.getElementById("email");
const codeInput = document.getElementById("code");

sendCodeForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();

  try {
    const res = await fetch("https://quickclinic-backend.onrender.com/api/users/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Code sent! Check your email.");
      sendCodeForm.style.display = "none";
      loginCodeForm.style.display = "block";
    } else {
      alert(data.error || "Failed to send code");
    }
  } catch (err) {
    alert("Server error. Try again.");
  }
});

loginCodeForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const code = codeInput.value.trim();

  try {
    const res = await fetch("https://quickclinic-backend.onrender.com/api/users/login-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);

      alert("Login successful!");
      window.location.href = "dashboard.html";
    } else {
      alert(data.error || "Invalid code");
    }
  } catch (err) {
    alert("Login failed.");
  }
});
