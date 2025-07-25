document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm').value;
  const role = document.getElementById('role').value;

  // Validate fields
  if (!name || !email || !password || !confirm || !role) {
    alert("Please fill in all fields.");
    return;
  }

  if (password !== confirm) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const res = await fetch('https://quickclinic-backend.onrender.com/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });

    const data = await res.json();

    if (res.ok) {
      // Optional: Save token if returned
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('role', data.user.role);

      alert('Registration successful!');
      window.location.href = 'dashboard.html'; // Or login.html if preferred
    } else {
      alert(data.message || data.error || 'Registration failed.');
    }

  } catch (err) {
    console.error("Error:", err);
    alert('Server error. Please try again later.');
  }
});
