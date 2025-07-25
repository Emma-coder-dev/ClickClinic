let bookingToken = localStorage.getItem("token");
let bookingUser;

try {
  bookingUser = JSON.parse(localStorage.getItem("user"));
} catch (e) {
  bookingUser = null;
}

if (!bookingToken || !bookingUser) {
  alert("You must log in first.");
  window.location.href = "login.html";
}

const doctorSelect = document.getElementById("doctorSelect");
const bookingForm = document.getElementById("bookingForm");

// ✅ Load doctors
fetch("https://quickclinic-backend.onrender.com/api/users/doctors")
  .then(res => res.json())
  .then(doctors => {
    if (doctors.length === 0) {
      const option = document.createElement("option");
      option.textContent = "No doctors available";
      doctorSelect.appendChild(option);
      return;
    }

    doctors.forEach(doc => {
      const option = document.createElement("option");
      option.value = doc._id;
      option.textContent = doc.name;
      doctorSelect.appendChild(option);
    });
  })
  .catch(err => {
    console.error("❌ Failed to fetch doctors:", err);
    alert("Could not load doctors.");
  });

// ✅ Booking form submission
bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const doctor = doctorSelect.value;
  const date = document.getElementById("date").value;
  const reason = document.getElementById("reason").value;

  try {
    const res = await fetch("https://quickclinic-backend.onrender.com/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bookingToken}`
      },
      body: JSON.stringify({ doctor, date, reason })
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Appointment booked!");
      bookingForm.reset();
    } else {
      alert(data.error || "❌ Failed to book appointment.");
    }

  } catch (err) {
    console.error("❌ Booking error:", err);
    alert("Server error. Try again.");
  }
});
