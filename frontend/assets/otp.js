document.getElementById('otpForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const code = document.getElementById('code').value.trim();

  try {
    const res = await fetch('https://quickclinic-backend.onrender.com/api/auth/login-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('Login successful!');

      // Redirect based on role
      if (data.user.role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'dashboard.html';
      }

    } else {
      alert(data.error || 'Invalid code.');
    }

  } catch (err) {
    alert('Server error. Please try again later.');
  }
});
