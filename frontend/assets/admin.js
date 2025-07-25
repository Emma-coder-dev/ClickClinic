const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

console.log("Admin Panel - User:", user);
console.log("Admin Panel - Token:", token);

// ✅ Redirect if not admin
if (!token || !user || user.role !== "admin") {
  alert("Access denied.");
  window.location.href = "login.html";
}

// 🔢 Load stats
fetch("https://quickclinic-backend.onrender.com/api/admin/stats", {
  headers: { Authorization: `Bearer ${token}` }
})
  .then(res => res.json())
  .then(stats => {
    document.getElementById("totalUsers").textContent = stats.totalUsers;
    document.getElementById("totalDoctors").textContent = stats.totalDoctors;
    document.getElementById("totalPatients").textContent = stats.totalPatients;
    document.getElementById("totalBookings").textContent = stats.totalBookings;
    document.getElementById("todaysBookings").textContent = stats.todaysBookings;
  })
  .catch(err => console.error("Stats error:", err));

// 👥 Load users
fetch("https://quickclinic-backend.onrender.com/api/admin/users", {
  headers: { Authorization: `Bearer ${token}` }
})
  .then(res => res.json())
  .then(users => {
    const tbody = document.getElementById("userBody");
    tbody.innerHTML = "";

    if (!Array.isArray(users) || users.length === 0) {
      tbody.innerHTML = "<tr><td colspan='5'>No users found.</td></tr>";
      return;
    }

    users.forEach(u => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${u.name || "Unknown"}</td>
        <td>${u.email || "No email"}</td>
        <td>${u.role}</td>
        <td>
          ${u.role !== "admin" ? `<button
            class="promote-btn" onclick="promoteUser('${u._id}')">Make Admin</button>` : "-"}
        </td>
        <td>
          <button class="delete-btn" onclick="deleteUser('${u._id}')">🗑 Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  })
  .catch(err => {
    console.error("User fetch error:", err);
    document.getElementById("userBody").innerHTML =
      `<tr><td colspan="5">Failed to load users</td></tr>`;
  });

// 🔁 Promote user to admin
function promoteUser(userId) {
  if (!confirm("Promote this user to admin?")) return;

  fetch(`https://quickclinic-backend.onrender.com/api/admin/user/${userId}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ newRole: "admin" })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "User promoted.");
      location.reload();
    })
    .catch(err => {
      console.error("Promotion error:", err);
      alert("Failed to promote user.");
    });
}

// ❌ Delete user
function deleteUser(userId) {
  if (!confirm("Delete this user permanently?")) return;

  fetch(`https://quickclinic-backend.onrender.com/api/admin/user/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "User deleted.");
      location.reload();
    })
    .catch(err => {
      console.error("Delete user error:", err);
      alert("Failed to delete user.");
    });
}

// 🚪 Logout
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
